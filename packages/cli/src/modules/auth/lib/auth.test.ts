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

import { accessTokenNeedsRefresh, refreshAccessToken } from './auth';
import * as storage from './storage';
import * as secretStore from './secretStore';
import * as http from './http';

jest.mock('./storage');
jest.mock('./secretStore');
jest.mock('./http');

const mockStorage = storage as jest.Mocked<typeof storage>;
const mockSecretStore = secretStore as jest.Mocked<typeof secretStore>;
const mockHttp = http as jest.Mocked<typeof http>;

describe('auth', () => {
  describe('accessTokenNeedsRefresh', () => {
    it('should return true if token expires within 2 minutes', () => {
      const now = Date.now();
      const instance = {
        name: 'test',
        baseUrl: 'http://localhost:7007',
        clientId: 'test-client',
        issuedAt: now,
        accessToken: 'test-token',
        accessTokenExpiresAt: now + 60_000, // 1 minute from now
      };

      expect(accessTokenNeedsRefresh(instance)).toBe(true);
    });

    it('should return true if token has already expired', () => {
      const now = Date.now();
      const instance = {
        name: 'test',
        baseUrl: 'http://localhost:7007',
        clientId: 'test-client',
        issuedAt: now - 3600_000,
        accessToken: 'test-token',
        accessTokenExpiresAt: now - 60_000, // expired 1 minute ago
      };

      expect(accessTokenNeedsRefresh(instance)).toBe(true);
    });

    it('should return false if token is valid for more than 2 minutes', () => {
      const now = Date.now();
      const instance = {
        name: 'test',
        baseUrl: 'http://localhost:7007',
        clientId: 'test-client',
        issuedAt: now,
        accessToken: 'test-token',
        accessTokenExpiresAt: now + 5 * 60_000, // 5 minutes from now
      };

      expect(accessTokenNeedsRefresh(instance)).toBe(false);
    });

    it('should return true at exactly 2 minutes before expiration', () => {
      const now = Date.now();
      const instance = {
        name: 'test',
        baseUrl: 'http://localhost:7007',
        clientId: 'test-client',
        issuedAt: now,
        accessToken: 'test-token',
        accessTokenExpiresAt: now + 2 * 60_000, // exactly 2 minutes from now
      };

      expect(accessTokenNeedsRefresh(instance)).toBe(true);
    });
  });

  describe('refreshAccessToken', () => {
    const mockSecretStoreInstance = {
      get: jest.fn(),
      set: jest.fn(),
      delete: jest.fn(),
    };

    beforeEach(() => {
      jest.clearAllMocks();
      mockSecretStore.getSecretStore.mockResolvedValue(mockSecretStoreInstance);
    });

    it('should successfully refresh access token', async () => {
      const now = Date.now();
      const instance = {
        name: 'test',
        baseUrl: 'http://localhost:7007',
        clientId: 'test-client-id',
        issuedAt: now - 3600_000,
        accessToken: 'old-token',
        accessTokenExpiresAt: now - 60_000,
      };

      mockStorage.withMetadataLock.mockImplementation(
        async (fn: () => Promise<any>) => fn(),
      );
      mockStorage.getInstanceByName.mockResolvedValue(instance);
      mockSecretStoreInstance.get.mockImplementation(
        async (_service: string, account: string) => {
          if (account === 'clientSecret') return 'test-secret';
          if (account === 'refreshToken') return 'old-refresh-token';
          return undefined;
        },
      );

      const tokenResponse = {
        access_token: 'new-access-token',
        token_type: 'Bearer',
        expires_in: 3600,
        refresh_token: 'new-refresh-token',
      };

      mockHttp.httpJson.mockResolvedValue(tokenResponse);
      mockStorage.upsertInstance.mockResolvedValue();

      const result = await refreshAccessToken('test');

      expect(mockStorage.getInstanceByName).toHaveBeenCalledWith('test');
      expect(mockSecretStoreInstance.get).toHaveBeenCalledWith(
        'backstage-cli:instance:test',
        'clientSecret',
      );
      expect(mockSecretStoreInstance.get).toHaveBeenCalledWith(
        'backstage-cli:instance:test',
        'refreshToken',
      );
      expect(mockHttp.httpJson).toHaveBeenCalledWith(
        'http://localhost:7007/api/auth/v1/token',
        {
          method: 'POST',
          body: {
            grant_type: 'refresh_token',
            refresh_token: 'old-refresh-token',
          },
        },
      );
      expect(mockSecretStoreInstance.set).toHaveBeenCalledWith(
        'backstage-cli:instance:test',
        'refreshToken',
        'new-refresh-token',
      );
      expect(mockStorage.upsertInstance).toHaveBeenCalled();
      expect(result.accessToken).toBe('new-access-token');
      expect(result.accessTokenExpiresAt).toBeGreaterThan(now);
    });

    it('should throw error if refresh token is missing', async () => {
      const now = Date.now();
      const instance = {
        name: 'test',
        baseUrl: 'http://localhost:7007',
        clientId: 'test-client-id',
        issuedAt: now - 3600_000,
        accessToken: 'old-token',
        accessTokenExpiresAt: now - 60_000,
      };

      mockStorage.withMetadataLock.mockImplementation(
        async (fn: () => Promise<any>) => fn(),
      );
      mockStorage.getInstanceByName.mockResolvedValue(instance);
      mockSecretStoreInstance.get.mockResolvedValue(undefined);

      await expect(refreshAccessToken('test')).rejects.toThrow(
        'Access token is expired and no refresh token is available',
      );
    });

    it('should throw error if client ID or secret is missing', async () => {
      const now = Date.now();

      const testCases = [
        {
          instance: {
            name: 'test',
            baseUrl: 'http://localhost:7007',
            clientId: '',
            issuedAt: now - 3600_000,
            accessToken: 'old-token',
            accessTokenExpiresAt: now - 60_000,
          },
          getMock: async (_service: string, account: string) => {
            if (account === 'refreshToken') return 'refresh-token';
            return undefined;
          },
        },
        {
          instance: {
            name: 'test',
            baseUrl: 'http://localhost:7007',
            clientId: 'test-client-id',
            issuedAt: now - 3600_000,
            accessToken: 'old-token',
            accessTokenExpiresAt: now - 60_000,
          },
          getMock: async (_service: string, account: string) => {
            if (account === 'refreshToken') return 'refresh-token';
            return undefined;
          },
        },
      ];

      for (const { instance, getMock } of testCases) {
        mockStorage.withMetadataLock.mockImplementation(
          async (fn: () => Promise<any>) => fn(),
        );
        mockStorage.getInstanceByName.mockResolvedValue(instance);
        mockSecretStoreInstance.get.mockImplementation(getMock);

        await expect(refreshAccessToken('test')).rejects.toThrow(
          'Missing stored credentials',
        );
      }
    });

    it('should use metadata lock during refresh', async () => {
      const now = Date.now();
      const instance = {
        name: 'test',
        baseUrl: 'http://localhost:7007',
        clientId: 'test-client-id',
        issuedAt: now - 3600_000,
        accessToken: 'old-token',
        accessTokenExpiresAt: now - 60_000,
      };

      let lockAcquired = false;
      mockStorage.withMetadataLock.mockImplementation(
        async (fn: () => Promise<any>) => {
          lockAcquired = true;
          return fn();
        },
      );
      mockStorage.getInstanceByName.mockResolvedValue(instance);
      mockSecretStoreInstance.get.mockImplementation(
        async (_service: string, account: string) => {
          if (account === 'clientSecret') return 'test-secret';
          if (account === 'refreshToken') return 'refresh-token';
          return undefined;
        },
      );

      const tokenResponse = {
        access_token: 'new-access-token',
        token_type: 'Bearer',
        expires_in: 3600,
        refresh_token: 'new-refresh-token',
      };

      mockHttp.httpJson.mockResolvedValue(tokenResponse);
      mockStorage.upsertInstance.mockResolvedValue();

      await refreshAccessToken('test');

      expect(lockAcquired).toBe(true);
      expect(mockStorage.withMetadataLock).toHaveBeenCalled();
    });

    it('should handle HTTP and network errors during refresh', async () => {
      const now = Date.now();
      const instance = {
        name: 'test',
        baseUrl: 'http://localhost:7007',
        clientId: 'test-client-id',
        issuedAt: now - 3600_000,
        accessToken: 'old-token',
        accessTokenExpiresAt: now - 60_000,
      };

      const errorCases = [
        new Error('Request failed with 401 Unauthorized'),
        new Error('Network error'),
      ];

      for (const error of errorCases) {
        mockStorage.withMetadataLock.mockImplementation(
          async (fn: () => Promise<any>) => fn(),
        );
        mockStorage.getInstanceByName.mockResolvedValue(instance);
        mockSecretStoreInstance.get.mockImplementation(
          async (_service: string, account: string) => {
            if (account === 'clientSecret') return 'test-secret';
            if (account === 'refreshToken') return 'refresh-token';
            return undefined;
          },
        );

        mockHttp.httpJson.mockRejectedValue(error);

        await expect(refreshAccessToken('test')).rejects.toThrow(error.message);
      }
    });

    it('should handle malformed token response with missing fields', async () => {
      const now = Date.now();
      const instance = {
        name: 'test',
        baseUrl: 'http://localhost:7007',
        clientId: 'test-client-id',
        issuedAt: now - 3600_000,
        accessToken: 'old-token',
        accessTokenExpiresAt: now - 60_000,
      };

      mockStorage.withMetadataLock.mockImplementation(
        async (fn: () => Promise<any>) => fn(),
      );
      mockStorage.getInstanceByName.mockResolvedValue(instance);
      mockSecretStoreInstance.get.mockImplementation(
        async (_service: string, account: string) => {
          if (account === 'clientSecret') return 'test-secret';
          if (account === 'refreshToken') return 'refresh-token';
          return undefined;
        },
      );

      // Missing required fields - code will proceed but result will have undefined values
      mockHttp.httpJson.mockResolvedValue({
        token_type: 'Bearer',
      } as any);

      const result = await refreshAccessToken('test');
      // The function doesn't validate the response, so it will create instance with undefined values
      expect(result.accessToken).toBeUndefined();
      expect(result.accessTokenExpiresAt).toBeNaN();
    });
  });
});
