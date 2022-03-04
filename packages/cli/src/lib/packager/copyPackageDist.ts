/*
 * Copyright 2022 The Backstage Authors
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
import npmPackList from 'npm-packlist';
import { join as joinPath, resolve as resolvePath } from 'path';

const SKIPPED_KEYS = ['access', 'registry', 'tag', 'alphaTypes', 'betaTypes'];

function resolveEntrypoint(pkg: any, name: string) {
  const targetEntry = pkg.publishConfig[name] || pkg[name];
  return targetEntry && joinPath('..', targetEntry);
}

// Writes e.g. alpha/package.json
async function writeReleaseStageEntrypoint(
  pkg: any,
  stage: 'alpha' | 'beta',
  targetDir: string,
) {
  await fs.ensureDir(resolvePath(targetDir, stage));
  await fs.writeJson(
    resolvePath(targetDir, stage, 'package.json'),
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

export async function copyPackageDist(packageDir: string, targetDir: string) {
  const pkgPath = resolvePath(packageDir, 'package.json');
  const pkgContent = await fs.readFile(pkgPath, 'utf8');
  const pkg = JSON.parse(pkgContent);

  const publishConfig = pkg.publishConfig ?? {};
  for (const key of Object.keys(publishConfig)) {
    if (!SKIPPED_KEYS.includes(key)) {
      pkg[key] = publishConfig[key];
    }
  }

  // We remove the dependencies from package.json of packages that are marked
  // as bundled, so that yarn doesn't try to install them.
  if (pkg.bundled) {
    delete pkg.dependencies;
    delete pkg.devDependencies;
    delete pkg.peerDependencies;
    delete pkg.optionalDependencies;
  }

  // Write the modified package.json so that the file listing is correct
  await fs.writeJson(pkgPath, pkg, { encoding: 'utf8', spaces: 2 });

  // Lists all dist files, respecting .npmignore, files field in package.json, etc.
  const filePaths = await npmPackList({ path: packageDir });

  await fs.ensureDir(targetDir);
  for (const filePath of filePaths.sort()) {
    await fs.copy(
      resolvePath(packageDir, filePath),
      resolvePath(targetDir, filePath),
    );
  }

  if (publishConfig.alphaTypes) {
    await writeReleaseStageEntrypoint(pkg, 'alpha', targetDir);
  }
  if (publishConfig.betaTypes) {
    await writeReleaseStageEntrypoint(pkg, 'beta', targetDir);
  }

  // Restore package.json
  await fs.writeFile(pkgPath, pkgContent, 'utf8');
}
