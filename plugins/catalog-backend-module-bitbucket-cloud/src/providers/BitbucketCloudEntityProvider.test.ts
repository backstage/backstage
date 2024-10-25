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
  SchedulerServiceTaskInvocationDefinition,
  SchedulerServiceTaskRunner,
} from '@backstage/backend-plugin-api';
import {
  mockServices,
  registerMswTestHooks,
} from '@backstage/backend-test-utils';
import { Entity, LocationEntity } from '@backstage/catalog-model';
import { ConfigReader } from '@backstage/config';
import {
  EntityProviderConnection,
  locationSpecToLocationEntity,
} from '@backstage/plugin-catalog-node';
import { Events } from '@backstage/plugin-bitbucket-cloud-common';
import { DefaultEventsService } from '@backstage/plugin-events-node';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import {
  ANNOTATION_BITBUCKET_CLOUD_REPO_URL,
  BitbucketCloudEntityProvider,
} from './BitbucketCloudEntityProvider';
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

  reset() {
    this.tasks = [];
  }
}

const logger = mockServices.logger.mock();

const server = setupServer();
registerMswTestHooks(server);

describe('BitbucketCloudEntityProvider', () => {
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
  const repoPushEvent: Events.RepoPushEvent = {
    actor: {
      type: 'user',
    },
    repository: {
      type: 'repository',
      full_name: 'test-ws/test-repo',
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
    jest.clearAllMocks();
    schedule.reset();
  });

  it('no provider config', () => {
    const auth = mockServices.auth.mock();
    const catalogApi = catalogServiceMock.mock();
    const config = new ConfigReader({});
    const events = DefaultEventsService.create({ logger });
    const providers = BitbucketCloudEntityProvider.fromConfig(config, {
      auth,
      catalogApi,
      events,
      logger,
      schedule,
    });

    expect(providers).toHaveLength(0);
  });

  it('single simple provider config', () => {
    const auth = mockServices.auth.mock();
    const catalogApi = catalogServiceMock.mock();
    const events = DefaultEventsService.create({ logger });
    const providers = BitbucketCloudEntityProvider.fromConfig(simpleConfig, {
      auth,
      catalogApi,
      events,
      logger,
      schedule,
    });

    expect(providers).toHaveLength(1);
    expect(providers[0].getProviderName()).toEqual(
      'bitbucketCloud-provider:default',
    );
  });

  it('fail without schedule and scheduler', () => {
    const auth = mockServices.auth.mock();
    const catalogApi = catalogServiceMock.mock();
    const events = DefaultEventsService.create({ logger });

    expect(() =>
      BitbucketCloudEntityProvider.fromConfig(simpleConfig, {
        auth,
        catalogApi,
        events,
        logger,
      }),
    ).toThrow('Either schedule or scheduler must be provided.');
  });

  it('fail with scheduler but no schedule config', () => {
    const auth = mockServices.auth.mock();
    const catalogApi = catalogServiceMock.mock();
    const events = DefaultEventsService.create({ logger });
    const scheduler = mockServices.scheduler.mock();
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
        auth,
        catalogApi,
        events,
        logger,
        scheduler,
      }),
    ).toThrow(
      'No schedule provided neither via code nor config for bitbucketCloud-provider:default.',
    );
  });

  it('single simple provider config with schedule in config', () => {
    const auth = mockServices.auth.mock();
    const catalogApi = catalogServiceMock.mock();
    const events = DefaultEventsService.create({ logger });
    const scheduler = mockServices.scheduler.mock();
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
      auth,
      catalogApi,
      events,
      logger,
      scheduler,
    });

    expect(providers).toHaveLength(1);
    expect(providers[0].getProviderName()).toEqual(
      'bitbucketCloud-provider:default',
    );
  });

  it('multiple provider configs', () => {
    const auth = mockServices.auth.mock();
    const catalogApi = catalogServiceMock.mock();
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
    const events = DefaultEventsService.create({ logger });
    const providers = BitbucketCloudEntityProvider.fromConfig(config, {
      auth,
      catalogApi,
      events,
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
    const auth = mockServices.auth.mock();
    const catalogApi = catalogServiceMock.mock();
    const events = DefaultEventsService.create({ logger });
    const provider = BitbucketCloudEntityProvider.fromConfig(defaultConfig, {
      auth,
      catalogApi,
      events,
      logger,
      schedule,
    })[0];
    expect(provider.getProviderName()).toEqual(
      'bitbucketCloud-provider:myProvider',
    );

    server.use(
      rest.get(
        `https://api.bitbucket.org/2.0/workspaces/test-ws/projects`,
        (_req, res, ctx) => {
          const response = {
            values: [
              {
                key: 'TEST',
              },
              {
                key: 'TEST2',
              },
            ],
          };
          return res(ctx.json(response));
        },
      ),
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

    const auth = mockServices.auth.mock({
      getPluginRequestToken: async () => ({ token: 'fake-token' }),
    });
    const events = DefaultEventsService.create({ logger });
    const catalogApi = catalogServiceMock.mock({
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
    });
    const provider = BitbucketCloudEntityProvider.fromConfig(defaultConfig, {
      auth,
      catalogApi,
      events,
      logger,
      schedule,
    })[0];

    server.use(
      rest.get(
        `https://api.bitbucket.org/2.0/workspaces/test-ws/projects`,
        (_req, res, ctx) => {
          const response = {
            values: [
              {
                key: 'TEST',
              },
              {
                key: 'TEST2',
              },
            ],
          };
          return res(ctx.json(response));
        },
      ),
      rest.get(
        `https://api.bitbucket.org/2.0/workspaces/test-ws/search/code`,
        (req, res, ctx) => {
          const query = req.url.searchParams.get('search_query');
          if (
            !query ||
            !query.includes('repo:test-repo') ||
            !query.includes('project:TEST')
          ) {
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
    await events.publish(repoPushEventParams);

    const addedEntities = [
      {
        entity: addedModule,
        locationKey: 'bitbucketCloud-provider:myProvider',
      },
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

  it('no onRepoPush update on non-matching workspace slug', async () => {
    const auth = mockServices.auth.mock();
    const catalogApi = catalogServiceMock.mock();
    const events = DefaultEventsService.create({ logger });
    const provider = BitbucketCloudEntityProvider.fromConfig(defaultConfig, {
      auth,
      catalogApi,
      events,
      logger,
      schedule,
    })[0];

    await provider.connect(entityProviderConnection);
    await events.publish({
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
    const auth = mockServices.auth.mock();
    const catalogApi = catalogServiceMock.mock();
    const events = DefaultEventsService.create({ logger });
    const provider = BitbucketCloudEntityProvider.fromConfig(defaultConfig, {
      auth,
      catalogApi,
      events,
      logger,
      schedule,
    })[0];

    await provider.connect(entityProviderConnection);
    await events.publish({
      ...repoPushEventParams,
      eventPayload: {
        ...repoPushEventParams.eventPayload,
        repository: {
          ...repoPushEventParams.eventPayload.repository,
          full_name: `${repoPushEventParams.eventPayload.repository.workspace.slug}/not-matching`,
        },
      },
    });

    expect(catalogApi.refreshEntity).toHaveBeenCalledTimes(0);
    expect(entityProviderConnection.applyMutation).toHaveBeenCalledTimes(0);
  });
});
