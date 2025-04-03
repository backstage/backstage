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
import { PackageGraph } from '@backstage/cli-node';
import { runPlain } from '../../../lib/run';

const PREFIX = `module.exports = require('@backstage/cli/config/eslint-factory')`;

export async function command() {
  const packages = await PackageGraph.listTargetPackages();

  const oldConfigs = [
    require.resolve('@backstage/cli/config/eslint.js'),
    require.resolve('@backstage/cli/config/eslint.backend.js'),
  ];

  const configPaths = new Array<string>();
  await Promise.all(
    packages.map(async ({ dir, packageJson }) => {
      const configPath = resolvePath(dir, '.eslintrc.js');
      if (!(await fs.pathExists(configPath))) {
        console.log(`Skipping ${packageJson.name}, missing .eslintrc.js`);
        return;
      }
      let existingConfig: Record<string, unknown>;
      try {
        existingConfig = require(configPath);
      } catch (error) {
        console.log(
          `Skipping ${packageJson.name}, failed to load .eslintrc.js, ${error}`,
        );
        return;
      }

      // Only transform configs that extend the old config files, and
      // we remove that entry from the extends array.
      const extendsArray = (existingConfig.extends as string[]) ?? [];
      const extendIndex = extendsArray.findIndex(p => oldConfigs.includes(p));
      if (extendIndex === -1) {
        console.log(
          `Skipping ${packageJson.name}, .eslintrc.js does not extend the legacy config`,
        );
        return;
      }
      extendsArray.splice(extendIndex, 1);
      if (extendsArray.length === 0) {
        delete existingConfig.extends;
      }

      if (Object.keys(existingConfig).length > 0) {
        await fs.writeFile(
          configPath,
          `${PREFIX}(__dirname, ${JSON.stringify(existingConfig, null, 2)});\n`,
        );
      } else {
        await fs.writeFile(configPath, `${PREFIX}(__dirname);\n`);
      }
      configPaths.push(configPath);
    }),
  );

  // If prettier is present, then we run that too
  let hasPrettier = false;
  try {
    require.resolve('prettier');
    hasPrettier = true;
  } catch {
    /* ignore */
  }

  if (hasPrettier) {
    await runPlain('prettier', '--write', ...configPaths);
  }
}
