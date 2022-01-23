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
import { PackageGraph } from '../../lib/monorepo';
import { readPackageRole, PackageRoleName } from '../../lib/role';

const bundledRoles: PackageRoleName[] = ['app', 'backend'];
const noStartRoles: PackageRoleName[] = ['cli', 'common-library'];

export async function command() {
  const packages = await PackageGraph.listTargetPackages();

  await Promise.all(
    packages.map(async ({ dir, packageJson }) => {
      const roleInfo = readPackageRole(packageJson);
      if (!roleInfo) {
        return;
      }

      const hasStart = !noStartRoles.includes(roleInfo.role);
      const isBundled = bundledRoles.includes(roleInfo.role);

      const expectedScripts = {
        ...(hasStart && { start: 'backstage-cli script start' }),
        ...(isBundled
          ? { bundle: 'backstage-cli script bundle', build: undefined }
          : { build: 'backstage-cli script build', bundle: undefined }),
        lint: 'backstage-cli script lint',
        test: 'backstage-cli script test',
        clean: 'backstage-cli script clean',
        ...(!isBundled && {
          postpack: 'backstage-cli script postpack',
          prepack: 'backstage-cli script prepack',
        }),
      };

      let changed = false;
      const currentScripts: Record<string, string | undefined> =
        (packageJson.scripts = packageJson.scripts || {});

      for (const [name, value] of Object.entries(expectedScripts)) {
        if (currentScripts[name] !== value) {
          changed = true;
          currentScripts[name] = value;
        }
      }

      if (changed) {
        console.log(`Updating scripts for ${packageJson.name}`);
        await fs.writeJson(resolvePath(dir, 'package.json'), packageJson, {
          spaces: 2,
        });
      }
    }),
  );
}
