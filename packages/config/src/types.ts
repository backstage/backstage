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

import { JsonObject, JsonValue } from '@backstage/core-types';

/**
 * A serialized form of configuration data that carries additional context.
 *
 * @public
 */
export type AppConfig = {
  /**
   * A string representing the source of this configuration data, for example a filepath.
   */
  context: string;
  /**
   * The configuration data itself.
   */
  data: JsonObject;
  /**
   * A list of keys that where filtered out from the configuration when it was loaded.
   *
   * This can be used to warn the user if they try to read any of these keys.
   */
  filteredKeys?: string[];
};

/**
 * The interface used to represent static configuration at runtime.
 *
 * @public
 */
export type Config = {
  /**
   * Subscribes to the configuration object in order to receive a notification
   * whenever any value within the configuration has changed.
   *
   * This method is optional to implement, and consumers need to check if it is
   * implemented before invoking it.
   */
  subscribe?(onChange: () => void): {
    unsubscribe: () => void;
  };

  /**
   * Checks whether the given key is present.
   */
  has(key: string): boolean;

  /**
   * Lists all available configuration keys.
   */
  keys(): string[];

  /**
   * Same as `getOptional`, but will throw an error if there's no value for the given key.
   */
  get<T = JsonValue>(key?: string): T;

  /**
   * Read out all configuration data for the given key.
   *
   * Usage of this method should be avoided as the typed alternatives provide
   * much better error reporting. The main use-case of this method is to determine
   * the type of a configuration value in the case where there are multiple possible
   * shapes of the configuration.
   */
  getOptional<T = JsonValue>(key?: string): T | undefined;

  /**
   * Same as `getOptionalConfig`, but will throw an error if there's no value for the given key.
   */
  getConfig(key: string): Config;

  /**
   * Creates a sub-view of the configuration object.
   * The configuration value at the position of the provided key must be an object.
   */
  getOptionalConfig(key: string): Config | undefined;

  /**
   * Same as `getOptionalConfigArray`, but will throw an error if there's no value for the given key.
   */
  getConfigArray(key: string): Config[];

  /**
   * Creates a sub-view of an array of configuration objects.
   * The configuration value at the position of the provided key must be an array of objects.
   */
  getOptionalConfigArray(key: string): Config[] | undefined;

  /**
   * Same as `getOptionalNumber`, but will throw an error if there's no value for the given key.
   */
  getNumber(key: string): number;

  /**
   * Reads a configuration value at the given key, expecting it to be a number.
   */
  getOptionalNumber(key: string): number | undefined;

  /**
   * Same as `getOptionalBoolean`, but will throw an error if there's no value for the given key.
   */
  getBoolean(key: string): boolean;

  /**
   * Reads a configuration value at the given key, expecting it to be a boolean.
   */
  getOptionalBoolean(key: string): boolean | undefined;

  /**
   * Same as `getOptionalString`, but will throw an error if there's no value for the given key.
   */
  getString(key: string): string;

  /**
   * Reads a configuration value at the given key, expecting it to be a string.
   */
  getOptionalString(key: string): string | undefined;

  /**
   * Same as `getOptionalStringArray`, but will throw an error if there's no value for the given key.
   */
  getStringArray(key: string): string[];

  /**
   * Reads a configuration value at the given key, expecting it to be an array of strings.
   */
  getOptionalStringArray(key: string): string[] | undefined;
};
