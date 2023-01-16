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

import { getVoidLogger } from '@backstage/backend-common';
import { coreServices } from '@backstage/backend-plugin-api';
import { startTestBackend } from '@backstage/backend-test-utils';
import { ConfigReader } from '@backstage/config';
import { catalogProcessingExtensionPoint } from '@backstage/plugin-catalog-node/alpha';
import { IncrementalEntityProvider } from '../types';
import { incrementalIngestionEntityProviderCatalogModule } from './incrementalIngestionEntityProviderCatalogModule';

describe('bitbucketServerEntityProviderCatalogModule', () => {
  it('should register provider at the catalog extension point', async () => {
    const provider1: IncrementalEntityProvider<number, {}> = {
      getProviderName: () => 'provider1',
      around: burst => burst(0),
      next: async (cursor, _context) => {
        return !cursor
          ? { done: false, entities: [], cursor: 1 }
          : { done: true };
      },
    };

    const addEntityProvider = jest.fn();
    const httpRouterUse = jest.fn();

    const scheduler = {};
    const database = {
      getClient: jest.fn(),
    };
    const httpRouter = {
      use: httpRouterUse,
    };

    await startTestBackend({
      extensionPoints: [
        [catalogProcessingExtensionPoint, { addEntityProvider }],
      ],
      services: [
        [coreServices.config, new ConfigReader({})],
        [coreServices.database, database],
        [coreServices.httpRouter, httpRouter],
        [coreServices.logger, getVoidLogger()],
        [coreServices.scheduler, scheduler],
      ],
      features: [
        incrementalIngestionEntityProviderCatalogModule({
          providers: [
            {
              provider: provider1,
              options: {
                burstInterval: { seconds: 1 },
                burstLength: { seconds: 1 },
                restLength: { seconds: 1 },
              },
            },
          ],
        }),
      ],
    });

    expect(addEntityProvider).toHaveBeenCalledTimes(1);
    expect(addEntityProvider.mock.calls[0][0].getProviderName()).toBe(
      'provider1',
    );
    expect(httpRouterUse).toHaveBeenCalledTimes(1);
  });
});
