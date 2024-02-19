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
import { techInsightsPlugin } from './plugin';

describe('techInsightsPlugin', () => {
  it('should register tech-insights plugin and its router', async () => {
    const httpRouterMock = mockServices.httpRouter.mock();

    await startTestBackend({
      extensionPoints: [],
      features: [
        techInsightsPlugin(),
        httpRouterMock.factory,
        mockServices.database.factory(),
        mockServices.logger.factory(),
        mockServices.rootConfig.factory({
          data: {
            techInsights: {
              factRetrievers: {
                entityOwnershipFactRetriever: {
                  cadence: '*/15 * * * *',
                  lifecycle: { timeToLive: { weeks: 2 } },
                },
              },
            },
          },
        }),
        mockServices.scheduler.factory(),
        mockServices.tokenManager.factory(),
      ],
    });

    expect(httpRouterMock.use).toHaveBeenCalledTimes(1);
  });
});
