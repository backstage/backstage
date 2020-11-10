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
import { setupServer } from 'msw/node';
import { msw } from '@backstage/test-utils';
import { rest } from 'msw';
import {
  getApiRequestOptions,
  getApiUrl,
  getRawRequestOptions,
  getRawUrl,
  GithubUrlReader,
  ProviderConfig,
  readConfig,
} from './GithubUrlReader';
import fs from 'fs';
import path from 'path';
import mockfs from 'mock-fs';
import recursive from 'recursive-readdir';

describe('GithubUrlReader', () => {
  describe('getApiRequestOptions', () => {
    it('sets the correct API version', () => {
      const config: ProviderConfig = { host: '', apiBaseUrl: '' };
      expect((getApiRequestOptions(config).headers as any).Accept).toEqual(
        'application/vnd.github.v3.raw',
      );
    });

    it('inserts a token when needed', () => {
      const withToken: ProviderConfig = {
        host: '',
        apiBaseUrl: '',
        token: 'A',
      };
      const withoutToken: ProviderConfig = {
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
      const withToken: ProviderConfig = {
        host: '',
        rawBaseUrl: '',
        token: 'A',
      };
      const withoutToken: ProviderConfig = {
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
      const config: ProviderConfig = { host: '', apiBaseUrl: '' };
      expect(() => getApiUrl('a/b', config)).toThrow(/Incorrect URL: a\/b/);
    });

    it('happy path for github', () => {
      const config: ProviderConfig = {
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
      const config: ProviderConfig = {
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
      const config: ProviderConfig = { host: '', apiBaseUrl: '' };
      expect(() => getRawUrl('a/b', config)).toThrow(/Incorrect URL: a\/b/);
    });

    it('happy path for github', () => {
      const config: ProviderConfig = {
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
      const config: ProviderConfig = {
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

  describe('readConfig', () => {
    function config(
      providers: { host: string; apiBaseUrl?: string; token?: string }[],
    ) {
      return ConfigReader.fromConfigs([
        {
          context: '',
          data: {
            integrations: { github: providers },
          },
        },
      ]);
    }

    it('adds a default GitHub entry when missing', () => {
      const output = readConfig(config([]));
      expect(output).toEqual([
        {
          host: 'github.com',
          apiBaseUrl: 'https://api.github.com',
          rawBaseUrl: 'https://raw.githubusercontent.com',
        },
      ]);
    });

    it('injects the correct GitHub API base URL when missing', () => {
      const output = readConfig(config([{ host: 'github.com' }]));
      expect(output).toEqual([
        {
          host: 'github.com',
          apiBaseUrl: 'https://api.github.com',
          rawBaseUrl: 'https://raw.githubusercontent.com',
        },
      ]);
    });

    it('rejects custom targets with no base URLs', () => {
      expect(() => readConfig(config([{ host: 'ghe.company.com' }]))).toThrow(
        "GitHub integration for 'ghe.company.com' must configure an explicit apiBaseUrl and rawBaseUrl",
      );
    });

    it('rejects funky configs', () => {
      expect(() => readConfig(config([{ host: 7 } as any]))).toThrow(/host/);
      expect(() => readConfig(config([{ token: 7 } as any]))).toThrow(/token/);
      expect(() =>
        readConfig(config([{ host: 'github.com', apiBaseUrl: 7 } as any])),
      ).toThrow(/apiBaseUrl/);
      expect(() =>
        readConfig(config([{ host: 'github.com', token: 7 } as any])),
      ).toThrow(/token/);
    });
  });

  describe('implementation', () => {
    it('rejects unknown targets', async () => {
      const processor = new GithubUrlReader({
        host: 'github.com',
        apiBaseUrl: 'https://api.github.com',
      });
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
          'https://github.com/spotify/mock/archive/repo.tar.gz',
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
      const processor = new GithubUrlReader({
        host: 'github.com',
      });

      const response = await processor.readTree(
        'https://github.com/spotify/mock',
        'repo',
        ['mkdocs.yml', 'docs'],
      );

      const files = response.files();

      const mkDocsFile = await files[0].content();
      const indexMarkdownFile = await files[1].content();

      expect(mkDocsFile.toString()).toBe('site_name: Test\n');
      expect(indexMarkdownFile.toString()).toBe('# Test\n');
    });

    it('returns a folder path from an archive', async () => {
      const processor = new GithubUrlReader({
        host: 'github.com',
      });

      const response = await processor.readTree(
        'https://github.com/spotify/mock',
        'repo',
        ['mkdocs.yml', 'docs'],
      );

      mockfs();
      const directory = await response.dir('/tmp/fs');

      const writtenToDirectory = fs.existsSync(directory);
      const paths = await recursive(directory);
      mockfs.restore();

      expect(writtenToDirectory).toBe(true);
      expect(paths.sort()).toEqual(
        [
          '/tmp/fs/mock-repo/docs/index.md',
          '/tmp/fs/mock-repo/mkdocs.yml',
        ].sort(),
      );

      worker.resetHandlers();
    });
  });
});
