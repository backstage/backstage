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
import { setupRequestMockHandlers } from '@backstage/test-utils';
import { BitbucketCloudIntegrationConfig } from './config';
import {
  getBitbucketCloudDefaultBranch,
  getBitbucketCloudDownloadUrl,
  getBitbucketCloudFileFetchUrl,
  getBitbucketCloudRequestOptions,
} from './core';

describe('bitbucketCloud core', () => {
  const worker = setupServer();
  setupRequestMockHandlers(worker);

  describe('getBitbucketCloudRequestOptions', () => {
    it('insert basic auth when needed', () => {
      const withUsernameAndPassword: BitbucketCloudIntegrationConfig = {
        host: 'bitbucket.org',
        apiBaseUrl: 'https://api.bitbucket.org/2.0',
        username: 'some-user',
        appPassword: 'my-secret',
      };
      const withoutUsernameAndPassword: BitbucketCloudIntegrationConfig = {
        host: 'bitbucket.org',
        apiBaseUrl: 'https://api.bitbucket.org/2.0',
      };
      expect(
        (
          getBitbucketCloudRequestOptions(withUsernameAndPassword)
            .headers as any
        ).Authorization,
      ).toEqual('Basic c29tZS11c2VyOm15LXNlY3JldA==');
      expect(
        (
          getBitbucketCloudRequestOptions(withoutUsernameAndPassword)
            .headers as any
        ).Authorization,
      ).toBeUndefined();
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
