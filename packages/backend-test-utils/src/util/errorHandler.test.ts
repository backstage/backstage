/*
 * Copyright 2024 The Backstage Authors
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

import { InputError } from '@backstage/errors';
import express from 'express';
import request from 'supertest';
import { mockErrorHandler } from './errorHandler';

describe('mockErrorHandler', () => {
  it('should return a function', () => {
    const errorHandler = mockErrorHandler();
    expect(errorHandler).toBeInstanceOf(Function);
  });

  it('should hint that it must be called', () => {
    const app = express();

    // @ts-expect-error - passing the function directly should result in a type error
    app.use(mockErrorHandler);

    app.use(mockErrorHandler());

    expect('test').toBe('test');
  });

  it('should convert errors in an express app', async () => {
    const errorHandler = mockErrorHandler();

    const app = express();
    app.get('/plain', () => {
      throw new Error('test');
    });
    app.get('/input', () => {
      throw new InputError('bad');
    });
    app.use(errorHandler);

    await expect(request(app).get('/plain')).resolves.toMatchObject({
      status: 500,
      body: {
        error: {
          name: 'Error',
          message: 'test',
        },
      },
    });

    await expect(request(app).get('/input')).resolves.toMatchObject({
      status: 400,
      body: {
        error: {
          name: 'InputError',
          message: 'bad',
        },
      },
    });
  });
});
