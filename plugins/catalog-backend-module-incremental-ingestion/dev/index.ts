/*
 * Copyright 2024 The Backstage Authors
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

import { createBackend } from '@backstage/backend-defaults';
import {
  coreServices,
  createBackendModule,
} from '@backstage/backend-plugin-api';
import { mockServices } from '@backstage/backend-test-utils';
import {
  IncrementalEntityProvider,
  incrementalIngestionProvidersExtensionPoint,
} from '../src';

const dummyProvider = createBackendModule({
  pluginId: 'catalog',
  moduleId: 'incremental-test-provider',
  register(reg) {
    reg.registerInit({
      deps: {
        logger: coreServices.logger,
        providers: incrementalIngestionProvidersExtensionPoint,
      },
      async init({ logger, providers }) {
        const provider: IncrementalEntityProvider<number, {}> = {
          getProviderName: () => 'test-provider',
          around: burst => burst(0),
          next: async (_context, cursor) => {
            await new Promise(resolve => setTimeout(resolve, 500));
            if (cursor === undefined || cursor < 3) {
              logger.info(`### Returning batch #${cursor}`);
              return { done: false, entities: [], cursor: (cursor ?? 0) + 1 };
            }

            logger.info('### Last batch reached, stopping');
            return { done: true };
          },
        };

        providers.addProvider({
          provider: provider,
          options: {
            burstInterval: { seconds: 1 },
            burstLength: { seconds: 10 },
            restLength: { seconds: 10 },
          },
        });
      },
    });
  },
});

const backend = createBackend();
backend.add(
  mockServices.rootConfig.factory({
    data: {
      backend: {
        baseUrl: 'http://localhost:7007',
        listen: ':7007',
        database: { client: 'better-sqlite3', connection: ':memory:' },
      },
    },
  }),
);
backend.add(import('@backstage/plugin-catalog-backend'));
backend.add(import('../src'));
backend.add(dummyProvider);
backend.start();
