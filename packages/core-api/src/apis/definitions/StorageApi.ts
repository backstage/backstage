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

import { createApiRef } from '../ApiRef';

type UnsubscribeFromStore = () => void;
type SubscribeToStoreHandler<T> = ({
  storeName,
  key,
  oldValue,
  newValue,
}: {
  storeName: string;
  key: string;
  oldValue?: T;
  newValue?: T;
}) => void;

export type StorageApi = {
  /**
   * Get persistent data.
   * @param {String} storeName Name of the store.
   * @param {String?} key (Optional) Unique key associated with the data.
   * If not key is specified,the whole store is returned.
   * @param {String} key (Optional) Empty value to return if there is not data.
   * @return {Object} data The data that should is stored.
   */
  getFromStore<T>(
    storeName: string,
    key: string,
    defaultValue?: T,
  ): Promise<T | undefined>;

  /**
   * Remove persistent data.
   *
   * @param {String} storeName Name of the store.
   * @param {String} key Unique key associated with the data.
   */
  removeFromStore(storeName: string, key: string): Promise<void>;

  /**
   * Save persiswtent data.
   *
   * @param {String} storeName Name of the store.
   * @param {String} key Unique key associated with the data.
   * @param {Object} data The data that should be stored.
   */
  saveToStore(storeName: string, key: string, data: any): Promise<void>;

  /**
   * Callback for Changes in the store
   * @callback subscribeHandler
   * @param {String} storeName Name of the store.
   * @param {String} key Unique key associated with the data.
   * @param {Object} oldValue The old value that was in the store.
   * @param {Object} newValue The new value that has been set in the store.
   */
  /**
   * Subscribe to Key changes in a store and get the new and old value
   *
   * @param {String} storeName Name of the store.
   * @param {String} key Unique key associated with the data.
   * @param {subscribeHandler} handler Handler which is called with the old value and new value in the store.
   * @returns {Function} Unsubscribe to changes in the store.
   */
  subscribeToChange<T>(
    storeName: string,
    key: string,
    handler: SubscribeToStoreHandler<T>,
  ): UnsubscribeFromStore;
};

export const storageApiRef = createApiRef<StorageApi>({
  id: 'core.user.settings',
  description:
    'Provides the ability to modify settings that are personalised to the user',
});
