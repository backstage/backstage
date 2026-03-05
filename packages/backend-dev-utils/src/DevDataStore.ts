/*
 * Copyright 2023 The Backstage Authors
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

import { BackstageIpcClient, ipcClient } from './ipcClient';

interface SaveRequest {
  key: string;
  data: unknown;
}

interface SaveResponse {
  saved: boolean;
}

interface LoadRequest {
  key: string;
}

interface LoadResponse {
  loaded: boolean;
  data: unknown;
}

/**
 * A data store that can be used to store temporary data during development.
 *
 * @public
 */
export class DevDataStore {
  static #instance?: DevDataStore;

  /**
   * Tries to acquire a DevDataStore instance. This will only succeed when the backend
   * process is being run through the `@backstage/cli` in development mode.
   *
   * @returns A DevDataStore instance, or undefined if not available.
   */
  static get(): DevDataStore | undefined {
    if (ipcClient) {
      if (!this.#instance) {
        this.#instance = new DevDataStore(ipcClient);
      }
      return this.#instance;
    }
    return undefined;
  }

  /** @internal */
  static forTest(client: Pick<BackstageIpcClient, 'request'>): DevDataStore {
    return new DevDataStore(client as BackstageIpcClient);
  }

  #client: BackstageIpcClient;

  private constructor(client: BackstageIpcClient) {
    this.#client = client;
  }

  /**
   * Save data to the data store.
   *
   * @param key - The key used to identify the data.
   * @param data - The data to save. The data will be serialized using advanced IPC serialization.
   * @returns A promise that resolves to a result object that indicates whether the data was saved.
   */
  async save<T>(key: string, data: T): Promise<{ saved: boolean }> {
    return this.#client.request<SaveRequest, SaveResponse>(
      'DevDataStore.save',
      { key, data },
    );
  }

  /**
   * Loads data from the data store.
   *
   * @param key - The key used to identify the data.
   * @returns A promise that resolves to a result object that indicates whether the data was loaded, as well as the data.
   */
  async load<T>(key: string): Promise<{ loaded: boolean; data: T }> {
    const result = await this.#client.request<LoadRequest, LoadResponse>(
      'DevDataStore.load',
      { key },
    );
    return result as { loaded: boolean; data: T };
  }
}
