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
import { PackageGraph, PackageRoles } from '@backstage/cli-node';

const REACT_ROUTER_DEPS = ['react-router', 'react-router-dom'];
const REACT_ROUTER_RANGE = '6.0.0-beta.0 || ^6.3.0';

export async function command() {
  const packages = await PackageGraph.listTargetPackages();

  await Promise.all(
    packages.map(async ({ dir, packageJson }) => {
      const role = PackageRoles.getRoleFromPackage(packageJson);
      if (role === 'frontend') {
        console.log(`Skipping ${packageJson.name}`);
        return;
      }

      let changed = false;
      for (const depName of ['dependencies', 'devDependencies'] as const) {
        const depsCollection = packageJson[depName];
        if (depsCollection) {
          for (const key of Object.keys(depsCollection)) {
            if (REACT_ROUTER_DEPS.includes(key)) {
              delete depsCollection[key];
              const peerDeps = (packageJson.peerDependencies =
                packageJson.peerDependencies ?? {});
              peerDeps[key] = REACT_ROUTER_RANGE;
              changed = true;
            }
          }
        }
      }

      if (changed) {
        console.log(`Updating dependencies for ${packageJson.name}`);
        await fs.writeJson(resolvePath(dir, 'package.json'), packageJson, {
          spaces: 2,
        });
      }
    }),
  );
}
