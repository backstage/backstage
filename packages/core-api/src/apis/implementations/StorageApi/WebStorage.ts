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
import { StorageApi } from '../../definitions';

export class WebStorage implements StorageApi {
  async getFromStore<T>(
    storeName: string,
    key: string = '',
    defaultValue?: T,
  ): Promise<T | undefined> {
    let store;
    try {
      store = JSON.parse(localStorage.getItem(storeName)!) || {};
    } catch (e) {
      window.console.error(
        `Error when parsing JSON config from storage for: ${storeName}`,
      );
      return defaultValue;
    }

    if (key) {
      return store[key] ?? defaultValue;
    }
    return store;
  }

  async saveToStore(storeName: string, key: string, data: any): Promise<void> {
    const store = JSON.parse(localStorage.getItem(storeName)!) || {};
    store[key] = data;
    localStorage.setItem(storeName, JSON.stringify(store));
  }

  async removeFromStore(storeName: string, key: string): Promise<void> {
    const store = JSON.parse(localStorage.getItem(storeName)!) || {};
    delete store[key];
    localStorage.setItem(storeName, JSON.stringify(store));
  }
}
