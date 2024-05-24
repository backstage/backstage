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
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { BitbucketServerEntityProvider } from './BitbucketServerEntityProvider';
import { BitbucketServerPagedResponse } from '../lib';

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

type Project = {
  key: string;
  repos: { name: string; archived?: true }[];
};

function pagedResponse(values: any): BitbucketServerPagedResponse<any> {
  return {
    values: values,
    isLastPage: true,
  } as BitbucketServerPagedResponse<any>;
}

const logger = mockServices.logger.mock();

const server = setupServer();

function setupStubs(projects: Project[], baseUrl: string) {
  // Stub projects
  server.use(
    rest.get(`${baseUrl}/rest/api/1.0/projects`, (_, res, ctx) => {
      return res(
        ctx.json(
          pagedResponse(
            projects.map(p => {
              return { key: p.key };
            }),
          ),
        ),
      );
    }),
  );

  for (const project of projects) {
    // Stub list repositories
    server.use(
      rest.get(
        `${baseUrl}/rest/api/1.0/projects/${project.key}/repos`,
        (_, res, ctx) => {
          const response = [];
          for (const repo of project.repos) {
            response.push({
              slug: repo.name,
              links: {
                self: [
                  {
                    href: `${baseUrl}/projects/${project.key}/repos/${repo.name}/browse`,
                  },
                ],
              },
              archived: repo.archived ?? false,
            });
          }
          return res(ctx.json(pagedResponse(response)));
        },
      ),
    );
  }
}

