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

import fs from 'fs-extra';
import yaml from 'yaml';
import { resolve as resolvePath } from 'path';
import { AppConfig } from '@backstage/config';
import { findRootPath } from './paths';
import { LoadConfigOptions } from './types';

export async function loadConfig(
  options: LoadConfigOptions = {},
): Promise<AppConfig[]> {
  // TODO: We'll want this to be a bit more elaborate, probably adding configs for
  //       specific env, and maybe local config for plugins.
  let { configPath } = options;
  if (!configPath) {
    configPath = resolvePath(
      findRootPath(fs.realpathSync(process.cwd())),
      'app-config.yaml',
    );
  }

  try {
    const configYaml = await fs.readFile(configPath, 'utf8');
    const config = yaml.parse(configYaml);
    return [config];
  } catch (error) {
    throw new Error(`Failed to read static configuration file, ${error}`);
  }
}
