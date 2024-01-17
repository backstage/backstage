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

import { Entity } from '@backstage/catalog-model';
import {
  ANNOTATION_KUBERNETES_AUTH_PROVIDER,
  ANNOTATION_KUBERNETES_OIDC_TOKEN_PROVIDER,
  ObjectsByEntityResponse,
  KubernetesRequestAuth,
} from '@backstage/plugin-kubernetes-common';
import request from 'supertest';
import {
  ClusterDetails,
  FetchResponseWrapper,
  KubernetesFetcher,
  KubernetesServiceLocator,
  ObjectFetchParams,
} from '../types/types';
import { KubernetesCredential } from '../auth/types';
import {
  HEADER_KUBERNETES_CLUSTER,
  HEADER_KUBERNETES_AUTH,
} from './KubernetesProxy';
import { setupServer } from 'msw/node';
import {
  ServiceMock,
  mockServices,
  setupRequestMockHandlers,
  startTestBackend,
} from '@backstage/backend-test-utils';
import { rest } from 'msw';
import {
  AuthorizeResult,
  PermissionEvaluator,
} from '@backstage/plugin-permission-common';
import {
  PermissionsService,
  createBackendModule,
} from '@backstage/backend-plugin-api';
import {
  KubernetesObjectsProvider,
  kubernetesAuthStrategyExtensionPoint,
  kubernetesClusterSupplierExtensionPoint,
  kubernetesObjectsProviderExtensionPoint,
  kubernetesFetcherExtensionPoint,
  kubernetesServiceLocatorExtensionPoint,
} from '@backstage/plugin-kubernetes-node';
import { ExtendedHttpServer } from '@backstage/backend-app-api';

