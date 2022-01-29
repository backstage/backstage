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

import chalk from 'chalk';
import { relative as relativePath } from 'path';
import { buildPackages, getOutputsForRole } from '../../lib/builder';
import { PackageGraph } from '../../lib/monorepo';
import { paths } from '../../lib/paths';

export async function command(): Promise<void> {
  const packages = await PackageGraph.listTargetPackages();

  const options = packages.flatMap(pkg => {
    const role = pkg.packageJson.backstage?.role;
    if (!role) {
      console.warn(`Ignored ${pkg.packageJson.name} because it has no role`);
      return [];
    }

    const outputs = getOutputsForRole(role);
    if (outputs.size === 0) {
      console.warn(`Ignored ${pkg.packageJson.name} because it has no output`);
      return [];
    }

    const buildScript = pkg.packageJson.scripts?.build;
    if (!buildScript) {
      console.warn(
        `Ignored ${pkg.packageJson.name} because it has no build script`,
      );
      return [];
    }
    if (!buildScript.startsWith('backstage-cli script build')) {
      console.warn(
        `Ignored ${pkg.packageJson.name} because it has a custom build script, '${buildScript}'`,
      );
      return [];
    }

    return {
      targetDir: pkg.dir,
      outputs,
      logPrefix: `${chalk.cyan(relativePath(paths.targetRoot, pkg.dir))}: `,
      // TODO(Rugvip): Use commander to parse the script and grab these instead
      minify: buildScript.includes('--minify'),
      useApiExtractor: buildScript.includes('--experimental-type-build'),
    };
  });

  await buildPackages(options);
}
