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
import { BitbucketServerIntegrationConfig } from './config';
import {
  getBitbucketServerDefaultBranch,
  getBitbucketServerDownloadUrl,
  getBitbucketServerFileFetchUrl,
  getBitbucketServerRequestOptions,
} from './core';

describe('bitbucketServer core', () => {
  const worker = setupServer();
  registerMswTestHooks(worker);

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

    it('prefers per-request token over config token', () => {
      const config: BitbucketServerIntegrationConfig = {
        host: '',
        apiBaseUrl: '',
        token: 'config-token',
      };
      expect(
        getBitbucketServerRequestOptions(config, 'request-token').headers
          .Authorization,
      ).toEqual('Bearer request-token');
    });

    it('prefers per-request token over basic auth', () => {
      const config: BitbucketServerIntegrationConfig = {
        host: '',
        apiBaseUrl: '',
        username: 'u',
        password: 'p',
      };
      expect(
        getBitbucketServerRequestOptions(config, 'request-token').headers
          .Authorization,
      ).toEqual('Bearer request-token');
    });

    it('falls back to config token when no per-request token is provided', () => {
      const config: BitbucketServerIntegrationConfig = {
        host: '',
        apiBaseUrl: '',
        token: 'config-token',
      };
      expect(
        getBitbucketServerRequestOptions(config).headers.Authorization,
      ).toEqual('Bearer config-token');
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

    it('forwards per-request token to the default branch API call', async () => {
      let authHeader: string | null = null;
      worker.use(
        rest.get(
          'https://api.bitbucket.mycompany.net/rest/api/1.0/projects/backstage/repos/mock/default-branch',
          (req, res, ctx) => {
            authHeader = req.headers.get('Authorization');
            return res(ctx.status(200), ctx.json({ displayId: 'main' }));
          },
        ),
      );
      const config: BitbucketServerIntegrationConfig = {
        host: 'bitbucket.mycompany.net',
        apiBaseUrl: 'https://api.bitbucket.mycompany.net/rest/api/1.0',
      };
      await getBitbucketServerDefaultBranch(
        'https://bitbucket.mycompany.net/projects/backstage/repos/mock/browse/README.md',
        config,
        'my-token',
      );
      expect(authHeader).toBe('Bearer my-token');
    });

    it('forwards per-request token to the fallback API call for older Bitbucket versions', async () => {
      let authHeader: string | null = null;
      worker.use(
        rest.get(
          'https://api.bitbucket.mycompany.net/rest/api/1.0/projects/backstage/repos/mock/default-branch',
          (_, res, ctx) => res(ctx.status(404)),
        ),
        rest.get(
          'https://api.bitbucket.mycompany.net/rest/api/1.0/projects/backstage/repos/mock/branches/default',
          (req, res, ctx) => {
            authHeader = req.headers.get('Authorization');
            return res(ctx.status(200), ctx.json({ displayId: 'main' }));
          },
        ),
      );
      const config: BitbucketServerIntegrationConfig = {
        host: 'bitbucket.mycompany.net',
        apiBaseUrl: 'https://api.bitbucket.mycompany.net/rest/api/1.0',
      };
      await getBitbucketServerDefaultBranch(
        'https://bitbucket.mycompany.net/projects/backstage/repos/mock/browse/README.md',
        config,
        'my-token',
      );
      expect(authHeader).toBe('Bearer my-token');
    });
  });

  describe('getBitbucketServerDownloadUrl token forwarding', () => {
    it('forwards per-request token to default branch lookup', async () => {
      let authHeader: string | null = null;
      worker.use(
        rest.get(
          'https://api.bitbucket.mycompany.net/rest/api/1.0/projects/backstage/repos/mock/default-branch',
          (req, res, ctx) => {
            authHeader = req.headers.get('Authorization');
            return res(ctx.status(200), ctx.json({ displayId: 'main' }));
          },
        ),
      );
      const config: BitbucketServerIntegrationConfig = {
        host: 'bitbucket.mycompany.net',
        apiBaseUrl: 'https://api.bitbucket.mycompany.net/rest/api/1.0',
      };
      await getBitbucketServerDownloadUrl(
        'https://bitbucket.mycompany.net/projects/backstage/repos/mock/browse/docs',
        config,
        'my-token',
      );
      expect(authHeader).toBe('Bearer my-token');
    });
  });
});
