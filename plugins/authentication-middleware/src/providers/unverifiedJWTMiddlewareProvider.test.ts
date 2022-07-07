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

import { unverifiedJWTMiddlewareProvider } from '.';
import { Request } from 'express';

describe('jwtMiddlewareProvider', () => {
  describe('without authorization header', () => {
    const req = {} as Request;
    it('returns the correct identity from a jwt token', async () => {
      expect(await unverifiedJWTMiddlewareProvider(req)).toEqual(undefined);
    });
  });

  describe('without a non-jwt header', () => {
    const req = {
      headers: {
        authorization: 'Bearer garbage',
      },
    } as Request;
    it('returns the correct identity from a jwt token', async () => {
      expect(await unverifiedJWTMiddlewareProvider(req)).toEqual(undefined);
    });
  });

  describe('with a user/password header', () => {
    const req = {
      headers: {
        authorization: 'Basic garbage',
      },
    } as Request;
    it('returns the correct identity from a jwt token', async () => {
      expect(await unverifiedJWTMiddlewareProvider(req)).toEqual(undefined);
    });
  });

  describe('with a correct jwt token', () => {
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyOmRlZmF1bHQvZm5hbWUiLCJlbnQiOlsiZ3JvdXA6ZGVmYXVsdC90ZWFtIl19.Av1EIExRJ79vHiZ1MCC6xaX15xUcqYPv0uUNbvhMXDU';
    const req = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    } as Request;
    it('returns the correct identity from a jwt token', async () => {
      const identity = await unverifiedJWTMiddlewareProvider(req);
      expect(identity?.token).toEqual(token);
      expect(identity?.identity.userEntityRef).toEqual('user:default/fname');
      expect(identity?.identity.ownershipEntityRefs).toEqual([
        'group:default/team',
      ]);
    });
  });
});
