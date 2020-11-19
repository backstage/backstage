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
import request from 'supertest';
import { authenticationHandler } from './authenticationHandler';

describe('authenticationHandler', () => {
  it('checks if a request is authenticated', async () => {
    const requestAuthenticator = (req: express.Request): boolean => {
      const authHeader = req.header?.('Authorization');
      // This is just for unit-testing !
      // Tokens are generally cryptographically signed and to implement something
      // one needs to check the token using JWK's etc
      if (!authHeader || authHeader !== 'Test Token') {
        return false;
      }
      return true;
    };

    /* eslint-disable @typescript-eslint/no-unused-vars */
    const logRequest = (_req: express.Request) => {};

    const authenticator = {
      authenticateRequest: requestAuthenticator,
      logRequest: logRequest,
    };

    const app = express();
    app.use(authenticationHandler(authenticator));
    app.get('/exists', (_, res) => res.status(200).send('This page exists'));

    const unauthorizedResponse = await request(app).get('/exists');
    const authorizedResponse = await request(app)
      .get('/exists')
      .set('Authorization', 'Test Token');

    expect(unauthorizedResponse.status).toBe(403);
    expect(authorizedResponse.status).toBe(200);
  });
});
