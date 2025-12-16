/*
 * Copyright 2020 The Backstage Authors
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

import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { registerMswTestHooks } from '../helpers';
import { BitbucketCloudIntegrationConfig } from './config';
import {
  getBitbucketCloudDefaultBranch,
  getBitbucketCloudDownloadUrl,
  getBitbucketCloudFileFetchUrl,
  getBitbucketCloudRequestOptions,
} from './core';

// Mock constants
const BITBUCKET_CLOUD_HOST = 'bitbucket.org';
const BITBUCKET_CLOUD_API_BASE_URL = 'https://api.bitbucket.org/2.0';
const BITBUCKET_CLOUD_OAUTH_TOKEN_URL =
  'https://bitbucket.org/site/oauth2/access_token';

describe('bitbucketCloud core', () => {
  const worker = setupServer();
  registerMswTestHooks(worker);

  describe('getBitbucketCloudRequestOptions', () => {
    it('insert basic auth when needed', async () => {
      const withUsernameAndToken: BitbucketCloudIntegrationConfig = {
        host: BITBUCKET_CLOUD_HOST,
        apiBaseUrl: BITBUCKET_CLOUD_API_BASE_URL,
        username: 'some-user@domain.com',
        token: 'my-token',
      };
      // TODO: appPassword can be removed once fully
      // deprecated by BitBucket on 9th June 2026.
      const withUsernameAndPassword: BitbucketCloudIntegrationConfig = {
        host: BITBUCKET_CLOUD_HOST,
        apiBaseUrl: BITBUCKET_CLOUD_API_BASE_URL,
        username: 'some-user',
        appPassword: 'my-secret',
      };
      const withoutUsername: BitbucketCloudIntegrationConfig = {
        host: BITBUCKET_CLOUD_HOST,
        apiBaseUrl: BITBUCKET_CLOUD_API_BASE_URL,
      };
      expect(
        (await getBitbucketCloudRequestOptions(withUsernameAndToken)).headers
          .Authorization,
      ).toEqual('Basic c29tZS11c2VyQGRvbWFpbi5jb206bXktdG9rZW4=');
      expect(
        (await getBitbucketCloudRequestOptions(withUsernameAndPassword)).headers
          .Authorization,
      ).toEqual('Basic c29tZS11c2VyOm15LXNlY3JldA==');
      expect(
        (await getBitbucketCloudRequestOptions(withoutUsername)).headers
          .Authorization,
      ).toBeUndefined();
    });

    it('handles OAuth token fetch errors', async () => {
      // Test error handling
      worker.use(
        rest.post(BITBUCKET_CLOUD_OAUTH_TOKEN_URL, (_, res, ctx) =>
          res(ctx.status(401), ctx.json({ error: 'invalid_client' })),
        ),
      );

      const withOAuth: BitbucketCloudIntegrationConfig = {
        host: BITBUCKET_CLOUD_HOST,
        apiBaseUrl: BITBUCKET_CLOUD_API_BASE_URL,
        clientId: 'test-client-id',
        clientSecret: 'test-client-secret',
      };

      await expect(getBitbucketCloudRequestOptions(withOAuth)).rejects.toThrow(
        /Failed to fetch OAuth token/,
      );
    });

    it('uses OAuth Bearer token and caches it', async () => {
      // Test OAuth + caching
      let callCount = 0;
      worker.use(
        rest.post(BITBUCKET_CLOUD_OAUTH_TOKEN_URL, (_, res, ctx) => {
          callCount++;
          return res(
            ctx.status(200),
            ctx.json({
              access_token: 'test-oauth-token',
              expires_in: 3600,
            }),
          );
        }),
      );

      const withOAuth: BitbucketCloudIntegrationConfig = {
        host: BITBUCKET_CLOUD_HOST,
        apiBaseUrl: BITBUCKET_CLOUD_API_BASE_URL,
        clientId: 'test-client-id',
        clientSecret: 'test-client-secret',
      };

      // First call should fetch token
      const result1 = await getBitbucketCloudRequestOptions(withOAuth);
      expect(result1.headers.Authorization).toEqual('Bearer test-oauth-token');
      expect(callCount).toBe(1);

      // Second call should use cached token (proves caching works)
      const result2 = await getBitbucketCloudRequestOptions(withOAuth);
      expect(result2.headers.Authorization).toEqual('Bearer test-oauth-token');
      expect(callCount).toBe(1); // Still 1, proving cache was used
    });
  });

  describe('getBitbucketCloudFileFetchUrl', () => {
    it('rejects targets that do not look like URLs', () => {
      const config: BitbucketCloudIntegrationConfig = {
        host: '',
        apiBaseUrl: '',
      };
      expect(() => getBitbucketCloudFileFetchUrl('a/b', config)).toThrow(
        /Incorrect URL: a\/b/,
      );
    });

    it('happy path for Bitbucket Cloud', () => {
      const config: BitbucketCloudIntegrationConfig = {
        host: 'bitbucket.org',
        apiBaseUrl: 'https://api.bitbucket.org/2.0',
      };
      expect(
        getBitbucketCloudFileFetchUrl(
          'https://bitbucket.org/org-name/repo-name/src/master/templates/my-template.yaml',
          config,
        ),
      ).toEqual(
        'https://api.bitbucket.org/2.0/repositories/org-name/repo-name/src/master/templates/my-template.yaml',
      );
    });
  });

  describe('getBitbucketCloudDownloadUrl', () => {
    it('do not add path param for Bitbucket Cloud', async () => {
      const config: BitbucketCloudIntegrationConfig = {
        host: 'bitbucket.org',
        apiBaseUrl: 'https://api.bitbucket.org/2.0',
      };
      const result = await getBitbucketCloudDownloadUrl(
        'https://bitbucket.org/backstage/mock/src/master',
        config,
      );
      expect(result).toEqual(
        'https://bitbucket.org/backstage/mock/get/master.tar.gz',
      );
    });
  });

  describe('getBitbucketCloudDefaultBranch', () => {
    it('return default branch for Bitbucket Cloud', async () => {
      const repoInfoResponse = {
        mainbranch: {
          name: 'main',
        },
      };
      worker.use(
        rest.get(
          'https://api.bitbucket.org/2.0/repositories/backstage/mock',
          (_, res, ctx) =>
            res(
              ctx.status(200),
              ctx.set('Content-Type', 'application/json'),
              ctx.json(repoInfoResponse),
            ),
        ),
      );
      const config: BitbucketCloudIntegrationConfig = {
        host: 'bitbucket.org',
        apiBaseUrl: 'https://api.bitbucket.org/2.0',
      };
      const defaultBranch = await getBitbucketCloudDefaultBranch(
        'https://bitbucket.org/backstage/mock/src/main',
        config,
      );
      expect(defaultBranch).toEqual('main');
    });
  });
});
