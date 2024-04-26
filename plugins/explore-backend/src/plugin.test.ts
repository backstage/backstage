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

import { mockServices, startTestBackend } from '@backstage/backend-test-utils';
import { ExploreTool } from '@backstage/plugin-explore-common';
import { explorePlugin } from './plugin';

describe('explorePlugin', () => {
  it('should register explore plugin and its router', async () => {
    const tool: ExploreTool = {
      title: 'Tool Title',
      image: 'https://example.com/image.png',
      url: 'https://example.com',
      lifecycle: 'production',
      tags: ['tag1', 'tag2'],
    };

    const httpRouterMock = mockServices.httpRouter.mock();

    await startTestBackend({
      extensionPoints: [],
      features: [
        explorePlugin(),
        httpRouterMock.factory,
        mockServices.rootConfig.factory({
          data: {
            explore: {
              tools: [tool],
            },
          },
        }),
      ],
    });

    expect(httpRouterMock.use).toHaveBeenCalledTimes(1);
  });
});
