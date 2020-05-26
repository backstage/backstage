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

import { ConfigApi, Config } from '../../definitions/ConfigApi';

const CONFIG_KEY_PART_PATTERN = /^[a-z][a-z0-9]*(?:[-_][a-z][a-z0-9]*)*$/i;

type JsonObject = { [key in string]: JsonValue };
type JsonArray = JsonValue[];
type JsonValue = JsonObject | JsonArray | number | string | boolean | null;

function isObject(value: JsonValue | undefined): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function typeOf(value: JsonValue | undefined): string {
  if (value === null) {
    return 'null';
  } else if (Array.isArray(value)) {
    return 'array';
  }
  const type = typeof value;
  if (type === 'number' && isNaN(value as number)) {
    return 'nan';
  }
  return type;
}

function typeErrorMessage(key: string, got: string, wanted: string) {
  return `Invalid type in config for key ${key}, got ${got}, wanted ${wanted}`;
}

function validateString(
  key: string,
  value: JsonValue | undefined,
): value is string {
  if (typeof value === 'string' && value.length > 0) {
    return true;
  }
  if (value === '') {
    throw new TypeError(typeErrorMessage(key, 'empty-string', 'string'));
  }
  if (value !== undefined) {
    throw new TypeError(typeErrorMessage(key, typeOf(value), 'string'));
  }
  return false;
}

export class ConfigReader implements ConfigApi {
  static nullReader = new ConfigReader({});

  constructor(private readonly data: JsonObject) {}

  getConfig(key: string): Config {
    const value = this.readValue(key);
    if (isObject(value)) {
      return new ConfigReader(value);
    }
    if (value !== undefined) {
      throw new TypeError(typeErrorMessage(key, typeOf(value), 'object'));
    }
    return ConfigReader.nullReader;
  }

  getConfigArray(key: string): Config[] {
    const values = this.readValue(key);
    if (Array.isArray(values)) {
      return values.map((value, index) => {
        if (isObject(value)) {
          return new ConfigReader(value);
        }
        throw new TypeError(
          typeErrorMessage(`${key}[${index}]`, typeOf(value), 'object'),
        );
      });
    }
    if (values !== undefined) {
      throw new TypeError(
        typeErrorMessage(key, typeOf(values), 'object-array'),
      );
    }
    return [];
  }

  getNumber(key: string): number | undefined {
    const value = this.readValue(key);
    if (typeof value === 'number' && !isNaN(value)) {
      return value;
    }
    if (value !== undefined) {
      throw new TypeError(typeErrorMessage(key, typeOf(value), 'number'));
    }
    return undefined;
  }

  getBoolean(key: string): boolean | undefined {
    const value = this.readValue(key);
    if (typeof value === 'boolean') {
      return value;
    }
    if (value !== undefined) {
      throw new TypeError(typeErrorMessage(key, typeOf(value), 'boolean'));
    }
    return undefined;
  }

  getString(key: string): string | undefined {
    const value = this.readValue(key);
    if (validateString(key, value)) {
      return value;
    }
    return undefined;
  }

  getStringArray(key: string): string[] | undefined {
    const values = this.readValue(key);
    if (Array.isArray(values)) {
      for (const [index, value] of values.entries()) {
        const iKey = `${key}[${index}]`;
        if (!validateString(iKey, value)) {
          throw new TypeError(typeErrorMessage(iKey, typeOf(value), 'string'));
        }
      }
      return values as string[];
    }
    if (values !== undefined) {
      throw new TypeError(
        typeErrorMessage(key, typeOf(values), 'string-array'),
      );
    }
    return undefined;
  }

  private readValue(key: string): JsonValue | undefined {
    const parts = key.split('.');

    let value: JsonValue | undefined = this.data;
    for (const part of parts) {
      if (!CONFIG_KEY_PART_PATTERN.test(part)) {
        throw new TypeError(`Invalid config key '${key}'`);
      }
      if (isObject(value)) {
        value = value[part];
      } else {
        value = undefined;
      }
    }

    return value;
  }
}
