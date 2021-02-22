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

  it('doesnt try to send the response again if its already been sent', async () => {
    const app = express();
    const mockSend = jest.fn();

    app.use('/works_with_async_fail', (_, res) => {
      res.status(200).send('hello');

      // mutate the response object to test the middlware.
      // it's hard to catch errors inside middleware from the outside.
      // @ts-ignore
      res.send = mockSend;
      throw new Error('some message');
    });

    app.use(errorHandler());
    const response = await request(app).get('/works_with_async_fail');

    expect(response.status).toBe(200);
    expect(response.text).toBe('hello');

    expect(mockSend).not.toHaveBeenCalled();
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
    app.use('/NotModifiedError', () => {
      throw new errors.NotModifiedError();
    });
    app.use('/InputError', () => {
      throw new errors.InputError();
    });
    app.use('/AuthenticationError', () => {
      throw new errors.AuthenticationError();
    });
    app.use('/NotAllowedError', () => {
      throw new errors.NotAllowedError();
    });
    app.use('/NotFoundError', () => {
      throw new errors.NotFoundError();
    });
    app.use('/ConflictError', () => {
      throw new errors.ConflictError();
    });
    app.use(errorHandler());

    const r = request(app);
    expect((await r.get('/NotModifiedError')).status).toBe(304);
    expect((await r.get('/InputError')).status).toBe(400);
    expect((await r.get('/AuthenticationError')).status).toBe(401);
    expect((await r.get('/NotAllowedError')).status).toBe(403);
    expect((await r.get('/NotFoundError')).status).toBe(404);
    expect((await r.get('/ConflictError')).status).toBe(409);
  });

  it('logs all 500 errors', async () => {
    const app = express();

    const mockLogger = { child: jest.fn(), error: jest.fn() };
    mockLogger.child.mockImplementation(() => mockLogger as any);

    const thrownError = new Error('some error');

    app.use('/breaks', () => {
      throw thrownError;
    });
    app.use(errorHandler({ logger: mockLogger as any }));

    await request(app).get('/breaks');

    expect(mockLogger.error).toHaveBeenCalledWith(thrownError);
  });

  it('does not log 400 errors', async () => {
    const app = express();

    const mockLogger = { child: jest.fn(), error: jest.fn() };
    mockLogger.child.mockImplementation(() => mockLogger as any);

    app.use('/NotFound', () => {
      throw new errors.NotFoundError();
    });
    app.use(errorHandler({ logger: mockLogger as any }));

    await request(app).get('/NotFound');

    expect(mockLogger.error).not.toHaveBeenCalled();
  });
});
