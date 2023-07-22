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

import { getVoidLogger } from '@backstage/backend-common';
import { GkeEntityProvider } from './GkeEntityProvider';
import { TaskRunner } from '@backstage/backend-tasks';
import {
  ANNOTATION_KUBERNETES_API_SERVER,
  ANNOTATION_KUBERNETES_API_SERVER_CA,
  ANNOTATION_KUBERNETES_AUTH_PROVIDER,
} from '@backstage/plugin-kubernetes-common';

describe('GkeEntityProvider', () => {
  const clusterClientMock = {
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
  const logger = getVoidLogger();
  const gkeEntityProvider = new GkeEntityProvider(
    logger,
    taskRunner,
    ['parent1', 'parent2'],
    clusterClientMock as any,
  );

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should return clusters as Resources', async () => {
    clusterClientMock.listClusters.mockImplementation(req => {
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
    await gkeEntityProvider.connect(connectionMock);
    await gkeEntityProvider.refresh();
    expect(connectionMock.applyMutation).toHaveBeenCalledWith({
      type: 'full',
      entities: [
        {
          locationKey: 'url:http://127.0.0.1/some-link',
          entity: {
            apiVersion: 'backstage.io/v1alpha1',
            kind: 'Resource',
            metadata: {
              annotations: {
                [ANNOTATION_KUBERNETES_API_SERVER]: 'http://127.0.0.1:1234',
                [ANNOTATION_KUBERNETES_API_SERVER_CA]: 'abcdefg',
                [ANNOTATION_KUBERNETES_AUTH_PROVIDER]: 'google',
                'backstage.io/managed-by-location':
                  'url:http://127.0.0.1/some-link',
                'backstage.io/managed-by-origin-location':
                  'url:http://127.0.0.1/some-link',
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
          locationKey: 'url:http://127.0.0.1/some-other-link',
          entity: {
            apiVersion: 'backstage.io/v1alpha1',
            kind: 'Resource',
            metadata: {
              annotations: {
                [ANNOTATION_KUBERNETES_API_SERVER]: 'http://127.0.0.1:5678',
                [ANNOTATION_KUBERNETES_API_SERVER_CA]: '',
                [ANNOTATION_KUBERNETES_AUTH_PROVIDER]: 'google',
                'backstage.io/managed-by-location':
                  'url:http://127.0.0.1/some-other-link',
                'backstage.io/managed-by-origin-location':
                  'url:http://127.0.0.1/some-other-link',
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
  it('should ignore partial clusters', async () => {
    clusterClientMock.listClusters.mockImplementation(req => {
      if (req.parent === 'parent1') {
        return [
          {
            clusters: [
              {
                // No name
                endpoint: 'http://127.0.0.1:1234',
                location: 'some-location',
                selfLink: 'http://127.0.0.1/some-link',
                masterAuth: {
                  clusterCaCertificate: 'abcdefg',
                },
              },
              {
                // no selfLink
                name: 'some-name',
                endpoint: 'http://127.0.0.1:1234',
                location: 'some-location',
                masterAuth: {
                  clusterCaCertificate: 'abcdefg',
                },
              },
              {
                // no endpoint
                name: 'some-name',
                location: 'some-location',
                selfLink: 'http://127.0.0.1/some-link',
                masterAuth: {
                  clusterCaCertificate: 'abcdefg',
                },
              },
              {
                // no location
                name: 'some-name',
                endpoint: 'http://127.0.0.1:1234',
                selfLink: 'http://127.0.0.1/some-link',
                masterAuth: {
                  clusterCaCertificate: 'abcdefg',
                },
              },
            ],
          },
        ];
      }
      return [
        {
          clusters: [],
        },
      ];
    });
    await gkeEntityProvider.connect(connectionMock);
    await gkeEntityProvider.refresh();
    expect(connectionMock.applyMutation).toHaveBeenCalledWith({
      type: 'full',
      entities: [],
    });
  });
  it('should handle GKE API errors', async () => {
    clusterClientMock.listClusters.mockRejectedValue(new Error('some-error'));
    await gkeEntityProvider.connect(connectionMock);
    await gkeEntityProvider.refresh();
    expect(connectionMock.applyMutation).toHaveBeenCalledTimes(0);
  });
});
