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
import { createElicitationRouter } from './createElicitationRouter';
import express, { ErrorRequestHandler } from 'express';
import request from 'supertest';
import { SecretsStore } from '../services/SecretsStore';
import knexFactory, { Knex } from 'knex';
import { mockCredentials, mockServices } from '@backstage/backend-test-utils';
import { ErrorResponseBody, serializeError } from '@backstage/errors';

describe('createElicitationRouter', () => {
  const encryptionKey = Buffer.from('a'.repeat(32)).toString('base64');
  let db: Knex;
  let store: SecretsStore;
  let app: express.Express;

  const userCredentials = mockCredentials.user();
  const mockAuth = mockServices.auth.mock();
  (mockAuth.isPrincipal as jest.Mock).mockImplementation(
    (credentials: any, type: string) => credentials?.principal?.type === type,
  );
  const mockHttpAuth = mockServices.httpAuth.mock();
  (mockHttpAuth.credentials as jest.Mock).mockResolvedValue(userCredentials);

  const mockActions = {
    list: jest.fn().mockResolvedValue({
      actions: [
        {
          id: 'test:secret-action',
          title: 'Secret Action',
          description: 'An action requiring secrets',
          schema: {
            input: { type: 'object' },
            output: { type: 'object' },
            secrets: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                  title: 'API Token',
                  description: 'Your API token',
                },
              },
              required: ['token'],
            },
          },
        },
      ],
    }),
    invoke: jest.fn(),
  };

  beforeEach(async () => {
    db = knexFactory({
      client: 'better-sqlite3',
      connection: ':memory:',
      useNullAsDefault: true,
    });
    store = await SecretsStore.create({ db, encryptionKey });

    const router = createElicitationRouter({
      secretsStore: store,
      actions: mockActions as any,
      httpAuth: mockHttpAuth as any,
      auth: mockAuth as any,
    });

    const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
      const statusMap: Record<string, number> = {
        NotFoundError: 404,
        NotAllowedError: 403,
        InputError: 400,
      };
      const status = statusMap[err.name] ?? 500;
      const body: ErrorResponseBody = {
        error: serializeError(err),
        request: { method: _req.method, url: _req.url },
        response: { statusCode: status },
      };
      res.status(status).json(body);
    };

    app = express();
    app.use('/api/mcp-actions', router);
    app.use(errorHandler);
  });

  afterEach(async () => {
    store.dispose();
    await db.destroy();
  });

  describe('GET /v1/elicitations/:id', () => {
    it('should return 404 for unknown elicitation', async () => {
      const { status } = await request(app).get(
        '/api/mcp-actions/v1/elicitations/nonexistent',
      );
      expect(status).toBe(404);
    });

    it('should return elicitation details for valid pending elicitation', async () => {
      const { csrfToken } = await store.createPending(
        'e1',
        'test:secret-action',
        'user:default/mock',
      );

      const { status, body } = await request(app).get(
        '/api/mcp-actions/v1/elicitations/e1',
      );

      expect(status).toBe(200);
      expect(body).toEqual({
        elicitationId: 'e1',
        action: {
          id: 'test:secret-action',
          title: 'Secret Action',
          description: 'An action requiring secrets',
        },
        secretsSchema: expect.objectContaining({
          type: 'object',
          properties: {
            token: expect.objectContaining({ type: 'string' }),
          },
        }),
        csrfToken,
      });
    });
  });

  describe('POST /v1/elicitations/:id/secrets', () => {
    it('should return 404 for unknown elicitation', async () => {
      const { status } = await request(app)
        .post('/api/mcp-actions/v1/elicitations/nonexistent/secrets')
        .send({ csrfToken: 'x', secrets: { token: 'y' } });

      expect(status).toBe(404);
    });

    it('should complete elicitation on valid POST', async () => {
      const { csrfToken } = await store.createPending(
        'e1',
        'test:secret-action',
        'user:default/mock',
      );

      const { status, body } = await request(app)
        .post('/api/mcp-actions/v1/elicitations/e1/secrets')
        .send({ csrfToken, secrets: { token: 'my-secret' } });

      expect(status).toBe(200);
      expect(body).toEqual({ ok: true });

      const secrets = await store.consume('e1');
      expect(secrets).toEqual({ token: 'my-secret' });
    });

    it('should reject invalid CSRF token', async () => {
      await store.createPending(
        'e1',
        'test:secret-action',
        'user:default/mock',
      );

      const { status } = await request(app)
        .post('/api/mcp-actions/v1/elicitations/e1/secrets')
        .send({ csrfToken: 'wrong', secrets: { token: 'my-secret' } });

      expect(status).toBe(400);
    });

    it('should reject missing secrets', async () => {
      const { csrfToken } = await store.createPending(
        'e1',
        'test:secret-action',
        'user:default/mock',
      );

      const { status } = await request(app)
        .post('/api/mcp-actions/v1/elicitations/e1/secrets')
        .send({ csrfToken });

      expect(status).toBe(400);
    });
  });
});
