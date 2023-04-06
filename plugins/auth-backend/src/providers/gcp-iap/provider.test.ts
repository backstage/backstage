/*
 * Copyright 2020 The Backstage Authors
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
import { AuthResolverContext } from '../types';
import { GcpIapProvider } from './provider';
import { DEFAULT_IAP_JWT_HEADER } from './types';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('GcpIapProvider', () => {
  const authHandler = jest.fn();
  const signInResolver = jest.fn();
  const tokenValidator = jest.fn();

  it.each([undefined, 'x-custom-header'])(
    'runs the happy path',
    async jwtHeader => {
      const provider = new GcpIapProvider({
        authHandler,
        signInResolver,
        tokenValidator,
        resolverContext: {} as AuthResolverContext,
        jwtHeader: jwtHeader,
      });

      // { "sub": "user:default/me", "ent": ["group:default/home"] }
      const backstageToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyOmRlZmF1bHQvbWUiLCJlbnQiOlsiZ3JvdXA6ZGVmYXVsdC9ob21lIl19.CbmAKzFErGmtsnpRxyPc7dHv7WEjb5lY6206YCzR_Rc';
      const iapToken = { sub: 's', email: 'e@mail.com' };

      authHandler.mockResolvedValueOnce({ email: 'e@mail.com' });
      signInResolver.mockResolvedValueOnce({ token: backstageToken });
      tokenValidator.mockResolvedValueOnce(iapToken);

      const app = express();
      app.use('/refresh', provider.refresh.bind(provider));

      const header = jwtHeader || DEFAULT_IAP_JWT_HEADER;
      const response = await request(app).get('/refresh').set(header, 'token');

      expect(response.status).toBe(200);
      expect(response.get('content-type')).toBe(
        'application/json; charset=utf-8',
      );
      expect(response.body).toEqual({
        backstageIdentity: {
          token: backstageToken,
          identity: {
            type: 'user',
            userEntityRef: 'user:default/me',
            ownershipEntityRefs: ['group:default/home'],
          },
        },
        providerInfo: { iapToken },
      });
    },
  );
});
