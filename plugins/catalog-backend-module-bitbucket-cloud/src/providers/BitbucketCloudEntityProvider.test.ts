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
  BackstageCredentials,
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
import { http, HttpResponse } from 'msw';
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
  const repoUpdatedEvent: Events.RepoUpdatedEvent = {
    actor: {
      type: 'user',
    },
    repository: {
      type: 'repository',
      full_name: 'test-ws/test-repo-new',
      links: {
        html: {
          href: 'https://bitbucket.org/test-ws/test-repo-new',
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
    changes: {
      name: {
        new: 'test-repo-new',
        old: 'test-repo-old',
      },
      links: {
        new: {
          html: {
            href: 'https://bitbucket.org/test-ws/test-repo-new',
          },
        },
        old: {
          html: {
            href: 'https://bitbucket.org/test-ws/test-repo-old',
          },
        },
      },
      full_name: {
        new: 'test-ws/test-repo-new',
        old: 'test-ws/test-repo-old',
      },
    },
  };
  const repoUpdatedEventParams = {
    topic: 'bitbucketCloud.repo:updated',
    eventPayload: repoUpdatedEvent,
    metadata: { 'x-event-key': 'repo:updated' },
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

  const repository = (
    slug: string,
    projectKey: string,
    mainbranch?: string,
  ) => ({
    slug,
    project: { key: projectKey },
    ...(mainbranch ? { mainbranch: { name: mainbranch } } : {}),
    links: { html: { href: `https://bitbucket.org/test-ws/${slug}` } },
  });

  // Shape of a recorded code search answer, with made-up names.
  // Fields that the provider does not use are left out.
  const matchedFile = (slug: string, path: string) => ({
    repositoryId: `${slug}-id`,
    path,
    name: path.substring(path.lastIndexOf('/') + 1),
    language: 'YAML',
    version: '0123456789abcdef0123456789abcdef01234567',
    url: `https://bitbucket.org/test-ws/${slug}/src/0123456789abcdef0123456789abcdef01234567/${path}`,
    branch_or_tag_name: 'main',
    is_default_branch: true,
  });

  const mockBitbucket = (options: {
    repositories: (q: string | null) => object[];
    search: (body: any) => object[];
  }) => {
    const repositoryQueries: (string | null)[] = [];
    const searchBodies: any[] = [];
    server.use(
      http.get(
        'https://api.bitbucket.org/2.0/repositories/test-ws',
        ({ request }) => {
          const q = new URL(request.url).searchParams.get('q');
          repositoryQueries.push(q);
          return HttpResponse.json({ values: options.repositories(q) });
        },
      ),
      http.post(
        'https://api.bitbucket.org/2.0/workspaces/test-ws/codesearch',
        async ({ request }) => {
          const body = await request.json();
          searchBodies.push(body);
          return HttpResponse.json({
            id: 'request-id',
            repositories: [],
            matched_files: options.search(body),
            pagination: { has_more: false },
          });
        },
      ),
    );
    return { repositoryQueries, searchBodies };
  };

  afterEach(() => {
    jest.clearAllMocks();
    schedule.reset();
  });

  it('no provider config', () => {
    const auth = mockServices.auth();
    const catalog = catalogServiceMock();
    const config = new ConfigReader({});
    const events = DefaultEventsService.create({ logger });
    const providers = BitbucketCloudEntityProvider.fromConfig(config, {
      auth,
      catalog,
      events,
      logger,
      schedule,
    });

    expect(providers).toHaveLength(0);
  });

  it('single simple provider config', () => {
    const auth = mockServices.auth();
    const catalog = catalogServiceMock();
    const events = DefaultEventsService.create({ logger });
    const providers = BitbucketCloudEntityProvider.fromConfig(simpleConfig, {
      auth,
      catalog,
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
    const auth = mockServices.auth();
    const catalog = catalogServiceMock();
    const events = DefaultEventsService.create({ logger });

    expect(() =>
      BitbucketCloudEntityProvider.fromConfig(simpleConfig, {
        auth,
        catalog,
        events,
        logger,
      }),
    ).toThrow('Either schedule or scheduler must be provided.');
  });

  it('fail with scheduler but no schedule config', () => {
    const auth = mockServices.auth();
    const catalog = catalogServiceMock();
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
        catalog,
        events,
        logger,
        scheduler,
      }),
    ).toThrow(
      'No schedule provided neither via code nor config for bitbucketCloud-provider:default.',
    );
  });

  it('single simple provider config with schedule in config', () => {
    const auth = mockServices.auth();
    const catalog = catalogServiceMock();
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
      catalog,
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
    const auth = mockServices.auth();
    const catalog = catalogServiceMock();
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
      catalog,
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
    const auth = mockServices.auth();
    const catalog = catalogServiceMock();
    const events = DefaultEventsService.create({ logger });
    const provider = BitbucketCloudEntityProvider.fromConfig(defaultConfig, {
      auth,
      catalog,
      events,
      logger,
      schedule,
    })[0];
    expect(provider.getProviderName()).toEqual(
      'bitbucketCloud-provider:myProvider',
    );

    const { repositoryQueries, searchBodies } = mockBitbucket({
      repositories: () => [
        // skipped as no match with the repo slug filter
        repository('repo', 'test-project', 'main'),
        // skipped as no match with the project key filter
        repository('test-repo1', 'project', 'main'),
        repository('test-repo2', 'test-project', 'main'),
        // without main branch
        repository('test-repo3', 'test-project2'),
      ],
      search: body => {
        const projectKey = body.query.filters.and[1].eq;
        if (projectKey === 'test-project') {
          return [
            matchedFile('test-repo2', 'custom/path/catalog-custom.yaml'),
            // skipped as the same file is on an earlier page
            matchedFile('test-repo2', 'custom/path/catalog-custom.yaml'),
            // skipped as the path does not match the catalog path
            matchedFile('test-repo2', 'custom/path/catalog-custom.yaml.bak'),
            // skipped as the repository does not match the filters
            matchedFile('repo', 'catalog-custom.yaml'),
          ];
        }
        if (projectKey === 'test-project2') {
          return [matchedFile('test-repo3', 'catalog-custom.yaml')];
        }
        return [];
      },
    });

    await provider.connect(entityProviderConnection);

    const taskDef = schedule.getTasks()[0];
    expect(taskDef.id).toEqual('bitbucketCloud-provider:myProvider:refresh');
    await (taskDef.fn as () => Promise<void>)();

    expect(repositoryQueries).toEqual([null]);
    const pathFilter = {
      attribute: 'path',
      eq: 'catalog-custom.yaml',
    };
    expect(searchBodies).toEqual([
      {
        query: {
          search_term: 'catalog-custom.yaml',
          filters: {
            and: [pathFilter, { attribute: 'project', eq: 'test-project' }],
          },
        },
        config: { max_results: 100 },
      },
      {
        query: {
          search_term: 'catalog-custom.yaml',
          filters: {
            and: [pathFilter, { attribute: 'project', eq: 'test-project2' }],
          },
        },
        config: { max_results: 100 },
      },
    ]);

    expect(entityProviderConnection.applyMutation).toHaveBeenCalledTimes(1);
    expect(entityProviderConnection.applyMutation).toHaveBeenCalledWith({
      type: 'full',
      entities: [
        {
          entity: createLocationEntity(
            'https://bitbucket.org/test-ws/test-repo2',
            'main',
            'custom/path/catalog-custom.yaml',
          ),
          locationKey: 'bitbucketCloud-provider:myProvider',
        },
        {
          entity: createLocationEntity(
            'https://bitbucket.org/test-ws/test-repo3',
            'master',
            'catalog-custom.yaml',
          ),
          locationKey: 'bitbucketCloud-provider:myProvider',
        },
      ],
    });
  });

  it.each([
    {
      catalogPath: undefined,
      pathFilter: { attribute: 'path', eq: 'catalog-info.yaml' },
      expected: ['catalog-info.yaml'],
    },
    {
      catalogPath: 'catalog-info.yaml',
      pathFilter: { attribute: 'path', eq: 'catalog-info.yaml' },
      expected: [
        'catalog-info.yaml',
        'a/catalog-info.yaml',
        'services/x/catalog-info.yaml',
        'services/x/y/catalog-info.yaml',
      ],
    },
    {
      catalogPath: '/services/*/catalog-info.yaml',
      pathFilter: {
        attribute: 'path',
        wildcard: 'services/*/catalog-info.yaml',
      },
      expected: [
        'services/x/catalog-info.yaml',
        'services/x/y/catalog-info.yaml',
      ],
    },
    {
      catalogPath: 'x/*.yaml',
      pathFilter: {
        or: [
          { attribute: 'path', wildcard: 'x/*.yaml' },
          { attribute: 'path', wildcard: '*/x/*.yaml' },
        ],
      },
      expected: [
        'services/x/catalog-info.yaml',
        'services/x/y/catalog-info.yaml',
      ],
    },
  ])(
    'matches files for the catalog path $catalogPath',
    async ({ catalogPath, pathFilter, expected }) => {
      const configuredPath = catalogPath ?? '/catalog-info.yaml';
      const config = new ConfigReader({
        catalog: {
          providers: {
            bitbucketCloud: {
              workspace: 'test-ws',
              catalogPath,
              pagelen: 50,
            },
          },
        },
      });
      const provider = BitbucketCloudEntityProvider.fromConfig(config, {
        auth: mockServices.auth(),
        catalog: catalogServiceMock(),
        events: DefaultEventsService.create({ logger }),
        logger,
        schedule,
      })[0];

      const { searchBodies } = mockBitbucket({
        repositories: () => [repository('repo', 'PROJ', 'main')],
        search: () =>
          [
            'catalog-info.yaml',
            'a/catalog-info.yaml',
            'services/x/catalog-info.yaml',
            'services/x/y/catalog-info.yaml',
          ].map(path => matchedFile('repo', path)),
      });

      await provider.connect(entityProviderConnection);
      await (schedule.getTasks()[0].fn as () => Promise<void>)();

      expect(searchBodies).toEqual([
        {
          query: {
            search_term: configuredPath.substring(
              configuredPath.lastIndexOf('/') + 1,
            ),
            filters: {
              and: [pathFilter, { attribute: 'project', eq: 'PROJ' }],
            },
          },
          config: { max_results: 50 },
        },
      ]);
      expect(entityProviderConnection.applyMutation).toHaveBeenCalledWith({
        type: 'full',
        entities: expected.map(path => ({
          entity: createLocationEntity(
            'https://bitbucket.org/test-ws/repo',
            'main',
            path,
          ),
          locationKey: 'bitbucketCloud-provider:default',
        })),
      });
    },
  );

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

    const auth = mockServices.auth();
    const events = DefaultEventsService.create({ logger });
    const catalog = catalogServiceMock.mock({
      getEntities: async (
        request: { filter: Record<string, string> },
        _options: { credentials: BackstageCredentials },
      ): Promise<{ items: Entity[] }> => {
        if (
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
      catalog,
      events,
      logger,
      schedule,
    })[0];

    const { repositoryQueries, searchBodies } = mockBitbucket({
      repositories: q =>
        q === 'slug="test-repo"'
          ? [repository('test-repo', 'test-project', 'main')]
          : [],
      search: body =>
        body.query.filters.and[1].eq === 'test-repo'
          ? [
              matchedFile('test-repo', 'kept-module/catalog-custom.yaml'),
              matchedFile('test-repo', 'added-module/catalog-custom.yaml'),
            ]
          : [],
    });

    await provider.connect(entityProviderConnection);
    await events.publish(repoPushEventParams);

    expect(repositoryQueries).toEqual(['slug="test-repo"']);
    expect(searchBodies.map(body => body.query.filters.and[1])).toEqual([
      { attribute: 'repository', eq: 'test-repo' },
    ]);

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

  it('no onRepoPush update on non-matching workspace slug', async () => {
    const auth = mockServices.auth();
    const catalog = catalogServiceMock();
    jest.spyOn(catalog, 'refreshEntity');
    const events = DefaultEventsService.create({ logger });
    const provider = BitbucketCloudEntityProvider.fromConfig(defaultConfig, {
      auth,
      catalog,
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

    expect(catalog.refreshEntity).toHaveBeenCalledTimes(0);
    expect(entityProviderConnection.applyMutation).toHaveBeenCalledTimes(0);
  });

  it('no onRepoPush update on non-matching repo slug', async () => {
    const auth = mockServices.auth();
    const catalog = catalogServiceMock();
    jest.spyOn(catalog, 'refreshEntity');
    const events = DefaultEventsService.create({ logger });
    const provider = BitbucketCloudEntityProvider.fromConfig(defaultConfig, {
      auth,
      catalog,
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

    expect(catalog.refreshEntity).toHaveBeenCalledTimes(0);
    expect(entityProviderConnection.applyMutation).toHaveBeenCalledTimes(0);
  });

  it('update onRepoUpdated', async () => {
    const oldModule = createLocationEntity(
      'https://bitbucket.org/test-ws/test-repo-old',
      'main',
      'module/catalog-custom.yaml',
    );
    const newModule = createLocationEntity(
      'https://bitbucket.org/test-ws/test-repo-new',
      'main',
      'module/catalog-custom.yaml',
    );

    const auth = mockServices.auth();
    const events = DefaultEventsService.create({ logger });
    const catalog = catalogServiceMock.mock({
      getEntities: async (
        request: { filter: Record<string, string> },
        _options: { credentials: BackstageCredentials },
      ): Promise<{ items: Entity[] }> => {
        if (
          request.filter.kind !== 'Location' ||
          request.filter['metadata.annotations.bitbucket.org/repo-url'] !==
            'https://bitbucket.org/test-ws/test-repo-old'
        ) {
          return { items: [] };
        }

        return {
          items: [oldModule],
        };
      },
    });
    const provider = BitbucketCloudEntityProvider.fromConfig(defaultConfig, {
      auth,
      catalog,
      events,
      logger,
      schedule,
    })[0];

    const { repositoryQueries, searchBodies } = mockBitbucket({
      repositories: q =>
        q === 'slug="test-repo-new"'
          ? [repository('test-repo-new', 'test-project', 'main')]
          : [],
      search: body =>
        body.query.filters.and[1].eq === 'test-repo-new'
          ? [matchedFile('test-repo-new', 'module/catalog-custom.yaml')]
          : [],
    });

    await provider.connect(entityProviderConnection);
    await events.publish(repoUpdatedEventParams);

    expect(repositoryQueries).toEqual(['slug="test-repo-new"']);
    expect(searchBodies.map(body => body.query.filters.and[1])).toEqual([
      { attribute: 'repository', eq: 'test-repo-new' },
    ]);

    const addedEntities = [
      {
        entity: newModule,
        locationKey: 'bitbucketCloud-provider:myProvider',
      },
    ];
    const removedEntities = [
      {
        entity: oldModule,
        locationKey: 'bitbucketCloud-provider:myProvider',
      },
    ];

    expect(entityProviderConnection.refresh).toHaveBeenCalledTimes(0);
    expect(entityProviderConnection.applyMutation).toHaveBeenCalledTimes(1);
    expect(entityProviderConnection.applyMutation).toHaveBeenCalledWith({
      type: 'delta',
      added: addedEntities,
      removed: removedEntities,
    });
  });

  it('no onRepoUpdated update on non-matching workspace slug', async () => {
    const auth = mockServices.auth();
    const catalog = catalogServiceMock();
    jest.spyOn(catalog, 'refreshEntity');
    const events = DefaultEventsService.create({ logger });
    const provider = BitbucketCloudEntityProvider.fromConfig(defaultConfig, {
      auth,
      catalog,
      events,
      logger,
      schedule,
    })[0];

    await provider.connect(entityProviderConnection);
    await events.publish({
      ...repoUpdatedEventParams,
      eventPayload: {
        ...repoUpdatedEventParams.eventPayload,
        repository: {
          ...repoUpdatedEventParams.eventPayload.repository,
          workspace: {
            ...repoUpdatedEventParams.eventPayload.repository.workspace,
            slug: 'not-matching',
          },
        },
      },
    });

    expect(catalog.refreshEntity).toHaveBeenCalledTimes(0);
    expect(entityProviderConnection.applyMutation).toHaveBeenCalledTimes(0);
  });

  it('no onRepoUpdated update on non-matching repo slug', async () => {
    const auth = mockServices.auth();
    const catalog = catalogServiceMock();
    jest.spyOn(catalog, 'refreshEntity');
    const events = DefaultEventsService.create({ logger });
    const provider = BitbucketCloudEntityProvider.fromConfig(defaultConfig, {
      auth,
      catalog,
      events,
      logger,
      schedule,
    })[0];

    await provider.connect(entityProviderConnection);
    await events.publish({
      ...repoUpdatedEventParams,
      eventPayload: {
        ...repoUpdatedEventParams.eventPayload,
        repository: {
          ...repoUpdatedEventParams.eventPayload.repository,
          full_name: `${repoUpdatedEventParams.eventPayload.repository.workspace.slug}/not-matching`,
        },
      },
    });

    expect(catalog.refreshEntity).toHaveBeenCalledTimes(0);
    expect(entityProviderConnection.applyMutation).toHaveBeenCalledTimes(0);
  });

  it('no onRepoUpdated update on non-relevant repo update', async () => {
    const auth = mockServices.auth();
    const catalog = catalogServiceMock();
    jest.spyOn(catalog, 'refreshEntity');
    const events = DefaultEventsService.create({ logger });
    const provider = BitbucketCloudEntityProvider.fromConfig(defaultConfig, {
      auth,
      catalog,
      events,
      logger,
      schedule,
    })[0];

    await provider.connect(entityProviderConnection);
    await events.publish({
      ...repoUpdatedEventParams,
      eventPayload: {
        ...repoUpdatedEventParams.eventPayload,
        changes: {
          description: {
            new: 'New description',
            old: 'Old description',
          },
        },
      },
    });

    expect(catalog.refreshEntity).toHaveBeenCalledTimes(0);
    expect(entityProviderConnection.applyMutation).toHaveBeenCalledTimes(0);
  });
});
