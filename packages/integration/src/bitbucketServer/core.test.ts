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
import { BitbucketServerIntegrationConfig } from './config';
import {
  getBitbucketServerDefaultBranch,
  getBitbucketServerDownloadUrl,
  getBitbucketServerFileFetchUrl,
  getBitbucketServerRequestOptions,
} from './core';

describe('bitbucketServer core', () => {
  const worker = setupServer();
  setupRequestMockHandlers(worker);

  describe('getBitbucketServerRequestOptions', () => {
    it('inserts a token when needed', () => {
      const withToken: BitbucketServerIntegrationConfig = {
        host: '',
        apiBaseUrl: '',
        token: 'A',
      };
      const withBasicAuth: BitbucketServerIntegrationConfig = {
        host: '',
        apiBaseUrl: '',
        username: 'u',
        password: 'p',
      };
      const withBasicAuthAndTokenPrecedence: BitbucketServerIntegrationConfig =
        {
          host: '',
          apiBaseUrl: '',
          token: 'A',
          username: 'u',
          password: 'p',
        };
      const withoutCredentials: BitbucketServerIntegrationConfig = {
        host: '',
        apiBaseUrl: '',
      };
      expect(
        (getBitbucketServerRequestOptions(withToken).headers as any)
          .Authorization,
      ).toEqual('Bearer A');
      expect(
        (getBitbucketServerRequestOptions(withBasicAuth).headers as any)
          .Authorization,
      ).toEqual('Basic dTpw');
      expect(
        (
          getBitbucketServerRequestOptions(withBasicAuthAndTokenPrecedence)
            .headers as any
        ).Authorization,
      ).toEqual('Bearer A');
      expect(
        (getBitbucketServerRequestOptions(withoutCredentials).headers as any)
          .Authorization,
      ).toBeUndefined();
    });
  });

  describe('getBitbucketServerFileFetchUrl', () => {
    it('rejects targets that do not look like URLs', () => {
      const config: BitbucketServerIntegrationConfig = {
        host: '',
        apiBaseUrl: '',
      };
      expect(() => getBitbucketServerFileFetchUrl('a/b', config)).toThrow(
        /Incorrect URL: a\/b/,
      );
    });

    it('happy path for Bitbucket Server', () => {
      const config: BitbucketServerIntegrationConfig = {
        host: 'bitbucket.mycompany.net',
        apiBaseUrl: 'https://bitbucket.mycompany.net/rest/api/1.0',
      };
      expect(
        getBitbucketServerFileFetchUrl(
          'https://bitbucket.mycompany.net/projects/a/repos/b/browse/path/to/c.yaml',
          config,
        ),
      ).toEqual(
        'https://bitbucket.mycompany.net/rest/api/1.0/projects/a/repos/b/raw/path/to/c.yaml?at=',
      );
    });
  });

  describe('getBitbucketServerDownloadUrl', () => {
    it('add path param if a path is specified for Bitbucket Server', async () => {
      const defaultBranchResponse = {
        displayId: 'main',
      };
      worker.use(
        rest.get(
          'https://api.bitbucket.mycompany.net/rest/api/1.0/projects/backstage/repos/mock/default-branch',
          (_, res, ctx) =>
            res(
              ctx.status(200),
              ctx.set('Content-Type', 'application/json'),
              ctx.json(defaultBranchResponse),
            ),
        ),
      );

      const config: BitbucketServerIntegrationConfig = {
        host: 'bitbucket.mycompany.net',
        apiBaseUrl: 'https://api.bitbucket.mycompany.net/rest/api/1.0',
      };
      const result = await getBitbucketServerDownloadUrl(
        'https://bitbucket.mycompany.net/projects/backstage/repos/mock/browse/docs',
        config,
      );
      expect(result).toEqual(
        'https://api.bitbucket.mycompany.net/rest/api/1.0/projects/backstage/repos/mock/archive?format=tgz&at=main&prefix=backstage-mock&path=docs',
      );
    });

    it('does not double encode the filepath', async () => {
      const config: BitbucketServerIntegrationConfig = {
        host: 'bitbucket.mycompany.net',
        apiBaseUrl: 'https://api.bitbucket.mycompany.net/rest/api/1.0',
      };
      const result = await getBitbucketServerDownloadUrl(
        'https://bitbucket.mycompany.net/projects/backstage/repos/mock/browse/%2Fdocs?at=some-branch',
        config,
      );
      expect(result).toEqual(
        'https://api.bitbucket.mycompany.net/rest/api/1.0/projects/backstage/repos/mock/archive?format=tgz&at=some-branch&prefix=backstage-mock&path=%2Fdocs',
      );
    });

    it('do not add path param if no path is specified for Bitbucket Server', async () => {
      const defaultBranchResponse = {
        displayId: 'main',
      };
      worker.use(
        rest.get(
          'https://api.bitbucket.mycompany.net/rest/api/1.0/projects/backstage/repos/mock/default-branch',
          (_, res, ctx) =>
            res(
              ctx.status(200),
              ctx.set('Content-Type', 'application/json'),
              ctx.json(defaultBranchResponse),
            ),
        ),
      );
      const config: BitbucketServerIntegrationConfig = {
        host: 'bitbucket.mycompany.net',
        apiBaseUrl: 'https://api.bitbucket.mycompany.net/rest/api/1.0',
      };
      const result = await getBitbucketServerDownloadUrl(
        'https://bitbucket.mycompany.net/projects/backstage/repos/mock/browse',
        config,
      );

      expect(result).toEqual(
        'https://api.bitbucket.mycompany.net/rest/api/1.0/projects/backstage/repos/mock/archive?format=tgz&at=main&prefix=backstage-mock',
      );
    });

    it('get by branch for Bitbucket Server', async () => {
      const config: BitbucketServerIntegrationConfig = {
        host: 'bitbucket.mycompany.net',
        apiBaseUrl: 'https://api.bitbucket.mycompany.net/rest/api/1.0',
      };
      const result = await getBitbucketServerDownloadUrl(
        'https://bitbucket.mycompany.net/projects/backstage/repos/mock/browse/docs?at=some-branch',
        config,
      );
      expect(result).toEqual(
        'https://api.bitbucket.mycompany.net/rest/api/1.0/projects/backstage/repos/mock/archive?format=tgz&at=some-branch&prefix=backstage-mock&path=docs',
      );
    });
  });

  describe('getBitbucketServerDefaultBranch', () => {
    it('return default branch for Bitbucket Server', async () => {
      const defaultBranchResponse = {
        displayId: 'main',
      };
      worker.use(
        rest.get(
          'https://api.bitbucket.mycompany.net/rest/api/1.0/projects/backstage/repos/mock/default-branch',
          (_, res, ctx) =>
            res(
              ctx.status(200),
              ctx.set('Content-Type', 'application/json'),
              ctx.json(defaultBranchResponse),
            ),
        ),
      );
      const config: BitbucketServerIntegrationConfig = {
        host: 'bitbucket.mycompany.net',
        apiBaseUrl: 'https://api.bitbucket.mycompany.net/rest/api/1.0',
      };
      const defaultBranch = await getBitbucketServerDefaultBranch(
        'https://bitbucket.mycompany.net/projects/backstage/repos/mock/browse/README.md',
        config,
      );
      expect(defaultBranch).toEqual('main');
    });

    it('return default branch for Bitbucket Server for bitbucket version 5.11', async () => {
      const defaultBranchResponse = {
        displayId: 'main',
      };
      worker.use(
        rest.get(
          'https://api.bitbucket.mycompany.net/rest/api/1.0/projects/backstage/repos/mock/default-branch',
          (_, res, ctx) =>
            res(
              ctx.status(404),
              ctx.set('Content-Type', 'application/json'),
              ctx.json(defaultBranchResponse),
            ),
        ),
        rest.get(
          'https://api.bitbucket.mycompany.net/rest/api/1.0/projects/backstage/repos/mock/branches/default',
          (_, res, ctx) =>
            res(
              ctx.status(200),
              ctx.set('Content-Type', 'application/json'),
              ctx.json(defaultBranchResponse),
            ),
        ),
      );
      const config: BitbucketServerIntegrationConfig = {
        host: 'bitbucket.mycompany.net',
        apiBaseUrl: 'https://api.bitbucket.mycompany.net/rest/api/1.0',
      };
      const defaultBranch = await getBitbucketServerDefaultBranch(
        'https://bitbucket.mycompany.net/projects/backstage/repos/mock/browse/README.md',
        config,
      );
      expect(defaultBranch).toEqual('main');
    });
  });
});
