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
import { serveBundle } from '../../lib/bundler';

export default async (cmd: Command) => {
  const appConfigs = await loadConfig({
    env: process.env.NODE_ENV ?? 'development',
    rootPaths: [paths.targetRoot, paths.targetDir],
  });
  const waitForExit = await serveBundle({
    entry: 'dev/index',
    checksEnabled: cmd.check,
    config: ConfigReader.fromConfigs(appConfigs),
    appConfigs,
  });

  await waitForExit();
};
