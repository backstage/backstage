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
  PluginTaskScheduler,
  TaskInvocationDefinition,
  TaskRunner,
} from '@backstage/backend-tasks';
import { ConfigReader } from '@backstage/config';
import { EntityProviderConnection } from '@backstage/plugin-catalog-node';
import { AwsS3EntityProvider } from './AwsS3EntityProvider';
import { mockClient } from 'aws-sdk-client-mock';
import 'aws-sdk-client-mock-jest';
import { ListObjectsV2Command, S3Client } from '@aws-sdk/client-s3';
import { mockServices } from '@backstage/backend-test-utils';

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

const logger = mockServices.logger.mock();

describe('AwsS3EntityProvider', () => {
  const createObjectList = (keys: string[]) => {
    const objects = keys.map(key => {
      return {
        Key: key,
      };
    });
    return objects;
  };

  const keys = ['key1.yaml', 'key2.yaml', 'key3.yaml', 'key 4.yaml'];
  const mock = mockClient(S3Client);

  beforeEach(() => {
    mock.on(ListObjectsV2Command).callsFake(async req => {
      const prefix = req.Prefix ?? '';

      if (!req.ContinuationToken) {
        return {
          Contents: createObjectList(
            keys
              .slice(0, Math.ceil(keys.length / 2))
              .map(key => `${prefix}${key}`),
          ),
          NextContinuationToken: 'next-token',
        };
      }

      return {
        Contents: createObjectList(
          keys.slice(Math.ceil(keys.length / 2)).map(key => `${prefix}${key}`),
        ),
      };
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    process.env.AWS_REGION = undefined;
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
        awsS3: integrationConfig ? [integrationConfig] : [],
      },
      catalog: {
        providers: {
          awsS3: {
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
      } as unknown as PluginTaskScheduler;
    } else {
      schedulingConfig.schedule = schedule;
    }

    const provider = AwsS3EntityProvider.fromConfig(config, {
      ...schedulingConfig,
      logger,
    })[0];
    expect(provider.getProviderName()).toEqual(`awsS3-provider:${providerId}`);

    await provider.connect(entityProviderConnection);

    const taskDef = schedule.getTasks()[0];
    expect(taskDef.id).toEqual(`awsS3-provider:${providerId}:refresh`);
    await (taskDef.fn as () => Promise<void>)();

    const expectedEntities = keys.map(key => {
      const url = encodeURI(`${normalizedExpectedBaseUrl}${key}`);
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
        locationKey: `awsS3-provider:${providerId}`,
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
      'regionalStatic',
      {
        bucketName: 'bucket-1',
        prefix: 'sub/dir/',
        region: 'eu-west-1',
      },
      'https://bucket-1.s3.eu-west-1.amazonaws.com/sub/dir/',
      {
        'key1.yaml': 'generated-8ece85ad90200c6577b99f553dcbedde05fa34bb',
        'key2.yaml': 'generated-6b54c6aaa44696f5e91ce0f54fb27bf837549d11',
        'key3.yaml': 'generated-88c703cf1aa66913db4033b029adc0b174574646',
        'key 4.yaml': 'generated-2b7e068bb4ec818c14f179a1e721843fc2dbc5f9',
      },
    );
  });

  // eslint-disable-next-line jest/expect-expect
  it('apply full update on scheduled execution force path style', async () => {
    return expectMutation(
      'regionalStatic',
      {
        bucketName: 'bucket-1',
        prefix: 'sub/dir/',
        region: 'eu-west-1',
      },
      'https://s3.eu-west-1.amazonaws.com/bucket-1/sub/dir/',
      {
        'key1.yaml': 'generated-7f6d5861b0b3401a38b5fe62e6c7ca11da5fd6d8',
        'key2.yaml': 'generated-a290be145586042af7d80715626399c9d661718d',
        'key3.yaml': 'generated-8d75f78ed9fa618ce433b226dc24eeab441f3a2d',
        'key 4.yaml': 'generated-1e0249dcb5805fc2ce6ac2d3c4d2a3ef4f1270c0',
      },
      {
        s3ForcePathStyle: true,
      },
    );
  });

  // eslint-disable-next-line jest/expect-expect
  it('apply full update on scheduled execution no prefix', async () => {
    return expectMutation(
      'regionalStatic',
      {
        bucketName: 'bucket-1',
        region: 'eu-west-1',
      },
      'https://bucket-1.s3.eu-west-1.amazonaws.com/',
      {
        'key1.yaml': 'generated-ac6d99e56e0fbd6bf3719a5182f37bfa84b1cddc',
        'key2.yaml': 'generated-cc3e1145496cd95bf3898687bb5b7d2991a7b7fd',
        'key3.yaml': 'generated-a197557b0cb89d14ac1297231ed930bd4c40b664',
        'key 4.yaml': 'generated-a774e6c1d1c7ee511b7d79ebb99b08a39cf439c4',
      },
    );
  });

  // eslint-disable-next-line jest/expect-expect
  it('apply full update on scheduled execution force path style no prefix', async () => {
    return expectMutation(
      'regionalStatic',
      {
        bucketName: 'bucket-1',
        region: 'eu-west-1',
      },
      'https://s3.eu-west-1.amazonaws.com/bucket-1',
      {
        'key1.yaml': 'generated-b390cd4de7ff00f6d51426870fc0e685029fbf09',
        'key2.yaml': 'generated-15ebeb1e53ffe71ea93f037076aefcdc5cc5e617',
        'key3.yaml': 'generated-fd0a33e70bafd707a60139decbd0383361ab3b4e',
        'key 4.yaml': 'generated-ac574fb266d9c8bd983b25a208c538e4ad2c1d06',
      },
      {
        s3ForcePathStyle: true,
      },
    );
  });

  // eslint-disable-next-line jest/expect-expect
  it('apply full update on scheduled execution bucket with dot in it', async () => {
    return expectMutation(
      'regionalStatic',
      {
        bucketName: 'bucket.1',
        prefix: 'sub/dir/',
        region: 'eu-west-1',
      },
      'https://s3.eu-west-1.amazonaws.com/bucket.1/sub/dir/',
      {
        'key1.yaml': 'generated-651b5851d4670b7d5bb9a319d8f6eb295092e4ad',
        'key2.yaml': 'generated-ccddcdc3ad814aea072883118f3a9d0ac39a161e',
        'key3.yaml': 'generated-b2b8548903aa764544ab79dc81ab5093e6e4ba83',
        'key 4.yaml': 'generated-aafa9cc0422f5e8ccce1616dc0c74fa94f692af3',
      },
    );
  });

  // eslint-disable-next-line jest/expect-expect
  it('us-east-1 does not have region-less URLs', async () => {
    return expectMutation(
      'usEast1',
      {
        bucketName: 'bucket-1',
        prefix: 'sub/dir/',
        region: 'us-east-1',
      },
      'https://bucket-1.s3.us-east-1.amazonaws.com/sub/dir/',
      {
        'key1.yaml': 'generated-980e6ad47fbfbfeead708a9c7c87331b7540296a',
        'key2.yaml': 'generated-266794d8e789089dddba2b42cd79e70b149aa61c',
        'key3.yaml': 'generated-96f0cdcd7e33aa687c19d160ec7d5b1975cb9ea1',
        'key 4.yaml': 'generated-4f6d3ffb232e4a5b82c3a52549e4c36dab1c2f8d',
      },
    );
  });

  // eslint-disable-next-line jest/expect-expect
  it('fallback region if absent', async () => {
    // logic will use region information provided from
    // profile < AWS_REGION < argument to client/command
    process.env.AWS_REGION = 'eu-central-1';

    return expectMutation(
      'absentRegion',
      {
        bucketName: 'bucket-1',
        prefix: 'sub/dir/',
      },
      'https://bucket-1.s3.eu-central-1.amazonaws.com/sub/dir/',
      {
        'key1.yaml': 'generated-bb17a9f9b420edd93137692f000b2d443a29239c',
        'key2.yaml': 'generated-b4559ecc8b615407e421dbaa3fcb9338e977b8ac',
        'key3.yaml': 'generated-bb3d500a6f8b351b0eed1aec77ebce65c1ab41fb',
        'key 4.yaml': 'generated-686de87f5882f6558b43280c5b6047e485199e88',
      },
    );
  });

  // eslint-disable-next-line jest/expect-expect
  it('custom endpoint', async () => {
    return expectMutation(
      'customEndpoint',
      {
        bucketName: 'bucket-1',
        prefix: 'sub/dir/',
      },
      'http://bucket-1.localhost:1234/sub/dir/',
      {
        'key1.yaml': 'generated-79625971ead9c39c91b0bfef4d7c748325e31234',
        'key2.yaml': 'generated-eeae95f16605d3afdc615436c18c9fbd35781299',
        'key3.yaml': 'generated-692976561563c3fa55889ad090363716c7b7e915',
        'key 4.yaml': 'generated-c8f92ea0eb96c355b7e56cbc461cef29f830747e',
      },
      {
        endpoint: 'http://localhost:1234/',
      },
    );
  });

  // eslint-disable-next-line jest/expect-expect
  it('custom endpoint bucket dot', async () => {
    return expectMutation(
      'customEndpoint',
      {
        bucketName: 'bucket.1',
        prefix: 'sub/dir/',
      },
      'http://localhost:1234/bucket.1/sub/dir/',
      {
        'key1.yaml': 'generated-07be77ac8626ac76a924414e0edf5ce66d3e0b27',
        'key2.yaml': 'generated-47295ada3c894cf9bac0d570a34d909244ea2f74',
        'key3.yaml': 'generated-30e98f3ebd350f3b618acd024199b5f31545495d',
        'key 4.yaml': 'generated-b71bc7661b92cef0db62c9652912fd5e4b245aa7',
      },
      {
        endpoint: 'http://localhost:1234/',
      },
    );
  });

  // eslint-disable-next-line jest/expect-expect
  it('custom endpoint force path style', async () => {
    return expectMutation(
      'customEndpoint',
      {
        bucketName: 'bucket-1',
        prefix: 'sub/dir/',
      },
      'http://localhost:1234/bucket-1/sub/dir/',
      {
        'key1.yaml': 'generated-e1f1dcfe44967b899a49d856cadcfa1ffc72a9f6',
        'key2.yaml': 'generated-6b09503942fe41566339f2eccfbb3380a022494b',
        'key3.yaml': 'generated-17274cdefac2feb3702f41605ca48aa4370d20a9',
        'key 4.yaml': 'generated-659f17a2429f107db04850f9081e3e9c56084aeb',
      },
      {
        endpoint: 'http://localhost:1234/',
        s3ForcePathStyle: true,
      },
    );
  });

  it('fail without schedule and scheduler', () => {
    const config = new ConfigReader({
      catalog: {
        providers: {
          awsS3: {
            test: {
              bucketName: 'bucket-1',
              prefix: 'sub/dir/',
              region: 'eu-west-1',
            },
          },
        },
      },
    });

    expect(() =>
      AwsS3EntityProvider.fromConfig(config, {
        logger,
      }),
    ).toThrow('Either schedule or scheduler must be provided');
  });

  it('fail with scheduler but no schedule config', () => {
    const scheduler = {
      createScheduledTaskRunner: (_: any) => jest.fn(),
    } as unknown as PluginTaskScheduler;
    const config = new ConfigReader({
      catalog: {
        providers: {
          awsS3: {
            test: {
              bucketName: 'bucket-1',
              prefix: 'sub/dir/',
              region: 'eu-west-1',
            },
          },
        },
      },
    });

    expect(() =>
      AwsS3EntityProvider.fromConfig(config, {
        logger,
        scheduler,
      }),
    ).toThrow(
      'No schedule provided neither via code nor config for awsS3-provider:test',
    );
  });

  // eslint-disable-next-line jest/expect-expect
  it('single simple provider config with schedule in config', async () => {
    return expectMutation(
      'regionalStatic',
      {
        bucketName: 'bucket-1',
        prefix: 'sub/dir/',
        region: 'eu-west-1',
        schedule: {
          frequency: 'PT30M',
          timeout: {
            minutes: 3,
          },
        },
      },
      'https://bucket-1.s3.eu-west-1.amazonaws.com/sub/dir/',
      {
        'key1.yaml': 'generated-8ece85ad90200c6577b99f553dcbedde05fa34bb',
        'key2.yaml': 'generated-6b54c6aaa44696f5e91ce0f54fb27bf837549d11',
        'key3.yaml': 'generated-88c703cf1aa66913db4033b029adc0b174574646',
        'key 4.yaml': 'generated-2b7e068bb4ec818c14f179a1e721843fc2dbc5f9',
      },
      undefined,
      true,
    );
  });
});
