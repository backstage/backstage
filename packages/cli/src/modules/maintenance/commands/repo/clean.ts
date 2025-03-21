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

import { execFile as execFileCb } from 'child_process';
import fs from 'fs-extra';
import { resolve as resolvePath } from 'path';
import { promisify } from 'util';
import { PackageGraph } from '@backstage/cli-node';
import { paths } from '../../../../lib/paths';

const execFile = promisify(execFileCb);

export async function command(): Promise<void> {
  const packages = await PackageGraph.listTargetPackages();

  await fs.remove(paths.resolveTargetRoot('dist'));
  await fs.remove(paths.resolveTargetRoot('dist-types'));
  await fs.remove(paths.resolveTargetRoot('coverage'));

  await Promise.all(
    Array.from(Array(10), async () => {
      while (packages.length > 0) {
        const pkg = packages.pop()!;
        const cleanScript = pkg.packageJson.scripts?.clean;

        if (
          cleanScript === 'backstage-cli clean' ||
          cleanScript === 'backstage-cli package clean'
        ) {
          await fs.remove(resolvePath(pkg.dir, 'dist'));
          await fs.remove(resolvePath(pkg.dir, 'dist-types'));
          await fs.remove(resolvePath(pkg.dir, 'coverage'));
        } else if (cleanScript) {
          const result = await execFile('yarn', ['run', 'clean'], {
            cwd: pkg.dir,
            shell: true,
          });
          process.stdout.write(result.stdout);
          process.stderr.write(result.stderr);
        }
      }
    }),
  );
}
