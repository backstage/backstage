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

import { AwsEKSClusterProcessor } from './AwsEKSClusterProcessor';
import {
  ListClustersResponse,
  DescribeClusterResponse,
  ListClustersCommand,
  DescribeClusterCommand,
  EKSClient,
} from '@aws-sdk/client-eks';

const eksSendMock = jest.fn();

describe('AwsEKSClusterProcessor', () => {
  describe('readLocation', () => {
    const processor = new (AwsEKSClusterProcessor as any)({});
    const location = { type: 'aws-eks', target: '957140518395/us-west-2' };
    const emit = jest.fn();

    afterEach(() => {
      jest.restoreAllMocks();
      eksSendMock.mockReset();
      emit.mockReset();
    });

    it('generates cluster correctly', async () => {
      jest.spyOn(EKSClient.prototype, 'send').mockImplementation(eksSendMock);
      const clusters: ListClustersResponse = {
        clusters: ['backstage-test'],
        nextToken: undefined,
      };

      const cluster: DescribeClusterResponse = {
        cluster: {
          name: 'backstage-test',
          arn: 'arn:aws:1',
          endpoint: 'https://backstage.io/kubernetes-api-server',
          certificateAuthority: {
            data: 'cert',
          },
        },
      };
      eksSendMock.mockImplementation(async command => {
        if (command instanceof ListClustersCommand) {
          return clusters;
        }
        if (command instanceof DescribeClusterCommand) {
          return cluster;
        }
        throw new Error(`Unexpected command: ${command.constructor.name}`);
      });

      await processor.readLocation(location, false, emit);

      expect(emit).toHaveBeenCalledWith({
        type: 'entity',
        location,
        entity: {
          apiVersion: 'backstage.io/v1alpha1',
          kind: 'Resource',
          metadata: {
            annotations: {
              'amazonaws.com/account-id': '957140518395',
              'amazonaws.com/arn': cluster.cluster?.arn,
              'kubernetes.io/api-server': cluster.cluster?.endpoint,
              'kubernetes.io/api-server-certificate-authority':
                cluster.cluster?.certificateAuthority?.data,
              'kubernetes.io/auth-provider': 'aws',
              'kubernetes.io/x-k8s-aws-id': 'backstage-test',
            },
            name: 'backstage-test',
            namespace: 'default',
          },
          spec: {
            type: 'kubernetes-cluster',
            owner: 'unknown',
          },
        },
      });
    });
  });
});
