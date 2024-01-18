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
import { Duration } from 'luxon';
import { catalogModuleMicrosoftGraphOrgEntityProvider } from './catalogModuleMicrosoftGraphOrgEntityProvider';
import { MicrosoftGraphOrgEntityProvider } from '../processors';

describe('catalogModuleMicrosoftGraphOrgEntityProvider', () => {
  it('should register provider at the catalog extension point', async () => {
    let addedProviders: Array<MicrosoftGraphOrgEntityProvider> | undefined;
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
          microsoftGraphOrg: {
            customProviderId: {
              target: 'target',
              tenantId: 'tenantId',
              clientId: 'clientId',
              clientSecret: 'clientSecret',
              schedule: {
                frequency: 'PT30M',
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
        catalogModuleMicrosoftGraphOrgEntityProvider(),
        mockServices.rootConfig.factory({ data: config }),
        scheduler.factory,
      ],
    });

    expect(usedSchedule?.frequency).toEqual(Duration.fromISO('PT30M'));
    expect(usedSchedule?.timeout).toEqual(Duration.fromISO('PT3M'));
    expect(addedProviders?.length).toEqual(1);
    expect(addedProviders?.pop()?.getProviderName()).toEqual(
      'MicrosoftGraphOrgEntityProvider:customProviderId',
    );
    expect(runner).not.toHaveBeenCalled();
  });
});
