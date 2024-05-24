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
  PluginTaskScheduler,
  TaskInvocationDefinition,
  TaskRunner,
} from '@backstage/backend-tasks';
import {
  mockServices,
  setupRequestMockHandlers,
} from '@backstage/backend-test-utils';
import { ConfigReader } from '@backstage/config';
import { EntityProviderConnection } from '@backstage/plugin-catalog-node';
import { DefaultEventsService } from '@backstage/plugin-events-node';
import { setupServer } from 'msw/node';
import { handlers } from '../__testUtils__/handlers';
import * as mock from '../__testUtils__/mocks';
import { GitlabDiscoveryEntityProvider } from './GitlabDiscoveryEntityProvider';

const server = setupServer(...handlers);
setupRequestMockHandlers(server);
afterEach(() => jest.clearAllMocks());

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

const logger = mockServices.logger.mock();

describe('GitlabDiscoveryEntityProvider - configuration', () => {
  it('should not instantiate providers when no config found', () => {
    const schedule = new PersistingTaskRunner();
    const config = new ConfigReader({});
    const providers = GitlabDiscoveryEntityProvider.fromConfig(config, {
      logger,
      schedule,
    });

    expect(providers).toHaveLength(0);
  });

  it('should fail without schedule nor scheduler', () => {
    const config = new ConfigReader(mock.config_single_integration_branch);

    expect(() =>
      GitlabDiscoveryEntityProvider.fromConfig(config, {
        logger,
      }),
    ).toThrow('Either schedule or scheduler must be provided');
  });

  it('should fail with scheduler but no schedule config', () => {
    const scheduler = {
      createScheduledTaskRunner: (_: any) => jest.fn(),
    } as unknown as PluginTaskScheduler;
    const config = new ConfigReader(mock.config_no_schedule_integration);

    expect(() =>
      GitlabDiscoveryEntityProvider.fromConfig(config, {
        logger,
        scheduler,
      }),
    ).toThrow(
      'No schedule provided neither via code nor config for GitlabDiscoveryEntityProvider:test-id',
    );
  });
  it('should throw error when no matching GitLab integration config found', () => {
    const schedule = new PersistingTaskRunner();
    const config = new ConfigReader(mock.config_github_host);

    expect(() => {
      GitlabDiscoveryEntityProvider.fromConfig(config, {
        logger,
        schedule,
      });
    }).toThrow('No gitlab integration found that matches host example.com');
  });

  it('should instantiate provider with single simple discovery config', () => {
    const schedule = new PersistingTaskRunner();
    const config = new ConfigReader(mock.config_single_integration_branch);
    const providers = GitlabDiscoveryEntityProvider.fromConfig(config, {
      logger,
      schedule,
    });

    expect(providers).toHaveLength(1);
    expect(providers[0].getProviderName()).toEqual(
      'GitlabDiscoveryEntityProvider:test-id',
    );
  });

  it('should instantiate providers when multiple discovery configs', () => {
    const schedule = new PersistingTaskRunner();
    const config = new ConfigReader(mock.config_double_integration);
    const providers = GitlabDiscoveryEntityProvider.fromConfig(config, {
      logger,
      schedule,
    });

    expect(providers).toHaveLength(2);
    expect(providers[0].getProviderName()).toEqual(
      'GitlabDiscoveryEntityProvider:test-id',
    );
    expect(providers[1].getProviderName()).toEqual(
      'GitlabDiscoveryEntityProvider:second-test',
    );
  });
});
describe('GitlabDiscoveryEntityProvider - refresh', () => {
  it('should apply full update on scheduled execution', async () => {
    const config = new ConfigReader(mock.config_no_org_integration);
    const schedule = new PersistingTaskRunner();
    const entityProviderConnection: EntityProviderConnection = {
      applyMutation: jest.fn(),
      refresh: jest.fn(),
    };
    const provider = GitlabDiscoveryEntityProvider.fromConfig(config, {
      logger,
      schedule,
    })[0];
    expect(provider.getProviderName()).toEqual(
      'GitlabDiscoveryEntityProvider:test-id',
    );

    await provider.connect(entityProviderConnection);

    const taskDef = schedule.getTasks()[0];
    expect(taskDef.id).toEqual('GitlabDiscoveryEntityProvider:test-id:refresh');
    await (taskDef.fn as () => Promise<void>)();

    expect(entityProviderConnection.applyMutation).toHaveBeenCalledTimes(1);
    expect(entityProviderConnection.applyMutation).toHaveBeenCalledWith({
      type: 'full',
      entities: mock.expected_location_entities.filter(
        entity =>
          !entity.entity.metadata.annotations[
            'backstage.io/managed-by-location'
          ].includes('awesome'),
      ),
    });
  });

  it('should filter found projects based on a provided project pattern', async () => {
    const config = new ConfigReader(
      mock.config_single_integration_project_pattern,
    );
    const schedule = new PersistingTaskRunner();
    const entityProviderConnection: EntityProviderConnection = {
      applyMutation: jest.fn(),
      refresh: jest.fn(),
    };
    const provider = GitlabDiscoveryEntityProvider.fromConfig(config, {
      logger,
      schedule,
    })[0];

    const projectPattern =
      mock.config_single_integration_project_pattern.catalog.providers.gitlab[
        'test-id'
      ].projectPattern;

    await provider.connect(entityProviderConnection);

    await provider.refresh(logger);

    expect(entityProviderConnection.applyMutation).toHaveBeenCalledWith({
      type: 'full',
      entities: mock.expected_location_entities.filter(
        entity =>
          entity.entity.metadata.annotations[
            'backstage.io/managed-by-location'
          ].includes(projectPattern) &&
          !entity.entity.metadata.annotations[
            'backstage.io/managed-by-location'
          ].includes('awesome'),
      ),
    });
  });

  it('should filter fork projects', async () => {
    const config = new ConfigReader(mock.config_single_integration_skip_forks);
    const schedule = new PersistingTaskRunner();
    const entityProviderConnection: EntityProviderConnection = {
      applyMutation: jest.fn(),
      refresh: jest.fn(),
    };
    const provider = GitlabDiscoveryEntityProvider.fromConfig(config, {
      logger,
      schedule,
    })[0];

    await provider.connect(entityProviderConnection);

    await provider.refresh(logger);

    expect(entityProviderConnection.applyMutation).toHaveBeenCalledWith({
      type: 'full',
      entities: mock.expected_location_entities.filter(
        entity =>
          !entity.entity.metadata.annotations[
            'backstage.io/managed-by-location'
          ].includes('forked') &&
          !entity.entity.metadata.annotations[
            'backstage.io/managed-by-location'
          ].includes('awesome'),
      ),
    });
  });

  it('should filter found projects based on the branch', async () => {
    const config = new ConfigReader(mock.config_single_integration_branch);
    const schedule = new PersistingTaskRunner();
    const entityProviderConnection: EntityProviderConnection = {
      applyMutation: jest.fn(),
      refresh: jest.fn(),
    };
    const provider = GitlabDiscoveryEntityProvider.fromConfig(config, {
      logger,
      schedule,
    })[0];

    const configured_branch =
      mock.config_single_integration_branch.catalog.providers.gitlab['test-id']
        .branch;

    await provider.connect(entityProviderConnection);

    await provider.refresh(logger);

    expect(entityProviderConnection.applyMutation).toHaveBeenCalledWith({
      type: 'full',
      entities: mock.expected_location_entities.filter(
        entity =>
          entity.entity.metadata.annotations[
            'backstage.io/managed-by-location'
          ].includes(configured_branch) &&
          !entity.entity.metadata.annotations[
            'backstage.io/managed-by-location'
          ].includes('awesome'),
      ),
    });
  });

  it('should only include projects with fallback branch', async () => {
    const config = new ConfigReader(mock.config_fallbackBranch_branch);
    const schedule = new PersistingTaskRunner();
    const entityProviderConnection: EntityProviderConnection = {
      applyMutation: jest.fn(),
      refresh: jest.fn(),
    };
    const provider = GitlabDiscoveryEntityProvider.fromConfig(config, {
      logger,
      schedule,
    })[0];

    const configured_branch =
      mock.config_fallbackBranch_branch.catalog.providers.gitlab['test-id']
        .fallbackBranch;

    await provider.connect(entityProviderConnection);

    await provider.refresh(logger);

    expect(entityProviderConnection.applyMutation).toHaveBeenCalledWith({
      type: 'full',
      entities: mock.expected_location_entities.filter(
        entity =>
          entity.entity.metadata.annotations[
            'backstage.io/managed-by-location'
          ].includes(configured_branch) &&
          !entity.entity.metadata.annotations[
            'backstage.io/managed-by-location'
          ].includes('awesome'),
      ),
    });
  });

  it('should ignore projects outside group scope', async () => {
    const config = new ConfigReader(mock.config_single_integration_group);
    const schedule = new PersistingTaskRunner();
    const entityProviderConnection: EntityProviderConnection = {
      applyMutation: jest.fn(),
      refresh: jest.fn(),
    };
    const provider = GitlabDiscoveryEntityProvider.fromConfig(config, {
      logger,
      schedule,
    })[0];

    const configured_group =
      mock.config_single_integration_group.catalog.providers.gitlab['test-id']
        .group;

    await provider.connect(entityProviderConnection);

    await provider.refresh(logger);

    expect(entityProviderConnection.applyMutation).toHaveBeenCalledWith({
      type: 'full',
      entities: mock.expected_location_entities.filter(entity =>
        entity.entity.metadata.annotations[
          'backstage.io/managed-by-location'
        ].includes(configured_group),
      ),
    });
  });
});
describe('GitlabDiscoveryEntityProvider - events', () => {
  it('should ignore push event if project is forked', async () => {
    const config = new ConfigReader(mock.config_single_integration_skip_forks);

    const schedule = new PersistingTaskRunner();
    const events = DefaultEventsService.create({ logger });

    const entityProviderConnection: EntityProviderConnection = {
      applyMutation: jest.fn(),
      refresh: jest.fn(),
    };
    const provider = GitlabDiscoveryEntityProvider.fromConfig(config, {
      logger,
      schedule,
      events,
    })[0];

    await provider.connect(entityProviderConnection);

    await events.publish(mock.push_add_event_forked);

    expect(entityProviderConnection.applyMutation).toHaveBeenCalledTimes(0);
  });

  it(`should skip refresh and mutation when project pattern doesn't match`, async () => {
    const config = new ConfigReader(mock.config_unmatched_project_integration);
    const schedule = new PersistingTaskRunner();
    const events = DefaultEventsService.create({ logger });
    const entityProviderConnection: EntityProviderConnection = {
      applyMutation: jest.fn(),
      refresh: jest.fn(),
    };
    const provider = GitlabDiscoveryEntityProvider.fromConfig(config, {
      logger,
      schedule,
      events,
    })[0];

    await provider.connect(entityProviderConnection);

    await events.publish(mock.push_add_event);

    expect(entityProviderConnection.refresh).toHaveBeenCalledTimes(0);
    expect(entityProviderConnection.applyMutation).toHaveBeenCalledTimes(0);
  });

  it('should ignore projects outside group scope', async () => {
    const config = new ConfigReader(mock.config_single_integration_group);
    const schedule = new PersistingTaskRunner();
    const events = DefaultEventsService.create({ logger });
    const entityProviderConnection: EntityProviderConnection = {
      applyMutation: jest.fn(),
      refresh: jest.fn(),
    };
    const provider = GitlabDiscoveryEntityProvider.fromConfig(config, {
      logger,
      schedule,
      events,
    })[0];

    await provider.connect(entityProviderConnection);

    await events.publish(mock.push_add_event_unmatched_group);

    expect(entityProviderConnection.applyMutation).toHaveBeenCalledTimes(0);
  });
  it('should apply delta mutations on added files from push event', async () => {
    const config = new ConfigReader(mock.config_single_integration_branch);

    const schedule = new PersistingTaskRunner();
    const events = DefaultEventsService.create({ logger });
    const entityProviderConnection: EntityProviderConnection = {
      applyMutation: jest.fn(),
      refresh: jest.fn(),
    };
    const provider = GitlabDiscoveryEntityProvider.fromConfig(config, {
      logger,
      schedule,
      events,
    })[0];

    await provider.connect(entityProviderConnection);

    await events.publish(mock.push_add_event);

    expect(entityProviderConnection.applyMutation).toHaveBeenCalledTimes(1);
    expect(entityProviderConnection.applyMutation).toHaveBeenCalledWith({
      type: 'delta',
      added: mock.expected_added_location_entities,
      removed: [],
    });
  });

  it('should apply delta mutations on removed files from push event', async () => {
    const config = new ConfigReader(mock.config_single_integration_branch);
    const schedule = new PersistingTaskRunner();
    const events = DefaultEventsService.create({ logger });
    const entityProviderConnection: EntityProviderConnection = {
      applyMutation: jest.fn(),
      refresh: jest.fn(),
    };
    const provider = GitlabDiscoveryEntityProvider.fromConfig(config, {
      logger,
      schedule,
      events,
    })[0];

    await provider.connect(entityProviderConnection);

    await events.publish(mock.push_remove_event);

    expect(entityProviderConnection.applyMutation).toHaveBeenCalledTimes(1);
    expect(entityProviderConnection.applyMutation).toHaveBeenCalledWith({
      type: 'delta',
      added: [],
      removed: mock.expected_removed_location_entities,
    });
  });

  it('should call refresh on added files from push event', async () => {
    const config = new ConfigReader(mock.config_single_integration_branch);
    const schedule = new PersistingTaskRunner();
    const events = DefaultEventsService.create({ logger });
    const entityProviderConnection: EntityProviderConnection = {
      applyMutation: jest.fn(),
      refresh: jest.fn(),
    };
    const provider = GitlabDiscoveryEntityProvider.fromConfig(config, {
      logger,
      schedule,
      events,
    })[0];

    await provider.connect(entityProviderConnection);

    const url = `https://example.com/group1/test-repo1`;

    await events.publish(mock.push_modif_event);

    expect(entityProviderConnection.refresh).toHaveBeenCalledTimes(1);
    expect(entityProviderConnection.refresh).toHaveBeenCalledWith({
      keys: [
        `url:${url}/-/tree/main/catalog-info.yaml`,
        `url:${url}/-/blob/main/catalog-info.yaml`,
      ],
    });
    expect(entityProviderConnection.applyMutation).toHaveBeenCalledTimes(0);
  });
  // EventSupportChange: stop add tests >>>
});
