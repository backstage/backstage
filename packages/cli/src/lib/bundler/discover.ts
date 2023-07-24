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

import { BackstagePackageJson } from '@backstage/cli-node';
import { Config } from '@backstage/config';
import fs from 'fs-extra';
import path from 'path';

import { paths as cliPaths } from '../../lib/paths';
import { BundlingPathsOptions, resolveBundlingPaths } from './paths';

type Options = { config: Config } & BundlingPathsOptions;

export async function writeDetectedPluginsModule(options: Options) {
  const requirePackageScript = (await detectPlugins(options))
    ?.map(pkg => `{name: '${pkg}', module: require('${pkg}')}`)
    .join(',');

  await fs.writeFile(
    path.join(
      cliPaths.targetRoot,
      'node_modules',
      '__backstage-autodetected-plugins__.js',
    ),
    `export const modules = [${requirePackageScript}];`,
  );
}

async function detectPlugins({ config, entry, targetDir }: Options) {
  const paths = resolveBundlingPaths({ entry, targetDir });
  const pkg: BackstagePackageJson = await fs.readJson(paths.targetPackageJson);
  // TODO: proper
  // Assumption for config string based on https://github.com/backstage/backstage/issues/18372 ^

  const packageDetectionMode =
    config.getOptional('app.experimental.packages') || 'all';

  const allowedPackages =
    packageDetectionMode === 'all'
      ? Object.keys(pkg.dependencies ?? {})
      : config.getStringArray('app.experimental.packages');

  return allowedPackages
    .map(depName => {
      const depPackageJson: BackstagePackageJson = require(require.resolve(
        `${depName}/package.json`,
        { paths: [paths.targetPath] },
      ));
      if (
        ['frontend-plugin', 'frontend-plugin-module'].includes(
          depPackageJson.backstage?.role || '',
        )
      ) {
        return depName;
      }
      return undefined;
    })
    .filter((d): d is string => !!d);
}
