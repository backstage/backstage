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
  describe('getServerToken', () => {
    it('should always return a token', async () => {
      const tokenManager = new ServerTokenManager(configWithSecret);
      expect((await tokenManager.getServerToken()).token).toBeDefined();

      const emptyTokenManager = new ServerTokenManager(emptyConfig);
      expect((await emptyTokenManager.getServerToken()).token).toBeDefined();
    });
  });

  describe('isServerToken', () => {
    it('should return true if token is valid', async () => {
      const tokenManager = new ServerTokenManager(configWithSecret);
      const { token } = await tokenManager.getServerToken();
      const isServerToken = await tokenManager.isServerToken(token);
      expect(isServerToken).toBe(true);
    });

    it('should return false if token is invalid', async () => {
      const tokenManager = new ServerTokenManager(configWithSecret);
      const isServerToken = await tokenManager.isServerToken('random-string');
      expect(isServerToken).toBe(false);
    });
  });
});