describe('BitbucketServerEntityProvider', () => {
  setupRequestMockHandlers(server);
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('no provider config', () => {
    const schedule = new PersistingTaskRunner();
    const config = new ConfigReader({});
    const providers = BitbucketServerEntityProvider.fromConfig(config, {
      logger,
      schedule,
    });

    expect(providers).toHaveLength(0);
  });

  it('rejects no matching integration', () => {
    const schedule = new PersistingTaskRunner();
    const config = new ConfigReader({
      catalog: {
        providers: {
          bitbucketServer: {
            mainProvider: {
              host: 'bitbucket.mycompany.com',
            },
          },
        },
      },
    });
    expect(() =>
      BitbucketServerEntityProvider.fromConfig(config, { logger, schedule }),
    ).toThrow(/bitbucket\.mycompany\.com/);
  });

  it('single simple provider config', () => {
    const schedule = new PersistingTaskRunner();
    const config = new ConfigReader({
      catalog: {
        providers: {
          bitbucketServer: {
            host: 'bitbucket.mycompany.com',
          },
        },
      },
      integrations: {
        bitbucketServer: [
          {
            host: 'bitbucket.mycompany.com',
          },
        ],
      },
    });
    const providers = BitbucketServerEntityProvider.fromConfig(config, {
      logger,
      schedule,
    });

    expect(providers).toHaveLength(1);
    expect(providers[0].getProviderName()).toEqual(
      'bitbucketServer-provider:default',
    );
  });

  it('multiple provider configs', () => {
    const schedule = new PersistingTaskRunner();
    const config = new ConfigReader({
      integrations: {
        bitbucketServer: [
          {
            host: 'bitbucket.mycompany.com',
          },
        ],
      },
      catalog: {
        providers: {
          bitbucketServer: {
            mainProvider: {
              host: 'bitbucket.mycompany.com',
            },
            secondary: {
              host: 'bitbucket.mycompany.com',
            },
          },
        },
      },
    });
    const providers = BitbucketServerEntityProvider.fromConfig(config, {
      logger,
      schedule,
    });

    expect(providers).toHaveLength(2);
    expect(providers[0].getProviderName()).toEqual(
      'bitbucketServer-provider:mainProvider',
    );
    expect(providers[1].getProviderName()).toEqual(
      'bitbucketServer-provider:secondary',
    );
  });

  it('apply full update on scheduled execution with filters', async () => {
    const host = 'bitbucket.mycompany.com';
    const config = new ConfigReader({
      integrations: {
        bitbucketServer: [
          {
            host: host,
          },
        ],
      },
      catalog: {
        providers: {
          bitbucketServer: {
            mainProvider: {
              host: host,
              filters: {
                projectKey: 'project-.*',
                repoSlug: 'repo-.*',
                skipArchivedRepos: true,
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
    const provider = BitbucketServerEntityProvider.fromConfig(config, {
      logger,
      schedule,
    })[0];
    expect(provider.getProviderName()).toEqual(
      'bitbucketServer-provider:mainProvider',
    );

    setupStubs(
      [
        {
          key: 'project-test',
          repos: [
            { name: 'repo-test' },
            { name: 'repo-archived', archived: true },
          ],
        },
        { key: 'other-project', repos: [{ name: 'other-repo' }] },
      ],
      `https://${host}`,
    );
    await provider.connect(entityProviderConnection);

    const taskDef = schedule.getTasks()[0];
    expect(taskDef.id).toEqual('bitbucketServer-provider:mainProvider:refresh');
    await (taskDef.fn as () => Promise<void>)();

    const url = `https://${host}/projects/project-test/repos/repo-test/browse/catalog-info.yaml`;
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
            name: 'generated-77f4323822420990f8c3e3c981d38c2dec4ae3a6',
          },
          spec: {
            presence: 'optional',
            target: `${url}`,
            type: 'url',
          },
        },
        locationKey: 'bitbucketServer-provider:mainProvider',
      },
    ];

    expect(entityProviderConnection.applyMutation).toHaveBeenCalledTimes(1);
    expect(entityProviderConnection.applyMutation).toHaveBeenCalledWith({
      type: 'full',
      entities: expectedEntities,
    });
  });

  it('apply full update on scheduled execution without filters', async () => {
    const host = 'bitbucket.mycompany.com';
    const config = new ConfigReader({
      integrations: {
        bitbucketServer: [
          {
            host: host,
          },
        ],
      },
      catalog: {
        providers: {
          bitbucketServer: {
            mainProvider: {
              host: host,
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
    const provider = BitbucketServerEntityProvider.fromConfig(config, {
      logger,
      schedule,
    })[0];
    expect(provider.getProviderName()).toEqual(
      'bitbucketServer-provider:mainProvider',
    );

    setupStubs(
      [
        { key: 'project-test', repos: [{ name: 'repo-test' }] },
        { key: 'other-project', repos: [{ name: 'other-repo' }] },
      ],
      `https://${host}`,
    );
    await provider.connect(entityProviderConnection);

    const taskDef = schedule.getTasks()[0];
    expect(taskDef.id).toEqual('bitbucketServer-provider:mainProvider:refresh');
    await (taskDef.fn as () => Promise<void>)();

    const expectedEntities = [
      {
        entity: {
          apiVersion: 'backstage.io/v1alpha1',
          kind: 'Location',
          metadata: {
            annotations: {
              'backstage.io/managed-by-location': `url:https://${host}/projects/project-test/repos/repo-test/browse/catalog-info.yaml`,
              'backstage.io/managed-by-origin-location': `url:https://${host}/projects/project-test/repos/repo-test/browse/catalog-info.yaml`,
            },
            name: 'generated-77f4323822420990f8c3e3c981d38c2dec4ae3a6',
          },
          spec: {
            presence: 'optional',
            target: `https://${host}/projects/project-test/repos/repo-test/browse/catalog-info.yaml`,
            type: 'url',
          },
        },
        locationKey: 'bitbucketServer-provider:mainProvider',
      },
      {
        entity: {
          apiVersion: 'backstage.io/v1alpha1',
          kind: 'Location',
          metadata: {
            annotations: {
              'backstage.io/managed-by-location': `url:https://${host}/projects/other-project/repos/other-repo/browse/catalog-info.yaml`,
              'backstage.io/managed-by-origin-location': `url:https://${host}/projects/other-project/repos/other-repo/browse/catalog-info.yaml`,
            },
            name: 'generated-d8d4944c30c2906dfee172ddda9537f9893b2c0f',
          },
          spec: {
            presence: 'optional',
            target: `https://${host}/projects/other-project/repos/other-repo/browse/catalog-info.yaml`,
            type: 'url',
          },
        },
        locationKey: 'bitbucketServer-provider:mainProvider',
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
          bitbucketServer: {
            host: 'bitbucket.mycompany.com',
          },
        },
      },
      integrations: {
        bitbucketServer: [
          {
            host: 'bitbucket.mycompany.com',
          },
        ],
      },
    });

    expect(() =>
      BitbucketServerEntityProvider.fromConfig(config, {
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
          bitbucketServer: {
            host: 'bitbucket.mycompany.com',
          },
        },
      },
      integrations: {
        bitbucketServer: [
          {
            host: 'bitbucket.mycompany.com',
          },
        ],
      },
    });

    expect(() =>
      BitbucketServerEntityProvider.fromConfig(config, {
        logger,
        scheduler,
      }),
    ).toThrow(
      'No schedule provided neither via code nor config for bitbucketServer-provider:default',
    );
  });

  it('apply full update with schedule in config', async () => {
    const host = 'bitbucket.mycompany.com';
    const config = new ConfigReader({
      integrations: {
        bitbucketServer: [
          {
            host: host,
          },
        ],
      },
      catalog: {
        providers: {
          bitbucketServer: {
            mainProvider: {
              host: host,
              schedule: {
                frequency: 'PT30M',
                timeout: {
                  minutes: 3,
                },
              },
            },
          },
        },
      },
    });
    const schedule = new PersistingTaskRunner();
    const scheduler = {
      createScheduledTaskRunner: (_: any) => schedule,
    } as unknown as PluginTaskScheduler;
    const entityProviderConnection: EntityProviderConnection = {
      applyMutation: jest.fn(),
      refresh: jest.fn(),
    };
    const provider = BitbucketServerEntityProvider.fromConfig(config, {
      logger,
      scheduler,
    })[0];
    expect(provider.getProviderName()).toEqual(
      'bitbucketServer-provider:mainProvider',
    );

    setupStubs(
      [
        { key: 'project-test', repos: [{ name: 'repo-test' }] },
        { key: 'other-project', repos: [{ name: 'other-repo' }] },
      ],
      `https://${host}`,
    );
    await provider.connect(entityProviderConnection);

    const taskDef = schedule.getTasks()[0];
    expect(taskDef.id).toEqual('bitbucketServer-provider:mainProvider:refresh');
    await (taskDef.fn as () => Promise<void>)();

    const expectedEntities = [
      {
        entity: {
          apiVersion: 'backstage.io/v1alpha1',
          kind: 'Location',
          metadata: {
            annotations: {
              'backstage.io/managed-by-location': `url:https://${host}/projects/project-test/repos/repo-test/browse/catalog-info.yaml`,
              'backstage.io/managed-by-origin-location': `url:https://${host}/projects/project-test/repos/repo-test/browse/catalog-info.yaml`,
            },
            name: 'generated-77f4323822420990f8c3e3c981d38c2dec4ae3a6',
          },
          spec: {
            presence: 'optional',
            target: `https://${host}/projects/project-test/repos/repo-test/browse/catalog-info.yaml`,
            type: 'url',
          },
        },
        locationKey: 'bitbucketServer-provider:mainProvider',
      },
      {
        entity: {
          apiVersion: 'backstage.io/v1alpha1',
          kind: 'Location',
          metadata: {
            annotations: {
              'backstage.io/managed-by-location': `url:https://${host}/projects/other-project/repos/other-repo/browse/catalog-info.yaml`,
              'backstage.io/managed-by-origin-location': `url:https://${host}/projects/other-project/repos/other-repo/browse/catalog-info.yaml`,
            },
            name: 'generated-d8d4944c30c2906dfee172ddda9537f9893b2c0f',
          },
          spec: {
            presence: 'optional',
            target: `https://${host}/projects/other-project/repos/other-repo/browse/catalog-info.yaml`,
            type: 'url',
          },
        },
        locationKey: 'bitbucketServer-provider:mainProvider',
      },
    ];

    expect(entityProviderConnection.applyMutation).toHaveBeenCalledTimes(1);
    expect(entityProviderConnection.applyMutation).toHaveBeenCalledWith({
      type: 'full',
      entities: expectedEntities,
    });
  });
});
