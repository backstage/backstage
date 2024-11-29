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
import { ErrorApi, IdentityApi } from '@backstage/core-plugin-api';
import { VisitsStorageApi } from './VisitsStorageApi';
import { WebStorage } from '@backstage/core-app-api';

/** @public */
export type VisitsWebStorageApiOptions = {
  limit?: number;
  identityApi: IdentityApi;
  errorApi: ErrorApi;
};

/**
 * @public
 * This is a reference implementation of VisitsApi using WebStorage.
 */
export class VisitsWebStorageApi {
  static create(options: VisitsWebStorageApiOptions) {
    return VisitsStorageApi.create({
      limit: options.limit,
      identityApi: options.identityApi,
      storageApi: WebStorage.create({ errorApi: options.errorApi }),
    });
  }
}
