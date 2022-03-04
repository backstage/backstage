/*
 * Copyright 2020 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import fs from 'fs-extra';
import { paths } from '../lib/paths';
import { join as joinPath } from 'path';

const SKIPPED_KEYS = ['access', 'registry', 'tag', 'alphaTypes', 'betaTypes'];

const PKG_PATH = 'package.json';
const PKG_BACKUP_PATH = 'package.json-prepack';

function resolveEntrypoint(pkg: any, name: string) {
  const targetEntry = pkg.publishConfig[name] || pkg[name];
  return targetEntry && joinPath('..', targetEntry);
}

// Writes e.g. alpha/package.json
async function writeReleaseStageEntrypoint(pkg: any, stage: 'alpha' | 'beta') {
  await fs.ensureDir(paths.resolveTarget(stage));
  await fs.writeJson(
    paths.resolveTarget(stage, PKG_PATH),
    {
      name: pkg.name,
      version: pkg.version,
      main: resolveEntrypoint(pkg, 'main'),
      module: resolveEntrypoint(pkg, 'module'),
      browser: resolveEntrypoint(pkg, 'browser'),
      types: joinPath('..', pkg.publishConfig[`${stage}Types`]),
    },
    { encoding: 'utf8', spaces: 2 },
  );
}

export const pre = async () => {
  const pkgPath = paths.resolveTarget(PKG_PATH);

  const pkgContent = await fs.readFile(pkgPath, 'utf8');
  const pkg = JSON.parse(pkgContent);
  await fs.writeFile(PKG_BACKUP_PATH, pkgContent);

  const publishConfig = pkg.publishConfig ?? {};
  for (const key of Object.keys(publishConfig)) {
    if (!SKIPPED_KEYS.includes(key)) {
      pkg[key] = publishConfig[key];
    }
  }
  await fs.writeJson(pkgPath, pkg, { encoding: 'utf8', spaces: 2 });

  if (publishConfig.alphaTypes) {
    await writeReleaseStageEntrypoint(pkg, 'alpha');
  }
  if (publishConfig.betaTypes) {
    await writeReleaseStageEntrypoint(pkg, 'beta');
  }
};

export const post = async () => {
  // postpack isn't called by yarn right now, so it needs to be called manually
  try {
    await fs.move(PKG_BACKUP_PATH, PKG_PATH, { overwrite: true });

    // Check if we're shipping types for other release stages, clean up in that case
    const pkg = await fs.readJson(PKG_PATH);
    if (pkg.publishConfig?.alphaTypes) {
      await fs.remove(paths.resolveTarget('alpha'));
    }
    if (pkg.publishConfig?.betaTypes) {
      await fs.remove(paths.resolveTarget('beta'));
    }
  } catch (error) {
    console.warn(
      `Failed to restore package.json during postpack, ${error}. ` +
        'Your package will be fine but you may have ended up with some garbage in the repo.',
    );
  }
};
