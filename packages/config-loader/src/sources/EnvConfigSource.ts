/*
 * Copyright 2023 The Backstage Authors
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

import { AppConfig } from '@backstage/config';
import { assertError } from '@backstage/errors';
import { JsonObject } from '@backstage/types';
import { AsyncConfigSourceIterator, ConfigSource } from './types';

/**
 * Options for {@link EnvConfigSource.create}.
 *
 * @public
 */
export interface EnvConfigSourceOptions {
  /**
   * The environment variables to use, defaults to {@link process.env}.
   */
  env?: Record<string, string | undefined>;
}

/**
 * A config source that reads configuration from the environment.
 *
 * @remarks
 *
 * Only environment variables prefixed with APP_CONFIG_ will be considered.
 *
 * For each variable, the prefix will be removed, and rest of the key will
 * be split by '_'. Each part will then be used as keys to build up a nested
 * config object structure. The treatment of the entire environment variable
 * is case-sensitive.
 *
 * The value of the variable should be JSON serialized, as it will be parsed
 * and the type will be kept intact. For example "true" and true are treated
 * differently, as well as "42" and 42.
 *
 * For example, to set the config app.title to "My Title", use the following:
 *
 * APP_CONFIG_app_title='"My Title"'
 *
 * @public
 */
export class EnvConfigSource implements ConfigSource {
  /**
   * Creates a new config source that reads from the environment.
   *
   * @param options - Options for the config source.
   * @returns A new config source that reads from the environment.
   */
  static create(options: EnvConfigSourceOptions): ConfigSource {
    return new EnvConfigSource(options?.env ?? process.env);
  }

  private constructor(
    private readonly env: { [name: string]: string | undefined },
  ) {}

  async *readConfigData(): AsyncConfigSourceIterator {
    const configs = readEnvConfig(this.env);
    yield { configs };
    return;
  }

  toString() {
    const keys = Object.keys(this.env).filter(key =>
      key.startsWith('APP_CONFIG_'),
    );
    return `EnvConfigSource{count=${keys.length}}`;
  }
}

const ENV_PREFIX = 'APP_CONFIG_';

// Update the same pattern in config package if this is changed
const CONFIG_KEY_PART_PATTERN = /^[a-z][a-z0-9]*(?:[-_][a-z][a-z0-9]*)*$/i;

/**
 * Read runtime configuration from the environment.
 *
 * @remarks
 *
 * Only environment variables prefixed with APP_CONFIG_ will be considered.
 *
 * For each variable, the prefix will be removed, and rest of the key will
 * be split by '_'. Each part will then be used as keys to build up a nested
 * config object structure. The treatment of the entire environment variable
 * is case-sensitive.
 *
 * The value of the variable should be JSON serialized, as it will be parsed
 * and the type will be kept intact. For example "true" and true are treated
 * differently, as well as "42" and 42.
 *
 * For example, to set the config app.title to "My Title", use the following:
 *
 * APP_CONFIG_app_title='"My Title"'
 *
 * @public
 * @deprecated Use {@link EnvConfigSource} instead
 */
export function readEnvConfig(env: {
  [name: string]: string | undefined;
}): AppConfig[] {
  let data: JsonObject | undefined = undefined;

  for (const [name, value] of Object.entries(env)) {
    if (!value) {
      continue;
    }
    if (name.startsWith(ENV_PREFIX)) {
      const key = name.replace(ENV_PREFIX, '');
      const keyParts = key.split('_');

      let obj = (data = data ?? {});
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
            const [, parsedValue] = safeJsonParse(value);
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

  return data ? [{ data, context: 'env' }] : [];
}

function safeJsonParse(str: string): [Error | null, any] {
  try {
    return [null, JSON.parse(str)];
  } catch (err) {
    assertError(err);
    return [err, str];
  }
}
