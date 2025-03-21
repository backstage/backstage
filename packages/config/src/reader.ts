/*
 * Copyright 2020 The Backstage Authors
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

import { JsonValue, JsonObject } from '@backstage/types';
import { AppConfig, Config } from './types';

// Update the same pattern in config-loader package if this is changed
const CONFIG_KEY_PART_PATTERN = /^[a-z][a-z0-9]*(?:[-_][a-z][a-z0-9]*)*$/i;

function isObject(value: JsonValue | undefined): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function cloneDeep(value: JsonValue | null | undefined): JsonValue | undefined {
  if (typeof value !== 'object' || value === null) {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map(cloneDeep) as JsonValue;
  }
  return Object.fromEntries(
    Object.entries(value).map(([k, v]) => [k, cloneDeep(v)]),
  );
}

function merge(
  into: JsonValue | undefined,
  from?: JsonValue | undefined,
): JsonValue | undefined {
  if (into === null) {
    return undefined;
  }
  if (into === undefined) {
    return from === undefined ? undefined : merge(from);
  }
  if (typeof into !== 'object' || Array.isArray(into)) {
    return into;
  }
  const fromObj = isObject(from) ? from : {};

  const out: JsonObject = {};
  for (const key of new Set([...Object.keys(into), ...Object.keys(fromObj)])) {
    const val = merge(into[key], fromObj[key]);
    if (val !== undefined) {
      out[key] = val;
    }
  }
  return out;
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
  type(key: string, context: string, typeName: string, expected: string) {
    return `Invalid type in config for key '${key}' in '${context}', got ${typeName}, wanted ${expected}`;
  },
  missing(key: string, context: string) {
    return `Missing required config value at '${key}' in '${context}'`;
  },
  convert(key: string, context: string, expected: string) {
    return `Unable to convert config value for key '${key}' in '${context}' to a ${expected}`;
  },
};

/**
 * An implementation of the `Config` interface that uses a plain JavaScript object
 * for the backing data, with the ability of linking multiple readers together.
 *
 * @public
 */
export class ConfigReader implements Config {
  /**
   * A set of key paths that where removed from the config due to not being visible.
   *
   * This was added as a mutable private member to avoid changes to the public API.
   * Its only purpose of this is to warn users of missing visibility when running
   * the frontend in development mode.
   */
  private filteredKeys?: string[];
  private notifiedFilteredKeys = new Set<string>();

  /**
   * Instantiates the config reader from a list of application config objects.
   */
  static fromConfigs(configs: AppConfig[]): ConfigReader {
    if (configs.length === 0) {
      return new ConfigReader(undefined);
    }

    // Merge together all configs into a single config with recursive fallback
    // readers, giving the first config object in the array the lowest priority.
    return configs.reduce<ConfigReader>(
      (previousReader, { data, context, filteredKeys, deprecatedKeys }) => {
        const reader = new ConfigReader(data, context, previousReader);
        reader.filteredKeys = filteredKeys;

        if (deprecatedKeys) {
          for (const { key, description } of deprecatedKeys) {
            // eslint-disable-next-line no-console
            console.warn(
              `The configuration key '${key}' of ${context} is deprecated and may be removed soon. ${
                description || ''
              }`,
            );
          }
        }

        return reader;
      },
      undefined!,
    );
  }

  constructor(
    private readonly data: JsonObject | undefined,
    private readonly context: string = 'mock-config',
    private readonly fallback?: ConfigReader,
    private readonly prefix: string = '',
  ) {}

  /** {@inheritdoc Config.has} */
  has(key: string): boolean {
    const value = this.readValue(key);
    if (value === null) {
      return false;
    }
    if (value !== undefined) {
      return true;
    }
    return this.fallback?.has(key) ?? false;
  }

  /** {@inheritdoc Config.keys} */
  keys(): string[] {
    const localKeys = this.data ? Object.keys(this.data) : [];
    const fallbackKeys = this.fallback?.keys() ?? [];
    return [...new Set([...localKeys, ...fallbackKeys])].filter(
      k => this.data?.[k] !== null,
    );
  }

