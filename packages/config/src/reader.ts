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

// Separate out a couple of common error messages to reduce bundle size.
const errors = {
  type(key: string, typeName: string, expected: string) {
    return `Invalid type in config for key ${key}, got ${typeName}, wanted ${expected}`;
  },
  missing(key: string) {
    return `Missing required config value at '${key}'`;
  },
};

export class ConfigReader implements Config {
  static fromConfigs(configs: AppConfig[]): ConfigReader {
    if (configs.length === 0) {
      return new ConfigReader(undefined);
    }

    // Merge together all configs info a single config with recursive fallback
    // readers, giving the first config object in the array the highest priority.
    return configs.reduceRight<ConfigReader>((previousReader, nextConfig) => {
      return new ConfigReader(nextConfig, previousReader);
    }, undefined!);
  }

  constructor(
    private readonly data: JsonObject | undefined,
    private readonly fallback?: ConfigReader,
    private readonly prefix: string = '',
  ) {}

  keys(): string[] {
    const localKeys = this.data ? Object.keys(this.data) : [];
    const fallbackKeys = this.fallback?.keys() ?? [];
    return [...new Set([...localKeys, ...fallbackKeys])];
  }

  getConfig(key: string): ConfigReader {
    const value = this.readValue(key);
    const fallbackConfig = this.fallback?.getConfig(key);
    const prefix = this.fullKey(key);

    if (isObject(value)) {
      return new ConfigReader(value, fallbackConfig, prefix);
    }
    if (value !== undefined) {
      throw new TypeError(
        errors.type(this.fullKey(key), typeOf(value), 'object'),
      );
    }
    return fallbackConfig ?? new ConfigReader(undefined, undefined, prefix);
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

    return (configs ?? []).map(
      (obj, index) =>
        new ConfigReader(obj, undefined, this.fullKey(`${key}[${index}]`)),
    );
  }

  getNumber(key: string): number {
    const value = this.getOptionalNumber(key);
    if (value === undefined) {
      throw new Error(errors.missing(this.fullKey(key)));
    }
    return value;
  }

  getOptionalNumber(key: string): number | undefined {
    return this.readConfigValue(
      key,
      value => typeof value === 'number' || { expected: 'number' },
    );
  }

  getBoolean(key: string): boolean {
    const value = this.getOptionalBoolean(key);
    if (value === undefined) {
      throw new Error(errors.missing(this.fullKey(key)));
    }
    return value;
  }

  getOptionalBoolean(key: string): boolean | undefined {
    return this.readConfigValue(
      key,
      value => typeof value === 'boolean' || { expected: 'boolean' },
    );
  }

  getString(key: string): string {
    const value = this.getOptionalString(key);
    if (value === undefined) {
      throw new Error(errors.missing(this.fullKey(key)));
    }
    return value;
  }

  getOptionalString(key: string): string | undefined {
    return this.readConfigValue(
      key,
      value =>
        (typeof value === 'string' && value !== '') || { expected: 'string' },
    );
  }

  getStringArray(key: string): string[] {
    const value = this.getOptionalStringArray(key);
    if (value === undefined) {
      throw new Error(errors.missing(this.fullKey(key)));
    }
    return value;
  }

  getOptionalStringArray(key: string): string[] | undefined {
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

  private fullKey(key: string): string {
    return `${this.prefix}${this.prefix ? '.' : ''}${key}`;
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
        throw new TypeError(
          errors.type(this.fullKey(keyName), typeOf(theValue), expected),
        );
      }
    }

    return value as T;
  }

  private readValue(key: string): JsonValue | undefined {
    const parts = key.split('.');
    for (const part of parts) {
      if (!CONFIG_KEY_PART_PATTERN.test(part)) {
        throw new TypeError(`Invalid config key '${key}'`);
      }
    }

    if (this.data === undefined) {
      return undefined;
    }

    let value: JsonValue | undefined = this.data;
    for (const part of parts) {
      if (isObject(value)) {
        value = value[part];
      } else {
        value = undefined;
      }
    }

    return value;
  }
}
