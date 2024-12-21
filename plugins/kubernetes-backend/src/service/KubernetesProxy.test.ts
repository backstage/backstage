/*
 * Copyright 2022 The Backstage Authors
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

import 'buffer';
import { resolve as resolvePath } from 'path';
import {
  createMockDirectory,
  mockServices,
  registerMswTestHooks,
} from '@backstage/backend-test-utils';
import { NotFoundError } from '@backstage/errors';
import { AuthorizeResult } from '@backstage/plugin-permission-common';
import {
  ANNOTATION_KUBERNETES_AUTH_PROVIDER,
  KubernetesRequestAuth,
} from '@backstage/plugin-kubernetes-common';
import { getMockReq, getMockRes } from '@jest-mock/express';
import express from 'express';
import Router from 'express-promise-router';
import { Server } from 'http';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import request from 'supertest';
import { AddressInfo, WebSocket, WebSocketServer } from 'ws';

import { LocalKubectlProxyClusterLocator } from '../cluster-locator/LocalKubectlProxyLocator';
import {
  AuthenticationStrategy,
  AnonymousStrategy,
  KubernetesCredential,
} from '../auth';
import { ClusterDetails, KubernetesClustersSupplier } from '../types/types';
import {
  APPLICATION_JSON,
  HEADER_KUBERNETES_AUTH,
  HEADER_KUBERNETES_CLUSTER,
  KubernetesProxy,
} from './KubernetesProxy';

import type { Request } from 'express';
import { BackstageCredentials } from '@backstage/backend-plugin-api';
import { MiddlewareFactory } from '@backstage/backend-defaults/rootHttpRouter';

const middleware = MiddlewareFactory.create({
  logger: mockServices.logger.mock(),
  config: mockServices.rootConfig(),
});

const mockCertDir = createMockDirectory({
  content: {
    'ca.crt': 'MOCKCA',
  },
});

describe('KubernetesProxy', () => {
  let proxy: KubernetesProxy;
  let authStrategy: jest.Mocked<AuthenticationStrategy>;
  const worker = setupServer();
  const logger = mockServices.logger.mock();

  const clusterSupplier: jest.Mocked<KubernetesClustersSupplier> = {
    getClusters: jest.fn<
      Promise<ClusterDetails[]>,
      [{ credentials: BackstageCredentials }]
    >(),
  };

  const permissionApi = mockServices.permissions.mock();
  const mockDisocveryApi = mockServices.discovery.mock();

  registerMswTestHooks(worker);

  const buildMockRequest = (clusterName: any, path: string): Request => {
    const req = getMockReq({
      params: {
        path,
      },
      headers: {
        'content-type': 'application/json',
        [HEADER_KUBERNETES_CLUSTER.toLowerCase()]: clusterName,
      },
      header: jest.fn((key: string) => {
        switch (key) {
          case 'Content-Type': {
            return APPLICATION_JSON;
          }
          case HEADER_KUBERNETES_CLUSTER: {
            return clusterName;
          }
          default: {
            return '';
          }
        }
      }),
    });

    return req;
  };

  const setupProxyPromise = ({
    proxyPath,
    requestPath,
    headers,
  }: {
    proxyPath: string;
    requestPath: string;
    headers?: Record<string, string>;
  }) => {
    const app = express().use(
      Router()
        .use(proxyPath, proxy.createRequestHandler({ permissionApi }))
        .use(middleware.error()),
    );

    const requestPromise = request(app).get(proxyPath + requestPath);

    if (headers) {
      for (const [headerName, headerValue] of Object.entries(headers)) {
        requestPromise.set(headerName, headerValue);
      }
    }

    // Let this request through so it reaches the express router above
    worker.use(rest.all(requestPromise.url, (req: any) => req.passthrough()));

    return requestPromise;
  };

  beforeEach(() => {
    authStrategy = {
      getCredential: jest
        .fn<
          Promise<KubernetesCredential>,
          [ClusterDetails, KubernetesRequestAuth]
        >()
        .mockResolvedValue({ type: 'anonymous' }),
      validateCluster: jest.fn(),
      presentAuthMetadata: jest.fn(),
    };
    proxy = new KubernetesProxy({
      logger,
      clusterSupplier,
      authStrategy,
      discovery: mockDisocveryApi,
    });
    permissionApi.authorize.mockResolvedValue([
      { result: AuthorizeResult.ALLOW },
    ]);
  });

  it('should return a ERROR_NOT_FOUND if no clusters are found', async () => {
    clusterSupplier.getClusters.mockResolvedValue([]);

    const req = buildMockRequest('test', 'api');
    const { res, next } = getMockRes();

    await expect(
      proxy.createRequestHandler({ permissionApi })(req, res, next),
    ).rejects.toThrow(NotFoundError);
  });

  it('should return a ERROR_NOT_FOUND if multi-cluster & no cluster selected', async () => {
    clusterSupplier.getClusters.mockResolvedValue([
      {
        name: 'local',
        url: 'http:/localhost:8001',
        authMetadata: {},
        skipMetricsLookup: true,
      },
      {
        name: 'cluster1',
        url: 'https://localhost:9999',
        authMetadata: {},
      },
    ]);

    const req = buildMockRequest(undefined, 'api');
    const { res, next } = getMockRes();

    await expect(
      proxy.createRequestHandler({ permissionApi })(req, res, next),
    ).rejects.toThrow(NotFoundError);
  });

  it('should return a ERROR_NOT_FOUND if selected cluster not in config', async () => {
    clusterSupplier.getClusters.mockResolvedValue([
      {
        name: 'cluster1',
        url: 'https://localhost:9999',
        authMetadata: {},
      },
    ]);

    const req = buildMockRequest('test', 'api');
    const { res, next } = getMockRes();

    await expect(
      proxy.createRequestHandler({ permissionApi })(req, res, next),
    ).rejects.toThrow(NotFoundError);
  });

  it('should pass the exact response from Kubernetes', async () => {
    const apiResponse = {
      kind: 'APIVersions',
      versions: ['v1'],
      serverAddressByClientCIDRs: [
        {
          clientCIDR: '0.0.0.0/0',
          serverAddress: '192.168.0.1:3333',
        },
      ],
    };

    clusterSupplier.getClusters.mockResolvedValue([
      {
        name: 'cluster1',
        url: 'https://localhost:9999',
        authMetadata: {},
      },
    ]);

    worker.use(
      rest.get('https://localhost:9999/api', (_: any, res: any, ctx: any) =>
        res(ctx.status(299), ctx.json(apiResponse)),
      ),
    );

    const requestPromise = setupProxyPromise({
      proxyPath: '/mountpath',
      requestPath: '/api',
      headers: { [HEADER_KUBERNETES_CLUSTER]: 'cluster1' },
    });

    const response = await requestPromise;

    expect(response.status).toEqual(299);
    expect(response.body).toStrictEqual(apiResponse);
  });

  it('should pass the exact response from Kubernetes default cluster & no cluster selected in single cluster setup', async () => {
    const apiResponse = {
      kind: 'APIVersions',
      versions: ['v1'],
      serverAddressByClientCIDRs: [
        {
          clientCIDR: '0.0.0.0/0',
          serverAddress: '192.168.0.1:3333',
        },
      ],
    };

    clusterSupplier.getClusters.mockResolvedValue([
      {
        name: 'cluster1',
        url: 'https://localhost:9999',
        authMetadata: {},
      },
    ]);

    worker.use(
      rest.get('https://localhost:9999/api', (_: any, res: any, ctx: any) =>
        res(ctx.status(299), ctx.json(apiResponse)),
      ),
    );

    const requestPromise = setupProxyPromise({
      proxyPath: '/mountpath',
      requestPath: '/api',
    });

    const response = await requestPromise;

    expect(response.status).toEqual(299);
    expect(response.body).toStrictEqual(apiResponse);
  });

  it('sets host header to support clusters behind name-based virtual hosts', async () => {
    worker.use(
      rest.get(
        'http://localhost:9999/api/v1/namespaces',
        (req: any, res: any, ctx: any) => {
          const host = req.headers.get('Host');
          return host === 'localhost:9999'
            ? res(ctx.status(200))
            : res.networkError(`Host '${host}' is not in the cert's altnames`);
        },
      ),
    );

    clusterSupplier.getClusters.mockResolvedValue([
      {
        name: 'cluster1',
        url: 'http://localhost:9999',
        authMetadata: {},
      },
    ]);

    const requestPromise = setupProxyPromise({
      proxyPath: '/mountpath',
      requestPath: '/api/v1/namespaces',

      headers: { [HEADER_KUBERNETES_CLUSTER]: 'cluster1' },
    });

    const response = await requestPromise;

    expect(response.status).toEqual(200);
  });

  it('should default to using a strategy-provided bearer token as authorization headers to kubeapi when backstage-kubernetes-auth field is not provided', async () => {
    worker.use(
      rest.get(
        'https://localhost:9999/api/v1/namespaces',
        (req: any, res: any, ctx: any) => {
          if (!req.headers.get('Authorization')) {
            return res(ctx.status(401));
          }

          if (
            req.headers.get('Authorization') !==
            'Bearer strategy-provided-token'
          ) {
            return res(ctx.status(403));
          }

          return res(
            ctx.status(200),
            ctx.json({
              kind: 'NamespaceList',
              apiVersion: 'v1',
              items: [],
            }),
          );
        },
      ),
    );

    clusterSupplier.getClusters.mockResolvedValue([
      {
        name: 'cluster1',
        url: 'https://localhost:9999',
        authMetadata: {},
      },
    ]);

    authStrategy.getCredential.mockResolvedValue({
      type: 'bearer token',
      token: 'strategy-provided-token',
    });

    const requestPromise = setupProxyPromise({
      proxyPath: '/mountpath',
      requestPath: '/api/v1/namespaces',

      headers: { [HEADER_KUBERNETES_CLUSTER]: 'cluster1' },
    });

    const response = await requestPromise;

    expect(response.status).toEqual(200);
  });

  it('should add an authStrategy-provided serviceAccountToken as authorization headers to kubeapi if one isnt provided in request and one isnt set up in cluster details', async () => {
    worker.use(
      rest.get('https://localhost:9999/api/v1/namespaces', (req, res, ctx) => {
        if (!req.headers.get('Authorization')) {
          return res(ctx.status(401));
        }

        if (req.headers.get('Authorization') !== 'Bearer my-token') {
          return res(ctx.status(403));
        }

        return res(
          ctx.status(200),
          ctx.json({
            kind: 'NamespaceList',
            apiVersion: 'v1',
            items: [],
          }),
        );
      }),
    );

    clusterSupplier.getClusters.mockResolvedValue([
      {
        name: 'cluster1',
        url: 'https://localhost:9999',
        authMetadata: {},
      },
    ]);

    authStrategy.getCredential.mockResolvedValue({
      type: 'bearer token',
      token: 'my-token',
    });

    const requestPromise = setupProxyPromise({
      proxyPath: '/mountpath',
      requestPath: '/api/v1/namespaces',

      headers: { [HEADER_KUBERNETES_CLUSTER]: 'cluster1' },
    });

    const response = await requestPromise;

    expect(response.status).toEqual(200);
    expect(response.body).toStrictEqual({
      kind: 'NamespaceList',
      apiVersion: 'v1',
      items: [],
    });
  });

  it('should append the Backstage-Kubernetes-Auth field to the requests authorization header if one is provided', async () => {
    worker.use(
      rest.get('https://localhost:9999/api/v1/namespaces', (req, res, ctx) => {
        if (!req.headers.get('Authorization')) {
          return res(ctx.status(401));
        }

        if (req.headers.get('Authorization') !== 'tokenB') {
          return res(ctx.status(403));
        }

        return res(
          ctx.status(200),
          ctx.json({
            kind: 'NamespaceList',
            apiVersion: 'v1',
            items: [],
          }),
        );
      }),
    );

    clusterSupplier.getClusters.mockResolvedValue([
      {
        name: 'cluster1',
        url: 'https://localhost:9999',
        authMetadata: {},
      },
    ]);

    authStrategy.getCredential.mockResolvedValue({
      type: 'bearer token',
      token: 'tokenA',
    });

    const requestPromise = setupProxyPromise({
      proxyPath: '/mountpath',
      requestPath: '/api/v1/namespaces',

      headers: {
        [HEADER_KUBERNETES_CLUSTER]: 'cluster1',
        [HEADER_KUBERNETES_AUTH]: 'tokenB',
      },
    });

    const response = await requestPromise;

    expect(response.status).toEqual(200);
    expect(response.body).toStrictEqual({
      kind: 'NamespaceList',
      apiVersion: 'v1',
      items: [],
    });
  });

  it('should not invoke authStrategy if Backstage-Kubernetes-Authorization field is provided', async () => {
    worker.use(
      rest.get('https://localhost:9999/api/v1/namespaces', (req, res, ctx) => {
        if (!req.headers.get('Authorization')) {
          return res(ctx.status(401));
        }

        if (req.headers.get('Authorization') !== 'tokenB') {
          return res(ctx.status(403));
        }

        return res(
          ctx.status(200),
          ctx.json({
            kind: 'NamespaceList',
            apiVersion: 'v1',
            items: [],
          }),
        );
      }),
    );

    clusterSupplier.getClusters.mockResolvedValue([
      {
        name: 'cluster1',
        url: 'https://localhost:9999',
        authMetadata: {},
      },
    ]);

    const requestPromise = setupProxyPromise({
      proxyPath: '/mountpath',
      requestPath: '/api/v1/namespaces',

      headers: {
        [HEADER_KUBERNETES_CLUSTER]: 'cluster1',
        [HEADER_KUBERNETES_AUTH]: 'tokenB',
      },
    });

    const response = await requestPromise;

    expect(authStrategy.getCredential).toHaveBeenCalledTimes(0);
    expect(response.status).toEqual(200);
    expect(response.body).toStrictEqual({
      kind: 'NamespaceList',
      apiVersion: 'v1',
      items: [],
    });
  });

  it('should invoke AuthStrategy if Backstage-Kubernetes-Authorization-X-X are provided', async () => {
    const strategy: jest.Mocked<AuthenticationStrategy> = {
      getCredential: jest
        .fn()
        .mockReturnValue({ type: 'bearer token', token: 'MY_TOKEN3' }),
      validateCluster: jest.fn(),
      presentAuthMetadata: jest.fn(),
    };

    proxy = new KubernetesProxy({
      logger: mockServices.logger.mock(),
      clusterSupplier: clusterSupplier,
      authStrategy: strategy,
      discovery: mockDisocveryApi,
    });

    worker.use(
      rest.get('https://localhost:9999/api/v1/namespaces', (req, res, ctx) => {
        if (!req.headers.get('Authorization')) {
          return res(ctx.status(401));
        }

        if (req.headers.get('Authorization') !== 'Bearer MY_TOKEN3') {
          return res(ctx.status(403));
        }

        return res(
          ctx.status(200),
          ctx.json({
            kind: 'NamespaceList',
            apiVersion: 'v1',
            items: [],
          }),
        );
      }),
    );

    clusterSupplier.getClusters.mockResolvedValue([
      {
        name: 'cluster1',
        url: 'https://localhost:9999',
        authMetadata: {},
      },
    ]);

    const requestPromise = setupProxyPromise({
      proxyPath: '/mountpath',
      requestPath: '/api/v1/namespaces',

      headers: {
        [HEADER_KUBERNETES_CLUSTER]: 'cluster1',
        'Backstage-Kubernetes-Authorization-google': 'MY_TOKEN1',
        'Backstage-Kubernetes-Authorization-aks': 'MY_TOKEN2',
        'Backstage-Kubernetes-Authorization-oidc-okta': 'MY_TOKEN3',
        'Backstage-Kubernetes-Authorization-oidc-gitlab': 'MY_TOKEN4',
        'Backstage-Kubernetes-Authorization-pinniped-audience1': 'MY_TOKEN5',
        'Backstage-Kubernetes-Authorization-pinniped-au-b-c-d-e': 'MY_TOKEN6',
      },
    });

    const response = await requestPromise;

    const authObj = {
      google: 'MY_TOKEN1',
      aks: 'MY_TOKEN2',
      oidc: { okta: 'MY_TOKEN3', gitlab: 'MY_TOKEN4' },
      pinniped: { audience1: 'MY_TOKEN5', 'au-b-c-d-e': 'MY_TOKEN6' },
    };

    expect(strategy.getCredential).toHaveBeenCalledTimes(1);
    expect(strategy.getCredential).toHaveBeenCalledWith(
      expect.anything(),
      authObj,
    );
    expect(response.status).toEqual(200);
    expect(response.body).toStrictEqual({
      kind: 'NamespaceList',
      apiVersion: 'v1',
      items: [],
    });
  });

  it('should invoke the Auth strategy with an empty auth object when no Backstage-Kubernetes-Authorization-X-X are provided', async () => {
    worker.use(
      rest.get('https://localhost:9999/api/v1/namespaces', (_, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({
            kind: 'NamespaceList',
            apiVersion: 'v1',
            items: [],
          }),
        );
      }),
    );

    clusterSupplier.getClusters.mockResolvedValue([
      {
        name: 'cluster1',
        url: 'https://localhost:9999',
        authMetadata: {},
      },
    ]);

    const requestPromise = setupProxyPromise({
      proxyPath: '/mountpath',
      requestPath: '/api/v1/namespaces',

      headers: {
        [HEADER_KUBERNETES_CLUSTER]: 'cluster1',
      },
    });

    const response = await requestPromise;

    const authObj = {};

    expect(authStrategy.getCredential).toHaveBeenCalledTimes(1);
    expect(authStrategy.getCredential).toHaveBeenCalledWith(
      expect.anything(),
      authObj,
    );
    expect(response.status).toEqual(200);
    expect(response.body).toStrictEqual({
      kind: 'NamespaceList',
      apiVersion: 'v1',
      items: [],
    });
  });

  it('returns a response with a localKubectlProxy auth provider configuration', async () => {
    proxy = new KubernetesProxy({
      logger: mockServices.logger.mock(),
      clusterSupplier: new LocalKubectlProxyClusterLocator(),
      authStrategy: new AnonymousStrategy(),
      discovery: mockDisocveryApi,
    });

    worker.use(
      rest.get('http://127.0.0.1:8001/api/v1/namespaces', (req, res, ctx) => {
        return req.headers.get('Authorization')
          ? res(ctx.status(401))
          : res(
              ctx.status(200),
              ctx.json({
                kind: 'NamespaceList',
                apiVersion: 'v1',
                items: [],
              }),
            );
      }),
    );

    const requestPromise = setupProxyPromise({
      proxyPath: '/mountpath',
      requestPath: '/api/v1/namespaces',

      headers: {
        [HEADER_KUBERNETES_CLUSTER]: 'local',
      },
    });

    const response = await requestPromise;

    expect(response.status).toEqual(200);
    expect(response.body).toStrictEqual({
      kind: 'NamespaceList',
      apiVersion: 'v1',
      items: [],
    });
  });

  it('returns a 500 error if authStrategy errors out and Backstage-Kubernetes-Authorization field is not provided', async () => {
    worker.use(
      rest.get('https://localhost:9999/api/v1/namespaces', (req, res, ctx) => {
        if (!req.headers.get('Authorization')) {
          return res(ctx.status(401));
        }

        if (req.headers.get('Authorization') !== 'tokenB') {
          return res(ctx.status(403));
        }

        return res(
          ctx.status(200),
          ctx.json({
            kind: 'NamespaceList',
            apiVersion: 'v1',
            items: [],
          }),
        );
      }),
    );

    clusterSupplier.getClusters.mockResolvedValue([
      {
        name: 'cluster1',
        url: 'https://localhost:9999',
        authMetadata: {},
      },
    ]);

    authStrategy.getCredential.mockRejectedValue(Error('some internal error'));

    const requestPromise = setupProxyPromise({
      proxyPath: '/mountpath',
      requestPath: '/api/v1/namespaces',

      headers: {
        [HEADER_KUBERNETES_CLUSTER]: 'cluster1',
      },
    });

    const response = await requestPromise;

    expect(response.status).toEqual(500);
  });

  it('should get res through proxy with cluster url has sub path', async () => {
    worker.use(
      rest.get(
        'http://localhost:9999/subpath/api/v1/namespaces',
        (_req, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json({
              kind: 'NamespaceList',
              apiVersion: 'v1',
              items: [],
            }),
          );
        },
      ),
    );

    clusterSupplier.getClusters.mockResolvedValue([
      {
        name: 'cluster1',
        url: 'http://localhost:9999/subpath',
        authMetadata: {},
      },
    ]);

    const requestPromise = setupProxyPromise({
      proxyPath: '/mountpath',
      requestPath: '/api/v1/namespaces',

      headers: {
        [HEADER_KUBERNETES_CLUSTER]: 'cluster1',
      },
    });

    const response = await requestPromise;

    expect(response.status).toEqual(200);
  });

  describe('when server uses TLS', () => {
    let httpsRequest: jest.SpyInstance;
    beforeAll(() => {
      httpsRequest = jest.spyOn(
        // this is pretty egregious reverse engineering of msw.
        // If the SetupServerApi constructor was exported, we wouldn't need
        // to be quite so hacky here
        (worker as any).interceptor.interceptors[0].modules.get('https'),
        'request',
      );
    });
    beforeEach(() => {
      httpsRequest.mockClear();
    });
    describe('should pass the exact response from Kubernetes using the CA file', () => {
      it('should trust contents of specified caFile', async () => {
        const apiResponse = {
          kind: 'APIVersions',
          versions: ['v1'],
          serverAddressByClientCIDRs: [
            {
              clientCIDR: '0.0.0.0/0',
              serverAddress: '192.168.0.1:3333',
            },
          ],
        };

        clusterSupplier.getClusters.mockResolvedValue([
          {
            name: 'cluster1',
            url: 'https://localhost:9999',
            authMetadata: {},
            caFile: resolvePath(__dirname, '__fixtures__/mock-ca.crt'),
          },
        ] as ClusterDetails[]);

        worker.use(
          rest.get('https://localhost:9999/api', (_: any, res: any, ctx: any) =>
            res(ctx.status(299), ctx.json(apiResponse)),
          ),
        );

        const requestPromise = setupProxyPromise({
          proxyPath: '/mountpath',
          requestPath: '/api',
          headers: { [HEADER_KUBERNETES_CLUSTER]: 'cluster1' },
        });

        const response = await requestPromise;

        expect(response.status).toEqual(299);
        expect(response.body).toStrictEqual(apiResponse);

        expect(httpsRequest).toHaveBeenCalledTimes(1);
        const [[{ ca }]] = httpsRequest.mock.calls;
        expect(ca).toMatch('MOCKCA');
      });
    });

    it('should use a x509 client cert authentication strategy to consume kubeapi when backstage-kubernetes-auth field is not provided and the authStrategy enables x509 client cert authentication', async () => {
      worker.use(
        rest.get(
          'https://localhost:9999/api/v1/namespaces',
          (req: any, res: any, ctx: any) => {
            if (req.headers.get('Authorization')) {
              return res(ctx.status(403));
            }

            return res(
              ctx.status(200),
              ctx.json({
                kind: 'NamespaceList',
                apiVersion: 'v1',
                items: [],
              }),
            );
          },
        ),
      );

      clusterSupplier.getClusters.mockResolvedValue([
        {
          name: 'cluster1',
          url: 'https://localhost:9999',
          authMetadata: {},
        },
      ]);

      const myCert = 'MOCKCert';
      const myKey = 'MOCKKey';

      authStrategy.getCredential.mockResolvedValue({
        type: 'x509 client certificate',
        cert: myCert,
        key: myKey,
      });

      const requestPromise = setupProxyPromise({
        proxyPath: '/mountpath',
        requestPath: '/api/v1/namespaces',

        headers: { [HEADER_KUBERNETES_CLUSTER]: 'cluster1' },
      });

      const response = await requestPromise;

      expect(authStrategy.getCredential).toHaveBeenCalledTimes(1);
      expect(authStrategy.getCredential).toHaveBeenCalledWith(
        expect.anything(),
        {},
      );

      const [[{ key, cert }]] = httpsRequest.mock.calls;
      expect(cert).toEqual(myCert);
      expect(key).toEqual(myKey);

      // 500 Since the key and cert are fake
      expect(response.status).toEqual(500);
    });
  });

  describe('WebSocket', () => {
    const proxyPath = '/proxy';
    const wsPath = '/ws';

    let wsPort: number;
    let proxyPort: number;
    let wsEchoServer: WebSocketServer;
    let expressServer: Server;

    const eventPromiseFactory = (
      ws: WebSocket,
      event: 'connection' | 'open' | 'close' | 'error' | 'message',
    ) => new Promise(resolve => ws.once(event, x => resolve(x?.toString())));

    beforeEach(async () => {
      await new Promise(resolve => {
        expressServer = express()
          .use(
            Router()
              .use(proxyPath, proxy.createRequestHandler({ permissionApi }))
              .use(middleware.error()),
          )
          .listen(0, '0.0.0.0', () => {
            proxyPort = (expressServer.address() as AddressInfo).port;
            resolve(null);
          });
      });

      wsEchoServer = new WebSocketServer({
        port: 0,
        path: wsPath,
      });
      wsPort = (wsEchoServer.address() as AddressInfo).port;

      wsEchoServer.on('connection', (ws: WebSocket) => {
        ws.send('connected');

        ws.on('message', (message: string) => {
          ws.send(message);
        });
      });

      wsEchoServer.on('error', console.error);
    });

    afterEach(() => {
      wsEchoServer.close();
      expressServer.close();
    });

    it('should proxy websocket connections', async () => {
      clusterSupplier.getClusters.mockResolvedValue([
        {
          name: 'local',
          url: `http://localhost:${wsPort}`,
          authMetadata: {},
        },
      ]);

      const wsProxyAddress = `ws://127.0.0.1:${proxyPort}${proxyPath}${wsPath}`;
      const wsAddress = `ws://localhost:${wsPort}${wsPath}`;

      // Let this request through so it reaches the express router above
      worker.use(
        rest.all(wsAddress.replace('ws', 'http'), (req: any) =>
          req.passthrough(),
        ),
        rest.all(wsProxyAddress.replace('ws', 'http'), (req: any) =>
          req.passthrough(),
        ),
      );

      const webSocket = new WebSocket(wsProxyAddress);

      const connectMessagePromise = eventPromiseFactory(webSocket, 'message');

      await eventPromiseFactory(webSocket, 'open');

      const connectMessage = await connectMessagePromise;
      expect(connectMessage).toBe('connected');

      const echoMessagePromise = eventPromiseFactory(webSocket, 'message');
      webSocket.send('echo');

      const echoMessage = await echoMessagePromise;
      expect(echoMessage).toBe('echo');

      const closePromise = eventPromiseFactory(webSocket, 'close');
      webSocket.close();
      await closePromise;
    });
  });

  describe('Backstage running on k8s', () => {
    const initialHost = process.env.KUBERNETES_SERVICE_HOST;
    const initialPort = process.env.KUBERNETES_SERVICE_PORT;
    const initialCAPath = process.env.KUBERNETES_CA_FILE_PATH;

    beforeEach(() => {
      process.env.KUBERNETES_CA_FILE_PATH = mockCertDir.resolve('ca.crt');
    });

    afterEach(() => {
      process.env.KUBERNETES_SERVICE_HOST = initialHost;
      process.env.KUBERNETES_SERVICE_PORT = initialPort;
      process.env.KUBERNETES_CA_FILE_PATH = initialCAPath;
    });

    it('makes in-cluster requests when cluster details has no token', async () => {
      process.env.KUBERNETES_SERVICE_HOST = '10.10.10.10';
      process.env.KUBERNETES_SERVICE_PORT = '443';

      clusterSupplier.getClusters.mockResolvedValue([
        {
          name: 'cluster1',
          url: 'https://10.10.10.10',
          authMetadata: {
            [ANNOTATION_KUBERNETES_AUTH_PROVIDER]: 'serviceAccount',
          },
        },
      ] as ClusterDetails[]);

      authStrategy.getCredential.mockResolvedValue({
        type: 'bearer token',
        token: 'SA_token',
      });

      worker.use(
        rest.get(
          'https://10.10.10.10/api/v1/namespaces',
          (req: any, res: any, ctx: any) => {
            if (req.headers.get('Authorization') === 'Bearer SA_token') {
              return res(
                ctx.status(200),
                ctx.json({
                  kind: 'NamespaceList',
                  apiVersion: 'v1',
                  items: [],
                }),
              );
            }
            return res(ctx.status(403));
          },
        ),
      );

      const requestPromise = setupProxyPromise({
        proxyPath: '/mountpath',
        requestPath: '/api/v1/namespaces',
        headers: {
          [HEADER_KUBERNETES_CLUSTER]: 'cluster1',
        },
      });

      const response = await requestPromise;

      expect(response.body).toStrictEqual({
        kind: 'NamespaceList',
        apiVersion: 'v1',
        items: [],
      });
    });
  });
});
