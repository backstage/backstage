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
  mockServices,
  startTestBackend,
  TestDatabases,
} from '@backstage/backend-test-utils';
import { getMaxId } from './getMaxId';
import { EventsTableRow } from './tables';
import catalog from '@backstage/plugin-catalog-backend';
import {
  coreServices,
  createBackendModule,
} from '@backstage/backend-plugin-api';
import { catalogProcessingExtensionPoint } from '@backstage/plugin-catalog-node/alpha';
import { initializeDatabaseAfterCatalog } from './migrations';
import { createDeferred } from '@backstage/types';

jest.setTimeout(60_000);

describe('getMaxId', () => {
  const databases = TestDatabases.create();

  it.each(databases.eachSupportedId())('works, %p', async databaseId => {
    const knex = await databases.init(databaseId);

    const ready = createDeferred<void>();
    const backend = await startTestBackend({
      features: [
        mockServices.database.factory({ knex }),
        catalog,
        createBackendModule({
          pluginId: 'catalog',
          moduleId: 'test',
          register(reg) {
            reg.registerInit({
              deps: {
                database: coreServices.database,
                lifecycle: coreServices.lifecycle,
                catalogProcessing: catalogProcessingExtensionPoint,
              },
              async init(deps) {
                initializeDatabaseAfterCatalog(deps).then(
                  () => ready.resolve(),
                  e => ready.reject(e),
                );
              },
            });
          },
        }),
      ],
    });
    await ready;

    await expect(getMaxId(knex)).resolves.toBe('0');

    await knex<EventsTableRow>('module_history__events').insert({
      event_type: 't',
    });

    await expect(getMaxId(knex)).resolves.toBe('1');

    await backend.stop();
  });
});
