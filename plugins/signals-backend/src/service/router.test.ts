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
import { WebSocket } from 'ws';
import { createRouter } from './router';
import {
  mockCredentials,
  mockErrorHandler,
  mockServices,
} from '@backstage/backend-test-utils';

const eventsServiceMock = mockServices.events.mock();
const discovery = mockServices.discovery.mock({
  getBaseUrl: async () => 'http://127.0.0.1/api/signals',
});
const userInfo = mockServices.userInfo.mock({
  getUserInfo: async () => ({
    userEntityRef: 'user:default/test',
    ownershipEntityRefs: ['user:default/test'],
  }),
});

async function connectWebSocket(
  server: http.Server,
  protocols?: string | string[],
): Promise<{ ws?: WebSocket; error?: Error; statusCode?: number }> {
  const { port } = server.address() as { port: number };

  return new Promise(resolve => {
    const ws = new WebSocket(`ws://127.0.0.1:${port}/api/signals`, protocols);
    let settled = false;

    const settle = (result: {
      ws?: WebSocket;
      error?: Error;
      statusCode?: number;
    }) => {
      if (settled) {
        return;
      }
      settled = true;
      resolve(result);
    };

    ws.once('open', () => {
      settle({ ws });
    });

    ws.once('unexpected-response', (_req, res) => {
      settle({ statusCode: res.statusCode });
      res.resume();
    });

    ws.once('error', error => {
      // Prefer unexpected-response for HTTP upgrade failures; only fall back
      // to the error event when no response was received.
      setImmediate(() => {
        if (!settled) {
          settle({ error });
        }
      });
    });
  });
}

describe('createRouter', () => {
  let server: http.Server;
  const shutdownHooks: Array<() => void | Promise<void>> = [];
  const lifecycle = mockServices.lifecycle.mock({
    addShutdownHook: (hook: () => void | Promise<void>) => {
      shutdownHooks.push(hook);
    },
  });

  beforeAll(async () => {
    const router = await createRouter({
      logger: mockServices.logger.mock(),
      events: eventsServiceMock,
      discovery,
      userInfo,
      config: mockServices.rootConfig(),
      lifecycle,
      auth: mockServices.auth(),
    });
    const app = express().use('/api/signals', router).use(mockErrorHandler());
    server = http.createServer(app);
    await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
    // Register the upgrade handler via the first HTTP request
    await request(server).get('/api/signals/health');
  });

  afterAll(async () => {
    await Promise.all(shutdownHooks.map(hook => hook()));
    await new Promise<void>((resolve, reject) =>
      server.close(err => (err ? reject(err) : resolve())),
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /health', () => {
    it('returns ok', async () => {
      const response = await request(server).get('/api/signals/health');

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({ status: 'ok' });
    });
  });

  describe('WebSocket authentication', () => {
    it('rejects connections without a token', async () => {
      const result = await connectWebSocket(server);
      expect(result.statusCode).toEqual(401);
      expect(result.ws).toBeUndefined();
    });

    it('rejects connections with an invalid token', async () => {
      const result = await connectWebSocket(
        server,
        mockCredentials.user.invalidToken(),
      );
      expect(result.statusCode).toEqual(401);
      expect(result.ws).toBeUndefined();
    });

    it('rejects connections with a service token', async () => {
      const result = await connectWebSocket(
        server,
        mockCredentials.service.token(),
      );
      expect(result.statusCode).toEqual(401);
      expect(result.ws).toBeUndefined();
    });

    it('accepts connections with a valid user token', async () => {
      const result = await connectWebSocket(
        server,
        mockCredentials.user.token(),
      );
      expect(result.ws).toBeDefined();
      expect(result.ws?.readyState).toEqual(WebSocket.OPEN);
      expect(userInfo.getUserInfo).toHaveBeenCalled();
      result.ws?.close();
    });
  });
});
