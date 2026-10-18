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
import { mockServices } from '@backstage/backend-test-utils';
import {
  metricsServiceMock,
  tracingServiceMock,
} from '@backstage/backend-test-utils/alpha';
import {
  AuthenticationError,
  NotAllowedError,
  ResponseError,
} from '@backstage/errors';
import express from 'express';
import request from 'supertest';
import { McpService } from '../services/McpService';
import { createStreamableRouter } from './createStreamableRouter';

describe('createStreamableRouter', () => {
  it('should respond with a status code matching the error type', async () => {
    const httpAuth = mockServices.httpAuth.mock();
    const mcpService = {
      getServer: jest.fn(),
    } as unknown as jest.Mocked<McpService>;

    const app = express();
    app.use(express.json());
    app.use(
      createStreamableRouter({
        mcpService,
        httpAuth,
        logger: mockServices.logger.mock(),
        metrics: metricsServiceMock.mock(),
        tracing: tracingServiceMock.mock(),
        auditor: mockServices.auditor.mock(),
      }),
    );

    httpAuth.credentials.mockRejectedValueOnce(
      new AuthenticationError(
        'no applicable key found in the JSON Web Key Set',
      ),
    );
    const unauthorized = await request(app).post('/').send({});
    expect(unauthorized.status).toBe(401);
    expect(unauthorized.body).toEqual({
      jsonrpc: '2.0',
      error: { code: -32000, message: 'Unauthorized' },
      id: null,
    });

    httpAuth.credentials.mockRejectedValueOnce(
      new NotAllowedError('This endpoint does not allow service credentials'),
    );
    const forbidden = await request(app).post('/').send({});
    expect(forbidden.status).toBe(403);
    expect(forbidden.body).toEqual({
      jsonrpc: '2.0',
      error: { code: -32000, message: 'Forbidden' },
      id: null,
    });

    const responseError = await ResponseError.fromResponse({
      ok: false,
      status: 404,
      statusText: 'Not Found',
      headers: new Headers({ 'content-type': 'application/json' }),
      redirected: false,
      type: 'default',
      url: 'http://localhost/api/catalog/.backstage/actions/v1/actions',
      text: async () =>
        JSON.stringify({
          error: { name: 'NotFoundError', message: 'No such action' },
          request: { method: 'GET', url: '/.backstage/actions/v1/actions' },
          response: { statusCode: 404 },
        }),
    });
    mcpService.getServer.mockImplementationOnce(() => {
      throw responseError;
    });
    const notFound = await request(app).post('/').send({});
    expect(notFound.status).toBe(404);
    expect(notFound.body).toEqual({
      jsonrpc: '2.0',
      error: { code: -32000, message: 'Not Found' },
      id: null,
    });

    mcpService.getServer.mockImplementationOnce(() => {
      throw Object.assign(new Error('unavailable'), { statusCode: 503 });
    });
    const unavailable = await request(app).post('/').send({});
    expect(unavailable.status).toBe(503);
    expect(unavailable.body).toEqual({
      jsonrpc: '2.0',
      error: { code: -32603, message: 'Service Unavailable' },
      id: null,
    });

    mcpService.getServer.mockImplementationOnce(() => {
      throw new Error('boom');
    });
    const internal = await request(app).post('/').send({});
    expect(internal.status).toBe(500);
    expect(internal.body).toEqual({
      jsonrpc: '2.0',
      error: { code: -32603, message: 'Internal server error' },
      id: null,
    });
  });
});
