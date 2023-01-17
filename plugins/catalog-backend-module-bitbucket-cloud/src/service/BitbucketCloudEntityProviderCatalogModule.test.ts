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

import { coreServices } from '@backstage/backend-plugin-api';
import {
  PluginTaskScheduler,
  TaskScheduleDefinition,
} from '@backstage/backend-tasks';
import {
  startTestBackend,
  mockServices,
} from '@backstage/backend-test-utils/alpha';
import { catalogProcessingExtensionPoint } from '@backstage/plugin-catalog-node/alpha';
import { eventsExtensionPoint } from '@backstage/plugin-events-node/alpha';
import { Duration } from 'luxon';
import { bitbucketCloudEntityProviderCatalogModule } from './BitbucketCloudEntityProviderCatalogModule';
import { BitbucketCloudEntityProvider } from '../BitbucketCloudEntityProvider';

describe('bitbucketCloudEntityProviderCatalogModule', () => {
  it('should register provider at the catalog extension point', async () => {
    let addedProviders: Array<BitbucketCloudEntityProvider> | undefined;
    let addedSubscribers: Array<BitbucketCloudEntityProvider> | undefined;
    let usedSchedule: TaskScheduleDefinition | undefined;

    const catalogExtensionPointImpl = {
      addEntityProvider: (providers: any) => {
        addedProviders = providers;
      },
    };
    const eventsExtensionPointImpl = {
      addSubscribers: (subscribers: any) => {
        addedSubscribers = subscribers;
      },
    };
    const runner = jest.fn();
    const scheduler = {
      createScheduledTaskRunner: (schedule: TaskScheduleDefinition) => {
        usedSchedule = schedule;
        return runner;
      },
    } as unknown as PluginTaskScheduler;

    await startTestBackend({
      extensionPoints: [
        [catalogProcessingExtensionPoint, catalogExtensionPointImpl],
        [eventsExtensionPoint, eventsExtensionPointImpl],
      ],
      services: [
        mockServices.config.factory({
          data: {
            catalog: {
              providers: {
                bitbucketCloud: {
                  schedule: {
                    frequency: 'P1M',
                    timeout: 'PT3M',
                  },
                  workspace: 'test-ws',
                },
              },
            },
          },
        }),
        [coreServices.scheduler, scheduler],
      ],
      features: [bitbucketCloudEntityProviderCatalogModule()],
    });

    expect(usedSchedule?.frequency).toEqual(Duration.fromISO('P1M'));
    expect(usedSchedule?.timeout).toEqual(Duration.fromISO('PT3M'));
    expect(addedProviders?.length).toEqual(1);
    expect(addedProviders?.pop()?.getProviderName()).toEqual(
      'bitbucketCloud-provider:default',
    );
    expect(addedSubscribers).toEqual(addedProviders);
    expect(runner).not.toHaveBeenCalled();
  });
});
