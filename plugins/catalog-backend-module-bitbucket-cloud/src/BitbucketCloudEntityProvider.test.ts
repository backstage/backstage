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

import { getVoidLogger, TokenManager } from '@backstage/backend-common';
import {
  PluginTaskScheduler,
  TaskInvocationDefinition,
  TaskRunner,
} from '@backstage/backend-tasks';
import { setupRequestMockHandlers } from '@backstage/backend-test-utils';
import { CatalogApi } from '@backstage/catalog-client';
import { Entity, LocationEntity } from '@backstage/catalog-model';
import { ConfigReader } from '@backstage/config';
import {
  EntityProviderConnection,
  locationSpecToLocationEntity,
} from '@backstage/plugin-catalog-backend';
import { Events } from '@backstage/plugin-bitbucket-cloud-common';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import {
  ANNOTATION_BITBUCKET_CLOUD_REPO_URL,
  BitbucketCloudEntityProvider,
} from './BitbucketCloudEntityProvider';

class PersistingTaskRunner implements TaskRunner {
  private tasks: TaskInvocationDefinition[] = [];

  getTasks() {
    return this.tasks;
  }

  run(task: TaskInvocationDefinition): Promise<void> {
    this.tasks.push(task);
    return Promise.resolve(undefined);
  }

  reset() {
    this.tasks = [];
  }
}

const logger = getVoidLogger();

const server = setupServer();

