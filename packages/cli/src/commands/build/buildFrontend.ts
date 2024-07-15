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
import { buildBundle } from '../../lib/bundler';
import { getEnvironmentParallelism } from '../../lib/parallel';
import { loadCliConfig } from '../../lib/config';
import chalk from 'chalk';
import { BuildOptions } from '../../lib/bundler/types';

interface BuildAppOptions {
  targetDir: string;
  writeStats: boolean;
  configPaths: string[];
  isModuleFederationRemote?: true;
}

function getModuleFederationOptions(
  name: string,
  isRemote?: boolean,
): BuildOptions['moduleFederation'] {
  if (!isRemote && !process.env.EXPERIMENTAL_MODULE_FEDERATION) {
    return undefined;
  }

  console.log(
    chalk.yellow(
      `⚠️  WARNING: Module federation is experimental and will receive immediate breaking changes in the future.`,
    ),
  );

  return {
    mode: isRemote ? 'remote' : 'host',
    // The default output mode requires the name to be a usable as a code
    // symbol, there might be better options here but for now we need to
    // sanitize the name.
    name: name.replaceAll('@', '').replaceAll('/', '__').replaceAll('-', '_'),
  };
}

export async function buildFrontend(options: BuildAppOptions) {
  const { targetDir, writeStats, configPaths } = options;
  const { name } = await fs.readJson(resolvePath(targetDir, 'package.json'));

  await buildBundle({
    targetDir,
    entry: 'src/index',
    parallelism: getEnvironmentParallelism(),
    statsJsonEnabled: writeStats,
    moduleFederation: getModuleFederationOptions(
      name,
      options.isModuleFederationRemote,
    ),
    ...(await loadCliConfig({
      args: configPaths,
      fromPackage: name,
    })),
  });
}
