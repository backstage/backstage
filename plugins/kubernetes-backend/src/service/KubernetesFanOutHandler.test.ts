/*
 * Copyright 2020 The Backstage Authors
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
import { ClusterDetails, ObjectFetchParams } from '../types/types';
import { KubernetesFanOutHandler } from './KubernetesFanOutHandler';
import { PodStatus } from '@kubernetes/client-node/dist/top';

const fetchObjectsForService = jest.fn();
const fetchPodMetricsByNamespace = jest.fn();

const getClustersByEntity = jest.fn();

const POD_METRICS_FIXTURE = {
  containers: [],
  cpu: {
    currentUsage: 100,
    limitTotal: 102,
    requestTotal: 101,
  },
  memory: {
    currentUsage: '1000',
    limitTotal: '1002',
    requestTotal: '1001',
  },
  pod: {},
};

const mockFetch = (mock: jest.Mock) => {
  mock.mockImplementation((params: ObjectFetchParams) =>
    Promise.resolve(
      generateMockResourcesAndErrors(
        params.serviceId,
        params.clusterDetails.name,
      ),
    ),
  );
};

const mockMetrics = (mock: jest.Mock) => {
  mock.mockImplementation((clusterDetails: ClusterDetails, namespace: string) =>
    Promise.resolve(generatePodStatus(clusterDetails.name, namespace)),
  );
};

function generatePodStatus(
  _clusterName: string,
  _namespace: string,
): PodStatus[] {
  return [
    {
      Pod: {},
      CPU: {
        CurrentUsage: 100,
        RequestTotal: 101,
        LimitTotal: 102,
      },
      Memory: {
        CurrentUsage: BigInt('1000'),
        RequestTotal: BigInt('1001'),
        LimitTotal: BigInt('1002'),
      },
      Containers: [],
    },
  ] as any;
}

function generateMockResourcesAndErrors(
  serviceId: string,
  clusterName: string,
) {
  if (clusterName === 'empty-cluster') {
    return {
      errors: [],
      responses: [
        {
          type: 'pods',
          resources: [],
        },
        {
          type: 'configmaps',
          resources: [],
        },
        {
          type: 'services',
          resources: [],
        },
      ],
    };
  } else if (clusterName === 'error-cluster') {
    return {
      errors: ['some random cluster error'],
      responses: [
        {
          type: 'pods',
          resources: [],
        },
        {
          type: 'configmaps',
          resources: [],
        },
        {
          type: 'services',
          resources: [],
        },
      ],
    };
  }

  return {
    errors: [],
    responses: [
      {
        type: 'pods',
        resources: [
          {
            metadata: {
              name: `my-pods-${serviceId}-${clusterName}`,
              namespace: `ns-${serviceId}-${clusterName}`,
            },
          },
        ],
      },
      {
        type: 'configmaps',
        resources: [
          {
            metadata: {
              name: `my-configmaps-${serviceId}-${clusterName}`,
              namespace: `ns-${serviceId}-${clusterName}`,
            },
          },
        ],
      },
      {
        type: 'services',
        resources: [
          {
            metadata: {
              name: `my-services-${serviceId}-${clusterName}`,
              namespace: `ns-${serviceId}-${clusterName}`,
            },
          },
        ],
      },
    ],
  };
}

describe('handleGetKubernetesObjectsForService', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('retrieve objects for one cluster', async () => {
    getClustersByEntity.mockImplementation(() =>
      Promise.resolve({
        clusters: [
          {
            name: 'test-cluster',
            authProvider: 'serviceAccount',
          },
        ],
      }),
    );

    mockFetch(fetchObjectsForService);
    mockMetrics(fetchPodMetricsByNamespace);

    const sut = new KubernetesFanOutHandler({
      logger: getVoidLogger(),
      fetcher: {
        fetchObjectsForService,
        fetchPodMetricsByNamespace,
      },
      serviceLocator: {
        getClustersByEntity,
      },
      customResources: [],
    });

    const result = await sut.getKubernetesObjectsByEntity({
      entity: {
        apiVersion: 'backstage.io/v1beta1',
        kind: 'Component',
        metadata: {
          name: 'test-component',
          annotations: {
            'backstage.io/kubernetes-labels-selector':
              'backstage.io/test-label=test-component',
          },
        },
        spec: {
          type: 'service',
          lifecycle: 'production',
          owner: 'joe',
        },
      },
      auth: {},
    });

    expect(getClustersByEntity.mock.calls.length).toBe(1);
    expect(fetchObjectsForService.mock.calls.length).toBe(1);
    expect(fetchPodMetricsByNamespace.mock.calls.length).toBe(1);
    expect(fetchPodMetricsByNamespace.mock.calls[0][1]).toBe(
      'ns-test-component-test-cluster',
    );

    expect(result).toStrictEqual({
      items: [
        {
          cluster: {
            name: 'test-cluster',
          },
          errors: [],
          podMetrics: [POD_METRICS_FIXTURE],
          resources: [
            {
              resources: [
                {
                  metadata: {
                    name: 'my-pods-test-component-test-cluster',
                    namespace: 'ns-test-component-test-cluster',
                  },
                },
              ],
              type: 'pods',
            },
            {
              resources: [
                {
                  metadata: {
                    name: 'my-configmaps-test-component-test-cluster',
                    namespace: 'ns-test-component-test-cluster',
                  },
                },
              ],
              type: 'configmaps',
            },
            {
              resources: [
                {
                  metadata: {
                    name: 'my-services-test-component-test-cluster',
                    namespace: 'ns-test-component-test-cluster',
                  },
                },
              ],
              type: 'services',
            },
          ],
        },
      ],
    });
  });

  it('dont call top for the same namespace twice', async () => {
    getClustersByEntity.mockImplementation(() =>
      Promise.resolve({
        clusters: [
          {
            name: 'test-cluster',
            authProvider: 'serviceAccount',
          },
        ],
      }),
    );

    fetchObjectsForService.mockImplementation((_: ObjectFetchParams) =>
      Promise.resolve({
        errors: [],
        responses: [
          {
            type: 'pods',
            resources: [
              {
                metadata: {
                  name: `pod1`,
                  namespace: `ns-a`,
                },
              },
              {
                metadata: {
                  name: `pod2`,
                  namespace: `ns-a`,
                },
              },
              {
                metadata: {
                  name: `pod3`,
                  namespace: `ns-b`,
                },
              },
            ],
          },
        ],
      }),
    );

    mockMetrics(fetchPodMetricsByNamespace);

    const sut = new KubernetesFanOutHandler({
      logger: getVoidLogger(),
      fetcher: {
        fetchObjectsForService,
        fetchPodMetricsByNamespace,
      },
      serviceLocator: {
        getClustersByEntity,
      },
      customResources: [],
    });

    const result = await sut.getKubernetesObjectsByEntity({
      entity: {
        apiVersion: 'backstage.io/v1beta1',
        kind: 'Component',
        metadata: {
          name: 'test-component',
          annotations: {
            'backstage.io/kubernetes-labels-selector':
              'backstage.io/test-label=test-component',
          },
        },
        spec: {
          type: 'service',
          lifecycle: 'production',
          owner: 'joe',
        },
      },
      auth: {},
    });

    expect(getClustersByEntity.mock.calls.length).toBe(1);
    expect(fetchObjectsForService.mock.calls.length).toBe(1);
    expect(fetchPodMetricsByNamespace.mock.calls.length).toBe(2);
    expect(fetchPodMetricsByNamespace.mock.calls[0][1]).toBe('ns-a');
    expect(fetchPodMetricsByNamespace.mock.calls[1][1]).toBe('ns-b');

    expect(result).toStrictEqual({
      items: [
        {
          cluster: {
            name: 'test-cluster',
          },
          errors: [],
          podMetrics: [POD_METRICS_FIXTURE, POD_METRICS_FIXTURE],
          resources: [
            {
              resources: [
                {
                  metadata: {
                    name: 'pod1',
                    namespace: 'ns-a',
                  },
                },
                {
                  metadata: {
                    name: 'pod2',
                    namespace: 'ns-a',
                  },
                },
                {
                  metadata: {
                    name: 'pod3',
                    namespace: 'ns-b',
                  },
                },
              ],
              type: 'pods',
            },
          ],
        },
      ],
    });
  });

  it('retrieve objects for two clusters', async () => {
    getClustersByEntity.mockImplementation(() =>
      Promise.resolve({
        clusters: [
          {
            name: 'test-cluster',
            authProvider: 'serviceAccount',
            dashboardUrl: 'https://k8s.foo.coom',
          },
          {
            name: 'other-cluster',
            authProvider: 'google',
          },
        ],
      }),
    );

    mockFetch(fetchObjectsForService);
    mockMetrics(fetchPodMetricsByNamespace);

    const sut = new KubernetesFanOutHandler({
      logger: getVoidLogger(),
      fetcher: {
        fetchObjectsForService,
        fetchPodMetricsByNamespace,
      },
      serviceLocator: {
        getClustersByEntity,
      },
      customResources: [],
    });

    const result = await sut.getKubernetesObjectsByEntity({
      entity: {
        apiVersion: 'backstage.io/v1beta1',
        kind: 'Component',
        metadata: {
          name: 'test-component',
          annotations: {
            'backstage.io/kubernetes-labels-selector':
              'backstage.io/test-label=test-component',
          },
        },
        spec: {
          type: 'service',
          lifecycle: 'production',
          owner: 'joe',
        },
      },
      auth: {
        google: 'google_token_123',
      },
    });

    expect(getClustersByEntity.mock.calls.length).toBe(1);
    expect(fetchObjectsForService.mock.calls.length).toBe(2);
    expect(result).toStrictEqual({
      items: [
        {
          cluster: {
            dashboardUrl: 'https://k8s.foo.coom',
            name: 'test-cluster',
          },
          errors: [],
          podMetrics: [POD_METRICS_FIXTURE],
          resources: [
            {
              resources: [
                {
                  metadata: {
                    name: 'my-pods-test-component-test-cluster',
                    namespace: 'ns-test-component-test-cluster',
                  },
                },
              ],
              type: 'pods',
            },
            {
              resources: [
                {
                  metadata: {
                    name: 'my-configmaps-test-component-test-cluster',
                    namespace: 'ns-test-component-test-cluster',
                  },
                },
              ],
              type: 'configmaps',
            },
            {
              resources: [
                {
                  metadata: {
                    name: 'my-services-test-component-test-cluster',
                    namespace: 'ns-test-component-test-cluster',
                  },
                },
              ],
              type: 'services',
            },
          ],
        },
        {
          cluster: {
            name: 'other-cluster',
          },
          errors: [],
          podMetrics: [POD_METRICS_FIXTURE],
          resources: [
            {
              resources: [
                {
                  metadata: {
                    name: 'my-pods-test-component-other-cluster',
                    namespace: 'ns-test-component-other-cluster',
                  },
                },
              ],
              type: 'pods',
            },
            {
              resources: [
                {
                  metadata: {
                    name: 'my-configmaps-test-component-other-cluster',
                    namespace: 'ns-test-component-other-cluster',
                  },
                },
              ],
              type: 'configmaps',
            },
            {
              resources: [
                {
                  metadata: {
                    name: 'my-services-test-component-other-cluster',
                    namespace: 'ns-test-component-other-cluster',
                  },
                },
              ],
              type: 'services',
            },
          ],
        },
      ],
    });
  });
  it('retrieve objects for three clusters, only two have resources and show in ui', async () => {
    getClustersByEntity.mockImplementation(() =>
      Promise.resolve({
        clusters: [
          {
            name: 'test-cluster',
            authProvider: 'serviceAccount',
          },
          {
            name: 'other-cluster',
            authProvider: 'google',
          },
          {
            name: 'empty-cluster',
            authProvider: 'google',
          },
        ],
      }),
    );

    mockFetch(fetchObjectsForService);
    mockMetrics(fetchPodMetricsByNamespace);

    const sut = new KubernetesFanOutHandler({
      logger: getVoidLogger(),
      fetcher: {
        fetchObjectsForService,
        fetchPodMetricsByNamespace,
      },
      serviceLocator: {
        getClustersByEntity,
      },
      customResources: [],
    });

    const result = await sut.getKubernetesObjectsByEntity({
      entity: {
        apiVersion: 'backstage.io/v1beta1',
        kind: 'Component',
        metadata: {
          name: 'test-component',
          annotations: {
            'backstage.io/kubernetes-labels-selector':
              'backstage.io/test-label=test-component',
          },
        },
        spec: {
          type: 'service',
          lifecycle: 'production',
          owner: 'joe',
        },
      },
      auth: {
        google: 'google_token_123',
      },
    });

    expect(getClustersByEntity.mock.calls.length).toBe(1);
    expect(fetchObjectsForService.mock.calls.length).toBe(3);
    expect(result).toStrictEqual({
      items: [
        {
          cluster: {
            name: 'test-cluster',
          },
          errors: [],
          podMetrics: [POD_METRICS_FIXTURE],
          resources: [
            {
              resources: [
                {
                  metadata: {
                    name: 'my-pods-test-component-test-cluster',
                    namespace: 'ns-test-component-test-cluster',
                  },
                },
              ],
              type: 'pods',
            },
            {
              resources: [
                {
                  metadata: {
                    name: 'my-configmaps-test-component-test-cluster',
                    namespace: 'ns-test-component-test-cluster',
                  },
                },
              ],
              type: 'configmaps',
            },
            {
              resources: [
                {
                  metadata: {
                    name: 'my-services-test-component-test-cluster',
                    namespace: 'ns-test-component-test-cluster',
                  },
                },
              ],
              type: 'services',
            },
          ],
        },
        {
          cluster: {
            name: 'other-cluster',
          },
          errors: [],
          podMetrics: [POD_METRICS_FIXTURE],
          resources: [
            {
              resources: [
                {
                  metadata: {
                    name: 'my-pods-test-component-other-cluster',
                    namespace: 'ns-test-component-other-cluster',
                  },
                },
              ],
              type: 'pods',
            },
            {
              resources: [
                {
                  metadata: {
                    name: 'my-configmaps-test-component-other-cluster',
                    namespace: 'ns-test-component-other-cluster',
                  },
                },
              ],
              type: 'configmaps',
            },
            {
              resources: [
                {
                  metadata: {
                    name: 'my-services-test-component-other-cluster',
                    namespace: 'ns-test-component-other-cluster',
                  },
                },
              ],
              type: 'services',
            },
          ],
        },
      ],
    });
  });
  it('retrieve objects for four clusters, two have resources and one error cluster', async () => {
    getClustersByEntity.mockImplementation(() =>
      Promise.resolve({
        clusters: [
          {
            name: 'test-cluster',
            authProvider: 'serviceAccount',
          },
          {
            name: 'other-cluster',
            authProvider: 'google',
          },
          {
            name: 'empty-cluster',
            authProvider: 'google',
          },
          {
            name: 'error-cluster',
            authProvider: 'google',
          },
        ],
      }),
    );

    mockFetch(fetchObjectsForService);
    mockMetrics(fetchPodMetricsByNamespace);

    const sut = new KubernetesFanOutHandler({
      logger: getVoidLogger(),
      fetcher: {
        fetchObjectsForService,
        fetchPodMetricsByNamespace,
      },
      serviceLocator: {
        getClustersByEntity,
      },
      customResources: [],
    });

    const result = await sut.getKubernetesObjectsByEntity({
      entity: {
        apiVersion: 'backstage.io/v1beta1',
        kind: 'Component',
        metadata: {
          name: 'test-component',
          annotations: {
            'backstage.io/kubernetes-labels-selector':
              'backstage.io/test-label=test-component',
          },
        },
        spec: {
          type: 'service',
          lifecycle: 'production',
          owner: 'joe',
        },
      },
      auth: {
        google: 'google_token_123',
      },
    });

    expect(getClustersByEntity.mock.calls.length).toBe(1);
    expect(fetchObjectsForService.mock.calls.length).toBe(4);
    expect(result).toStrictEqual({
      items: [
        {
          cluster: {
            name: 'test-cluster',
          },
          errors: [],
          podMetrics: [POD_METRICS_FIXTURE],
          resources: [
            {
              resources: [
                {
                  metadata: {
                    name: 'my-pods-test-component-test-cluster',
                    namespace: 'ns-test-component-test-cluster',
                  },
                },
              ],
              type: 'pods',
            },
            {
              resources: [
                {
                  metadata: {
                    name: 'my-configmaps-test-component-test-cluster',
                    namespace: 'ns-test-component-test-cluster',
                  },
                },
              ],
              type: 'configmaps',
            },
            {
              resources: [
                {
                  metadata: {
                    name: 'my-services-test-component-test-cluster',
                    namespace: 'ns-test-component-test-cluster',
                  },
                },
              ],
              type: 'services',
            },
          ],
        },
        {
          cluster: {
            name: 'other-cluster',
          },
          errors: [],
          podMetrics: [POD_METRICS_FIXTURE],
          resources: [
            {
              resources: [
                {
                  metadata: {
                    name: 'my-pods-test-component-other-cluster',
                    namespace: 'ns-test-component-other-cluster',
                  },
                },
              ],
              type: 'pods',
            },
            {
              resources: [
                {
                  metadata: {
                    name: 'my-configmaps-test-component-other-cluster',
                    namespace: 'ns-test-component-other-cluster',
                  },
                },
              ],
              type: 'configmaps',
            },
            {
              resources: [
                {
                  metadata: {
                    name: 'my-services-test-component-other-cluster',
                    namespace: 'ns-test-component-other-cluster',
                  },
                },
              ],
              type: 'services',
            },
          ],
        },
        {
          cluster: {
            name: 'error-cluster',
          },
          errors: ['some random cluster error'],
          podMetrics: [],
          resources: [
            {
              type: 'pods',
              resources: [],
            },
            {
              type: 'configmaps',
              resources: [],
            },
            {
              type: 'services',
              resources: [],
            },
          ],
        },
      ],
    });
  });
});
