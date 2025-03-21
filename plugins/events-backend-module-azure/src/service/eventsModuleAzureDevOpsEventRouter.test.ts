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

import { createServiceFactory } from '@backstage/backend-plugin-api';
import { startTestBackend } from '@backstage/backend-test-utils';
import { TestEventsService } from '@backstage/plugin-events-backend-test-utils';
import { eventsServiceRef } from '@backstage/plugin-events-node';
import { eventsModuleAzureDevOpsEventRouter } from './eventsModuleAzureDevOpsEventRouter';

describe('eventsModuleAzureDevOpsEventRouter', () => {
  it('should be correctly wired and set up', async () => {
    const events = new TestEventsService();
    const eventsServiceFactory = createServiceFactory({
      service: eventsServiceRef,
      deps: {},
      async factory({}) {
        return events;
      },
    });

    await startTestBackend({
      features: [eventsServiceFactory, eventsModuleAzureDevOpsEventRouter],
    });

    expect(events.subscribed).toHaveLength(1);
    expect(events.subscribed[0].id).toEqual('AzureDevOpsEventRouter');
  });
});
