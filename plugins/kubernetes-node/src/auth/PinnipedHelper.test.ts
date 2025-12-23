/*
 * Copyright 2024 The Backstage Authors
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

// Spy to capture proxy router targets (which include cert/key)
const proxyRouterTargets: any[] = [];

// Mock http-proxy-middleware to spy on router function calls
jest.mock('http-proxy-middleware', () => {
  const actual = jest.requireActual('http-proxy-middleware');
  return {
    ...actual,
    createProxyMiddleware: (options: any) => {
      const originalRouter = options.router;
      if (originalRouter) {
        options.router = async (req: any) => {
          const target = await originalRouter(req);
          proxyRouterTargets.push(target);
          return target;
        };
      }
      return actual.createProxyMiddleware(options);
    },
  };
});

import { ClusterDetails } from '../types';
import { mockServices, startTestBackend } from '@backstage/backend-test-utils';
import { createBackendModule } from '@backstage/backend-plugin-api';
import {
  kubernetesAuthStrategyExtensionPoint,
  kubernetesClusterSupplierExtensionPoint,
} from '../extensions';
import request from 'supertest';
import {
  ANNOTATION_KUBERNETES_AUTH_PROVIDER,
  KubernetesRequestAuth,
} from '@backstage/plugin-kubernetes-common';
import { PinnipedHelper, PinnipedParameters } from './PinnipedHelper';
import { HEADER_KUBERNETES_CLUSTER } from '@backstage/plugin-kubernetes-backend';
import { JsonObject } from '@backstage/types';
import { http, HttpResponse, passthrough } from 'msw';
import { setupServer } from 'msw/node';
import { ExtendedHttpServer } from '@backstage/backend-defaults/rootHttpRouter';

jest.setTimeout(60_000);

describe('Pinniped - tokenCredentialRequest', () => {
  let app: ExtendedHttpServer;
  const logger = mockServices.logger.mock();
  const worker = setupServer();

  beforeEach(async () => {
    const clusterSupplierMock = {
      getClusters: jest.fn().mockImplementation(_ => {
        return Promise.resolve([
          {
            name: 'custom-cluster',
            url: 'https://my.cluster.url',
            authMetadata: {
              [ANNOTATION_KUBERNETES_AUTH_PROVIDER]: 'pinniped',
            },
            skipTLSVerify: true,
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
        import('@backstage/plugin-kubernetes-backend'),
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
          moduleId: 'PinnipedAuthStrategy',
          register(env) {
            env.registerInit({
              deps: { extension: kubernetesAuthStrategyExtensionPoint },
              async init({ extension }) {
                extension.addAuthStrategy('pinniped', {
                  getCredential: async (
                    clusterDetails: ClusterDetails,
                    authConfig: KubernetesRequestAuth,
                  ) => {
                    const pinnipedHelper = new PinnipedHelper(logger);
                    const pinnipedParams: PinnipedParameters = {
                      clusterScopedIdToken:
                        ((authConfig.pinniped as JsonObject)
                          ?.clusteridtoken as string) || '',
                      authenticator: {
                        apiGroup: 'authentication.concierge.pinniped.dev',
                        kind: 'JWTAuthenticator',
                        name: 'supervisor',
                      },
                    };
                    const clientCerts =
                      await pinnipedHelper.tokenCredentialRequest(
                        clusterDetails,
                        pinnipedParams,
                      );
                    return {
                      type: 'x509 client certificate',
                      key: clientCerts.key,
                      cert: clientCerts.cert,
                    };
                  },
                  validateCluster: jest.fn().mockReturnValue([]),
                  presentAuthMetadata: jest.fn().mockReturnValue({}),
                });
              },
            });
          },
        }),
      ],
    });

    app = server;
  });

  describe('TLS Clusters', () => {
    beforeAll(() => {
      worker.listen();
    });

    afterAll(() => {
      worker.close();
    });

    beforeEach(() => {
      proxyRouterTargets.splice(0);
      worker.resetHandlers();
    });

    it('Should get certs data from Concierge', async () => {
      worker.use(
        http.get('https://my.cluster.url/api/v1/namespaces', () => {
          return HttpResponse.json({ items: [] });
        }),
      );

      const myCert = 'MOCKCert';
      const myKey = 'MOCKKey';

      worker.use(
        http.post(
          'https://my.cluster.url/apis/login.concierge.pinniped.dev/v1alpha1/tokencredentialrequests',
          () => {
            return HttpResponse.json({
              status: {
                credential: {
                  clientKeyData: myKey,
                  clientCertificateData: myCert,
                  expirationTimestamp: '2024-01-04T14:30:30.373Z',
                },
              },
            });
          },
        ),
      );

      const proxyEndpointRequest = request(app)
        .get('/api/kubernetes/proxy/api/v1/namespaces')
        .set(HEADER_KUBERNETES_CLUSTER, 'custom-cluster')
        .set(
          'Backstage-Kubernetes-Authorization-Pinniped-ClusterIDToken',
          'ClusterID Specific Token',
        );

      worker.use(http.all(proxyEndpointRequest.url, () => passthrough()));

      const result = await proxyEndpointRequest;

      // Verify successful response from namespace API
      expect(result.status).toBe(200);
      expect(JSON.parse(result.text)).toEqual({ items: [] });

      // Verify cert/key were passed to the proxy router target
      // The proxy router is called for each proxied request
      // We expect to find a target with the cert/key from Pinniped
      const targetWithCreds = proxyRouterTargets.find(
        target => target?.cert && target?.key,
      );

      expect(targetWithCreds).toBeDefined();
      expect(targetWithCreds.cert).toBe(myCert);
      expect(targetWithCreds.key).toBe(myKey);
    });

    it('Should get certs data from TMC-flavoured Pinniped', async () => {
      worker.use(
        http.get('https://my.cluster.url/api/v1/namespaces', () => {
          return HttpResponse.json({ items: [] });
        }),
      );

      const myCert = 'MOCKCert2';
      const myKey = 'MOCKKey2';

      worker.use(
        http.post(
          'https://my.cluster.url/apis/login.concierge.pinniped.tmc.cloud.vmware.com/v1alpha1/tokencredentialrequests',
          () => {
            return HttpResponse.json({
              status: {
                credential: {
                  clientKeyData: myKey,
                  clientCertificateData: myCert,
                  expirationTimestamp: '2024-01-04T14:30:30.373Z',
                },
              },
            });
          },
        ),
      );

      const clusterSupplierMock = {
        getClusters: jest.fn().mockImplementation(_ => {
          return Promise.resolve([
            {
              name: 'tmc-cluster',
              url: 'https://my.cluster.url',
              authMetadata: {
                [ANNOTATION_KUBERNETES_AUTH_PROVIDER]: 'pinnipedtmc',
              },
              skipTLSVerify: true,
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
          import('@backstage/plugin-kubernetes-backend'),
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
            moduleId: 'PinnipedAuthStrategy',
            register(env) {
              env.registerInit({
                deps: { extension: kubernetesAuthStrategyExtensionPoint },
                async init({ extension }) {
                  extension.addAuthStrategy('pinnipedtmc', {
                    getCredential: async (
                      clusterDetails: ClusterDetails,
                      authConfig: KubernetesRequestAuth,
                    ) => {
                      const pinnipedHelper = new PinnipedHelper(logger);
                      const pinnipedParams: PinnipedParameters = {
                        clusterScopedIdToken:
                          ((authConfig.pinniped as JsonObject)
                            ?.clusteridtoken as string) || '',
                        authenticator: {
                          apiGroup:
                            'authentication.concierge.pinniped.tmc.cloud.vmware.com',
                          kind: 'WebhookAuthenticator',
                          name: 'supervisor',
                        },
                        tokenCredentialRequest: {
                          apiGroup:
                            'login.concierge.pinniped.tmc.cloud.vmware.com/v1alpha1',
                        },
                      };
                      const clientCerts =
                        await pinnipedHelper.tokenCredentialRequest(
                          clusterDetails,
                          pinnipedParams,
                        );
                      return {
                        type: 'x509 client certificate',
                        key: clientCerts.key,
                        cert: clientCerts.cert,
                      };
                    },
                    validateCluster: jest.fn().mockReturnValue([]),
                    presentAuthMetadata: jest.fn().mockReturnValue({}),
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
        .set(HEADER_KUBERNETES_CLUSTER, 'tmc-cluster')
        .set(
          'Backstage-Kubernetes-Authorization-Pinniped-ClusterIDToken',
          'ClusterID Specific Token',
        );

      worker.use(http.all(proxyEndpointRequest.url, () => passthrough()));

      const result = await proxyEndpointRequest;

      // Verify successful response from namespace API
      expect(result.status).toBe(200);
      expect(JSON.parse(result.text)).toEqual({ items: [] });

      // Verify cert/key were passed to the proxy router target
      // The proxy router is called for each proxied request
      // We expect to find a target with the cert/key from Pinniped
      const targetWithCreds = proxyRouterTargets.find(
        target => target?.cert && target?.key,
      );

      expect(targetWithCreds).toBeDefined();
      expect(targetWithCreds.cert).toBe(myCert);
      expect(targetWithCreds.key).toBe(myKey);
    });

    it('Should get an error when Concierge return an error', async () => {
      worker.use(
        http.get('https://my.cluster.url/api/v1/namespaces', () => {
          return HttpResponse.json({ items: [] });
        }),
      );

      worker.use(
        http.post(
          'https://my.cluster.url/apis/login.concierge.pinniped.dev/v1alpha1/tokencredentialrequests',
          () => {
            return HttpResponse.json({
              kind: 'TokenCredentialRequest',
              apiVersion: 'login.concierge.pinniped.dev/v1alpha1',
              metadata: {
                creationTimestamp: null,
              },
              spec: {
                authenticator: {
                  apiGroup: null,
                  kind: '',
                  name: '',
                },
              },
              status: {
                message: 'authentication failed',
              },
            });
          },
        ),
      );

      const proxyEndpointRequest = request(app)
        .get('/api/kubernetes/proxy/api/v1/namespaces')
        .set(HEADER_KUBERNETES_CLUSTER, 'custom-cluster')
        .set(
          'Backstage-Kubernetes-Authorization-Pinniped-ClusterIDToken',
          'ClusterID Specific Token',
        );

      worker.use(http.all(proxyEndpointRequest.url, () => passthrough()));

      const result = await proxyEndpointRequest;

      // Verify error response when Pinniped authentication fails
      expect(JSON.stringify(result)).toMatch(/error/);
    });
  });
});
