/*
 * Copyright 2021 The Backstage Authors
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

import { ConflictError } from '@backstage/errors';
import { OAuth2Client } from 'google-auth-library';
import { createTokenValidator, parseRequestToken } from './helpers';

const validJwt =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImZvbyIsImlzcyI6ImZvbyJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.T2BNS4G-6RoiFnXc8Q8TiwdWzTpNitY8jcsGM3N3-Yo';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('helpers', () => {
  describe('createTokenValidator', () => {
    it('runs the happy path', async () => {
      const mockClient = {
        getIapPublicKeys: async () => ({ pubkeys: '' }),
        verifySignedJwtWithCertsAsync: async () => ({
          getPayload: () => ({ sub: 's', email: 'e@mail.com' }),
        }),
      };
      const validator = createTokenValidator(
        'a',
        mockClient as unknown as OAuth2Client,
      );
      await expect(validator(validJwt)).resolves.toMatchObject({
        sub: 's',
        email: 'e@mail.com',
      });
    });

    it('throws if the client throws', async () => {
      const mockClient = {
        getIapPublicKeys: async () => {
          throw new TypeError('bam');
        },
      };
      const validator = createTokenValidator(
        'a',
        mockClient as unknown as OAuth2Client,
      );
      await expect(validator(validJwt)).rejects.toThrow(TypeError);
    });

    it('rejects empty payload', async () => {
      const mockClient = {
        getIapPublicKeys: async () => ({ pubkeys: '' }),
        verifySignedJwtWithCertsAsync: async () => ({
          getPayload: () => undefined,
        }),
      };
      const validator = createTokenValidator(
        'a',
        mockClient as unknown as OAuth2Client,
      );
      await expect(validator(validJwt)).rejects.toMatchObject({
        name: 'TypeError',
        message: 'Token had no payload',
      });
    });
  });

  describe('parseRequestToken', () => {
    it('runs the happy path', async () => {
      await expect(
        parseRequestToken(
          validJwt,
          async () => ({ sub: 's', email: 'e@mail.com' } as any),
        ),
      ).resolves.toMatchObject({
        iapToken: {
          sub: 's',
          email: 'e@mail.com',
        },
      });
    });

    it('rejects bad tokens', async () => {
      await expect(
        parseRequestToken(7, undefined as any),
      ).rejects.toMatchObject({
        name: 'AuthenticationError',
        message: 'Missing Google IAP header',
      });
      await expect(
        parseRequestToken(undefined, undefined as any),
      ).rejects.toMatchObject({
        name: 'AuthenticationError',
        message: 'Missing Google IAP header',
      });
      await expect(
        parseRequestToken('', undefined as any),
      ).rejects.toMatchObject({
        name: 'AuthenticationError',
        message: 'Missing Google IAP header',
      });
    });

    it('translates validator errors', async () => {
      await expect(
        parseRequestToken(validJwt, async () => {
          throw new ConflictError('Ouch');
        }),
      ).rejects.toMatchObject({
        name: 'AuthenticationError',
        message: 'Google IAP token verification failed, ConflictError: Ouch',
      });
    });

    it('rejects bad token payloads', async () => {
      await expect(
        parseRequestToken(validJwt, async () => ({ sub: 'a' } as any)),
      ).rejects.toMatchObject({
        name: 'AuthenticationError',
        message: 'Google IAP token payload is missing sub and/or email claim',
      });
    });
  });
});
