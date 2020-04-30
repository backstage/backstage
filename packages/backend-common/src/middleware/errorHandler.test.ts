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

  it('takes code from StatusCodeError', async () => {
    const app = express();
    app.use('/breaks', () => {
      throw createError(432, 'Some Message');
    });
    app.use(errorHandler());

    const response = await request(app).get('/breaks');

    expect(response.status).toBe(432);
    expect(response.text).toContain('Some Message');
  });
});
