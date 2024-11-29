/*
 * Copyright 2021 The Backstage Authors
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
  SchedulerService,
  SchedulerServiceTaskRunner,
  SchedulerServiceTaskInvocationDefinition,
} from '@backstage/backend-plugin-api';
import { ConfigReader } from '@backstage/config';
import {
  ANNOTATION_LOCATION,
  ANNOTATION_ORIGIN_LOCATION,
  GroupEntity,
  UserEntity,
} from '@backstage/catalog-model';
import { EntityProviderConnection } from '@backstage/plugin-catalog-node';
import {
  MicrosoftGraphClient,
  MICROSOFT_GRAPH_USER_ID_ANNOTATION,
  readMicrosoftGraphOrg,
} from '../microsoftGraph';
import {
  MicrosoftGraphOrgEntityProvider,
  withLocations,
} from './MicrosoftGraphOrgEntityProvider';
import { mockServices } from '@backstage/backend-test-utils';

jest.mock('../microsoftGraph', () => {
  return {
    ...jest.requireActual('../microsoftGraph'),
    readMicrosoftGraphOrg: jest.fn(),
  };
});

const readMicrosoftGraphOrgMocked = readMicrosoftGraphOrg as jest.Mock<
  Promise<{ users: UserEntity[]; groups: GroupEntity[] }>
>;

class PersistingTaskRunner implements SchedulerServiceTaskRunner {
  private tasks: SchedulerServiceTaskInvocationDefinition[] = [];

  getTasks() {
    return this.tasks;
  }

  run(task: SchedulerServiceTaskInvocationDefinition): Promise<void> {
    this.tasks.push(task);
    return Promise.resolve(undefined);
  }
}

describe('MicrosoftGraphOrgEntityProvider', () => {
  beforeEach(() => {
    jest
      .spyOn(MicrosoftGraphClient, 'create')
      .mockReturnValue({} as unknown as MicrosoftGraphClient);

    readMicrosoftGraphOrgMocked.mockResolvedValue({
      users: [
        {
          apiVersion: 'backstage.io/v1alpha1',
          kind: 'User',
          metadata: {
            name: 'u1',
          },
          spec: {
            memberOf: [],
          },
        },
      ],
      groups: [
        {
          apiVersion: 'backstage.io/v1alpha1',
          kind: 'Group',
          metadata: {
            name: 'g1',
          },
          spec: {
            type: 'team',
            children: [],
          },
        },
      ],
    });
  });

  afterEach(() => jest.resetAllMocks());

  const logger = mockServices.logger.mock();
  const taskRunner = new PersistingTaskRunner();
  const scheduler = {
    createScheduledTaskRunner: (_: any) => taskRunner,
  } as unknown as SchedulerService;
  const entityProviderConnection: EntityProviderConnection = {
    applyMutation: jest.fn(),
    refresh: jest.fn(),
  };

  const expectedMutation = {
    entities: [
      {
        entity: {
          apiVersion: 'backstage.io/v1alpha1',
          kind: 'User',
          metadata: {
            annotations: {
              'backstage.io/managed-by-location': 'msgraph:customProviderId/u1',
              'backstage.io/managed-by-origin-location':
                'msgraph:customProviderId/u1',
            },
            name: 'u1',
          },
          spec: {
            memberOf: [],
          },
        },
        locationKey: 'msgraph-org-provider:customProviderId',
      },
      {
        entity: {
          apiVersion: 'backstage.io/v1alpha1',
          kind: 'Group',
          metadata: {
            annotations: {
              'backstage.io/managed-by-location': 'msgraph:customProviderId/g1',
              'backstage.io/managed-by-origin-location':
                'msgraph:customProviderId/g1',
            },
            name: 'g1',
          },
          spec: {
            children: [],
            type: 'team',
          },
        },
        locationKey: 'msgraph-org-provider:customProviderId',
      },
    ],
    type: 'full',
  };

  it('should apply mutation - manual', async () => {
    const config = new ConfigReader({
      catalog: {
        providers: {
          microsoftGraphOrg: {
            customProviderId: {
              target: 'target',
              tenantId: 'tenantId',
              clientId: 'clientId',
              clientSecret: 'clientSecret',
            },
          },
        },
      },
    });
    const provider = MicrosoftGraphOrgEntityProvider.fromConfig(config, {
      logger,
      schedule: 'manual',
    })[0];

    await provider.connect(entityProviderConnection);
    await provider.read();

    expect(entityProviderConnection.applyMutation).toHaveBeenCalledWith(
      expectedMutation,
    );
  });

  it('should apply mutation - schedule', async () => {
    const config = new ConfigReader({
      catalog: {
        providers: {
          microsoftGraphOrg: {
            customProviderId: {
              target: 'target',
              tenantId: 'tenantId',
              clientId: 'clientId',
              clientSecret: 'clientSecret',
            },
          },
        },
      },
    });
    const provider = MicrosoftGraphOrgEntityProvider.fromConfig(config, {
      logger,
      schedule: taskRunner,
    })[0];
    expect(provider.getProviderName()).toEqual(
      'MicrosoftGraphOrgEntityProvider:customProviderId',
    );

    await provider.connect(entityProviderConnection);

    const taskDef = taskRunner.getTasks()[0];
    expect(taskDef.id).toEqual(
      'MicrosoftGraphOrgEntityProvider:customProviderId:refresh',
    );
    await (taskDef.fn as () => Promise<void>)();

    expect(entityProviderConnection.applyMutation).toHaveBeenCalledWith(
      expectedMutation,
    );
  });

  it('should apply mutation - scheduler', async () => {
    const config = new ConfigReader({
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
    });
    const provider = MicrosoftGraphOrgEntityProvider.fromConfig(config, {
      logger,
      scheduler,
    })[0];
    expect(provider.getProviderName()).toEqual(
      'MicrosoftGraphOrgEntityProvider:customProviderId',
    );

    await provider.connect(entityProviderConnection);

    const taskDef = taskRunner.getTasks()[0];
    expect(taskDef.id).toEqual(
      'MicrosoftGraphOrgEntityProvider:customProviderId:refresh',
    );
    await (taskDef.fn as () => Promise<void>)();

    expect(entityProviderConnection.applyMutation).toHaveBeenCalledWith(
      expectedMutation,
    );
  });

  it('fail without schedule and scheduler', () => {
    const config = new ConfigReader({
      catalog: {
        providers: {
          microsoftGraphOrg: {
            customProviderId: {
              target: 'target',
              tenantId: 'tenantId',
              clientId: 'clientId',
              clientSecret: 'clientSecret',
            },
          },
        },
      },
    });

    expect(() =>
      MicrosoftGraphOrgEntityProvider.fromConfig(config, {
        logger,
      }),
    ).toThrow('Either schedule or scheduler must be provided');
  });

  it('fail with scheduler but no schedule config', () => {
    const config = new ConfigReader({
      catalog: {
        providers: {
          microsoftGraphOrg: {
            customProviderId: {
              target: 'target',
              tenantId: 'tenantId',
              clientId: 'clientId',
              clientSecret: 'clientSecret',
            },
          },
        },
      },
    });

    expect(() =>
      MicrosoftGraphOrgEntityProvider.fromConfig(config, {
        logger,
        scheduler,
      }),
    ).toThrow(
      'No schedule provided neither via code nor config for MicrosoftGraphOrgEntityProvider:customProviderId',
    );
  });
});

describe('withLocations', () => {
  it('should set location annotations', () => {
    expect(
      withLocations('test', {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'User',
        metadata: {
          name: 'u1',
          annotations: {
            [MICROSOFT_GRAPH_USER_ID_ANNOTATION]: 'uid',
          },
        },
        spec: {
          memberOf: [],
        },
      }),
    ).toEqual({
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'User',
      metadata: {
        name: 'u1',
        annotations: {
          [MICROSOFT_GRAPH_USER_ID_ANNOTATION]: 'uid',
          [ANNOTATION_LOCATION]: 'msgraph:test/uid',
          [ANNOTATION_ORIGIN_LOCATION]: 'msgraph:test/uid',
        },
      },
      spec: {
        memberOf: [],
      },
    });
  });
});
