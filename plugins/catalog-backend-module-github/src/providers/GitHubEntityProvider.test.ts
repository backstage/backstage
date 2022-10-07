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

import { getVoidLogger } from '@backstage/backend-common';
import {
  PluginTaskScheduler,
  TaskInvocationDefinition,
  TaskRunner,
} from '@backstage/backend-tasks';
import { ConfigReader } from '@backstage/config';
import { EntityProviderConnection } from '@backstage/plugin-catalog-backend';
import { GitHubEntityProvider } from './GitHubEntityProvider';
import * as helpers from '../lib/github';

jest.mock('../lib/github', () => {
  return {
    getOrganizationRepositories: jest.fn(),
  };
});
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

describe('GitHubEntityProvider', () => {
  afterEach(() => jest.resetAllMocks());

  it('no provider config', () => {
    const schedule = new PersistingTaskRunner();
    const config = new ConfigReader({});
    const providers = GitHubEntityProvider.fromConfig(config, {
      logger,
      schedule,
    });

    expect(providers).toHaveLength(0);
  });

  it('single simple provider config', () => {
    const schedule = new PersistingTaskRunner();
    const config = new ConfigReader({
      catalog: {
        providers: {
          github: {
            organization: 'test-org',
          },
        },
      },
    });
    const providers = GitHubEntityProvider.fromConfig(config, {
      logger,
      schedule,
    });

    expect(providers).toHaveLength(1);
    expect(providers[0].getProviderName()).toEqual('github-provider:default');
  });

  it('throws when the integration config does not exist', () => {
    const schedule = new PersistingTaskRunner();
    const config = new ConfigReader({
      catalog: {
        providers: {
          github: {
            organization: 'test-org',
            host: 'ghe.internal.com',
          },
        },
      },
    });

    expect(() =>
      GitHubEntityProvider.fromConfig(config, {
        logger,
        schedule,
      }),
    ).toThrow(/There is no GitHub config that matches host ghe.internal.com/);
  });

  it('multiple provider configs', () => {
    const schedule = new PersistingTaskRunner();
    const config = new ConfigReader({
      catalog: {
        providers: {
          github: {
            myProvider: {
              organization: 'test-org1',
            },
            anotherProvider: {
              organization: 'test-org2',
            },
          },
        },
      },
    });
    const providers = GitHubEntityProvider.fromConfig(config, {
      logger,
      schedule,
    });

    expect(providers).toHaveLength(2);
    expect(providers[0].getProviderName()).toEqual(
      'github-provider:myProvider',
    );
    expect(providers[1].getProviderName()).toEqual(
      'github-provider:anotherProvider',
    );
  });

  it('apply full update on scheduled execution with basic filters', async () => {
    const config = new ConfigReader({
      catalog: {
        providers: {
          github: {
            myProvider: {
              organization: 'test-org',
              catalogPath: 'custom/path/catalog-custom.yaml',
              filters: {
                branch: 'main',
                repository: 'test-.*',
              },
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

    const provider = GitHubEntityProvider.fromConfig(config, {
      logger,
      schedule,
    })[0];

    const mockGetOrganizationRepositories = jest.spyOn(
      helpers,
      'getOrganizationRepositories',
    );

    mockGetOrganizationRepositories.mockReturnValue(
      Promise.resolve({
        repositories: [
          {
            name: 'test-repo',
            url: 'https://github.com/test-org/test-repo',
            repositoryTopics: { nodes: [] },
            isArchived: false,
            defaultBranchRef: {
              name: 'main',
            },
          },
        ],
      }),
    );

    await provider.connect(entityProviderConnection);

    const taskDef = schedule.getTasks()[0];
    expect(taskDef.id).toEqual('github-provider:myProvider:refresh');
    await (taskDef.fn as () => Promise<void>)();

    const url = `https://github.com/test-org/test-repo/blob/main/custom/path/catalog-custom.yaml`;
    const expectedEntities = [
      {
        entity: {
          apiVersion: 'backstage.io/v1alpha1',
          kind: 'Location',
          metadata: {
            annotations: {
              'backstage.io/managed-by-location': `url:${url}`,
              'backstage.io/managed-by-origin-location': `url:${url}`,
            },
            name: 'generated-5e4b9498097f15434e88c477cfba6c079aa8ca7f',
          },
          spec: {
            presence: 'optional',
            target: `${url}`,
            type: 'url',
          },
        },
        locationKey: 'github-provider:myProvider',
      },
    ];

    expect(entityProviderConnection.applyMutation).toHaveBeenCalledTimes(1);
    expect(entityProviderConnection.applyMutation).toHaveBeenCalledWith({
      type: 'full',
      entities: expectedEntities,
    });
  });

  it('apply full update on scheduled execution with topic exclusion', async () => {
    const config = new ConfigReader({
      catalog: {
        providers: {
          github: {
            myProvider: {
              organization: 'test-org',
              catalogPath: 'custom/path/catalog-custom.yaml',
              filters: {
                branch: 'main',
                repository: 'test-.*',
                topic: {
                  exclude: ['backstage-exclude'],
                },
              },
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

    const provider = GitHubEntityProvider.fromConfig(config, {
      logger,
      schedule,
    })[0];

    const mockGetOrganizationRepositories = jest.spyOn(
      helpers,
      'getOrganizationRepositories',
    );

    mockGetOrganizationRepositories.mockReturnValue(
      Promise.resolve({
        repositories: [
          {
            name: 'test-repo',
            url: 'https://github.com/test-org/test-repo',
            repositoryTopics: {
              nodes: [
                {
                  topic: { name: 'backstage-exclude' },
                },
                {
                  topic: { name: 'neat-repos' },
                },
              ],
            },
            isArchived: false,
            defaultBranchRef: {
              name: 'main',
            },
          },
        ],
      }),
    );

    await provider.connect(entityProviderConnection);

    const taskDef = schedule.getTasks()[0];
    expect(taskDef.id).toEqual('github-provider:myProvider:refresh');
    await (taskDef.fn as () => Promise<void>)();

    expect(entityProviderConnection.applyMutation).toHaveBeenCalledTimes(1);
    expect(entityProviderConnection.applyMutation).toHaveBeenCalledWith({
      type: 'full',
      entities: [],
    });
  });

  it('apply full update on scheduled execution with topic inclusion', async () => {
    const config = new ConfigReader({
      catalog: {
        providers: {
          github: {
            myProvider: {
              organization: 'test-org',
              catalogPath: 'custom/path/catalog-custom.yaml',
              filters: {
                branch: 'main',
                repository: 'test-.*',
                topic: {
                  include: ['backstage-include'],
                },
              },
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

    const provider = GitHubEntityProvider.fromConfig(config, {
      logger,
      schedule,
    })[0];

    const mockGetOrganizationRepositories = jest.spyOn(
      helpers,
      'getOrganizationRepositories',
    );

    mockGetOrganizationRepositories.mockReturnValue(
      Promise.resolve({
        repositories: [
          {
            name: 'test-repo',
            url: 'https://github.com/test-org/test-repo',
            repositoryTopics: {
              nodes: [
                {
                  topic: { name: 'backstage-include' },
                },
                {
                  topic: { name: 'fruits' },
                },
              ],
            },
            isArchived: false,
            defaultBranchRef: {
              name: 'main',
            },
          },
        ],
      }),
    );

    await provider.connect(entityProviderConnection);

    const taskDef = schedule.getTasks()[0];
    expect(taskDef.id).toEqual('github-provider:myProvider:refresh');
    await (taskDef.fn as () => Promise<void>)();

    const url = `https://github.com/test-org/test-repo/blob/main/custom/path/catalog-custom.yaml`;
    const expectedEntities = [
      {
        entity: {
          apiVersion: 'backstage.io/v1alpha1',
          kind: 'Location',
          metadata: {
            annotations: {
              'backstage.io/managed-by-location': `url:${url}`,
              'backstage.io/managed-by-origin-location': `url:${url}`,
            },
            name: 'generated-5e4b9498097f15434e88c477cfba6c079aa8ca7f',
          },
          spec: {
            presence: 'optional',
            target: `${url}`,
            type: 'url',
          },
        },
        locationKey: 'github-provider:myProvider',
      },
    ];

    expect(entityProviderConnection.applyMutation).toHaveBeenCalledTimes(1);
    expect(entityProviderConnection.applyMutation).toHaveBeenCalledWith({
      type: 'full',
      entities: expectedEntities,
    });
  });

  it('apply full update on scheduled execution with topic exclusion taking priority over topic inclusion', async () => {
    const config = new ConfigReader({
      catalog: {
        providers: {
          github: {
            myProvider: {
              organization: 'test-org',
              catalogPath: 'custom/path/catalog-custom.yaml',
              filters: {
                branch: 'main',
                repository: 'test-.*',
                topic: {
                  exclude: ['backstage-exclude'],
                  include: ['backstage-include'],
                },
              },
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

    const provider = GitHubEntityProvider.fromConfig(config, {
      logger,
      schedule,
    })[0];

    const mockGetOrganizationRepositories = jest.spyOn(
      helpers,
      'getOrganizationRepositories',
    );

    mockGetOrganizationRepositories.mockReturnValue(
      Promise.resolve({
        repositories: [
          {
            name: 'test-repo',
            url: 'https://github.com/test-org/test-repo',
            repositoryTopics: {
              nodes: [
                {
                  topic: { name: 'backstage-include' },
                },
              ],
            },
            isArchived: false,
            defaultBranchRef: {
              name: 'main',
            },
          },
          {
            name: 'test-repo-2',
            url: 'https://github.com/test-org/test-repo-2',
            repositoryTopics: {
              nodes: [
                {
                  topic: { name: 'backstage-include' },
                },
                {
                  topic: { name: 'backstage-exclude' },
                },
              ],
            },
            isArchived: false,
            defaultBranchRef: {
              name: 'main',
            },
          },
          {
            name: 'test-repo-3',
            url: 'https://github.com/test-org/test-repo-3',
            repositoryTopics: {
              nodes: [
                {
                  topic: { name: 'backstage-exclude' },
                },
              ],
            },
            isArchived: false,
            defaultBranchRef: {
              name: 'main',
            },
          },
        ],
      }),
    );

    await provider.connect(entityProviderConnection);

    const taskDef = schedule.getTasks()[0];
    expect(taskDef.id).toEqual('github-provider:myProvider:refresh');
    await (taskDef.fn as () => Promise<void>)();

    const url = `https://github.com/test-org/test-repo/blob/main/custom/path/catalog-custom.yaml`;
    const expectedEntities = [
      {
        entity: {
          apiVersion: 'backstage.io/v1alpha1',
          kind: 'Location',
          metadata: {
            annotations: {
              'backstage.io/managed-by-location': `url:${url}`,
              'backstage.io/managed-by-origin-location': `url:${url}`,
            },
            name: 'generated-5e4b9498097f15434e88c477cfba6c079aa8ca7f',
          },
          spec: {
            presence: 'optional',
            target: `${url}`,
            type: 'url',
          },
        },
        locationKey: 'github-provider:myProvider',
      },
    ];

    expect(entityProviderConnection.applyMutation).toHaveBeenCalledTimes(1);
    expect(entityProviderConnection.applyMutation).toHaveBeenCalledWith({
      type: 'full',
      entities: expectedEntities,
    });
  });

  it('fail without schedule and scheduler', () => {
    const config = new ConfigReader({
      catalog: {
        providers: {
          github: {
            organization: 'test-org',
          },
        },
      },
    });

    expect(() =>
      GitHubEntityProvider.fromConfig(config, {
        logger,
      }),
    ).toThrow('Either schedule or scheduler must be provided');
  });

  it('fail with scheduler but no schedule config', () => {
    const scheduler = {
      createScheduledTaskRunner: (_: any) => jest.fn(),
    } as unknown as PluginTaskScheduler;
    const config = new ConfigReader({
      catalog: {
        providers: {
          github: {
            organization: 'test-org',
          },
        },
      },
    });

    expect(() =>
      GitHubEntityProvider.fromConfig(config, {
        logger,
        scheduler,
      }),
    ).toThrow(
      'No schedule provided neither via code nor config for github-provider:default',
    );
  });

  it('single simple provider config with schedule in config', async () => {
    const schedule = new PersistingTaskRunner();
    const scheduler = {
      createScheduledTaskRunner: (_: any) => schedule,
    } as unknown as PluginTaskScheduler;
    const config = new ConfigReader({
      catalog: {
        providers: {
          github: {
            organization: 'test-org',
            schedule: {
              frequency: 'P1M',
              timeout: 'PT3M',
            },
          },
        },
      },
    });
    const providers = GitHubEntityProvider.fromConfig(config, {
      logger,
      scheduler,
    });

    expect(providers).toHaveLength(1);
    expect(providers[0].getProviderName()).toEqual('github-provider:default');
  });
});
