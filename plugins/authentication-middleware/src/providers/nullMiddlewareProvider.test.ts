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

import { nullMiddlewareProvider } from '.';
import { Request } from 'express';

describe('nullMiddlewareProvider', () => {
  const rawPayload = Buffer.from(
    JSON.stringify({
      sub: 'user:default/guest',
      ent: ['group:default/guests'],
    }),
    'utf8',
  ).toString('base64');
  let mockToken = ['blob', rawPayload, 'blob'].join('.');
  let req: Request;

  describe('without authorization header', () => {
    beforeEach(() => {
      req = {} as Request;
    });
    it('returns the correct identity from a jwt token', async () => {
      expect(await nullMiddlewareProvider(req)).toEqual(undefined);
    });
  });

  describe('with a non-jwt header', () => {
    beforeEach(() => {
      ('');
      mockToken = mockToken.split('').reverse().join('');
      req = {
        headers: {
          authorization: `Bearer ${mockToken}`,
        },
      } as Request;
    });

    it('returns the correct identity from a jwt token', async () => {
      expect(await nullMiddlewareProvider(req)).toEqual(undefined);
    });
  });

  describe('with a user/password header', () => {
    beforeEach(() => {
      const credentials = Buffer.from('user:password', 'utf-8').toString(
        'base64',
      );
      req = {
        headers: {
          authorization: `Basic ${credentials}`,
        },
      } as Request;
    });

    it('returns the correct identity from a jwt token', async () => {
      expect(await nullMiddlewareProvider(req)).toEqual(undefined);
    });
  });

  describe('with a jwt token', () => {
    beforeEach(() => {
      req = {
        headers: {
          authorization: `Bearer ${mockToken}`,
        },
      } as Request;
    });
    it('returns undefined', async () => {
      const identity = await nullMiddlewareProvider(req);
      expect(identity?.identity).toEqual(undefined);
    });
  });
});
