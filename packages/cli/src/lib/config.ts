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

import { loadConfig } from '@backstage/config-loader';
import { ConfigReader } from '@backstage/config';
import { paths } from './paths';

export async function loadCliConfig(configArgs: string[]) {
  const configPaths = configArgs.map(arg => paths.resolveTarget(arg));

  const appConfigs = await loadConfig({
    env: process.env.APP_ENV ?? process.env.NODE_ENV ?? 'production',
    configRoot: paths.targetRoot,
    configPaths,
  });

  console.log(
    `Loaded config from ${appConfigs.map(c => c.context).join(', ')}`,
  );

  return {
    appConfigs,
    config: ConfigReader.fromConfigs(appConfigs),
  };
}
