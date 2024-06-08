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

import { OAuth2Client } from 'google-auth-library';
import { createTokenValidator } from './helpers';

const mockJwt = 'a.b.c';

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
      await expect(validator(mockJwt)).resolves.toMatchObject({
        sub: 's',
        email: 'e@mail.com',
      });
    });

    it('throws if listing keys fail', async () => {
      const mockClient = {
        getIapPublicKeys: async () => {
          throw new Error('NOPE');
        },
      };
      const validator = createTokenValidator(
        'a',
        mockClient as unknown as OAuth2Client,
      );
      await expect(validator(mockJwt)).rejects.toThrow(
        'Unable to list Google IAP token verification keys, Error: NOPE',
      );
    });

    it('throws if the verifying signature fails', async () => {
      const mockClient = {
        getIapPublicKeys: async () => ({ pubkeys: '' }),
        verifySignedJwtWithCertsAsync: async () => {
          throw new Error('NOPE');
        },
      };
      const validator = createTokenValidator(
        'a',
        mockClient as unknown as OAuth2Client,
      );
      await expect(validator(mockJwt)).rejects.toThrow(
        'Google IAP token verification failed, Error: NOPE',
      );
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
      await expect(validator(mockJwt)).rejects.toThrow(
        'Google IAP token verification failed, token had no payload',
      );
    });

    it('rejects payload without subject', async () => {
      const mockClient = {
        getIapPublicKeys: async () => ({ pubkeys: '' }),
        verifySignedJwtWithCertsAsync: async () => ({
          getPayload: () => ({ email: 'e@mail.com' }),
        }),
      };
      const validator = createTokenValidator(
        'a',
        mockClient as unknown as OAuth2Client,
      );
      await expect(validator(mockJwt)).rejects.toThrow(
        'Google IAP token payload is missing subject claim',
      );
    });

    it('rejects payload without email', async () => {
      const mockClient = {
        getIapPublicKeys: async () => ({ pubkeys: '' }),
        verifySignedJwtWithCertsAsync: async () => ({
          getPayload: () => ({ sub: 's' }),
        }),
      };
      const validator = createTokenValidator(
        'a',
        mockClient as unknown as OAuth2Client,
      );
      await expect(validator(mockJwt)).rejects.toThrow(
        'Google IAP token payload is missing email claim',
      );
    });
  });
});
