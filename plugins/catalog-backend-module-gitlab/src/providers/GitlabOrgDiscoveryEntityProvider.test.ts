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
  SchedulerService,
  SchedulerServiceTaskRunner,
  SchedulerServiceTaskInvocationDefinition,
} from '@backstage/backend-plugin-api';
import {
  mockServices,
  registerMswTestHooks,
} from '@backstage/backend-test-utils';
import { ConfigReader } from '@backstage/config';
import { EntityProviderConnection } from '@backstage/plugin-catalog-node';
import { DefaultEventsService } from '@backstage/plugin-events-node';
import { setupServer } from 'msw/node';
import { handlers } from '../__testUtils__/handlers';
import * as mock from '../__testUtils__/mocks';
import { GroupNameTransformerOptions } from '../lib/types';
import { GitlabOrgDiscoveryEntityProvider } from './GitlabOrgDiscoveryEntityProvider';

const server = setupServer(...handlers);
registerMswTestHooks(server);
afterEach(() => jest.clearAllMocks());

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

const logger = mockServices.logger.mock();

describe('GitlabOrgDiscoveryEntityProvider - configuration', () => {
  it('should not instantiate providers when no config found', () => {
    const schedule = new PersistingTaskRunner();
    const config = new ConfigReader({});
    const providers = GitlabOrgDiscoveryEntityProvider.fromConfig(config, {
      logger,
      schedule,
    });

    expect(providers).toHaveLength(0);
  });

  it('should throw error when no matching GitLab integration config found', () => {
    const schedule = new PersistingTaskRunner();
    const config = new ConfigReader(mock.config_github_host);

    expect(() => {
      GitlabOrgDiscoveryEntityProvider.fromConfig(config, {
        logger,
        schedule,
      });
    }).toThrow('No gitlab integration found that matches host example.com');
  });

  it('should log a message and return when org configuration not found', () => {
    const schedule = new PersistingTaskRunner();
    const config = new ConfigReader(mock.config_no_org_integration);

    GitlabOrgDiscoveryEntityProvider.fromConfig(config, {
      logger,
      schedule,
    });

    expect(logger.info).toHaveBeenCalledWith('Org not enabled for test-id.');
  });

  it('should throw error when saas without group configuration', () => {
    const schedule = new PersistingTaskRunner();
    const config = new ConfigReader(mock.config_saas_no_group);

    expect(() => {
      GitlabOrgDiscoveryEntityProvider.fromConfig(config, {
        logger,
        schedule,
      });
    }).toThrow(
      `Missing 'group' value for GitlabOrgDiscoveryEntityProvider:test-id`,
    );
  });
  it('should fail without schedule and scheduler', () => {
    const config = new ConfigReader(mock.config_org_integration_saas);

    expect(() =>
      GitlabOrgDiscoveryEntityProvider.fromConfig(config, {
        logger,
      }),
    ).toThrow('Either schedule or scheduler must be provided');
  });

  it('should fail with scheduler but no schedule config', () => {
    const scheduler = {
      createScheduledTaskRunner: (_: any) => jest.fn(),
    } as unknown as SchedulerService;
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

  it('should instantiate provider with single simple saas config', async () => {
    const schedule = new PersistingTaskRunner();
    const scheduler = {
      createScheduledTaskRunner: (_: any) => schedule,
    } as unknown as SchedulerService;
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

  it('should instantiate provider when org enabled', () => {
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

  it('should instantiate providers when multiple valid provider configs', () => {
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
});

describe('GitlabOrgDiscoveryEntityProvider - refresh', () => {
  it('should apply full update on scheduled execution', async () => {
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

  it('should exclude inactive user', async () => {
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
    const userEntities = mock.expected_full_org_scan_entities.filter(
      entity => entity.entity.kind === 'User',
    );

    expect(entityProviderConnection.applyMutation).toHaveBeenCalledTimes(1);
    expect(userEntities).not.toHaveLength(mock.all_users_response.length);
    expect(entityProviderConnection.applyMutation).toHaveBeenCalledWith({
      type: 'full',
      entities: mock.expected_full_org_scan_entities,
    });
  });

  it('should exclude user when email or username does not match userPattern', async () => {
    const config = new ConfigReader(mock.config_userPattern_integration);
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

    await (taskDef.fn as () => Promise<void>)();
    const entities = mock.expected_full_org_scan_entities.filter(
      element => element.entity.metadata.name !== 'MarioMario',
    ); // filter out user with non matched e-mail
    expect(entityProviderConnection.applyMutation).toHaveBeenCalledTimes(1);
    expect(entities).not.toHaveLength(
      mock.expected_full_org_scan_entities.length,
    );
    expect(entityProviderConnection.applyMutation).toHaveBeenCalledWith({
      type: 'full',
      entities: entities,
    });
  });

  it('should apply full update on scheduled execution for gitlab.com', async () => {
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

  // This should return all members of the SaaS Root group (group1) -> expected_full_org_scan_entities_saas
  it('SaaS: should get all saas root group users when restrictUsersToGroup is not set', async () => {
    const config = new ConfigReader(mock.config_org_group_saas);
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
      entities: mock.expected_full_org_scan_entities_saas, //
    });
  });

  // This should return all members of the SaaS Root group (group1) -> expected_full_org_scan_entities_saas
  it('SaaS: should get all saas root group users when restrictUsersToGroup is false', async () => {
    const config = new ConfigReader(
      mock.config_org_group_restrictUsers_false_saas,
    );
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
      entities: mock.expected_full_org_scan_entities_saas, //
    });
  });

  // This should return only members of the SaaS subgroup (group1/subgroup1) -> expected_subgroup_org_scan_entities_saas
  it('SaaS: should get only subgroup users when restrictUsersToGroup is true', async () => {
    const config = new ConfigReader(
      mock.config_org_group_restrictUsers_true_saas,
    );
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
      entities: mock.expected_subgroup_org_scan_entities_saas,
    });
  });

  // This needs to return all users, including those without a seat but filter out the bot users
  it('SaaS: should get users without a seat if includeUsersWithoutSeat true', async () => {
    const config = new ConfigReader(
      mock.config_org_group_includeUsersWithoutSeat_true_saas,
    );
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
      entities:
        mock.expected_full_org_scan_entities_includeUsersWithoutSeat_saas, //
    });
  });

  // This should return all members of the self-hosted instance regardless of the group set -> expected_full_members_group_org_scan_entities
  // All instance members, but only the group entities of config.group and below (#26554)
  it('Self-hosted: should get all instance users when restrictUsersToGroup is not set', async () => {
    const config = new ConfigReader(mock.config_org_group_selfHosted);
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
      entities: mock.expected_full_members_group_org_scan_entities, // This should deliver all users but only their membership in subgroups of config.group
    });
  });

  // This should return all members of the self-hosted config.group and all group entities of config.group -> expected_full_members_group_org_scan_entities
  it('Self-hosted: should get only groups users when restrictUsersToGroup is set', async () => {
    const config = new ConfigReader(
      mock.config_org_group_restrictUsers_true_selfHosted,
    );
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
      entities: mock.expected_group_members_group_org_scan_entities, // This should deliver all users but only their membership in subgroups of config.group
    });
  });
});

