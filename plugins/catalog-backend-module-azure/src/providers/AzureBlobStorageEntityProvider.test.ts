/*
 * Copyright 2024 The Backstage Authors
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
import { EntityProviderConnection } from '@backstage/plugin-catalog-node';
import { AzureBlobStorageEntityProvider } from './AzureBlobStorageEntityProvider';
import { mockServices } from '@backstage/backend-test-utils';

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

const blobs = ['key1.yaml', 'key2.yaml', 'key3.yaml', 'key4.yaml'];
const createBlobList = (blobsArray: string[]) => {
  return blobsArray.map(blob => ({
    name: blob,
  }));
};
// Mocking Azure Storage Blob Library
jest.mock('@azure/storage-blob', () => {
  return {
    BlobServiceClient: jest.fn().mockImplementation(() => ({
      url: 'https://myaccount.blob.core.windows.net/',
      getContainerClient: jest.fn().mockImplementation(() => ({
        // eslint-disable-next-line func-names
        listBlobsFlat: jest.fn(async function* () {
          yield* createBlobList(blobs);
        }),
      })),
    })),
  };
});

const logger = mockServices.logger.mock();

describe('AzureBlobStorageEntityProvider', () => {
  const containerName = 'container-1';
  const accountName = 'myaccount';
  const expectMutation = async (
    providerId: string,
    providerConfig: object,
    expectedBaseUrl: string,
    integrationConfig?: object,
    scheduleInConfig?: boolean,
  ) => {
    const config = new ConfigReader({
      integrations: {
        azureBlobStorage: integrationConfig ? [integrationConfig] : [],
      },
      catalog: {
        providers: {
          azureBlob: {
            [providerId]: providerConfig,
          },
        },
      },
    });

    const schedulingConfig: Record<string, any> = {};
    const normalizedExpectedBaseUrl = expectedBaseUrl.endsWith('/')
      ? expectedBaseUrl
      : `${expectedBaseUrl}/`;
    const schedule = new PersistingTaskRunner();
    const entityProviderConnection: EntityProviderConnection = {
      applyMutation: jest.fn(),
      refresh: jest.fn(),
    };

    if (scheduleInConfig) {
      schedulingConfig.scheduler = {
        createScheduledTaskRunner: (_: any) => schedule,
      } as unknown as SchedulerService;
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

    try {
      await provider.connect(entityProviderConnection);
    } catch (error) {
      console.error('Error during provider connection:', error);
    }

    const taskDef = schedule.getTasks()[0];
    expect(taskDef.id).toEqual(
      `azureBlobStorage-provider:${providerId}:refresh`,
    );

    await (taskDef.fn as () => Promise<void>)();

    const expectedEntities = blobs.map(blob => {
      const url = encodeURI(`${normalizedExpectedBaseUrl}${blob}`);
      return {
        entity: {
          apiVersion: 'backstage.io/v1alpha1',
          kind: 'Location',
          metadata: {
            annotations: {
              'backstage.io/managed-by-location': `url:${url}`,
              'backstage.io/managed-by-origin-location': `url:${url}`,
            },
            name: expect.stringMatching(/generated-[a-f0-9]{40}/),
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
      'staticContainer',
      {
        containerName,
        accountName,
      },
      'https://myaccount.blob.core.windows.net/container-1/',
      {
        accountName: 'myaccount',
      },
    );
  });

  // eslint-disable-next-line jest/expect-expect
  it('apply full update no prefix', async () => {
    return expectMutation(
      'staticContainerNoPrefix',
      {
        containerName,
        accountName,
        schedule: {
          frequency: { minutes: 30 },
          timeout: { minutes: 3 },
        },
      },
      'https://myaccount.blob.core.windows.net/container-1/',
      {
        host: 'blob.core.windows.net',
        accountName: 'myaccount',
      },
    );
  });

  it('fail without schedule and scheduler', () => {
    const config = new ConfigReader({
      catalog: {
        providers: {
          azureBlob: {
            test: {
              accountName: 'myaccount',
              containerName: 'container-1',
              prefix: 'sub/dir/',
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

  it('fail with scheduler but no schedule config', () => {
    const scheduler = {
      createScheduledTaskRunner: (_: any) => jest.fn(),
    } as unknown as SchedulerService;
    const config = new ConfigReader({
      catalog: {
        providers: {
          azureBlob: {
            test: {
              containerName: 'container-1',
              prefix: 'sub/dir/',
              accountName: 'myaccount',
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
      'No schedule provided neither via code nor config for AzureBlobStorageEntityProvider:test.',
    );
  });
});
