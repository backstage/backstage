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

import {
  coreServices,
  createServiceFactory,
  SchedulerServiceTaskScheduleDefinition,
} from '@backstage/backend-plugin-api';
import { mockServices, startTestBackend } from '@backstage/backend-test-utils';
import { catalogProcessingExtensionPoint } from '@backstage/plugin-catalog-node/alpha';
import { AwsOrganizationEntityProvider } from '../providers/AwsOrganizationProvider';
import { Duration } from 'luxon';
import { catalogModuleAwsOrganization } from './module';

const mockCredentialProvider = {
  sdkCredentialProvider: jest.fn(),
};

const mockCredentialsManager = {
  getCredentialProvider: () => mockCredentialProvider,
};

jest.mock('@backstage/integration-aws-node', () => ({
  DefaultAwsCredentialsManager: {
    fromConfig: () => mockCredentialsManager,
  },
}));

describe('catalogModuleAwsOrganizationEntityProvider', () => {
  it('should register provider at the catalog extension point', async () => {
    let addedProviders: Array<AwsOrganizationEntityProvider> | undefined;
    let usedSchedule: SchedulerServiceTaskScheduleDefinition | undefined;

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
          'aws-org': {
            prod: {
              accountId: '123456789012',
              schedule: {
                frequency: 'P1M',
                timeout: 'PT3M',
              },
            },
          },
        },
      },
      integrations: {
        aws: {
          accounts: [
            {
              accountId: '123456789012',
              roleName: 'backstage',
            },
          ],
        },
      },
    };

    await startTestBackend({
      extensionPoints: [[catalogProcessingExtensionPoint, extensionPoint]],
      features: [
        catalogModuleAwsOrganization(),
        mockServices.rootConfig.factory({ data: config }),
        mockServices.logger.factory(),
        createServiceFactory(() => ({
          deps: {},
          service: coreServices.scheduler,
          factory: async () => scheduler,
        })),
      ],
    });

    expect(usedSchedule?.frequency).toEqual(Duration.fromISO('P1M'));
    expect(usedSchedule?.timeout).toEqual(Duration.fromISO('PT3M'));
    expect(addedProviders?.length).toEqual(1);
    expect(addedProviders?.pop()?.getProviderName()).toEqual(
      'aws-org-provider:prod',
    );
    expect(runner).not.toHaveBeenCalled();
  });
});
