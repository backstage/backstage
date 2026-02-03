/*
 * Copyright 2022 The Backstage Authors
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
import { GoogleServiceAccountStrategy } from './GoogleServiceAccountStrategy';

// Mock the @google-cloud/container module
const mockGetAccessToken = jest.fn();

jest.mock('@google-cloud/container', () => {
  const mockClusterManagerClient = jest.fn().mockImplementation(() => ({
    auth: {
      getAccessToken: mockGetAccessToken,
    },
  }));

  return {
    v1: {
      ClusterManagerClient: mockClusterManagerClient,
    },
  };
});

// Get reference to the mocked constructor for use in tests
const {
  v1: { ClusterManagerClient: MockedClusterManagerClient },
} = jest.mocked(require('@google-cloud/container'));

describe('GoogleServiceAccountStrategy', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should read credentials from config when provided', () => {
      const config = new ConfigReader({
        kubernetes: {
          googleServiceAccountCredentials: '{"type": "service_account"}',
        },
      });

      const strategy = new GoogleServiceAccountStrategy({ config });
      expect(strategy).toBeDefined();
    });

    it('should work without credentials in config', () => {
      const config = new ConfigReader({
        kubernetes: {},
      });

      const strategy = new GoogleServiceAccountStrategy({ config });
      expect(strategy).toBeDefined();
    });

    it('should work with empty config', () => {
      const config = new ConfigReader({});

      const strategy = new GoogleServiceAccountStrategy({ config });
      expect(strategy).toBeDefined();
    });
  });

  describe('#getCredential', () => {
    it('should use credentials from config when provided', async () => {
      const serviceAccountKey = {
        type: 'service_account',
        project_id: 'test-project',
        private_key_id: 'key-id',
        private_key:
          '-----BEGIN PRIVATE KEY-----\ntest-key\n-----END PRIVATE KEY-----\n',
        client_email: 'test@test-project.iam.gserviceaccount.com',
        client_id: '123456789',
        auth_uri: 'https://accounts.google.com/o/oauth2/auth',
        token_uri: 'https://oauth2.googleapis.com/token',
      };

      const config = new ConfigReader({
        kubernetes: {
          googleServiceAccountCredentials: JSON.stringify(serviceAccountKey),
        },
      });

      mockGetAccessToken.mockResolvedValue('test-access-token');

      const strategy = new GoogleServiceAccountStrategy({ config });
      const credential = await strategy.getCredential();

      expect(MockedClusterManagerClient).toHaveBeenCalledWith({
        credentials: serviceAccountKey,
      });
      expect(mockGetAccessToken).toHaveBeenCalled();
      expect(credential).toEqual({
        type: 'bearer token',
        token: 'test-access-token',
      });
    });

    it('should fall back to default credentials when no config provided', async () => {
      const config = new ConfigReader({
        kubernetes: {},
      });

      mockGetAccessToken.mockResolvedValue('default-access-token');

      const strategy = new GoogleServiceAccountStrategy({ config });
      const credential = await strategy.getCredential();

      expect(MockedClusterManagerClient).toHaveBeenCalledWith();
      expect(mockGetAccessToken).toHaveBeenCalled();
      expect(credential).toEqual({
        type: 'bearer token',
        token: 'default-access-token',
      });
    });

    it('should throw error when JSON parsing fails', async () => {
      const config = new ConfigReader({
        kubernetes: {
          googleServiceAccountCredentials: 'invalid-json',
        },
      });

      const strategy = new GoogleServiceAccountStrategy({ config });

      await expect(strategy.getCredential()).rejects.toThrow(
        'Failed to parse Google Service Account credentials from config',
      );

      expect(MockedClusterManagerClient).not.toHaveBeenCalled();
      expect(mockGetAccessToken).not.toHaveBeenCalled();
    });

    it('should throw error when access token is null', async () => {
      const config = new ConfigReader({
        kubernetes: {},
      });

      mockGetAccessToken.mockResolvedValue(null);

      const strategy = new GoogleServiceAccountStrategy({ config });

      await expect(strategy.getCredential()).rejects.toThrow(
        'Unable to obtain access token for Google Cloud authentication',
      );

      expect(MockedClusterManagerClient).toHaveBeenCalledWith();
      expect(mockGetAccessToken).toHaveBeenCalled();
    });

    it('should throw error when access token is undefined', async () => {
      const config = new ConfigReader({
        kubernetes: {},
      });

      mockGetAccessToken.mockResolvedValue(undefined);

      const strategy = new GoogleServiceAccountStrategy({ config });

      await expect(strategy.getCredential()).rejects.toThrow(
        'Unable to obtain access token for Google Cloud authentication',
      );

      expect(MockedClusterManagerClient).toHaveBeenCalledWith();
      expect(mockGetAccessToken).toHaveBeenCalled();
    });

    it('should handle empty string access token', async () => {
      const config = new ConfigReader({
        kubernetes: {},
      });

      mockGetAccessToken.mockResolvedValue('');

      const strategy = new GoogleServiceAccountStrategy({ config });

      await expect(strategy.getCredential()).rejects.toThrow(
        'Unable to obtain access token for Google Cloud authentication',
      );

      expect(MockedClusterManagerClient).toHaveBeenCalledWith();
      expect(mockGetAccessToken).toHaveBeenCalled();
    });

    it('should handle malformed JSON with specific error message', async () => {
      const config = new ConfigReader({
        kubernetes: {
          googleServiceAccountCredentials: '{"invalid": json}',
        },
      });

      const strategy = new GoogleServiceAccountStrategy({ config });

      await expect(strategy.getCredential()).rejects.toThrow(
        /Failed to parse Google Service Account credentials from config: Unexpected token/,
      );
    });

    it('should handle client creation errors', async () => {
      const serviceAccountKey = {
        type: 'service_account',
        project_id: 'test-project',
      };

      const config = new ConfigReader({
        kubernetes: {
          googleServiceAccountCredentials: JSON.stringify(serviceAccountKey),
        },
      });

      MockedClusterManagerClient.mockImplementationOnce(() => {
        throw new Error('Client creation failed');
      });

      const strategy = new GoogleServiceAccountStrategy({ config });

      await expect(strategy.getCredential()).rejects.toThrow(
        'Client creation failed',
      );
    });

    it('should handle getAccessToken errors', async () => {
      const config = new ConfigReader({
        kubernetes: {},
      });

      mockGetAccessToken.mockRejectedValue(new Error('Token fetch failed'));

      const strategy = new GoogleServiceAccountStrategy({ config });

      await expect(strategy.getCredential()).rejects.toThrow(
        'Token fetch failed',
      );

      expect(MockedClusterManagerClient).toHaveBeenCalledWith();
      expect(mockGetAccessToken).toHaveBeenCalled();
    });
  });

  describe('#validateCluster', () => {
    it('should return empty array', () => {
      const config = new ConfigReader({});
      const strategy = new GoogleServiceAccountStrategy({ config });

      const result = strategy.validateCluster();

      expect(result).toEqual([]);
    });
  });

  describe('#presentAuthMetadata', () => {
    it('should return empty object', () => {
      const config = new ConfigReader({});
      const strategy = new GoogleServiceAccountStrategy({ config });

      const result = strategy.presentAuthMetadata({ test: 'metadata' });

      expect(result).toEqual({});
    });
  });
});
