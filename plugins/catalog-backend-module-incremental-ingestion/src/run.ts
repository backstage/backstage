/*
 * Copyright 2022 The Backstage Authors
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

// eslint-disable-next-line import/no-extraneous-dependencies
import {
  databaseFactory,
  discoveryFactory,
  httpRouterFactory,
  lifecycleFactory,
  loggerFactory,
  permissionsFactory,
  rootLoggerFactory,
  schedulerFactory,
  tokenManagerFactory,
  urlReaderFactory,
} from '@backstage/backend-app-api';
import { coreServices } from '@backstage/backend-plugin-api';
import { startTestBackend } from '@backstage/backend-test-utils';
import { ConfigReader } from '@backstage/config';
import { catalogPlugin } from '@backstage/plugin-catalog-backend';
import {
  IncrementalEntityProvider,
  incrementalIngestionEntityProviderCatalogModule,
} from '.';

const provider: IncrementalEntityProvider<number, {}> = {
  getProviderName: () => 'test-provider',
  around: burst => burst(0),
  next: async (_context, cursor) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    if (cursor === undefined || cursor < 3) {
      console.log(`### Returning batch #${cursor}`);
      return { done: false, entities: [], cursor: (cursor ?? 0) + 1 };
    }

    console.log('### Last batch reached, stopping');
    return { done: true };
  },
};

async function main() {
  const config = {
    backend: {
      baseUrl: 'http://localhost:7007',
      listen: ':7007',
      database: { client: 'better-sqlite3', connection: ':memory:' },
    },
  };

  await startTestBackend({
    services: [
      [coreServices.config, new ConfigReader(config)],
      databaseFactory(),
      discoveryFactory(),
      httpRouterFactory(),
      lifecycleFactory(),
      loggerFactory(),
      permissionsFactory(),
      rootLoggerFactory(),
      schedulerFactory(),
      tokenManagerFactory(),
      urlReaderFactory(),
    ],
    extensionPoints: [],
    features: [
      catalogPlugin(),
      incrementalIngestionEntityProviderCatalogModule({
        providers: [
          {
            provider: provider,
            options: {
              burstInterval: { seconds: 1 },
              burstLength: { seconds: 10 },
              restLength: { seconds: 10 },
            },
          },
        ],
      }),
    ],
  });
}

main().catch(error => {
  console.error(error.stack);
  process.exit(1);
});
