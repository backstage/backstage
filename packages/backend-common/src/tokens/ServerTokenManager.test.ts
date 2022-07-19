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

import { ConfigReader } from '@backstage/config';
import * as jose from 'jose';
import { Logger } from 'winston';
import { getVoidLogger } from '../logging/voidLogger';
import { ServerTokenManager } from './ServerTokenManager';
import { TokenManager } from './types';

const emptyConfig = new ConfigReader({});
const configWithSecret = new ConfigReader({
  backend: { auth: { keys: [{ secret: 'a-secret-key' }] } },
});
const env = process.env;
let logger: Logger;

describe('ServerTokenManager', () => {
  beforeEach(() => {
    process.env = { ...env };
    logger = getVoidLogger();
  });

  afterEach(() => {
    process.env = env;
    jest.useRealTimers();
  });

  describe('getToken', () => {
    it('should return a token', async () => {
      const tokenManager = ServerTokenManager.fromConfig(configWithSecret, {
        logger,
      });
      expect((await tokenManager.getToken()).token).toBeDefined();
    });

    it('should return a token string if using a noop TokenManager', async () => {
      const tokenManager = ServerTokenManager.noop();
      expect((await tokenManager.getToken()).token).toBeDefined();
    });
  });

  describe('authenticate', () => {
    it('should not throw if token is valid', async () => {
      const tokenManager = ServerTokenManager.fromConfig(configWithSecret, {
        logger,
      });
      const { token } = await tokenManager.getToken();
      await expect(tokenManager.authenticate(token)).resolves.not.toThrow();
    });

    it('should throw if token is invalid', async () => {
      const tokenManager = ServerTokenManager.fromConfig(configWithSecret, {
        logger,
      });
      await expect(
        tokenManager.authenticate('random-string'),
      ).rejects.toThrowError(/invalid server token/i);
    });

    it('should validate server tokens created by a different instance using the same secret', async () => {
      const tokenManager1 = ServerTokenManager.fromConfig(configWithSecret, {
        logger,
      });
      const tokenManager2 = ServerTokenManager.fromConfig(configWithSecret, {
        logger,
      });

      const { token } = await tokenManager1.getToken();

      await expect(tokenManager2.authenticate(token)).resolves.not.toThrow();
    });

    it('should validate server tokens created using any of the secrets', async () => {
      const tokenManager1 = ServerTokenManager.fromConfig(
        new ConfigReader({
          backend: { auth: { keys: [{ secret: 'a1b2c3' }] } },
        }),
        { logger },
      );
      const tokenManager2 = ServerTokenManager.fromConfig(
        new ConfigReader({
          backend: { auth: { keys: [{ secret: 'd4e5f6' }] } },
        }),
        { logger },
      );
      const tokenManager3 = ServerTokenManager.fromConfig(
        new ConfigReader({
          backend: {
            auth: { keys: [{ secret: 'a1b2c3' }, { secret: 'd4e5f6' }] },
          },
        }),
        { logger },
      );

      const { token: token1 } = await tokenManager1.getToken();
      await expect(tokenManager3.authenticate(token1)).resolves.not.toThrow();

      const { token: token2 } = await tokenManager2.getToken();
      await expect(tokenManager3.authenticate(token2)).resolves.not.toThrow();
    });

    it('should throw for server tokens created using a different secret', async () => {
      const tokenManager1 = ServerTokenManager.fromConfig(
        new ConfigReader({
          backend: { auth: { keys: [{ secret: 'a1b2c3' }] } },
        }),
        { logger },
      );
      const tokenManager2 = ServerTokenManager.fromConfig(
        new ConfigReader({
          backend: { auth: { keys: [{ secret: 'd4e5f6' }] } },
        }),
        { logger },
      );

      const { token } = await tokenManager1.getToken();

      await expect(tokenManager2.authenticate(token)).rejects.toThrowError(
        /invalid server token/i,
      );
    });

    it('should throw for server tokens created using a noop TokenManager', async () => {
      const noopTokenManager = ServerTokenManager.noop();
      const tokenManager = ServerTokenManager.fromConfig(
        new ConfigReader({
          backend: { auth: { keys: [{ secret: 'a1b2c3' }] } },
        }),
        { logger },
      );

      const { token } = await noopTokenManager.getToken();

      await expect(tokenManager.authenticate(token)).rejects.toThrowError(
        /invalid server token/i,
      );
    });

    it('should throw for server tokens created by a different generated secret', async () => {
      (process.env as any).NODE_ENV = 'development';
      const tokenManager1 = ServerTokenManager.fromConfig(
        new ConfigReader({
          backend: { auth: { keys: [{ secret: 'a1b2c3' }] } },
        }),
        { logger },
      );
      const tokenManager2 = ServerTokenManager.fromConfig(emptyConfig, {
        logger,
      });

      const { token } = await tokenManager2.getToken();

      await expect(tokenManager1.authenticate(token)).rejects.toThrowError(
        /invalid server token/i,
      );
    });

    it('should throw for expired tokens, and re-issue new ones', async () => {
      jest.useFakeTimers();

      const tokenManager = ServerTokenManager.fromConfig(configWithSecret, {
        logger,
      });

      const { token: token1 } = await tokenManager.getToken();
      await expect(tokenManager.authenticate(token1)).resolves.not.toThrow();

      // Right before the reissue timeout, it still returns the same token
      jest.advanceTimersByTime(9 * 60 * 1000);
      const { token: token1Again } = await tokenManager.getToken();
      expect(token1).toEqual(token1Again);
      await expect(tokenManager.authenticate(token1)).resolves.not.toThrow();

      // Right after the reissue timeout, the old ones are still valid but returning a new token
      jest.advanceTimersByTime(2 * 60 * 1000);
      const { token: token2 } = await tokenManager.getToken();
      expect(token1).not.toEqual(token2);
      await expect(tokenManager.authenticate(token1)).resolves.not.toThrow();
      await expect(tokenManager.authenticate(token2)).resolves.not.toThrow();

      // After expiry of the first one, it gets warnings but the newest one is still valid
      jest.advanceTimersByTime(52 * 60 * 1000);
      await expect(tokenManager.authenticate(token1)).rejects.toThrow(
        'Invalid server token; caused by JWTExpired: "exp" claim timestamp check failed',
      );
      await expect(tokenManager.authenticate(token2)).resolves.not.toThrow();
    });

    it('should work with a manually crafted JWT', async () => {
      const secret = 'a1b2c3';
      const token = await new jose.SignJWT({})
        .setProtectedHeader({ alg: 'HS256' })
        .setSubject('backstage-server')
        .setExpirationTime(Date.now() + 1000 * 60 * 60)
        .sign(jose.base64url.decode(secret));

      const tokenManager = ServerTokenManager.fromConfig(
        new ConfigReader({
          backend: { auth: { keys: [{ secret }] } },
        }),
        { logger },
      );
      await expect(tokenManager.authenticate(token)).resolves.toBeUndefined();
    });

    it('should reject tokens without exp claim', async () => {
      const secret = 'a1b2c3';
      const token = await new jose.SignJWT({})
        .setProtectedHeader({ alg: 'HS256' })
        .setSubject('backstage-server')
        .sign(jose.base64url.decode(secret));

      const tokenManager = ServerTokenManager.fromConfig(
        new ConfigReader({
          backend: { auth: { keys: [{ secret }] } },
        }),
        { logger },
      );
      await expect(tokenManager.authenticate(token)).rejects.toThrow(
        'Invalid server token; caused by AuthenticationError: Server-to-server token had no exp claim',
      );
    });
  });

  describe('fromConfig', () => {
    describe('NODE_ENV === production', () => {
      it('should throw if backend auth configuration is missing', () => {
        expect(() =>
          ServerTokenManager.fromConfig(emptyConfig, { logger }),
        ).toThrow();
      });

      it('should throw if no keys are included in the configuration', () => {
        expect(() =>
          ServerTokenManager.fromConfig(
            new ConfigReader({
              backend: { auth: { keys: [] } },
            }),
            { logger },
          ),
        ).toThrow();
      });

      it('should throw if any key is missing a secret property', () => {
        expect(() =>
          ServerTokenManager.fromConfig(
            new ConfigReader({
              backend: {
                auth: {
                  keys: [{ secret: '123' }, {}, { secret: '789' }],
                },
              },
            }),
            { logger },
          ),
        ).toThrow();
      });
    });

    describe('NODE_ENV === development', () => {
      const generateSecretSpy = jest.spyOn(jose, 'generateSecret');

      beforeEach(() => {
        (process.env as any).NODE_ENV = 'development';
      });

      afterEach(() => {
        jest.clearAllMocks();
      });

      it('should generate a key if no config is provided', async () => {
        const tokenManager = ServerTokenManager.fromConfig(emptyConfig, {
          logger,
        });
        const token = await tokenManager.getToken();
        expect(token).toBeDefined();
        expect(generateSecretSpy).toHaveBeenCalledWith('HS256');
      });

      it('should generate a key if no keys are provided in the configuration', async () => {
        const tokenManager = ServerTokenManager.fromConfig(
          new ConfigReader({
            backend: { auth: { keys: [] } },
          }),
          { logger },
        );
        const token = await tokenManager.getToken();
        expect(token).toBeDefined();
        expect(generateSecretSpy).toHaveBeenCalledWith('HS256');
      });

      it('should use provided secrets if config is provided', () => {
        ServerTokenManager.fromConfig(configWithSecret, { logger });
        expect(generateSecretSpy).not.toHaveBeenCalled();
      });
    });
  });

  describe('noop', () => {
    let noopTokenManager: TokenManager;

    beforeEach(() => {
      noopTokenManager = ServerTokenManager.noop();
    });

    it('should accept tokens it generates', async () => {
      const { token } = await noopTokenManager.getToken();

      await expect(noopTokenManager.authenticate(token)).resolves.not.toThrow();
    });

    it('should accept tokens generated by other noop token managers', async () => {
      const noopTokenManager2 = ServerTokenManager.noop();
      await expect(
        noopTokenManager.authenticate(
          (
            await noopTokenManager2.getToken()
          ).token,
        ),
      ).resolves.not.toThrow();
    });

    it('should accept signed tokens', async () => {
      const tokenManager = ServerTokenManager.fromConfig(configWithSecret, {
        logger,
      });
      await expect(
        noopTokenManager.authenticate((await tokenManager.getToken()).token),
      ).resolves.not.toThrow();
    });
  });
});