describe('GitlabOrgDiscoveryEntityProvider with events support', () => {
  it('should ignore gitlab.group_destroy event when group pattern does not match', async () => {
    const config = new ConfigReader(mock.config_org_integration);
    const schedule = new PersistingTaskRunner();
    const events = DefaultEventsService.create({ logger });
    const entityProviderConnection: EntityProviderConnection = {
      applyMutation: jest.fn(),
      refresh: jest.fn(),
    };
    const provider = GitlabOrgDiscoveryEntityProvider.fromConfig(config, {
      logger,
      schedule,
      events,
    })[0];

    expect(provider.getProviderName()).toEqual(
      'GitlabOrgDiscoveryEntityProvider:test-id',
    );

    await provider.connect(entityProviderConnection);

    await events.publish(mock.group_destroy_event_unmatched);

    expect(entityProviderConnection.applyMutation).toHaveBeenCalledTimes(0);
  });

  it('should apply a delta mutation if gitlab.group_destroy event received and defaultGroupTransformation in place', async () => {
    const config = new ConfigReader(mock.config_org_integration);
    const schedule = new PersistingTaskRunner();
    const events = DefaultEventsService.create({ logger });
    const entityProviderConnection: EntityProviderConnection = {
      applyMutation: jest.fn(),
      refresh: jest.fn(),
    };
    const provider = GitlabOrgDiscoveryEntityProvider.fromConfig(config, {
      logger,
      schedule,
      events,
    })[0];

    expect(provider.getProviderName()).toEqual(
      'GitlabOrgDiscoveryEntityProvider:test-id',
    );

    await provider.connect(entityProviderConnection);

    await events.publish(mock.group_destroy_event);

    expect(entityProviderConnection.applyMutation).toHaveBeenCalledTimes(1);
    expect(entityProviderConnection.applyMutation).toHaveBeenCalledWith({
      type: 'delta',
      added: [],
      removed: mock.expected_group_entity,
    });
  });

  it('should ignore gitlab.group_create event when group pattern does not match', async () => {
    const config = new ConfigReader(mock.config_org_integration);
    const schedule = new PersistingTaskRunner();
    const events = DefaultEventsService.create({ logger });
    const entityProviderConnection: EntityProviderConnection = {
      applyMutation: jest.fn(),
      refresh: jest.fn(),
    };
    const provider = GitlabOrgDiscoveryEntityProvider.fromConfig(config, {
      logger,
      schedule,
      events,
    })[0];

    expect(provider.getProviderName()).toEqual(
      'GitlabOrgDiscoveryEntityProvider:test-id',
    );

    await provider.connect(entityProviderConnection);
    await events.publish(mock.group_create_event_unmatched);

    expect(entityProviderConnection.applyMutation).toHaveBeenCalledTimes(0);
  });
  it('should apply a delta mutation if gitlab.group_create event received and defaultGroupTransformation in place', async () => {
    const config = new ConfigReader(mock.config_org_integration);
    const schedule = new PersistingTaskRunner();
    const events = DefaultEventsService.create({ logger });
    const entityProviderConnection: EntityProviderConnection = {
      applyMutation: jest.fn(),
      refresh: jest.fn(),
    };
    const provider = GitlabOrgDiscoveryEntityProvider.fromConfig(config, {
      logger,
      schedule,
      events,
    })[0];

    expect(provider.getProviderName()).toEqual(
      'GitlabOrgDiscoveryEntityProvider:test-id',
    );

    await provider.connect(entityProviderConnection);
    await events.publish(mock.group_create_event);

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
    const events = DefaultEventsService.create({ logger });

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
      events,
      groupNameTransformer: customGroupNameTransformer,
    })[0];

    expect(provider.getProviderName()).toEqual(
      'GitlabOrgDiscoveryEntityProvider:test-id',
    );

    await provider.connect(entityProviderConnection);

    await events.publish(mock.group_create_event);

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
    const events = DefaultEventsService.create({ logger });
    const entityProviderConnection: EntityProviderConnection = {
      applyMutation: jest.fn(),
      refresh: jest.fn(),
    };
    const provider = GitlabOrgDiscoveryEntityProvider.fromConfig(config, {
      logger,
      schedule,
      events,
    })[0];

    expect(provider.getProviderName()).toEqual(
      'GitlabOrgDiscoveryEntityProvider:test-id',
    );

    await provider.connect(entityProviderConnection);

    await events.publish(mock.group_rename_event);

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
    const events = DefaultEventsService.create({ logger });
    const entityProviderConnection: EntityProviderConnection = {
      applyMutation: jest.fn(),
      refresh: jest.fn(),
    };
    const provider = GitlabOrgDiscoveryEntityProvider.fromConfig(config, {
      logger,
      schedule,
      events,
    })[0];

    expect(provider.getProviderName()).toEqual(
      'GitlabOrgDiscoveryEntityProvider:test-id',
    );

    await provider.connect(entityProviderConnection);

    await events.publish(mock.user_create_event);

    expect(entityProviderConnection.applyMutation).toHaveBeenCalledTimes(1);
    expect(entityProviderConnection.applyMutation).toHaveBeenCalledWith({
      type: 'delta',
      added: mock.expected_single_user_entity,
      removed: [],
    });
  });

  it('should apply a delta mutation if gitlab.user_destroy event received', async () => {
    const config = new ConfigReader(mock.config_org_integration);
    const schedule = new PersistingTaskRunner();
    const events = DefaultEventsService.create({ logger });
    const entityProviderConnection: EntityProviderConnection = {
      applyMutation: jest.fn(),
      refresh: jest.fn(),
    };
    const provider = GitlabOrgDiscoveryEntityProvider.fromConfig(config, {
      logger,
      schedule,
      events,
    })[0];

    expect(provider.getProviderName()).toEqual(
      'GitlabOrgDiscoveryEntityProvider:test-id',
    );

    await provider.connect(entityProviderConnection);

    await events.publish(mock.user_destroy_event);

    expect(entityProviderConnection.applyMutation).toHaveBeenCalledTimes(1);
    expect(entityProviderConnection.applyMutation).toHaveBeenCalledWith({
      type: 'delta',
      added: [],
      removed: mock.expected_single_user_removed_entity,
    });
  });

  it('should apply a delta mutation if gitlab.user_add_to_group event received and defaultGroupTransformer', async () => {
    const config = new ConfigReader(mock.config_org_integration);
    const schedule = new PersistingTaskRunner();
    const events = DefaultEventsService.create({ logger });
    const entityProviderConnection: EntityProviderConnection = {
      applyMutation: jest.fn(),
      refresh: jest.fn(),
    };
    const provider = GitlabOrgDiscoveryEntityProvider.fromConfig(config, {
      logger,
      schedule,
      events,
    })[0];

    expect(provider.getProviderName()).toEqual(
      'GitlabOrgDiscoveryEntityProvider:test-id',
    );

    await provider.connect(entityProviderConnection);

    await events.publish(mock.user_add_to_group_event);

    expect(entityProviderConnection.applyMutation).toHaveBeenCalledTimes(1);
    expect(entityProviderConnection.applyMutation).toHaveBeenCalledWith({
      type: 'delta',
      added: mock.expected_group_user_entity,
      removed: [],
    });
  });

  it('should ignore a delta mutation if gitlab.user_add_to_group event received and group outside scope', async () => {
    const config = new ConfigReader(mock.config_org_integration);
    const schedule = new PersistingTaskRunner();
    const events = DefaultEventsService.create({ logger });
    const entityProviderConnection: EntityProviderConnection = {
      applyMutation: jest.fn(),
      refresh: jest.fn(),
    };
    const provider = GitlabOrgDiscoveryEntityProvider.fromConfig(config, {
      logger,
      schedule,
      events,
    })[0];

    expect(provider.getProviderName()).toEqual(
      'GitlabOrgDiscoveryEntityProvider:test-id',
    );

    await provider.connect(entityProviderConnection);

    await events.publish(mock.user_add_to_group_event_mismatched);

    expect(entityProviderConnection.applyMutation).toHaveBeenCalledTimes(0);
  });

  it('should apply a delta mutation if gitlab.user_remove_from_group event received and customGroupTransformer', async () => {
    const config = new ConfigReader(mock.config_org_integration);
    const schedule = new PersistingTaskRunner();
    const events = DefaultEventsService.create({ logger });
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
      events,
    })[0];

    expect(provider.getProviderName()).toEqual(
      'GitlabOrgDiscoveryEntityProvider:test-id',
    );

    await provider.connect(entityProviderConnection);

    await events.publish(mock.user_remove_from_group_event);

    expect(entityProviderConnection.applyMutation).toHaveBeenCalledTimes(1);
    expect(entityProviderConnection.applyMutation).toHaveBeenCalledWith({
      type: 'delta',
      added: mock.expected_removed_user_entity,
      removed: [],
    });
  });
});
