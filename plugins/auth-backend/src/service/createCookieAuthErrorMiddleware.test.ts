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

import express from 'express';
import request from 'supertest';
import cookieParser from 'cookie-parser';
import { createCookieAuthErrorMiddleware } from './createCookieAuthErrorMiddleware';

const AUTH_ERROR_COOKIE = 'auth-error';

describe('createCookieAuthErrorMiddleware', () => {
  let app: express.Express;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use(cookieParser());

    app.use(
      createCookieAuthErrorMiddleware(
        'http://localhost:3000',
        'http://localhost:7000',
      ),
    );
  });

  it('should return cookie content if error cookie exists', async () => {
    const error = 'test';
    const res = await request(app)
      .get('/.backstage/error')
      .set('Cookie', `${AUTH_ERROR_COOKIE}=${encodeURIComponent(error)}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual('test');
  });

  it('should return 404 if error cookie does not exist', async () => {
    const res = await request(app).get('/.backstage/error');
    expect(res.status).toBe(404);
  });
});
