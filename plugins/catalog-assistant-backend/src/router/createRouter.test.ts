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
import express from 'express';
import request from 'supertest';
import { createRouter } from './createRouter';
import { QueryService } from '../services/QueryService';

const buildApp = (svc: Partial<QueryService>) => {
  const app = express();
  app.use(
    createRouter({
      queryService: svc as QueryService,
      httpAuth: mockServices.httpAuth(),
      logger: mockServices.logger.mock(),
    }),
  );
  // Translate framework errors to JSON for assertions.
  app.use(
    (
      err: any,
      _req: express.Request,
      res: express.Response,
      _next: express.NextFunction,
    ) => {
      const status =
        err?.name === 'InputError'
          ? 400
          : err?.status ?? err?.statusCode ?? 500;
      res
        .status(status)
        .json({ error: { message: err?.message ?? String(err) } });
    },
  );
  return app;
};

describe('createRouter', () => {
  it('POST /v1/query returns the QueryService result', async () => {
    const query = jest.fn().mockResolvedValue({
      answer: 'group:platform',
      citations: ['component:default/a'],
    });
    const app = buildApp({ query });

    const res = await request(app)
      .post('/v1/query')
      .send({ question: 'who owns a?' });

    expect(res.status).toEqual(200);
    expect(res.body).toEqual({
      answer: 'group:platform',
      citations: ['component:default/a'],
    });
    expect(query).toHaveBeenCalledWith(
      'who owns a?',
      expect.objectContaining({ credentials: expect.any(Object) }),
    );
  });

  it('rejects requests without a string question', async () => {
    const query = jest.fn();
    const app = buildApp({ query });

    const res = await request(app).post('/v1/query').send({});

    expect(res.status).toEqual(400);
    expect(res.body.error.message).toMatch(/must include a string `question`/);
    expect(query).not.toHaveBeenCalled();
  });
});
