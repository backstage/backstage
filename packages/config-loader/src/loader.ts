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
import * as yup from 'yup';
import yaml from 'yaml';
import { resolve as resolvePath, dirname } from 'path';
import { AppConfig, JsonObject, JsonValue } from '@backstage/config';
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

type ReadFileFunc = (path: string) => Promise<string>;

type ReaderContext = {
  shouldReadSecrets: boolean;
  readFile: ReadFileFunc;
  env: { [name in string]?: string };
};

function isObject(obj: JsonValue | undefined): obj is JsonObject {
  if (typeof obj !== 'object') {
    return false;
  } else if (Array.isArray(obj)) {
    return false;
  }
  return obj !== null;
}

type FileSecret = {
  file: string;
};

type EnvSecret = {
  env: string;
};

type Secret = FileSecret | EnvSecret;

const secretLoaderSchemas = {
  file: yup.object({
    file: yup.string().required(),
  }),
  env: yup.object({
    env: yup.string().required(),
  }),
};

const secretSchema = yup.lazy<object>(value => {
  if (typeof value !== 'object' || value === null) {
    return yup.object().required();
  }

  const loaderTypes = Object.keys(
    secretLoaderSchemas,
  ) as (keyof typeof secretLoaderSchemas)[];

  for (const key of loaderTypes) {
    if (key in value) {
      return secretLoaderSchemas[key];
    }
  }
  throw new yup.ValidationError(
    `Secret must contain one of '${loaderTypes.join("', '")}'`,
    value,
    '$secret',
  );
});

// A thing to make sure we've narrowed the type down to never
function isNever<T extends never>() {
  return void 0 as T;
}

export async function readSecret(
  data: JsonObject,
  ctx: ReaderContext,
): Promise<string | undefined> {
  if (!ctx.shouldReadSecrets) {
    return undefined;
  }

  const secret = secretSchema.validateSync(data) as Secret;

  if ('file' in secret) {
    return ctx.readFile(secret.file);
  }
  if ('env' in secret) {
    return ctx.env[secret.env];
  }

  isNever<typeof secret>();
  throw new Error('Secret was left unhandled');
}

export async function readConfigFile(filePath: string, ctx: ReaderContext) {
  const configYaml = await ctx.readFile(filePath);
  const config = yaml.parse(configYaml);

  async function transform(
    obj: JsonValue,
    path: string,
  ): Promise<JsonValue | undefined> {
    if (typeof obj !== 'object') {
      return obj;
    } else if (obj === null) {
      return obj;
    } else if (Array.isArray(obj)) {
      const arr = new Array<JsonValue>();

      for (const [index, value] of obj.entries()) {
        const out = await transform(value, `${path}[${index}]`);
        if (out !== undefined) {
          arr.push(out);
        }
      }

      return arr;
    }

    if ('$secret' in obj) {
      if (!isObject(obj.$secret)) {
        throw TypeError(`Expected object at secret ${path}.$secret`);
      }

      try {
        return await readSecret(obj.$secret, ctx);
      } catch (error) {
        throw new Error(`Invalid secret at ${path}: ${error.message}`);
      }
    }

    const out: JsonObject = {};

    for (const [key, value] of Object.entries(obj)) {
      const result = await transform(value, `${path}.${key}`);
      if (result !== undefined) {
        out[key] = result;
      }
    }

    return out;
  }

  const finalConfig = await transform(config, '');
  if (!isObject(finalConfig)) {
    throw new TypeError('Expected object at config root');
  }
  return finalConfig;
}

export async function loadStaticConfig(
  options: LoadConfigOptions,
): Promise<AppConfig[]> {
  const { shouldReadSecrets = false } = options;

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
    const rootPath = dirname(configPath);
    const config = await readConfigFile(configPath, {
      env: process.env,
      shouldReadSecrets,
      readFile: (path: string) => {
        return fs.readFile(resolvePath(rootPath, path), 'utf8');
      },
    });
    return [config];
  } catch (error) {
    throw new Error(
      `Failed to read static configuration file: ${error.message}`,
    );
  }
}

export async function loadConfig(
  options: LoadConfigOptions = {},
): Promise<AppConfig[]> {
  const configs = [];

  configs.push(...readEnv(process.env));
  configs.push(...(await loadStaticConfig(options)));

  return configs;
}
