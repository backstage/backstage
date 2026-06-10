/*
 * Copyright 2025 The Backstage Authors
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

import { z } from 'zod/v4';

/**
 * An entry in a key-value store namespace.
 *
 * @public
 */
export type KeyValueStoreNamespaceEntry<TOutput> = {
  key: string;
  value: TOutput;
};

/**
 * A schema-validated, typed namespace within a key-value store.
 *
 * Values are parsed through the namespace's Zod schema on both read and write.
 * On read, schema defaults and transforms are applied, enabling seamless
 * migration of stored data shapes over time.
 *
 * @public
 */
export interface KeyValueStoreNamespace<TInput, TOutput> {
  /**
   * Reads the value associated with the given key. Returns `undefined` if
   * the key does not exist. The stored value is parsed through the namespace's
   * schema, applying any defaults or transforms.
   */
  get(key: string): Promise<TOutput | undefined>;

  /**
   * Writes the given value associated with the given key. The value is parsed
   * through the namespace's schema before storage. If the key already exists
   * its value is overwritten.
   */
  set(key: string, value: TInput): Promise<void>;

  /**
   * Removes the given key and its value. It is not an error to delete a key
   * that does not exist.
   */
  delete(key: string): Promise<void>;

  /**
   * Returns all keys present in this namespace.
   */
  listKeys(): Promise<string[]>;

  /**
   * Returns all entries in this namespace as key-value pairs. Each value is
   * parsed through the namespace's schema.
   */
  list(): Promise<KeyValueStoreNamespaceEntry<TOutput>[]>;
}

/**
 * A persistent, plugin-scoped key-value store backed by the plugin's own
 * database. All access goes through schema-validated namespaces created via
 * {@link KeyValueStoreService.withSchema}.
 *
 * See the {@link https://backstage.io/docs/backend-system/core-services/key-value-store | service documentation} for more details.
 *
 * @public
 */
export interface KeyValueStoreService {
  /**
   * Creates a typed namespace within the key-value store. The provided Zod
   * schema is used to validate values on both read and write. Schema defaults
   * and transforms applied during reads enable seamless migration of stored
   * data shapes over time.
   *
   * @param options - The namespace name and Zod schema
   * @returns A typed namespace scoped to the given schema
   */
  withSchema<TSchema extends z.ZodType>(options: {
    /**
     * The namespace name. Must be a non-empty string matching `[a-z0-9-]+`.
     */
    namespace: string;
    /**
     * A Zod schema used to validate and transform values on read and write.
     */
    schema: TSchema;
  }): KeyValueStoreNamespace<z.input<TSchema>, z.output<TSchema>>;
}
