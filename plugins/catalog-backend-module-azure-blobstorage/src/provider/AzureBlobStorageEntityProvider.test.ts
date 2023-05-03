/*
 * Copyright 2023 The Backstage Authors
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

import { ContainerListBlobsOptions } from '@azure/storage-blob';
import { getVoidLogger } from '@backstage/backend-common';
import {
  PluginTaskScheduler,
  TaskInvocationDefinition,
  TaskRunner,
} from '@backstage/backend-tasks';
import { ConfigReader } from '@backstage/config';
import { EntityProviderConnection } from '@backstage/plugin-catalog-node';
import { AzureBlobStorageEntityProvider } from './AzureBlobStorageEntityProvider';

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

const keys = ['key1.yaml', 'key2.yaml', 'key3.yaml', 'key 4.yaml'];

jest.mock('@azure/storage-blob', () => {
  class ContainerClient {
    constructor(private readonly containerName: string) {}

    listBlobsFlat(options: ContainerListBlobsOptions) {
      if (this.containerName === 'container' && options.prefix === 'sub/dir/') {
        return [
          {
            name: `${options.prefix}${keys[0]}`,
          },
          {
            name: `${options.prefix}${keys[1]}`,
          },
          {
            name: `${options.prefix}${keys[2]}`,
          },
          {
            name: `${options.prefix}${keys[3]}`,
          },
        ];
      }
      return [{}];
    }
  }

  class BlobServiceClient {
    constructor(public readonly url: string) {}

    getContainerClient(containerName: string) {
      return new ContainerClient(containerName);
    }
  }

  return {
    __esModule: true,
    BlobServiceClient,
  };
});

const logger = getVoidLogger();
jest.spyOn(logger, 'error').mockReturnValue(logger);

describe('azureBlobStorageEntityProvider', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  const expectMutation = async (
    providerId: string,
    providerConfig: object,
    expectedBaseUrl: string,
    names: Record<string, string>,
    integrationConfig?: object,
    scheduleInConfig?: boolean,
  ) => {
    const config = new ConfigReader({
      integrations: {
        azureBlobStorage: integrationConfig ? [integrationConfig] : [],
      },
      catalog: {
        providers: {
          azureBlobStorage: {
            [providerId]: providerConfig,
          },
        },
      },
    });

    const schedulingConfig: Record<string, any> = {};

    const schedule = new PersistingTaskRunner();
    const entityProviderConnection: EntityProviderConnection = {
      applyMutation: jest.fn(),
      refresh: jest.fn(),
    };

    if (scheduleInConfig) {
      schedulingConfig.scheduler = {
        createScheduledTaskRunner: (_: any) => schedule,
      } as unknown as PluginTaskScheduler;
    } else {
      schedulingConfig.schedule = schedule;
    }

    const provider = AzureBlobStorageEntityProvider.fromConfig(config, {
      ...schedulingConfig,
      logger,
    })[0];
    expect(provider.getProviderName()).toEqual(
      `azureBlobStorage-provider:${providerId}`,
    );

    await provider.connect(entityProviderConnection);

    const taskDef = schedule.getTasks()[0];
    expect(taskDef.id).toEqual(
      `azureBlobStorage-provider:${providerId}:refresh`,
    );
    await (taskDef.fn as () => Promise<void>)();

    const expectedEntities = keys.map(key => {
      // @ts-ignore
      const url = encodeURI(`${expectedBaseUrl}${key}`);
      return {
        entity: {
          apiVersion: 'backstage.io/v1alpha1',
          kind: 'Location',
          metadata: {
            annotations: {
              'backstage.io/managed-by-location': `url:${url}`,
              'backstage.io/managed-by-origin-location': `url:${url}`,
            },
            name: names[key],
          },
          spec: {
            presence: 'required',
            target: `${url}`,
            type: 'url',
          },
        },
        locationKey: `azureBlobStorage-provider:${providerId}`,
      };
    });

    expect(entityProviderConnection.applyMutation).toHaveBeenCalledWith({
      type: 'full',
      entities: expectedEntities,
    });
  };
  // eslint-disable-next-line jest/expect-expect
  it('apply full update on scheduled execution', async () => {
    return expectMutation(
      'example',
      {
        accountName: 'example',
        containerName: 'container',
        prefix: 'sub/dir/',
      },
      'https://example.blob.core.windows.net/container/sub/dir/',
      {
        'key1.yaml': 'generated-d0c1165f4a9d05e29a6e0f6c5f7e854fe6f8b792',
        'key2.yaml': 'generated-7fb4e01988a6877fe5b12ca671964142fc94ba29',
        'key3.yaml': 'generated-ee002d6c122a377e81112aa81ef8fded6317c36f',
        'key 4.yaml': 'generated-a84a4a524879364f43a52b520f9c11794cb6a467',
      },
      {
        accountName: 'example',
        secretAccessKey: '?my-secret-token',
      },
      false,
    );
  });

  it('fail without schedule and scheduler', () => {
    const config = new ConfigReader({
      integrations: {
        azureBlobStorage: [
          {
            accountName: 'accountName',
            secretAccessKey: '?my-secret-token',
          },
        ],
      },
      catalog: {
        providers: {
          azureBlobStorage: {
            test: {
              accountName: 'account',
              containerName: 'container',
            },
          },
        },
      },
    });

    expect(() =>
      AzureBlobStorageEntityProvider.fromConfig(config, {
        logger,
      }),
    ).toThrow('Either schedule or scheduler must be provided');
  });

  it('fail with no integration config found', () => {
    const scheduler = {
      createScheduledTaskRunner: (_: any) => jest.fn(),
    } as unknown as PluginTaskScheduler;
    const config = new ConfigReader({
      catalog: {
        providers: {
          azureBlobStorage: {
            test: {
              accountName: 'test',
              containerName: 'container',
            },
          },
        },
      },
    });

    expect(() =>
      AzureBlobStorageEntityProvider.fromConfig(config, {
        logger,
        scheduler,
      }),
    ).toThrow('No integration found for azureBlobStorage-provider:test.');
  });

  it('fail with scheduler but no schedule config', () => {
    const scheduler = {
      createScheduledTaskRunner: (_: any) => jest.fn(),
    } as unknown as PluginTaskScheduler;
    const config = new ConfigReader({
      integrations: {
        azureBlobStorage: [
          {
            accountName: 'test',
            secretAccessKey: '?my-secret-token',
          },
        ],
      },
      catalog: {
        providers: {
          azureBlobStorage: {
            test: {
              accountName: 'test',
              containerName: 'container',
            },
          },
        },
      },
    });

    expect(() =>
      AzureBlobStorageEntityProvider.fromConfig(config, {
        logger,
        scheduler,
      }),
    ).toThrow(
      'No schedule provided neither via code nor config for azureBlobStorage-provider:test',
    );
  });

  // eslint-disable-next-line jest/expect-expect
  it('single simple provider config with schedule in config', async () => {
    return expectMutation(
      'example',
      {
        accountName: 'example',
        containerName: 'container',
        prefix: 'sub/dir/',
        schedule: {
          frequency: 'PT30M',
          timeout: {
            minutes: 3,
          },
        },
      },
      'https://example.blob.core.windows.net/container/sub/dir/',
      {
        'key1.yaml': 'generated-d0c1165f4a9d05e29a6e0f6c5f7e854fe6f8b792',
        'key2.yaml': 'generated-7fb4e01988a6877fe5b12ca671964142fc94ba29',
        'key3.yaml': 'generated-ee002d6c122a377e81112aa81ef8fded6317c36f',
        'key 4.yaml': 'generated-a84a4a524879364f43a52b520f9c11794cb6a467',
      },
      {
        accountName: 'example',
        secretAccessKey: '?my-secret-token',
      },
      true,
    );
  });
});
