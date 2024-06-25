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

import { TaskScheduleDefinition } from '@backstage/backend-tasks';
import { mockServices, startTestBackend } from '@backstage/backend-test-utils';
import { catalogProcessingExtensionPoint } from '@backstage/plugin-catalog-node/alpha';
import { catalogModuleAzureDevOpsEntityProvider } from './catalogModuleAzureDevOpsEntityProvider';
import { AzureDevOpsEntityProvider } from '../providers';

describe('catalogModuleAzureDevOpsEntityProvider', () => {
  it('should register provider at the catalog extension point', async () => {
    let addedProviders: Array<AzureDevOpsEntityProvider> | undefined;
    let usedSchedule: TaskScheduleDefinition | undefined;

    const extensionPoint = {
      addEntityProvider: (providers: any) => {
        addedProviders = providers;
      },
    };
    const runner = jest.fn();
    const scheduler = mockServices.scheduler.mock({
      createScheduledTaskRunner(schedule) {
        usedSchedule = schedule;
        return { run: runner };
      },
    });

    const config = {
      catalog: {
        providers: {
          azureDevOps: {
            test: {
              organization: 'myorganization',
              project: 'myproject',
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
        catalogModuleAzureDevOpsEntityProvider,
        mockServices.rootConfig.factory({ data: config }),
        mockServices.logger.factory(),
        scheduler.factory,
      ],
    });

    expect(usedSchedule?.frequency).toEqual({ months: 1 });
    expect(usedSchedule?.timeout).toEqual({ minutes: 3 });
    expect(addedProviders?.length).toEqual(1);
    expect(addedProviders?.pop()?.getProviderName()).toEqual(
      'AzureDevOpsEntityProvider:test',
    );
    expect(runner).not.toHaveBeenCalled();
  });
});
