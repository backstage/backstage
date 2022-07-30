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
import { OptionValues } from 'commander';

export async function command({ keepMain }: OptionValues) {
  const packages = await PackageGraph.listTargetPackages();

  await Promise.all(
    packages.map(async ({ dir, packageJson: pkg }) => {
      if (pkg.exports) {
        return; // Exports are already defined
      }
      const { main } = pkg;
      if (!main) {
        return; // Package has no entrypoint
      }
      if (!keepMain) {
        delete pkg.main;
        delete pkg.module;
        delete pkg.browser;
        delete pkg.types;
      }

      pkg.exports = {
        './': main,
      };

      await fs.writeJson(resolvePath(dir, 'package.json'), pkg, {
        spaces: 2,
      });
    }),
  );
}