describe('KubernetesBuilder', () => {
  let app: ExtendedHttpServer;
  let objectsProviderMock: KubernetesObjectsProvider;
  const happyK8SResult = {
    items: [
      {
        clusterOne: {
          pods: [
            {
              metadata: {
                name: 'pod1',
              },
            },
          ],
        },
      },
    ],
  } as any;
  const policyMock: jest.Mocked<PermissionEvaluator> = {
    authorize: jest.fn(),
    authorizeConditional: jest.fn(),
  };
  const permissionsMock: ServiceMock<PermissionsService> =
    mockServices.permissions.mock(policyMock);

  beforeEach(async () => {
    jest.resetAllMocks();

    objectsProviderMock = {
      getKubernetesObjectsByEntity: jest.fn().mockImplementation(_ => {
        return Promise.resolve(happyK8SResult);
      }),
      getCustomResourcesByEntity: jest.fn().mockImplementation(_ => {
        return Promise.resolve(happyK8SResult);
      }),
    };

    const clusterSupplierMock = {
      getClusters: jest.fn().mockImplementation(_ => {
        return Promise.resolve([
          {
            name: 'some-cluster',
            url: 'https://localhost:1234',
            authMetadata: {
              [ANNOTATION_KUBERNETES_AUTH_PROVIDER]: 'serviceAccount',
            },
          },
          {
            name: 'some-other-cluster',
            url: 'https://localhost:1235',
            authMetadata: {
              [ANNOTATION_KUBERNETES_AUTH_PROVIDER]: 'oidc',
              [ANNOTATION_KUBERNETES_OIDC_TOKEN_PROVIDER]: 'google',
            },
          },
        ]);
      }),
    };

    jest.mock('@backstage/catalog-client', () => ({
      CatalogClient: jest.fn().mockImplementation(() => ({
        getEntityByRef: jest.fn().mockImplementation(entityRef => {
          if (entityRef.name === 'noentity') {
            return Promise.resolve(undefined);
          }
          return Promise.resolve({
            kind: entityRef.kind,
            metadata: {
              name: entityRef.name,
              namespace: entityRef.namespace,
            },
          } as Entity);
        }),
      })),
    }));

    const { server } = await startTestBackend({
      features: [
        mockServices.rootConfig.factory({
          data: {
            kubernetes: {
              serviceLocatorMethod: {
                type: 'multiTenant',
              },
              clusterLocatorMethods: [
                {
                  type: 'config',
                  clusters: [],
                },
              ],
            },
          },
        }),
        import('@backstage/plugin-kubernetes-backend/alpha'),
        import('@backstage/plugin-permission-backend/alpha'),
        import('@backstage/plugin-permission-backend-module-allow-all-policy'),
        createBackendModule({
          pluginId: 'kubernetes',
          moduleId: 'testObjectsProvider',
          register(env) {
            env.registerInit({
              deps: { extension: kubernetesObjectsProviderExtensionPoint },
              async init({ extension }) {
                extension.addObjectsProvider(objectsProviderMock);
              },
            });
          },
        }),
        createBackendModule({
          pluginId: 'kubernetes',
          moduleId: 'testClusterSupplier',
          register(env) {
            env.registerInit({
              deps: { extension: kubernetesClusterSupplierExtensionPoint },
              async init({ extension }) {
                extension.addClusterSupplier(clusterSupplierMock);
              },
            });
          },
        }),
      ],
    });

    app = server;
  });

  describe('get /clusters', () => {
    it('happy path: lists clusters', async () => {
      const response = await request(app).get('/api/kubernetes/clusters');

      expect(response.status).toEqual(200);
      expect(response.body).toStrictEqual({
        items: [
          {
            name: 'some-cluster',
            authProvider: 'serviceAccount',
          },
          {
            name: 'some-other-cluster',
            authProvider: 'oidc',
            oidcTokenProvider: 'google',
          },
        ],
      });
    });
  });

  describe('post /services/:serviceId', () => {
    it('happy path: lists kubernetes objects without auth in request body', async () => {
      const response = await request(app).post(
        '/api/kubernetes/services/test-service',
      );
      expect(response.status).toEqual(200);
      expect(response.body).toEqual(happyK8SResult);
    });

    it('happy path: lists kubernetes objects with auth in request body', async () => {
      const response = await request(app)
        .post('/api/kubernetes/services/test-service')
        .send({
          auth: {
            google: 'google_token_123',
          },
        })
        .set('Content-Type', 'application/json');
      expect(response.status).toEqual(200);
      expect(response.body).toEqual(happyK8SResult);
    });

    it('internal error: lists kubernetes objects', async () => {
      objectsProviderMock.getKubernetesObjectsByEntity = jest
        .fn()
        .mockRejectedValue(Error('some internal error'));

      const response = await request(app).post(
        '/api/kubernetes/services/test-service',
      );

      expect(response.status).toEqual(500);
      expect(response.body).toEqual({ error: 'some internal error' });
    });

    it('custom service locator', async () => {
      const someCluster = {
        name: 'some-cluster',
        url: 'https://localhost:1234',
        authMetadata: {
          [ANNOTATION_KUBERNETES_AUTH_PROVIDER]: 'serviceAccount',
          serviceAccountToken: 'placeholder-token',
        },
      };
      const clusters: ClusterDetails[] = [
        someCluster,
        {
          name: 'some-other-cluster',
          url: 'https://localhost:1235',
          authMetadata: { [ANNOTATION_KUBERNETES_AUTH_PROVIDER]: 'google' },
        },
      ];

      const clusterSupplierMock = {
        getClusters: jest.fn().mockImplementation(_ => {
          return Promise.resolve(clusters);
        }),
      };

      const pod = {
        metadata: {
          name: 'pod1',
        },
      };
      const result: ObjectsByEntityResponse = {
        items: [
          {
            cluster: {
              name: someCluster.name,
            },
            errors: [],
            podMetrics: [],
            resources: [
              {
                type: 'pods',
                resources: [pod],
              },
            ],
          },
        ],
      };

      const mockServiceLocator: KubernetesServiceLocator = {
        getClustersByEntity(
          _entity: Entity,
        ): Promise<{ clusters: ClusterDetails[] }> {
          return Promise.resolve({ clusters: [someCluster] });
        },
      };

      const mockFetcher: KubernetesFetcher = {
        fetchPodMetricsByNamespaces(
          _clusterDetails: ClusterDetails,
          _credential: KubernetesCredential,
          _namespaces: Set<string>,
        ): Promise<FetchResponseWrapper> {
          return Promise.resolve({ errors: [], responses: [] });
        },
        fetchObjectsForService(
          _params: ObjectFetchParams,
        ): Promise<FetchResponseWrapper> {
          return Promise.resolve({
            errors: [],
            responses: [
              {
                type: 'pods',
                resources: [pod],
              },
            ],
          });
        },
      };

      const { server } = await startTestBackend({
        features: [
          mockServices.rootConfig.factory({
            data: {
              kubernetes: {
                serviceLocatorMethod: {
                  type: 'multiTenant',
                },
                clusterLocatorMethods: [
                  {
                    type: 'config',
                    clusters: [],
                  },
                ],
              },
            },
          }),
          import('@backstage/plugin-kubernetes-backend/alpha'),
          createBackendModule({
            pluginId: 'kubernetes',
            moduleId: 'testClusterSupplier',
            register(env) {
              env.registerInit({
                deps: { extension: kubernetesClusterSupplierExtensionPoint },
                async init({ extension }) {
                  extension.addClusterSupplier(clusterSupplierMock);
                },
              });
            },
          }),
          createBackendModule({
            pluginId: 'kubernetes',
            moduleId: 'testFetcher',
            register(env) {
              env.registerInit({
                deps: { extension: kubernetesFetcherExtensionPoint },
                async init({ extension }) {
                  extension.addFetcher(mockFetcher);
                },
              });
            },
          }),
          createBackendModule({
            pluginId: 'kubernetes',
            moduleId: 'testServiceLocator',
            register(env) {
              env.registerInit({
                deps: { extension: kubernetesServiceLocatorExtensionPoint },
                async init({ extension }) {
                  extension.addServiceLocator(mockServiceLocator);
                },
              });
            },
          }),
        ],
      });

      app = server;

      const response = await request(app)
        .post('/api/kubernetes/services/test-service')
        .send({
          entity: {
            metadata: {
              name: 'thing',
            },
          },
        });

      expect(response.body).toEqual(result);
      expect(response.status).toEqual(200);
    });

    it('reads auth data for custom strategy', async () => {
      const mockFetcher = {
        fetchPodMetricsByNamespaces: jest
          .fn()
          .mockResolvedValue({ errors: [], responses: [] }),
        fetchObjectsForService: jest.fn().mockResolvedValue({
          errors: [],
          responses: [
            { type: 'pods', resources: [{ metadata: { name: 'pod1' } }] },
          ],
        }),
      };

      const clusterSupplierMock = {
        getClusters: jest.fn().mockImplementation(_ => {
          return Promise.resolve([
            {
              name: 'custom-cluster',
              url: 'http://my.cluster.url',
              authMetadata: {
                [ANNOTATION_KUBERNETES_AUTH_PROVIDER]: 'custom',
              },
            },
          ]);
        }),
      };

      const { server } = await startTestBackend({
        features: [
          mockServices.rootConfig.factory({
            data: {
              kubernetes: {
                serviceLocatorMethod: {
                  type: 'multiTenant',
                },
                clusterLocatorMethods: [
                  {
                    type: 'config',
                    clusters: [],
                  },
                ],
              },
            },
          }),
          import('@backstage/plugin-kubernetes-backend/alpha'),
          createBackendModule({
            pluginId: 'kubernetes',
            moduleId: 'testClusterSupplier',
            register(env) {
              env.registerInit({
                deps: { extension: kubernetesClusterSupplierExtensionPoint },
                async init({ extension }) {
                  extension.addClusterSupplier(clusterSupplierMock);
                },
              });
            },
          }),
          createBackendModule({
            pluginId: 'kubernetes',
            moduleId: 'testAuthStrategy',
            register(env) {
              env.registerInit({
                deps: { extension: kubernetesAuthStrategyExtensionPoint },
                async init({ extension }) {
                  extension.addAuthStrategy('custom', {
                    getCredential: jest
                      .fn<
                        Promise<KubernetesCredential>,
                        [ClusterDetails, KubernetesRequestAuth]
                      >()
                      .mockImplementation(async (_, requestAuth) => ({
                        type: 'bearer token',
                        token: requestAuth.custom as string,
                      })),
                    validateCluster: jest.fn().mockReturnValue([]),
                  });
                },
              });
            },
          }),
          createBackendModule({
            pluginId: 'kubernetes',
            moduleId: 'testFetcher',
            register(env) {
              env.registerInit({
                deps: { extension: kubernetesFetcherExtensionPoint },
                async init({ extension }) {
                  extension.addFetcher(mockFetcher);
                },
              });
            },
          }),
        ],
      });

      app = server;

      await request(app)
        .post('/api/kubernetes/services/test-service')
        .send({
          entity: {
            metadata: {
              name: 'thing',
            },
          },
          auth: { custom: 'custom-token' },
        });

      expect(mockFetcher.fetchObjectsForService).toHaveBeenCalledWith(
        expect.objectContaining({
          credential: { type: 'bearer token', token: 'custom-token' },
        }),
      );
    });
  });

  describe('/proxy', () => {
    const worker = setupServer();
    setupRequestMockHandlers(worker);

    beforeEach(() => {
      worker.use(
        rest.post(
          'https://localhost:1234/api/v1/namespaces',
          (req, res, ctx) => {
            if (!req.headers.get('Authorization')) {
              return res(ctx.status(401));
            }
            return req
              .arrayBuffer()
              .then(body =>
                res(
                  ctx.set('content-type', `${req.headers.get('content-type')}`),
                  ctx.body(body),
                ),
              );
          },
        ),
      );
    });

    it('returns the given request body with permission set to allow', async () => {
      const requestBody = {
        kind: 'Namespace',
        apiVersion: 'v1',
        metadata: {
          name: 'new-ns',
        },
      };

      const proxyEndpointRequest = request(app)
        .post('/api/kubernetes/proxy/api/v1/namespaces')
        .set(HEADER_KUBERNETES_CLUSTER, 'some-cluster')
        .set(HEADER_KUBERNETES_AUTH, 'randomtoken')
        .send(requestBody);

      worker.use(rest.all(proxyEndpointRequest.url, req => req.passthrough()));

      const response = await proxyEndpointRequest;

      expect(response.body).toStrictEqual(requestBody);
    });

    it('supports yaml content type with permission set to allow', async () => {
      const requestBody = `---
kind: Namespace
apiVersion: v1
metadata:
  name: new-ns
`;

      const proxyEndpointRequest = request(app)
        .post('/api/kubernetes/proxy/api/v1/namespaces')
        .set(HEADER_KUBERNETES_CLUSTER, 'some-cluster')
        .set(HEADER_KUBERNETES_AUTH, 'randomtoken')
        .set('content-type', 'application/yaml')
        .send(requestBody);

      worker.use(rest.all(proxyEndpointRequest.url, req => req.passthrough()));

      const response = await proxyEndpointRequest;
      expect(response.text).toEqual(requestBody);
    });

    it('returns a 403 response if Permission Policy is in place that blocks endpoint', async () => {
      const requestBody = {
        kind: 'Namespace',
        apiVersion: 'v1',
        metadata: {
          name: 'new-ns',
        },
      };

      permissionsMock.authorize.mockResolvedValue([
        { result: AuthorizeResult.DENY },
      ]);

      const { server } = await startTestBackend({
        features: [
          mockServices.rootConfig.factory({
            data: {
              kubernetes: {
                serviceLocatorMethod: {
                  type: 'multiTenant',
                },
                clusterLocatorMethods: [
                  {
                    type: 'config',
                    clusters: [],
                  },
                ],
              },
            },
          }),
          permissionsMock.factory,
          import('@backstage/plugin-kubernetes-backend/alpha'),
          // import('@backstage/plugin-permission-backend/alpha'),
        ],
      });

      const proxyEndpointRequest = request(server)
        .post('/api/kubernetes/proxy/api/v1/namespaces')
        .set(HEADER_KUBERNETES_CLUSTER, 'some-cluster')
        .set(HEADER_KUBERNETES_AUTH, 'randomtoken')
        .send(requestBody);

      worker.use(rest.all(proxyEndpointRequest.url, req => req.passthrough()));

      const response = await proxyEndpointRequest;

      expect(response.status).toEqual(403);
    });

    it('permits custom client-side auth strategy', async () => {
      worker.use(
        rest.get('http://my.cluster.url/api/v1/namespaces', (req, res, ctx) => {
          if (req.headers.get('Authorization') !== 'custom-token') {
            return res(ctx.status(401));
          }
          return res(ctx.json({ items: [] }));
        }),
      );

      const clusterSupplierMock = {
        getClusters: jest.fn().mockImplementation(_ => {
          return Promise.resolve([
            {
              name: 'custom-cluster',
              url: 'http://my.cluster.url',
              authMetadata: {
                [ANNOTATION_KUBERNETES_AUTH_PROVIDER]: 'custom',
              },
            },
          ]);
        }),
      };

      const { server } = await startTestBackend({
        features: [
          mockServices.rootConfig.factory({
            data: {
              kubernetes: {
                serviceLocatorMethod: {
                  type: 'multiTenant',
                },
                clusterLocatorMethods: [
                  {
                    type: 'config',
                    clusters: [],
                  },
                ],
              },
            },
          }),
          import('@backstage/plugin-kubernetes-backend/alpha'),
          createBackendModule({
            pluginId: 'kubernetes',
            moduleId: 'testObjectsProvider',
            register(env) {
              env.registerInit({
                deps: { extension: kubernetesObjectsProviderExtensionPoint },
                async init({ extension }) {
                  extension.addObjectsProvider(objectsProviderMock);
                },
              });
            },
          }),
          createBackendModule({
            pluginId: 'kubernetes',
            moduleId: 'testClusterSupplier',
            register(env) {
              env.registerInit({
                deps: { extension: kubernetesClusterSupplierExtensionPoint },
                async init({ extension }) {
                  extension.addClusterSupplier(clusterSupplierMock);
                },
              });
            },
          }),
          createBackendModule({
            pluginId: 'kubernetes',
            moduleId: 'testAuthStrategy',
            register(env) {
              env.registerInit({
                deps: { extension: kubernetesAuthStrategyExtensionPoint },
                async init({ extension }) {
                  extension.addAuthStrategy('custom', {
                    getCredential: jest
                      .fn<
                        Promise<KubernetesCredential>,
                        [ClusterDetails, KubernetesRequestAuth]
                      >()
                      .mockResolvedValue({ type: 'anonymous' }),
                    validateCluster: jest.fn().mockReturnValue([]),
                  });
                },
              });
            },
          }),
        ],
      });

      app = server;

      const proxyEndpointRequest = request(app)
        .get('/api/kubernetes/proxy/api/v1/namespaces')
        .set(HEADER_KUBERNETES_CLUSTER, 'custom-cluster')
        .set(HEADER_KUBERNETES_AUTH, 'custom-token');
      worker.use(rest.all(proxyEndpointRequest.url, req => req.passthrough()));
      const response = await proxyEndpointRequest;

      expect(response.body).toStrictEqual({ items: [] });
    });

    it('should not permit custom auth strategies with dashes', async () => {
      const throwError = async () => {
        await startTestBackend({
          features: [
            import('@backstage/plugin-kubernetes-backend/alpha'),
            createBackendModule({
              pluginId: 'kubernetes',
              moduleId: 'testAuthStrategy',
              register(env) {
                env.registerInit({
                  deps: { extension: kubernetesAuthStrategyExtensionPoint },
                  async init({ extension }) {
                    extension.addAuthStrategy('custom-strategy', {
                      getCredential: jest
                        .fn<
                          Promise<KubernetesCredential>,
                          [ClusterDetails, KubernetesRequestAuth]
                        >()
                        .mockResolvedValue({ type: 'anonymous' }),
                      validateCluster: jest.fn().mockReturnValue([]),
                    });
                  },
                });
              },
            }),
          ],
        });
      };

      await expect(throwError).rejects.toThrow(
        'Strategy name can not include dashes',
      );
    });
  });

  describe('get /.well-known/backstage/permissions/metadata', () => {
    it('lists permissions supported by the kubernetes plugin', async () => {
      const response = await request(app).get(
        '/api/kubernetes/.well-known/backstage/permissions/metadata',
      );

      expect(response.status).toEqual(200);
      expect(response.body).toMatchObject({
        permissions: [
          {
            type: 'basic',
            name: 'kubernetes.proxy',
            attributes: {},
          },
        ],
        rules: [],
      });
    });
  });

  it('fails when an unsupported serviceLocator type is specified', () => {
    return expect(() =>
      startTestBackend({
        features: [
          mockServices.rootConfig.factory({
            data: {
              kubernetes: {
                serviceLocatorMethod: { type: 'unsupported' },
                clusterLocatorMethods: [{ type: 'config', clusters: [] }],
              },
            },
          }),
          import('@backstage/plugin-kubernetes-backend/alpha'),
        ],
      }),
    ).rejects.toThrow(
      'Unsupported kubernetes.serviceLocatorMethod "unsupported"',
    );
  });
});
