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
import { GitlabDiscoveryEntityProvider } from './GitlabDiscoveryEntityProvider';

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
    const config = new ConfigReader(mock.config_single_integration);

    expect(() =>
      GitlabDiscoveryEntityProvider.fromConfig(config, {
        logger,
      }),
    ).toThrow('Either schedule or scheduler must be provided');
  });

  it('should fail with scheduler but no schedule config', () => {
    const scheduler = {
      createScheduledTaskRunner: (_: any) => jest.fn(),
    } as unknown as SchedulerService;
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
    const config = new ConfigReader(mock.config_single_integration);
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

    // Mock the GitLabClient listProjects method to verify default parameters
    const originalListProjects = (provider as any).gitLabClient.listProjects;
    const mockListProjects = jest.fn().mockImplementation(async options => {
      // Verify default parameters: archived=false and simple=true (since skipForkedRepos=false by default)
      expect(options).toMatchObject({
        group: 'group1',
        per_page: 50,
        archived: false,
        simple: true, // Should be set since skipForkedRepos defaults to false
      });
      // Call the original method to maintain test behavior
      return originalListProjects.call((provider as any).gitLabClient, options);
    });
    (provider as any).gitLabClient.listProjects = mockListProjects;

    await provider.connect(entityProviderConnection);

    const taskDef = schedule.getTasks()[0];
    expect(taskDef.id).toEqual('GitlabDiscoveryEntityProvider:test-id:refresh');
    await (taskDef.fn as () => Promise<void>)();

    expect(entityProviderConnection.applyMutation).toHaveBeenCalledTimes(1);
    expect(entityProviderConnection.applyMutation).toHaveBeenCalledWith({
      type: 'full',
      entities: mock.expected_location_entities_default_branch.filter(
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
      entities: mock.expected_location_entities_default_branch.filter(
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
      entities: mock.expected_location_entities_default_branch.filter(
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

  it('should include archived projects', async () => {
    const config = new ConfigReader(
      mock.config_single_integration_include_archived,
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

    await provider.connect(entityProviderConnection);

    await provider.refresh(logger);

    expect(entityProviderConnection.applyMutation).toHaveBeenCalledWith({
      type: 'full',
      entities: mock.expected_location_entities_including_archived.filter(
        entity =>
          !entity.entity.metadata.annotations[
            'backstage.io/managed-by-location'
          ].includes('awesome'),
      ),
    });
  });

  it('should filter repositories that are excluded', async () => {
    const config = new ConfigReader(
      mock.config_single_integration_exclude_repos,
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

    await provider.connect(entityProviderConnection);

    await provider.refresh(logger);

    expect(entityProviderConnection.applyMutation).toHaveBeenCalledWith({
      type: 'full',
      entities: mock.expected_location_entities_default_branch.filter(
        entity =>
          !entity.entity.metadata.annotations[
            'backstage.io/managed-by-location'
          ].includes('test-repo1') &&
          !entity.entity.metadata.annotations[
            'backstage.io/managed-by-location'
          ].includes('awesome'),
      ),
    });
  });

  // branch and fallback branch are undefined in the config
  it('should ingest catalog from project default branch only', async () => {
    const config = new ConfigReader(mock.config_single_integration);
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
      entities: mock.expected_location_entities_default_branch.filter(
        entity =>
          !entity.entity.metadata.annotations[
            'backstage.io/managed-by-location'
          ].includes('awesome'),
      ),
    });
  });

  // should use search to find entities to process
  it('should find catalog from finding projects', async () => {
    const config = new ConfigReader(mock.config_single_integration_with_search);
    const schedule = new PersistingTaskRunner();
    const entityProviderConnection: EntityProviderConnection = {
      applyMutation: jest.fn(),
      refresh: jest.fn(),
    };
    const provider = GitlabDiscoveryEntityProvider.fromConfig(config, {
      logger,
      schedule,
    })[0];

    expect((provider as any).config.useSearch).toBe(true);

    await provider.connect(entityProviderConnection);

    await provider.refresh(logger);

    expect(entityProviderConnection.applyMutation).toHaveBeenCalledWith({
      type: 'full',
      entities: mock.expected_location_from_search_on_group_1,
    });
  });

  // branch was set in the config
  it('should ingest catalog from specific branch only', async () => {
    const config = new ConfigReader(
      mock.config_single_integration_specific_branch,
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

    await provider.connect(entityProviderConnection);

    await provider.refresh(logger);

    expect(entityProviderConnection.applyMutation).toHaveBeenCalledWith({
      type: 'full',
      entities: mock.expected_location_entities_specific_branch.filter(
        entity =>
          !entity.entity.metadata.annotations[
            'backstage.io/managed-by-location'
          ].includes('awesome'),
      ),
    });
  });

  // fallback branch was set in the config
  it('should ingest catalog from default or fallback branch', async () => {
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

    await provider.connect(entityProviderConnection);

    await provider.refresh(logger);

    expect(entityProviderConnection.applyMutation).toHaveBeenCalledWith({
      type: 'full',
      entities: mock.expected_location_entities_fallback_branch.filter(
        entity =>
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
      entities: mock.expected_location_entities_default_branch.filter(entity =>
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
    const config = new ConfigReader(mock.config_single_integration);

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
    const config = new ConfigReader(mock.config_single_integration);
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
    const config = new ConfigReader(mock.config_single_integration);
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

  it('should ignore projects when none of the groups regex patterns match', async () => {
    const config = new ConfigReader(mock.config_groupPatterns_only_noMatch);

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
      entities: [],
    });

    expect(entityProviderConnection.applyMutation).toHaveBeenCalledTimes(1); // No entities should be applied
  });

  it('should include only the project that matches one of the group regex patterns', async () => {
    const config = new ConfigReader(mock.config_groupPatterns_only_Match1Group);

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
      entities: mock.expected_location_entities_default_branch.filter(
        entity =>
          entity.entity.metadata.annotations[
            'backstage.io/managed-by-location'
          ].includes('/group1/'), // Only projects in 'group2' should match
      ),
    });

    expect(entityProviderConnection.applyMutation).toHaveBeenCalledTimes(1); // Only one matching project should be applied
  });

  it('should include projects that match multiple group regex patterns', async () => {
    const config = new ConfigReader(mock.config_groupPatterns_multiple_matches);

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
      entities: mock.expected_location_entities_default_branch.filter(
        entity =>
          entity.entity.metadata.annotations[
            'backstage.io/managed-by-location'
          ].includes('/group1/') ||
          entity.entity.metadata.annotations[
            'backstage.io/managed-by-location'
          ].includes('/group2/'),
      ),
    });

    expect(entityProviderConnection.applyMutation).toHaveBeenCalledTimes(1); // Projects from both groups should be applied
  });

  it('should not create duplicate locations when multiple groupPatterns match the same group', async () => {
    const config = new ConfigReader(mock.config_groupPatterns_duplicate_match);

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
      entities: mock.expected_location_entities_default_branch.filter(entity =>
        entity.entity.metadata.annotations[
          'backstage.io/managed-by-location'
        ].includes('/group1/'),
      ),
    });

    expect(entityProviderConnection.applyMutation).toHaveBeenCalledTimes(1);
  });
});

describe('GitlabDiscoveryEntityProvider - simple parameter', () => {
  it('should pass simple=true when skipForkedRepos is false', async () => {
    const config = new ConfigReader({
      integrations: {
        gitlab: [
          {
            host: 'example.com',
            apiBaseUrl: 'https://example.com/api/v4',
            token: 'test-token',
          },
        ],
      },
      catalog: {
        providers: {
          gitlab: {
            'test-id': {
              host: 'example.com',
              group: 'test-group',
              skipForkedRepos: false,
            },
          },
        },
      },
    });

    const schedule = new PersistingTaskRunner();
    const entityProviderConnection: EntityProviderConnection = {
      applyMutation: jest.fn(),
      refresh: jest.fn(),
    };

    const provider = GitlabDiscoveryEntityProvider.fromConfig(config, {
      logger,
      schedule,
    })[0];

    // Mock the GitLabClient listProjects method to verify parameters
    const mockListProjects = jest.fn().mockResolvedValue({
      items: [],
      nextPage: undefined,
    });

    (provider as any).gitLabClient.listProjects = mockListProjects;

    await provider.connect(entityProviderConnection);
    await provider.refresh(logger);

    expect(mockListProjects).toHaveBeenCalledWith({
      group: 'test-group',
      page: undefined,
      per_page: 50,
      archived: false,
      simple: true, // Should be set when skipForkedRepos is false
    });
  });

  it('should not pass simple when skipForkedRepos is true', async () => {
    const config = new ConfigReader({
      integrations: {
        gitlab: [
          {
            host: 'example.com',
            apiBaseUrl: 'https://example.com/api/v4',
            token: 'test-token',
          },
        ],
      },
      catalog: {
        providers: {
          gitlab: {
            'test-id': {
              host: 'example.com',
              group: 'test-group',
              skipForkedRepos: true,
            },
          },
        },
      },
    });

    const schedule = new PersistingTaskRunner();
    const entityProviderConnection: EntityProviderConnection = {
      applyMutation: jest.fn(),
      refresh: jest.fn(),
    };

    const provider = GitlabDiscoveryEntityProvider.fromConfig(config, {
      logger,
      schedule,
    })[0];

    // Mock the GitLabClient listProjects method to verify parameters
    const mockListProjects = jest.fn().mockResolvedValue({
      items: [],
      nextPage: undefined,
    });

    (provider as any).gitLabClient.listProjects = mockListProjects;

    await provider.connect(entityProviderConnection);
    await provider.refresh(logger);

    expect(mockListProjects).toHaveBeenCalledWith({
      group: 'test-group',
      page: undefined,
      per_page: 50,
      archived: false,
      // simple should not be present when skipForkedRepos is true
    });
  });
});
