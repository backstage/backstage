/*
 * Copyright 2020 Spotify AB
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

import { Command } from 'commander';
import { loadConfig } from '@backstage/config-loader';
import { ConfigReader } from '@backstage/config';
import { paths } from '../../lib/paths';
import { stringify as stringifyYaml } from 'yaml';

export default async (cmd: Command) => {
  const appConfigs = await loadConfig({
    env: cmd.env ?? process.env.NODE_ENV ?? 'development',
    shouldReadSecrets: cmd.withSecrets ?? false,
    rootPaths: [paths.targetRoot, paths.targetDir],
  });

  const flatConfig = ConfigReader.fromConfigs(appConfigs).get();

  if (cmd.format === 'json') {
    process.stdout.write(`${JSON.stringify(flatConfig, null, 2)}\n`);
  } else {
    process.stdout.write(`${stringifyYaml(flatConfig)}\n`);
  }
};
