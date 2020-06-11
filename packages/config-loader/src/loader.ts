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
import { AppConfig, JsonObject } from '@backstage/config';
import { findRootPath } from './paths';
import { LoadConfigOptions } from './types';

const ENV_PREFIX = 'APP_CONFIG_';

// Update the same pattern in config package if this is changed
const CONFIG_KEY_PART_PATTERN = /^[a-z][a-z0-9]*(?:[-_][a-z][a-z0-9]*)*$/i;

export function readEnv(env: {
  [name: string]: string | undefined;
}): AppConfig[] {
  let config: JsonObject | undefined = undefined;

  for (const [name, value] of Object.entries(env)) {
    if (!value) {
      continue;
    }
    if (name.startsWith(ENV_PREFIX)) {
      const key = name.replace(ENV_PREFIX, '');
      const keyParts = key.split('_');

      let obj = (config = config ?? {});
      for (const [index, part] of keyParts.entries()) {
        if (!CONFIG_KEY_PART_PATTERN.test(part)) {
          throw new TypeError(`Invalid env config key '${key}'`);
        }
        if (index < keyParts.length - 1) {
          obj = (obj[part] = obj[part] ?? {}) as JsonObject;
          if (typeof obj !== 'object' || Array.isArray(obj)) {
            const subKey = keyParts.slice(0, index + 1).join('_');
            throw new TypeError(
              `Could not nest config for key '${key}' under existing value '${subKey}'`,
            );
          }
        } else {
          if (part in obj) {
            throw new TypeError(
              `Refusing to override existing config at key '${key}'`,
            );
          }
          try {
            const parsedValue = JSON.parse(value);
            if (parsedValue === null) {
              throw new Error('value may not be null');
            }
            obj[part] = parsedValue;
          } catch (error) {
            throw new TypeError(
              `Failed to parse JSON-serialized config value for key '${key}', ${error}`,
            );
          }
        }
      }
    }
  }

  return config ? [config] : [];
}

export async function readStaticConfig(
  options: LoadConfigOptions,
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

export async function loadConfig(
  options: LoadConfigOptions = {},
): Promise<AppConfig[]> {
  const configs = [];

  configs.push(...readEnv(process.env));
  configs.push(...(await readStaticConfig(options)));

  return configs;
}