  /** {@inheritdoc Config.get} */
  get<T = JsonValue>(key?: string): T {
    const value = this.getOptional(key);
    if (value === undefined) {
      throw new Error(errors.missing(this.fullKey(key ?? ''), this.context));
    }
    return value as T;
  }

  /** {@inheritdoc Config.getOptional} */
  getOptional<T = JsonValue>(key?: string): T | undefined {
    const value = cloneDeep(this.readValue(key));
    const fallbackValue = this.fallback?.getOptional(key);

    if (value === null) {
      return undefined;
    }
    if (value === undefined) {
      if (process.env.NODE_ENV === 'development') {
        if (fallbackValue === undefined && key) {
          const fullKey = this.fullKey(key);
          if (
            this.filteredKeys?.includes(fullKey) &&
            !this.notifiedFilteredKeys.has(fullKey)
          ) {
            this.notifiedFilteredKeys.add(fullKey);
            // eslint-disable-next-line no-console
            console.warn(
              `Failed to read configuration value at '${fullKey}' as it is not visible. ` +
                'See https://backstage.io/docs/conf/defining#visibility for instructions on how to make it visible.',
            );
          }
        }
      }
      return merge(fallbackValue) as T;
    } else if (fallbackValue === undefined) {
      return merge(value) as T;
    }

    return merge(value, fallbackValue) as T;
  }

  /** {@inheritdoc Config.getConfig} */
  getConfig(key: string): ConfigReader {
    const value = this.getOptionalConfig(key);
    if (value === undefined) {
      throw new Error(errors.missing(this.fullKey(key), this.context));
    }
    return value;
  }

  /** {@inheritdoc Config.getOptionalConfig} */
  getOptionalConfig(key: string): ConfigReader | undefined {
    const value = this.readValue(key);
    const fallbackConfig = this.fallback?.getOptionalConfig(key);

    if (isObject(value)) {
      return this.copy(value, key, fallbackConfig);
    }
    if (value === null) {
      return undefined;
    }
    if (value !== undefined) {
      throw new TypeError(
        errors.type(this.fullKey(key), this.context, typeOf(value), 'object'),
      );
    }
    return fallbackConfig;
  }

  /** {@inheritdoc Config.getConfigArray} */
  getConfigArray(key: string): ConfigReader[] {
    const value = this.getOptionalConfigArray(key);
    if (value === undefined) {
      throw new Error(errors.missing(this.fullKey(key), this.context));
    }
    return value;
  }

  /** {@inheritdoc Config.getOptionalConfigArray} */
  getOptionalConfigArray(key: string): ConfigReader[] | undefined {
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

    if (!configs) {
      if (process.env.NODE_ENV === 'development') {
        const fullKey = this.fullKey(key);
        if (
          this.filteredKeys?.some(k => k.startsWith(fullKey)) &&
          !this.notifiedFilteredKeys.has(key)
        ) {
          this.notifiedFilteredKeys.add(key);
          // eslint-disable-next-line no-console
          console.warn(
            `Failed to read configuration array at '${key}' as it does not have any visible elements. ` +
              'See https://backstage.io/docs/conf/defining#visibility for instructions on how to make it visible.',
          );
        }
      }
      return undefined;
    }

    return configs.map((obj, index) => this.copy(obj, `${key}[${index}]`));
  }

  /** {@inheritdoc Config.getNumber} */
  getNumber(key: string): number {
    const value = this.getOptionalNumber(key);
    if (value === undefined) {
      throw new Error(errors.missing(this.fullKey(key), this.context));
    }
    return value;
  }

  /** {@inheritdoc Config.getOptionalNumber} */
  getOptionalNumber(key: string): number | undefined {
    const value = this.readConfigValue<string | number>(
      key,
      val =>
        typeof val === 'number' ||
        typeof val === 'string' || { expected: 'number' },
    );
    if (typeof value === 'number' || value === undefined) {
      return value;
    }
    const number = Number(value);
    if (!Number.isFinite(number)) {
      throw new Error(
        errors.convert(this.fullKey(key), this.context, 'number'),
      );
    }
    return number;
  }

