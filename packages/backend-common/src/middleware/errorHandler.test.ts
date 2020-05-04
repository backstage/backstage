/*
 * Copyright 2020 Spotify AB
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
import createError from 'http-errors';
import request from 'supertest';
import * as errors from '../errors';
import { errorHandler } from './errorHandler';

describe('errorHandler', () => {
  it('gives default code and message', async () => {
    const app = express();
    app.use('/breaks', () => {
      throw new Error('some message');
    });
    app.use(errorHandler());

    const response = await request(app).get('/breaks');

    expect(response.status).toBe(500);
    expect(response.text).toBe('some message');
  });

  it('takes code from http-errors library errors', async () => {
    const app = express();
    app.use('/breaks', () => {
      throw createError(432, 'Some Message');
    });
    app.use(errorHandler());

    const response = await request(app).get('/breaks');

    expect(response.status).toBe(432);
    expect(response.text).toContain('Some Message');
  });

  it('handles well-known error classes', async () => {
    const app = express();
    app.use('/BadRequestError', () => {
      throw new errors.BadRequestError();
    });
    app.use('/UnauthenticatedError', () => {
      throw new errors.UnauthenticatedError();
    });
    app.use('/ForbiddenError', () => {
      throw new errors.ForbiddenError();
    });
    app.use('/NotFoundError', () => {
      throw new errors.NotFoundError();
    });
    app.use('/ConflictError', () => {
      throw new errors.ConflictError();
    });
    app.use(errorHandler());

    const r = request(app);
    expect((await r.get('/BadRequestError')).status).toBe(400);
    expect((await r.get('/UnauthenticatedError')).status).toBe(401);
    expect((await r.get('/ForbiddenError')).status).toBe(403);
    expect((await r.get('/NotFoundError')).status).toBe(404);
    expect((await r.get('/ConflictError')).status).toBe(409);
  });
});
