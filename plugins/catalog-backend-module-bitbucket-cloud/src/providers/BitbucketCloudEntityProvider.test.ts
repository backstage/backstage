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
import {
  BitbucketCloudApiError,
  BitbucketCloudClient,
  Events,
} from '@backstage/plugin-bitbucket-cloud-common';
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
    commitHash?: string,
  ) => ({
    slug,
    project: { key: projectKey },
    ...(mainbranch
      ? {
          mainbranch: {
            name: mainbranch,
            ...(commitHash ? { target: { hash: commitHash } } : {}),
          },
        }
      : {}),
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
    const repositoryFields: (string | null)[] = [];
    const searchBodies: any[] = [];
    server.use(
      http.get(
        'https://api.bitbucket.org/2.0/repositories/test-ws',
        ({ request }) => {
          const url = new URL(request.url);
          const q = url.searchParams.get('q');
          repositoryQueries.push(q);
          repositoryFields.push(url.searchParams.get('fields'));
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
    return { repositoryQueries, repositoryFields, searchBodies };
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

  it('does not apply a full update when the scheduled task is aborted', async () => {
    const provider = BitbucketCloudEntityProvider.fromConfig(simpleConfig, {
      auth: mockServices.auth(),
      catalog: catalogServiceMock(),
      events: DefaultEventsService.create({ logger }),
      logger,
      schedule,
    })[0];
    const controller = new AbortController();
    const { searchBodies } = mockBitbucket({
      repositories: () => [
        repository('repo1', 'PROJ1', 'main'),
        repository('repo2', 'PROJ2', 'main'),
      ],
      search: () => {
        controller.abort();
        return [];
      },
    });
    await provider.connect(entityProviderConnection);
    const runTask = (signal: AbortSignal) =>
      (schedule.getTasks()[0].fn as (signal: AbortSignal) => Promise<void>)(
        signal,
      );

    await runTask(AbortSignal.abort());
    expect(searchBodies).toHaveLength(0);

    await runTask(controller.signal);
    expect(searchBodies).toHaveLength(1);
    expect(entityProviderConnection.applyMutation).not.toHaveBeenCalled();

    await runTask(new AbortController().signal);
    expect(searchBodies).toHaveLength(3);
    expect(entityProviderConnection.applyMutation).toHaveBeenCalledWith({
      type: 'full',
      entities: [],
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

  const rejectCodeSearch = (status: number, bodies?: unknown[]) => {
    server.use(
      http.post(
        'https://api.bitbucket.org/2.0/workspaces/test-ws/codesearch',
        async ({ request }) => {
          bodies?.push(await request.json());
          return new HttpResponse(null, { status });
        },
      ),
    );
  };

  // Keys are repository source paths. `true` is a file. An array is the
  // names of the entries directly inside that directory. `''` is the root.
  const sourceTree = (files: Record<string, true | string[]>) => {
    const requested: string[] = [];
    server.use(
      http.get(
        ({ request }) => {
          const url = new URL(request.url);
          return (
            url.origin === 'https://api.bitbucket.org' &&
            /\/2\.0\/repositories\/test-ws\/[^/]+\/src\//.test(url.pathname)
          );
        },
        ({ request }) => {
          const url = new URL(request.url);
          requested.push(`${url.pathname}${url.search}`);
          const match = decodeURIComponent(url.pathname).match(
            /^\/2\.0\/repositories\/test-ws\/([^/]+)\/src\/([^/]+)\/(.*)$/,
          );
          if (!match) {
            return new HttpResponse(null, { status: 404 });
          }
          const repo = match[1];
          const path = match[3].replace(/\/$/, '');
          const repoPath = `${repo}:${path}`;
          const described = files[repoPath] ?? files[path];
          if (url.searchParams.get('format') === 'meta') {
            return described === true
              ? HttpResponse.json({ type: 'commit_file', path })
              : new HttpResponse(null, { status: 404 });
          }
          if (!Array.isArray(described)) {
            return new HttpResponse(null, { status: 404 });
          }
          return HttpResponse.json({
            values: described.map(entry => {
              const child = path ? `${path}/${entry}` : entry;
              const kind = files[`${repo}:${child}`] ?? files[child];
              return {
                path: child,
                type: kind === true ? 'commit_file' : 'commit_directory',
              };
            }),
          });
        },
      ),
    );
    return requested;
  };

  it.each([403, 404, 410])(
    'discovers an exact catalog path from the source API when code search answers %s',
    async status => {
      const config = new ConfigReader({
        catalog: {
          providers: {
            bitbucketCloud: {
              workspace: 'test-ws',
              catalogPath: '/catalog-info.yaml',
              filters: {
                projectKey: 'test-.*',
                repoSlug: 'svc-.*',
              },
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
      const searchBodies: unknown[] = [];
      const { repositoryFields } = mockBitbucket({
        repositories: () => [
          repository(
            'svc-a',
            'test-apis',
            'main',
            '1111111111111111111111111111111111111111',
          ),
          // excluded by the project key filter
          repository('svc-b', 'other', 'main'),
          // excluded by the repo slug filter
          repository('readme', 'test-apis', 'main'),
          repository('svc-c', 'test-other'),
          repository(
            'svc-d',
            'test-apis',
            'release/1.0',
            '5b6c39df3196eeeb8a36684beb9a3df854a0b5f3',
          ),
        ],
        search: () => [],
      });
      rejectCodeSearch(status, searchBodies);
      const sourceRequests = sourceTree({
        'svc-a:catalog-info.yaml': true,
        'svc-d:catalog-info.yaml': true,
      });

      await provider.connect(entityProviderConnection);
      await (schedule.getTasks()[0].fn as () => Promise<void>)();

      expect(repositoryFields).toEqual([
        'next,values.slug,values.project.key,values.mainbranch.name,values.mainbranch.target.hash,values.links.html.href',
      ]);
      expect(searchBodies).toEqual([
        {
          query: {
            search_term: 'catalog-info.yaml',
            filters: {
              and: [
                { attribute: 'path', eq: 'catalog-info.yaml' },
                { attribute: 'project', eq: 'test-apis' },
              ],
            },
          },
          config: { max_results: 100 },
        },
      ]);
      expect(sourceRequests).toEqual([
        '/2.0/repositories/test-ws/svc-a/src/1111111111111111111111111111111111111111/catalog-info.yaml?format=meta',
        '/2.0/repositories/test-ws/svc-c/src/master/catalog-info.yaml?format=meta',
        '/2.0/repositories/test-ws/svc-d/src/5b6c39df3196eeeb8a36684beb9a3df854a0b5f3/catalog-info.yaml?format=meta',
      ]);
      expect(entityProviderConnection.applyMutation).toHaveBeenCalledWith({
        type: 'full',
        entities: [
          {
            entity: createLocationEntity(
              'https://bitbucket.org/test-ws/svc-a',
              'main',
              'catalog-info.yaml',
            ),
            locationKey: 'bitbucketCloud-provider:default',
          },
          {
            entity: createLocationEntity(
              'https://bitbucket.org/test-ws/svc-d',
              'release/1.0',
              'catalog-info.yaml',
            ),
            locationKey: 'bitbucketCloud-provider:default',
          },
        ],
      });
    },
  );

  it('walks the source tree for a wildcard catalog path when code search is rejected', async () => {
    const config = new ConfigReader({
      catalog: {
        providers: {
          bitbucketCloud: {
            workspace: 'test-ws',
            catalogPath: '/services/*/catalog-info.yaml',
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
    mockBitbucket({
      repositories: () => [repository('repo', 'PROJ', 'main')],
      search: () => [],
    });
    rejectCodeSearch(403);
    sourceTree({
      '': ['catalog-info.yaml', 'services', 'docs'],
      'catalog-info.yaml': true,
      services: ['catalog-info.yaml', 'x', 'notes.txt'],
      'services/catalog-info.yaml': true,
      'services/x': ['catalog-info.yaml', 'y'],
      'services/x/catalog-info.yaml': true,
      'services/x/y': ['catalog-info.yaml'],
      'services/x/y/catalog-info.yaml': true,
      'services/notes.txt': true,
      docs: ['catalog-info.yaml'],
      'docs/catalog-info.yaml': true,
    });

    await provider.connect(entityProviderConnection);
    await (schedule.getTasks()[0].fn as () => Promise<void>)();

    expect(entityProviderConnection.applyMutation).toHaveBeenCalledWith({
      type: 'full',
      entities: [
        'services/x/catalog-info.yaml',
        'services/x/y/catalog-info.yaml',
      ].map(path => ({
        entity: createLocationEntity(
          'https://bitbucket.org/test-ws/repo',
          'main',
          path,
        ),
        locationKey: 'bitbucketCloud-provider:default',
      })),
    });
  });

  const sourceListing = (directory: string) =>
    `/2.0/repositories/test-ws/repo/src/main/${
      directory ? `${directory}/` : ''
    }?pagelen=100`;

  const locationTargets = (paths: string[]) =>
    paths.map(path => ({
      entity: createLocationEntity(
        'https://bitbucket.org/test-ws/repo',
        'main',
        path,
      ),
      locationKey: 'bitbucketCloud-provider:default',
    }));

  const refreshFromSource = async (
    catalogPath: string,
    files: Record<string, true | string[]>,
  ) => {
    const config = new ConfigReader({
      catalog: {
        providers: {
          bitbucketCloud: {
            workspace: 'test-ws',
            catalogPath,
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
    mockBitbucket({
      repositories: () => [repository('repo', 'PROJ', 'main')],
      search: () => [],
    });
    rejectCodeSearch(403);
    const sourceRequests = sourceTree(files);
    await provider.connect(entityProviderConnection);
    await (schedule.getTasks()[0].fn as () => Promise<void>)();
    return sourceRequests;
  };

  // `''` is the repository root. A wildcard in the first segment has no
  // literal directory prefix, so the walk still starts there.
  const sourceWalkCases: {
    catalogPath: string;
    files: Record<string, true | string[]>;
    requests: string[];
    paths: string[];
  }[] = [
    {
      catalogPath: '/services/*/catalog-info.yaml',
      files: {
        '': ['services', 'docs', 'vendor'],
        services: ['billing', 'catalog-info.yaml'],
        'services/billing': ['catalog-info.yaml', 'extra'],
        'services/billing/catalog-info.yaml': true,
        'services/billing/extra': ['catalog-info.yaml'],
        'services/billing/extra/catalog-info.yaml': true,
        'services/catalog-info.yaml': true,
        docs: ['catalog-info.yaml'],
        'docs/catalog-info.yaml': true,
        vendor: ['lib'],
        'vendor/lib': [],
      },
      requests: ['services', 'services/billing', 'services/billing/extra'],
      paths: [
        'services/billing/catalog-info.yaml',
        'services/billing/extra/catalog-info.yaml',
      ],
    },
    {
      catalogPath: '/services/team-*/catalog-info.yaml',
      files: {
        '': ['services', 'docs', 'vendor'],
        services: ['team-a', 'other'],
        'services/team-a': ['catalog-info.yaml'],
        'services/team-a/catalog-info.yaml': true,
        'services/other': ['catalog-info.yaml'],
        'services/other/catalog-info.yaml': true,
        docs: ['team-a'],
        'docs/team-a': ['catalog-info.yaml'],
        'docs/team-a/catalog-info.yaml': true,
        vendor: ['pkg'],
        'vendor/pkg': [],
      },
      requests: ['services', 'services/other', 'services/team-a'],
      paths: ['services/team-a/catalog-info.yaml'],
    },
    {
      catalogPath: '/services/team-?/catalog-info.yaml',
      files: {
        '': ['services', 'docs'],
        services: ['team-a', 'team-ab'],
        'services/team-a': ['catalog-info.yaml'],
        'services/team-a/catalog-info.yaml': true,
        'services/team-ab': ['catalog-info.yaml'],
        'services/team-ab/catalog-info.yaml': true,
        docs: ['team-a'],
        'docs/team-a': ['catalog-info.yaml'],
        'docs/team-a/catalog-info.yaml': true,
      },
      requests: ['services', 'services/team-ab', 'services/team-a'],
      paths: ['services/team-a/catalog-info.yaml'],
    },
    {
      catalogPath: '/a/b/c/*.yaml',
      files: {
        '': ['a', 'docs', 'vendor'],
        a: ['b'],
        'a/b': ['c'],
        'a/b/c': ['component.yaml', 'notes.txt'],
        'a/b/c/component.yaml': true,
        'a/b/c/notes.txt': true,
        docs: ['component.yaml'],
        'docs/component.yaml': true,
        vendor: ['lib'],
        'vendor/lib': [],
      },
      requests: ['a/b/c'],
      paths: ['a/b/c/component.yaml'],
    },
    {
      catalogPath: 'catalog-info.yaml',
      files: {
        '': ['catalog-info.yaml', 'services'],
        'catalog-info.yaml': true,
        services: ['catalog-info.yaml'],
        'services/catalog-info.yaml': true,
      },
      requests: ['', 'services'],
      paths: ['catalog-info.yaml', 'services/catalog-info.yaml'],
    },
    {
      catalogPath: '*/catalog-info.yaml',
      files: {
        '': ['catalog-info.yaml', 'services'],
        'catalog-info.yaml': true,
        services: ['catalog-info.yaml'],
        'services/catalog-info.yaml': true,
      },
      requests: ['', 'services'],
      paths: ['services/catalog-info.yaml'],
    },
    {
      catalogPath: '/catalog-*.yaml',
      files: {
        '': ['catalog-app.yaml', 'services', 'docs'],
        'catalog-app.yaml': true,
        services: ['catalog-app.yaml'],
        'services/catalog-app.yaml': true,
        docs: ['readme.md'],
        'docs/readme.md': true,
      },
      requests: ['', 'docs', 'services'],
      paths: ['catalog-app.yaml'],
    },
    {
      catalogPath: '/*/catalog-info.yaml',
      files: {
        '': ['catalog-info.yaml', 'services', 'docs'],
        'catalog-info.yaml': true,
        services: ['catalog-info.yaml'],
        'services/catalog-info.yaml': true,
        docs: ['catalog-info.yaml'],
        'docs/catalog-info.yaml': true,
      },
      requests: ['', 'docs', 'services'],
      paths: ['docs/catalog-info.yaml', 'services/catalog-info.yaml'],
    },
    {
      // A wildcard inside the first segment can match a sibling such as
      // `foobar/`, so the walk cannot start at the directory `foo`.
      catalogPath: '/foo*/catalog-info.yaml',
      files: {
        '': ['foo', 'foobar', 'docs'],
        foo: ['catalog-info.yaml'],
        'foo/catalog-info.yaml': true,
        foobar: ['catalog-info.yaml'],
        'foobar/catalog-info.yaml': true,
        docs: ['catalog-info.yaml'],
        'docs/catalog-info.yaml': true,
      },
      requests: ['', 'docs', 'foobar', 'foo'],
      paths: ['foobar/catalog-info.yaml', 'foo/catalog-info.yaml'],
    },
    {
      catalogPath: '/services/*/catalog-info.yaml',
      files: {
        '': ['docs', 'vendor'],
        docs: ['catalog-info.yaml'],
        'docs/catalog-info.yaml': true,
        vendor: ['lib'],
        'vendor/lib': [],
      },
      requests: ['services'],
      paths: [],
    },
    {
      // `services` is a file. The listing uses a trailing slash, so the
      // source API answers 404 and unrelated directories stay unlisted.
      catalogPath: '/services/*/catalog-info.yaml',
      files: {
        '': ['services', 'docs', 'vendor'],
        services: true,
        docs: ['catalog-info.yaml'],
        'docs/catalog-info.yaml': true,
        vendor: ['lib'],
        'vendor/lib': [],
      },
      requests: ['services'],
      paths: [],
    },
    {
      catalogPath: '/services//*/catalog-info.yaml',
      files: {
        '': ['services', 'docs'],
        services: ['billing'],
        'services/billing': ['catalog-info.yaml'],
        'services/billing/catalog-info.yaml': true,
        docs: ['catalog-info.yaml'],
        'docs/catalog-info.yaml': true,
      },
      requests: ['services', 'services/billing'],
      paths: [],
    },
    {
      // A trailing slash is an empty segment and does not extend the prefix.
      catalogPath: '/services/*/',
      files: {
        '': ['services', 'docs'],
        services: ['billing'],
        'services/billing': ['catalog-info.yaml'],
        'services/billing/catalog-info.yaml': true,
        docs: ['catalog-info.yaml'],
        'docs/catalog-info.yaml': true,
      },
      requests: ['services', 'services/billing'],
      paths: [],
    },
  ];

  it.each(sourceWalkCases)(
    'walks $catalogPath from its literal directory prefix when code search is rejected',
    async ({ catalogPath, files, requests, paths }) => {
      const sourceRequests = await refreshFromSource(catalogPath, files);

      expect(sourceRequests).toEqual(requests.map(sourceListing));
      expect(entityProviderConnection.applyMutation).toHaveBeenCalledWith({
        type: 'full',
        entities: locationTargets(paths),
      });
    },
  );

  it('visits a duplicated source directory once and emits each location once', async () => {
    const config = new ConfigReader({
      catalog: {
        providers: {
          bitbucketCloud: {
            workspace: 'test-ws',
            catalogPath: 'catalog-info.yaml',
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
    mockBitbucket({
      repositories: () => [repository('repo', 'PROJ', 'main')],
      search: () => [],
    });
    rejectCodeSearch(403);
    const requested: string[] = [];
    server.use(
      http.get(
        ({ request }) => {
          const url = new URL(request.url);
          return (
            url.origin === 'https://api.bitbucket.org' &&
            /\/2\.0\/repositories\/test-ws\/repo\/src\//.test(url.pathname)
          );
        },
        ({ request }) => {
          const url = new URL(request.url);
          requested.push(`${url.pathname}${url.search}`);
          const path = decodeURIComponent(url.pathname)
            .replace(/^\/2\.0\/repositories\/test-ws\/repo\/src\/[^/]+\//, '')
            .replace(/\/$/, '');
          if (path === '' && url.searchParams.get('page') === '2') {
            return HttpResponse.json({
              values: [
                { path: 'services', type: 'commit_directory' },
                { path: 'docs/catalog-info.yaml', type: 'commit_file' },
                { path: 'other/catalog-info.yaml', type: 'commit_file' },
              ],
            });
          }
          if (path === '') {
            return HttpResponse.json({
              values: [
                { path: 'services', type: 'commit_directory' },
                { path: 'docs/catalog-info.yaml', type: 'commit_file' },
              ],
              next: 'https://api.bitbucket.org/2.0/repositories/test-ws/repo/src/main/?page=2',
            });
          }
          if (path === 'services') {
            return HttpResponse.json({
              values: [
                {
                  path: 'services/catalog-info.yaml',
                  type: 'commit_file',
                },
              ],
            });
          }
          return new HttpResponse(null, { status: 404 });
        },
      ),
    );

    await provider.connect(entityProviderConnection);
    await (schedule.getTasks()[0].fn as () => Promise<void>)();

    expect(requested).toEqual([
      '/2.0/repositories/test-ws/repo/src/main/?pagelen=100',
      '/2.0/repositories/test-ws/repo/src/main/?page=2',
      '/2.0/repositories/test-ws/repo/src/main/services/?pagelen=100',
    ]);
    expect(entityProviderConnection.applyMutation).toHaveBeenCalledWith({
      type: 'full',
      entities: locationTargets([
        'docs/catalog-info.yaml',
        'other/catalog-info.yaml',
        'services/catalog-info.yaml',
      ]),
    });
  });

  it('does not replace the catalog when code search fails for another reason', async () => {
    const provider = BitbucketCloudEntityProvider.fromConfig(simpleConfig, {
      auth: mockServices.auth(),
      catalog: catalogServiceMock(),
      events: DefaultEventsService.create({ logger }),
      logger,
      schedule,
    })[0];
    mockBitbucket({
      repositories: () => [repository('svc-a', 'test-apis', 'main')],
      search: () => [],
    });
    rejectCodeSearch(502);

    await provider.connect(entityProviderConnection);
    await (schedule.getTasks()[0].fn as () => Promise<void>)();

    expect(entityProviderConnection.applyMutation).not.toHaveBeenCalled();
  });

  it('refreshes a repository from the source API on repo:push when code search is rejected', async () => {
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
    const events = DefaultEventsService.create({ logger });
    const catalog = catalogServiceMock.mock({
      getEntities: async (request: {
        filter: Record<string, string>;
      }): Promise<{ items: Entity[] }> => {
        if (
          request.filter['metadata.annotations.bitbucket.org/repo-url'] !==
          'https://bitbucket.org/test-ws/test-repo'
        ) {
          return { items: [] };
        }
        return { items: [keptModule, removedModule] };
      },
    });
    const provider = BitbucketCloudEntityProvider.fromConfig(defaultConfig, {
      auth: mockServices.auth(),
      catalog,
      events,
      logger,
      schedule,
    })[0];
    const searchBodies: unknown[] = [];
    const { repositoryQueries } = mockBitbucket({
      repositories: q =>
        q === 'slug="test-repo"'
          ? [repository('test-repo', 'test-project', 'main')]
          : [],
      search: () => [],
    });
    rejectCodeSearch(403, searchBodies);
    sourceTree({
      '': ['kept-module', 'removed-module', 'added-module'],
      'kept-module': ['catalog-custom.yaml'],
      'kept-module/catalog-custom.yaml': true,
      'removed-module': ['other.yaml'],
      'removed-module/other.yaml': true,
      'added-module': ['catalog-custom.yaml'],
      'added-module/catalog-custom.yaml': true,
    });

    await provider.connect(entityProviderConnection);
    await events.publish(repoPushEventParams);

    expect(repositoryQueries).toEqual(['slug="test-repo"']);
    expect(searchBodies).toEqual([
      {
        query: {
          search_term: 'catalog-custom.yaml',
          filters: {
            and: [
              { attribute: 'path', eq: 'catalog-custom.yaml' },
              { attribute: 'repository', eq: 'test-repo' },
            ],
          },
        },
        config: { max_results: 100 },
      },
    ]);
    expect(entityProviderConnection.refresh).toHaveBeenCalledWith({
      keys: [
        'url:https://bitbucket.org/test-ws/test-repo/src/main/kept-module/catalog-custom.yaml',
      ],
    });
    expect(entityProviderConnection.applyMutation).toHaveBeenCalledWith({
      type: 'delta',
      added: [
        {
          entity: addedModule,
          locationKey: 'bitbucketCloud-provider:myProvider',
        },
      ],
      removed: [
        {
          entity: removedModule,
          locationKey: 'bitbucketCloud-provider:myProvider',
        },
      ],
    });
  });

  it.each([403, 404, 410])(
    'falls back when code search rejects with a duck-typed BitbucketCloudApiError status %s',
    async status => {
      const provider = BitbucketCloudEntityProvider.fromConfig(simpleConfig, {
        auth: mockServices.auth(),
        catalog: catalogServiceMock(),
        events: DefaultEventsService.create({ logger }),
        logger,
        schedule,
      })[0];
      mockBitbucket({
        repositories: () => [repository('svc-a', 'test-apis', 'main')],
        search: () => [],
      });
      sourceTree({ 'svc-a:catalog-info.yaml': true });
      // Another copy of the package fails `instanceof` but keeps the name and status.
      const error = Object.assign(new Error('Workspace code search failed'), {
        name: 'BitbucketCloudApiError',
        status,
      });
      expect(error).not.toBeInstanceOf(BitbucketCloudApiError);
      expect(error).toMatchObject({
        name: 'BitbucketCloudApiError',
        status,
      });
      const search = jest
        .spyOn(BitbucketCloudClient.prototype, 'searchWorkspaceCode')
        .mockImplementation(async function* searchWorkspaceCode() {
          throw error;
        });

      try {
        await provider.connect(entityProviderConnection);
        await provider.refresh(logger);

        expect(search).toHaveBeenCalledTimes(1);
        expect(entityProviderConnection.applyMutation).toHaveBeenCalledWith({
          type: 'full',
          entities: [
            {
              entity: createLocationEntity(
                'https://bitbucket.org/test-ws/svc-a',
                'main',
                'catalog-info.yaml',
              ),
              locationKey: 'bitbucketCloud-provider:default',
            },
          ],
        });
      } finally {
        search.mockRestore();
      }
    },
  );

  it('remembers a rejected code search, warns once, and retries after the cooldown', async () => {
    const rootLogger = mockServices.logger.mock();
    const providerLogger = mockServices.logger.mock();
    rootLogger.child.mockReturnValue(providerLogger);
    const events = DefaultEventsService.create({ logger: rootLogger });
    const provider = BitbucketCloudEntityProvider.fromConfig(simpleConfig, {
      auth: mockServices.auth(),
      catalog: catalogServiceMock(),
      events,
      logger: rootLogger,
      schedule,
    })[0];
    mockBitbucket({
      repositories: () => [repository('svc-a', 'test-apis', 'main')],
      search: () => [],
    });
    sourceTree({ 'svc-a:catalog-info.yaml': true });

    let codeSearchAvailable = false;
    let searchCalls = 0;
    server.use(
      http.post(
        'https://api.bitbucket.org/2.0/workspaces/test-ws/codesearch',
        () => {
          searchCalls += 1;
          if (!codeSearchAvailable) {
            return new HttpResponse(null, { status: 403 });
          }
          return HttpResponse.json({
            id: 'request-id',
            repositories: [],
            matched_files: [matchedFile('svc-a', 'catalog-info.yaml')],
            pagination: { has_more: false },
          });
        },
      ),
    );

    const unavailable =
      'Workspace code search answered 403; falling back to the source API. Use an API token with the read:workspace:bitbucket scope for faster discovery.';
    let now = 1_700_000_000_000;
    const nowSpy = jest.spyOn(Date, 'now').mockImplementation(() => now);
    const hour = 60 * 60 * 1000;

    try {
      await provider.connect(entityProviderConnection);
      await provider.refresh(providerLogger);
      await provider.refresh(providerLogger);
      await events.publish(repoPushEventParams);
      await events.publish(repoUpdatedEventParams);

      expect(searchCalls).toBe(1);
      expect(providerLogger.warn).toHaveBeenCalledTimes(1);
      expect(providerLogger.warn).toHaveBeenCalledWith(unavailable);
      expect(providerLogger.debug).not.toHaveBeenCalled();

      now += hour - 1;
      await provider.refresh(providerLogger);
      expect(searchCalls).toBe(1);

      now += 1;
      await provider.refresh(providerLogger);
      expect(searchCalls).toBe(2);
      expect(providerLogger.warn).toHaveBeenCalledTimes(1);
      expect(providerLogger.debug).toHaveBeenCalledTimes(1);
      expect(providerLogger.debug).toHaveBeenCalledWith(unavailable);

      codeSearchAvailable = true;
      now += hour;
      await provider.refresh(providerLogger);
      expect(searchCalls).toBe(3);
      expect(providerLogger.warn).toHaveBeenCalledTimes(1);

      now += 1;
      await provider.refresh(providerLogger);
      expect(searchCalls).toBe(4);

      codeSearchAvailable = false;
      await provider.refresh(providerLogger);
      expect(searchCalls).toBe(5);
      expect(providerLogger.warn).toHaveBeenCalledTimes(2);
      expect(providerLogger.debug).toHaveBeenCalledTimes(1);
    } finally {
      nowSpy.mockRestore();
    }
  });

  it.each<[number, string]>([
    [
      403,
      'Workspace code search answered 403; falling back to the source API. Use an API token with the read:workspace:bitbucket scope for faster discovery.',
    ],
    [
      404,
      'Workspace code search answered 404; falling back to the source API.',
    ],
    [
      410,
      'Workspace code search answered 410; falling back to the source API.',
    ],
  ])(
    'names the workspace scope in the fallback warning only for status %s',
    async (status, message) => {
      const rootLogger = mockServices.logger.mock();
      const providerLogger = mockServices.logger.mock();
      rootLogger.child.mockReturnValue(providerLogger);
      const provider = BitbucketCloudEntityProvider.fromConfig(simpleConfig, {
        auth: mockServices.auth(),
        catalog: catalogServiceMock(),
        events: DefaultEventsService.create({ logger: rootLogger }),
        logger: rootLogger,
        schedule,
      })[0];
      mockBitbucket({
        repositories: () => [repository('svc-a', 'test-apis', 'main')],
        search: () => [],
      });
      rejectCodeSearch(status);
      sourceTree({ 'svc-a:catalog-info.yaml': true });

      await provider.connect(entityProviderConnection);
      await provider.refresh(providerLogger);

      expect(providerLogger.warn).toHaveBeenCalledTimes(1);
      expect(providerLogger.warn).toHaveBeenCalledWith(message);
      expect(
        String(providerLogger.warn.mock.calls[0][0]).includes(
          'read:workspace:bitbucket',
        ),
      ).toBe(status === 403);
    },
  );

  it('reads five repositories from the source API at a time and keeps their order', async () => {
    const slugs = Array.from({ length: 8 }, (_, index) => `repo-${index}`);
    const provider = BitbucketCloudEntityProvider.fromConfig(simpleConfig, {
      auth: mockServices.auth(),
      catalog: catalogServiceMock(),
      events: DefaultEventsService.create({ logger }),
      logger,
      schedule,
    })[0];
    mockBitbucket({
      repositories: () => slugs.map(slug => repository(slug, 'PROJ', 'main')),
      search: () => [],
    });
    rejectCodeSearch(403);

    let inFlight = 0;
    let maxInFlight = 0;
    const started: string[] = [];
    let openGate = () => {};
    const gate = new Promise<void>(resolve => {
      openGate = resolve;
    });
    server.use(
      http.get(
        ({ request }) => new URL(request.url).pathname.includes('/src/'),
        async ({ request }) => {
          const slug = new URL(request.url).pathname.split('/')[4];
          started.push(slug);
          inFlight += 1;
          maxInFlight = Math.max(maxInFlight, inFlight);
          await gate;
          const index = Number(slug.slice('repo-'.length));
          await new Promise(resolve => setTimeout(resolve, (8 - index) * 5));
          inFlight -= 1;
          return HttpResponse.json({
            type: 'commit_file',
            path: 'catalog-info.yaml',
          });
        },
      ),
    );

    const refreshPromise = (async () => {
      await provider.connect(entityProviderConnection);
      await provider.refresh(logger);
    })();
    let startedAtCap: string[] = [];
    let inFlightAtCap = 0;
    try {
      const deadline = Date.now() + 1000;
      while (started.length < 5 && Date.now() < deadline) {
        await new Promise(resolve => setTimeout(resolve, 10));
      }
      startedAtCap = [...started];
      inFlightAtCap = maxInFlight;
    } finally {
      openGate();
    }
    await refreshPromise;

    expect(inFlightAtCap).toBe(5);
    expect(maxInFlight).toBeLessThanOrEqual(5);
    expect(startedAtCap).toEqual(slugs.slice(0, 5));
    expect(entityProviderConnection.applyMutation).toHaveBeenCalledWith({
      type: 'full',
      entities: slugs.map(slug => ({
        entity: createLocationEntity(
          `https://bitbucket.org/test-ws/${slug}`,
          'main',
          'catalog-info.yaml',
        ),
        locationKey: 'bitbucketCloud-provider:default',
      })),
    });
  });

  it('does not claim repositories past the in-flight window after a source read fails', async () => {
    const slugs = Array.from({ length: 10 }, (_, index) => `repo-${index + 1}`);
    const provider = BitbucketCloudEntityProvider.fromConfig(simpleConfig, {
      auth: mockServices.auth(),
      catalog: catalogServiceMock(),
      events: DefaultEventsService.create({ logger }),
      logger,
      schedule,
    })[0];
    mockBitbucket({
      repositories: () => slugs.map(slug => repository(slug, 'PROJ', 'main')),
      search: () => [],
    });
    rejectCodeSearch(403);

    const requested: string[] = [];
    const initialWindow = new Set(slugs.slice(0, 5));
    let finished = 0;
    let releaseInFlight = () => {};
    const hold = new Promise<void>(resolve => {
      releaseInFlight = resolve;
    });
    server.use(
      http.get(
        ({ request }) => new URL(request.url).pathname.includes('/src/'),
        async ({ request }) => {
          const slug = new URL(request.url).pathname.split('/')[4];
          requested.push(slug);
          // Repository #2 fails while the other four reads in the window are
          // still open, so a worker that keeps pulling would request repo-6.
          if (slug === 'repo-2') {
            return new HttpResponse(null, { status: 429 });
          }
          if (!initialWindow.has(slug)) {
            return HttpResponse.json({
              type: 'commit_file',
              path: 'catalog-info.yaml',
            });
          }
          await hold;
          finished += 1;
          return HttpResponse.json({
            type: 'commit_file',
            path: 'catalog-info.yaml',
          });
        },
      ),
    );

    const outcome = provider
      .connect(entityProviderConnection)
      .then(() => provider.refresh(logger))
      .then(
        () => ({ failed: false as const }),
        (error: unknown) => ({ failed: true as const, error }),
      );

    try {
      const started = Date.now() + 1000;
      while (requested.length < 5 && Date.now() < started) {
        await new Promise(resolve => setTimeout(resolve, 10));
      }
    } finally {
      releaseInFlight();
    }

    const drained = Date.now() + 1000;
    while (finished < 4 && Date.now() < drained) {
      await new Promise(resolve => setTimeout(resolve, 10));
    }
    await new Promise(resolve => setTimeout(resolve, 50));

    expect(requested).toEqual(slugs.slice(0, 5));
    await expect(outcome).resolves.toMatchObject({
      failed: true,
      error: { name: 'BitbucketCloudApiError', status: 429 },
    });
    expect(entityProviderConnection.applyMutation).not.toHaveBeenCalled();
  });

  it('resolves a slash branch to its commit hash before reading the source API', async () => {
    const hash = 'abcdefabcdefabcdefabcdefabcdefabcdefabcd';
    const provider = BitbucketCloudEntityProvider.fromConfig(simpleConfig, {
      auth: mockServices.auth(),
      catalog: catalogServiceMock(),
      events: DefaultEventsService.create({ logger }),
      logger,
      schedule,
    })[0];
    mockBitbucket({
      repositories: () => [repository('svc-a', 'PROJ', 'release/x')],
      search: () => [],
    });
    rejectCodeSearch(403);
    const urls: string[] = [];
    server.use(
      http.get(
        ({ request }) =>
          new URL(request.url).pathname.includes('/refs/branches'),
        ({ request }) => {
          urls.push(request.url);
          return HttpResponse.json({
            values: [
              {
                type: 'branch',
                name: 'release',
                target: { hash: '0000000000000000000000000000000000000000' },
              },
              {
                type: 'branch',
                name: 'release/x',
                target: { hash },
              },
            ],
          });
        },
      ),
      http.get(
        ({ request }) => new URL(request.url).pathname.includes('/src/'),
        ({ request }) => {
          urls.push(request.url);
          return HttpResponse.json({
            type: 'commit_file',
            path: 'catalog-info.yaml',
          });
        },
      ),
    );

    await provider.connect(entityProviderConnection);
    await provider.refresh(logger);

    expect(urls).toHaveLength(2);
    const branchUrl = new URL(urls[0]);
    expect(branchUrl.pathname).toBe(
      '/2.0/repositories/test-ws/svc-a/refs/branches',
    );
    expect(branchUrl.searchParams.get('q')).toBe('name="release/x"');
    expect(branchUrl.searchParams.get('fields')).toBe(
      'next,values.name,values.target.hash',
    );
    expect(urls[1]).toBe(
      `https://api.bitbucket.org/2.0/repositories/test-ws/svc-a/src/${hash}/catalog-info.yaml?format=meta`,
    );
    expect(entityProviderConnection.applyMutation).toHaveBeenCalledWith({
      type: 'full',
      entities: [
        {
          entity: createLocationEntity(
            'https://bitbucket.org/test-ws/svc-a',
            'release/x',
            'catalog-info.yaml',
          ),
          locationKey: 'bitbucketCloud-provider:default',
        },
      ],
    });
  });

  it('skips a slash branch when the branch lookup has no commit hash', async () => {
    const provider = BitbucketCloudEntityProvider.fromConfig(simpleConfig, {
      auth: mockServices.auth(),
      catalog: catalogServiceMock(),
      events: DefaultEventsService.create({ logger }),
      logger,
      schedule,
    })[0];
    mockBitbucket({
      repositories: () => [repository('svc-a', 'PROJ', 'release/x')],
      search: () => [],
    });
    rejectCodeSearch(403);
    const sourceUrls: string[] = [];
    server.use(
      http.get(
        ({ request }) =>
          new URL(request.url).pathname.includes('/refs/branches'),
        () =>
          HttpResponse.json({
            values: [
              {
                type: 'branch',
                name: 'release',
                target: { hash: '0000000000000000000000000000000000000000' },
              },
              { type: 'branch', name: 'release/x' },
            ],
          }),
      ),
      http.get(
        ({ request }) => new URL(request.url).pathname.includes('/src/'),
        ({ request }) => {
          sourceUrls.push(request.url);
          return HttpResponse.json({
            type: 'commit_file',
            path: 'catalog-info.yaml',
          });
        },
      ),
    );

    await provider.connect(entityProviderConnection);
    await provider.refresh(logger);

    expect(sourceUrls).toEqual([]);
    expect(entityProviderConnection.applyMutation).toHaveBeenCalledWith({
      type: 'full',
      entities: [],
    });
  });
});
