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
  const config = new ConfigReader({
    catalog: {
      providers: {
        awsS3: {
          anyProviderId: {
            bucketName: 'bucket-1',
            region: 'us-east-1',
            prefix: 'sub/dir/',
          },
        },
      },
    },
  });

  const schedule = new PersistingTaskRunner();

  AWSMock.setSDKInstance(aws);
  const createObjectList = (...keys: string[]): aws.S3.ObjectList => {
    const objects = keys.map(key => {
      return {
        Key: key,
      } as aws.S3.Types.Object;
    });

    return objects as aws.S3.ObjectList;
  };

  AWSMock.mock('S3', 'listObjectsV2', async req => {
    const prefix = req.Prefix ?? '';

    if (!req.ContinuationToken) {
      return {
        Contents: createObjectList(`${prefix}key1.yaml`, `${prefix}key2.yaml`),
        NextContinuationToken: 'next-token',
      } as aws.S3.Types.ListObjectsV2Output;
    }

    return {
      Contents: createObjectList(`${prefix}key3.yaml`, `${prefix}key4.yaml`),
    } as aws.S3.Types.ListObjectsV2Output;
  });

  afterEach(() => jest.resetAllMocks());

  it('apply full update on scheduled execution', async () => {
    const entityProviderConnection: EntityProviderConnection = {
      applyMutation: jest.fn(),
    };

    const provider = AwsS3EntityProvider.fromConfig(config, {
      logger,
      schedule,
    })[0];
    expect(provider.getProviderName()).toEqual('awsS3-provider:anyProviderId');

    await provider.connect(entityProviderConnection);

    const taskDef = schedule.getTasks()[0];
    expect(taskDef.id).toEqual('awsS3-provider:anyProviderId:refresh');
    await (taskDef.fn as () => Promise<void>)();

    expect(entityProviderConnection.applyMutation).toBeCalledWith({
      type: 'full',
      entities: [
        {
          entity: {
            apiVersion: 'backstage.io/v1alpha1',
            kind: 'Location',
            metadata: {
              annotations: {
                'backstage.io/managed-by-location':
                  'url:https://bucket-1.s3.us-east-1.amazonaws.com/sub/dir/key1.yaml',
                'backstage.io/managed-by-origin-location':
                  'url:https://bucket-1.s3.us-east-1.amazonaws.com/sub/dir/key1.yaml',
              },
              name: 'generated-980e6ad47fbfbfeead708a9c7c87331b7540296a',
            },
            spec: {
              presence: 'required',
              target:
                'https://bucket-1.s3.us-east-1.amazonaws.com/sub/dir/key1.yaml',
              type: 'url',
            },
          },
          locationKey: 'awsS3-provider:anyProviderId',
        },
        {
          entity: {
            apiVersion: 'backstage.io/v1alpha1',
            kind: 'Location',
            metadata: {
              annotations: {
                'backstage.io/managed-by-location':
                  'url:https://bucket-1.s3.us-east-1.amazonaws.com/sub/dir/key2.yaml',
                'backstage.io/managed-by-origin-location':
                  'url:https://bucket-1.s3.us-east-1.amazonaws.com/sub/dir/key2.yaml',
              },
              name: 'generated-266794d8e789089dddba2b42cd79e70b149aa61c',
            },
            spec: {
              presence: 'required',
              target:
                'https://bucket-1.s3.us-east-1.amazonaws.com/sub/dir/key2.yaml',
              type: 'url',
            },
          },
          locationKey: 'awsS3-provider:anyProviderId',
        },
        {
          entity: {
            apiVersion: 'backstage.io/v1alpha1',
            kind: 'Location',
            metadata: {
              annotations: {
                'backstage.io/managed-by-location':
                  'url:https://bucket-1.s3.us-east-1.amazonaws.com/sub/dir/key3.yaml',
                'backstage.io/managed-by-origin-location':
                  'url:https://bucket-1.s3.us-east-1.amazonaws.com/sub/dir/key3.yaml',
              },
              name: 'generated-96f0cdcd7e33aa687c19d160ec7d5b1975cb9ea1',
            },
            spec: {
              presence: 'required',
              target:
                'https://bucket-1.s3.us-east-1.amazonaws.com/sub/dir/key3.yaml',
              type: 'url',
            },
          },
          locationKey: 'awsS3-provider:anyProviderId',
        },
        {
          entity: {
            apiVersion: 'backstage.io/v1alpha1',
            kind: 'Location',
            metadata: {
              annotations: {
                'backstage.io/managed-by-location':
                  'url:https://bucket-1.s3.us-east-1.amazonaws.com/sub/dir/key4.yaml',
                'backstage.io/managed-by-origin-location':
                  'url:https://bucket-1.s3.us-east-1.amazonaws.com/sub/dir/key4.yaml',
              },
              name: 'generated-cd1a799b5ecfc055a0c672654420af3afeb648d3',
            },
            spec: {
              presence: 'required',
              target:
                'https://bucket-1.s3.us-east-1.amazonaws.com/sub/dir/key4.yaml',
              type: 'url',
            },
          },
          locationKey: 'awsS3-provider:anyProviderId',
        },
      ],
    });
  });
});
