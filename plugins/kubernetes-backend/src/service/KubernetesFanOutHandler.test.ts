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

import {
  ClusterDetails,
  CustomResource,
  ObjectFetchParams,
  KubernetesServiceLocator,
  ServiceLocatorRequestContext,
} from '../types/types';
import { KubernetesCredential } from '../auth/types';
import { KubernetesFanOutHandler } from './KubernetesFanOutHandler';
import { KubernetesClientBasedFetcher } from './KubernetesFetcher';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import {
  mockServices,
  registerMswTestHooks,
} from '@backstage/backend-test-utils';
import {
  CustomResourceFetchResponse,
  FetchResponse,
  KubernetesRequestAuth,
  ObjectsByEntityResponse,
} from '@backstage/plugin-kubernetes-common';
import { Config, ConfigReader } from '@backstage/config';
import { Entity } from '@backstage/catalog-model';
import { BackstageCredentials } from '@backstage/backend-plugin-api';

describe('KubernetesFanOutHandler', () => {
  const fetchObjectsForService = jest.fn();
  const fetchPodMetricsByNamespaces = jest.fn();
  const getClustersByEntity = jest.fn<
    Promise<{ clusters: ClusterDetails[] }>,
    [Entity]
  >();

  let config: Config;
  let sut: KubernetesFanOutHandler;

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

  const mockCredentials: BackstageCredentials = {
    $$type: '@backstage/BackstageCredentials',
    principal: {
      userEntityRef: 'user:default/guest',
      type: 'user',
    },
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
    url: '',
    authMetadata: {},
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
    url: '',
    authMetadata: {},
    customResources: [
      {
        group: 'crd-two.example.com',
        apiVersion: 'v1alpha1',
        plural: 'crd-two-plural',
      },
    ],
  };

  const mockClusterResourceMap: Record<string, FetchResponse[]> = {
    'test-cluster': [
      {
        resources: [
          {
            metadata: {
              name: `my-pods-test-component-test-cluster`,
              namespace: `ns-test-component-test-cluster`,
            },
          },
        ],
        type: 'pods',
      },
      {
        resources: [
          {
            metadata: {
              name: `my-configmaps-test-component-test-cluster`,
              namespace: `ns-test-component-test-cluster`,
            },
          },
        ],
        type: 'configmaps',
      },
      {
        resources: [
          {
            metadata: {
              name: `my-services-test-component-test-cluster`,
              namespace: `ns-test-component-test-cluster`,
            },
          },
        ],
        type: 'services',
      },
    ],
    'other-cluster': [
      {
        resources: [
          {
            metadata: {
              name: `my-pods-test-component-other-cluster`,
              namespace: `ns-test-component-other-cluster`,
            },
          },
        ],
        type: 'pods',
      },
      {
        resources: [
          {
            metadata: {
              name: `my-configmaps-test-component-other-cluster`,
              namespace: `ns-test-component-other-cluster`,
            },
          },
        ],
        type: 'configmaps',
      },
      {
        resources: [
          {
            metadata: {
              name: `my-services-test-component-other-cluster`,
              namespace: `ns-test-component-other-cluster`,
            },
          },
        ],
        type: 'services',
      },
    ],
  };

  const getKubernetesFanOutHandler = (customResources: CustomResource[]) => {
    return new KubernetesFanOutHandler({
      logger: mockServices.logger.mock(),
      fetcher: {
        fetchObjectsForService,
        fetchPodMetricsByNamespaces,
      },
      serviceLocator: {
        getClustersByEntity,
      },
      customResources: customResources,
      authStrategy: {
        getCredential: jest
          .fn<
            Promise<KubernetesCredential>,
            [ClusterDetails, KubernetesRequestAuth]
          >()
          .mockResolvedValue({ type: 'anonymous' }),
        validateCluster: jest.fn().mockReturnValue([]),
        presentAuthMetadata: jest.fn(),
      },
      config,
    });
  };

  const generateMockResourcesAndErrors = (
    serviceId: string,
    clusterName: string,
  ) => {
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
  };

  beforeAll(async () => {
    config = new ConfigReader({
      kubernetes: {
        serviceLocatorMethod: { type: 'multiTenant' },
        clusterLocatorMethods: [
          { type: 'config', clusters: [cluster1, cluster2] },
        ],
        customResourceProfiles: {
          build: [
            {
              group: 'argoproj.io',
              apiVersion: 'v1alpha1',
              plural: 'rollouts',
            },
          ],
          run: [
            {
              group: 'sample.io',
              apiVersion: 'v1alpha1',
              plural: 'tests',
            },
          ],
        },
      },
    });
  });

  beforeEach(() => {
    jest.resetAllMocks();

    fetchObjectsForService.mockImplementation((params: ObjectFetchParams) =>
      Promise.resolve(
        generateMockResourcesAndErrors(
          params.serviceId,
          params.clusterDetails.name,
        ),
      ),
    );

    fetchPodMetricsByNamespaces.mockImplementation(
      (
        _clusterDetails: ClusterDetails,
        _: KubernetesCredential,
        namespaces: Set<string>,
      ) =>
        Promise.resolve({
          errors: [],
          responses: Array.from(namespaces).map(() => {
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
        }),
    );
  });

  describe('getKubernetesObjectsByEntity', () => {
    it('retrieve objects for one cluster', async () => {
      getClustersByEntity.mockResolvedValue({
        clusters: [
          {
            name: 'test-cluster',
            title: 'cluster-title',
            url: '',
            authMetadata: {},
          },
        ],
      });

      sut = getKubernetesFanOutHandler([]);

      const result = await sut.getKubernetesObjectsByEntity(
        {
          entity,
          auth: {},
        },
        { credentials: mockCredentials },
      );

      expect(getClustersByEntity).toHaveBeenCalledTimes(1);
      expect(fetchObjectsForService).toHaveBeenCalledTimes(1);
      expect(fetchPodMetricsByNamespaces).toHaveBeenCalledTimes(1);
      expect(fetchPodMetricsByNamespaces).toHaveBeenCalledWith(
        expect.anything(),
        { type: 'anonymous' },
        new Set(['ns-test-component-test-cluster']),
        expect.anything(),
      );
      expect(result).toStrictEqual<ObjectsByEntityResponse>({
        items: [
          {
            cluster: {
              name: 'test-cluster',
              title: 'cluster-title',
            },
            errors: [],
            podMetrics: [POD_METRICS_FIXTURE],
            resources: mockClusterResourceMap['test-cluster'],
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

      sut = getKubernetesFanOutHandler([]);

      await sut.getKubernetesObjectsByEntity(
        {
          entity,
          auth: {},
        },
        { credentials: mockCredentials },
      );

      expect(fetchObjectsForService).toHaveBeenCalledTimes(1);
      expect(
        fetchObjectsForService.mock.calls[0][0].customResources.length,
      ).toBe(1);
      expect(fetchObjectsForService).toHaveBeenCalledWith(
        expect.objectContaining({
          customResources: [
            {
              group: 'some-other-crd.example.com',
              apiVersion: 'v1alpha1',
              plural: 'some-crd-only-on-this-cluster',
              objectType: 'customresources',
            },
          ],
        }),
      );
    });

    it('retrieve objects for two cluster using customResources per cluster', async () => {
      getClustersByEntity.mockImplementation(() =>
        Promise.resolve({
          clusters: [cluster1, cluster2],
        }),
      );

      sut = getKubernetesFanOutHandler([]);

      await sut.getKubernetesObjectsByEntity(
        {
          entity,
          auth: {},
        },
        { credentials: mockCredentials },
      );

      expect(fetchObjectsForService).toHaveBeenCalledTimes(2);
      expect(fetchObjectsForService).toHaveBeenCalledWith(
        expect.objectContaining({
          customResources: [
            {
              group: 'some-other-crd.example.com',
              apiVersion: 'v1alpha1',
              plural: 'some-crd-only-on-this-cluster',
              objectType: 'customresources',
            },
          ],
        }),
      );
      expect(fetchObjectsForService).toHaveBeenCalledWith(
        expect.objectContaining({
          customResources: [
            {
              group: 'crd-two.example.com',
              apiVersion: 'v1alpha1',
              plural: 'crd-two-plural',
              objectType: 'customresources',
            },
          ],
        }),
      );
    });

    it('retrieve objects for two cluster using customResources globally and per cluster', async () => {
      getClustersByEntity.mockImplementation(() =>
        Promise.resolve({
          clusters: [
            {
              name: 'test-cluster',
              url: '',
              authMetadata: {},
            },
            cluster2,
          ],
        }),
      );

      sut = getKubernetesFanOutHandler([
        {
          objectType: 'customresources',
          group: 'some-group',
          apiVersion: 'v2',
          plural: 'things',
        },
      ]);

      await sut.getKubernetesObjectsByEntity(
        {
          entity,
          auth: {},
        },
        { credentials: mockCredentials },
      );

      expect(fetchObjectsForService).toHaveBeenCalledTimes(2);
      expect(fetchObjectsForService).toHaveBeenCalledWith(
        expect.objectContaining({
          customResources: [
            {
              objectType: 'customresources',
              group: 'some-group',
              apiVersion: 'v2',
              plural: 'things',
            },
          ],
        }),
      );
      expect(fetchObjectsForService).toHaveBeenCalledWith(
        expect.objectContaining({
          customResources: [
            {
              group: 'crd-two.example.com',
              apiVersion: 'v1alpha1',
              plural: 'crd-two-plural',
              objectType: 'customresources',
            },
          ],
        }),
      );
    });

    it('prioritizes returning customResources defined in cluster details before config defined profileCustomResources and globally defined customResources passed directly into the fanOutHandler', async () => {
      getClustersByEntity.mockImplementation(() =>
        Promise.resolve({
          clusters: [
            {
              name: 'profile-cluster-1',
              url: '',
              authMetadata: {},
              customResourceProfile: 'build',
              customResources: [
                {
                  group: 'priority.test.io',
                  apiVersion: 'v1alpha1',
                  plural: 'priority2',
                },
              ],
            },
          ],
        }),
      );

      sut = getKubernetesFanOutHandler([
        {
          group: 'priority.test.io',
          apiVersion: 'v1alpha1',
          plural: 'priority4',
          objectType: 'customresources',
        },
      ]);

      await sut.getKubernetesObjectsByEntity(
        {
          entity,
          auth: {},
        },
        { credentials: mockCredentials },
      );

      expect(fetchObjectsForService).toHaveBeenCalledWith(
        expect.objectContaining({
          customResources: [
            {
              group: 'priority.test.io',
              apiVersion: 'v1alpha1',
              plural: 'priority2',
              objectType: 'customresources',
            },
          ],
        }),
      );
    });

    it('returns globally defined customResources passed directly into the fanOutHandler when none are defined in clusterDetails or config defined customResourceProfiles', async () => {
      getClustersByEntity.mockImplementation(() =>
        Promise.resolve({
          clusters: [
            {
              name: 'profile-cluster-1',
              url: '',
              authMetadata: {},
            },
          ],
        }),
      );

      sut = getKubernetesFanOutHandler([
        {
          group: 'priority.test.io',
          apiVersion: 'v1alpha1',
          plural: 'priority4',
          objectType: 'customresources',
        },
      ]);

      await sut.getKubernetesObjectsByEntity(
        {
          entity,
          auth: {},
        },
        { credentials: mockCredentials },
      );

      expect(fetchObjectsForService).toHaveBeenCalledWith(
        expect.objectContaining({
          customResources: [
            {
              group: 'priority.test.io',
              apiVersion: 'v1alpha1',
              plural: 'priority4',
              objectType: 'customresources',
            },
          ],
        }),
      );
    });

    it('dont call top for the same namespace twice', async () => {
      getClustersByEntity.mockImplementation(() =>
        Promise.resolve({
          clusters: [
            {
              name: 'test-cluster',
              url: '',
              authMetadata: {},
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

      sut = getKubernetesFanOutHandler([]);

      const result = await sut.getKubernetesObjectsByEntity(
        {
          entity,
          auth: {},
        },
        { credentials: mockCredentials },
      );

      expect(getClustersByEntity).toHaveBeenCalledTimes(1);
      expect(fetchObjectsForService).toHaveBeenCalledTimes(1);
      expect(fetchPodMetricsByNamespaces).toHaveBeenCalledTimes(1);
      expect(fetchPodMetricsByNamespaces).toHaveBeenCalledWith(
        expect.anything(),
        { type: 'anonymous' },
        new Set(['ns-a', 'ns-b']),
        expect.anything(),
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

    it('pods api is returning garbage', async () => {
      getClustersByEntity.mockImplementation(() =>
        Promise.resolve({
          clusters: [
            {
              name: 'test-cluster',
              url: '',
              authMetadata: {},
            },
          ],
        }),
      );

      fetchObjectsForService.mockImplementation((_: ObjectFetchParams) =>
        Promise.resolve({
          errors: [],
          responses: [
            {
              garbage: ['thrash', 'rubbish'],
            },
          ],
        }),
      );

      sut = getKubernetesFanOutHandler([]);

      const result = await sut.getKubernetesObjectsByEntity(
        {
          entity,
          auth: {},
        },
        { credentials: mockCredentials },
      );

      expect(getClustersByEntity).toHaveBeenCalledTimes(1);
      expect(fetchObjectsForService).toHaveBeenCalledTimes(1);
      expect(fetchPodMetricsByNamespaces).toHaveBeenCalledTimes(0);

      expect(result).toStrictEqual({
        items: [],
      });
    });

    it('retrieve objects for two clusters', async () => {
      getClustersByEntity.mockImplementation(() =>
        Promise.resolve({
          clusters: [
            {
              name: 'test-cluster',
              url: '',
              authMetadata: {},
              dashboardUrl: 'https://k8s.foo.coom',
            },
            {
              name: 'other-cluster',
              url: '',
              authMetadata: {},
            },
          ],
        }),
      );

      sut = getKubernetesFanOutHandler([]);

      const result = await sut.getKubernetesObjectsByEntity(
        {
          entity,
          auth: {
            google: 'google_token_123',
          },
        },
        { credentials: mockCredentials },
      );

      expect(getClustersByEntity).toHaveBeenCalledTimes(1);
      expect(fetchObjectsForService).toHaveBeenCalledTimes(2);
      expect(result).toStrictEqual({
        items: [
          {
            cluster: {
              dashboardUrl: 'https://k8s.foo.coom',
              name: 'test-cluster',
            },
            errors: [],
            podMetrics: [POD_METRICS_FIXTURE],
            resources: mockClusterResourceMap['test-cluster'],
          },
          {
            cluster: {
              name: 'other-cluster',
            },
            errors: [],
            podMetrics: [POD_METRICS_FIXTURE],
            resources: mockClusterResourceMap['other-cluster'],
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
              url: '',
              authMetadata: {},
            },
            {
              name: 'other-cluster',
              url: '',
              authMetadata: {},
            },
            {
              name: 'empty-cluster',
              url: '',
              authMetadata: {},
            },
          ],
        }),
      );

      sut = getKubernetesFanOutHandler([]);

      const result = await sut.getKubernetesObjectsByEntity(
        {
          entity,
          auth: {
            google: 'google_token_123',
          },
        },
        { credentials: mockCredentials },
      );

      expect(getClustersByEntity).toHaveBeenCalledTimes(1);
      expect(fetchObjectsForService).toHaveBeenCalledTimes(3);
      expect(result).toStrictEqual({
        items: [
          {
            cluster: {
              name: 'test-cluster',
            },
            errors: [],
            podMetrics: [POD_METRICS_FIXTURE],
            resources: mockClusterResourceMap['test-cluster'],
          },
          {
            cluster: {
              name: 'other-cluster',
            },
            errors: [],
            podMetrics: [POD_METRICS_FIXTURE],
            resources: mockClusterResourceMap['other-cluster'],
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
              url: '',
              authMetadata: {},
            },
            {
              name: 'other-cluster',
              url: '',
              authMetadata: {},
            },
            {
              name: 'empty-cluster',
              url: '',
              authMetadata: {},
            },
            {
              name: 'error-cluster',
              url: '',
              authMetadata: {},
            },
          ],
        }),
      );

      sut = getKubernetesFanOutHandler([]);

      const result = await sut.getKubernetesObjectsByEntity(
        {
          entity,
          auth: {
            google: 'google_token_123',
          },
        },
        { credentials: mockCredentials },
      );

      expect(getClustersByEntity).toHaveBeenCalledTimes(1);
      expect(fetchObjectsForService).toHaveBeenCalledTimes(4);
      expect(result).toStrictEqual({
        items: [
          {
            cluster: {
              name: 'test-cluster',
            },
            errors: [],
            podMetrics: [POD_METRICS_FIXTURE],
            resources: mockClusterResourceMap['test-cluster'],
          },
          {
            cluster: {
              name: 'other-cluster',
            },
            errors: [],
            podMetrics: [POD_METRICS_FIXTURE],
            resources: mockClusterResourceMap['other-cluster'],
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
              url: '',
              authMetadata: {},
              dashboardUrl: 'https://k8s.foo.coom',
            },
            {
              name: 'other-cluster',
              url: '',
              authMetadata: {},
            },
          ],
        }),
      );

      // To simulate the partial failure, return a valid response for the first call,
      // and an error for the second call.
      fetchPodMetricsByNamespaces
        .mockImplementationOnce(
          (
            _clusterDetails: ClusterDetails,
            _: KubernetesCredential,
            namespaces: Set<string>,
          ) =>
            Promise.resolve({
              errors: [],
              responses: Array.from(namespaces).map(() => {
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
            }),
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

      sut = getKubernetesFanOutHandler([]);

      const result = await sut.getKubernetesObjectsByEntity(
        {
          entity,
          auth: {
            google: 'google_token_123',
          },
        },
        { credentials: mockCredentials },
      );

      expect(getClustersByEntity).toHaveBeenCalledTimes(1);
      expect(fetchObjectsForService).toHaveBeenCalledTimes(2);
      expect(result).toStrictEqual({
        items: [
          {
            cluster: {
              dashboardUrl: 'https://k8s.foo.coom',
              name: 'test-cluster',
            },
            errors: [],
            podMetrics: [POD_METRICS_FIXTURE],
            resources: mockClusterResourceMap['test-cluster'],
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
            resources: mockClusterResourceMap['other-cluster'],
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
            url: '',
            authMetadata: {},
            skipMetricsLookup: true,
          },
        ],
      });
      fetchObjectsForService.mockRejectedValue(nonFetchError);

      sut = getKubernetesFanOutHandler([]);

      const result = sut.getKubernetesObjectsByEntity(
        {
          entity,
          auth: {},
        },
        { credentials: mockCredentials },
      );
      await expect(result).rejects.toThrow(nonFetchError);
    });

    describe('with a real fetcher', () => {
      const worker = setupServer();
      registerMswTestHooks(worker);

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
          getClustersByEntity: jest
            .fn<
              Promise<{ clusters: ClusterDetails[] }>,
              [Entity, ServiceLocatorRequestContext]
            >()
            .mockResolvedValue({
              clusters: [
                {
                  name: 'works',
                  url: 'https://works',
                  authMetadata: {},
                  skipMetricsLookup: true,
                },
                {
                  name: 'fails',
                  url: 'https://fails',
                  authMetadata: {},
                  skipMetricsLookup: true,
                },
              ],
            }),
        };
        const logger = mockServices.logger.mock();
        const kubernetesFanOutHandler = new KubernetesFanOutHandler({
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
          authStrategy: {
            getCredential: jest
              .fn<
                Promise<KubernetesCredential>,
                [ClusterDetails, KubernetesRequestAuth]
              >()
              .mockResolvedValue({ type: 'bearer token', token: 'token' }),
            validateCluster: jest.fn().mockReturnValue([]),
            presentAuthMetadata: jest.fn(),
          },
          config,
        });

        const result =
          await kubernetesFanOutHandler.getKubernetesObjectsByEntity(
            {
              entity,
              auth: {},
            },
            { credentials: mockCredentials },
          );

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
                    'request to https://fails/api/v1/pods?labelSelector=backstage.io%2Fkubernetes-id%3Dtest-component failed, reason: socket error',
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
    it('prioritizes retrieving objects for one cluster using customResources defined in parameters over customResources defined in clusterDetails', async () => {
      getClustersByEntity.mockImplementation(() =>
        Promise.resolve({
          clusters: [cluster1],
        }),
      );

      sut = getKubernetesFanOutHandler([]);

      await sut.getCustomResourcesByEntity(
        {
          entity,
          auth: {},
          customResources: [
            {
              group: 'parameter-crd.example.com',
              apiVersion: 'v1alpha1',
              plural: 'parameter-crd',
            },
          ],
        },
        { credentials: mockCredentials },
      );

      expect(fetchObjectsForService).toHaveBeenCalledTimes(1);
      expect(fetchObjectsForService).toHaveBeenCalledWith(
        expect.objectContaining({
          customResources: [
            {
              group: 'parameter-crd.example.com',
              apiVersion: 'v1alpha1',
              plural: 'parameter-crd',
              objectType: 'customresources',
            },
          ],
        }),
      );
      expect(fetchObjectsForService).not.toHaveBeenCalledWith(
        expect.objectContaining({
          customResources: [
            {
              group: 'some-other-crd.example.com',
              apiVersion: 'v1alpha1',
              plural: 'some-crd-only-on-this-cluster',
              objectType: 'customresources',
            },
          ],
        }),
      );
    });

    it('prioritizes retrieving objects for two clusters using customResources defined in parameters over customResources defined in clusterDetails or defined globally', async () => {
      getClustersByEntity.mockImplementation(() =>
        Promise.resolve({
          clusters: [
            {
              name: 'test-cluster',
              url: '',
              authMetadata: {},
            },
            cluster2,
          ],
        }),
      );

      sut = getKubernetesFanOutHandler([
        {
          objectType: 'customresources',
          group: 'some-group',
          apiVersion: 'v2',
          plural: 'things',
        },
      ]);

      await sut.getCustomResourcesByEntity(
        {
          entity,
          auth: {},
          customResources: [
            {
              group: 'parameter-crd.example.com',
              apiVersion: 'v1alpha1',
              plural: 'parameter-crd',
            },
          ],
        },
        { credentials: mockCredentials },
      );

      expect(fetchObjectsForService).toHaveBeenCalledTimes(2);
      expect(fetchObjectsForService).toHaveBeenCalledWith(
        expect.objectContaining({
          customResources: [
            {
              group: 'parameter-crd.example.com',
              apiVersion: 'v1alpha1',
              plural: 'parameter-crd',
              objectType: 'customresources',
            },
          ],
        }),
      );
      expect(fetchObjectsForService).not.toHaveBeenCalledWith(
        expect.objectContaining({
          customResources: [
            {
              objectType: 'customresources',
              group: 'some-group',
              apiVersion: 'v2',
              plural: 'things',
            },
          ],
        }),
      );
      expect(fetchObjectsForService).not.toHaveBeenCalledWith(
        expect.objectContaining({
          customResources: [
            {
              group: 'crd-two.example.com',
              apiVersion: 'v1alpha1',
              plural: 'crd-two-plural',
              objectType: 'customresources',
            },
          ],
        }),
      );
    });

    it('prioritizes retrieving objects for customResources defined directly as a parameter over customResources defined in customResource profiles', async () => {
      getClustersByEntity.mockImplementation(() =>
        Promise.resolve({
          clusters: [
            {
              name: 'profile-cluster-1',
              url: '',
              authMetadata: {},
              customResourceProfile: 'build',
            },
          ],
        }),
      );

      sut = getKubernetesFanOutHandler([]);

      await sut.getCustomResourcesByEntity(
        {
          entity,
          auth: {},
          customResources: [
            {
              group: 'parameter-crd.example.com',
              apiVersion: 'v1alpha1',
              plural: 'parameter-crd',
            },
          ],
        },
        { credentials: mockCredentials },
      );

      expect(fetchObjectsForService).toHaveBeenCalledWith(
        expect.objectContaining({
          customResources: [
            {
              group: 'parameter-crd.example.com',
              apiVersion: 'v1alpha1',
              plural: 'parameter-crd',
              objectType: 'customresources',
            },
          ],
        }),
      );
      expect(fetchObjectsForService).not.toHaveBeenCalledWith(
        expect.objectContaining({
          customResources: [
            {
              group: 'argoproj.io',
              apiVersion: 'v1alpha1',
              plural: 'rollouts',
              objectType: 'customresources',
            },
          ],
        }),
      );
    });
    it('fetch pod metrics when pods used', async () => {
      getClustersByEntity.mockImplementation(() =>
        Promise.resolve({
          clusters: [
            {
              name: 'test-cluster',
              title: 'cluster-title',
              url: '',
              authMetadata: {},
            },
          ],
        }),
      );

      sut = getKubernetesFanOutHandler([]);

      const resources: CustomResourceFetchResponse[] = [
        {
          type: 'customresources',
          resources: [
            {
              apiVersion: 'v1',
              kind: 'Pod',
              metadata: {
                namespace: `ns-test-component-test-cluster`,
              },
            },
          ],
        },
      ];

      fetchObjectsForService.mockImplementation(async () => ({
        responses: resources,
        errors: [],
      }));

      const result = await sut.getCustomResourcesByEntity(
        {
          entity,
          auth: {},
          customResources: [
            {
              group: '',
              apiVersion: 'v1',
              plural: 'pods',
            },
          ],
        },
        { credentials: mockCredentials },
      );

      expect(fetchObjectsForService).toHaveBeenCalledTimes(1);
      expect(fetchPodMetricsByNamespaces).toHaveBeenCalledTimes(1);
      expect(fetchPodMetricsByNamespaces).toHaveBeenCalledWith(
        expect.anything(),
        { type: 'anonymous' },
        new Set(['ns-test-component-test-cluster']),
        expect.anything(),
      );
      expect(result).toStrictEqual<ObjectsByEntityResponse>({
        items: [
          {
            cluster: {
              name: 'test-cluster',
              title: 'cluster-title',
            },
            errors: [],
            podMetrics: [POD_METRICS_FIXTURE],
            resources,
          },
        ],
      });
    });
  });
});
