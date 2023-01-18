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
import { resolve as resolvePath } from 'path';
import { ExtendedPackageJSON, PackageGraph } from '../../lib/monorepo';

function trimRelative(path: string): string {
  if (path.startsWith('./')) {
    return path.slice(2);
  }
  return path;
}

export async function command() {
  const packages = await PackageGraph.listTargetPackages();

  await Promise.all(
    packages.map(async ({ dir, packageJson }) => {
      let changed = false;
      let newPackageJson = packageJson;

      let { exports: exp } = newPackageJson;
      if (!exp) {
        return;
      }
      if (Array.isArray(exp)) {
        throw new Error('Unexpected array in package.json exports field');
      }

      // If exports is a string we rewrite it to an object to add package.json
      if (typeof exp === 'string') {
        changed = true;
        exp = { '.': exp };
        newPackageJson.exports = exp;
      } else if (typeof exp !== 'object') {
        return;
      }

      if (!exp['./package.json']) {
        changed = true;
        exp['./package.json'] = './package.json';
      }

      const existingTypesVersions = JSON.stringify(packageJson.typesVersions);

      const typeEntries: Record<string, [string]> = {};
      for (const [path, value] of Object.entries(exp)) {
        const newPath = path === '.' ? '*' : trimRelative(path);

        if (typeof value === 'string') {
          typeEntries[newPath] = [trimRelative(value)];
        } else if (
          value &&
          typeof value === 'object' &&
          !Array.isArray(value)
        ) {
          if (typeof value.types === 'string') {
            typeEntries[newPath] = [trimRelative(value.types)];
          } else if (typeof value.default === 'string') {
            typeEntries[newPath] = [trimRelative(value.default)];
          }
        }
      }

      const typesVersions = { '*': typeEntries };
      if (existingTypesVersions !== JSON.stringify(typesVersions)) {
        console.log(`Synchronizing exports in ${packageJson.name}`);
        const newPkgEntries = Object.entries(newPackageJson).filter(
          ([name]) => name !== 'typesVersions',
        );
        newPkgEntries.splice(
          newPkgEntries.findIndex(([name]) => name === 'exports') + 1,
          0,
          ['typesVersions', typesVersions],
        );

        newPackageJson = Object.fromEntries(
          newPkgEntries,
        ) as ExtendedPackageJSON;
        changed = true;
      }

      // Remove the legacy fields from publishConfig, which are no longer needed
      const publishConfig = newPackageJson.publishConfig as
        | Record<string, string>
        | undefined;
      if (publishConfig) {
        for (const field of ['main', 'module', 'browser', 'types']) {
          if (publishConfig[field]) {
            delete publishConfig[field];
            changed = true;
          }
        }
      }

      if (changed) {
        await fs.writeJson(resolvePath(dir, 'package.json'), newPackageJson, {
          spaces: 2,
        });
      }
    }),
  );
}
