/*
 * Copyright 2026 The Backstage Authors
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

import { JsonObject } from '@backstage/types';
import Ajv, { ValidateFunction } from 'ajv';
import ajvErrors from 'ajv-errors';

class ExpiryMap<K, V> extends Map<K, V> {
  readonly #ttlMs: number;
  readonly #timestamps = new Map<K, number>();

  constructor(ttlMs: number) {
    super();
    this.#ttlMs = ttlMs;
  }

  set(key: K, value: V) {
    this.#timestamps.set(key, Date.now());
    return super.set(key, value);
  }

  get(key: K) {
    const timestamp = this.#timestamps.get(key);
    if (timestamp !== undefined && Date.now() - timestamp > this.#ttlMs) {
      this.delete(key);
      return undefined;
    }
    return super.get(key);
  }

  delete(key: K) {
    this.#timestamps.delete(key);
    return super.delete(key);
  }

  clear() {
    this.#timestamps.clear();
    return super.clear();
  }
}

/**
 * A helper that lazily compiles and caches AJV validators for JSON schemas,
 * with a time-based expiry to avoid holding on to stale entries indefinitely.
 */
export class SchemaValidator {
  readonly #ajv: Ajv;
  readonly #cache: ExpiryMap<JsonObject, ValidateFunction>;

  constructor(options?: { ttlMs?: number }) {
    this.#cache = new ExpiryMap(options?.ttlMs ?? 60 * 60 * 1000); // 1 hour
    this.#ajv = new Ajv({
      allowUnionTypes: true,
      allErrors: true,
      validateSchema: true,
    });
    ajvErrors(this.#ajv);
  }

  /**
   * Validates the given data against the provided JSON schema. Returns an
   * array of human-readable error strings, or an empty array if valid.
   */
  validate(schema: JsonObject, data: unknown): string[] {
    const validator = this.#getOrCompile(schema);
    const valid = validator(data);
    if (valid) {
      return [];
    }
    return (validator.errors ?? []).map(
      e =>
        `${e.instancePath || '<root>'} ${e.message}${
          e.params
            ? ` - ${Object.entries(e.params)
                .map(([key, val]) => `${key}: ${val}`)
                .join(', ')}`
            : ''
        }`,
    );
  }

  #getOrCompile(schema: JsonObject): ValidateFunction {
    const cached = this.#cache.get(schema);
    if (cached) {
      return cached;
    }

    const validator = this.#ajv.compile(schema);
    this.#cache.set(schema, validator);
    return validator;
  }
}
