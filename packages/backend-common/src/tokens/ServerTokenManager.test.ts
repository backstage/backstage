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
import { ServerTokenManager } from './ServerTokenManager';

const emptyConfig = new ConfigReader({});
const configWithSecret = new ConfigReader({
  backend: { auth: { keys: [{ secret: 'a-secret-key' }] } },
});

describe('ServerTokenManager', () => {
  it('should throw if secret in config does not exist', () => {
    expect(() => ServerTokenManager.fromConfig(emptyConfig)).toThrowError();
  });

  describe('getToken', () => {
    it('should return a token if secret in config exists', async () => {
      const tokenManager = ServerTokenManager.fromConfig(configWithSecret);
      expect((await tokenManager.getToken()).token).toBeDefined();
    });

    it('should return an empty string if using a noop TokenManager', async () => {
      const tokenManager = ServerTokenManager.noop();
      expect((await tokenManager.getToken()).token).toBe('');
    });
  });

  describe('validateToken', () => {
    it('should not throw if token is valid', async () => {
      const tokenManager = ServerTokenManager.fromConfig(configWithSecret);
      const { token } = await tokenManager.getToken();
      expect(() => tokenManager.validateToken(token)).not.toThrow();
    });

    it('should throw if token is invalid', () => {
      const tokenManager = ServerTokenManager.fromConfig(configWithSecret);
      expect(() => tokenManager.validateToken('random-string')).toThrowError(
        /invalid server token/i,
      );
    });

    it('should validate server tokens created by a different instance using the same secret', async () => {
      const tokenManager1 = ServerTokenManager.fromConfig(configWithSecret);
      const tokenManager2 = ServerTokenManager.fromConfig(configWithSecret);

      const { token } = await tokenManager1.getToken();

      expect(() => tokenManager2.validateToken(token)).not.toThrow();
    });

    it('should validate server tokens created using any of the secrets', async () => {
      const tokenManager1 = ServerTokenManager.fromConfig(
        new ConfigReader({
          backend: { auth: { keys: [{ secret: 'a1b2c3' }] } },
        }),
      );
      const tokenManager2 = ServerTokenManager.fromConfig(
        new ConfigReader({
          backend: { auth: { keys: [{ secret: 'd4e5f6' }] } },
        }),
      );
      const tokenManager3 = ServerTokenManager.fromConfig(
        new ConfigReader({
          backend: {
            auth: { keys: [{ secret: 'a1b2c3' }, { secret: 'd4e5f6' }] },
          },
        }),
      );

      const { token: token1 } = await tokenManager1.getToken();
      expect(() => tokenManager3.validateToken(token1)).not.toThrow();

      const { token: token2 } = await tokenManager2.getToken();
      expect(() => tokenManager3.validateToken(token2)).not.toThrow();
    });

    it('should throw for server tokens created using a different secret', async () => {
      const tokenManager1 = ServerTokenManager.fromConfig(
        new ConfigReader({
          backend: { auth: { keys: [{ secret: 'a1b2c3' }] } },
        }),
      );
      const tokenManager2 = ServerTokenManager.fromConfig(
        new ConfigReader({
          backend: { auth: { keys: [{ secret: 'd4e5f6' }] } },
        }),
      );

      const { token } = await tokenManager1.getToken();

      expect(() => tokenManager2.validateToken(token)).toThrowError(
        /invalid server token/i,
      );
    });
  });

  describe('ServerTokenManager.noop', () => {
    let noopTokenManager: ServerTokenManager;

    beforeEach(() => {
      noopTokenManager = ServerTokenManager.noop();
    });

    it('should accept tokens it generates', async () => {
      const { token } = await noopTokenManager.getToken();

      expect(() => noopTokenManager.validateToken(token)).not.toThrow();
    });

    it('should accept arbitrary strings', async () => {
      expect(() =>
        noopTokenManager.validateToken('random-string'),
      ).not.toThrow();
    });

    it('should accept empty strings', async () => {
      expect(() => noopTokenManager.validateToken('')).not.toThrow();
    });
  });
});
