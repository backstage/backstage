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

import { AppConfig, Config, JsonValue, JsonObject } from './types';

// Update the same pattern in config-loader package if this is changed
const CONFIG_KEY_PART_PATTERN = /^[a-z][a-z0-9]*(?:[-_][a-z][a-z0-9]*)*$/i;

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
  if (type === 'string' && value === '') {
    return 'empty-string';
  }
  return type;
}

export class ConfigReader implements Config {
  private static readonly nullReader = new ConfigReader({});

  static fromConfigs(configs: AppConfig[]): ConfigReader {
    if (configs.length === 0) {
      return new ConfigReader({});
    }

    // Merge together all configs info a single config with recursive fallback
    // readers, giving the first config object in the array the highest priority.
    return configs.reduceRight<ConfigReader>((previousReader, nextConfig) => {
      return new ConfigReader(nextConfig, previousReader);
    }, undefined!);
  }

  constructor(
    private readonly data: JsonObject,
    private readonly fallback?: ConfigReader,
  ) {}

  getConfig(key: string): ConfigReader {
    const value = this.readValue(key);
    const fallbackConfig = this.fallback?.getConfig(key);
    if (isObject(value)) {
      return new ConfigReader(value, fallbackConfig);
    }
    if (value !== undefined) {
      throw new TypeError(
        `Invalid type in config for key ${key}, got ${typeOf(
          value,
        )}, wanted object`,
      );
    }
    return fallbackConfig ?? ConfigReader.nullReader;
  }

  getConfigArray(key: string): ConfigReader[] {
    const configs = this.readConfigValue<JsonObject[]>(key, values => {
      if (!Array.isArray(values)) {
        return { expected: 'object-array' };
      }

      for (const [index, value] of values.entries()) {
        if (!isObject(value)) {
          return { expected: 'object-array', value, key: `${key}[${index}]` };
        }
      }
      return true;
    });

    return (configs ?? []).map(obj => new ConfigReader(obj));
  }

  mustNumber(key: string): number {
    const value = this.getNumber(key);
    if (value === undefined) {
      throw new Error(`Missing required config value at '${key}'`);
    }
    return value;
  }

  getNumber(key: string): number | undefined {
    return this.readConfigValue(
      key,
      value => typeof value === 'number' || { expected: 'number' },
    );
  }

  mustBoolean(key: string): boolean {
    const value = this.getBoolean(key);
    if (value === undefined) {
      throw new Error(`Missing required config value at '${key}'`);
    }
    return value;
  }

  getBoolean(key: string): boolean | undefined {
    return this.readConfigValue(
      key,
      value => typeof value === 'boolean' || { expected: 'boolean' },
    );
  }

  mustString(key: string): string {
    const value = this.getString(key);
    if (value === undefined) {
      throw new Error(`Missing required config value at '${key}'`);
    }
    return value;
  }

  getString(key: string): string | undefined {
    return this.readConfigValue(
      key,
      value =>
        (typeof value === 'string' && value !== '') || { expected: 'string' },
    );
  }

  mustStringArray(key: string): string[] {
    const value = this.getStringArray(key);
    if (value === undefined) {
      throw new Error(`Missing required config value at '${key}'`);
    }
    return value;
  }

  getStringArray(key: string): string[] | undefined {
    return this.readConfigValue(key, values => {
      if (!Array.isArray(values)) {
        return { expected: 'string-array' };
      }
      for (const [index, value] of values.entries()) {
        if (typeof value !== 'string' || value === '') {
          return { expected: 'string-array', value, key: `${key}[${index}]` };
        }
      }
      return true;
    });
  }

  private readConfigValue<T extends JsonValue>(
    key: string,
    validate: (
      value: JsonValue,
    ) => { expected: string; value?: JsonValue; key?: string } | true,
  ): T | undefined {
    const value = this.readValue(key);

    if (value === undefined) {
      return this.fallback?.readConfigValue(key, validate);
    }
    if (value !== undefined) {
      const result = validate(value);
      if (result !== true) {
        const {
          key: keyName = key,
          value: theValue = value,
          expected,
        } = result;
        const typeName = typeOf(theValue);
        throw new TypeError(
          `Invalid type in config for key ${keyName}, got ${typeName}, wanted ${expected}`,
        );
      }
    }

    return value as T;
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
