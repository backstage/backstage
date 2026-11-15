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
import { ConfigReader } from '@backstage/config';
import {
  EntityProviderConnection,
  locationSpecToLocationEntity,
} from '@backstage/plugin-catalog-node';
import { CodeSearchResultItem, GitRepository } from '../lib';
import { AzureDevOpsEntityProvider } from './AzureDevOpsEntityProvider';
import { codeSearch, fileExists, listRepositories } from '../lib';
import { mockServices } from '@backstage/backend-test-utils';

jest.mock('../lib');
const mockCodeSearch = codeSearch as jest.MockedFunction<typeof codeSearch>;
const mockListRepositories = listRepositories as jest.MockedFunction<
  typeof listRepositories
>;
const mockFileExists = fileExists as jest.MockedFunction<typeof fileExists>;

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

describe('AzureDevOpsEntityProvider', () => {
  afterEach(() => {
    mockCodeSearch.mockClear();
    mockListRepositories.mockReset();
    mockFileExists.mockReset();
  });

  const expectMutation = async (
    providerId: string,
    providerConfig: object,
    codeSearchResults: CodeSearchResultItem[],
    expectedBaseUrl: string,
    names: Record<string, string>,
    integrationConfig?: object,
    scheduleInConfig?: boolean,
  ) => {
    const config = new ConfigReader({
      integrations: {
        azure: integrationConfig ? [integrationConfig] : [],
      },
      catalog: {
        providers: {
          azureDevOps: {
            [providerId]: providerConfig,
          },
        },
      },
    });

    mockCodeSearch.mockResolvedValueOnce(codeSearchResults);

    const schedule = new PersistingTaskRunner();
    const entityProviderConnection: EntityProviderConnection = {
      applyMutation: jest.fn(),
      refresh: jest.fn(),
    };

    const schedulingConfig: Record<string, any> = {};
    if (scheduleInConfig) {
      schedulingConfig.scheduler = {
        createScheduledTaskRunner: (_: any) => schedule,
      } as unknown as SchedulerService;
    } else {
      schedulingConfig.schedule = schedule;
    }

    const provider = AzureDevOpsEntityProvider.fromConfig(config, {
      ...schedulingConfig,
      logger,
    })[0];
    expect(provider.getProviderName()).toEqual(
      `AzureDevOpsEntityProvider:${providerId}`,
    );

    await provider.connect(entityProviderConnection);

    const taskDef = schedule.getTasks()[0];
    expect(taskDef.id).toEqual(
      `AzureDevOpsEntityProvider:${providerId}:refresh`,
    );
    await (taskDef.fn as () => Promise<void>)();

    const expectedEntities = codeSearchResults.map(item => {
      const url = item.branch
        ? encodeURI(
            `${expectedBaseUrl}/_git/${item.repository.name}?path=${item.path}&version=GB${item.branch}`,
          )
        : encodeURI(
            `${expectedBaseUrl}/_git/${item.repository.name}?path=${item.path}`,
          );
      return {
        entity: {
          apiVersion: 'backstage.io/v1alpha1',
          kind: 'Location',
          metadata: {
            annotations: {
              'backstage.io/managed-by-location': `url:${url}`,
              'backstage.io/managed-by-origin-location': `url:${url}`,
            },
            name: names[`${item.repository.name}?path=${item.path}`],
          },
          spec: {
            presence: 'required',
            target: `${url}`,
            type: 'url',
          },
        },
        locationKey: `AzureDevOpsEntityProvider:${providerId}`,
      };
    });

    expect(entityProviderConnection.applyMutation).toHaveBeenCalledWith({
      type: 'full',
      entities: expectedEntities,
    });
  };

  // eslint-disable-next-line jest/expect-expect
  it('no mutation when repos are empty', async () => {
    return expectMutation(
      'allRepos',
      {
        organization: 'myorganization',
        project: 'myproject',
      },
      [],
      'https://dev.azure.com/myorganization/myproject',
      {},
    );
  });

  // eslint-disable-next-line jest/expect-expect
  it('single mutation when repos have 1 file found', async () => {
    return expectMutation(
      'allReposSingleFile',
      {
        organization: 'myorganization',
        project: 'myproject',
      },
      [
        {
          fileName: 'catalog-info.yaml',
          path: '/catalog-info.yaml',
          repository: {
            name: 'myrepo',
          },
          project: {
            name: 'myproject',
          },
        },
      ],
      'https://dev.azure.com/myorganization/myproject',
      {
        'myrepo?path=/catalog-info.yaml':
          'generated-87865246726bb12a8c4fb4f914443f1fbb91648c',
      },
    );
  });

  // eslint-disable-next-line jest/expect-expect
  it('single mutation when repos use branch filter', async () => {
    return expectMutation(
      'allReposSingleFile',
      {
        organization: 'myorganization',
        project: 'myproject',
        branch: 'mybranch',
      },
      [
        {
          fileName: 'catalog-info.yaml',
          path: '/catalog-info.yaml',
          repository: {
            name: 'myrepo',
          },
          project: {
            name: 'myproject',
          },
          branch: 'mybranch',
        },
      ],
      'https://dev.azure.com/myorganization/myproject',
      {
        'myrepo?path=/catalog-info.yaml':
          'generated-589e8cc47341987c7a34f5291791151fa64f7754',
      },
    );
  });

  // eslint-disable-next-line jest/expect-expect
  it('single mutation when multiple repos have multiple files', async () => {
    return expectMutation(
      'allReposMultipleFiles',
      {
        organization: 'myorganization',
        project: 'myproject',
      },
      [
        {
          fileName: 'catalog-info.yaml',
          path: '/catalog-info.yaml',
          repository: {
            name: 'myrepo',
          },
          project: {
            name: 'myproject',
          },
        },
        {
          fileName: 'catalog-info.yaml',
          path: '/catalog-info.yaml',
          repository: {
            name: 'myotherrepo',
          },
          project: {
            name: 'myproject',
          },
        },
      ],
      'https://dev.azure.com/myorganization/myproject',
      {
        'myrepo?path=/catalog-info.yaml':
          'generated-87865246726bb12a8c4fb4f914443f1fbb91648c',
        'myotherrepo?path=/catalog-info.yaml':
          'generated-2deccac384c34d0dca37be0ebb4b1c8cf6913fe1',
      },
    );
  });

  it('fail without schedule and scheduler', () => {
    const config = new ConfigReader({
      catalog: {
        providers: {
          azureDevOps: {
            test: {
              organization: 'myorganization',
              project: 'myproject',
            },
          },
        },
      },
    });

    expect(() =>
      AzureDevOpsEntityProvider.fromConfig(config, {
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
          azureDevOps: {
            test: {
              organization: 'myorganization',
              project: 'myproject',
            },
          },
        },
      },
    });

    expect(() =>
      AzureDevOpsEntityProvider.fromConfig(config, {
        logger,
        scheduler,
      }),
    ).toThrow(
      'No schedule provided neither via code nor config for AzureDevOpsEntityProvider:test',
    );
  });

  // eslint-disable-next-line jest/expect-expect
  it('single simple provider config with schedule in config', async () => {
    return expectMutation(
      'allReposMultipleFiles',
      {
        organization: 'myorganization',
        project: 'myproject',
        schedule: {
          frequency: 'PT30M',
          timeout: {
            minutes: 3,
          },
        },
      },
      [
        {
          fileName: 'catalog-info.yaml',
          path: '/catalog-info.yaml',
          repository: {
            name: 'myrepo',
          },
          project: {
            name: 'myproject',
          },
        },
        {
          fileName: 'catalog-info.yaml',
          path: '/catalog-info.yaml',
          repository: {
            name: 'myotherrepo',
          },
          project: {
            name: 'myproject',
          },
        },
      ],
      'https://dev.azure.com/myorganization/myproject',
      {
        'myrepo?path=/catalog-info.yaml':
          'generated-87865246726bb12a8c4fb4f914443f1fbb91648c',
        'myotherrepo?path=/catalog-info.yaml':
          'generated-2deccac384c34d0dca37be0ebb4b1c8cf6913fe1',
      },
    );
  });

  describe('with the listing discovery method', () => {
    const runRefresh = async (providerConfig: object) => {
      const config = new ConfigReader({
        catalog: {
          providers: {
            azureDevOps: {
              listing: {
                organization: 'myorganization',
                discoveryMethod: 'listing',
                ...providerConfig,
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

      const provider = AzureDevOpsEntityProvider.fromConfig(config, {
        logger,
        schedule,
      })[0];
      await provider.connect(entityProviderConnection);
      await (schedule.getTasks()[0].fn as () => Promise<void>)();

      return entityProviderConnection;
    };

    const toDeferredEntity = (target: string) => ({
      locationKey: 'AzureDevOpsEntityProvider:listing',
      entity: locationSpecToLocationEntity({
        location: { type: 'url', target, presence: 'required' },
      }),
    });

    const repository = (
      id: string,
      name: string,
      project: string,
      extra: Partial<GitRepository> = {},
    ): GitRepository => ({
      id,
      name,
      defaultBranch: 'refs/heads/main',
      project: { name: project },
      ...extra,
    });

    it('discovers catalog files in forks and skips repositories that cannot have them', async () => {
      mockListRepositories.mockResolvedValueOnce([
        repository('1', 'myrepo', 'myproject'),
        repository('2', 'myfork', 'myproject', { isFork: true }),
        repository('3', 'nocatalog', 'myproject'),
        repository('4', 'disabled', 'myproject', { isDisabled: true }),
        repository('5', 'empty', 'myproject', { defaultBranch: undefined }),
      ]);
      mockFileExists.mockImplementation(async (...args) =>
        ['1', '2'].includes(args[4]),
      );

      const connection = await runRefresh({ project: 'myproject' });

      expect(mockListRepositories).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ host: 'dev.azure.com' }),
        'myorganization',
        'myproject',
      );
      expect(mockFileExists.mock.calls.map(call => call.slice(2))).toEqual([
        ['myorganization', 'myproject', '1', '/catalog-info.yaml', undefined],
        ['myorganization', 'myproject', '2', '/catalog-info.yaml', undefined],
        ['myorganization', 'myproject', '3', '/catalog-info.yaml', undefined],
      ]);

      const mutation = {
        type: 'full',
        entities: [
          toDeferredEntity(
            'https://dev.azure.com/myorganization/myproject/_git/myrepo?path=/catalog-info.yaml',
          ),
          toDeferredEntity(
            'https://dev.azure.com/myorganization/myproject/_git/myfork?path=/catalog-info.yaml',
          ),
        ],
      };
      expect(connection.applyMutation).toHaveBeenCalledWith(mutation);
      // Same location entity as the code search discovery method produces
      expect(mutation.entities[0].entity.metadata.name).toBe(
        'generated-87865246726bb12a8c4fb4f914443f1fbb91648c',
      );
    });

    it('matches names like code search, checks the branch, and skips forks when configured', async () => {
      mockListRepositories.mockResolvedValueOnce([
        repository('1', 'service-a', 'Platform Services'),
        repository('2', 'Service-B', 'platform tools'),
        repository('3', 'service-fork', 'Platform Services', {
          isFork: true,
        }),
        repository('4', 'other', 'Platform Services'),
        repository('5', 'service-c', 'Other'),
        repository('6', 'service-empty', 'Platform Services', {
          defaultBranch: undefined,
        }),
      ]);
      mockFileExists.mockImplementation(async (...args) =>
        ['1', '2'].includes(args[4]),
      );

      const connection = await runRefresh({
        project: '"Platform *"',
        repository: 'service-*',
        path: 'catalog-info.yaml',
        branch: 'mybranch',
        skipForkedRepos: true,
      });

      expect(mockListRepositories).toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
        'myorganization',
        undefined,
      );
      expect(mockFileExists.mock.calls.map(call => call.slice(2))).toEqual([
        [
          'myorganization',
          'Platform Services',
          '1',
          '/catalog-info.yaml',
          'mybranch',
        ],
        [
          'myorganization',
          'platform tools',
          '2',
          '/catalog-info.yaml',
          'mybranch',
        ],
        [
          'myorganization',
          'Platform Services',
          '6',
          '/catalog-info.yaml',
          'mybranch',
        ],
      ]);
      expect(connection.applyMutation).toHaveBeenCalledWith({
        type: 'full',
        entities: [
          toDeferredEntity(
            'https://dev.azure.com/myorganization/Platform%20Services/_git/service-a?path=/catalog-info.yaml&version=GBmybranch',
          ),
          toDeferredEntity(
            'https://dev.azure.com/myorganization/platform%20tools/_git/Service-B?path=/catalog-info.yaml&version=GBmybranch',
          ),
        ],
      });
    });

    it('keeps the current entities when a file lookup fails', async () => {
      mockListRepositories.mockResolvedValueOnce([
        repository('1', 'myrepo', 'myproject'),
      ]);
      mockFileExists.mockRejectedValueOnce(
        new Error('Azure DevOps file lookup failed with response status 500'),
      );

      const connection = await runRefresh({ project: 'myproject' });

      expect(mockFileExists).toHaveBeenCalledTimes(1);
      expect(connection.applyMutation).not.toHaveBeenCalled();
    });
  });
});
