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

import { getVoidLogger } from '@backstage/backend-common';
import {
  PluginTaskScheduler,
  TaskInvocationDefinition,
  TaskRunner,
} from '@backstage/backend-tasks';
import { setupRequestMockHandlers } from '@backstage/backend-test-utils';
import { ConfigReader } from '@backstage/config';
import { EntityProviderConnection } from '@backstage/plugin-catalog-backend';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { GitlabDiscoveryEntityProvider } from './GitlabDiscoveryEntityProvider';

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

const server = setupServer();

describe('GitlabDiscoveryEntityProvider', () => {
  setupRequestMockHandlers(server);
  afterEach(() => jest.resetAllMocks());

  it('no provider config', () => {
    const schedule = new PersistingTaskRunner();
    const config = new ConfigReader({});
    const providers = GitlabDiscoveryEntityProvider.fromConfig(config, {
      logger,
      schedule,
    });

    expect(providers).toHaveLength(0);
  });

  it('single simple discovery config', () => {
    const schedule = new PersistingTaskRunner();
    const config = new ConfigReader({
      integrations: {
        gitlab: [
          {
            host: 'test-gitlab',
            apiBaseUrl: 'https://api.gitlab.example/api/v4',
            token: '1234',
          },
        ],
      },
      catalog: {
        providers: {
          gitlab: {
            'test-id': {
              host: 'test-gitlab',
              group: 'test-group',
            },
          },
        },
      },
    });
    const providers = GitlabDiscoveryEntityProvider.fromConfig(config, {
      logger,
      schedule,
    });

    expect(providers).toHaveLength(1);
    expect(providers[0].getProviderName()).toEqual(
      'GitlabDiscoveryEntityProvider:test-id',
    );
  });

  it('multiple discovery configs', () => {
    const schedule = new PersistingTaskRunner();
    const config = new ConfigReader({
      integrations: {
        gitlab: [
          {
            host: 'test-gitlab',
            apiBaseUrl: 'https://api.gitlab.example/api/v4',
            token: '1234',
          },
        ],
      },
      catalog: {
        providers: {
          gitlab: {
            'test-id': {
              host: 'test-gitlab',
              group: 'test-group',
            },
            'second-test': {
              host: 'test-gitlab',
              group: 'second-group',
            },
          },
        },
      },
    });
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

  it('apply full update on scheduled execution', async () => {
    const config = new ConfigReader({
      integrations: {
        gitlab: [
          {
            host: 'test-gitlab',
            apiBaseUrl: 'https://api.gitlab.example/api/v4',
            token: '1234',
          },
        ],
      },
      catalog: {
        providers: {
          gitlab: {
            'test-id': {
              host: 'test-gitlab',
              group: 'test-group',
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
    expect(provider.getProviderName()).toEqual(
      'GitlabDiscoveryEntityProvider:test-id',
    );

    server.use(
      rest.get(
        `https://api.gitlab.example/api/v4/groups/test-group/projects`,
        (_req, res, ctx) => {
          const response = [
            {
              id: 123,
              default_branch: 'master',
              archived: false,
              last_activity_at: new Date().toString(),
              web_url: 'https://api.gitlab.example/test-group/test-repo',
              path_with_namespace: 'test-group/test-repo',
            },
          ];
          return res(ctx.json(response));
        },
      ),
      rest.head(
        'https://api.gitlab.example/api/v4/projects/test-group%2Ftest-repo/repository/files/catalog-info.yaml',
        (req, res, ctx) => {
          if (req.url.searchParams.get('ref') === 'master') {
            return res(ctx.status(200));
          }
          return res(ctx.status(404, 'Not Found'));
        },
      ),
    );

    await provider.connect(entityProviderConnection);

    const taskDef = schedule.getTasks()[0];
    expect(taskDef.id).toEqual('GitlabDiscoveryEntityProvider:test-id:refresh');
    await (taskDef.fn as () => Promise<void>)();

    const url = `https://api.gitlab.example/test-group/test-repo/-/blob/master/catalog-info.yaml`;
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
            name: 'generated-cd37bf72a2fe92603f4255d9f49c6c1ead746a48',
          },
          spec: {
            presence: 'optional',
            target: `${url}`,
            type: 'url',
          },
        },
        locationKey: 'GitlabDiscoveryEntityProvider:test-id',
      },
    ];

    expect(entityProviderConnection.applyMutation).toHaveBeenCalledTimes(1);
    expect(entityProviderConnection.applyMutation).toHaveBeenCalledWith({
      type: 'full',
      entities: expectedEntities,
    });
  });

  it('should filter found projects based on a provided project pattern', async () => {
    const config = new ConfigReader({
      integrations: {
        gitlab: [
          {
            host: 'test-gitlab',
            apiBaseUrl: 'https://api.gitlab.example/api/v4',
            token: '1234',
          },
        ],
      },
      catalog: {
        providers: {
          gitlab: {
            'test-id': {
              host: 'test-gitlab',
              projectPattern: 'john/',
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

    server.use(
      rest.get(
        `https://api.gitlab.example/api/v4/projects`,
        (_req, res, ctx) => {
          const response = [
            {
              id: 123,
              default_branch: 'master',
              archived: false,
              last_activity_at: new Date().toString(),
              web_url: 'https://api.gitlab.example/test-group/test-repo',
              path_with_namespace: 'test-group/test-repo',
            },
            {
              id: 124,
              default_branch: 'master',
              archived: false,
              last_activity_at: new Date().toString(),
              web_url: 'https://api.gitlab.example/john/example',
              path_with_namespace: 'john/example',
            },
          ];
          return res(ctx.json(response));
        },
      ),
      rest.head(
        'https://api.gitlab.example/api/v4/projects/test-group%2Ftest-repo/repository/files/catalog-info.yaml',
        (req, res, ctx) => {
          if (req.url.searchParams.get('ref') === 'master') {
            return res(ctx.status(200));
          }
          return res(ctx.status(404, 'Not Found'));
        },
      ),
      rest.head(
        'https://api.gitlab.example/api/v4/projects/john%2Fexample/repository/files/catalog-info.yaml',
        (req, res, ctx) => {
          if (req.url.searchParams.get('ref') === 'master') {
            return res(ctx.status(200));
          }
          return res(ctx.status(404, 'Not Found'));
        },
      ),
    );

    await provider.connect(entityProviderConnection);

    await provider.refresh(logger);

    expect(entityProviderConnection.applyMutation).toHaveBeenCalledWith({
      type: 'full',
      entities: [
        {
          entity: {
            apiVersion: 'backstage.io/v1alpha1',
            kind: 'Location',
            metadata: {
              annotations: {
                'backstage.io/managed-by-location':
                  'url:https://api.gitlab.example/john/example/-/blob/master/catalog-info.yaml',
                'backstage.io/managed-by-origin-location':
                  'url:https://api.gitlab.example/john/example/-/blob/master/catalog-info.yaml',
              },
              name: 'generated-2045212e5b3e9e6bacf51cec709e362282e3cda9',
            },
            spec: {
              presence: 'optional',
              target:
                'https://api.gitlab.example/john/example/-/blob/master/catalog-info.yaml',
              type: 'url',
            },
          },
          locationKey: 'GitlabDiscoveryEntityProvider:test-id',
        },
      ],
    });
  });

  it('fail without schedule and scheduler', () => {
    const config = new ConfigReader({
      integrations: {
        gitlab: [
          {
            host: 'test-gitlab',
            apiBaseUrl: 'https://api.gitlab.example/api/v4',
            token: '1234',
          },
        ],
      },
      catalog: {
        providers: {
          gitlab: {
            'test-id': {
              host: 'test-gitlab',
              group: 'test-group',
            },
          },
        },
      },
    });

    expect(() =>
      GitlabDiscoveryEntityProvider.fromConfig(config, {
        logger,
      }),
    ).toThrow('Either schedule or scheduler must be provided');
  });

  it('fail with scheduler but no schedule config', () => {
    const scheduler = {
      createScheduledTaskRunner: (_: any) => jest.fn(),
    } as unknown as PluginTaskScheduler;
    const config = new ConfigReader({
      integrations: {
        gitlab: [
          {
            host: 'test-gitlab',
            apiBaseUrl: 'https://api.gitlab.example/api/v4',
            token: '1234',
          },
        ],
      },
      catalog: {
        providers: {
          gitlab: {
            'test-id': {
              host: 'test-gitlab',
              group: 'test-group',
            },
          },
        },
      },
    });

    expect(() =>
      GitlabDiscoveryEntityProvider.fromConfig(config, {
        logger,
        scheduler,
      }),
    ).toThrow(
      'No schedule provided neither via code nor config for GitlabDiscoveryEntityProvider:test-id',
    );
  });

  it('single simple provider config with schedule in config', async () => {
    const schedule = new PersistingTaskRunner();
    const scheduler = {
      createScheduledTaskRunner: (_: any) => schedule,
    } as unknown as PluginTaskScheduler;
    const config = new ConfigReader({
      integrations: {
        gitlab: [
          {
            host: 'test-gitlab',
            apiBaseUrl: 'https://api.gitlab.example/api/v4',
            token: '1234',
          },
        ],
      },
      catalog: {
        providers: {
          gitlab: {
            'test-id': {
              host: 'test-gitlab',
              group: 'test-group',
              schedule: {
                frequency: 'PT30M',
                timeout: 'PT3M',
              },
            },
          },
        },
      },
    });
    const providers = GitlabDiscoveryEntityProvider.fromConfig(config, {
      logger,
      scheduler,
    });

    expect(providers).toHaveLength(1);
    expect(providers[0].getProviderName()).toEqual(
      'GitlabDiscoveryEntityProvider:test-id',
    );
  });
});
