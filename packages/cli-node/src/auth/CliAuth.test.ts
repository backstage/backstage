/*
 * Copyright 2025 The Backstage Authors
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

import { CliAuth } from './CliAuth';
import * as storage from './storage';
import * as secretStoreModule from './secretStore';
import * as httpModule from './httpJson';

jest.mock('./storage');
jest.mock('./secretStore');
jest.mock('./httpJson');

const mockStorage = storage as jest.Mocked<typeof storage>;
const mockSecretStoreModule = secretStoreModule as jest.Mocked<
  typeof secretStoreModule
>;
const mockHttp = httpModule as jest.Mocked<typeof httpModule>;

describe('CliAuth', () => {
  const now = Date.now();
  const mockInstance = {
    name: 'production',
    baseUrl: 'https://backstage.example.com',
    clientId: 'prod-client',
    issuedAt: now,
    accessTokenExpiresAt: now + 3600_000,
  };

  const mockSecretStore = {
    get: jest.fn(),
    set: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockStorage.getSelectedInstance.mockResolvedValue(mockInstance);
    mockSecretStoreModule.getSecretStore.mockResolvedValue(mockSecretStore);
    mockStorage.accessTokenNeedsRefresh.mockReturnValue(false);
    mockSecretStore.get.mockResolvedValue('test-access-token');
  });

  describe('create', () => {
    it('resolves the currently selected instance by default', async () => {
      const auth = await CliAuth.create();

      expect(mockStorage.getSelectedInstance).toHaveBeenCalledWith(undefined);
      expect(auth.getInstanceName()).toBe('production');
      expect(auth.getBaseUrl()).toBe('https://backstage.example.com');
    });

    it('resolves a named instance when specified', async () => {
      await CliAuth.create({ instanceName: 'staging' });

      expect(mockStorage.getSelectedInstance).toHaveBeenCalledWith('staging');
    });

    it('throws when no instance can be found', async () => {
      mockStorage.getSelectedInstance.mockRejectedValue(
        new Error(
          'No instances found. Run "auth login" to authenticate first.',
        ),
      );

      await expect(CliAuth.create()).rejects.toThrow(
        'No instances found. Run "auth login" to authenticate first.',
      );
    });
  });

  describe('getAccessToken', () => {
    it('returns a stored access token when it is still valid', async () => {
      const auth = await CliAuth.create();
      const token = await auth.getAccessToken();

      expect(token).toBe('test-access-token');
      expect(mockSecretStore.get).toHaveBeenCalledWith(
        'backstage-cli:auth-instance:production',
        'accessToken',
      );
      expect(mockHttp.httpJson).not.toHaveBeenCalled();
    });

    it('throws when no access token is stored', async () => {
      mockSecretStore.get.mockResolvedValue(undefined);

      const auth = await CliAuth.create();

      await expect(auth.getAccessToken()).rejects.toThrow(
        'No access token found. Run "auth login" to authenticate.',
      );
    });

    it('refreshes the token when it is about to expire', async () => {
      mockStorage.accessTokenNeedsRefresh.mockReturnValue(true);
      mockSecretStore.get.mockImplementation(
        async (_service: string, account: string) => {
          if (account === 'refreshToken') return 'old-refresh-token';
          if (account === 'accessToken') return 'new-access-token';
          return undefined;
        },
      );

      mockHttp.httpJson.mockResolvedValue({
        access_token: 'new-access-token',
        token_type: 'Bearer',
        expires_in: 3600,
        refresh_token: 'new-refresh-token',
      });

      const auth = await CliAuth.create();
      const token = await auth.getAccessToken();

      expect(token).toBe('new-access-token');
      expect(mockHttp.httpJson).toHaveBeenCalledWith(
        'https://backstage.example.com/api/auth/v1/token',
        expect.objectContaining({
          method: 'POST',
          body: {
            grant_type: 'refresh_token',
            refresh_token: 'old-refresh-token',
          },
        }),
      );
      expect(mockSecretStore.set).toHaveBeenCalledWith(
        'backstage-cli:auth-instance:production',
        'accessToken',
        'new-access-token',
      );
      expect(mockSecretStore.set).toHaveBeenCalledWith(
        'backstage-cli:auth-instance:production',
        'refreshToken',
        'new-refresh-token',
      );
      expect(mockStorage.updateInstance).toHaveBeenCalledWith('production', {
        issuedAt: expect.any(Number),
        accessTokenExpiresAt: expect.any(Number),
      });
    });

    it('throws when refresh token is missing and access token has expired', async () => {
      mockStorage.accessTokenNeedsRefresh.mockReturnValue(true);
      mockSecretStore.get.mockResolvedValue(undefined);

      const auth = await CliAuth.create();

      await expect(auth.getAccessToken()).rejects.toThrow(
        'Access token is expired and no refresh token is available',
      );
    });

    it('throws when the token response is malformed', async () => {
      mockStorage.accessTokenNeedsRefresh.mockReturnValue(true);
      mockSecretStore.get.mockImplementation(
        async (_service: string, account: string) => {
          if (account === 'refreshToken') return 'refresh-token';
          return undefined;
        },
      );

      mockHttp.httpJson.mockResolvedValue({
        token_type: 'Bearer',
        expires_in: 3600,
      });

      const auth = await CliAuth.create();

      await expect(auth.getAccessToken()).rejects.toThrow(
        'Invalid token response',
      );
    });
  });

  describe('getMetadata / setMetadata', () => {
    it('returns a metadata value from the instance', async () => {
      mockStorage.getInstanceMetadata.mockResolvedValue([
        'catalog',
        'scaffolder',
      ]);

      const auth = await CliAuth.create();
      const sources = await auth.getMetadata('pluginSources');

      expect(sources).toEqual(['catalog', 'scaffolder']);
      expect(mockStorage.getInstanceMetadata).toHaveBeenCalledWith(
        'production',
        'pluginSources',
      );
    });

    it('returns undefined for missing metadata keys', async () => {
      mockStorage.getInstanceMetadata.mockResolvedValue(undefined);

      const auth = await CliAuth.create();
      const value = await auth.getMetadata('nonexistent');

      expect(value).toBeUndefined();
    });

    it('writes a metadata value to the instance store', async () => {
      mockStorage.updateInstanceMetadata.mockResolvedValue(undefined);

      const auth = await CliAuth.create();
      await auth.setMetadata('pluginSources', ['catalog']);

      expect(mockStorage.updateInstanceMetadata).toHaveBeenCalledWith(
        'production',
        'pluginSources',
        ['catalog'],
      );
    });
  });
});
