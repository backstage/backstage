/*
 * Copyright 2026 The Backstage Authors
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
import { createBackendModule } from '@backstage/backend-plugin-api';
import { incrementalIngestionProvidersExtensionPoint } from '@backstage/plugin-catalog-backend-module-incremental-ingestion';
import { IncreasingNumberIncrementalIngestionProvider } from '../providers/IncreasingNumberIncrementalIngestionProvider';

export const catalogModuleCustomIncrementalIngestionProvider =
  createBackendModule({
    pluginId: 'catalog',
    moduleId: 'custom-incremental-ingestion-provider',
    register(env) {
      env.registerInit({
        deps: {
          incrementalBuilder: incrementalIngestionProvidersExtensionPoint,
        },
        async init({ incrementalBuilder }) {
          const demoProviders = [
            new IncreasingNumberIncrementalIngestionProvider({
              providerName: 'IncreasingNumberIncrementalIngestionProvider',
              source: 'demo-default',
              totalEntities: 10_000,
              batchSize: 100,
              delayMs: 0,
            }),
            new IncreasingNumberIncrementalIngestionProvider({
              providerName: 'SlowIncreasingNumberIncrementalIngestionProvider',
              source: 'demo-slow',
              totalEntities: 10_000,
              batchSize: 100,
              delayMs: 600,
            }),
            new IncreasingNumberIncrementalIngestionProvider({
              providerName: 'HugeIncreasingNumberIncrementalIngestionProvider',
              source: 'demo-huge',
              totalEntities: 500_000,
              batchSize: 250,
              delayMs: 50,
            }),
          ];

          const options = {
            burstLength: { seconds: 3 },
            burstInterval: { seconds: 3 },
            restLength: { days: 1 },
            backoff: [
              { seconds: 5 },
              { seconds: 30 },
              { minutes: 10 },
              { hours: 3 },
            ],
            rejectRemovalsAbovePercentage: 5,
            rejectEmptySourceCollections: true,
          };

          for (const provider of demoProviders) {
            incrementalBuilder.addProvider({
              provider,
              options,
            });
          }
        },
      });
    },
  });
