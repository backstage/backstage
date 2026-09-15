/*
 * Copyright 2026 The Backstage Authors
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

import { ANNOTATION_KUBERNETES_AUTH_PROVIDER } from '@backstage/plugin-kubernetes-common';
import {
  KubernetesConnection,
  statusCodeToErrorType,
} from './KubernetesConnection';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import {
  createMockDirectory,
  mockServices,
  registerMswTestHooks,
} from '@backstage/backend-test-utils';

const mockCertDir = createMockDirectory({
  content: {
    'ca.crt': 'MOCKCA',
  },
});

describe('KubernetesConnection', () => {
  const worker = setupServer();
  registerMswTestHooks(worker);

  const logger = mockServices.logger.mock();
  let connection: KubernetesConnection;

  beforeEach(() => {
    connection = new KubernetesConnection({ logger });
  });

  describe('statusCodeToErrorType', () => {
    it.each([
      [400, 'BAD_REQUEST'],
      [401, 'UNAUTHORIZED_ERROR'],
      [404, 'NOT_FOUND'],
      [500, 'SYSTEM_ERROR'],
      [403, 'UNKNOWN_ERROR'],
      [503, 'UNKNOWN_ERROR'],
    ])('maps status %d to %s', (status, expected) => {
      expect(statusCodeToErrorType(status)).toBe(expected);
    });
  });

  describe('buildResourcePath', () => {
    it('builds core API path without namespace', () => {
      expect(connection.buildResourcePath('', 'v1', 'pods')).toBe(
        '/api/v1/pods',
      );
    });

    it('builds core API path with namespace', () => {
      expect(connection.buildResourcePath('', 'v1', 'pods', 'default')).toBe(
        '/api/v1/namespaces/default/pods',
      );
    });

    it('builds grouped API path without namespace', () => {
      expect(connection.buildResourcePath('apps', 'v1', 'deployments')).toBe(
        '/apis/apps/v1/deployments',
      );
    });

    it('builds grouped API path with namespace', () => {
      expect(
        connection.buildResourcePath(
          'apps',
          'v1',
          'deployments',
          'kube-system',
        ),
      ).toBe('/apis/apps/v1/namespaces/kube-system/deployments');
    });

    it('encodes special characters in path segments', () => {
      expect(
        connection.buildResourcePath(
          'example.com',
          'v1alpha1',
          'my resources',
          'my ns',
        ),
      ).toBe('/apis/example.com/v1alpha1/namespaces/my%20ns/my%20resources');
    });
  });

  describe('resolveConnection', () => {
    it('returns ok with bearer token credential', async () => {
      const result = await connection.resolveConnection(
        { name: 'cluster1', url: 'http://localhost:9999', authMetadata: {} },
        { type: 'bearer token', token: 'my-token' },
      );

      expect(result).toEqual(expect.objectContaining({ ok: true }));
      const { url, requestInit } = result as Extract<
        typeof result,
        { ok: true }
      >;
      expect(url.toString()).toBe('http://localhost:9999/');
      expect(
        (requestInit.headers as Record<string, string>).Authorization,
      ).toBe('Bearer my-token');
      expect(requestInit.redirect).toBe('manual');
    });

    it('returns ok with x509 client certificate', async () => {
      const result = await connection.resolveConnection(
        { name: 'cluster1', url: 'http://localhost:9999', authMetadata: {} },
        { type: 'x509 client certificate', cert: 'CERT', key: 'KEY' },
      );

      expect(result.ok).toBe(true);
    });

    it('returns ok for localKubectlProxy with anonymous credential', async () => {
      const result = await connection.resolveConnection(
        {
          name: 'cluster1',
          url: 'http://localhost:8001',
          authMetadata: {
            [ANNOTATION_KUBERNETES_AUTH_PROVIDER]: 'localKubectlProxy',
          },
        },
        { type: 'anonymous' },
      );

      expect(result.ok).toBe(true);
    });

    it('returns not-ok for anonymous credential without localKubectlProxy', async () => {
      const result = await connection.resolveConnection(
        { name: 'cluster1', url: 'http://localhost:9999', authMetadata: {} },
        { type: 'anonymous' },
      );

      expect(result).toEqual({ ok: false, reason: 'missing_credentials' });
    });
  });

  describe('fetchWithConnection', () => {
    it('fetches a resource and returns the response', async () => {
      worker.use(
        rest.get('http://localhost:9999/api/v1/pods', (_req, res, ctx) =>
          res(ctx.status(200), ctx.json({ items: [] })),
        ),
      );

      const response = await connection.fetchWithConnection(
        { name: 'cluster1', url: 'http://localhost:9999', authMetadata: {} },
        { type: 'bearer token', token: 'token' },
        '/api/v1/pods',
      );

      expect(response.ok).toBe(true);
      const body = await response.json();
      expect(body).toEqual({ items: [] });
    });

    it('appends resource path to cluster URL with base path', async () => {
      worker.use(
        rest.get(
          'http://localhost:9999/k8s/clusters/123/api/v1/pods',
          (_req, res, ctx) => res(ctx.status(200), ctx.json({ items: [] })),
        ),
      );

      const response = await connection.fetchWithConnection(
        {
          name: 'cluster1',
          url: 'http://localhost:9999/k8s/clusters/123',
          authMetadata: {},
        },
        { type: 'bearer token', token: 'token' },
        '/api/v1/pods',
      );

      expect(response.ok).toBe(true);
    });

    it('includes labelSelector as query parameter', async () => {
      let capturedSelector = '';
      worker.use(
        rest.get('http://localhost:9999/api/v1/pods', (req, res, ctx) => {
          capturedSelector = req.url.searchParams.get('labelSelector') || '';
          return res(ctx.status(200), ctx.json({ items: [] }));
        }),
      );

      await connection.fetchWithConnection(
        { name: 'cluster1', url: 'http://localhost:9999', authMetadata: {} },
        { type: 'bearer token', token: 'token' },
        '/api/v1/pods',
        'app=frontend',
      );

      expect(capturedSelector).toBe('app=frontend');
    });

    it('rejects when credentials are missing', async () => {
      await expect(
        connection.fetchWithConnection(
          {
            name: 'my-cluster',
            url: 'http://localhost:9999',
            authMetadata: {},
          },
          { type: 'anonymous' },
          '/api/v1/pods',
        ),
      ).rejects.toThrow(
        "no bearer token or client cert for cluster 'my-cluster' and not running in Kubernetes",
      );
    });

    it('sends Authorization header with bearer token', async () => {
      let capturedAuth = '';
      worker.use(
        rest.get('http://localhost:9999/api/v1/pods', (req, res, ctx) => {
          capturedAuth = req.headers.get('Authorization') || '';
          return res(ctx.status(200), ctx.json({ items: [] }));
        }),
      );

      await connection.fetchWithConnection(
        { name: 'cluster1', url: 'http://localhost:9999', authMetadata: {} },
        { type: 'bearer token', token: 'secret-token' },
        '/api/v1/pods',
      );

      expect(capturedAuth).toBe('Bearer secret-token');
    });

    it('does not send Authorization header for anonymous credential with localKubectlProxy', async () => {
      let capturedAuth: string | null = '';
      worker.use(
        rest.get('http://localhost:9999/api/v1/pods', (req, res, ctx) => {
          capturedAuth = req.headers.get('Authorization');
          return res(ctx.status(200), ctx.json({ items: [] }));
        }),
      );

      await connection.fetchWithConnection(
        {
          name: 'cluster1',
          url: 'http://localhost:9999',
          authMetadata: {
            [ANNOTATION_KUBERNETES_AUTH_PROVIDER]: 'localKubectlProxy',
          },
        },
        { type: 'anonymous' },
        '/api/v1/pods',
      );

      expect(capturedAuth).toBeNull();
    });
  });

  describe('handleUnsuccessfulResponse', () => {
    it('returns error with correct type and logs warning', async () => {
      const warn = jest.spyOn(logger, 'warn');

      worker.use(
        rest.get('http://localhost:9999/api/v1/pods', (_req, res, ctx) =>
          res(ctx.status(404), ctx.text('not found')),
        ),
      );

      const response = await connection.fetchWithConnection(
        { name: 'cluster1', url: 'http://localhost:9999', authMetadata: {} },
        { type: 'bearer token', token: 'token' },
        '/api/v1/pods',
      );

      const error = await connection.handleUnsuccessfulResponse(
        'cluster1',
        response,
      );

      expect(error).toEqual({
        errorType: 'NOT_FOUND',
        statusCode: 404,
        resourcePath: '/api/v1/pods',
      });
      expect(warn).toHaveBeenCalledWith(
        expect.stringContaining('Received 404 status'),
      );
    });
  });

  describe('TLS and agent caching', () => {
    let httpsRequest: jest.SpyInstance;
    const initialCAPath = process.env.KUBERNETES_CA_FILE_PATH;

    beforeAll(() => {
      httpsRequest = jest.spyOn(
        (worker as any).interceptor.interceptors[0].modules.get('https'),
        'request',
      );
    });

    beforeEach(() => {
      httpsRequest.mockClear();
      process.env.KUBERNETES_CA_FILE_PATH = mockCertDir.resolve('ca.crt');
    });

    afterEach(() => {
      process.env.KUBERNETES_CA_FILE_PATH = initialCAPath;
    });

    it('creates agent with caData', async () => {
      worker.use(
        rest.get('https://localhost:9999/api/v1/pods', (_req, res, ctx) =>
          res(ctx.status(200), ctx.json({ items: [] })),
        ),
      );

      await connection.fetchWithConnection(
        {
          name: 'cluster1',
          url: 'https://localhost:9999',
          authMetadata: {},
          caData: 'MOCKCA',
        },
        { type: 'bearer token', token: 'token' },
        '/api/v1/pods',
      );

      expect(httpsRequest).toHaveBeenCalledTimes(1);
      const [[{ agent }]] = httpsRequest.mock.calls;
      expect(agent.options.ca.toString('base64')).toMatch('MOCKCA');
    });

    it('reuses cached agent for same cluster config', async () => {
      worker.use(
        rest.get('https://localhost:9999/*', (_req, res, ctx) =>
          res(ctx.status(200), ctx.json({ items: [] })),
        ),
      );

      const cluster = {
        name: 'cluster1',
        url: 'https://localhost:9999',
        authMetadata: {},
        caData: 'MOCKCA',
      };
      const cred = { type: 'bearer token' as const, token: 'token' };

      await connection.fetchWithConnection(cluster, cred, '/api/v1/pods');
      await connection.fetchWithConnection(cluster, cred, '/api/v1/services');

      expect(httpsRequest).toHaveBeenCalledTimes(2);
      const agent1 = httpsRequest.mock.calls[0][0].agent;
      const agent2 = httpsRequest.mock.calls[1][0].agent;
      expect(agent1).toBe(agent2);
    });

    it('sets rejectUnauthorized to false when skipTLSVerify is true', async () => {
      worker.use(
        rest.get('https://localhost:9999/api/v1/pods', (_req, res, ctx) =>
          res(ctx.status(200), ctx.json({ items: [] })),
        ),
      );

      await connection.fetchWithConnection(
        {
          name: 'cluster1',
          url: 'https://localhost:9999',
          authMetadata: {},
          skipTLSVerify: true,
        },
        { type: 'bearer token', token: 'token' },
        '/api/v1/pods',
      );

      expect(httpsRequest).toHaveBeenCalledTimes(1);
      const [[{ agent }]] = httpsRequest.mock.calls;
      expect(agent.options.rejectUnauthorized).toBe(false);
    });

    it('configures agent with x509 client certificate', async () => {
      worker.use(
        rest.get('https://localhost:9999/api/v1/pods', (_req, res, ctx) =>
          res(ctx.status(200), ctx.json({ items: [] })),
        ),
      );

      const result = connection.fetchWithConnection(
        {
          name: 'cluster1',
          url: 'https://localhost:9999',
          authMetadata: {},
          caData: 'MOCKCA',
        },
        { type: 'x509 client certificate', cert: 'MOCKCERT', key: 'MOCKKEY' },
        '/api/v1/pods',
      );

      await expect(result).rejects.toThrow(/PEM/);

      expect(httpsRequest).toHaveBeenCalledTimes(1);
      const [[{ agent }]] = httpsRequest.mock.calls;
      expect(agent.options.cert).toBe('MOCKCERT');
      expect(agent.options.key).toBe('MOCKKEY');
    });

    it('reads caFile from disk', async () => {
      worker.use(
        rest.get('https://localhost:9999/api/v1/pods', (_req, res, ctx) =>
          res(ctx.status(200), ctx.json({ items: [] })),
        ),
      );

      await connection.fetchWithConnection(
        {
          name: 'cluster1',
          url: 'https://localhost:9999',
          authMetadata: {},
          caFile: process.env.KUBERNETES_CA_FILE_PATH,
        },
        { type: 'bearer token', token: 'token' },
        '/api/v1/pods',
      );

      expect(httpsRequest).toHaveBeenCalledTimes(1);
      const [[{ agent }]] = httpsRequest.mock.calls;
      expect(agent.options.ca.toString()).toEqual('MOCKCA');
    });
  });

  describe('in-cluster connection', () => {
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

    it('resolves in-cluster connection for serviceAccount without token', async () => {
      process.env.KUBERNETES_SERVICE_HOST = '10.10.10.10';
      process.env.KUBERNETES_SERVICE_PORT = '443';

      const result = await connection.resolveConnection(
        {
          name: 'in-cluster',
          url: 'https://10.10.10.10',
          authMetadata: {
            [ANNOTATION_KUBERNETES_AUTH_PROVIDER]: 'serviceAccount',
          },
        },
        { type: 'bearer token', token: 'sa-token' },
      );

      expect(result).toEqual(expect.objectContaining({ ok: true }));
      const { requestInit } = result as Extract<typeof result, { ok: true }>;
      expect(requestInit.redirect).toBe('manual');
    });

    it('does not use in-cluster path when serviceAccountToken is present', async () => {
      const result = await connection.resolveConnection(
        {
          name: 'remote-sa',
          url: 'http://localhost:9999',
          authMetadata: {
            [ANNOTATION_KUBERNETES_AUTH_PROVIDER]: 'serviceAccount',
            serviceAccountToken: 'explicit-token',
          },
        },
        { type: 'bearer token', token: 'explicit-token' },
      );

      expect(result).toEqual(expect.objectContaining({ ok: true }));
      const { url } = result as Extract<typeof result, { ok: true }>;
      expect(url.toString()).toBe('http://localhost:9999/');
    });
  });
});
