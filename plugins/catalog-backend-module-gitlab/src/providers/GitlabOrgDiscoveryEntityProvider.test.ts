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

import { getVoidLogger } from '@backstage/backend-common';
import {
  PluginTaskScheduler,
  TaskInvocationDefinition,
  TaskRunner,
} from '@backstage/backend-tasks';
import { setupRequestMockHandlers } from '@backstage/backend-test-utils';
import { ConfigReader } from '@backstage/config';
import { EntityProviderConnection } from '@backstage/plugin-catalog-node';
import { setupServer } from 'msw/node';
import { handlers } from '../__testUtils__/handlers';
import * as mock from '../__testUtils__/mocks';
import { GroupNameTransformerOptions } from '../lib/types';
import { GitlabOrgDiscoveryEntityProvider } from './GitlabOrgDiscoveryEntityProvider';

class PersistingTaskRunner implements TaskRunner {
  private tasks: TaskInvocationDefinition[] = [];

  getTasks() {
    return this.tasks;
  }

  run(task: TaskInvocationDefinition): Promise<void> {
    this.tasks.push(task);
    return Promise.resolve(undefined);
  }
}

const logger = getVoidLogger();

describe('GitlabOrgDiscoveryEntityProvider', () => {
  const server = setupServer(...handlers);
  setupRequestMockHandlers(server);
  afterEach(() => jest.resetAllMocks());

  it('no provider config', () => {
    const schedule = new PersistingTaskRunner();
    const config = new ConfigReader({});
    const providers = GitlabOrgDiscoveryEntityProvider.fromConfig(config, {
      logger,
      schedule,
    });

    expect(providers).toHaveLength(0);
  });

  it('single simple discovery config with org disabled', () => {
    const schedule = new PersistingTaskRunner();
    const config = new ConfigReader(mock.config_single_integration);
    const providers = GitlabOrgDiscoveryEntityProvider.fromConfig(config, {
      logger,
      schedule,
    });

    expect(providers).toHaveLength(0);
  });

  it('single simple discovery config with org enabled', () => {
    const schedule = new PersistingTaskRunner();
    const config = new ConfigReader(mock.config_org_integration);
    const providers = GitlabOrgDiscoveryEntityProvider.fromConfig(config, {
      logger,
      schedule,
    });

    expect(providers).toHaveLength(1);
    expect(providers[0].getProviderName()).toEqual(
      'GitlabOrgDiscoveryEntityProvider:test-id',
    );
  });

  it('multiple discovery configs', () => {
    const schedule = new PersistingTaskRunner();
    const config = new ConfigReader(mock.config_org_double_integration);
    const providers = GitlabOrgDiscoveryEntityProvider.fromConfig(config, {
      logger,
      schedule,
    });

    expect(providers).toHaveLength(2);
    expect(providers[0].getProviderName()).toEqual(
      'GitlabOrgDiscoveryEntityProvider:test-id',
    );
    expect(providers[1].getProviderName()).toEqual(
      'GitlabOrgDiscoveryEntityProvider:second-test',
    );
  });

  it('apply full update on scheduled execution', async () => {
    const config = new ConfigReader(mock.config_org_integration);
    const schedule = new PersistingTaskRunner();
    const entityProviderConnection: EntityProviderConnection = {
      applyMutation: jest.fn(),
      refresh: jest.fn(),
    };
    const provider = GitlabOrgDiscoveryEntityProvider.fromConfig(config, {
      logger,
      schedule,
    })[0];
    expect(provider.getProviderName()).toEqual(
      'GitlabOrgDiscoveryEntityProvider:test-id',
    );

    await provider.connect(entityProviderConnection);

    const taskDef = schedule.getTasks()[0];
    expect(taskDef.id).toEqual(
      'GitlabOrgDiscoveryEntityProvider:test-id:refresh',
    );
    await (taskDef.fn as () => Promise<void>)();

    expect(entityProviderConnection.applyMutation).toHaveBeenCalledTimes(1);
    expect(entityProviderConnection.applyMutation).toHaveBeenCalledWith({
      type: 'full',
      entities: mock.expected_full_org_scan_entities,
    });
  });

  it('apply full update on scheduled execution for gitlab.com', async () => {
    const config = new ConfigReader(mock.config_org_integration_saas);
    const schedule = new PersistingTaskRunner();
    const entityProviderConnection: EntityProviderConnection = {
      applyMutation: jest.fn(),
      refresh: jest.fn(),
    };
    const provider = GitlabOrgDiscoveryEntityProvider.fromConfig(config, {
      logger,
      schedule,
    })[0];
    expect(provider.getProviderName()).toEqual(
      'GitlabOrgDiscoveryEntityProvider:test-id',
    );

    await provider.connect(entityProviderConnection);

    const taskDef = schedule.getTasks()[0];
    expect(taskDef.id).toEqual(
      'GitlabOrgDiscoveryEntityProvider:test-id:refresh',
    );
    await (taskDef.fn as () => Promise<void>)();

    expect(entityProviderConnection.applyMutation).toHaveBeenCalledTimes(1);
    expect(entityProviderConnection.applyMutation).toHaveBeenCalledWith({
      type: 'full',
      entities: mock.expected_full_org_scan_entities_saas,
    });
  });

  it('fail without schedule and scheduler', () => {
    const config = new ConfigReader(mock.config_org_integration_saas);

    expect(() =>
      GitlabOrgDiscoveryEntityProvider.fromConfig(config, {
        logger,
      }),
    ).toThrow('Either schedule or scheduler must be provided');
  });

  it('fail with scheduler but no schedule config', () => {
    const scheduler = {
      createScheduledTaskRunner: (_: any) => jest.fn(),
    } as unknown as PluginTaskScheduler;
    const config = new ConfigReader(mock.config_org_integration_saas);

    expect(() =>
      GitlabOrgDiscoveryEntityProvider.fromConfig(config, {
        logger,
        scheduler,
      }),
    ).toThrow(
      'No schedule provided neither via code nor config for GitlabOrgDiscoveryEntityProvider:test-id',
    );
  });

  it('fail with scheduler but no group config when host is gitlab.com', () => {
    const scheduler = {
      createScheduledTaskRunner: (_: any) => jest.fn(),
    } as unknown as PluginTaskScheduler;
    const config = new ConfigReader(mock.config_org_integration_saas_no_group);

    expect(() =>
      GitlabOrgDiscoveryEntityProvider.fromConfig(config, {
        logger,
        scheduler,
      }),
    ).toThrow(
      `Missing 'group' value for GitlabOrgDiscoveryEntityProvider:test-id`,
    );
  });

  it('single simple provider config with schedule in config', async () => {
    const schedule = new PersistingTaskRunner();
    const scheduler = {
      createScheduledTaskRunner: (_: any) => schedule,
    } as unknown as PluginTaskScheduler;
    const config = new ConfigReader(mock.config_org_integration_saas_sched);
    const providers = GitlabOrgDiscoveryEntityProvider.fromConfig(config, {
      logger,
      scheduler,
    });

    expect(providers).toHaveLength(1);
    expect(providers[0].getProviderName()).toEqual(
      'GitlabOrgDiscoveryEntityProvider:test-id',
    );
  });
});

