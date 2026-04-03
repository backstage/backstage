/*
 * Copyright 2025 The Backstage Authors
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

import http from 'node:http';
import type { AddressInfo } from 'node:net';
import express from 'express';
import { mockCredentials } from '@backstage/backend-test-utils';
import { createStreamableRouter } from './createStreamableRouter';
import { createSseRouter } from './createSseRouter';
import { MCP_STREAMABLE_JSON_RPC_ERROR } from './mcpHttpErrorResponses';

async function withListeningServer(
  app: express.Express,
  fn: (port: number) => Promise<void>,
): Promise<void> {
  const server = http.createServer(app);
  await new Promise<void>((resolve, reject) => {
    server.listen(0, '127.0.0.1', () => resolve());
    server.on('error', reject);
  });
  const addr = server.address() as AddressInfo;
  try {
    await fn(addr.port);
  } finally {
    await new Promise<void>((resolve, reject) =>
      server.close(err => (err ? reject(err) : resolve())),
    );
  }
}

describe('createStreamableRouter error responses', () => {
  const logger = { error: jest.fn() };
  const httpAuth = {
    credentials: jest.fn().mockResolvedValue(mockCredentials.user()),
  };

  it('returns the same JSON-RPC 405 payload for GET and DELETE', async () => {
    const mcpService = {
      getServer: jest.fn(),
    };

    const app = express();
    app.use(
      '/stream',
      createStreamableRouter({
        mcpService: mcpService as any,
        httpAuth: httpAuth as any,
        logger: logger as any,
      }),
    );

    await withListeningServer(app, async port => {
      for (const method of ['GET', 'DELETE'] as const) {
        const res = await fetch(`http://127.0.0.1:${port}/stream`, { method });
        expect(res.status).toBe(405);
        expect(JSON.parse(await res.text())).toEqual(
          MCP_STREAMABLE_JSON_RPC_ERROR.methodNotAllowed,
        );
      }
    });
  });

  it('returns the standard JSON-RPC 500 payload when the handler fails before headers are sent', async () => {
    const mcpService = {
      getServer: jest.fn().mockImplementation(() => {
        throw new Error('boom');
      }),
    };

    const app = express();
    app.use(express.json());
    app.use(
      '/stream',
      createStreamableRouter({
        mcpService: mcpService as any,
        httpAuth: httpAuth as any,
        logger: logger as any,
      }),
    );

    await withListeningServer(app, async port => {
      const res = await fetch(`http://127.0.0.1:${port}/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: '{}',
      });
      expect(res.status).toBe(500);
      expect(await res.json()).toEqual(
        MCP_STREAMABLE_JSON_RPC_ERROR.internalServerError,
      );
    });
  });
});

describe('createSseRouter error responses', () => {
  const httpAuth = {
    credentials: jest.fn().mockResolvedValue(mockCredentials.user()),
  };

  const mcpService = {
    getServer: jest.fn().mockReturnValue({
      connect: jest.fn().mockResolvedValue(undefined),
      close: jest.fn(),
    }),
  };

  it('returns plain-text 400 when sessionId is missing', async () => {
    const app = express();
    app.use(express.json());
    app.use(
      '/sse',
      createSseRouter({
        mcpService: mcpService as any,
        httpAuth: httpAuth as any,
      }),
    );

    await withListeningServer(app, async port => {
      const res = await fetch(`http://127.0.0.1:${port}/sse/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: '{}',
      });
      expect(res.status).toBe(400);
      expect(await res.text()).toBe('sessionId is required');
    });
  });

  it('returns plain-text 400 when sessionId is unknown', async () => {
    const app = express();
    app.use(express.json());
    app.use(
      '/sse',
      createSseRouter({
        mcpService: mcpService as any,
        httpAuth: httpAuth as any,
      }),
    );

    await withListeningServer(app, async port => {
      const res = await fetch(
        `http://127.0.0.1:${port}/sse/messages?sessionId=unknown-session`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: '{}',
        },
      );
      expect(res.status).toBe(400);
      expect(await res.text()).toBe(
        'No transport found for sessionId "unknown-session"',
      );
    });
  });
});