  /** {@inheritdoc Config.getBoolean} */
  getBoolean(key: string): boolean {
    const value = this.getOptionalBoolean(key);
    if (value === undefined) {
      throw new Error(errors.missing(this.fullKey(key), this.context));
    }
    return value;
  }

  /** {@inheritdoc Config.getOptionalBoolean} */
  getOptionalBoolean(key: string): boolean | undefined {
    const value = this.readConfigValue<string | number | boolean>(
      key,
      val =>
        typeof val === 'boolean' ||
        typeof val === 'number' ||
        typeof val === 'string' || { expected: 'boolean' },
    );
    if (typeof value === 'boolean' || value === undefined) {
      return value;
    }
    const valueString = String(value).trim();

    if (/^(?:y|yes|true|1|on)$/i.test(valueString)) {
      return true;
    }
    if (/^(?:n|no|false|0|off)$/i.test(valueString)) {
      return false;
    }
    throw new Error(errors.convert(this.fullKey(key), this.context, 'boolean'));
  }

  /** {@inheritdoc Config.getString} */
  getString(key: string): string {
    const value = this.getOptionalString(key);
    if (value === undefined) {
      throw new Error(errors.missing(this.fullKey(key), this.context));
    }
    return value;
  }

  /** {@inheritdoc Config.getOptionalString} */
  getOptionalString(key: string): string | undefined {
    return this.readConfigValue(
      key,
      value =>
        (typeof value === 'string' && value !== '') || { expected: 'string' },
    );
  }

  /** {@inheritdoc Config.getStringArray} */
  getStringArray(key: string): string[] {
    const value = this.getOptionalStringArray(key);
    if (value === undefined) {
      throw new Error(errors.missing(this.fullKey(key), this.context));
    }
    return value;
  }

  /** {@inheritdoc Config.getOptionalStringArray} */
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

  private copy(data: JsonObject, key: string, fallback?: ConfigReader) {
    const reader = new ConfigReader(
      data,
      this.context,
      fallback,
      this.fullKey(key),
    );
    reader.filteredKeys = this.filteredKeys;
    return reader;
  }

  private readConfigValue<T extends JsonValue>(
    key: string,
    validate: (
      value: JsonValue,
    ) => { expected: string; value?: JsonValue; key?: string } | true,
  ): T | undefined {
    const value = this.readValue(key);

    if (value === undefined) {
      if (process.env.NODE_ENV === 'development') {
        const fullKey = this.fullKey(key);
        if (
          this.filteredKeys?.includes(fullKey) &&
          !this.notifiedFilteredKeys.has(fullKey)
        ) {
          this.notifiedFilteredKeys.add(fullKey);
          // eslint-disable-next-line no-console
          console.warn(
            `Failed to read configuration value at '${fullKey}' as it is not visible. ` +
              'See https://backstage.io/docs/conf/defining#visibility for instructions on how to make it visible.',
          );
        }
      }

      return this.fallback?.readConfigValue(key, validate);
    }
    if (value === null) {
      return undefined;
    }
    const result = validate(value);
    if (result !== true) {
      const { key: keyName = key, value: theValue = value, expected } = result;
      throw new TypeError(
        errors.type(
          this.fullKey(keyName),
          this.context,
          typeOf(theValue),
          expected,
        ),
      );
    }

    return value as T;
  }

  private readValue(key?: string): JsonValue | undefined {
    const parts = key ? key.split('.') : [];
    for (const part of parts) {
      if (!CONFIG_KEY_PART_PATTERN.test(part)) {
        throw new TypeError(`Invalid config key '${key}'`);
      }
    }

    if (this.data === undefined) {
      return undefined;
    }

    let value: JsonValue | undefined = this.data;
    for (const [index, part] of parts.entries()) {
      if (isObject(value)) {
        value = value[part];
      } else if (value !== undefined && value !== null) {
        const badKey = this.fullKey(parts.slice(0, index).join('.'));
        throw new TypeError(
          errors.type(badKey, this.context, typeOf(value), 'object'),
        );
      }
    }

    return value;
  }
}
