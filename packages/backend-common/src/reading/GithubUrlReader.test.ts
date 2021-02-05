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
import { GithubCredentialsProvider } from '@backstage/integration';
import { msw } from '@backstage/test-utils';
import fs from 'fs-extra';
import mockFs from 'mock-fs';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import path from 'path';
import { NotFoundError, NotModifiedError } from '../errors';
import { GithubUrlReader } from './GithubUrlReader';
import { ReadTreeResponseFactory } from './tree';

const treeResponseFactory = ReadTreeResponseFactory.create({
  config: new ConfigReader({}),
});

const mockCredentialsProvider = ({
  getCredentials: jest.fn().mockResolvedValue({ headers: {} }),
} as unknown) as GithubCredentialsProvider;

const githubProcessor = new GithubUrlReader(
  {
    host: 'github.com',
    apiBaseUrl: 'https://api.github.com',
  },
  { treeResponseFactory, credentialsProvider: mockCredentialsProvider },
);

const gheProcessor = new GithubUrlReader(
  {
    host: 'ghe.github.com',
    apiBaseUrl: 'https://ghe.github.com/api/v3',
  },
  { treeResponseFactory, credentialsProvider: mockCredentialsProvider },
);

describe('GithubUrlReader', () => {
  const worker = setupServer();

  msw.setupDefaultHandlers(worker);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('implementation', () => {
    it('rejects unknown targets', async () => {
      await expect(
        githubProcessor.read('https://not.github.com/apa'),
      ).rejects.toThrow(
        'Incorrect URL: https://not.github.com/apa, Error: Invalid GitHub URL or file path',
      );
    });
  });

  describe('read', () => {
    it('should use the headers from the credentials provider to the fetch request when doing read', async () => {
      expect.assertions(2);

      const mockHeaders = {
        Authorization: 'bearer blah',
        otherheader: 'something',
      };

      (mockCredentialsProvider.getCredentials as jest.Mock).mockResolvedValue({
        headers: mockHeaders,
      });

      worker.use(
        rest.get(
          'https://api.github.com/repos/backstage/mock/tree/contents/?ref=main',
          (req, res, ctx) => {
            expect(req.headers.get('authorization')).toBe(
              mockHeaders.Authorization,
            );
            expect(req.headers.get('otherheader')).toBe(
              mockHeaders.otherheader,
            );
            return res(
              ctx.status(200),
              ctx.set('Content-Type', 'application/x-gzip'),
              ctx.body('foo'),
            );
          },
        ),
      );

      await githubProcessor.read(
        'https://github.com/backstage/mock/tree/blob/main',
      );
    });
  });

  describe('readTree', () => {
    beforeEach(() => {
      mockFs({
        '/tmp': mockFs.directory(),
      });
    });

    afterEach(() => {
      mockFs.restore();
    });

    const repoBuffer = fs.readFileSync(
      path.resolve(
        'src',
        'reading',
        '__fixtures__',
        'backstage-mock-etag123.tar.gz',
      ),
    );

    const reposGithubApiResponse = {
      id: '123',
      full_name: 'backstage/mock',
      default_branch: 'main',
      branches_url:
        'https://api.github.com/repos/backstage/mock/branches{/branch}',
      archive_url:
        'https://api.github.com/repos/backstage/mock/{archive_format}{/ref}',
    };

    const reposGheApiResponse = {
      ...reposGithubApiResponse,
      branches_url:
        'https://ghe.github.com/api/v3/repos/backstage/mock/branches{/branch}',
      archive_url:
        'https://ghe.github.com/api/v3/repos/backstage/mock/{archive_format}{/ref}',
    };

    const branchesApiResponse = {
      name: 'main',
      commit: {
        sha: 'etag123abc',
      },
    };

    beforeEach(() => {
      worker.use(
        rest.get('https://api.github.com/repos/backstage/mock', (_, res, ctx) =>
          res(
            ctx.status(200),
            ctx.set('Content-Type', 'application/json'),
            ctx.json(reposGithubApiResponse),
          ),
        ),
        rest.get(
          'https://api.github.com/repos/backstage/mock/branches/main',
          (_, res, ctx) =>
            res(
              ctx.status(200),
              ctx.set('Content-Type', 'application/json'),
              ctx.json(branchesApiResponse),
            ),
        ),
        rest.get(
          'https://api.github.com/repos/backstage/mock/tarball/etag123abc',
          (_, res, ctx) =>
            res(
              ctx.status(200),
              ctx.set('Content-Type', 'application/x-gzip'),
              ctx.set(
                'content-disposition',
                'attachment; filename=backstage-mock-etag123.tar.gz',
              ),
              ctx.body(repoBuffer),
            ),
        ),
        rest.get(
          'https://api.github.com/repos/backstage/mock/branches/branchDoesNotExist',
          (_, res, ctx) => res(ctx.status(404)),
        ),
        rest.get(
          'https://ghe.github.com/api/v3/repos/backstage/mock/tarball/etag123abc',
          (_, res, ctx) =>
            res(
              ctx.status(200),
              ctx.set('Content-Type', 'application/x-gzip'),
              ctx.set(
                'content-disposition',
                'attachment; filename=backstage-mock-etag123.tar.gz',
              ),
              ctx.body(repoBuffer),
            ),
        ),
        rest.get(
          'https://ghe.github.com/api/v3/repos/backstage/mock',
          (_, res, ctx) =>
            res(
              ctx.status(200),
              ctx.set('Content-Type', 'application/json'),
              ctx.json(reposGheApiResponse),
            ),
        ),
        rest.get(
          'https://ghe.github.com/api/v3/repos/backstage/mock/branches/main',
          (_, res, ctx) =>
            res(
              ctx.status(200),
              ctx.set('Content-Type', 'application/json'),
              ctx.json(branchesApiResponse),
            ),
        ),
      );
    });

    it('returns the wanted files from an archive', async () => {
      const response = await githubProcessor.readTree(
        'https://github.com/backstage/mock/tree/main',
      );

      expect(response.etag).toBe('etag123abc');

      const files = await response.files();

      expect(files.length).toBe(2);
      const mkDocsFile = await files[0].content();
      const indexMarkdownFile = await files[1].content();

      expect(mkDocsFile.toString()).toBe('site_name: Test\n');
      expect(indexMarkdownFile.toString()).toBe('# Test\n');
    });

    it('creates a directory with the wanted files', async () => {
      const response = await githubProcessor.readTree(
        'https://github.com/backstage/mock',
      );

      const dir = await response.dir({ targetDir: '/tmp' });

      await expect(
        fs.readFile(path.join(dir, 'mkdocs.yml'), 'utf8'),
      ).resolves.toBe('site_name: Test\n');
      await expect(
        fs.readFile(path.join(dir, 'docs', 'index.md'), 'utf8'),
      ).resolves.toBe('# Test\n');
    });

    it('should use the headers from the credentials provider to the fetch request', async () => {
      expect.assertions(2);

      const mockHeaders = {
        Authorization: 'bearer blah',
        otherheader: 'something',
      };

      (mockCredentialsProvider.getCredentials as jest.Mock).mockResolvedValue({
        headers: mockHeaders,
      });

      worker.use(
        rest.get(
          'https://ghe.github.com/api/v3/repos/backstage/mock/tarball/etag123abc',
          (req, res, ctx) => {
            expect(req.headers.get('authorization')).toBe(
              mockHeaders.Authorization,
            );
            expect(req.headers.get('otherheader')).toBe(
              mockHeaders.otherheader,
            );
            return res(
              ctx.status(200),
              ctx.set('Content-Type', 'application/x-gzip'),
              ctx.set(
                'content-disposition',
                'attachment; filename=backstage-mock-etag123.tar.gz',
              ),
              ctx.body(repoBuffer),
            );
          },
        ),
      );

      await gheProcessor.readTree(
        'https://ghe.github.com/backstage/mock/tree/main',
      );
    });

    it('includes the subdomain in the github url', async () => {
      const response = await gheProcessor.readTree(
        'https://ghe.github.com/backstage/mock/tree/main/docs',
      );

      const files = await response.files();

      expect(files.length).toBe(1);
      const indexMarkdownFile = await files[0].content();

      expect(indexMarkdownFile.toString()).toBe('# Test\n');
    });

    it('returns the wanted files from an archive with a subpath', async () => {
      const response = await githubProcessor.readTree(
        'https://github.com/backstage/mock/tree/main/docs',
      );

      const files = await response.files();

      expect(files.length).toBe(1);
      const indexMarkdownFile = await files[0].content();

      expect(indexMarkdownFile.toString()).toBe('# Test\n');
    });

    it('creates a directory with the wanted files with subpath', async () => {
      const response = await githubProcessor.readTree(
        'https://github.com/backstage/mock/tree/main/docs',
      );

      const dir = await response.dir({ targetDir: '/tmp' });

      await expect(
        fs.readFile(path.join(dir, 'index.md'), 'utf8'),
      ).resolves.toBe('# Test\n');
    });

    it('throws a NotModifiedError when given a etag in options', async () => {
      const fnGithub = async () => {
        await githubProcessor.readTree('https://github.com/backstage/mock', {
          etag: 'etag123abc',
        });
      };

      const fnGhe = async () => {
        await gheProcessor.readTree(
          'https://ghe.github.com/backstage/mock/tree/main/docs',
          {
            etag: 'etag123abc',
          },
        );
      };

      await expect(fnGithub).rejects.toThrow(NotModifiedError);
      await expect(fnGhe).rejects.toThrow(NotModifiedError);
    });

    it('should not throw error when given an outdated etag in options', async () => {
      const response = await githubProcessor.readTree(
        'https://github.com/backstage/mock/tree/main',
        {
          etag: 'outdatedetag123abc',
        },
      );
      expect((await response.files()).length).toBe(2);
    });

    it('should detect the default branch', async () => {
      const response = await githubProcessor.readTree(
        'https://github.com/backstage/mock',
      );
      expect((await response.files()).length).toBe(2);
    });

    it('should throw error on missing branch', async () => {
      const fnGithub = async () => {
        await githubProcessor.readTree(
          'https://github.com/backstage/mock/tree/branchDoesNotExist',
        );
      };
      await expect(fnGithub).rejects.toThrow(NotFoundError);
    });

    it('should throw error when apiBaseUrl is missing', () => {
      expect(() => {
        /* eslint-disable no-new */
        new GithubUrlReader(
          {
            host: 'ghe.mycompany.net',
          },
          {
            treeResponseFactory,
            credentialsProvider: mockCredentialsProvider,
          },
        );
      }).toThrowError('must configure an explicit apiBaseUrl');
    });
  });
});
