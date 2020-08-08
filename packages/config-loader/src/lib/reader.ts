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

import { AppConfig, JsonObject, JsonValue } from '@backstage/config';
import { basename } from 'path';
import yaml from 'yaml';
import { ReaderContext } from './types';
import { isObject } from './utils';

/**
 * Reads and parses, and validates, and transforms a single config file.
 * The transformation rewrites any special values, like the $secret key.
 */
export async function readConfigFile(
  filePath: string,
  ctx: ReaderContext,
): Promise<AppConfig> {
  const configYaml = await ctx.readFile(filePath);
  const config = yaml.parse(configYaml);

  async function transform(
    obj: JsonValue,
    path: string,
  ): Promise<JsonValue | undefined> {
    if (ctx.skip(path)) {
      return undefined;
    }

    if (typeof obj !== 'object') {
      return obj;
    } else if (obj === null) {
      return undefined;
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
        return await ctx.readSecret(path, obj.$secret);
      } catch (error) {
        throw new Error(`Invalid secret at ${path}: ${error.message}`);
      }
    }

    const out: JsonObject = {};

    for (const [key, value] of Object.entries(obj)) {
      // undefined covers optional fields
      if (value !== undefined) {
        const result = await transform(value, `${path}.${key}`);
        if (result !== undefined) {
          out[key] = result;
        }
      }
    }

    return out;
  }

  const finalConfig = await transform(config, '');
  if (!isObject(finalConfig)) {
    throw new TypeError('Expected object at config root');
  }
  return { data: finalConfig, context: basename(filePath) };
}
