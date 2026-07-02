/*
 * Copyright 2023 The Backstage Authors
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

import express from 'express';
import http from 'node:http';
import request from 'supertest';
import { createRouter } from './router';
import { mockErrorHandler, mockServices } from '@backstage/backend-test-utils';
import { AuthService } from '@backstage/backend-plugin-api';
import { WebSocketServer } from 'ws';

const eventsServiceMock = mockServices.events.mock();
const discovery = mockServices.discovery.mock({
  getBaseUrl: async () => '/api/signals',
});
const userInfo = mockServices.userInfo.mock();

describe('createRouter', () => {
  let app: express.Express;

  beforeAll(async () => {
    const router = await createRouter({
      logger: mockServices.logger.mock(),
      events: eventsServiceMock,
      discovery,
      userInfo,
      config: mockServices.rootConfig(),
      lifecycle: mockServices.lifecycle.mock(),
      auth: mockServices.auth(),
    });
    app = express().use(router).use(mockErrorHandler());
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('GET /health', () => {
    it('returns ok', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({ status: 'ok' });
    });
  });
});

describe('handleUpgrade', () => {
  async function startServerWithAuth(
    authOverride?: Partial<AuthService>,
  ): Promise<{ server: http.Server; port: number }> {
    const auth = Object.assign(
      mockServices.auth(),
      authOverride,
    ) as AuthService;

    const router = await createRouter({
      logger: mockServices.logger.mock(),
      events: mockServices.events.mock(),
      discovery: mockServices.discovery.mock({
        getBaseUrl: async () => '/api/signals',
      }),
      userInfo: mockServices.userInfo.mock(),
      config: mockServices.rootConfig(),
      lifecycle: mockServices.lifecycle.mock(),
      auth,
    });

    const app = express().use(router);
    const server = http.createServer(app);

    await new Promise<void>(resolve => server.listen(0, resolve));
    const port = (server.address() as { port: number }).port;

    // Trigger upgrade middleware registration via a normal HTTP request
    // with the Upgrade header so the middleware subscribes to 'upgrade'.
    // The middleware does not call next() after registering, so the
    // request will hang — we just need it to reach the server.
    const trigger = http.get(
      { port, path: '/', headers: { Upgrade: 'websocket' } },
      res => res.resume(),
    );
    trigger.on('error', () => {});
    await new Promise(resolve => setTimeout(resolve, 100));

    return { server, port };
  }

  function sendUpgradeRequest(
    port: number,
    token = 'invalid-token',
  ): Promise<{
    statusCode: number;
    statusMessage: string;
    headers: http.IncomingHttpHeaders;
  }> {
    return new Promise((resolve, reject) => {
      const req = http.request({
        port,
        path: '/api/signals',
        headers: {
          Connection: 'Upgrade',
          Upgrade: 'websocket',
          'Sec-WebSocket-Version': '13',
          'Sec-WebSocket-Key': 'dGhlIHNhbXBsZSBub25jZQ==',
          'Sec-WebSocket-Protocol': token,
        },
      });

      req.on('upgrade', (_res, socket) => {
        socket.end();
        reject(new Error('Should not have received upgrade'));
      });

      req.on('response', res => {
        res.resume();
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode!,
            statusMessage: res.statusMessage!,
            headers: res.headers,
          });
        });
      });

      req.on('error', reject);
      req.end();
    });
  }

  let handleUpgradeSpy: jest.SpyInstance;

  afterEach(() => {
    handleUpgradeSpy?.mockRestore();
  });

  it('returns 401 without upgrade headers when auth fails', async () => {
    const { server, port } = await startServerWithAuth({
      authenticate: async () => {
        throw new Error('Invalid token');
      },
    });

    try {
      const result = await sendUpgradeRequest(port);

      expect(result.statusCode).toBe(401);
      expect(result.statusMessage).toBe('Unauthorized');
      expect(result.headers.connection).toBe('close');
      expect(result.headers['content-length']).toBe('0');
      expect(result.headers.upgrade).toBeUndefined();
    } finally {
      server.closeAllConnections();
      server.close();
    }
  });

  it('returns 500 without upgrade headers when handleUpgrade throws', async () => {
    handleUpgradeSpy = jest
      .spyOn(WebSocketServer.prototype, 'handleUpgrade')
      .mockImplementation(() => {
        throw new Error('WebSocket upgrade failed');
      });

    const { server, port } = await startServerWithAuth();

    try {
      const result = await sendUpgradeRequest(port, 'mock-user-token');

      expect(result.statusCode).toBe(500);
      expect(result.statusMessage).toBe('Internal Server Error');
      expect(result.headers.connection).toBe('close');
      expect(result.headers['content-length']).toBe('0');
      expect(result.headers.upgrade).toBeUndefined();
    } finally {
      server.closeAllConnections();
      server.close();
    }
  });
});
