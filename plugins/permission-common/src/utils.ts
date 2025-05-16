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

export class ExpiryMap<K, V> extends Map<K, V> {
  #ttlMs: number;
  #timestamps: Map<K, number> = new Map();

  constructor(ttlMs: number) {
    super();
    this.#ttlMs = ttlMs;
  }

  set(key: K, value: V) {
    this.prune();
    const result = super.set(key, value);
    this.#timestamps.set(key, Date.now());
    return result;
  }

  get(key: K) {
    this.prune();
    if (!this.has(key)) {
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

  prune() {
    const now = new Date().getTime();
    this.#timestamps.forEach((val, key) => {
      if (now - val > this.#ttlMs) {
        this.#timestamps.delete(key);
        super.delete(key);
      }
    });
  }
}
