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
import { PluginEndpointDiscovery } from '..';
import { IdentityClient } from '../identity';
import { AuthIdentityTokenManager } from './AuthIdentityTokenManager';

const discovery: PluginEndpointDiscovery = {
  async getBaseUrl() {
    return 'url';
  },
  async getExternalBaseUrl() {
    return 'url';
  },
};

beforeAll(() => {
  jest
    .spyOn(IdentityClient.prototype, 'authenticate')
    .mockImplementation(async (_token?: string) => {
      throw new Error('No');
    });
});

describe('AuthIdentityTokenManager', () => {
  it('should validate a valid server token', async () => {
    const tokenManager = new AuthIdentityTokenManager(
      discovery,
      'a-secret-key',
    );
    const { token } = await tokenManager.getServerToken();
    await expect(tokenManager.validateToken(token)).resolves.toBeUndefined();
  });

  it('should reject an invalid server token', async () => {
    const tokenManager = new AuthIdentityTokenManager(
      discovery,
      'a-secret-key',
    );
    const differentTokenManager = new AuthIdentityTokenManager(
      discovery,
      'a-different-key',
    );
    const { token } = await tokenManager.getServerToken();
    await expect(differentTokenManager.validateToken(token)).rejects.toThrow(
      'Invalid token',
    );
  });
});
