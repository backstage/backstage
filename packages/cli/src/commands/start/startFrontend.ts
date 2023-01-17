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
import { serveBundle } from '../../lib/bundler';
import { loadCliConfig } from '../../lib/config';
import { paths } from '../../lib/paths';
import { Lockfile } from '../../lib/versioning';
import { forbiddenDuplicatesFilter, includedFilter } from '../versions/lint';
import { PackageGraph } from '../../lib/monorepo';

interface StartAppOptions {
  verifyVersions?: boolean;
  entry: string;

  checksEnabled: boolean;
  configPaths: string[];
}

export async function startFrontend(options: StartAppOptions) {
  if (options.verifyVersions) {
    const lockfile = await Lockfile.load(paths.resolveTargetRoot('yarn.lock'));
    const result = lockfile.analyze({
      filter: includedFilter,
      localPackages: PackageGraph.fromPackages(
        await PackageGraph.listTargetPackages(),
      ),
    });
    const problemPackages = [...result.newVersions, ...result.newRanges]
      .map(({ name }) => name)
      .filter(forbiddenDuplicatesFilter);

    if (problemPackages.length > 1) {
      console.log(
        chalk.yellow(
          `⚠️   Some of the following packages may be outdated or have duplicate installations:

          ${uniq(problemPackages).join(', ')}
        `,
        ),
      );
      console.log(
        chalk.yellow(
          `⚠️   This can be resolved using the following command:

          yarn backstage-cli versions:check --fix
      `,
        ),
      );
    }
  }

  const { name } = await fs.readJson(paths.resolveTarget('package.json'));
  const config = await loadCliConfig({
    args: options.configPaths,
    fromPackage: name,
    withFilteredKeys: true,
  });

  const appBaseUrl = config.frontendConfig.getString('app.baseUrl');
  const backendBaseUrl = config.frontendConfig.getString('backend.baseUrl');
  if (appBaseUrl === backendBaseUrl) {
    console.log(
      chalk.yellow(
        `⚠️   Conflict between app baseUrl and backend baseUrl:

    app.baseUrl:     ${appBaseUrl}
    backend.baseUrl: ${backendBaseUrl}

    Must have unique hostname and/or ports.

    This can be resolved by changing app.baseUrl and backend.baseUrl to point to their respective local development ports.
`,
      ),
    );
  }

  const waitForExit = await serveBundle({
    entry: options.entry,
    checksEnabled: options.checksEnabled,
    ...config,
  });

  await waitForExit();
}
