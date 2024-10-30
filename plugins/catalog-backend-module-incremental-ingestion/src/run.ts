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

// Think this file will probably go away once we move to backend system
// And restructure into the /dev folder
// eslint-disable-next-line @backstage/no-undeclared-imports
import { createBackend } from '@backstage/backend-defaults';
import {
  coreServices,
  createBackendModule,
  createServiceFactory,
} from '@backstage/backend-plugin-api';
import { ConfigReader } from '@backstage/config';
import {
  IncrementalEntityProvider,
  incrementalIngestionProvidersExtensionPoint,
} from '.';
import catalogModuleIncrementalIngestionEntityProvider from './alpha';

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

  const backend = createBackend();

  backend.add(
    createServiceFactory({
      service: coreServices.rootConfig,
      deps: {},
      factory: () => new ConfigReader(config),
    }),
  );
  backend.add(import('@backstage/plugin-catalog-backend/alpha'));
  backend.add(catalogModuleIncrementalIngestionEntityProvider);
  backend.add(
    createBackendModule({
      pluginId: 'catalog',
      moduleId: 'incremental-test-provider',
      register(reg) {
        reg.registerInit({
          deps: { extension: incrementalIngestionProvidersExtensionPoint },
          async init({ extension }) {
            extension.addProvider({
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
    }),
  );

  await backend.start();
}

main().catch(error => {
  console.error(error.stack);
  process.exit(1);
});
