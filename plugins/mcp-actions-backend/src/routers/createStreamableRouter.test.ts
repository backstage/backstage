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
import express from 'express';
import request from 'supertest';
import { mockServices } from '@backstage/backend-test-utils';
import {
  metricsServiceMock,
  tracingServiceMock,
} from '@backstage/backend-test-utils/alpha';
import { AuthenticationError, NotAllowedError } from '@backstage/errors';
import { McpService } from '../services/McpService';
import { createStreamableRouter } from './createStreamableRouter';

describe('createStreamableRouter', () => {
  const setup = () => {
    const httpAuth = mockServices.httpAuth.mock();
    const logger = mockServices.logger.mock();
    const auditor = mockServices.auditor.mock();
    const metrics = metricsServiceMock.mock();
    const tracing = tracingServiceMock.mock();
    const mcpService = { getServer: jest.fn() };

    const connectionEvent = { success: jest.fn(), fail: jest.fn() };
    auditor.createEvent.mockResolvedValue(connectionEvent);

    const record = jest.fn();
    metrics.createHistogram.mockReturnValue({ record });

    const app = express();
    app.use(express.json());
    app.use(
      createStreamableRouter({
        mcpService: mcpService as unknown as McpService,
        httpAuth,
        logger,
        metrics,
        tracing,
        auditor,
      }),
    );

    return { app, httpAuth, mcpService, connectionEvent, record };
  };

  it.each([
    {
      name: 'AuthenticationError',
      error: new AuthenticationError('missing credentials'),
      status: 401,
      code: -32001,
      message: 'Unauthorized',
    },
    {
      name: 'NotAllowedError',
      error: new NotAllowedError('not permitted'),
      status: 403,
      code: -32002,
      message: 'Forbidden',
    },
    {
      name: 'Error',
      error: new Error('something broke'),
      status: 500,
      code: -32603,
      message: 'Internal server error',
    },
  ])(
    'responds with $status and JSON-RPC code $code when credentials fail with $name',
    async ({ name, error, status, code, message }) => {
      const { app, httpAuth, mcpService, connectionEvent, record } = setup();
      httpAuth.credentials.mockRejectedValue(error);

      const response = await request(app)
        .post('/')
        .send({ jsonrpc: '2.0', method: 'tools/list', id: 1 });

      expect(response.status).toBe(status);
      expect(response.body).toEqual({
        jsonrpc: '2.0',
        error: { code, message },
        id: null,
      });
      expect(mcpService.getServer).not.toHaveBeenCalled();
      expect(connectionEvent.fail).toHaveBeenCalledWith({ error });
      expect(connectionEvent.success).not.toHaveBeenCalled();
      expect(record).toHaveBeenCalledWith(expect.any(Number), {
        'mcp.protocol.version': expect.any(String),
        'network.transport': 'tcp',
        'network.protocol.name': 'http',
        'error.type': name,
      });
    },
  );
});