// <<< EventSupportChange: start add tests
describe('GitlabOrgDiscoveryEntityProvider with events support', () => {
  const server = setupServer(...handlers);
  setupRequestMockHandlers(server);
  afterEach(() => jest.resetAllMocks());

  it('should apply a delta mutation if gitlab.group_destroy event received and defaultGroupTransformation in place', async () => {
    const config = new ConfigReader(mock.config_org_integration);
    const schedule = new PersistingTaskRunner();
    const entityProviderConnection: EntityProviderConnection = {
      applyMutation: jest.fn(),
      refresh: jest.fn(),
    };
    const provider = GitlabOrgDiscoveryEntityProvider.fromConfig(config, {
      logger,
      schedule,
    })[0];

    expect(provider.getProviderName()).toEqual(
      'GitlabOrgDiscoveryEntityProvider:test-id',
    );

    await provider.connect(entityProviderConnection);

    await provider.onEvent(mock.group_destroy_event);

    expect(entityProviderConnection.applyMutation).toHaveBeenCalledTimes(1);
    expect(entityProviderConnection.applyMutation).toHaveBeenCalledWith({
      type: 'delta',
      added: [],
      removed: mock.expected_group_entity,
    });
  });

  it('should apply a delta mutation if gitlab.group_create event received and defaultGroupTransformation in place', async () => {
    const config = new ConfigReader(mock.config_org_integration);
    const schedule = new PersistingTaskRunner();
    const entityProviderConnection: EntityProviderConnection = {
      applyMutation: jest.fn(),
      refresh: jest.fn(),
    };
    const provider = GitlabOrgDiscoveryEntityProvider.fromConfig(config, {
      logger,
      schedule,
    })[0];

    expect(provider.getProviderName()).toEqual(
      'GitlabOrgDiscoveryEntityProvider:test-id',
    );

    await provider.connect(entityProviderConnection);
    await provider.onEvent(mock.group_create_event);

    expect(entityProviderConnection.applyMutation).toHaveBeenCalledTimes(1);
    expect(entityProviderConnection.applyMutation).toHaveBeenCalledWith({
      type: 'delta',
      added: mock.expected_group_entity,
      removed: [],
    });
  });

  it('should apply a delta mutation if gitlab.group_create event received and user/group transformations in place', async () => {
    const config = new ConfigReader(mock.config_org_integration);
    const schedule = new PersistingTaskRunner();

    const entityProviderConnection: EntityProviderConnection = {
      applyMutation: jest.fn(),
      refresh: jest.fn(),
    };

    function customGroupNameTransformer(
      options: GroupNameTransformerOptions,
    ): string {
      return `${options.group.id}`;
    }

    const provider = GitlabOrgDiscoveryEntityProvider.fromConfig(config, {
      logger,
      schedule,
      groupNameTransformer: customGroupNameTransformer,
    })[0];

    expect(provider.getProviderName()).toEqual(
      'GitlabOrgDiscoveryEntityProvider:test-id',
    );

    await provider.connect(entityProviderConnection);

    await provider.onEvent(mock.group_create_event);

    expect(entityProviderConnection.applyMutation).toHaveBeenCalledTimes(1);
    expect(entityProviderConnection.applyMutation).toHaveBeenCalledWith({
      type: 'delta',
      added: mock.expected_transformed_group_entity,
      removed: [],
    });
  });

  it('should apply a delta mutation if gitlab.group_rename event received and defaultGroupTransformation in place', async () => {
    const config = new ConfigReader(mock.config_org_integration);
    const schedule = new PersistingTaskRunner();
    const entityProviderConnection: EntityProviderConnection = {
      applyMutation: jest.fn(),
      refresh: jest.fn(),
    };
    const provider = GitlabOrgDiscoveryEntityProvider.fromConfig(config, {
      logger,
      schedule,
    })[0];

    expect(provider.getProviderName()).toEqual(
      'GitlabOrgDiscoveryEntityProvider:test-id',
    );

    await provider.connect(entityProviderConnection);

    await provider.onEvent(mock.group_rename_event);

    expect(entityProviderConnection.applyMutation).toHaveBeenCalledTimes(1);
    expect(entityProviderConnection.applyMutation).toHaveBeenCalledWith({
      type: 'delta',
      added: mock.expected_added_group_entity,
      removed: mock.expected_removed_group_entity,
    });
  });

  it('should apply a delta mutation if gitlab.user_create event received', async () => {
    const config = new ConfigReader(mock.config_org_integration);
    const schedule = new PersistingTaskRunner();
    const entityProviderConnection: EntityProviderConnection = {
      applyMutation: jest.fn(),
      refresh: jest.fn(),
    };
    const provider = GitlabOrgDiscoveryEntityProvider.fromConfig(config, {
      logger,
      schedule,
    })[0];

    expect(provider.getProviderName()).toEqual(
      'GitlabOrgDiscoveryEntityProvider:test-id',
    );

    await provider.connect(entityProviderConnection);

    await provider.onEvent(mock.user_create_event);

    expect(entityProviderConnection.applyMutation).toHaveBeenCalledTimes(1);
    expect(entityProviderConnection.applyMutation).toHaveBeenCalledWith({
      type: 'delta',
      added: mock.expected_user1_entity,
      removed: [],
    });
  });

  it('should apply a delta mutation if gitlab.user_destroy event received', async () => {
    const config = new ConfigReader(mock.config_org_integration);
    const schedule = new PersistingTaskRunner();
    const entityProviderConnection: EntityProviderConnection = {
      applyMutation: jest.fn(),
      refresh: jest.fn(),
    };
    const provider = GitlabOrgDiscoveryEntityProvider.fromConfig(config, {
      logger,
      schedule,
    })[0];

    expect(provider.getProviderName()).toEqual(
      'GitlabOrgDiscoveryEntityProvider:test-id',
    );

    await provider.connect(entityProviderConnection);

    await provider.onEvent(mock.user_destroy_event);

    expect(entityProviderConnection.applyMutation).toHaveBeenCalledTimes(1);
    expect(entityProviderConnection.applyMutation).toHaveBeenCalledWith({
      type: 'delta',
      added: [],
      removed: mock.expected_user1_removed_entity,
    });
  });

  it('should apply a delta mutation if gitlab.user_add_to_group event received and defaultGroupTransformer', async () => {
    const config = new ConfigReader(mock.config_org_integration);
    const schedule = new PersistingTaskRunner();
    const entityProviderConnection: EntityProviderConnection = {
      applyMutation: jest.fn(),
      refresh: jest.fn(),
    };
    const provider = GitlabOrgDiscoveryEntityProvider.fromConfig(config, {
      logger,
      schedule,
    })[0];

    expect(provider.getProviderName()).toEqual(
      'GitlabOrgDiscoveryEntityProvider:test-id',
    );

    await provider.connect(entityProviderConnection);

    await provider.onEvent(mock.user_add_to_group_event);

    expect(entityProviderConnection.applyMutation).toHaveBeenCalledTimes(1);
    expect(entityProviderConnection.applyMutation).toHaveBeenCalledWith({
      type: 'delta',
      added: mock.expected_group_user_entity,
      removed: [],
    });
  });

  it('should apply a delta mutation if gitlab.user_remove_from_group event received and customGroupTransformer', async () => {
    const config = new ConfigReader(mock.config_org_integration);
    const schedule = new PersistingTaskRunner();
    const entityProviderConnection: EntityProviderConnection = {
      applyMutation: jest.fn(),
      refresh: jest.fn(),
    };
    function customGroupNameTransformer(
      options: GroupNameTransformerOptions,
    ): string {
      return `${options.group.id}`;
    }

    const provider = GitlabOrgDiscoveryEntityProvider.fromConfig(config, {
      groupNameTransformer: customGroupNameTransformer,
      logger,
      schedule,
    })[0];

    expect(provider.getProviderName()).toEqual(
      'GitlabOrgDiscoveryEntityProvider:test-id',
    );

    await provider.connect(entityProviderConnection);

    await provider.onEvent(mock.user_remove_from_group_event);

    expect(entityProviderConnection.applyMutation).toHaveBeenCalledTimes(1);
    expect(entityProviderConnection.applyMutation).toHaveBeenCalledWith({
      type: 'delta',
      added: mock.expected_transformed_group_entity,
      removed: [],
    });
  });
});

// EventSupportChange: end add tests >>>
