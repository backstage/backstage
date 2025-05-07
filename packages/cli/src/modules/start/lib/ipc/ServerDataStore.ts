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

import { IpcServer } from './IpcServer';

interface StorageItem {
  generation: number;
  data: unknown;
}

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

export class ServerDataStore {
  static bind(server: IpcServer): void {
    const store = new Map<string, StorageItem>();

    server.registerMethod<SaveRequest, SaveResponse>(
      'DevDataStore.save',
      async (request, { generation }) => {
        const { key, data } = request;
        if (!key) {
          throw new Error('Key is required in DevDataStore.save');
        }

        const item = store.get(key);

        if (!item) {
          store.set(key, { generation, data });
          return { saved: true };
        }

        if (item.generation > generation) {
          return { saved: false };
        }

        store.set(key, { generation, data });
        return { saved: true };
      },
    );

    server.registerMethod<LoadRequest, LoadResponse>(
      'DevDataStore.load',
      async request => {
        const item = store.get(request.key);
        return { loaded: Boolean(item), data: item?.data };
      },
    );
  }
}
