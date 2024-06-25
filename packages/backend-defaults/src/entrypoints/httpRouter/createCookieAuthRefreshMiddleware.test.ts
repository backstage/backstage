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
import { mockCredentials, mockServices } from '@backstage/backend-test-utils';
import { createCookieAuthRefreshMiddleware } from './createCookieAuthRefreshMiddleware';

describe('createCookieAuthRefreshMiddleware', () => {
  let app: express.Express;

  beforeAll(async () => {
    const auth = mockServices.auth();
    const httpAuth = mockServices.httpAuth();
    const router = createCookieAuthRefreshMiddleware({ auth, httpAuth });
    app = express().use(router);
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should issue the user cookie', async () => {
    const response = await request(app).get('/.backstage/auth/v1/cookie');
    expect(response.status).toBe(200);
    expect(response.header['set-cookie'][0]).toMatch(
      `backstage-auth=${mockCredentials.limitedUser.token()}`,
    );
  });

  it('should remove the user cookie', async () => {
    const response = await request(app).delete('/.backstage/auth/v1/cookie');
    expect(response.status).toBe(204);
    expect(response.header['set-cookie'][0]).toMatch('backstage-auth=');
  });
});
