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

type setValue<T> = (value: T | null) => void;
type removeValue = () => void;
export type UserSettingsApi = {
  /**
   * Get persistent data.
   *
   * TODO: Replace with something less volatile than LocalStorage
   *
   * @param {String} storeName Name of the store.
   * @param {String?} key (Optional) Unique key associated with the data.
   * If not key is specified,the whole store is returned.
   * @param {String} key (Optional) Empty value to return if there is not data.
   * @return {Object} data The data that should is stored.
   */
  getFromStore<T>(
    storeName: string,
    key: string,
    defaultValue: T | null,
  ): T | null;
  /**
   * Remove persistent data.
   *
   * TODO: Replace with something less volatile than LocalStorage
   *
   * @param {String} storeName Name of the store.
   * @param {String} key Unique key associated with the data.
   */
  removeFromStore(storeName: string, key: string): void;

  /**
   * Save persistent data.
   *
   * TODO: Replace with something less volatile than LocalStorage
   *
   * @param {String} storeName Name of the store.
   * @param {String} key Unique key associated with the data.
   * @param {Object} data The data that should be stored.
   */
  saveToStore(storeName: string, key: string, data: any): void;

  /**
   * React hook that observes a single store value and provides functions for updating the value.
   *
   * @param {String} storeName Name of the store.
   * @param {String} key Unique key associated with the data.
   * @return {[value, setValue(value), removeValue()]} An array to be deconstructed,
   * The first element is the value, the second is a function to call to update the value,
   * and the third is a function to call to clear the value.
   */
  useStoreValue<T>(
    storeName: string,
    key: string,
  ): [T | null, setValue<T | null>, removeValue];
};

export const userSettingsApiRef = createApiRef<UserSettingsApi>({
  id: 'core.user.settings',
  description:
    'Provides the ability to modify settings that are personalised to the user',
});
