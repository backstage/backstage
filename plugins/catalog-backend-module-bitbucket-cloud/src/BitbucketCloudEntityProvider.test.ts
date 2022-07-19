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
import { TaskInvocationDefinition, TaskRunner } from '@backstage/backend-tasks';
import { ConfigReader } from '@backstage/config';
import { EntityProviderConnection } from '@backstage/plugin-catalog-backend';
import { setupRequestMockHandlers } from '@backstage/backend-test-utils';
import { BitbucketCloudEntityProvider } from './BitbucketCloudEntityProvider';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

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

describe('BitbucketCloudEntityProvider', () => {
  setupRequestMockHandlers(server);
  afterEach(() => jest.resetAllMocks());

  it('no provider config', () => {
    const schedule = new PersistingTaskRunner();
    const config = new ConfigReader({});
    const providers = BitbucketCloudEntityProvider.fromConfig(config, {
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
          bitbucketCloud: {
            workspace: 'test-ws',
          },
        },
      },
    });
    const providers = BitbucketCloudEntityProvider.fromConfig(config, {
      logger,
      schedule,
    });

    expect(providers).toHaveLength(1);
    expect(providers[0].getProviderName()).toEqual(
      'bitbucketCloud-provider:default',
    );
  });

  it('multiple provider configs', () => {
    const schedule = new PersistingTaskRunner();
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
    const config = new ConfigReader({
      catalog: {
        providers: {
          bitbucketCloud: {
            myProvider: {
              workspace: 'test-ws',
              catalogPath: 'custom/path/catalog-custom.yaml',
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
    };
    const provider = BitbucketCloudEntityProvider.fromConfig(config, {
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

    expect(entityProviderConnection.applyMutation).toBeCalledTimes(1);
    expect(entityProviderConnection.applyMutation).toBeCalledWith({
      type: 'full',
      entities: expectedEntities,
    });
  });
});
