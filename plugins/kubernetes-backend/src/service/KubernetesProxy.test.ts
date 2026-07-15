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

import 'node:buffer';
import { resolve as resolvePath } from 'node:path';
import {
  createMockDirectory,
  mockServices,
  registerMswTestHooks,
  ServiceFactoryTester,
} from '@backstage/backend-test-utils';
import { auditorServiceFactory } from '@backstage/backend-defaults/auditor';
import { NotFoundError } from '@backstage/errors';
import { AuthorizeResult } from '@backstage/plugin-permission-common';
import {
  ANNOTATION_KUBERNETES_AUTH_PROVIDER,
  KubernetesRequestAuth,
} from '@backstage/plugin-kubernetes-common';
import { getMockReq, getMockRes } from '@jest-mock/express';
import express from 'express';
import Router from 'express-promise-router';
import { Server } from 'node:http';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import request from 'supertest';
import { AddressInfo, WebSocket, WebSocketServer } from 'ws';

import { LocalKubectlProxyClusterLocator } from '../cluster-locator/LocalKubectlProxyLocator';
import {
  ClusterDetails,
  KubernetesClustersSupplier,
  AuthenticationStrategy,
  KubernetesCredential,
} from '@backstage/plugin-kubernetes-node';
import {
  HEADER_KUBERNETES_AUTH,
  HEADER_KUBERNETES_CLUSTER,
  KubernetesProxy,
} from './KubernetesProxy';

