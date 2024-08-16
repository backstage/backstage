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

import { GkeEntityProvider } from './GkeEntityProvider';
import { SchedulerServiceTaskRunner } from '@backstage/backend-plugin-api';
import * as container from '@google-cloud/container';
import { ConfigReader } from '@backstage/config';

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
  } as SchedulerServiceTaskRunner;
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
                parents: [
                  'projects/parent1/locations/-',
                  'projects/parent2/locations/some-other-location',
                ],
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
      if (req.parent === 'projects/parent1/locations/-') {
        return [
          {
            clusters: [
              {
                name: 'some-cluster',
                endpoint: '127.0.0.1',
                location: 'some-location',
                selfLink: 'https://127.0.0.1/some-link',
                masterAuth: {
                  clusterCaCertificate: 'abcdefg',
                },
              },
            ],
          },
        ];
      } else if (
        req.parent === 'projects/parent2/locations/some-other-location'
      ) {
        return [
          {
            clusters: [
              {
                name: 'some-other-cluster',
                endpoint: '127.0.0.1',
                location: 'some-other-location',
                selfLink: 'https://127.0.0.1/some-other-link',
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
    expect(connectionMock.applyMutation).toMatchSnapshot();
  });

  const ignoredPartialClustersTests: [
    string,
    container.protos.google.container.v1.ICluster,
  ][] = [
    [
      'no-cluster-name',
      {
        endpoint: '127.0.0.1',
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
        endpoint: '127.0.0.1',
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
        endpoint: '127.0.0.1',
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
        if (req.parent === 'projects/parent1/locations/-') {
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
