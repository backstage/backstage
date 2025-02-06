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
import { buildBundle, getModuleFederationOptions } from '../../lib/bundler';
import { getEnvironmentParallelism } from '../../lib/parallel';
import { loadCliConfig } from '../../modules/config/lib/config';
import { BackstagePackageJson } from '@backstage/cli-node';

interface BuildAppOptions {
  targetDir: string;
  writeStats: boolean;
  configPaths: string[];
  isModuleFederationRemote?: true;
  rspack?: typeof import('@rspack/core').rspack;
}

export async function buildFrontend(options: BuildAppOptions) {
  const { targetDir, writeStats, configPaths, rspack } = options;
  const packageJson = (await fs.readJson(
    resolvePath(targetDir, 'package.json'),
  )) as BackstagePackageJson;
  await buildBundle({
    targetDir,
    entry: 'src/index',
    parallelism: getEnvironmentParallelism(),
    statsJsonEnabled: writeStats,
    moduleFederation: await getModuleFederationOptions(
      packageJson,
      resolvePath(targetDir),
      options.isModuleFederationRemote,
    ),
    ...(await loadCliConfig({
      args: configPaths,
      fromPackage: packageJson.name,
    })),
    rspack,
  });
}