import type { Request } from 'express';
import { BackstageCredentials } from '@backstage/backend-plugin-api';
import { MiddlewareFactory } from '@backstage/backend-defaults/rootHttpRouter';
import { AnonymousStrategy } from '../auth';

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
  let auditor: ReturnType<typeof mockServices.auditor.mock>;
  let auditEvent: { success: jest.Mock; fail: jest.Mock };
  const worker = setupServer();
  const logger = mockServices.logger.mock();

  const clusterSupplier: jest.Mocked<KubernetesClustersSupplier> = {
    getClusters: jest.fn<
      Promise<ClusterDetails[]>,
      [{ credentials: BackstageCredentials }]
    >(),
  };

  const permissionApi = mockServices.permissions();
  const mockDiscoveryApi = mockServices.discovery.mock();

  registerMswTestHooks(worker);

  const buildMockRequest = (
    clusterName: any,
    path: string,
    extraHeaders?: Record<string, string>,
  ): Request => {
    const headers: Record<string, any> = {
      'content-type': 'application/json',
      [HEADER_KUBERNETES_CLUSTER.toLowerCase()]: clusterName,
      ...extraHeaders,
    };
    const req = getMockReq({
      method: 'GET',
      path: `/${path}`,
      url: `/${path}`,
      originalUrl: `/${path}`,
      baseUrl: '',
      params: {
        path,
      },
      headers,
      header: jest.fn((key: string) => {
        const lower = key.toLowerCase();
        if (lower === 'content-type') return 'application/json';
        if (lower === HEADER_KUBERNETES_CLUSTER.toLowerCase())
          return clusterName;
        if (headers[lower] !== undefined) return headers[lower];
        return '';
      }),
    });

    req.socket = { once: jest.fn(), removeListener: jest.fn() } as any;

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
    auditor = mockServices.auditor.mock();
    auditEvent = {
      success: jest.fn().mockResolvedValue(undefined),
      fail: jest.fn().mockResolvedValue(undefined),
    };
    auditor.createEvent.mockResolvedValue(auditEvent);

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
      discovery: mockDiscoveryApi,
      httpAuth: mockServices.httpAuth.mock(),
      auditor,
    });
  });

  describe('audit logging', () => {
    it('emits audit events on successful proxy handoff', async () => {
      clusterSupplier.getClusters.mockResolvedValue([
        {
          name: 'cluster1',
          url: 'https://localhost:9999',
          authMetadata: {},
        },
      ]);

      worker.use(
        rest.get('https://localhost:9999/api', (_: any, res: any, ctx: any) =>
          res(ctx.status(200), ctx.json({ ok: true })),
        ),
      );

      const requestPromise = setupProxyPromise({
        proxyPath: '/mountpath',
        requestPath: '/api',
        headers: { [HEADER_KUBERNETES_CLUSTER]: 'cluster1' },
      });

      await requestPromise;

      expect(auditor.createEvent).toHaveBeenCalledWith({
        eventId: 'cluster-fetch',
        severityLevel: 'medium',
        request: expect.anything(),
        meta: {
          queryType: 'proxy',
          clusterName: 'cluster1',
          method: 'GET',
          path: '/api',
        },
      });
      expect(auditEvent.success).toHaveBeenCalled();
      expect(auditEvent.fail).not.toHaveBeenCalled();
    });

    it('emits failed audit events on permission denial with unknown cluster name', async () => {
      const deniedPermissionApi = mockServices.permissions.mock();
      deniedPermissionApi.authorize.mockResolvedValue([
        { result: AuthorizeResult.DENY },
      ]);

      const req = buildMockRequest(undefined, 'api');
      const { res, next } = getMockRes();

      await proxy.createRequestHandler({ permissionApi: deniedPermissionApi })(
        req,
        res,
        next,
      );

      expect(auditor.createEvent).toHaveBeenCalledWith({
        eventId: 'cluster-fetch',
        severityLevel: 'medium',
        request: expect.objectContaining({ originalUrl: '/api' }),
        meta: {
          queryType: 'proxy',
          clusterName: 'unknown',
          method: 'GET',
          path: '/api',
        },
      });
      expect(auditEvent.fail).toHaveBeenCalled();
      expect(auditEvent.success).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(403);
    });

    it('does not crash when the audit event rejects inside res.on(finish)', async () => {
      auditEvent.success.mockRejectedValue(
        new Error('audit transport failure'),
      );

      clusterSupplier.getClusters.mockResolvedValue([
        {
          name: 'cluster1',
          url: 'https://localhost:9999',
          authMetadata: {},
        },
      ]);

      worker.use(
        rest.get('https://localhost:9999/api', (_: any, res: any, ctx: any) =>
          res(ctx.status(200), ctx.json({ ok: true })),
        ),
      );

      const requestPromise = setupProxyPromise({
        proxyPath: '/mountpath',
        requestPath: '/api',
        headers: { [HEADER_KUBERNETES_CLUSTER]: 'cluster1' },
      });

      const response = await requestPromise;

      expect(response.status).toEqual(200);
      expect(auditEvent.success).toHaveBeenCalled();
    });

    it('emits failed audit event when upstream returns 401', async () => {
      clusterSupplier.getClusters.mockResolvedValue([
        {
          name: 'cluster1',
          url: 'https://localhost:9999',
          authMetadata: {},
        },
      ]);

      worker.use(
        rest.get('https://localhost:9999/api', (_: any, res: any, ctx: any) =>
          res(ctx.status(401), ctx.json({ message: 'Unauthorized' })),
        ),
      );

      const requestPromise = setupProxyPromise({
        proxyPath: '/mountpath',
        requestPath: '/api',
        headers: { [HEADER_KUBERNETES_CLUSTER]: 'cluster1' },
      });

      const response = await requestPromise;

      expect(response.status).toEqual(401);
      expect(auditEvent.fail).toHaveBeenCalledWith({
        error: expect.objectContaining({
          message: 'Proxy responded with status 401',
        }),
      });
      expect(auditEvent.success).not.toHaveBeenCalled();
    });

    it('emits failed audit event when upstream returns 403', async () => {
      clusterSupplier.getClusters.mockResolvedValue([
        {
          name: 'cluster1',
          url: 'https://localhost:9999',
          authMetadata: {},
        },
      ]);

      worker.use(
        rest.get('https://localhost:9999/api', (_: any, res: any, ctx: any) =>
          res(ctx.status(403), ctx.json({ message: 'Forbidden' })),
        ),
      );

      const requestPromise = setupProxyPromise({
        proxyPath: '/mountpath',
        requestPath: '/api',
        headers: { [HEADER_KUBERNETES_CLUSTER]: 'cluster1' },
      });

      const response = await requestPromise;

      expect(response.status).toEqual(403);
      expect(auditEvent.fail).toHaveBeenCalledWith({
        error: expect.objectContaining({
          message: 'Proxy responded with status 403',
        }),
      });
      expect(auditEvent.success).not.toHaveBeenCalled();
    });

    it('emits failed audit event when client disconnects before response completes', async () => {
      const delayedServer = await new Promise<Server>(resolve => {
        const srv = require('node:http').createServer((_req: any, res: any) => {
          // Delay the response so the client can abort mid-flight
          setTimeout(() => {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ ok: true }));
          }, 500);
        });
        srv.listen(0, '127.0.0.1', () => resolve(srv));
      });
      const delayedPort = (delayedServer.address() as AddressInfo).port;

      clusterSupplier.getClusters.mockResolvedValue([
        {
          name: 'cluster1',
          url: `http://127.0.0.1:${delayedPort}`,
          authMetadata: {},
        },
      ]);

      worker.use(rest.all('*', (req: any) => req.passthrough()));

      const app = express().use(
        Router()
          .use('/mountpath', proxy.createRequestHandler({ permissionApi }))
          .use(middleware.error()),
      );
      const proxyServer = await new Promise<Server>(resolve => {
        const srv = app.listen(0, '127.0.0.1', () => resolve(srv));
      });
      const proxyPort = (proxyServer.address() as AddressInfo).port;

      try {
        const abortController = new AbortController();
        const reqPromise = fetch(
          `http://127.0.0.1:${proxyPort}/mountpath/api`,
          {
            headers: { [HEADER_KUBERNETES_CLUSTER]: 'cluster1' },
            signal: abortController.signal,
          },
        ).catch(() => {});

        // Abort after the request reaches the proxy but before the
        // delayed upstream responds
        await new Promise(r => setTimeout(r, 100));
        abortController.abort();
        await reqPromise;

        // Give the proxy time to observe the close event
        await new Promise(r => setTimeout(r, 200));

        expect(auditEvent.fail).toHaveBeenCalledWith(
          expect.objectContaining({
            error: expect.objectContaining({
              message: expect.stringContaining('disconnected'),
            }),
          }),
        );
        expect(auditEvent.success).not.toHaveBeenCalled();
      } finally {
        proxyServer.close();
        delayedServer.close();
      }
    });

    it('emits failed audit events on pre-proxy cluster resolution errors', async () => {
      clusterSupplier.getClusters.mockResolvedValue([]);

      const req = buildMockRequest('test', 'api');
      const { res, next } = getMockRes();

      await expect(
        proxy.createRequestHandler({ permissionApi })(req, res, next),
      ).rejects.toThrow(NotFoundError);

      expect(auditEvent.fail).toHaveBeenCalled();
      expect(auditEvent.success).not.toHaveBeenCalled();
    });

    it('strips query parameters from the request URL in audit events', async () => {
      clusterSupplier.getClusters.mockResolvedValue([
        {
          name: 'cluster1',
          url: 'https://localhost:9999',
          authMetadata: {},
        },
      ]);

      worker.use(
        rest.get('https://localhost:9999/api', (_: any, res: any, ctx: any) =>
          res(ctx.status(200), ctx.json({ ok: true })),
        ),
      );

      const requestPromise = setupProxyPromise({
        proxyPath: '/mountpath',
        requestPath: '/api?command=secret&token=sensitive',
        headers: { [HEADER_KUBERNETES_CLUSTER]: 'cluster1' },
      });

      await requestPromise;

      const createEventCall = auditor.createEvent.mock.calls[0][0];
      expect(createEventCall.request!.originalUrl).not.toContain('secret');
      expect(createEventCall.request!.originalUrl).not.toContain('sensitive');
      expect(createEventCall.request!.originalUrl).toContain('/api');
      expect(createEventCall.request!.url).not.toContain('secret');
      expect(createEventCall.request!.url).not.toContain('sensitive');
      expect(createEventCall.request!.url).toContain('/api');
      expect(createEventCall.meta!.path).toBe('/api');

      expect(auditEvent.success).toHaveBeenCalled();
      expect(auditEvent.fail).not.toHaveBeenCalled();

      const serialized = JSON.stringify(createEventCall);
      expect(serialized).not.toContain('secret');
      expect(serialized).not.toContain('sensitive');
    });

    it('redaction holds when exercised through the default auditor', async () => {
      const sentinel = 'SENTINEL_SECRET_VALUE';

      const auditLogger = mockServices.logger.mock();
      auditLogger.child.mockReturnValue(auditLogger);

      const realAuditor = await ServiceFactoryTester.from(
        auditorServiceFactory,
        { dependencies: [auditLogger.factory] },
      ).getSubject();

      const realProxy = new KubernetesProxy({
        logger,
        clusterSupplier,
        authStrategy,
        discovery: mockDiscoveryApi,
        httpAuth: mockServices.httpAuth.mock(),
        auditor: realAuditor,
      });

      clusterSupplier.getClusters.mockResolvedValue([
        {
          name: 'cluster1',
          url: 'https://localhost:9999',
          authMetadata: {},
        },
      ]);

      worker.use(
        rest.get('https://localhost:9999/api', (_: any, res: any, ctx: any) =>
          res(ctx.status(200), ctx.json({ ok: true })),
        ),
      );

      const app = express().use(
        Router()
          .use('/mountpath', realProxy.createRequestHandler({ permissionApi }))
          .use(middleware.error()),
      );

      const proxyRequest = request(app)
        .get(`/mountpath/api?command=${sentinel}`)
        .set(HEADER_KUBERNETES_CLUSTER, 'cluster1');
      worker.use(rest.all(proxyRequest.url, (r: any) => r.passthrough()));

      await proxyRequest;

      const allLogCalls = [
        ...auditLogger.info.mock.calls,
        ...auditLogger.debug.mock.calls,
        ...auditLogger.warn.mock.calls,
        ...auditLogger.error.mock.calls,
      ];

      expect(allLogCalls.length).toBeGreaterThanOrEqual(2);

      const fullOutput = JSON.stringify(allLogCalls);
      expect(fullOutput).not.toContain(sentinel);
      expect(fullOutput).toContain('/api');
      expect(fullOutput).toContain('GET');
      expect(fullOutput).toContain('cluster-fetch');

      const initiatedCall = allLogCalls.find(
        args => (args[1] as Record<string, unknown>)?.status === 'initiated',
      );
      expect(initiatedCall).toBeDefined();
      const initiatedMeta = initiatedCall![1] as Record<string, any>;
      expect(initiatedMeta.request.url).toBe('/mountpath/api');
      expect(initiatedMeta.request.method).toBe('GET');

      const succeededCall = allLogCalls.find(
        args => (args[1] as Record<string, unknown>)?.status === 'succeeded',
      );
      expect(succeededCall).toBeDefined();
    });

    it('recognizes websocket upgrade with comma-separated Connection header', async () => {
      worker.use(rest.all('*', (req: any) => req.passthrough()));

      const wsServer = new WebSocketServer({ port: 0, path: '/ws' });
      const wsServerPort = (wsServer.address() as AddressInfo).port;
      wsServer.on('connection', (ws: WebSocket) => ws.send('hello'));

      clusterSupplier.getClusters.mockResolvedValue([
        {
          name: 'cluster1',
          url: `http://localhost:${wsServerPort}`,
          authMetadata: {},
        },
      ]);

      const app = express().use(
        Router()
          .use('/proxy', proxy.createRequestHandler({ permissionApi }))
          .use(middleware.error()),
      );
      const proxyServer = await new Promise<Server>(resolve => {
        const srv = app.listen(0, '127.0.0.1', () => resolve(srv));
      });
      const proxyPort = (proxyServer.address() as AddressInfo).port;

      try {
        const ws = new WebSocket(`ws://127.0.0.1:${proxyPort}/proxy/ws`, {
          headers: {
            [HEADER_KUBERNETES_CLUSTER]: 'cluster1',
            Connection: 'keep-alive, Upgrade',
          },
        });

        const msg = await new Promise<string>((resolve, reject) => {
          ws.once('message', data => resolve(data.toString()));
          ws.once('error', reject);
        });
        expect(msg).toBe('hello');

        await new Promise<void>(resolve => {
          ws.once('close', () => resolve());
          ws.close();
        });

        expect(auditEvent.success).toHaveBeenCalled();
        expect(auditEvent.fail).not.toHaveBeenCalled();
      } finally {
        proxyServer.close();
        wsServer.close();
      }
    });

    it('includes resolved clusterName in terminal audit meta when header was absent', async () => {
      clusterSupplier.getClusters.mockResolvedValue([
        {
          name: 'my-cluster',
          url: 'https://localhost:9999',
          authMetadata: {},
        },
      ]);

      worker.use(
        rest.get('https://localhost:9999/api', (_: any, res: any, ctx: any) =>
          res(ctx.status(200), ctx.json({ ok: true })),
        ),
      );

      const requestPromise = setupProxyPromise({
        proxyPath: '/mountpath',
        requestPath: '/api',
      });

      await requestPromise;

      expect(auditor.createEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          meta: expect.objectContaining({ clusterName: 'unknown' }),
        }),
      );
      expect(auditEvent.success).toHaveBeenCalledWith({
        meta: { clusterName: 'my-cluster' },
      });
    });

    it('cleans up socket listener when auditor.createEvent rejects on a keep-alive connection', async () => {
      auditor.createEvent.mockRejectedValue(
        new Error('auditor transport unavailable'),
      );

      worker.use(rest.all('*', (req: any) => req.passthrough()));

      const app = express().use(
        Router()
          .use('/mountpath', proxy.createRequestHandler({ permissionApi }))
          .use(middleware.error()),
      );
      const server = await new Promise<Server>(resolve => {
        const srv = app.listen(0, '127.0.0.1', () => resolve(srv));
      });
      const port = (server.address() as AddressInfo).port;

      const http = await import('node:http');
      const agent = new http.Agent({ keepAlive: true, maxSockets: 1 });

      let serverSocket: import('net').Socket | undefined;
      server.on('connection', (s: import('net').Socket) => {
        serverSocket = s;
      });

      const doRequest = () =>
        new Promise<number>(resolve => {
          const r = http.get(
            `http://127.0.0.1:${port}/mountpath/api`,
            { agent, headers: { [HEADER_KUBERNETES_CLUSTER]: 'cluster1' } },
            res => {
              res.resume();
              res.on('end', () => resolve(res.statusCode ?? 0));
            },
          );
          r.end();
        });

      try {
        // First request establishes the keep-alive connection
        expect(await doRequest()).toBe(500);
        const baselineListeners = serverSocket!.listenerCount('close');

        // Send 11 more requests on the same keep-alive socket —
        // listener count should stay stable if cleanup works
        for (let i = 0; i < 11; i++) {
          expect(await doRequest()).toBe(500);
        }

        // If cleanup works, listener count should stay near baseline
        // rather than growing by one per request
        const closeListeners = serverSocket!.listenerCount('close');
        expect(closeListeners).toBeLessThanOrEqual(baselineListeners + 1);

        // Neither success nor fail should have been called since the
        // auditor event was never created
        expect(auditEvent.success).not.toHaveBeenCalled();
        expect(auditEvent.fail).not.toHaveBeenCalled();
      } finally {
        agent.destroy();
        server.close();
      }
    });
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
      discovery: mockDiscoveryApi,
      httpAuth: mockServices.httpAuth.mock(),
      auditor,
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
      discovery: mockDiscoveryApi,
      httpAuth: mockServices.httpAuth.mock(),
      auditor,
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

      expect(auditor.createEvent).toHaveBeenCalledWith({
        eventId: 'cluster-fetch',
        severityLevel: 'medium',
        request: expect.anything(),
        meta: {
          queryType: 'proxy',
          clusterName: 'unknown',
          method: 'GET',
          path: '/ws',
        },
      });
      expect(auditEvent.success).toHaveBeenCalledWith({
        meta: { clusterName: 'local' },
      });
      expect(auditEvent.fail).not.toHaveBeenCalled();
    });

    it('emits failed audit event when websocket upgrade fails', async () => {
      worker.use(rest.all('*', req => req.passthrough()));

      clusterSupplier.getClusters.mockResolvedValue([
        {
          name: 'unreachable',
          url: 'http://localhost:1',
          authMetadata: {},
        },
      ]);

      const wsProxyAddress = `ws://127.0.0.1:${proxyPort}${proxyPath}${wsPath}`;
      const webSocket = new WebSocket(wsProxyAddress, {
        headers: { [HEADER_KUBERNETES_CLUSTER]: 'unreachable' },
      });

      await eventPromiseFactory(webSocket, 'error');

      expect(auditEvent.fail).toHaveBeenCalled();
      expect(auditEvent.success).not.toHaveBeenCalled();
    });

    it('emits exactly one failed audit event when client closes during delayed upstream handshake', async () => {
      worker.use(rest.all('*', (req: any) => req.passthrough()));

      // TCP server that accepts connections but never completes the
      // WebSocket handshake, simulating a slow upstream.
      const net = require('node:net');
      const delayedTcp = await new Promise<import('net').Server>(resolve => {
        const srv = net.createServer((socket: import('net').Socket) => {
          // Hold the connection open — do not respond
          socket.on('error', () => {});
        });
        srv.listen(0, '127.0.0.1', () => resolve(srv));
      });
      const delayedPort = (delayedTcp.address() as AddressInfo).port;

      clusterSupplier.getClusters.mockResolvedValue([
        {
          name: 'slow-cluster',
          url: `http://127.0.0.1:${delayedPort}`,
          authMetadata: {},
        },
      ]);

      const wsProxyAddress = `ws://127.0.0.1:${proxyPort}${proxyPath}${wsPath}`;
      const webSocket = new WebSocket(wsProxyAddress, {
        headers: { [HEADER_KUBERNETES_CLUSTER]: 'slow-cluster' },
      });
      webSocket.on('error', () => {});

      // Wait for the connection to be established to the proxy, then
      // forcibly terminate the client before the upstream handshake completes.
      await new Promise(r => setTimeout(r, 150));
      webSocket.terminate();

      // Give the proxy time to observe the socket close
      await new Promise(r => setTimeout(r, 300));

      expect(auditEvent.fail).toHaveBeenCalledTimes(1);
      expect(auditEvent.fail).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.objectContaining({
            message: expect.stringContaining('closed'),
          }),
        }),
      );
      expect(auditEvent.success).not.toHaveBeenCalled();

      delayedTcp.close();
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
