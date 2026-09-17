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

import { mockServices, startTestBackend } from '@backstage/backend-test-utils';
import { searchIndexRegistryExtensionPoint } from '@backstage/plugin-search-backend-node/alpha';
import { searchModuleCatalogCollator } from './module';

describe('searchModuleCatalogCollator', () => {
  it('should register the catalog collator to the search index registry extension point with factory and schedule', async () => {
    const extensionPointMock = {
      addCollator: jest.fn(),
    };

    await startTestBackend({
      extensionPoints: [
        [searchIndexRegistryExtensionPoint, extensionPointMock],
      ],
      features: [searchModuleCatalogCollator],
    });

    expect(extensionPointMock.addCollator).toHaveBeenCalledTimes(1);
    expect(extensionPointMock.addCollator).toHaveBeenCalledWith({
      factory: expect.objectContaining({ type: 'software-catalog' }),
      schedule: expect.objectContaining({ run: expect.any(Function) }),
    });
  });

  it('refuses to start up with a broken schedule', async () => {
    await expect(
      startTestBackend({
        extensionPoints: [
          [
            searchIndexRegistryExtensionPoint,
            {
              addCollator: jest.fn(),
            },
          ],
        ],
        features: [
          searchModuleCatalogCollator,
          mockServices.rootConfig.factory({
            data: {
              search: {
                collators: {
                  catalog: {
                    schedule: {
                      frequency: { minutes: 10 },
                      timeout: { minutes: 'boo' },
                      initialDelay: { seconds: 3 },
                    },
                  },
                },
              },
            },
          }),
        ],
      }),
    ).rejects.toThrow(/Invalid schedule/);
  });
});
