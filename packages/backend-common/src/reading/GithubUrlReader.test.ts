/*
 * Copyright 2020 Spotify AB
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
import { GitHubIntegrationConfig } from '@backstage/integration';
import { msw } from '@backstage/test-utils';
import fs from 'fs';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import path from 'path';
import {
  getApiRequestOptions,
  getApiUrl,
  getRawRequestOptions,
  getRawUrl,
  GithubUrlReader,
} from './GithubUrlReader';
import { ReadTreeResponseFactory } from './tree';

const treeResponseFactory = ReadTreeResponseFactory.create({
  config: new ConfigReader({}),
});

describe('GithubUrlReader', () => {
  describe('getApiRequestOptions', () => {
    it('sets the correct API version', () => {
      const config: GitHubIntegrationConfig = { host: '', apiBaseUrl: '' };
      expect((getApiRequestOptions(config).headers as any).Accept).toEqual(
        'application/vnd.github.v3.raw',
      );
    });

    it('inserts a token when needed', () => {
      const withToken: GitHubIntegrationConfig = {
        host: '',
        apiBaseUrl: '',
        token: 'A',
      };
      const withoutToken: GitHubIntegrationConfig = {
        host: '',
        apiBaseUrl: '',
      };
      expect(
        (getApiRequestOptions(withToken).headers as any).Authorization,
      ).toEqual('token A');
      expect(
        (getApiRequestOptions(withoutToken).headers as any).Authorization,
      ).toBeUndefined();
    });
  });

  describe('getRawRequestOptions', () => {
    it('inserts a token when needed', () => {
      const withToken: GitHubIntegrationConfig = {
        host: '',
        rawBaseUrl: '',
        token: 'A',
      };
      const withoutToken: GitHubIntegrationConfig = {
        host: '',
        rawBaseUrl: '',
      };
      expect(
        (getRawRequestOptions(withToken).headers as any).Authorization,
      ).toEqual('token A');
      expect(
        (getRawRequestOptions(withoutToken).headers as any).Authorization,
      ).toBeUndefined();
    });
  });

  describe('getApiUrl', () => {
    it('rejects targets that do not look like URLs', () => {
      const config: GitHubIntegrationConfig = { host: '', apiBaseUrl: '' };
      expect(() => getApiUrl('a/b', config)).toThrow(/Incorrect URL: a\/b/);
    });

    it('happy path for github', () => {
      const config: GitHubIntegrationConfig = {
        host: 'github.com',
        apiBaseUrl: 'https://api.github.com',
      };
      expect(
        getApiUrl(
          'https://github.com/a/b/blob/branchname/path/to/c.yaml',
          config,
        ),
      ).toEqual(
        new URL(
          'https://api.github.com/repos/a/b/contents/path/to/c.yaml?ref=branchname',
        ),
      );
      expect(
        getApiUrl(
          'https://ghe.mycompany.net/a/b/blob/branchname/path/to/c.yaml',
          config,
        ),
      ).toEqual(
        new URL(
          'https://api.github.com/repos/a/b/contents/path/to/c.yaml?ref=branchname',
        ),
      );
    });

    it('happy path for ghe', () => {
      const config: GitHubIntegrationConfig = {
        host: 'ghe.mycompany.net',
        apiBaseUrl: 'https://ghe.mycompany.net/api/v3',
      };
      expect(
        getApiUrl(
          'https://ghe.mycompany.net/a/b/blob/branchname/path/to/c.yaml',
          config,
        ),
      ).toEqual(
        new URL(
          'https://ghe.mycompany.net/api/v3/repos/a/b/contents/path/to/c.yaml?ref=branchname',
        ),
      );
    });
  });

  describe('getRawUrl', () => {
    it('rejects targets that do not look like URLs', () => {
      const config: GitHubIntegrationConfig = { host: '', apiBaseUrl: '' };
      expect(() => getRawUrl('a/b', config)).toThrow(/Incorrect URL: a\/b/);
    });

    it('happy path for github', () => {
      const config: GitHubIntegrationConfig = {
        host: 'github.com',
        rawBaseUrl: 'https://raw.githubusercontent.com',
      };
      expect(
        getRawUrl(
          'https://github.com/a/b/blob/branchname/path/to/c.yaml',
          config,
        ),
      ).toEqual(
        new URL(
          'https://raw.githubusercontent.com/a/b/branchname/path/to/c.yaml',
        ),
      );
    });

    it('happy path for ghe', () => {
      const config: GitHubIntegrationConfig = {
        host: 'ghe.mycompany.net',
        rawBaseUrl: 'https://ghe.mycompany.net/raw',
      };
      expect(
        getRawUrl(
          'https://ghe.mycompany.net/a/b/blob/branchname/path/to/c.yaml',
          config,
        ),
      ).toEqual(
        new URL('https://ghe.mycompany.net/raw/a/b/branchname/path/to/c.yaml'),
      );
    });
  });

  describe('implementation', () => {
    it('rejects unknown targets', async () => {
      const processor = new GithubUrlReader(
        {
          host: 'github.com',
          apiBaseUrl: 'https://api.github.com',
        },
        { treeResponseFactory },
      );
      await expect(
        processor.read('https://not.github.com/apa'),
      ).rejects.toThrow(
        'Incorrect URL: https://not.github.com/apa, Error: Invalid GitHub URL or file path',
      );
    });
  });

  describe('readTree', () => {
    const worker = setupServer();

    msw.setupDefaultHandlers(worker);

    const repoBuffer = fs.readFileSync(
      path.resolve('src', 'reading', '__fixtures__', 'repo.tar.gz'),
    );

    beforeEach(() => {
      worker.use(
        rest.get(
          'https://github.com/backstage/mock/archive/repo.tar.gz',
          (_, res, ctx) =>
            res(
              ctx.status(200),
              ctx.set('Content-Type', 'application/x-gzip'),
              ctx.body(repoBuffer),
            ),
        ),
      );
    });

    it('returns the wanted files from an archive', async () => {
      const processor = new GithubUrlReader(
        {
          host: 'github.com',
          apiBaseUrl: 'https://api.github.com',
        },
        { treeResponseFactory },
      );

      const response = await processor.readTree(
        'https://github.com/backstage/mock/tree/repo',
      );

      const files = await response.files();

      expect(files.length).toBe(2);
      const mkDocsFile = await files[0].content();
      const indexMarkdownFile = await files[1].content();

      expect(mkDocsFile.toString()).toBe('site_name: Test\n');
      expect(indexMarkdownFile.toString()).toBe('# Test\n');
    });

    it('must specify a branch', async () => {
      const processor = new GithubUrlReader(
        {
          host: 'github.com',
          apiBaseUrl: 'https://api.github.com',
        },
        { treeResponseFactory },
      );

      await expect(
        processor.readTree('https://github.com/backstage/mock'),
      ).rejects.toThrow(
        'GitHub URL must contain branch to be able to fetch tree',
      );
    });

    it('returns the wanted files from an archive with a subpath', async () => {
      const processor = new GithubUrlReader(
        {
          host: 'github.com',
          apiBaseUrl: 'https://api.github.com',
        },
        { treeResponseFactory },
      );

      const response = await processor.readTree(
        'https://github.com/backstage/mock/tree/repo/docs',
      );

      const files = await response.files();

      expect(files.length).toBe(1);
      const indexMarkdownFile = await files[0].content();

      expect(indexMarkdownFile.toString()).toBe('# Test\n');
    });
  });
});
