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

import { mockServices, startTestBackend } from '@backstage/backend-test-utils';
import { incrementalIngestionProvidersExtensionPoint } from '@backstage/plugin-catalog-backend-module-incremental-ingestion';
import { catalogModuleMicrosoftGraphIncrementalEntityProvider } from './catalogModuleMicrosoftGraphIncrementalEntityProvider';
import { MicrosoftGraphIncrementalEntityProvider } from '../MicrosoftGraphIncrementalEntityProvider';

describe('catalogModuleMicrosoftGraphIncrementalEntityProvider', () => {
  it('registers the provider at the incremental ingestion extension point', async () => {
    const addProvider = jest.fn();
    const extensionPoint = { addProvider };

    await startTestBackend({
      extensionPoints: [
        [incrementalIngestionProvidersExtensionPoint, extensionPoint],
      ],
      features: [
        catalogModuleMicrosoftGraphIncrementalEntityProvider,
        mockServices.rootConfig.factory({
          data: {
            catalog: {
              providers: {
                microsoftGraphOrg: {
                  default: {
                    tenantId: 'tenant-id',
                    clientId: 'client-id',
                    clientSecret: 'client-secret',
                    schedule: {
                      frequency: 'PT12H',
                      timeout: 'PT4H',
                    },
                  },
                },
              },
            },
          },
        }),
      ],
    });

    expect(addProvider).toHaveBeenCalledTimes(1);
    const { provider, options } = addProvider.mock.calls[0][0];
    expect(provider).toBeInstanceOf(MicrosoftGraphIncrementalEntityProvider);
    expect(provider.getProviderName()).toBe(
      'MicrosoftGraphIncrementalEntityProvider:default',
    );
    expect(options.burstInterval).toEqual({ seconds: 3 });
    expect(options.burstLength).toEqual({ minutes: 5 });
    // restLength derived from schedule.frequency (12h)
    expect(options.restLength).toEqual({ hours: 12 });
  });

  it('creates one provider per config entry', async () => {
    const addProvider = jest.fn();
    const extensionPoint = { addProvider };

    await startTestBackend({
      extensionPoints: [
        [incrementalIngestionProvidersExtensionPoint, extensionPoint],
      ],
      features: [
        catalogModuleMicrosoftGraphIncrementalEntityProvider,
        mockServices.rootConfig.factory({
          data: {
            catalog: {
              providers: {
                microsoftGraphOrg: {
                  tenantA: {
                    tenantId: 'a',
                    clientId: 'c',
                    clientSecret: 's',
                  },
                  tenantB: {
                    tenantId: 'b',
                    clientId: 'c',
                    clientSecret: 's',
                  },
                },
              },
            },
          },
        }),
      ],
    });

    expect(addProvider).toHaveBeenCalledTimes(2);
  });

  it('defaults restLength to 8 hours when no schedule frequency is configured', async () => {
    const addProvider = jest.fn();
    const extensionPoint = { addProvider };

    await startTestBackend({
      extensionPoints: [
        [incrementalIngestionProvidersExtensionPoint, extensionPoint],
      ],
      features: [
        catalogModuleMicrosoftGraphIncrementalEntityProvider,
        mockServices.rootConfig.factory({
          data: {
            catalog: {
              providers: {
                microsoftGraphOrg: {
                  default: {
                    tenantId: 'tenant-id',
                    clientId: 'client-id',
                    clientSecret: 'client-secret',
                  },
                },
              },
            },
          },
        }),
      ],
    });

    const { options } = addProvider.mock.calls[0][0];
    expect(options.restLength).toEqual({ hours: 8 });
  });
});
