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

import { AwsOrganizationEntityProvider } from './AwsOrganizationProvider';
import { SchedulerServiceTaskRunner } from '@backstage/backend-plugin-api';
import { ConfigReader } from '@backstage/config';
import { mockServices } from '@backstage/backend-test-utils';
import { mockClient } from 'aws-sdk-client-mock';
import 'aws-sdk-client-mock-jest';
import {
  ListAccountsCommand,
  OrganizationsClient,
} from '@aws-sdk/client-organizations';
import { EntityProviderConnection } from '@backstage/plugin-catalog-node';

const logger = mockServices.logger.mock();
const scheduler = mockServices.scheduler.mock();

const taskRunner = {
  createScheduleFn: jest.fn(),
  run: jest.fn(),
} as SchedulerServiceTaskRunner;

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

const entityProviderConnection: EntityProviderConnection = {
  applyMutation: jest.fn(),
  refresh: jest.fn(),
};

describe('AwsOrganizationEntityProvider', () => {
  beforeEach(() => jest.clearAllMocks());
  scheduler.createScheduledTaskRunner.mockReturnValue(taskRunner);

  const organizationMock = mockClient(OrganizationsClient);

  it('no provider config', async () => {
    const config = new ConfigReader({});
    const providers = await AwsOrganizationEntityProvider.fromConfig(config, {
      logger,
      scheduler,
    });

    expect(providers).toHaveLength(0);
  });

  it('full refresh', async () => {
    organizationMock.on(ListAccountsCommand).resolves({
      Accounts: [
        {
          Arn: 'arn:aws:organizations::192594491037:account/o-1vl18kc5a3/957140518395',
          Name: 'Test Account',
          Email: 'aws-test-account@backstage.io',
          Status: 'ACTIVE',
        },
      ],
      NextToken: undefined,
    });

    const config = new ConfigReader({
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
    });
    const providers = await AwsOrganizationEntityProvider.fromConfig(config, {
      logger,
      scheduler,
    });

    expect(providers).toHaveLength(1);
    expect(providers[0].getProviderName()).toEqual('aws-org-provider:prod');

    const provider = providers[0];

    await provider.connect(entityProviderConnection);
    await provider.refresh(logger);

    expect(entityProviderConnection.applyMutation).toHaveBeenCalledTimes(1);
    expect(entityProviderConnection.applyMutation).toHaveBeenCalledWith({
      type: 'full',
      entities: [
        {
          entity: {
            apiVersion: 'backstage.io/v1alpha1',
            kind: 'Resource',
            metadata: {
              name: 'test-account',
              namespace: 'default',
              title: 'Test Account',
              annotations: {
                'amazonaws.com/account-email': 'aws-test-account@backstage.io',
                'amazonaws.com/account-id': '957140518395',
                'amazonaws.com/arn':
                  'arn:aws:organizations::192594491037:account/o-1vl18kc5a3/957140518395',
                'amazonaws.com/organization-id': 'o-1vl18kc5a3',
                'backstage.io/managed-by-location': 'aws:org',
                'backstage.io/managed-by-origin-location': 'aws:org',
              },
              labels: {
                'amazonaws.com/account-status': 'active',
              },
            },
            spec: {
              owner: 'unknown',
              type: 'cloud-account',
            },
          },
          locationKey: 'aws-org-provider:prod',
        },
      ],
    });
  });
});