describe('BitbucketCloudEntityProvider', () => {
  setupRequestMockHandlers(server);

  const simpleConfig = new ConfigReader({
    catalog: {
      providers: {
        bitbucketCloud: {
          workspace: 'test-ws',
        },
      },
    },
  });
  const defaultConfig = new ConfigReader({
    catalog: {
      providers: {
        bitbucketCloud: {
          myProvider: {
            workspace: 'test-ws',
            catalogPath: 'catalog-custom.yaml',
            filters: {
              projectKey: 'test-.*',
              repoSlug: 'test-.*',
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
  const tokenManager = {
    getToken: async () => {
      return { token: 'fake-token' };
    },
  } as any as TokenManager;
  const repoPushEvent: Events.RepoPushEvent = {
    actor: {
      type: 'user',
    },
    repository: {
      type: 'repository',
      slug: 'test-repo',
      links: {
        html: {
          href: 'https://bitbucket.org/test-ws/test-repo',
        },
      },
      workspace: {
        type: 'workspace',
        slug: 'test-ws',
      },
      project: {
        type: 'project',
        key: 'test-project',
      },
    },
    push: {
      changes: [
        // ...
      ],
    },
  };
  const repoPushEventParams = {
    topic: 'bitbucketCloud.repo:push',
    eventPayload: repoPushEvent,
    metadata: { 'x-event-key': 'repo:push' },
  };

  const createLocationEntity = (
    repoUrl: string,
    branch: string,
    targetPath: string,
  ): LocationEntity => {
    const target = `${repoUrl}/src/${branch}/${targetPath}`;

    const entity = locationSpecToLocationEntity({
      location: {
        type: 'url',
        target: target,
        presence: 'required',
      },
    });
    entity.metadata.annotations = {
      ...entity.metadata.annotations,
      [ANNOTATION_BITBUCKET_CLOUD_REPO_URL]: repoUrl,
    };

    return entity;
  };

  afterEach(() => {
    jest.resetAllMocks();
    schedule.reset();
  });

  it('no provider config', () => {
    const config = new ConfigReader({});
    const providers = BitbucketCloudEntityProvider.fromConfig(config, {
      logger,
      schedule,
    });

    expect(providers).toHaveLength(0);
  });

  it('single simple provider config', () => {
    const providers = BitbucketCloudEntityProvider.fromConfig(simpleConfig, {
      logger,
      schedule,
    });

    expect(providers).toHaveLength(1);
    expect(providers[0].getProviderName()).toEqual(
      'bitbucketCloud-provider:default',
    );
  });

  it('fail without schedule and scheduler', () => {
    expect(() =>
      BitbucketCloudEntityProvider.fromConfig(simpleConfig, {
        logger,
      }),
    ).toThrow('Either schedule or scheduler must be provided.');
  });

  it('fail with scheduler but no schedule config', () => {
    const scheduler = jest.fn() as unknown as PluginTaskScheduler;
    const config = new ConfigReader({
      catalog: {
        providers: {
          bitbucketCloud: {
            workspace: 'test-ws',
          },
        },
      },
    });

    expect(() =>
      BitbucketCloudEntityProvider.fromConfig(config, {
        logger,
        scheduler,
      }),
    ).toThrow(
      'No schedule provided neither via code nor config for bitbucketCloud-provider:default.',
    );
  });

  it('single simple provider config with schedule in config', () => {
    const scheduler = {
      createScheduledTaskRunner: (_: any) => jest.fn(),
    } as unknown as PluginTaskScheduler;
    const config = new ConfigReader({
      catalog: {
        providers: {
          bitbucketCloud: {
            workspace: 'test-ws',
            schedule: {
              frequency: 'PT30M',
              timeout: 'PT3M',
            },
          },
        },
      },
    });

    const providers = BitbucketCloudEntityProvider.fromConfig(config, {
      logger,
      scheduler,
    });

    expect(providers).toHaveLength(1);
    expect(providers[0].getProviderName()).toEqual(
      'bitbucketCloud-provider:default',
    );
  });

  it('multiple provider configs', () => {
    const config = new ConfigReader({
      catalog: {
        providers: {
          bitbucketCloud: {
            myProvider: {
              workspace: 'test-ws1',
            },
            anotherProvider: {
              workspace: 'test-ws2',
            },
          },
        },
      },
    });
    const providers = BitbucketCloudEntityProvider.fromConfig(config, {
      logger,
      schedule,
    });

    expect(providers).toHaveLength(2);
    expect(providers[0].getProviderName()).toEqual(
      'bitbucketCloud-provider:myProvider',
    );
    expect(providers[1].getProviderName()).toEqual(
      'bitbucketCloud-provider:anotherProvider',
    );
  });

  it('apply full update on scheduled execution', async () => {
    const provider = BitbucketCloudEntityProvider.fromConfig(defaultConfig, {
      logger,
      schedule,
    })[0];
    expect(provider.getProviderName()).toEqual(
      'bitbucketCloud-provider:myProvider',
    );

    server.use(
      rest.get(
        `https://api.bitbucket.org/2.0/workspaces/test-ws/search/code`,
        (_req, res, ctx) => {
          const response = {
            values: [
              {
                // skipped as empty
                path_matches: [],
                file: {
                  type: 'commit_file',
                  path: 'path/to/ignored/file',
                },
              },
              {
                path_matches: [
                  {
                    match: true,
                    text: 'catalog-custom.yaml',
                  },
                ],
                file: {
                  type: 'commit_file',
                  path: 'custom/path/catalog-custom.yaml',
                  commit: {
                    repository: {
                      // skipped as no match with filter
                      slug: 'repo',
                      project: {
                        key: 'test-project',
                      },
                      mainbranch: {
                        name: 'main',
                      },
                      links: {
                        html: {
                          href: 'https://bitbucket.org/test-ws/repo',
                        },
                      },
                    },
                  },
                },
              },
              {
                path_matches: [
                  {
                    match: true,
                    text: 'catalog-custom.yaml',
                  },
                ],
                file: {
                  type: 'commit_file',
                  path: 'custom/path/catalog-custom.yaml',
                  commit: {
                    repository: {
                      slug: 'test-repo1',
                      project: {
                        // skipped as no match with filter
                        key: 'project',
                      },
                      mainbranch: {
                        name: 'main',
                      },
                      links: {
                        html: {
                          href: 'https://bitbucket.org/test-ws/test-repo1',
                        },
                      },
                    },
                  },
                },
              },
              {
                path_matches: [
                  {
                    match: true,
                    text: 'catalog-custom.yaml',
                  },
                ],
                file: {
                  type: 'commit_file',
                  path: 'custom/path/catalog-custom.yaml',
                  commit: {
                    repository: {
                      slug: 'test-repo2',
                      project: {
                        key: 'test-project',
                      },
                      mainbranch: {
                        name: 'main',
                      },
                      links: {
                        html: {
                          href: 'https://bitbucket.org/test-ws/test-repo2',
                        },
                      },
                    },
                  },
                },
              },
            ],
          };
          return res(ctx.json(response));
        },
      ),
    );

    await provider.connect(entityProviderConnection);

    const taskDef = schedule.getTasks()[0];
    expect(taskDef.id).toEqual('bitbucketCloud-provider:myProvider:refresh');
    await (taskDef.fn as () => Promise<void>)();

    const url = `https://bitbucket.org/test-ws/test-repo2/src/main/custom/path/catalog-custom.yaml`;
    const expectedEntities = [
      {
        entity: {
          apiVersion: 'backstage.io/v1alpha1',
          kind: 'Location',
          metadata: {
            annotations: {
              'backstage.io/managed-by-location': `url:${url}`,
              'backstage.io/managed-by-origin-location': `url:${url}`,
              'bitbucket.org/repo-url':
                'https://bitbucket.org/test-ws/test-repo2',
            },
            name: 'generated-7c2e6263b6cc2d14e69fd4d029afba601ad6dc3b',
          },
          spec: {
            presence: 'required',
            target: `${url}`,
            type: 'url',
          },
        },
        locationKey: 'bitbucketCloud-provider:myProvider',
      },
    ];

    expect(entityProviderConnection.applyMutation).toHaveBeenCalledTimes(1);
    expect(entityProviderConnection.applyMutation).toHaveBeenCalledWith({
      type: 'full',
      entities: expectedEntities,
    });
  });

  it('update onRepoPush', async () => {
    const keptModule = createLocationEntity(
      'https://bitbucket.org/test-ws/test-repo',
      'main',
      'kept-module/catalog-custom.yaml',
    );
    const removedModule = createLocationEntity(
      'https://bitbucket.org/test-ws/test-repo',
      'main',
      'removed-module/catalog-custom.yaml',
    );
    const addedModule = createLocationEntity(
      'https://bitbucket.org/test-ws/test-repo',
      'main',
      'added-module/catalog-custom.yaml',
    );

    const catalogApi = {
      getEntities: async (
        request: { filter: Record<string, string> },
        options: { token: string },
      ): Promise<{ items: Entity[] }> => {
        if (
          options.token !== 'fake-token' ||
          request.filter.kind !== 'Location' ||
          request.filter['metadata.annotations.bitbucket.org/repo-url'] !==
            'https://bitbucket.org/test-ws/test-repo'
        ) {
          return { items: [] };
        }

        return {
          items: [keptModule, removedModule],
        };
      },
    };
    const provider = BitbucketCloudEntityProvider.fromConfig(defaultConfig, {
      catalogApi: catalogApi as any as CatalogApi,
      logger,
      schedule,
      tokenManager,
    })[0];

    server.use(
      rest.get(
        `https://api.bitbucket.org/2.0/workspaces/test-ws/search/code`,
        (req, res, ctx) => {
          const query = req.url.searchParams.get('search_query');
          if (!query || !query.includes('repo:test-repo')) {
            return res(ctx.json({ values: [] }));
          }

          const response = {
            values: [
              {
                path_matches: [
                  {
                    match: true,
                    text: 'catalog-custom.yaml',
                  },
                ],
                file: {
                  type: 'commit_file',
                  path: 'kept-module/catalog-custom.yaml',
                  commit: {
                    repository: {
                      slug: 'test-repo',
                      project: {
                        key: 'test-project',
                      },
                      mainbranch: {
                        name: 'main',
                      },
                      links: {
                        html: {
                          href: 'https://bitbucket.org/test-ws/test-repo',
                        },
                      },
                    },
                  },
                },
              },
              {
                path_matches: [
                  {
                    match: true,
                    text: 'catalog-custom.yaml',
                  },
                ],
                file: {
                  type: 'commit_file',
                  path: 'added-module/catalog-custom.yaml',
                  commit: {
                    repository: {
                      slug: 'test-repo',
                      project: {
                        key: 'test-project',
                      },
                      mainbranch: {
                        name: 'main',
                      },
                      links: {
                        html: {
                          href: 'https://bitbucket.org/test-ws/test-repo',
                        },
                      },
                    },
                  },
                },
              },
            ],
          };
          return res(ctx.json(response));
        },
      ),
    );

    await provider.connect(entityProviderConnection);
    await provider.onEvent(repoPushEventParams);

    const addedEntities = [
      {
        entity: addedModule,
        locationKey: 'bitbucketCloud-provider:myProvider',
      },
    ];
    const removedEntities = [
      {
        entity: removedModule,
        locationKey: 'bitbucketCloud-provider:myProvider',
      },
    ];

    expect(entityProviderConnection.refresh).toHaveBeenCalledTimes(1);
    expect(entityProviderConnection.refresh).toHaveBeenCalledWith({
      keys: [
        'url:https://bitbucket.org/test-ws/test-repo/src/main/kept-module/catalog-custom.yaml',
      ],
    });
    expect(entityProviderConnection.applyMutation).toHaveBeenCalledTimes(1);
    expect(entityProviderConnection.applyMutation).toHaveBeenCalledWith({
      type: 'delta',
      added: addedEntities,
      removed: removedEntities,
    });
  });

  it('onRepoPush fail on incomplete setup', async () => {
    const provider = BitbucketCloudEntityProvider.fromConfig(defaultConfig, {
      logger,
      schedule,
    })[0];

    await expect(provider.onEvent(repoPushEventParams)).rejects.toThrow(
      'bitbucketCloud-provider:myProvider not well configured to handle repo:push. Missing CatalogApi and/or TokenManager.',
    );
  });

  it('no onRepoPush update on non-matching workspace slug', async () => {
    const catalogApi = {
      getEntities: jest.fn(),
      refreshEntity: jest.fn(),
    };
    const provider = BitbucketCloudEntityProvider.fromConfig(defaultConfig, {
      catalogApi: catalogApi as any as CatalogApi,
      logger,
      schedule,
      tokenManager,
    })[0];

    await provider.connect(entityProviderConnection);
    await provider.onEvent({
      ...repoPushEventParams,
      eventPayload: {
        ...repoPushEventParams.eventPayload,
        repository: {
          ...repoPushEventParams.eventPayload.repository,
          workspace: {
            ...repoPushEventParams.eventPayload.repository.workspace,
            slug: 'not-matching',
          },
        },
      },
    });

    expect(catalogApi.refreshEntity).toHaveBeenCalledTimes(0);
    expect(entityProviderConnection.applyMutation).toHaveBeenCalledTimes(0);
  });

  it('no onRepoPush update on non-matching repo slug', async () => {
    const catalogApi = {
      getEntities: jest.fn(),
      refreshEntity: jest.fn(),
    };
    const provider = BitbucketCloudEntityProvider.fromConfig(defaultConfig, {
      catalogApi: catalogApi as any as CatalogApi,
      logger,
      schedule,
      tokenManager,
    })[0];

    await provider.connect(entityProviderConnection);
    await provider.onEvent({
      ...repoPushEventParams,
      eventPayload: {
        ...repoPushEventParams.eventPayload,
        repository: {
          ...repoPushEventParams.eventPayload.repository,
          slug: 'not-matching',
        },
      },
    });

    expect(catalogApi.refreshEntity).toHaveBeenCalledTimes(0);
    expect(entityProviderConnection.applyMutation).toHaveBeenCalledTimes(0);
  });
});
