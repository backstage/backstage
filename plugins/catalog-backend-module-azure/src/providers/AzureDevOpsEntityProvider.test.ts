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
import { CodeSearchResultItem } from '../lib';
import { AzureDevOpsEntityProvider } from './AzureDevOpsEntityProvider';
import { codeSearch } from '../lib';

jest.mock('../lib');
const mockCodeSearch = codeSearch as jest.MockedFunction<typeof codeSearch>;

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

describe('AzureDevOpsEntityProvider', () => {
  afterEach(() => {
    mockCodeSearch.mockClear();
  });

  const expectMutation = async (
    providerId: string,
    providerConfig: object,
    codeSearchResults: CodeSearchResultItem[],
    expectedBaseUrl: string,
    names: Record<string, string>,
    integrationConfig?: object,
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
    };

    const provider = AzureDevOpsEntityProvider.fromConfig(config, {
      logger,
      schedule,
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
      const url = encodeURI(
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

    expect(entityProviderConnection.applyMutation).toBeCalledWith({
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
        },
        {
          fileName: 'catalog-info.yaml',
          path: '/catalog-info.yaml',
          repository: {
            name: 'myotherrepo',
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
});
