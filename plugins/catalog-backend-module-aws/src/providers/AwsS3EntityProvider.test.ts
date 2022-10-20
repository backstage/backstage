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
import { ConfigReader } from '@backstage/config';
import { EntityProviderConnection } from '@backstage/plugin-catalog-backend';
import { AwsS3EntityProvider } from './AwsS3EntityProvider';
import aws from 'aws-sdk';
import AWSMock from 'aws-sdk-mock';

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

describe('AwsS3EntityProvider', () => {
  AWSMock.setSDKInstance(aws);
  const createObjectList = (keys: string[]): aws.S3.ObjectList => {
    const objects = keys.map(key => {
      return {
        Key: key,
      } as aws.S3.Types.Object;
    });

    return objects as aws.S3.ObjectList;
  };

  const keys = ['key1.yaml', 'key2.yaml', 'key3.yaml', 'key 4.yaml'];

  AWSMock.mock('S3', 'listObjectsV2', async req => {
    const prefix = req.Prefix ?? '';

    if (!req.ContinuationToken) {
      return {
        Contents: createObjectList(
          keys
            .slice(0, Math.ceil(keys.length / 2))
            .map(key => `${prefix}${key}`),
        ),
        NextContinuationToken: 'next-token',
      } as aws.S3.Types.ListObjectsV2Output;
    }

    return {
      Contents: createObjectList(
        keys.slice(Math.ceil(keys.length / 2)).map(key => `${prefix}${key}`),
      ),
    } as aws.S3.Types.ListObjectsV2Output;
  });

  afterEach(() => {
    jest.resetAllMocks();
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
      'https://s3.eu-west-1.amazonaws.com/bucket-1/sub/dir/',
      {
        'key1.yaml': 'generated-7f6d5861b0b3401a38b5fe62e6c7ca11da5fd6d8',
        'key2.yaml': 'generated-a290be145586042af7d80715626399c9d661718d',
        'key3.yaml': 'generated-8d75f78ed9fa618ce433b226dc24eeab441f3a2d',
        'key 4.yaml': 'generated-1e0249dcb5805fc2ce6ac2d3c4d2a3ef4f1270c0',
      },
    );
  });

  // eslint-disable-next-line jest/expect-expect
  it('us-east-1 has region-less URLs', async () => {
    return expectMutation(
      'usEast1',
      {
        bucketName: 'bucket-1',
        prefix: 'sub/dir/',
        region: 'us-east-1',
      },
      'https://s3.amazonaws.com/bucket-1/sub/dir/',
      {
        'key1.yaml': 'generated-f7e3f1c89f62cbf0d82db16452faaa7c040fc331',
        'key2.yaml': 'generated-925173f7dba1acaa73cac5ef4d10c3ed7660aa25',
        'key3.yaml': 'generated-d94cf017911ed7fb3be4a62a3dae1f5202879de3',
        'key 4.yaml': 'generated-f917fca0cfacc2be478ca2a3cff94d00917a1cde',
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
      'https://s3.eu-central-1.amazonaws.com/bucket-1/sub/dir/',
      {
        'key1.yaml': 'generated-285d144b5c1e24e801b97f61f794d566dabc7236',
        'key2.yaml': 'generated-36b78d7fa69690059797d4cc4f40c2a5eaed1d6d',
        'key3.yaml': 'generated-a39ad804bf65993cbc0f3810ff128a3c91daf768',
        'key 4.yaml': 'generated-bd7622ac86c313cb812d90e335b2f5f6bff14670',
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
      'http://localhost:1234/bucket-1/sub/dir/',
      {
        'key1.yaml': 'generated-e1f1dcfe44967b899a49d856cadcfa1ffc72a9f6',
        'key2.yaml': 'generated-6b09503942fe41566339f2eccfbb3380a022494b',
        'key3.yaml': 'generated-17274cdefac2feb3702f41605ca48aa4370d20a9',
        'key 4.yaml': 'generated-659f17a2429f107db04850f9081e3e9c56084aeb',
      },
      {
        endpoint: 'http://localhost:1234',
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
      'https://s3.eu-west-1.amazonaws.com/bucket-1/sub/dir/',
      {
        'key1.yaml': 'generated-7f6d5861b0b3401a38b5fe62e6c7ca11da5fd6d8',
        'key2.yaml': 'generated-a290be145586042af7d80715626399c9d661718d',
        'key3.yaml': 'generated-8d75f78ed9fa618ce433b226dc24eeab441f3a2d',
        'key 4.yaml': 'generated-1e0249dcb5805fc2ce6ac2d3c4d2a3ef4f1270c0',
      },
      undefined,
      true,
    );
  });
});
