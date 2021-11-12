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
import { ConfigReader } from '@backstage/core-app-api';
import { ServerTokenManager } from './ServerTokenManager';

const emptyConfig = new ConfigReader({});
const configWithSecret = new ConfigReader({
  backend: { authorization: { secret: 'a-secret-key' } },
});

describe('ServerTokenManager', () => {
  it('should throw if secret in config does not exist', () => {
    expect(() => ServerTokenManager.fromConfig(emptyConfig)).toThrowError();
  });

  describe('getServerToken', () => {
    it('should return a token if secret in config exists', async () => {
      const tokenManager = ServerTokenManager.fromConfig(configWithSecret);
      expect((await tokenManager.getServerToken()).token).toBeDefined();
    });

    it('should return an empty string if using a noop TokenManager', async () => {
      const tokenManager = ServerTokenManager.noop();
      expect((await tokenManager.getServerToken()).token).toBe('');
    });
  });

  describe('validateServerToken', () => {
    it('should return true if token is valid', async () => {
      const tokenManager = ServerTokenManager.fromConfig(configWithSecret);
      const { token } = await tokenManager.getServerToken();
      const isValidServerToken = await tokenManager.validateServerToken(token);
      expect(isValidServerToken).toBe(true);
    });

    it('should return false if token is invalid', async () => {
      const tokenManager = ServerTokenManager.fromConfig(configWithSecret);
      const isValidServerToken = await tokenManager.validateServerToken(
        'random-string',
      );
      expect(isValidServerToken).toBe(false);
    });

    it('should always return true if using noop TokenManager', async () => {
      const tokenManager = ServerTokenManager.noop();
      const { token } = await tokenManager.getServerToken();
      const isValidServerToken0 = await tokenManager.validateServerToken(token);
      const isValidServerToken1 = await tokenManager.validateServerToken(
        'random-string',
      );
      const isValidServerToken2 = await tokenManager.validateServerToken('');
      expect(isValidServerToken0).toBe(true);
      expect(isValidServerToken1).toBe(true);
      expect(isValidServerToken2).toBe(true);
    });
  });
});
