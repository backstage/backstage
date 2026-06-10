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

import {
  coreServices,
  createServiceFactory,
} from '@backstage/backend-plugin-api';
import { DefaultKeyValueStoreService } from './DefaultKeyValueStoreService';

/**
 * Persistent key-value store for backend plugins.
 *
 * See {@link @backstage/backend-plugin-api#KeyValueStoreService}
 * and {@link https://backstage.io/docs/backend-system/core-services/key-value-store | the service docs}
 * for more information.
 *
 * @public
 */
export const keyValueStoreServiceFactory = createServiceFactory({
  service: coreServices.keyValueStore,
  deps: {
    database: coreServices.database,
  },
  async factory({ database }) {
    return DefaultKeyValueStoreService.create({ database });
  },
});
