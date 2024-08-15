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

import {
  createServiceFactory,
  SchedulerServiceTaskScheduleDefinition,
} from '@backstage/backend-plugin-api';
import { mockServices, startTestBackend } from '@backstage/backend-test-utils';
import { EntityProviderConnection } from '@backstage/plugin-catalog-node';
import { catalogProcessingExtensionPoint } from '@backstage/plugin-catalog-node/alpha';
import { TestEventsService } from '@backstage/plugin-events-backend-test-utils';
import { eventsServiceRef } from '@backstage/plugin-events-node';
import { GitlabDiscoveryEntityProvider } from '../providers';
import { catalogModuleGitlabDiscoveryEntityProvider } from './catalogModuleGitlabDiscoveryEntityProvider';

describe('catalogModuleGitlabDiscoveryEntityProvider', () => {
  it('should register provider at the catalog extension point', async () => {
    const events = new TestEventsService();
    const eventsServiceFactory = createServiceFactory({
      service: eventsServiceRef,
      deps: {},
      async factory({}) {
        return events;
      },
    });
    let addedProviders: Array<GitlabDiscoveryEntityProvider> | undefined;
    let usedSchedule: SchedulerServiceTaskScheduleDefinition | undefined;

    const extensionPoint = {
      addEntityProvider: (providers: any) => {
        addedProviders = providers;
      },
    };
    const connection = jest.fn() as unknown as EntityProviderConnection;
    const runner = jest.fn();
    const scheduler = mockServices.scheduler.mock({
      createScheduledTaskRunner(schedule) {
        usedSchedule = schedule;
        return { run: runner };
      },
    });

    const config = {
      integrations: {
        gitlab: [
          {
            host: 'test-gitlab',
            apiBaseUrl: 'https://api.gitlab.example/api/v4',
            token: '1234',
          },
        ],
      },
      catalog: {
        providers: {
          gitlab: {
            'test-id': {
              host: 'test-gitlab',
              group: 'test-group',
              schedule: {
                frequency: 'P1M',
                timeout: 'PT3M',
              },
            },
          },
        },
      },
    };

    await startTestBackend({
      extensionPoints: [[catalogProcessingExtensionPoint, extensionPoint]],
      features: [
        eventsServiceFactory,
        catalogModuleGitlabDiscoveryEntityProvider,
        mockServices.rootConfig.factory({ data: config }),
        mockServices.logger.factory(),
        scheduler.factory,
      ],
    });

    expect(usedSchedule?.frequency).toEqual({ months: 1 });
    expect(usedSchedule?.timeout).toEqual({ minutes: 3 });
    expect(addedProviders?.length).toEqual(1);
    expect(runner).not.toHaveBeenCalled();

    const provider = addedProviders!.pop()!;
    expect(provider.getProviderName()).toEqual(
      'GitlabDiscoveryEntityProvider:test-id',
    );
    await provider.connect(connection);
    expect(events.subscribed).toHaveLength(1);
    expect(events.subscribed[0].id).toEqual(
      'GitlabDiscoveryEntityProvider:test-id',
    );
    expect(runner).toHaveBeenCalledTimes(1);
  });
});
