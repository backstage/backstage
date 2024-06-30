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
import searchModuleExploreCollator from './alpha';

describe('searchModuleExploreCollator', () => {
  const schedule = {
    frequency: { minutes: 10 },
    timeout: { minutes: 15 },
    initialDelay: { seconds: 3 },
  };

  it('should register the explore collator to the search index registry extension point with factory and schedule', async () => {
    const extensionPointMock = {
      addCollator: jest.fn(),
    };

    await startTestBackend({
      extensionPoints: [
        [searchIndexRegistryExtensionPoint, extensionPointMock],
      ],
      features: [
        searchModuleExploreCollator,
        mockServices.rootConfig.factory({
          data: {
            search: {
              explore: {
                schedule,
              },
            },
          },
        }),
      ],
    });

    expect(extensionPointMock.addCollator).toHaveBeenCalledTimes(1);
    expect(extensionPointMock.addCollator).toHaveBeenCalledWith({
      factory: expect.objectContaining({ type: 'tools' }),
      schedule: expect.objectContaining({ run: expect.any(Function) }),
    });
  });
});
