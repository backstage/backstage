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
  ANNOTATION_KUBERNETES_AUTH_PROVIDER,
  ANNOTATION_KUBERNETES_AWS_ASSUME_ROLE,
  ANNOTATION_KUBERNETES_AWS_EXTERNAL_ID,
  ANNOTATION_KUBERNETES_DASHBOARD_URL,
  ANNOTATION_KUBERNETES_OIDC_TOKEN_PROVIDER,
  KubernetesRequestAuth,
} from '@backstage/plugin-kubernetes-common';
import request from 'supertest';
import {
  ClusterDetails,
  KubernetesFetcher,
  KubernetesServiceLocator,
} from '../types/types';
import { KubernetesCredential } from '../auth/types';
import {
  HEADER_KUBERNETES_CLUSTER,
  HEADER_KUBERNETES_AUTH,
} from './KubernetesProxy';
import { setupServer } from 'msw/node';
import {
  ServiceMock,
  mockCredentials,
  mockServices,
  registerMswTestHooks,
  startTestBackend,
} from '@backstage/backend-test-utils';
import { rest } from 'msw';
import { AuthorizeResult } from '@backstage/plugin-permission-common';
import {
  PermissionsService,
  createBackendModule,
} from '@backstage/backend-plugin-api';
import {
  AuthMetadata,
  KubernetesObjectsProvider,
  kubernetesAuthStrategyExtensionPoint,
  kubernetesClusterSupplierExtensionPoint,
  kubernetesObjectsProviderExtensionPoint,
  kubernetesFetcherExtensionPoint,
  kubernetesServiceLocatorExtensionPoint,
} from '@backstage/plugin-kubernetes-node';
import { ExtendedHttpServer } from '@backstage/backend-defaults/rootHttpRouter';

