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

afterEach(() => {
  jest.restoreAllMocks();
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

    it('caches public keys between validations', async () => {
      const getIapPublicKeys = jest.fn(async () => ({ pubkeys: {} }));
      const verifySignedJwtWithCertsAsync = jest.fn(async () => ({
        getPayload: () => ({ sub: 's', email: 'e@mail.com' }),
      }));
      const validator = createTokenValidator('a', {
        getIapPublicKeys,
        verifySignedJwtWithCertsAsync,
      } as unknown as OAuth2Client);

      await validator(mockJwt);
      await validator(mockJwt);

      expect(getIapPublicKeys).toHaveBeenCalledTimes(1);
      expect(verifySignedJwtWithCertsAsync).toHaveBeenCalledTimes(2);
    });

    it('shares an in-flight public key request between validations', async () => {
      let resolvePublicKeys:
        | ((value: { pubkeys: Record<string, string> }) => void)
        | undefined;
      const getIapPublicKeys = jest.fn(
        () =>
          new Promise<{ pubkeys: Record<string, string> }>(resolve => {
            resolvePublicKeys = resolve;
          }),
      );
      const mockClient = {
        getIapPublicKeys,
        verifySignedJwtWithCertsAsync: async () => ({
          getPayload: () => ({ sub: 's', email: 'e@mail.com' }),
        }),
      };
      const validator = createTokenValidator(
        'a',
        mockClient as unknown as OAuth2Client,
      );

      const firstValidation = validator(mockJwt);
      const secondValidation = validator(mockJwt);

      expect(getIapPublicKeys).toHaveBeenCalledTimes(1);

      if (!resolvePublicKeys) {
        throw new Error('Expected a public key request to be in flight');
      }
      resolvePublicKeys({ pubkeys: {} });

      await expect(
        Promise.all([firstValidation, secondValidation]),
      ).resolves.toHaveLength(2);
    });

    it('refreshes public keys when the cache expires', async () => {
      const dateNow = jest.spyOn(Date, 'now').mockReturnValue(0);
      const getIapPublicKeys = jest.fn(async () => ({ pubkeys: {} }));
      const mockClient = {
        getIapPublicKeys,
        verifySignedJwtWithCertsAsync: async () => ({
          getPayload: () => ({ sub: 's', email: 'e@mail.com' }),
        }),
      };
      const validator = createTokenValidator(
        'a',
        mockClient as unknown as OAuth2Client,
      );

      await validator(mockJwt);
      dateNow.mockReturnValue(60 * 60 * 1000);
      await validator(mockJwt);

      expect(getIapPublicKeys).toHaveBeenCalledTimes(2);
    });

    it('does not cache failed public key requests', async () => {
      const getIapPublicKeys = jest
        .fn()
        .mockRejectedValueOnce(new Error('NOPE'))
        .mockResolvedValueOnce({ pubkeys: {} });
      const mockClient = {
        getIapPublicKeys,
        verifySignedJwtWithCertsAsync: async () => ({
          getPayload: () => ({ sub: 's', email: 'e@mail.com' }),
        }),
      };
      const validator = createTokenValidator(
        'a',
        mockClient as unknown as OAuth2Client,
      );

      await expect(validator(mockJwt)).rejects.toThrow(
        'Unable to list Google IAP token verification keys, Error: NOPE',
      );
      await expect(validator(mockJwt)).resolves.toMatchObject({
        sub: 's',
        email: 'e@mail.com',
      });

      expect(getIapPublicKeys).toHaveBeenCalledTimes(2);
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
