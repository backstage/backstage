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
import { PassThrough } from 'node:stream';
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
  async function setupServer(
    authOverride?: Partial<AuthService>,
  ): Promise<http.Server> {
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

    // Register the upgrade handler by sending one request with the
    // Upgrade header through express. Guard against the listener
    // already being registered, and clean up the trigger request.
    if (server.listenerCount('upgrade') === 0) {
      const trigger = http.get(
        { port, path: '/', headers: { Upgrade: 'websocket' } },
        res => res.resume(),
      );
      trigger.on('error', () => {});
      await new Promise<void>(resolve => {
        server.on('newListener', event => {
          if (event === 'upgrade') {
            trigger.destroy();
            resolve();
          }
        });
      });
    }

    return server;
  }

  function emitUpgrade(server: http.Server, token: string): Promise<string> {
    const socket = new PassThrough();
    server.emit(
      'upgrade',
      { url: '/api/signals', headers: { 'sec-websocket-protocol': token } },
      socket,
      Buffer.alloc(0),
    );
    return new Promise(resolve => {
      const chunks: Buffer[] = [];
      socket.on('data', chunk => chunks.push(chunk));
      socket.on('end', () => resolve(Buffer.concat(chunks).toString()));
    });
  }

  it('writes 401 response without upgrade headers when auth fails', async () => {
    const server = await setupServer({
      authenticate: async () => {
        throw new Error('Invalid token');
      },
    });

    try {
      const response = await emitUpgrade(server, 'invalid-token');

      expect(response).toBe(
        'HTTP/1.1 401 Unauthorized\r\n' +
          'Content-Length: 0\r\n' +
          'Connection: close\r\n' +
          '\r\n',
      );
    } finally {
      server.closeAllConnections();
      await new Promise<void>(resolve => server.close(() => resolve()));
    }
  });

  it('writes 500 response without upgrade headers when handleUpgrade throws', async () => {
    const spy = jest
      .spyOn(WebSocketServer.prototype, 'handleUpgrade')
      .mockImplementation(() => {
        throw new Error('WebSocket upgrade failed');
      });

    const server = await setupServer();

    try {
      const response = await emitUpgrade(server, 'mock-user-token');

      expect(response).toBe(
        'HTTP/1.1 500 Internal Server Error\r\n' +
          'Content-Length: 0\r\n' +
          'Connection: close\r\n' +
          '\r\n',
      );
    } finally {
      spy.mockRestore();
      server.closeAllConnections();
      await new Promise<void>(resolve => server.close(() => resolve()));
    }
  });
});
