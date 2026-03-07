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
  BackstageCredentials,
} from '@backstage/backend-plugin-api';
import {
  mockServices,
  registerMswTestHooks,
} from '@backstage/backend-test-utils';
import { ConfigReader } from '@backstage/config';
import {
  CatalogService,
  DeferredEntity,
  EntityProviderConnection,
  locationSpecToLocationEntity,
} from '@backstage/plugin-catalog-node';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import {
  BitbucketServerEntityProvider,
  toDeferredEntities,
} from './BitbucketServerEntityProvider';
import { BitbucketServerPagedResponse } from '../lib';
import { Entity, LocationEntity } from '@backstage/catalog-model';
import { BitbucketServerEvents } from '../lib/index';
import { DefaultEventsService } from '@backstage/plugin-events-node';
import { catalogServiceMock } from '@backstage/plugin-catalog-node/testUtils';

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

const authService = mockServices.auth.mock();

const events = DefaultEventsService.create({ logger });

const server = setupServer();

function setupStubs(
  projects: Project[],
  baseUrl: string,
  defaultBranch: string,
) {
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
              defaultBranch: defaultBranch,
            });
          }
          return res(ctx.json(pagedResponse(response)));
        },
      ),
    );
  }
}

function setupStubsWithoutDefaultBranch(
  projects: Project[],
  baseUrl: string,
  defaultBranchFromApi: string = 'main',
) {
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
    // Stub list repositories without defaultBranch
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
              // Intentionally NOT including defaultBranch
            });
          }
          return res(ctx.json(pagedResponse(response)));
        },
      ),
    );

    // Stub default branch endpoint for each repo
    for (const repo of project.repos) {
      server.use(
        rest.get(
          `${baseUrl}/rest/api/1.0/projects/${project.key}/repos/${repo.name}/default-branch`,
          (_, res, ctx) => {
            return res(
              ctx.json({
                id: `refs/heads/${defaultBranchFromApi}`,
                displayId: defaultBranchFromApi,
                type: 'BRANCH',
              }),
            );
          },
        ),
      );
    }
  }
}

const host = 'bitbucket.mycompany.com';
const targetPath = `/catalog-info.yaml`;
const test1RepoUrl = `https://${host}/projects/TEST/repos/test1/browse`;

function setupRepositoryReqHandler(defaultBranch: string) {
  server.use(
    rest.get(
      `https://${host}/rest/api/1.0/projects/TEST/repos/test1`,
      (_, res, ctx) => {
        const response = {
          slug: 'test1',
          id: 1,
          name: 'test1',
          project: {
            key: 'TEST',
            id: 1,
            name: 'TEST',
            links: {
              self: [
                {
                  href: `https://${host}/projects/TEST`,
                },
              ],
            },
          },
          links: {
            self: [
              {
                href: `${test1RepoUrl}`,
              },
            ],
          },
          defaultBranch: defaultBranch,
        };
        return res(ctx.json(response));
      },
    ),
  );
}

function setupRepositoryDefaultBranchReqHandler(defaultBranch: string) {
  server.use(
    rest.get(
      `https://${host}/rest/api/1.0/projects/TEST/repos/test1/default-branch`,
      (_, res, ctx) => {
        const response = {
          id: `refs/heads/${defaultBranch}`,
          displayId: defaultBranch,
          type: 'BRANCH',
        };
        return res(ctx.json(response));
      },
    ),
  );
}

const repoPushEvent: BitbucketServerEvents.RefsChangedEvent = {
  eventKey: 'repo:refs_changed',
  date: '2017-09-19T09:45:32+1000',
  actor: {
    name: 'admin',
    id: 1,
  },
  repository: {
    slug: 'test1',
    id: 84,
    name: 'test1',
    project: {
      key: 'TEST',
    },
  },
  changes: [
    {
      ref: {
        id: 'refs/heads/master',
        displayId: 'master',
        type: 'BRANCH',
      },
    },
  ],
  commits: undefined,
  ToCommit: undefined,
};
const repoPushEventParams = {
  topic: 'bitbucketServer.repo:refs_changed',
  eventPayload: repoPushEvent,
  metadata: { 'x-event-key': 'repo:refs_changed' },
};

