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

// Mock the container module
jest.mock('@google-cloud/container', () => ({
  v1: {
    ClusterManagerClient: jest.fn(),
  },
}));

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

  it('should use configured values for authProvider and owner', async () => {
    const customGkeEntityProvider = GkeEntityProvider.fromConfigWithClient({
      logger: logger as any,
      config: new ConfigReader({
        catalog: {
          providers: {
            gcp: {
              gke: {
                parents: ['projects/parent1/locations/-'],
                authProvider: 'googleServiceAccount',
                owner: 'sre',
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

    clusterManagerClientMock.listClusters.mockImplementation(() => [
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
    ]);
    await customGkeEntityProvider.connect(connectionMock);
    await customGkeEntityProvider.refresh();
    expect(connectionMock.applyMutation).toMatchSnapshot();
  });

  describe('authProvider and owner configuration', () => {
    it('should use default values when authProvider and owner not configured', async () => {
      const defaultGkeEntityProvider = GkeEntityProvider.fromConfigWithClient({
        logger: logger as any,
        config: new ConfigReader({
          catalog: {
            providers: {
              gcp: {
                gke: {
                  parents: ['projects/parent1/locations/-'],
                  schedule: {
                    frequency: { minutes: 3 },
                    timeout: { minutes: 3 },
                  },
                },
              },
            },
          },
        }),
        scheduler: schedulerMock,
        clusterManagerClient: clusterManagerClientMock as any,
      });

      clusterManagerClientMock.listClusters.mockImplementation(() => [
        {
          clusters: [
            {
              name: 'default-cluster',
              endpoint: '127.0.0.1',
              location: 'us-central1',
              selfLink: 'https://127.0.0.1/default-link',
              masterAuth: {
                clusterCaCertificate: 'defaultcert',
              },
            },
          ],
        },
      ]);

      await defaultGkeEntityProvider.connect(connectionMock);
      await defaultGkeEntityProvider.refresh();

      expect(connectionMock.applyMutation).toHaveBeenCalledWith({
        type: 'full',
        entities: [
          {
            entity: expect.objectContaining({
              metadata: expect.objectContaining({
                name: 'default-cluster',
                annotations: expect.objectContaining({
                  'kubernetes.io/auth-provider': 'google', // Default value
                }),
              }),
              spec: expect.objectContaining({
                owner: 'unknown', // Default value
                type: 'kubernetes-cluster',
              }),
            }),
            locationKey: 'gcp-gke:us-central1',
          },
        ],
      });
    });

    it('should use both custom authProvider and owner when configured', async () => {
      const fullyCustomGkeEntityProvider =
        GkeEntityProvider.fromConfigWithClient({
          logger: logger as any,
          config: new ConfigReader({
            catalog: {
              providers: {
                gcp: {
                  gke: {
                    parents: ['projects/parent1/locations/-'],
                    authProvider: 'aws',
                    owner: 'devops-team',
                    schedule: {
                      frequency: { minutes: 3 },
                      timeout: { minutes: 3 },
                    },
                  },
                },
              },
            },
          }),
          scheduler: schedulerMock,
          clusterManagerClient: clusterManagerClientMock as any,
        });

      clusterManagerClientMock.listClusters.mockImplementation(() => [
        {
          clusters: [
            {
              name: 'aws-auth-cluster',
              endpoint: '127.0.0.1',
              location: 'asia-southeast1',
              selfLink: 'https://127.0.0.1/aws-link',
              masterAuth: {
                clusterCaCertificate: 'awscert',
              },
            },
          ],
        },
      ]);

      await fullyCustomGkeEntityProvider.connect(connectionMock);
      await fullyCustomGkeEntityProvider.refresh();

      expect(connectionMock.applyMutation).toHaveBeenCalledWith({
        type: 'full',
        entities: [
          {
            entity: expect.objectContaining({
              metadata: expect.objectContaining({
                name: 'aws-auth-cluster',
                annotations: expect.objectContaining({
                  'kubernetes.io/auth-provider': 'aws',
                }),
              }),
              spec: expect.objectContaining({
                owner: 'devops-team',
                type: 'kubernetes-cluster',
              }),
            }),
            locationKey: 'gcp-gke:asia-southeast1',
          },
        ],
      });
    });

    it('should apply authProvider and owner to multiple clusters', async () => {
      const multiClusterGkeEntityProvider =
        GkeEntityProvider.fromConfigWithClient({
          logger: logger as any,
          config: new ConfigReader({
            catalog: {
              providers: {
                gcp: {
                  gke: {
                    parents: ['projects/parent1/locations/-'],
                    authProvider: 'oidc',
                    owner: 'sre-team',
                    schedule: {
                      frequency: { minutes: 3 },
                      timeout: { minutes: 3 },
                    },
                  },
                },
              },
            },
          }),
          scheduler: schedulerMock,
          clusterManagerClient: clusterManagerClientMock as any,
        });

      clusterManagerClientMock.listClusters.mockImplementation(() => [
        {
          clusters: [
            {
              name: 'cluster-1',
              endpoint: '127.0.0.1',
              location: 'us-central1',
              selfLink: 'https://127.0.0.1/cluster1-link',
              masterAuth: {
                clusterCaCertificate: 'cert1',
              },
            },
            {
              name: 'cluster-2',
              endpoint: '127.0.0.2',
              location: 'us-east1',
              selfLink: 'https://127.0.0.2/cluster2-link',
              masterAuth: {
                clusterCaCertificate: 'cert2',
              },
            },
          ],
        },
      ]);

      await multiClusterGkeEntityProvider.connect(connectionMock);
      await multiClusterGkeEntityProvider.refresh();

      expect(connectionMock.applyMutation).toHaveBeenCalledWith({
        type: 'full',
        entities: [
          {
            entity: expect.objectContaining({
              metadata: expect.objectContaining({
                name: 'cluster-1',
                annotations: expect.objectContaining({
                  'kubernetes.io/auth-provider': 'oidc',
                }),
              }),
              spec: expect.objectContaining({
                owner: 'sre-team',
                type: 'kubernetes-cluster',
              }),
            }),
            locationKey: 'gcp-gke:us-central1',
          },
          {
            entity: expect.objectContaining({
              metadata: expect.objectContaining({
                name: 'cluster-2',
                annotations: expect.objectContaining({
                  'kubernetes.io/auth-provider': 'oidc',
                }),
              }),
              spec: expect.objectContaining({
                owner: 'sre-team',
                type: 'kubernetes-cluster',
              }),
            }),
            locationKey: 'gcp-gke:us-east1',
          },
        ],
      });
    });
  });

  it('should log GKE API errors', async () => {
    clusterManagerClientMock.listClusters.mockRejectedValue(
      new Error('some-error'),
    );
    await gkeEntityProvider.refresh();
    expect(connectionMock.applyMutation).toHaveBeenCalledTimes(0);
    expect(logger.error).toHaveBeenCalledTimes(1);
  });

  describe('credentials support', () => {
    const MockedClusterManagerClient = container.v1
      .ClusterManagerClient as jest.MockedClass<
      typeof container.v1.ClusterManagerClient
    >;

    beforeEach(() => {
      jest.resetAllMocks();
      MockedClusterManagerClient.mockClear();
      schedulerMock.createScheduledTaskRunner.mockReturnValue(taskRunner);
    });

    it('should use credentials from config when provided', () => {
      const mockCredentials = {
        type: 'service_account',
        project_id: 'test-project',
        private_key_id: 'key-id',
        private_key:
          '-----BEGIN PRIVATE KEY-----\ntest-key\n-----END PRIVATE KEY-----\n',
        client_email: 'test@test-project.iam.gserviceaccount.com',
        client_id: 'client-id',
        auth_uri: 'https://accounts.google.com/o/oauth2/auth',
        token_uri: 'https://oauth2.googleapis.com/token',
        auth_provider_x509_cert_url:
          'https://www.googleapis.com/oauth2/v1/certs',
        client_x509_cert_url:
          'https://www.googleapis.com/robot/v1/metadata/x509/test%40test-project.iam.gserviceaccount.com',
      };

      GkeEntityProvider.fromConfig({
        logger: logger as any,
        config: new ConfigReader({
          catalog: {
            providers: {
              gcp: {
                gke: {
                  parents: ['projects/test-project/locations/-'],
                  schedule: {
                    frequency: { minutes: 30 },
                    timeout: { minutes: 3 },
                  },
                  googleServiceAccountCredentials:
                    JSON.stringify(mockCredentials),
                },
              },
            },
          },
        }),
        scheduler: schedulerMock,
      });

      expect(MockedClusterManagerClient).toHaveBeenCalledWith({
        credentials: mockCredentials,
      });
    });

    it('should fall back to default credentials when no credentials provided', () => {
      GkeEntityProvider.fromConfig({
        logger: logger as any,
        config: new ConfigReader({
          catalog: {
            providers: {
              gcp: {
                gke: {
                  parents: ['projects/test-project/locations/-'],
                  schedule: {
                    frequency: { minutes: 30 },
                    timeout: { minutes: 3 },
                  },
                  // No googleServiceAccountCredentials provided
                },
              },
            },
          },
        }),
        scheduler: schedulerMock,
      });

      expect(MockedClusterManagerClient).toHaveBeenCalledWith();
    });

    it('should throw error for invalid JSON credentials', () => {
      expect(() => {
        GkeEntityProvider.fromConfig({
          logger: logger as any,
          config: new ConfigReader({
            catalog: {
              providers: {
                gcp: {
                  gke: {
                    parents: ['projects/test-project/locations/-'],
                    schedule: {
                      frequency: { minutes: 30 },
                      timeout: { minutes: 3 },
                    },
                    googleServiceAccountCredentials: 'invalid-json',
                  },
                },
              },
            },
          }),
          scheduler: schedulerMock,
        });
      }).toThrow(
        'Failed to parse Google Service Account credentials from config:',
      );
    });

    it('should throw error for malformed JSON credentials', () => {
      expect(() => {
        GkeEntityProvider.fromConfig({
          logger: logger as any,
          config: new ConfigReader({
            catalog: {
              providers: {
                gcp: {
                  gke: {
                    parents: ['projects/test-project/locations/-'],
                    schedule: {
                      frequency: { minutes: 30 },
                      timeout: { minutes: 3 },
                    },
                    googleServiceAccountCredentials: '{"incomplete": "json"',
                  },
                },
              },
            },
          }),
          scheduler: schedulerMock,
        });
      }).toThrow(
        'Failed to parse Google Service Account credentials from config:',
      );
    });

    it('should handle undefined credentials as fallback to default', () => {
      GkeEntityProvider.fromConfig({
        logger: logger as any,
        config: new ConfigReader({
          catalog: {
            providers: {
              gcp: {
                gke: {
                  parents: ['projects/test-project/locations/-'],
                  schedule: {
                    frequency: { minutes: 30 },
                    timeout: { minutes: 3 },
                  },
                  // googleServiceAccountCredentials is undefined
                },
              },
            },
          },
        }),
        scheduler: schedulerMock,
      });

      expect(MockedClusterManagerClient).toHaveBeenCalledWith();
    });

    it('should read authProvider and owner from config', () => {
      const provider = GkeEntityProvider.fromConfig({
        logger: logger as any,
        config: new ConfigReader({
          catalog: {
            providers: {
              gcp: {
                gke: {
                  parents: ['projects/test-project/locations/-'],
                  schedule: {
                    frequency: { minutes: 30 },
                    timeout: { minutes: 3 },
                  },
                  authProvider: 'googleServiceAccount',
                  owner: 'platform-team',
                },
              },
            },
          },
        }),
        scheduler: schedulerMock,
      });

      expect(provider).toBeDefined();
      expect(MockedClusterManagerClient).toHaveBeenCalledWith();
    });
  });
});