describe('API integration tests', () => {
  let app: ExtendedHttpServer;
  let objectsProviderMock: jest.Mocked<KubernetesObjectsProvider>;
  const happyK8SResult = {
    items: [{ clusterOne: { pods: [{ metadata: { name: 'pod1' } }] } }],
  };
  const permissionsMock: ServiceMock<PermissionsService> =
    mockServices.permissions.mock({
      authorize: jest.fn(),
      authorizeConditional: jest.fn(),
    });
  const minimalValidConfigService = mockServices.rootConfig.factory({
    data: {
      kubernetes: {
        serviceLocatorMethod: { type: 'multiTenant' },
        clusterLocatorMethods: [],
      },
    },
  });
  const withClusters = (clusters: ClusterDetails[]) =>
    createBackendModule({
      pluginId: 'kubernetes',
      moduleId: 'testClusterSupplier',
      register(env) {
        env.registerInit({
          deps: { extension: kubernetesClusterSupplierExtensionPoint },
          async init({ extension }) {
            extension.addClusterSupplier({
              getClusters: jest.fn().mockResolvedValue(clusters),
            });
          },
        });
      },
    });
  const startPermissionDeniedTestServer = async () => {
    permissionsMock.authorize.mockResolvedValue([
      { result: AuthorizeResult.DENY },
    ]);
    const { server } = await startTestBackend({
      features: [
        minimalValidConfigService,
        permissionsMock.factory,
        import('@backstage/plugin-kubernetes-backend'),
      ],
    });
    return server;
  };

  beforeEach(async () => {
    jest.resetAllMocks();

    objectsProviderMock = {
      getKubernetesObjectsByEntity: jest.fn().mockResolvedValue(happyK8SResult),
      getCustomResourcesByEntity: jest.fn().mockResolvedValue(happyK8SResult),
    };

    jest.mock('@backstage/catalog-client', () => ({
      CatalogClient: jest.fn().mockReturnValue({
        getEntityByRef: jest.fn().mockImplementation(async entityRef => {
          if (entityRef.name === 'noentity') {
            return undefined;
          }
          return {
            kind: entityRef.kind,
            metadata: {
              name: entityRef.name,
              namespace: entityRef.namespace,
            },
          };
        }),
      }),
    }));

    const { server } = await startTestBackend({
      features: [
        minimalValidConfigService,
        import('@backstage/plugin-kubernetes-backend'),
        import('@backstage/plugin-permission-backend'),
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
        withClusters([
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
        ]),
      ],
    });

    app = server;
  });

  afterEach(() => {
    app.stop();
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

    it('happy path: lists clusters with custom AuthStrategy and custom auth metadata', async () => {
      const { server } = await startTestBackend({
        features: [
          minimalValidConfigService,
          import('@backstage/plugin-kubernetes-backend'),
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
          withClusters([
            {
              name: 'some-cluster',
              url: 'https://localhost:1234',
              authMetadata: {
                [ANNOTATION_KUBERNETES_AUTH_PROVIDER]: 'customAuth',
                [ANNOTATION_KUBERNETES_DASHBOARD_URL]:
                  'https://127.0.0.1:8443/dashboard',
                [ANNOTATION_KUBERNETES_AWS_EXTERNAL_ID]: '12650152165654',
                [ANNOTATION_KUBERNETES_AWS_ASSUME_ROLE]: 'my_aws_role',
              },
            },
          ]),
          createBackendModule({
            pluginId: 'kubernetes',
            moduleId: 'testAuthStrategy',
            register(env) {
              env.registerInit({
                deps: { extension: kubernetesAuthStrategyExtensionPoint },
                async init({ extension }) {
                  extension.addAuthStrategy('customAuth', {
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
                    presentAuthMetadata: (
                      authMetadata: AuthMetadata,
                    ): AuthMetadata => {
                      const authMetadataFilter = Object.entries(authMetadata)
                        .filter(([key, _value]) => {
                          return [
                            ANNOTATION_KUBERNETES_DASHBOARD_URL,
                            ANNOTATION_KUBERNETES_AWS_ASSUME_ROLE,
                          ].includes(key);
                        })
                        .reduce(
                          (
                            accumulator: AuthMetadata,
                            currentValue: [string, string],
                          ) => {
                            accumulator[currentValue[0]] = currentValue[1];
                            return accumulator;
                          },
                          {},
                        );

                      return authMetadataFilter;
                    },
                  });
                },
              });
            },
          }),
        ],
      });
      app = server;

      const response = await request(app).get('/api/kubernetes/clusters');

      expect(response.status).toEqual(200);
      expect(response.body).toStrictEqual({
        items: [
          {
            name: 'some-cluster',
            authProvider: 'customAuth',
            auth: {
              'kubernetes.io/aws-assume-role': 'my_aws_role',
              'kubernetes.io/dashboard-url': 'https://127.0.0.1:8443/dashboard',
            },
          },
        ],
      });
    });

    it('surfaces cluster title', async () => {
      const { server } = await startTestBackend({
        features: [
          minimalValidConfigService,
          import('@backstage/plugin-kubernetes-backend'),
          withClusters([
            {
              name: 'cluster-name',
              title: 'cluster-title',
              url: 'url',
              authMetadata: {
                [ANNOTATION_KUBERNETES_AUTH_PROVIDER]: 'serviceAccount',
              },
            },
          ]),
        ],
      });
      app = server;

      const response = await request(app).get('/api/kubernetes/clusters');

      expect(response.body).toEqual({
        items: [expect.objectContaining({ title: 'cluster-title' })],
      });
    });

    it('returns 403 response when permission blocks endpoint', async () => {
      app = await startPermissionDeniedTestServer();
      const response = await request(app).get('/api/kubernetes/clusters');
      expect(response.status).toEqual(403);
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
        .send({ auth: { google: 'google_token_123' } })
        .set('Content-Type', 'application/json');
      expect(response.status).toEqual(200);
      expect(response.body).toEqual(happyK8SResult);
    });

    it('internal error: lists kubernetes objects', async () => {
      objectsProviderMock.getKubernetesObjectsByEntity.mockRejectedValue(
        Error('some internal error'),
      );

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

      const pod = { metadata: { name: 'pod1' } };

      const mockServiceLocator: jest.Mocked<KubernetesServiceLocator> = {
        getClustersByEntity: jest.fn().mockResolvedValue({
          clusters: [someCluster],
        }),
      };

      const mockFetcher: jest.Mocked<KubernetesFetcher> = {
        fetchPodMetricsByNamespaces: jest
          .fn()
          .mockResolvedValue({ errors: [], responses: [] }),
        fetchObjectsForService: jest.fn().mockResolvedValue({
          errors: [],
          responses: [{ type: 'pods', resources: [pod] }],
        }),
      };

      const { server } = await startTestBackend({
        features: [
          minimalValidConfigService,
          import('@backstage/plugin-kubernetes-backend'),
          withClusters(clusters),
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
        .send({ entity: { metadata: { name: 'thing' } } });

      expect(response.body).toEqual({
        items: [
          {
            cluster: { name: someCluster.name },
            errors: [],
            podMetrics: [],
            resources: [{ type: 'pods', resources: [pod] }],
          },
        ],
      });
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

      const { server } = await startTestBackend({
        features: [
          minimalValidConfigService,
          import('@backstage/plugin-kubernetes-backend'),
          withClusters([
            {
              name: 'custom-cluster',
              url: 'http://my.cluster.url',
              authMetadata: {
                [ANNOTATION_KUBERNETES_AUTH_PROVIDER]: 'custom',
              },
            },
          ]),
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
                    presentAuthMetadata: jest.fn().mockReturnValue({}),
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
          entity: { metadata: { name: 'thing' } },
          auth: { custom: 'custom-token' },
        });

      expect(mockFetcher.fetchObjectsForService).toHaveBeenCalledWith(
        expect.objectContaining({
          credential: { type: 'bearer token', token: 'custom-token' },
        }),
      );
    });

    it('returns 403 response when permission blocks endpoint', async () => {
      app = await startPermissionDeniedTestServer();
      const response = await request(app).post(
        '/api/kubernetes/services/test-service',
      );
      expect(response.status).toEqual(403);
    });
  });

  describe('/proxy', () => {
    const worker = setupServer();
    registerMswTestHooks(worker);

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

    it('forwards request body to k8s', async () => {
      const namespaceManifest = {
        kind: 'Namespace',
        apiVersion: 'v1',
        metadata: { name: 'new-ns' },
      };

      const proxyEndpointRequest = request(app)
        .post('/api/kubernetes/proxy/api/v1/namespaces')
        .set(HEADER_KUBERNETES_CLUSTER, 'some-cluster')
        .set(HEADER_KUBERNETES_AUTH, 'randomtoken')
        .send(namespaceManifest);
      worker.use(rest.all(proxyEndpointRequest.url, req => req.passthrough()));
      const response = await proxyEndpointRequest;

      expect(response.body).toStrictEqual(namespaceManifest);
    });

    it('supports yaml content type', async () => {
      const yamlManifest = `---
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
        .send(yamlManifest);

      worker.use(rest.all(proxyEndpointRequest.url, req => req.passthrough()));

      const response = await proxyEndpointRequest;
      expect(response.text).toEqual(yamlManifest);
    });

    it('returns 403 response when permission blocks endpoint', async () => {
      app = await startPermissionDeniedTestServer();

      const proxyEndpointRequest = request(app)
        .post('/api/kubernetes/proxy/api/v1/namespaces')
        .set(HEADER_KUBERNETES_CLUSTER, 'some-cluster')
        .set(HEADER_KUBERNETES_AUTH, 'randomtoken')
        .send({
          kind: 'Namespace',
          apiVersion: 'v1',
          metadata: { name: 'new-ns' },
        });

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

      const { server } = await startTestBackend({
        features: [
          minimalValidConfigService,
          import('@backstage/plugin-kubernetes-backend'),
          withClusters([
            {
              name: 'custom-cluster',
              url: 'http://my.cluster.url',
              authMetadata: { [ANNOTATION_KUBERNETES_AUTH_PROVIDER]: 'custom' },
            },
          ]),
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
                    presentAuthMetadata: jest.fn().mockReturnValue({}),
                  });
                },
              });
            },
          }),
        ],
      });

      const proxyEndpointRequest = request(server)
        .get('/api/kubernetes/proxy/api/v1/namespaces')
        .set(HEADER_KUBERNETES_CLUSTER, 'custom-cluster')
        .set(HEADER_KUBERNETES_AUTH, 'custom-token');
      worker.use(rest.all(proxyEndpointRequest.url, req => req.passthrough()));
      const response = await proxyEndpointRequest;

      expect(response.body).toStrictEqual({ items: [] });
    });

    it('reads custom auth metadata from config', async () => {
      const authStrategy = {
        getCredential: jest.fn().mockResolvedValue({ type: 'anonymous' }),
        validateCluster: jest.fn().mockReturnValue([]),
        presentAuthMetadata: jest.fn().mockReturnValue({}),
      };
      worker.use(
        rest.get('http://my.cluster/api', (_req, res, ctx) =>
          res(ctx.json({})),
        ),
      );
      const { server } = await startTestBackend({
        features: [
          mockServices.rootConfig.factory({
            data: {
              kubernetes: {
                serviceLocatorMethod: { type: 'multiTenant' },
                clusterLocatorMethods: [
                  {
                    type: 'config',
                    clusters: [
                      {
                        name: 'cluster',
                        url: 'http://my.cluster',
                        authProvider: 'custom',
                        authMetadata: { 'custom-key': 'custom-value' },
                      },
                    ],
                  },
                ],
              },
            },
          }),
          import('@backstage/plugin-kubernetes-backend'),
          createBackendModule({
            pluginId: 'kubernetes',
            moduleId: 'testAuthStrategy',
            register(env) {
              env.registerInit({
                deps: { extension: kubernetesAuthStrategyExtensionPoint },
                async init({ extension }) {
                  extension.addAuthStrategy('custom', authStrategy);
                },
              });
            },
          }),
        ],
      });
      app = server;

      const proxyEndpointRequest = request(app).get(
        '/api/kubernetes/proxy/api',
      );
      worker.use(rest.all(proxyEndpointRequest.url, req => req.passthrough()));
      const response = await proxyEndpointRequest;

      expect(response.body).toStrictEqual({});
      expect(authStrategy.getCredential).toHaveBeenCalledWith(
        expect.objectContaining({
          authMetadata: expect.objectContaining({
            'custom-key': 'custom-value',
          }),
        }),
        expect.anything(),
      );
    });
  });

  it('forbids custom auth strategies with dashes', () => {
    const throwError = () =>
      startTestBackend({
        features: [
          mockServices.rootConfig.factory({
            data: {
              kubernetes: {
                serviceLocatorMethod: { type: 'multiTenant' },
                clusterLocatorMethods: [
                  {
                    type: 'config',
                    clusters: [],
                  },
                ],
              },
            },
          }),
          import('@backstage/plugin-kubernetes-backend'),
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
                    presentAuthMetadata: jest.fn().mockReturnValue({}),
                  });
                },
              });
            },
          }),
        ],
      });
    return expect(throwError).rejects.toThrow(
      'Strategy name can not include dashes',
    );
  });

  it('serves permission integration endpoint', async () => {
    const response = await request(app)
      .get('/api/kubernetes/.well-known/backstage/permissions/metadata')
      .set('authorization', mockCredentials.service.header());

    expect(response.status).toEqual(200);
    expect(response.body).toMatchObject({
      permissions: [
        { type: 'basic', name: 'kubernetes.proxy', attributes: {} },
        { type: 'basic', name: 'kubernetes.resources.read', attributes: {} },
        { type: 'basic', name: 'kubernetes.clusters.read', attributes: {} },
      ],
      rules: [],
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
          import('@backstage/plugin-kubernetes-backend'),
        ],
      }),
    ).rejects.toThrow(
      'Unsupported kubernetes.serviceLocatorMethod "unsupported"',
    );
  });
});
