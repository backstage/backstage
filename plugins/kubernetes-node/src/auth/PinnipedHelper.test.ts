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

import { ExtendedHttpServer } from '@backstage/backend-app-api';
import { ClusterDetails } from '../types';
import {
  mockServices,
  setupRequestMockHandlers,
  startTestBackend,
} from '@backstage/backend-test-utils';
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
import { getVoidLogger } from '@backstage/backend-common';
import { HEADER_KUBERNETES_CLUSTER } from '@backstage/plugin-kubernetes-backend';
import { JsonObject } from '@backstage/types';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

describe('Pinniped - tokenCredentialRequest', () => {
  let app: ExtendedHttpServer;
  const logger = getVoidLogger();
  let httpsRequest: jest.SpyInstance;
  const worker = setupServer();
  setupRequestMockHandlers(worker);

  beforeAll(() => {
    httpsRequest = jest.spyOn(
      // this is pretty egregious reverse engineering of msw.
      // If the SetupServerApi constructor was exported, we wouldn't need
      // to be quite so hacky here
      (worker as any).interceptor.interceptors[0].modules.get('https'),
      'request',
    );
  });

  beforeEach(async () => {
    httpsRequest.mockClear();

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
    it('Should get certs data from Concierge', async () => {
      worker.use(
        rest.get('https://my.cluster.url/api/v1/namespaces', (_, res, ctx) => {
          return res(ctx.json({ items: [] }));
        }),
      );

      const myCert = 'MOCKCert';
      const myKey = 'MOCKKey';

      worker.use(
        rest.post(
          'https://my.cluster.url/apis/login.concierge.pinniped.dev/v1alpha1/tokencredentialrequests',
          (_, res, ctx) => {
            return res(
              ctx.json({
                status: {
                  credential: {
                    clientKeyData: myKey,
                    clientCertificateData: myCert,
                    expirationTimestamp: '2024-01-04T14:30:30.373Z',
                  },
                },
              }),
            );
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

      worker.use(rest.all(proxyEndpointRequest.url, req => req.passthrough()));

      const result = await proxyEndpointRequest;

      expect(JSON.stringify(result)).toMatch(/PEM/);

      expect(httpsRequest).toHaveBeenCalledTimes(2);
      const [{ cert, key }] = httpsRequest.mock.calls[1];
      expect(cert).toEqual(myCert);
      expect(key).toEqual(myKey);
    });

    it('Should get certs data from TMC-flavoured Pinniped', async () => {
      worker.use(
        rest.get('https://my.cluster.url/api/v1/namespaces', (_, res, ctx) => {
          return res(ctx.json({ items: [] }));
        }),
      );

      const myCert = 'MOCKCert2';
      const myKey = 'MOCKKey2';

      worker.use(
        rest.post(
          'https://my.cluster.url/apis/login.concierge.pinniped.tmc.cloud.vmware.com/v1alpha1/tokencredentialrequests',
          (_, res, ctx) => {
            return res(
              ctx.json({
                status: {
                  credential: {
                    clientKeyData: myKey,
                    clientCertificateData: myCert,
                    expirationTimestamp: '2024-01-04T14:30:30.373Z',
                  },
                },
              }),
            );
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

      worker.use(rest.all(proxyEndpointRequest.url, req => req.passthrough()));

      const result = await proxyEndpointRequest;

      expect(JSON.stringify(result)).toMatch(/PEM/);

      expect(httpsRequest).toHaveBeenCalledTimes(2);
      const [{ cert, key }] = httpsRequest.mock.calls[1];
      expect(cert).toEqual(myCert);
      expect(key).toEqual(myKey);
    });

    it('Should get an error when Concierge return an error', async () => {
      worker.use(
        rest.get('https://my.cluster.url/api/v1/namespaces', (_, res, ctx) => {
          return res(ctx.json({ items: [] }));
        }),
      );

      worker.use(
        rest.post(
          'https://my.cluster.url/apis/login.concierge.pinniped.dev/v1alpha1/tokencredentialrequests',
          (_, res, ctx) => {
            return res(
              ctx.json({
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
              }),
            );
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

      worker.use(rest.all(proxyEndpointRequest.url, req => req.passthrough()));

      const result = await proxyEndpointRequest;

      expect(JSON.stringify(result)).toMatch(/error/);

      expect(httpsRequest).toHaveBeenCalledTimes(1);
    });
  });
});
