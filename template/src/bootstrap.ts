import { Strapi } from '@strapi/strapi';
import { homepage } from '../data/data.json';
import { pages } from '../data/data.json';
import path from 'path';
import mime from 'mime-types';
import fs from 'fs-extra';

// Seeds:
const importHomepage = async (strapi: Strapi): Promise<void> => {
  if (await existCollection(strapi, 'homepage')) {
    return;
  }

  const content = await updateContent(strapi, homepage.content);
  createEntry(strapi, 'homepage', { ...homepage, content });
};

const importPages = async (strapi: Strapi): Promise<void> => {
  if (await existCollection(strapi, 'page')) {
    return;
  }

  pages.forEach(async (page) => {
    const content = await updateContent(strapi, page.content);
    createEntry(strapi, 'page', { ...page, content });
  });
};

const importSeedData = async (strapi: Strapi): Promise<void> => {
  await setPublicPermissions(strapi, {
    'homepage.homepage': ['find'],
    'page.page': ['find', 'findOne'],
  });

  await setPublicPermissions(
    strapi,
    {
      'slugify.slugController': ['findSlug'],
      'navigation.client': ['render', 'renderChild'],
    },
    'plugin'
  );

  importHomepage(strapi);
  importPages(strapi);
};

interface Content {
  __component: string | 'content.image-texts' | 'content.image-text';
  [key: string]: any;
}

// Helpers:
const updateContent = async (strapi: Strapi, content: Content[]): Promise<Content[]> => {
  return await content.reduce(async (a: Promise<Content[]>, c: Content) => {
    if (c.__component === 'content.image-texts') {
      const copy = { ...c };
      copy.images = await Promise.all(
        [...copy.images].map(async (image) => ({
          ...image,
          image: await uploadFiles(strapi, [image.image]),
        }))
      );

      console.log({ cpimage: copy.images });

      return [...(await a), copy];
    } else {
      return [...(await a), c];
    }
  }, Promise.resolve([]));
};

const existCollection = async (strapi: Strapi, model: string): Promise<boolean> => {
  const collection = await strapi.entityService.findMany(`api::${model}.${model}`);
  return Array.isArray(collection) ? Boolean(collection.length > 0) : Boolean(collection);
};

const createEntry = (strapi: Strapi, model: string, entry: object): void => {
  strapi.entityService
    .create(`api::${model}.${model}`, { data: entry })
    .catch((error) => console.error({ model, entry, error }));
};

const getFileSizeInBytes = (filePath: string) => {
  const stats = fs.statSync(filePath);
  const fileSizeInBytes = stats['size'];
  return fileSizeInBytes;
};

interface FileData {
  path: string;
  name: string;
  size: number;
  type: string | false;
}

const getFileData = (name: string): FileData => {
  const filePath = path.join('data', 'uploads', name);

  // Parse the file metadata
  const size = getFileSizeInBytes(filePath);
  const ext = name.split('.').pop()!;
  const type = mime.lookup(ext);

  return {
    path: filePath,
    name,
    size,
    type,
  };
};

const uploadFiles = async (strapi: Strapi, files: string[]): Promise<any> => {
  const uploadedFiles = await Promise.all(
    files.map(async (fileName) => {
      const fileWhereName = await strapi.query('plugin::upload.file').findOne({
        where: {
          name: fileName,
        },
      });

      if (fileWhereName) {
        return fileWhereName;
      }

      const fileData = getFileData(fileName);
      const fileNameNoExtension = fileName.split('.').shift();
      const [file] = await uploadFile(strapi, fileData, fileNameNoExtension!);

      return file;
    })
  );

  return uploadedFiles.length === 1 ? uploadedFiles[0] : uploadedFiles;
};

const uploadFile = async (strapi: Strapi, file: FileData, name: string): Promise<any> => {
  return strapi
    .plugin('upload')
    .service('upload')
    .upload({
      files: file,
      data: {
        fileInfo: {
          alternativeText: '',
          caption: name,
          name,
        },
      },
    });
};

const setPublicPermissions = async (
  strapi: Strapi,
  permissions: { [key: string]: string[] },
  type: string = 'api'
): Promise<void> => {
  // Find the ID of the public role
  const publicRole = await strapi
    .query('plugin::users-permissions.role')
    .findOne({ where: { type: 'public' } });

  // Create the new permissions and link them to the public role
  const allPermissionsToCreate: Promise<any>[] = [];
  Object.keys(permissions).map((controller) => {
    const actions = permissions[controller];
    const permissionsToCreate = actions.map((action) => {
      return strapi.query('plugin::users-permissions.permission').create({
        data: {
          action: `${type}::${controller}.${action}`,
          role: publicRole.id,
        },
      });
    });
    allPermissionsToCreate.push(...permissionsToCreate);
  });
  await Promise.all(allPermissionsToCreate);
};

const isFirstRun = async (strapi: Strapi): Promise<boolean> => {
  const pluginStore = strapi.store({
    environment: strapi.config.environment,
    type: 'type',
    name: 'setup',
  });

  const initHasRun = await pluginStore.get({ key: 'initHasRun' });
  await pluginStore.set({ key: 'initHasRun', value: true });
  return !initHasRun;
};

export default async ({ strapi }: { strapi: Strapi }) => {
  const shouldImportSeedData = await isFirstRun(strapi);

  if (shouldImportSeedData) {
    try {
      console.log('Setting up the template...');
      await importSeedData(strapi);
      console.log('Ready to go');
    } catch (error) {
      console.log('Could not import seed data');
      console.error(error);
    }
  }
};
