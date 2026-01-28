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

import { auditorMiddlewareFactory } from './auditor';
import express from 'express';
import request from 'supertest';
import type { AuditorService } from '@backstage/backend-plugin-api';
import { MiddlewareFactory } from '@backstage/backend-defaults/rootHttpRouter';
import { mockServices } from '@backstage/backend-test-utils';
import { InputError } from '@backstage/errors';
import { createValidatedOpenApiRouterFromGeneratedEndpointMap } from '../stub';

const middleware = MiddlewareFactory.create({
  logger: mockServices.logger.mock(),
  config: mockServices.rootConfig(),
});

describe('auditorMiddleware', () => {
  const createMockAuditor = () => {
    const mockSuccess = jest.fn().mockResolvedValue(undefined);
    const mockFail = jest.fn().mockResolvedValue(undefined);
    const mockCreateEvent = jest.fn().mockResolvedValue({
      success: mockSuccess,
      fail: mockFail,
    });

    const auditor: AuditorService = {
      createEvent: mockCreateEvent,
    };

    return { auditor, mockCreateEvent, mockSuccess, mockFail };
  };

  const specWithAuditor = {
    openapi: '3.0.2',
    info: {
      title: 'Test API',
      version: '1.0.0',
    },
    paths: {
      '/entities/refresh': {
        post: {
          operationId: 'refreshEntity',
          'x-backstage-auditor': {
            eventId: 'entity-mutate',
            severityLevel: 'medium',
            meta: {
              queryType: 'refresh',
              entityRef: '{{ request.body.entityRef }}',
            },
          },
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    entityRef: {
                      type: 'string',
                    },
                  },
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Success',
            },
          },
        },
      },
      '/users/{userId}': {
        get: {
          operationId: 'getUser',
          'x-backstage-auditor': {
            eventId: 'user-fetch',
            severityLevel: 'low',
            meta: {
              userId: '{{ request.params.userId }}',
              includeDetails: '{{ request.query.includeDetails }}',
            },
          },
          parameters: [
            {
              name: 'userId',
              in: 'path',
              required: true,
              schema: {
                type: 'string',
              },
            },
            {
              name: 'includeDetails',
              in: 'query',
              schema: {
                type: 'boolean',
              },
            },
          ],
          responses: {
            '200': {
              description: 'Success',
            },
          },
        },
      },
      '/no-audit': {
        get: {
          operationId: 'noAudit',
          responses: {
            '200': {
              description: 'Success',
            },
          },
        },
      },

      '/nested-fields': {
        post: {
          operationId: 'test',
          'x-backstage-auditor': {
            eventId: 'test-event',
            meta: {
              'user.id': '{{ request.body.user.id }}',
              'user.email': '{{ request.body.user.email }}',
            },
          },
          responses: { '200': { description: 'OK' } },
        },
      },

      '/with-response': {
        post: {
          operationId: 'processData',
          'x-backstage-auditor': {
            eventId: 'data-process',
            severityLevel: 'medium',
            meta: {
              resultId: '{{ response.body.resultId }}',
              processedCount: '{{ response.body.processedCount }}',
            },
          },
          responses: { '200': { description: 'OK' } },
        },
      },
    },
  } as const;

  let app: express.Router;
  let router: express.Router;
  let mockAuditor: ReturnType<typeof createMockAuditor>;
  let errorMiddleware: express.ErrorRequestHandler;
  beforeEach(() => {
    router =
      createValidatedOpenApiRouterFromGeneratedEndpointMap(specWithAuditor);
    app = express().use(router);
    mockAuditor = createMockAuditor();
    const { success, error } = auditorMiddlewareFactory({
      auditor: mockAuditor.auditor,
      logger: mockServices.logger.mock(),
    });
    errorMiddleware = error;
    app.use(express.json());
    router.use(success);
  });

  it('creates audit event and calls success on 2xx response', async () => {
    const { mockCreateEvent, mockSuccess } = mockAuditor;
    router.post('/entities/refresh', (_req, res) => {
      res.json({ success: true });
    });
    router.use(errorMiddleware);
    await request(app)
      .post('/entities/refresh')
      .send({ entityRef: 'component:default/test' })
      .expect(200);

    expect(mockCreateEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        eventId: 'entity-mutate',
        severityLevel: 'medium',
        meta: expect.objectContaining({
          queryType: 'refresh',
          entityRef: 'component:default/test',
        }),
      }),
    );

    expect(mockSuccess).toHaveBeenCalledTimes(1);
  });

  it('captures request params and query parameters', async () => {
    const { mockCreateEvent, mockSuccess } = mockAuditor;

    router.get('/users/:userId', (req, res) => {
      res.json({ id: req.params.userId });
    });

    router.use(errorMiddleware);

    await request(app).get('/users/user123?includeDetails=true').expect(200);

    expect(mockCreateEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        eventId: 'user-fetch',
        severityLevel: 'low',
        meta: expect.objectContaining({
          includeDetails: true,
          userId: 'user123',
        }),
      }),
    );

    expect(mockSuccess).toHaveBeenCalledTimes(1);
  });

  it('calls fail on non-2xx status codes', async () => {
    const { mockCreateEvent, mockFail } = mockAuditor;

    router.post('/entities/refresh', _req => {
      throw new InputError('Invalid entityRef');
    });

    router.use(errorMiddleware);
    router.use(middleware.error());

    await request(app)
      .post('/entities/refresh')
      .send({ entityRef: 'component:default/test' })
      .expect(400);

    expect(mockCreateEvent).toHaveBeenCalled();
    expect(mockCreateEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        eventId: 'entity-mutate',
        severityLevel: 'medium',
        meta: expect.objectContaining({
          entityRef: 'component:default/test',
          queryType: 'refresh',
        }),
      }),
    );
    expect(mockFail).toHaveBeenCalledWith({
      error: expect.any(Error),
    });
  });

  it('does not create audit event for routes without x-backstage-auditor', async () => {
    const { mockCreateEvent } = createMockAuditor();

    router.get('/no-audit', (_req, res) => {
      res.json({ success: true });
    });
    router.use(errorMiddleware);

    await request(app).get('/no-audit').expect(200);

    expect(mockCreateEvent).not.toHaveBeenCalled();
  });

  it('handles nested field extraction from request body', async () => {
    const { mockCreateEvent } = mockAuditor;

    router.post('/nested-fields', (_req, res) => {
      res.json({ success: true });
    });
    router.use(errorMiddleware);

    await request(app)
      .post('/nested-fields')
      .send({
        user: {
          id: 'user123',
          email: 'test@example.com',
        },
      })
      .expect(200);

    expect(mockCreateEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        eventId: 'test-event',
        meta: expect.objectContaining({
          'user.id': 'user123',
          'user.email': 'test@example.com',
        }),
      }),
    );
  });

  it('captures metadata from response body', async () => {
    const { mockCreateEvent, mockSuccess } = mockAuditor;

    router.post('/with-response', (_req, res) => {
      res.json({
        success: true,
        resultId: 'result-456',
        processedCount: 42,
      });
    });
    router.use(errorMiddleware);

    await request(app)
      .post('/with-response')
      .send({ data: 'test' })
      .expect(200);

    expect(mockCreateEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        eventId: 'data-process',
        severityLevel: 'medium',
      }),
    );

    expect(mockSuccess).toHaveBeenCalledTimes(1);
    expect(mockSuccess).toHaveBeenCalledWith(
      expect.objectContaining({
        meta: expect.objectContaining({
          resultId: 'result-456',
          processedCount: 42,
        }),
      }),
    );
  });
});
