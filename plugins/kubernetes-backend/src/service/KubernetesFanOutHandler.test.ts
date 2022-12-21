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
import {
  ClusterDetails,
  CustomResource,
  FetchResponseWrapper,
  ObjectFetchParams,
  KubernetesServiceLocator,
} from '../types/types';
import { KubernetesFanOutHandler } from './KubernetesFanOutHandler';
import { KubernetesClientBasedFetcher } from './KubernetesFetcher';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { setupRequestMockHandlers } from '@backstage/backend-test-utils';
import { ObjectsByEntityResponse } from '@backstage/plugin-kubernetes-common';

const fetchObjectsForService = jest.fn();
const fetchPodMetricsByNamespaces = jest.fn();

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
  mock.mockImplementation(
    (clusterDetails: ClusterDetails, namespaces: Set<string>) =>
      Promise.resolve(generatePodStatus(clusterDetails.name, namespaces)),
  );
};

const entity = {
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
};

const cluster1 = {
  name: 'test-cluster',
  authProvider: 'serviceAccount',
  customResources: [
    {
      group: 'some-other-crd.example.com',
      apiVersion: 'v1alpha1',
      plural: 'some-crd-only-on-this-cluster',
    },
  ],
};

const cluster2 = {
  name: 'cluster-two',
  authProvider: 'serviceAccount',
  customResources: [
    {
      group: 'crd-two.example.com',
      apiVersion: 'v1alpha1',
      plural: 'crd-two-plural',
    },
  ],
};

function resourcesByCluster(clusterName: string) {
  return [
    {
      resources: [
        {
          metadata: {
            name: `my-pods-test-component-${clusterName}`,
            namespace: `ns-test-component-${clusterName}`,
          },
        },
      ],
      type: 'pods',
    },
    {
      resources: [
        {
          metadata: {
            name: `my-configmaps-test-component-${clusterName}`,
            namespace: `ns-test-component-${clusterName}`,
          },
        },
      ],
      type: 'configmaps',
    },
    {
      resources: [
        {
          metadata: {
            name: `my-services-test-component-${clusterName}`,
            namespace: `ns-test-component-${clusterName}`,
          },
        },
      ],
      type: 'services',
    },
  ];
}

function mockFetchAndGetKubernetesFanOutHandler(
  customResources: CustomResource[],
) {
  mockFetch(fetchObjectsForService);
  mockMetrics(fetchPodMetricsByNamespaces);

  return getKubernetesFanOutHandler(customResources);
}

function getKubernetesFanOutHandler(customResources: CustomResource[]) {
  return new KubernetesFanOutHandler({
    logger: getVoidLogger(),
    fetcher: {
      fetchObjectsForService,
      fetchPodMetricsByNamespaces,
    },
    serviceLocator: {
      getClustersByEntity,
    },
    customResources: customResources,
  });
}

