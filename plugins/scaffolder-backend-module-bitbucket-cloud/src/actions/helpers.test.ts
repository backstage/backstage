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

import {
  getBitbucketClient,
  getAuthorizationHeader,
  getGitAuth,
} from './helpers';
import { getBitbucketCloudOAuthToken } from '@backstage/integration';

jest.mock('@backstage/integration', () => ({
  getBitbucketCloudOAuthToken: jest.fn(),
}));

describe('helpers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getBitbucketClient', () => {
    it('should create client with OAuth token', async () => {
      (getBitbucketCloudOAuthToken as jest.Mock).mockResolvedValue(
        'oauth-token-123',
      );

      const client = await getBitbucketClient({
        clientId: 'client-id',
        clientSecret: 'client-secret',
      });

      expect(client).toBeDefined();
      expect(getBitbucketCloudOAuthToken).toHaveBeenCalledWith(
        'client-id',
        'client-secret',
      );
    });

    it('should create client with standalone token', async () => {
      const client = await getBitbucketClient({
        token: 'standalone-token',
      });

      expect(client).toBeDefined();
    });

    it('should create client with username and API token', async () => {
      const client = await getBitbucketClient({
        username: 'test-user',
        token: 'api-token',
      });

      expect(client).toBeDefined();
    });

    it('should create client with username and appPassword', async () => {
      const client = await getBitbucketClient({
        username: 'test-user',
        appPassword: 'app-password',
      });

      expect(client).toBeDefined();
    });

    it('should throw error when no credentials provided', async () => {
      await expect(getBitbucketClient({})).rejects.toThrow(
        /Authorization has not been provided for Bitbucket Cloud/,
      );
    });
  });

  describe('getAuthorizationHeader', () => {
    it('should return Bearer token for OAuth credentials', async () => {
      (getBitbucketCloudOAuthToken as jest.Mock).mockResolvedValue(
        'oauth-token-123',
      );

      const result = await getAuthorizationHeader({
        clientId: 'client-id',
        clientSecret: 'client-secret',
      });

      expect(result).toBe('Bearer oauth-token-123');
      expect(getBitbucketCloudOAuthToken).toHaveBeenCalledWith(
        'client-id',
        'client-secret',
      );
    });

    it('should return Basic auth for username and token', async () => {
      const result = await getAuthorizationHeader({
        username: 'test-user',
        token: 'api-token',
      });

      const expectedAuth = Buffer.from('test-user:api-token', 'utf8').toString(
        'base64',
      );
      expect(result).toBe(`Basic ${expectedAuth}`);
    });

    it('should return Basic auth for username and appPassword', async () => {
      const result = await getAuthorizationHeader({
        username: 'test-user',
        appPassword: 'app-password',
      });

      const expectedAuth = Buffer.from(
        'test-user:app-password',
        'utf8',
      ).toString('base64');
      expect(result).toBe(`Basic ${expectedAuth}`);
    });

    it('should prefer token over appPassword when both are provided', async () => {
      const result = await getAuthorizationHeader({
        username: 'test-user',
        token: 'api-token',
        appPassword: 'app-password',
      });

      const expectedAuth = Buffer.from('test-user:api-token', 'utf8').toString(
        'base64',
      );
      expect(result).toBe(`Basic ${expectedAuth}`);
    });

    it('should return Bearer token for standalone token', async () => {
      const result = await getAuthorizationHeader({
        token: 'standalone-token',
      });

      expect(result).toBe('Bearer standalone-token');
    });

    it('should throw error when no credentials provided', async () => {
      await expect(getAuthorizationHeader({})).rejects.toThrow(
        /Authorization has not been provided for Bitbucket Cloud/,
      );
    });
  });

  describe('getGitAuth', () => {
    it('should return x-token-auth for OAuth credentials', async () => {
      (getBitbucketCloudOAuthToken as jest.Mock).mockResolvedValue(
        'oauth-token-123',
      );

      const result = await getGitAuth({
        clientId: 'client-id',
        clientSecret: 'client-secret',
      });

      expect(result).toEqual({
        username: 'x-token-auth',
        password: 'oauth-token-123',
      });
      expect(getBitbucketCloudOAuthToken).toHaveBeenCalledWith(
        'client-id',
        'client-secret',
      );
    });

    it('should return x-token-auth for standalone token', async () => {
      const result = await getGitAuth({
        token: 'standalone-token',
      });

      expect(result).toEqual({
        username: 'x-token-auth',
        password: 'standalone-token',
      });
    });

    it('should return x-bitbucket-api-token-auth for username + API token', async () => {
      const result = await getGitAuth({
        username: 'test-user',
        token: 'api-token',
      });

      expect(result).toEqual({
        username: 'x-bitbucket-api-token-auth',
        password: 'api-token',
      });
    });

    it('should return username and appPassword for username + appPassword', async () => {
      const result = await getGitAuth({
        username: 'test-user',
        appPassword: 'app-password',
      });

      expect(result).toEqual({
        username: 'test-user',
        password: 'app-password',
      });
    });

    it('should prefer token over appPassword when both are provided', async () => {
      const result = await getGitAuth({
        username: 'test-user',
        token: 'api-token',
        appPassword: 'app-password',
      });

      expect(result).toEqual({
        username: 'x-bitbucket-api-token-auth',
        password: 'api-token',
      });
    });

    it('should throw error when no credentials provided', async () => {
      await expect(getGitAuth({})).rejects.toThrow(
        /Authorization has not been provided for Bitbucket Cloud/,
      );
    });

    it('should throw error when only username is provided', async () => {
      await expect(
        getGitAuth({
          username: 'test-user',
        }),
      ).rejects.toThrow(
        /Authorization has not been provided for Bitbucket Cloud/,
      );
    });
  });
});
