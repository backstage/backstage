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

import { GithubIntegrationConfig } from './config';
import { getGithubFileFetchUrl, getGitHubRequestOptions } from './core';
import { GithubCredentials } from './types';

describe('github core', () => {
  const appCredentials: GithubCredentials = {
    type: 'app',
    token: 'A',
    headers: {},
  };

  const tokenCredentials: GithubCredentials = {
    type: 'token',
    token: 'A',
    headers: {},
  };

  const noCredentials: GithubCredentials = {
    type: 'token',
  };

  describe('getGitHubRequestOptions', () => {
    it('inserts a token when needed', () => {
      const withToken: GithubIntegrationConfig = {
        host: '',
        rawBaseUrl: '',
        token: 'A',
      };
      const withoutToken: GithubIntegrationConfig = {
        host: '',
        rawBaseUrl: '',
      };
      expect(
        (getGitHubRequestOptions(withToken, appCredentials).headers as any)
          .Authorization,
      ).toEqual('token A');
      expect(
        (getGitHubRequestOptions(withoutToken, noCredentials).headers as any)
          .Authorization,
      ).toBeUndefined();
    });
  });

  describe('getGithubFileFetchUrl', () => {
    it('rejects targets that do not look like URLs', () => {
      const config: GithubIntegrationConfig = { host: '', apiBaseUrl: '' };
      expect(() => getGithubFileFetchUrl('a/b', config, noCredentials)).toThrow(
        /Incorrect URL: a\/b/,
      );
    });

    it('happy path for github api', () => {
      const config: GithubIntegrationConfig = {
        host: 'github.com',
        apiBaseUrl: 'https://api.github.com',
      };
      expect(
        getGithubFileFetchUrl(
          'https://github.com/a/b/blob/branchname/path/to/c.yaml',
          config,
          appCredentials,
        ),
      ).toEqual(
        'https://api.github.com/repos/a/b/contents/path/to/c.yaml?ref=branchname',
      );
      expect(
        getGithubFileFetchUrl(
          'https://github.com/a/b/blob/branchname/path/to/c.yaml',
          config,
          tokenCredentials,
        ),
      ).toEqual(
        'https://api.github.com/repos/a/b/contents/path/to/c.yaml?ref=branchname',
      );
    });

    it('happy path for ghe api', () => {
      const config: GithubIntegrationConfig = {
        host: 'ghe.mycompany.net',
        apiBaseUrl: 'https://ghe.mycompany.net/api/v3',
      };
      expect(
        getGithubFileFetchUrl(
          'https://ghe.mycompany.net/a/b/blob/branchname/path/to/c.yaml',
          config,
          appCredentials,
        ),
      ).toEqual(
        'https://ghe.mycompany.net/api/v3/repos/a/b/contents/path/to/c.yaml?ref=branchname',
      );
      expect(
        getGithubFileFetchUrl(
          'https://ghe.mycompany.net/a/b/blob/branchname/path/to/c.yaml',
          config,
          tokenCredentials,
        ),
      ).toEqual(
        'https://ghe.mycompany.net/api/v3/repos/a/b/contents/path/to/c.yaml?ref=branchname',
      );
    });

    it('happy path for github tree', () => {
      const config: GithubIntegrationConfig = {
        host: 'github.com',
        apiBaseUrl: 'https://api.github.com',
      };
      expect(
        getGithubFileFetchUrl(
          'https://github.com/a/b/tree/branchname/path/to/c.yaml',
          config,
          tokenCredentials,
        ),
      ).toEqual(
        'https://api.github.com/repos/a/b/contents/path/to/c.yaml?ref=branchname',
      );
    });

    it('happy path for ghe tree', () => {
      const config: GithubIntegrationConfig = {
        host: 'ghe.mycompany.net',
        apiBaseUrl: 'https://ghe.mycompany.net/api/v3',
      };
      expect(
        getGithubFileFetchUrl(
          'https://ghe.mycompany.net/a/b/tree/branchname/path/to/c.yaml',
          config,
          tokenCredentials,
        ),
      ).toEqual(
        'https://ghe.mycompany.net/api/v3/repos/a/b/contents/path/to/c.yaml?ref=branchname',
      );
    });

    it('happy path for github raw', () => {
      const config: GithubIntegrationConfig = {
        host: 'github.com',
        rawBaseUrl: 'https://raw.githubusercontent.com',
      };
      expect(
        getGithubFileFetchUrl(
          'https://github.com/a/b/blob/branchname/path/to/c.yaml',
          config,
          tokenCredentials,
        ),
      ).toEqual(
        'https://raw.githubusercontent.com/a/b/branchname/path/to/c.yaml',
      );
    });

    it('happy path for ghe raw', () => {
      const config: GithubIntegrationConfig = {
        host: 'ghe.mycompany.net',
        rawBaseUrl: 'https://ghe.mycompany.net/raw',
      };
      expect(
        getGithubFileFetchUrl(
          'https://ghe.mycompany.net/a/b/blob/branchname/path/to/c.yaml',
          config,
          tokenCredentials,
        ),
      ).toEqual('https://ghe.mycompany.net/raw/a/b/branchname/path/to/c.yaml');
    });
  });
});