function generatePodStatus(
  _clusterName: string,
  _namespaces: Set<string>,
): FetchResponseWrapper {
  return {
    errors: [],
    responses: Array.from(_namespaces).map(() => {
      return {
        type: 'podstatus',
        resources: [
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
        ],
      };
    }),
  };
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

describe('getKubernetesObjectsByEntity', () => {
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

    const sut = mockFetchAndGetKubernetesFanOutHandler([]);

    const result = await sut.getKubernetesObjectsByEntity({
      entity,
      auth: {},
    });

    expect(getClustersByEntity.mock.calls.length).toBe(1);
    expect(fetchObjectsForService.mock.calls.length).toBe(1);
    expect(fetchPodMetricsByNamespaces.mock.calls.length).toBe(1);
    expect(fetchPodMetricsByNamespaces.mock.calls[0][1]).toStrictEqual(
      new Set(['ns-test-component-test-cluster']),
    );

    expect(result).toStrictEqual({
      items: [
        {
          cluster: {
            name: 'test-cluster',
          },
          errors: [],
          podMetrics: [POD_METRICS_FIXTURE],
          resources: resourcesByCluster('test-cluster'),
        },
      ],
    });
  });

  it('retrieve objects for one cluster using customResources per cluster', async () => {
    getClustersByEntity.mockImplementation(() =>
      Promise.resolve({
        clusters: [cluster1],
      }),
    );

    const sut = mockFetchAndGetKubernetesFanOutHandler([]);

    await sut.getKubernetesObjectsByEntity({
      entity,
      auth: {},
    });

    expect(fetchObjectsForService.mock.calls.length).toBe(1);
    expect(fetchObjectsForService.mock.calls[0][0].customResources.length).toBe(
      1,
    );
  });

  it('retrieve objects for two cluster using customResources per cluster', async () => {
    getClustersByEntity.mockImplementation(() =>
      Promise.resolve({
        clusters: [cluster1, cluster2],
      }),
    );

    const sut = mockFetchAndGetKubernetesFanOutHandler([]);

    await sut.getKubernetesObjectsByEntity({
      entity,
      auth: {},
    });

    expect(fetchObjectsForService.mock.calls.length).toBe(2);
    expect(
      fetchObjectsForService.mock.calls[0][0].customResources[0].group,
    ).toBe('some-other-crd.example.com');
    expect(
      fetchObjectsForService.mock.calls[1][0].customResources[0].group,
    ).toBe('crd-two.example.com');
  });

  it('retrieve objects for two cluster using customResources globally and per cluster', async () => {
    getClustersByEntity.mockImplementation(() =>
      Promise.resolve({
        clusters: [
          {
            name: 'test-cluster',
            authProvider: 'serviceAccount',
          },
          cluster2,
        ],
      }),
    );

    const sut = mockFetchAndGetKubernetesFanOutHandler([
      {
        objectType: 'customresources',
        group: 'some-group',
        apiVersion: 'v2',
        plural: 'things',
      },
    ]);

    await sut.getKubernetesObjectsByEntity({
      entity,
      auth: {},
    });

    expect(fetchObjectsForService.mock.calls.length).toBe(2);
    expect(
      fetchObjectsForService.mock.calls[0][0].customResources[0].group,
    ).toBe('some-group');
    expect(
      fetchObjectsForService.mock.calls[1][0].customResources[0].group,
    ).toBe('crd-two.example.com');
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

    mockMetrics(fetchPodMetricsByNamespaces);

    const sut = getKubernetesFanOutHandler([]);

    const result = await sut.getKubernetesObjectsByEntity({
      entity,
      auth: {},
    });

    expect(getClustersByEntity.mock.calls.length).toBe(1);
    expect(fetchObjectsForService.mock.calls.length).toBe(1);
    expect(fetchPodMetricsByNamespaces.mock.calls.length).toBe(1);
    expect(fetchPodMetricsByNamespaces.mock.calls[0][1]).toStrictEqual(
      new Set(['ns-a', 'ns-b']),
    );

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

    const sut = mockFetchAndGetKubernetesFanOutHandler([]);

    const result = await sut.getKubernetesObjectsByEntity({
      entity,
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
          resources: resourcesByCluster('test-cluster'),
        },
        {
          cluster: {
            name: 'other-cluster',
          },
          errors: [],
          podMetrics: [POD_METRICS_FIXTURE],
          resources: resourcesByCluster('other-cluster'),
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

    const sut = mockFetchAndGetKubernetesFanOutHandler([]);

    const result = await sut.getKubernetesObjectsByEntity({
      entity,
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
          resources: resourcesByCluster('test-cluster'),
        },
        {
          cluster: {
            name: 'other-cluster',
          },
          errors: [],
          podMetrics: [POD_METRICS_FIXTURE],
          resources: resourcesByCluster('other-cluster'),
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

    const sut = mockFetchAndGetKubernetesFanOutHandler([]);

    const result = await sut.getKubernetesObjectsByEntity({
      entity,
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
          resources: resourcesByCluster('test-cluster'),
        },
        {
          cluster: {
            name: 'other-cluster',
          },
          errors: [],
          podMetrics: [POD_METRICS_FIXTURE],
          resources: resourcesByCluster('other-cluster'),
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
  it('retrieve objects for two clusters, one fails to fetch pod metrics', async () => {
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

    // To simulate the partial failure, return a valid response for the first call,
    // and an error for the second call.
    fetchPodMetricsByNamespaces
      .mockImplementationOnce(
        (clusterDetails: ClusterDetails, namespaces: Set<string>) =>
          Promise.resolve(generatePodStatus(clusterDetails.name, namespaces)),
      )
      .mockResolvedValueOnce({
        errors: [
          {
            errorType: 'NOT_FOUND',
            resourcePath: '/some/path',
            statusCode: 404,
          },
        ],
        responses: [],
      });

    const sut = getKubernetesFanOutHandler([]);

    const result = await sut.getKubernetesObjectsByEntity({
      entity,
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
          resources: resourcesByCluster('test-cluster'),
        },
        {
          cluster: {
            name: 'other-cluster',
          },
          errors: [
            {
              errorType: 'NOT_FOUND',
              resourcePath: '/some/path',
              statusCode: 404,
            },
          ],
          podMetrics: [],
          resources: resourcesByCluster('other-cluster'),
        },
      ],
    });
  });
  it('fails when fetcher rejects with a non-FetchError', async () => {
    const nonFetchError = new Error('not a fetch error');
    getClustersByEntity.mockResolvedValue({
      clusters: [
        {
          name: 'test-cluster',
          authProvider: 'serviceAccount',
          skipMetricsLookup: true,
        },
      ],
    });
    fetchObjectsForService.mockRejectedValue(nonFetchError);

    const sut = getKubernetesFanOutHandler([]);

    const result = sut.getKubernetesObjectsByEntity({
      entity,
      auth: {},
    });
    await expect(result).rejects.toThrow(nonFetchError);
  });
  describe('with a real fetcher', () => {
    const worker = setupServer();
    setupRequestMockHandlers(worker);
    it('fetch error short-circuits requests to a single cluster, recovering across the fleet', async () => {
      const pods = [{ metadata: { name: 'pod-name' } }];
      const services = [{ metadata: { name: 'service-name' } }];
      worker.use(
        rest.get('https://works/api/v1/pods', (_, res, ctx) =>
          res(ctx.json({ items: pods })),
        ),
        rest.get('https://works/api/v1/services', (_, res, ctx) =>
          res(ctx.json({ items: services })),
        ),
        rest.get('https://fails/api/v1/pods', (_, res) =>
          res.networkError('socket error'),
        ),
        rest.get('https://fails/api/v1/services', (_, res, ctx) =>
          res(ctx.json({ items: services })),
        ),
      );
      const fleet: jest.Mocked<KubernetesServiceLocator> = {
        getClustersByEntity: jest.fn().mockResolvedValue({
          clusters: [
            {
              name: 'works',
              url: 'https://works',
              authProvider: 'serviceAccount',
              serviceAccountToken: 'token',
              skipMetricsLookup: true,
            },
            {
              name: 'fails',
              url: 'https://fails',
              authProvider: 'serviceAccount',
              serviceAccountToken: 'token',
              skipMetricsLookup: true,
            },
          ],
        }),
      };
      const logger = getVoidLogger();
      const sut = new KubernetesFanOutHandler({
        logger,
        fetcher: new KubernetesClientBasedFetcher({ logger }),
        serviceLocator: fleet,
        customResources: [],
        objectTypesToFetch: [
          {
            group: '',
            apiVersion: 'v1',
            plural: 'pods',
            objectType: 'pods',
          },
          {
            group: '',
            apiVersion: 'v1',
            plural: 'services',
            objectType: 'services',
          },
        ],
      });

      const result = await sut.getKubernetesObjectsByEntity({
        entity,
        auth: {},
      });

      const expected: ObjectsByEntityResponse = {
        items: [
          {
            cluster: { name: 'works' },
            resources: [
              { type: 'pods', resources: pods },
              { type: 'services', resources: services },
            ],
            podMetrics: [],
            errors: [],
          },
          {
            cluster: { name: 'fails' },
            resources: [],
            podMetrics: [],
            errors: [
              {
                errorType: 'FETCH_ERROR',
                message:
                  'request to https://fails/api/v1/pods?labelSelector=backstage.io/kubernetes-id=test-component failed, reason: socket error',
              },
            ],
          },
        ],
      };
      expect(result).toStrictEqual(expected);
    });
  });
});

describe('getCustomResourcesByEntity', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('retrieve objects for one cluster using customResources per cluster', async () => {
    getClustersByEntity.mockImplementation(() =>
      Promise.resolve({
        clusters: [cluster1],
      }),
    );

    const sut = mockFetchAndGetKubernetesFanOutHandler([]);

    await sut.getCustomResourcesByEntity({
      entity,
      auth: {},
      customResources: [
        {
          group: 'parameter-crd.example.com',
          apiVersion: 'v1alpha1',
          plural: 'parameter-crd',
        },
      ],
    });

    expect(fetchObjectsForService.mock.calls.length).toBe(1);
    expect(
      fetchObjectsForService.mock.calls[0][0].customResources[0].plural,
    ).toBe('parameter-crd');
  });

  it('retrieve objects for two cluster using customResources globally and per cluster', async () => {
    getClustersByEntity.mockImplementation(() =>
      Promise.resolve({
        clusters: [
          {
            name: 'test-cluster',
            authProvider: 'serviceAccount',
          },
          cluster2,
        ],
      }),
    );

    const sut = mockFetchAndGetKubernetesFanOutHandler([
      {
        objectType: 'customresources',
        group: 'some-group',
        apiVersion: 'v2',
        plural: 'things',
      },
    ]);

    await sut.getCustomResourcesByEntity({
      entity,
      auth: {},
      customResources: [
        {
          group: 'parameter-crd.example.com',
          apiVersion: 'v1alpha1',
          plural: 'parameter-crd',
        },
      ],
    });

    expect(fetchObjectsForService.mock.calls.length).toBe(2);
    expect(
      fetchObjectsForService.mock.calls[0][0].customResources[0].group,
    ).toBe('parameter-crd.example.com');
    expect(
      fetchObjectsForService.mock.calls[1][0].customResources[0].group,
    ).toBe('parameter-crd.example.com');
  });
});
