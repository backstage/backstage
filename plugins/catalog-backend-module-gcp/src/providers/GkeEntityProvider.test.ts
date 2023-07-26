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

import { SchedulerService } from '@backstage/backend-plugin-api';
import { GkeEntityProvider } from './GkeEntityProvider';
import { TaskRunner } from '@backstage/backend-tasks';
import {
  ANNOTATION_KUBERNETES_API_SERVER,
  ANNOTATION_KUBERNETES_API_SERVER_CA,
  ANNOTATION_KUBERNETES_AUTH_PROVIDER,
} from '@backstage/plugin-kubernetes-common';
import * as container from '@google-cloud/container';
import { Config, ConfigReader } from '@backstage/config';

describe('GkeEntityProvider', () => {
  const clusterManagerClientMock = {
    listClusters: jest.fn(),
  };
  const connectionMock = {
    applyMutation: jest.fn(),
    refresh: jest.fn(),
  };
  const taskRunner = {
    createScheduleFn: jest.fn(),
    run: jest.fn(),
  } as TaskRunner;
  const schedulerMock = {
    createScheduledTaskRunner: jest.fn(),
  } as any;
  const logger = {
    info: jest.fn(),
    error: jest.fn(),
  };
  let gkeEntityProvider: GkeEntityProvider;

  beforeEach(async () => {
    jest.resetAllMocks();
    schedulerMock.createScheduledTaskRunner.mockReturnValue(taskRunner);
    gkeEntityProvider = GkeEntityProvider.fromConfigWithClient({
      logger: logger as any,
      config: new ConfigReader({
        catalog: {
          providers: {
            gcp: {
              gke: {
                parents: ['parent1', 'parent2'],
                schedule: {
                  frequency: {
                    minutes: 3,
                  },
                  timeout: {
                    minutes: 3,
                  },
                },
              },
            },
          },
        },
      }),
      scheduler: schedulerMock,
      clusterManagerClient: clusterManagerClientMock as any,
    });
    await gkeEntityProvider.connect(connectionMock);
  });

  it('should return clusters as Resources', async () => {
    clusterManagerClientMock.listClusters.mockImplementation(req => {
      if (req.parent === 'parent1') {
        return [
          {
            clusters: [
              {
                name: 'some-cluster',
                endpoint: 'http://127.0.0.1:1234',
                location: 'some-location',
                selfLink: 'http://127.0.0.1/some-link',
                masterAuth: {
                  clusterCaCertificate: 'abcdefg',
                },
              },
            ],
          },
        ];
      } else if (req.parent === 'parent2') {
        return [
          {
            clusters: [
              {
                name: 'some-other-cluster',
                endpoint: 'http://127.0.0.1:5678',
                location: 'some-other-location',
                selfLink: 'http://127.0.0.1/some-other-link',
                masterAuth: {
                  // no CA cert is ok
                },
              },
            ],
          },
        ];
      }

      throw new Error(`unexpected parent ${req.parent}`);
    });
    await gkeEntityProvider.refresh();
    expect(connectionMock.applyMutation).toHaveBeenCalledWith({
      type: 'full',
      entities: [
        {
          locationKey: 'gcp-gke:some-location',
          entity: {
            apiVersion: 'backstage.io/v1alpha1',
            kind: 'Resource',
            metadata: {
              annotations: {
                [ANNOTATION_KUBERNETES_API_SERVER]: 'http://127.0.0.1:1234',
                [ANNOTATION_KUBERNETES_API_SERVER_CA]: 'abcdefg',
                [ANNOTATION_KUBERNETES_AUTH_PROVIDER]: 'google',
                'backstage.io/managed-by-location': 'gcp-gke:some-location',
                'backstage.io/managed-by-origin-location':
                  'gcp-gke:some-location',
              },
              name: 'some-cluster',
              namespace: 'default',
            },
            spec: {
              type: 'kubernetes-cluster',
              owner: 'unknown',
            },
          },
        },
        {
          locationKey: 'gcp-gke:some-other-location',
          entity: {
            apiVersion: 'backstage.io/v1alpha1',
            kind: 'Resource',
            metadata: {
              annotations: {
                [ANNOTATION_KUBERNETES_API_SERVER]: 'http://127.0.0.1:5678',
                [ANNOTATION_KUBERNETES_API_SERVER_CA]: '',
                [ANNOTATION_KUBERNETES_AUTH_PROVIDER]: 'google',
                'backstage.io/managed-by-location':
                  'gcp-gke:some-other-location',
                'backstage.io/managed-by-origin-location':
                  'gcp-gke:some-other-location',
              },
              name: 'some-other-cluster',
              namespace: 'default',
            },
            spec: {
              type: 'kubernetes-cluster',
              owner: 'unknown',
            },
          },
        },
      ],
    });
  });

  const ignoredPartialClustersTests: [
    string,
    container.protos.google.container.v1.ICluster,
  ][] = [
    [
      'no-cluster-name',
      {
        endpoint: 'http://127.0.0.1:1234',
        location: 'some-location',
        selfLink: 'http://127.0.0.1/some-link',
        masterAuth: {
          clusterCaCertificate: 'abcdefg',
        },
      },
    ],
    [
      'no-self-link',
      {
        // no selfLink
        name: 'some-name',
        endpoint: 'http://127.0.0.1:1234',
        location: 'some-location',
        masterAuth: {
          clusterCaCertificate: 'abcdefg',
        },
      },
    ],
    [
      'no-endpoint',
      {
        name: 'some-name',
        location: 'some-location',
        selfLink: 'http://127.0.0.1/some-link',
        masterAuth: {
          clusterCaCertificate: 'abcdefg',
        },
      },
    ],
    [
      'no-location',
      {
        name: 'some-name',
        endpoint: 'http://127.0.0.1:1234',
        selfLink: 'http://127.0.0.1/some-link',
        masterAuth: {
          clusterCaCertificate: 'abcdefg',
        },
      },
    ],
  ];

  it.each(ignoredPartialClustersTests)(
    'ignore cluster - %s',
    async (_name, ignoredCluster) => {
      clusterManagerClientMock.listClusters.mockImplementation(req => {
        if (req.parent === 'parent1') {
          return [ignoredCluster];
        }
        return [
          {
            clusters: [],
          },
        ];
      });
      await gkeEntityProvider.refresh();
      expect(connectionMock.applyMutation).toHaveBeenCalledWith({
        type: 'full',
        entities: [],
      });
    },
  );

  it('should log GKE API errors', async () => {
    clusterManagerClientMock.listClusters.mockRejectedValue(
      new Error('some-error'),
    );
    await gkeEntityProvider.refresh();
    expect(connectionMock.applyMutation).toHaveBeenCalledTimes(0);
    expect(logger.error).toHaveBeenCalledTimes(1);
  });
});
