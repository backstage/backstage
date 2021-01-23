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

import yaml from 'yaml';
import { extname } from 'path';
import { JsonObject, JsonValue } from '@backstage/config';
import { isObject } from './utils';
import { TransformFunc, EnvFunc, ReadFileFunc } from './types';

// Parsers for each type of included file
const includeFileParser: {
  [ext in string]: (content: string) => Promise<JsonObject>;
} = {
  '.json': async content => JSON.parse(content),
  '.yaml': async content => yaml.parse(content),
  '.yml': async content => yaml.parse(content),
};

/**
 * Transforms a secret description into the actual secret value.
 */
export function createIncludeTransform(
  env: EnvFunc,
  readFile: ReadFileFunc,
): TransformFunc {
  return async (input: JsonValue) => {
    if (!isObject(input)) {
      return [false, input];
    }
    // Check if there's any key that starts with a '$', in that case we treat
    // this entire object as a secret.
    const [secretKey] = Object.keys(input).filter(key => key.startsWith('$'));
    if (secretKey) {
      if (Object.keys(input).length !== 1) {
        throw new Error(
          `include key ${secretKey} should not have adjacent keys`,
        );
      }
    } else {
      return [false, input];
    }

    const secretValue = input[secretKey];
    if (typeof secretValue !== 'string') {
      throw new Error(`${secretKey} include value is not a string`);
    }

    switch (secretKey) {
      case '$file':
        try {
          return [true, await readFile(secretValue)];
        } catch (error) {
          throw new Error(`failed to read file ${secretValue}, ${error}`);
        }
      case '$env':
        try {
          return [true, await env(secretValue)];
        } catch (error) {
          throw new Error(`failed to read env ${secretValue}, ${error}`);
        }

      case '$include': {
        const [filePath, dataPath] = secretValue.split(/#(.*)/);

        const ext = extname(filePath);
        const parser = includeFileParser[ext];
        if (!parser) {
          throw new Error(
            `no configuration parser available for included file ${filePath}`,
          );
        }

        const content = await readFile(filePath);

        const parts = dataPath ? dataPath.split('.') : [];

        let value: JsonValue | undefined;
        try {
          value = await parser(content);
        } catch (error) {
          throw new Error(
            `failed to parse included file ${filePath}, ${error}`,
          );
        }

        // This bit handles selecting a subtree in the included file, if a path was provided after a #
        for (const [index, part] of parts.entries()) {
          if (!isObject(value)) {
            const errPath = parts.slice(0, index).join('.');
            throw new Error(
              `value at '${errPath}' in included file ${filePath} is not an object`,
            );
          }
          value = value[part];
        }

        return [true, value];
      }

      default:
        throw new Error(`unknown secret ${secretKey}`);
    }
  };
}
