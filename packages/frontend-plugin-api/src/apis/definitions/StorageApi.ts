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

import { ApiRef, createApiRef } from '../system';
import { JsonValue, Observable } from '@backstage/types';

/**
 * A snapshot in time of the current known value of a storage key.
 *
 * @public
 */
export type StorageValueSnapshot<TValue extends JsonValue> =
  | {
      key: string;
      presence: 'unknown' | 'absent';
      value?: undefined;
    }
  | {
      key: string;
      presence: 'present';
      value: TValue;
    };

/**
 * Provides a key-value persistence API.
 *
 * @public
 */
export interface StorageApi {
  /**
   * Create a bucket to store data in.
   *
   * @param name - Namespace for the storage to be stored under,
   *               will inherit previous namespaces too
   */
  forBucket(name: string): StorageApi;

  /**
   * Remove persistent data.
   *
   * @param key - Unique key associated with the data.
   */
  remove(key: string): Promise<void>;

  /**
   * Save persistent data, and emit messages to anyone that is using
   * {@link StorageApi.observe$} for this key.
   *
   * @param key - Unique key associated with the data.
   * @param data - The data to be stored under the key.
   */
  set<T extends JsonValue>(key: string, data: T): Promise<void>;

  /**
   * Observe the value over time for a particular key in the current bucket.
   *
   * @remarks
   *
   * The observable will only emit values when the value changes in the underlying
   * storage, although multiple values with the same shape may be emitted in a row.
   *
   * If a {@link StorageApi.snapshot} of a key is retrieved and the presence is
   * `'unknown'`, then you are guaranteed to receive a snapshot with a known
   * presence, as long as you observe the key within the same tick.
   *
   * Since the emitted values are shared across all subscribers, it is important
   * not to mutate the returned values. The values may be frozen as a precaution.
   *
   * @param key - Unique key associated with the data
   */
  observe$<T extends JsonValue>(
    key: string,
  ): Observable<StorageValueSnapshot<T>>;

  /**
   * Returns an immediate snapshot value for the given key, if possible.
   *
   * @remarks
   *
   * Combine with {@link StorageApi.observe$} to get notified of value changes.
   *
   * Note that this method is synchronous, and some underlying storages may be
   * unable to retrieve a value using this method - the result may or may not
   * consistently have a presence of 'unknown'. Use {@link StorageApi.observe$}
   * to be sure to receive an actual value eventually.
   */
  snapshot<T extends JsonValue>(key: string): StorageValueSnapshot<T>;
}

/**
 * The {@link ApiRef} of {@link StorageApi}.
 *
 * @public
 */
export const storageApiRef: ApiRef<StorageApi> = createApiRef({
  id: 'core.storage',
});
