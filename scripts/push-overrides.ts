#!/usr/bin/env tsx

import prompts from 'prompts';
import simpleGit from 'simple-git';
import fs from 'fs-extra';
import path from 'path';
import open from 'open';

const OVERRIDES_REPO = 'git@github.com:ef2-digital/strapi-admin-overrides.git';
const TEMP_DIR = '.tmp/strapi-admin-overrides';
const DIST_SOURCES: Record<string, { source: string; target: string }> = {
  admin: { source: 'packages/core/admin/dist', target: 'admin' },
  'content-manager': { source: 'packages/core/content-manager/dist', target: 'content-manager' },
  'plugin-upload-aws-s3': {
    source: 'packages/providers/upload-aws-s3/dist',
    target: 'provider-upload-aws-s3',
  },
  'plugin-users-permissions': {
    source: 'packages/plugins/users-permissions/dist',
    target: 'plugin-users-permissions',
  },
  'plugin-media-library': { source: 'packages/core/media-library/dist', target: 'media-library' },
};

(async () => {
  const { folders } = await prompts({
    type: 'multiselect',
    name: 'folders',
    message: 'Which dist folders do you want to push?',
    choices: Object.keys(DIST_SOURCES).map((key) => ({ title: key, value: key })),
  });

  if (!folders.length) {
    console.log('❌ No folders selected. Exiting.');
    process.exit(1);
  }

  console.log('📁 Cleaning previous temp clone');
  await fs.remove(TEMP_DIR);

  console.log(`📥 Cloning overrides repo into ${TEMP_DIR}`);
  const git = simpleGit();
  await git.clone(OVERRIDES_REPO, TEMP_DIR);

  const repo = simpleGit(TEMP_DIR);

  await repo.fetch();
  await repo.checkout('main');
  await repo.pull('origin', 'main');

  for (const folder of folders) {
    const { source, target } = DIST_SOURCES[folder];
    const src = path.resolve(source);
    const dest = path.join(TEMP_DIR, target, 'dist');
    console.log(`📦 Copying ${folder} (${target}/dist) to overrides repo`);
    await fs.remove(dest);
    await fs.ensureDir(path.dirname(dest));
    await fs.copy(src, dest);
  }

  await repo.add('.');
  await repo.commit(`feat: overrides for ${folders.join(', ')}`);
  await repo.push('origin', 'main');

  console.log('✅ Done.');
})();
