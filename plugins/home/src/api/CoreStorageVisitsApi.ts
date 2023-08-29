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
import { StorageApi } from '@backstage/core-plugin-api';
import { Visit } from './VisitsApi';
import { VisitsApiFactory } from './VisitsApiFactory';

/**
 * @public
 * This is an implementation of VisitsApi that relies on a StorageApi
 */
export class CoreStorageVisitsApi extends VisitsApiFactory {
  private readonly storageApi: StorageApi;
  private readonly storageKey = '@backstage/plugin-home:visits';

  constructor({
    storageApi,
    randomUUID = window?.crypto?.randomUUID,
    limit = 100,
  }: {
    storageApi: StorageApi;
    randomUUID?: Window['crypto']['randomUUID'];
    limit?: number;
  }) {
    super({ randomUUID, limit });
    this.storageApi = storageApi;
    this.retrieveAll = async (): Promise<Array<Visit>> => {
      let visits: Array<Visit>;
      try {
        visits =
          this.storageApi.snapshot<Array<Visit>>(this.storageKey).value ?? [];
      } catch {
        visits = [];
      }
      return visits;
    };
    this.persistAll = async (visits: Array<Visit>) =>
      this.storageApi.set<Array<Visit>>(this.storageKey, visits);
  }
}