const createTargetPath = (branch: string): string => {
  return `${targetPath}?at=${branch}`;
};

const createLocationEntity = (
  repoUrl: string,
  path: string,
  defaultBranch: string,
): LocationEntity => {
  const target = `${repoUrl}${path}`;

  const entity = locationSpecToLocationEntity({
    location: {
      type: 'url',
      target: target,
      presence: 'optional',
    },
  });
  entity.metadata.annotations = {
    ...entity.metadata.annotations,
    [`${host}/repo-url`]: target,
    ['bitbucket.org/default-branch']: defaultBranch,
  };

  return entity;
};

describe('BitbucketServerEntityProvider', () => {
  registerMswTestHooks(server);
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
      events,
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
      events,
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
    const branch = 'master';
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
      branch,
    );
    await provider.connect(entityProviderConnection);

    const taskDef = schedule.getTasks()[0];
    expect(taskDef.id).toEqual('bitbucketServer-provider:mainProvider:refresh');
    await (taskDef.fn as () => Promise<void>)();

    const url = `https://${host}/projects/project-test/repos/repo-test/browse/catalog-info.yaml?at=${branch}`;
    const expectedEntities = [
      {
        entity: {
          apiVersion: 'backstage.io/v1alpha1',
          kind: 'Location',
          metadata: {
            annotations: {
              'backstage.io/managed-by-location': `url:${url}`,
              'backstage.io/managed-by-origin-location': `url:${url}`,
              'bitbucket.org/default-branch': branch,
            },
            name: 'generated-982d0be78841bb30cd6a776e5d4522d7c5c260b7',
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
    const branch = 'master';
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
      branch,
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
              'backstage.io/managed-by-location': `url:https://${host}/projects/project-test/repos/repo-test/browse/catalog-info.yaml?at=${branch}`,
              'backstage.io/managed-by-origin-location': `url:https://${host}/projects/project-test/repos/repo-test/browse/catalog-info.yaml?at=${branch}`,
              'bitbucket.org/default-branch': branch,
            },
            name: 'generated-982d0be78841bb30cd6a776e5d4522d7c5c260b7',
          },
          spec: {
            presence: 'optional',
            target: `https://${host}/projects/project-test/repos/repo-test/browse/catalog-info.yaml?at=${branch}`,
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
              'backstage.io/managed-by-location': `url:https://${host}/projects/other-project/repos/other-repo/browse/catalog-info.yaml?at=${branch}`,
              'backstage.io/managed-by-origin-location': `url:https://${host}/projects/other-project/repos/other-repo/browse/catalog-info.yaml?at=${branch}`,
              'bitbucket.org/default-branch': branch,
            },
            name: 'generated-295de61613c10e934b308cff918541757b77c611',
          },
          spec: {
            presence: 'optional',
            target: `https://${host}/projects/other-project/repos/other-repo/browse/catalog-info.yaml?at=${branch}`,
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
    } as unknown as SchedulerService;
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
    const branch = 'master';
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
    } as unknown as SchedulerService;
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
      branch,
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
              'backstage.io/managed-by-location': `url:https://${host}/projects/project-test/repos/repo-test/browse/catalog-info.yaml?at=${branch}`,
              'backstage.io/managed-by-origin-location': `url:https://${host}/projects/project-test/repos/repo-test/browse/catalog-info.yaml?at=${branch}`,
              'bitbucket.org/default-branch': branch,
            },
            name: 'generated-982d0be78841bb30cd6a776e5d4522d7c5c260b7',
          },
          spec: {
            presence: 'optional',
            target: `https://${host}/projects/project-test/repos/repo-test/browse/catalog-info.yaml?at=${branch}`,
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
              'backstage.io/managed-by-location': `url:https://${host}/projects/other-project/repos/other-repo/browse/catalog-info.yaml?at=${branch}`,
              'backstage.io/managed-by-origin-location': `url:https://${host}/projects/other-project/repos/other-repo/browse/catalog-info.yaml?at=${branch}`,
              'bitbucket.org/default-branch': branch,
            },
            name: 'generated-295de61613c10e934b308cff918541757b77c611',
          },
          spec: {
            presence: 'optional',
            target: `https://${host}/projects/other-project/repos/other-repo/browse/catalog-info.yaml?at=${branch}`,
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

  it('do not add locations when validateLocationsExist and catalog-info does not exist', async () => {
    const branch = 'master';
    server.use(
      rest.get(
        `https://${host}/rest/api/1.0/projects/project-test/repos/repo-test/raw/catalog-info.yaml`,
        (_, res, ctx) => {
          return res(ctx.status(404));
        },
      ),
      rest.get(
        `https://${host}/rest/api/1.0/projects/other-project/repos/other-repo/raw/catalog-info.yaml`,
        (_, res, ctx) => {
          return res(ctx.status(200));
        },
      ),
    );
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
              validateLocationsExist: true,
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
      branch,
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
              'backstage.io/managed-by-location': `url:https://${host}/projects/other-project/repos/other-repo/browse/catalog-info.yaml?at=${branch}`,
              'backstage.io/managed-by-origin-location': `url:https://${host}/projects/other-project/repos/other-repo/browse/catalog-info.yaml?at=${branch}`,
              'bitbucket.org/default-branch': branch,
            },
            name: 'generated-295de61613c10e934b308cff918541757b77c611',
          },
          spec: {
            presence: 'optional',
            target: `https://${host}/projects/other-project/repos/other-repo/browse/catalog-info.yaml?at=${branch}`,
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

  it('Multiple location entities to deferred entities', async () => {
    const branch = 'master';
    const schedule = new PersistingTaskRunner();
    const config = new ConfigReader({
      catalog: {
        providers: {
          bitbucketServer: {
            host: host,
          },
        },
      },
      integrations: {
        bitbucketServer: [
          {
            host: host,
          },
        ],
      },
    });
    const providers = BitbucketServerEntityProvider.fromConfig(config, {
      logger,
      events,
      schedule,
    });

    expect(providers).toHaveLength(1);
    expect(providers[0].getProviderName()).toEqual(
      'bitbucketServer-provider:default',
    );

    const locationEntities = [
      {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Location',
        metadata: {
          annotations: {
            'backstage.io/managed-by-location': `url:https://${host}/projects/project-test/repos/repo-test/browse/catalog-info.yaml`,
            'backstage.io/managed-by-origin-location': `url:https://${host}/projects/project-test/repos/repo-test/browse/catalog-info.yaml`,
            [`${host}/repo-url`]: `https://${host}/projects/project-test/repos/repo-test/browse/catalog-info.yaml`,
            'bitbucket.org/default-branch': branch,
          },
          name: 'generated-77f4323822420990f8c3e3c981d38c2dec4ae3a6',
        },
        spec: {
          presence: 'optional',
          target: `https://${host}/projects/project-test/repos/repo-test/browse/catalog-info.yaml`,
          type: 'url',
        },
      },
      {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Location',
        metadata: {
          annotations: {
            'backstage.io/managed-by-location': `url:https://${host}/projects/other-project/repos/other-repo/browse/catalog-info.yaml`,
            'backstage.io/managed-by-origin-location': `url:https://${host}/projects/other-project/repos/other-repo/browse/catalog-info.yaml`,
            [`${host}/repo-url`]: `https://${host}/projects/other-project/repos/other-repo/browse/catalog-info.yaml`,
            'bitbucket.org/default-branch': branch,
          },
          name: 'generated-d8d4944c30c2906dfee172ddda9537f9893b2c0f',
        },
        spec: {
          presence: 'optional',
          target: `https://${host}/projects/other-project/repos/other-repo/browse/catalog-info.yaml`,
          type: 'url',
        },
      },
    ];

    const deferredEntities = toDeferredEntities(
      locationEntities,
      providers[0].getProviderName(),
    );

    expect(deferredEntities).toEqual([
      {
        locationKey: providers[0].getProviderName(),
        entity: locationEntities[0],
      },
      {
        locationKey: providers[0].getProviderName(),
        entity: locationEntities[1],
      },
    ]);
  });

  it('apply full update with non-standard branch from API', async () => {
    const branch = 'release/v1.0';
    const encodedBranch = 'release%2Fv1.0';
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

    setupStubsWithoutDefaultBranch(
      [
        { key: 'project-test', repos: [{ name: 'repo-test' }] },
        { key: 'other-project', repos: [{ name: 'other-repo' }] },
      ],
      `https://${host}`,
      branch,
    );

    const provider = BitbucketServerEntityProvider.fromConfig(config, {
      logger,
      schedule,
    })[0];

    await provider.connect(entityProviderConnection);

    const taskDef = schedule.getTasks()[0];
    await (taskDef.fn as () => Promise<void>)();

    const expectedEntities = [
      {
        entity: {
          apiVersion: 'backstage.io/v1alpha1',
          kind: 'Location',
          metadata: {
            annotations: {
              'backstage.io/managed-by-location': `url:https://${host}/projects/project-test/repos/repo-test/browse/catalog-info.yaml?at=${encodedBranch}`,
              'backstage.io/managed-by-origin-location': `url:https://${host}/projects/project-test/repos/repo-test/browse/catalog-info.yaml?at=${encodedBranch}`,
              'bitbucket.org/default-branch': branch,
            },
            name: 'generated-2c1fab805f8375d82b995cf9d78dd2a27fd1f764',
          },
          spec: {
            presence: 'optional',
            target: `https://${host}/projects/project-test/repos/repo-test/browse/catalog-info.yaml?at=${encodedBranch}`,
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
              'backstage.io/managed-by-location': `url:https://${host}/projects/other-project/repos/other-repo/browse/catalog-info.yaml?at=${encodedBranch}`,
              'backstage.io/managed-by-origin-location': `url:https://${host}/projects/other-project/repos/other-repo/browse/catalog-info.yaml?at=${encodedBranch}`,
              'bitbucket.org/default-branch': branch,
            },
            name: 'generated-0d7b61b2564776d0c468e49bee9f06080f130fb3',
          },
          spec: {
            presence: 'optional',
            target: `https://${host}/projects/other-project/repos/other-repo/browse/catalog-info.yaml?at=${encodedBranch}`,
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

  it('apply full update with non-standard branch from config', async () => {
    const branch = 'topic/catalog-file';
    const encodedBranch = 'topic%2Fcatalog-file';
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
                branch: branch,
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

    setupStubs(
      [{ key: 'project-test', repos: [{ name: 'repo-test' }] }],
      `https://${host}`,
      branch,
    );

    const provider = BitbucketServerEntityProvider.fromConfig(config, {
      logger,
      schedule,
    })[0];

    await provider.connect(entityProviderConnection);

    const taskDef = schedule.getTasks()[0];
    await (taskDef.fn as () => Promise<void>)();

    const expectedEntities = [
      {
        entity: {
          apiVersion: 'backstage.io/v1alpha1',
          kind: 'Location',
          metadata: {
            annotations: {
              'backstage.io/managed-by-location': `url:https://${host}/projects/project-test/repos/repo-test/browse/catalog-info.yaml?at=${encodedBranch}`,
              'backstage.io/managed-by-origin-location': `url:https://${host}/projects/project-test/repos/repo-test/browse/catalog-info.yaml?at=${encodedBranch}`,
              'bitbucket.org/default-branch': branch,
            },
            name: 'generated-c1e9f7e775e39dea458c66579d47f2c1b0682cba',
          },
          spec: {
            presence: 'optional',
            target: `https://${host}/projects/project-test/repos/repo-test/browse/catalog-info.yaml?at=${encodedBranch}`,
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

  it('refresh onRepoPush', async () => {
    const branch = 'master';
    const schedule = new PersistingTaskRunner();
    const keptModule = createLocationEntity(
      test1RepoUrl,
      `/kept-module:${createTargetPath(branch)}`,
      branch,
    );
    const entityProviderConnection: EntityProviderConnection = {
      applyMutation: jest.fn(),
      refresh: jest.fn(),
    };

    setupRepositoryReqHandler(branch);
    setupRepositoryDefaultBranchReqHandler(branch);

    // authService.getOwnServiceCredentials();

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
              apiBaseUrl: `https://${host}/rest/api/1.0`,
              catalogPath: `/kept-module:/catalog-info.yaml`,
              defaultBranch: branch,
            },
          },
        },
      },
    });

    const catalogApi = catalogServiceMock.mock({
      getEntities: async (
        request: { filter: Record<string, string> },
        credentials: { credentials: BackstageCredentials },
      ): Promise<{ items: Entity[] }> => {
        if (
          credentials.credentials !==
            (await authService.getOwnServiceCredentials()) ||
          request.filter.kind !== 'Location' ||
          request.filter[`metadata.annotations.${host}/repo-url`] !==
            `${test1RepoUrl}/kept-module:${createTargetPath(branch)}`
        ) {
          return { items: [] };
        }
        return {
          items: [keptModule],
        };
      },
    });

    const provider = BitbucketServerEntityProvider.fromConfig(config, {
      catalogApi: catalogApi,
      logger,
      schedule,
      events,
      auth: authService,
    })[0];

    await provider.connect(entityProviderConnection);
    await events.publish(repoPushEventParams);

    expect(entityProviderConnection.refresh).toHaveBeenCalledTimes(1);
    expect(entityProviderConnection.refresh).toHaveBeenCalledWith({
      keys: [`url:${test1RepoUrl}/kept-module:${createTargetPath(branch)}`],
    });
    expect(entityProviderConnection.applyMutation).toHaveBeenCalledTimes(0);
  });

  it('no refresh onRepoPush due to different default branch', async () => {
    const branch = 'main';
    const schedule = new PersistingTaskRunner();
    const keptModule = createLocationEntity(
      test1RepoUrl,
      `/kept-module:${createTargetPath(branch)}`,
      branch,
    );
    const entityProviderConnection: EntityProviderConnection = {
      applyMutation: jest.fn(),
      refresh: jest.fn(),
    };

    setupRepositoryReqHandler(branch);
    setupRepositoryDefaultBranchReqHandler(branch);

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
              apiBaseUrl: `https://${host}/rest/api/1.0`,
              catalogPath: `/kept-module:/catalog-info.yaml`,
            },
          },
        },
      },
    });

    const catalogApi = catalogServiceMock.mock({
      getEntities: async (
        request: { filter: Record<string, string> },
        credentials: { credentials: BackstageCredentials },
      ): Promise<{ items: Entity[] }> => {
        if (
          credentials.credentials !==
            (await authService.getOwnServiceCredentials()) ||
          request.filter.kind !== 'Location' ||
          request.filter[`metadata.annotations.${host}/repo-url`] !==
            `${test1RepoUrl}/kept-module:${targetPath}`
        ) {
          return { items: [] };
        }
        return {
          items: [keptModule],
        };
      },
    });

    const provider = BitbucketServerEntityProvider.fromConfig(config, {
      catalogApi: catalogApi,
      logger,
      schedule,
      events,
      auth: authService,
    })[0];

    await provider.connect(entityProviderConnection);
    await events.publish(repoPushEventParams);

    expect(entityProviderConnection.refresh).toHaveBeenCalledTimes(0);
    expect(entityProviderConnection.applyMutation).toHaveBeenCalledTimes(0);
  });

  it('no refresh onRepoPush when event branch does not match filters.branch', async () => {
    const configuredBranch = 'release/v1.0';
    const eventBranch = 'main';
    const encodedBranch = 'release%2Fv1.0';
    const schedule = new PersistingTaskRunner();
    const keptModule = createLocationEntity(
      test1RepoUrl,
      `/kept-module:${targetPath}?at=${encodedBranch}`,
      configuredBranch,
    );
    const entityProviderConnection: EntityProviderConnection = {
      applyMutation: jest.fn(),
      refresh: jest.fn(),
    };

    setupRepositoryReqHandler(configuredBranch);

    // Create push event for a different branch than configured
    const customRepoPushEvent: BitbucketServerEvents.RefsChangedEvent = {
      eventKey: 'repo:refs_changed',
      date: '2017-09-19T09:45:32+1000',
      actor: {
        name: 'admin',
        id: 1,
      },
      repository: {
        slug: 'test1',
        id: 84,
        name: 'test1',
        project: {
          key: 'TEST',
        },
      },
      changes: [
        {
          ref: {
            id: `refs/heads/${eventBranch}`,
            displayId: eventBranch,
            type: 'BRANCH',
          },
        },
      ],
      commits: undefined,
      ToCommit: undefined,
    };

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
              apiBaseUrl: `https://${host}/rest/api/1.0`,
              catalogPath: `/kept-module:/catalog-info.yaml`,
              filters: {
                branch: configuredBranch,
              },
            },
          },
        },
      },
    });

    const catalogApi = catalogServiceMock.mock({
      getEntities: async (
        request: { filter: Record<string, string> },
        credentials: { credentials: BackstageCredentials },
      ): Promise<{ items: Entity[] }> => {
        if (
          credentials.credentials !==
            (await authService.getOwnServiceCredentials()) ||
          request.filter.kind !== 'Location' ||
          request.filter[`metadata.annotations.${host}/repo-url`] !==
            `${test1RepoUrl}/kept-module:${targetPath}?at=${encodedBranch}`
        ) {
          return { items: [] };
        }
        return {
          items: [keptModule],
        };
      },
    });

    const provider = BitbucketServerEntityProvider.fromConfig(config, {
      catalogApi: catalogApi,
      logger,
      schedule,
      events,
      auth: authService,
    })[0];

    await provider.connect(entityProviderConnection);
    await events.publish({
      topic: 'bitbucketServer.repo:refs_changed',
      eventPayload: customRepoPushEvent,
      metadata: { 'x-event-key': 'repo:refs_changed' },
    });

    expect(entityProviderConnection.refresh).toHaveBeenCalledTimes(0);
    expect(entityProviderConnection.applyMutation).toHaveBeenCalledTimes(0);
  });

  it('add onRepoPush', async () => {
    const branch = 'master';
    const schedule = new PersistingTaskRunner();
    setupRepositoryReqHandler(branch);
    authService.getPluginRequestToken.mockResolvedValue({
      token: 'fake-token',
    });
    const addedModule = createLocationEntity(
      test1RepoUrl,
      `/added-module:${createTargetPath(branch)}`,
      branch,
    );

    const entityProviderConnection: EntityProviderConnection = {
      applyMutation: jest.fn(),
      refresh: jest.fn(),
    };

    setupRepositoryDefaultBranchReqHandler(branch);

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
              apiBaseUrl: `https://${host}/rest/api/1.0`,
              catalogPath: `/added-module:/catalog-info.yaml`,
            },
          },
        },
      },
    });

    const catalogApi = catalogServiceMock({ entities: [] });
    const provider = BitbucketServerEntityProvider.fromConfig(config, {
      catalogApi: catalogApi,
      logger,
      schedule,
      events,
      auth: authService,
    })[0];

    await provider.connect(entityProviderConnection);
    await events.publish(repoPushEventParams);
    const addedEntities = [
      {
        entity: addedModule,
        locationKey: 'bitbucketServer-provider:mainProvider',
      },
    ];
    const removedEntities: DeferredEntity[] = [];

    expect(entityProviderConnection.refresh).toHaveBeenCalledTimes(1);
    expect(entityProviderConnection.refresh).toHaveBeenCalledWith({
      keys: [],
    });
    expect(entityProviderConnection.applyMutation).toHaveBeenCalledTimes(1);
    expect(entityProviderConnection.applyMutation).toHaveBeenCalledWith({
      type: 'delta',
      added: addedEntities,
      removed: removedEntities,
    });
  });

  it('fail add onRepoPush from wrong default branch', async () => {
    const branch = 'main';
    const schedule = new PersistingTaskRunner();
    setupRepositoryReqHandler(branch);

    const entityProviderConnection: EntityProviderConnection = {
      applyMutation: jest.fn(),
      refresh: jest.fn(),
    };

    setupRepositoryDefaultBranchReqHandler(branch);

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
              apiBaseUrl: `https://${host}/rest/api/1.0`,
              catalogPath: `/added-module:/catalog-info.yaml`,
            },
          },
        },
      },
    });

    const catalogApi = catalogServiceMock({ entities: [] });
    const provider = BitbucketServerEntityProvider.fromConfig(config, {
      catalogApi: catalogApi as any as CatalogService,
      logger,
      schedule,
      events,
      auth: authService,
    })[0];

    await provider.connect(entityProviderConnection);
    await events.publish(repoPushEventParams);

    expect(entityProviderConnection.refresh).toHaveBeenCalledTimes(0);

    expect(entityProviderConnection.applyMutation).toHaveBeenCalledTimes(0);
  });

  it('refresh onRepoPush with non-standard branch from API', async () => {
    const branch = 'feature/new-catalog';
    const encodedBranch = 'feature%2Fnew-catalog';
    const schedule = new PersistingTaskRunner();
    const keptModule = createLocationEntity(
      test1RepoUrl,
      `/kept-module:${targetPath}?at=${encodedBranch}`,
      branch,
    );
    const entityProviderConnection: EntityProviderConnection = {
      applyMutation: jest.fn(),
      refresh: jest.fn(),
    };

    setupRepositoryReqHandler(branch);
    setupRepositoryDefaultBranchReqHandler(branch);

    // Create custom push event with non-standard branch
    const customRepoPushEvent: BitbucketServerEvents.RefsChangedEvent = {
      eventKey: 'repo:refs_changed',
      date: '2017-09-19T09:45:32+1000',
      actor: {
        name: 'admin',
        id: 1,
      },
      repository: {
        slug: 'test1',
        id: 84,
        name: 'test1',
        project: {
          key: 'TEST',
        },
      },
      changes: [
        {
          ref: {
            id: `refs/heads/${branch}`,
            displayId: branch,
            type: 'BRANCH',
          },
        },
      ],
      commits: undefined,
      ToCommit: undefined,
    };

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
              apiBaseUrl: `https://${host}/rest/api/1.0`,
              catalogPath: `/kept-module:/catalog-info.yaml`,
            },
          },
        },
      },
    });

    const catalogApi = catalogServiceMock.mock({
      getEntities: async (
        request: { filter: Record<string, string> },
        credentials: { credentials: BackstageCredentials },
      ): Promise<{ items: Entity[] }> => {
        if (
          credentials.credentials !==
            (await authService.getOwnServiceCredentials()) ||
          request.filter.kind !== 'Location' ||
          request.filter[`metadata.annotations.${host}/repo-url`] !==
            `${test1RepoUrl}/kept-module:${targetPath}?at=${encodedBranch}`
        ) {
          return { items: [] };
        }
        return {
          items: [keptModule],
        };
      },
    });

    const provider = BitbucketServerEntityProvider.fromConfig(config, {
      catalogApi: catalogApi,
      logger,
      schedule,
      events,
      auth: authService,
    })[0];

    await provider.connect(entityProviderConnection);
    await events.publish({
      topic: 'bitbucketServer.repo:refs_changed',
      eventPayload: customRepoPushEvent,
      metadata: { 'x-event-key': 'repo:refs_changed' },
    });

    expect(entityProviderConnection.refresh).toHaveBeenCalledTimes(1);
    expect(entityProviderConnection.refresh).toHaveBeenCalledWith({
      keys: [
        `url:${test1RepoUrl}/kept-module:${targetPath}?at=${encodedBranch}`,
      ],
    });
    expect(entityProviderConnection.applyMutation).toHaveBeenCalledTimes(0);
  });

  it('refresh onRepoPush with non-standard branch from config', async () => {
    const branch = 'release/v2.0';
    const encodedBranch = 'release%2Fv2.0';
    const schedule = new PersistingTaskRunner();
    const keptModule = createLocationEntity(
      test1RepoUrl,
      `/kept-module:${targetPath}?at=${encodedBranch}`,
      branch,
    );
    const entityProviderConnection: EntityProviderConnection = {
      applyMutation: jest.fn(),
      refresh: jest.fn(),
    };

    setupRepositoryReqHandler(branch);

    // Create custom push event with non-standard branch
    const customRepoPushEvent: BitbucketServerEvents.RefsChangedEvent = {
      eventKey: 'repo:refs_changed',
      date: '2017-09-19T09:45:32+1000',
      actor: {
        name: 'admin',
        id: 1,
      },
      repository: {
        slug: 'test1',
        id: 84,
        name: 'test1',
        project: {
          key: 'TEST',
        },
      },
      changes: [
        {
          ref: {
            id: `refs/heads/${branch}`,
            displayId: branch,
            type: 'BRANCH',
          },
        },
      ],
      commits: undefined,
      ToCommit: undefined,
    };

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
              apiBaseUrl: `https://${host}/rest/api/1.0`,
              catalogPath: `/kept-module:/catalog-info.yaml`,
              filters: {
                branch: branch,
              },
            },
          },
        },
      },
    });

    const catalogApi = catalogServiceMock.mock({
      getEntities: async (
        request: { filter: Record<string, string> },
        credentials: { credentials: BackstageCredentials },
      ): Promise<{ items: Entity[] }> => {
        if (
          credentials.credentials !==
            (await authService.getOwnServiceCredentials()) ||
          request.filter.kind !== 'Location' ||
          request.filter[`metadata.annotations.${host}/repo-url`] !==
            `${test1RepoUrl}/kept-module:${targetPath}?at=${encodedBranch}`
        ) {
          return { items: [] };
        }
        return {
          items: [keptModule],
        };
      },
    });

    const provider = BitbucketServerEntityProvider.fromConfig(config, {
      catalogApi: catalogApi,
      logger,
      schedule,
      events,
      auth: authService,
    })[0];

    await provider.connect(entityProviderConnection);
    await events.publish({
      topic: 'bitbucketServer.repo:refs_changed',
      eventPayload: customRepoPushEvent,
      metadata: { 'x-event-key': 'repo:refs_changed' },
    });

    expect(entityProviderConnection.refresh).toHaveBeenCalledTimes(1);
    expect(entityProviderConnection.refresh).toHaveBeenCalledWith({
      keys: [
        `url:${test1RepoUrl}/kept-module:${targetPath}?at=${encodedBranch}`,
      ],
    });
    expect(entityProviderConnection.applyMutation).toHaveBeenCalledTimes(0);
  });
});
