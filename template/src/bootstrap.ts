import { Strapi } from '@strapi/strapi';
import { homepage } from '../data/data.json';

// Seeds:
const importHomepage = async (strapi: Strapi): Promise<void> => {
  createEntry(strapi, 'homepage', homepage);
};

const importSeedData = async (strapi: Strapi): Promise<void> => {
  await setPublicPermissions(strapi, {
    homepage: ['find', 'findOne'],
  });

  importHomepage(strapi);
};

// Helpers:
const createEntry = async (strapi: Strapi, model: string, entry: object): Promise<void> => {
  try {
    await strapi.entityService.create(`api::${model}.${model}`, {
      data: entry,
    });
  } catch (error) {
    console.error({ model, entry, error });
  }
};

const setPublicPermissions = async (
  strapi: Strapi,
  permissions: { [key: string]: [string, string] }
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
          action: `api::${controller}.${controller}.${action}`,
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
