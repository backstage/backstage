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
import chalk from 'chalk';
import uniq from 'lodash/uniq';
import { OptionValues } from 'commander';
import { serveBundle } from '../../lib/bundler';
import { loadCliConfig } from '../../lib/config';
import { paths } from '../../lib/paths';
import { Lockfile } from '../../lib/versioning';
import { forbiddenDuplicatesFilter, includedFilter } from '../versions/lint';

export default async (opts: OptionValues) => {
  const lockFilePath = paths.resolveTargetRoot('yarn.lock');
  if (fs.existsSync(lockFilePath)) {
    try {
      const lockfile = await Lockfile.load(lockFilePath);
      const result = lockfile.analyze({
        filter: includedFilter,
      });
      const problemPackages = [...result.newVersions, ...result.newRanges]
        .map(({ name }) => name)
        .filter(name => forbiddenDuplicatesFilter(name));

      if (problemPackages.length > 0) {
        console.log(
          chalk.yellow(
            `⚠️ Some of the following packages may be outdated or have duplicate installations:

              ${uniq(problemPackages).join(', ')}
            `,
          ),
        );
        console.log(
          chalk.yellow(
            `⚠️ The following command may fix the issue, but it could also be an issue within one of your dependencies:

              yarn backstage-cli versions:check --fix
            `,
          ),
        );
      }
    } catch (error) {
      console.log(
        chalk.yellow(
          `⚠️ Unable to parse yarn.lock file properly:

            ${error}

            skipping analyzer for outdated or duplicate installations
          `,
        ),
      );
    }
  } else {
    console.log(
      chalk.yellow(
        `⚠️ Unable to find yarn.lock file:

          skipping analyzer for outdated or duplicate installations
        `,
      ),
    );
  }

  const { name } = await fs.readJson(paths.resolveTarget('package.json'));
  const waitForExit = await serveBundle({
    entry: 'src/index',
    checksEnabled: opts.check,
    ...(await loadCliConfig({
      args: opts.config,
      fromPackage: name,
      withFilteredKeys: true,
    })),
  });

  await waitForExit();
};
