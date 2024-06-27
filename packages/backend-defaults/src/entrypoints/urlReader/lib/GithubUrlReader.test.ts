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

import { ConfigReader } from '@backstage/config';
import {
  GithubCredentialsProvider,
  GithubIntegration,
  readGithubIntegrationConfig,
} from '@backstage/integration';
import {
  createMockDirectory,
  setupRequestMockHandlers,
} from '@backstage/backend-test-utils';
import fs from 'fs-extra';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import path from 'path';
import { NotFoundError, NotModifiedError } from '@backstage/errors';
import {
  GhBlobResponse,
  GhCombinedCommitStatusResponse,
  GhRepoResponse,
  GhTreeResponse,
  GithubUrlReader,
} from './GithubUrlReader';
import { DefaultReadTreeResponseFactory } from './tree';

const mockDir = createMockDirectory({ mockOsTmpDir: true });

const treeResponseFactory = DefaultReadTreeResponseFactory.create({
  config: new ConfigReader({}),
});

const mockCredentialsProvider = {
  getCredentials: jest.fn().mockResolvedValue({ headers: {} }),
} satisfies GithubCredentialsProvider;

const githubProcessor = new GithubUrlReader(
  new GithubIntegration(
    readGithubIntegrationConfig(
      new ConfigReader({
        host: 'github.com',
        apiBaseUrl: 'https://api.github.com',
      }),
    ),
  ),
  { treeResponseFactory, credentialsProvider: mockCredentialsProvider },
);

const gheProcessor = new GithubUrlReader(
  new GithubIntegration(
    readGithubIntegrationConfig(
      new ConfigReader({
        host: 'ghe.github.com',
        apiBaseUrl: 'https://ghe.github.com/api/v3',
      }),
    ),
  ),
  { treeResponseFactory, credentialsProvider: mockCredentialsProvider },
);

describe('GithubUrlReader', () => {
  const worker = setupServer();
  setupRequestMockHandlers(worker);

  beforeEach(mockDir.clear);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('implementation', () => {
    it('rejects unknown targets', async () => {
      await expect(
        githubProcessor.readUrl('https://not.github.com/apa'),
      ).rejects.toThrow(
        'Incorrect URL: https://not.github.com/apa, Error: Invalid GitHub URL or file path',
      );
    });
  });

  /*
   * read
   */

  describe('read', () => {
    it('should use the headers from the credentials provider to the fetch request when doing read', async () => {
      expect.assertions(2);

      const mockHeaders = {
        Authorization: 'bearer blah',
        otherheader: 'something',
      };

      mockCredentialsProvider.getCredentials.mockResolvedValue({
        headers: mockHeaders,
      });

      worker.use(
        rest.get(
          'https://ghe.github.com/api/v3/repos/backstage/mock/tree/contents/',
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

      await gheProcessor.readUrl(
        'https://github.com/backstage/mock/tree/blob/main',
      );
    });
  });

  /*
   * readUrl
   */
  describe('readUrl', () => {
    it('should use the headers from the credentials provider to the fetch request when doing readUrl', async () => {
      expect.assertions(2);

      const mockHeaders = {
        Authorization: 'bearer blah',
        otherheader: 'something',
      };

      mockCredentialsProvider.getCredentials.mockResolvedValue({
        headers: mockHeaders,
      });

      worker.use(
        rest.get(
          'https://ghe.github.com/api/v3/repos/backstage/mock/tree/contents/',
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

      await gheProcessor.readUrl(
        'https://github.com/backstage/mock/tree/blob/main',
      );
    });

    it('should throw NotModified if GitHub responds with 304', async () => {
      expect.assertions(4);

      const mockHeaders = {
        Authorization: 'bearer blah',
        otherheader: 'something',
      };

      mockCredentialsProvider.getCredentials.mockResolvedValue({
        headers: mockHeaders,
      });

      worker.use(
        rest.get(
          'https://ghe.github.com/api/v3/repos/backstage/mock/tree/contents/',
          (req, res, ctx) => {
            expect(req.headers.get('authorization')).toBe(
              mockHeaders.Authorization,
            );
            expect(req.headers.get('otherheader')).toBe(
              mockHeaders.otherheader,
            );
            expect(req.headers.get('if-none-match')).toBe('foo');
            return res(
              ctx.status(304),
              ctx.set('Content-Type', 'application/x-gzip'),
              ctx.body('foo'),
            );
          },
        ),
      );

      await expect(
        gheProcessor.readUrl(
          'https://github.com/backstage/mock/tree/blob/main',
          { etag: 'foo' },
        ),
      ).rejects.toThrow(NotModifiedError);
    });

    it('should throw Error with ratelimit exceeded if GitHub responds with 403 and rate limit is exceeded', async () => {
      expect.assertions(1);

      worker.use(
        rest.get(
          'https://ghe.github.com/api/v3/repos/backstage/mock/tree/contents/',
          (_req, res, ctx) => {
            return res(
              ctx.status(403),
              ctx.set('X-RateLimit-Remaining', '0'),
              ctx.body(
                '{"message": "API rate limit exceeded for xxx.xxx.xxx.xxx..."}',
              ),
            );
          },
        ),
      );

      await expect(
        gheProcessor.readUrl(
          'https://github.com/backstage/mock/tree/blob/main',
          { etag: 'foo' },
        ),
      ).rejects.toThrow(/rate limit exceeded/);
    });

    it('should return etag and last-modified from the response', async () => {
      mockCredentialsProvider.getCredentials.mockResolvedValue({
        headers: {
          Authorization: 'bearer blah',
        },
      });

      worker.use(
        rest.get(
          'https://ghe.github.com/api/v3/repos/backstage/mock/tree/contents/',
          (_req, res, ctx) => {
            return res(
              ctx.status(200),
              ctx.set('Etag', 'foo'),
              ctx.set(
                'Last-Modified',
                new Date('2021-01-01T00:00:00Z').toUTCString(),
              ),

              ctx.body('bar'),
            );
          },
        ),
      );

      const response = await gheProcessor.readUrl(
        'https://github.com/backstage/mock/tree/blob/main',
      );
      expect(response.etag).toBe('foo');
      expect(response.lastModifiedAt).toEqual(new Date('2021-01-01T00:00:00Z'));
    });

    it('should override the token if its provided', async () => {
      expect.assertions(1);

      mockCredentialsProvider.getCredentials.mockResolvedValue({
        headers: {
          Authorization: 'bearer blah',
        },
      });

      worker.use(
        rest.get(
          'https://ghe.github.com/api/v3/repos/backstage/mock/tree/contents/',
          (req, res, ctx) => {
            expect(req.headers.get('authorization')).toBe(
              'Bearer overridentoken',
            );
            return res(ctx.status(200));
          },
        ),
      );

      await gheProcessor.readUrl(
        'https://github.com/backstage/mock/tree/blob/main',
        { token: 'overridentoken' },
      );
    });
  });

  /*
   * readTree
   */

  describe('readTree', () => {
    const repoBuffer = fs.readFileSync(
      path.resolve(__dirname, '__fixtures__/backstage-mock-etag123.tar.gz'),
    );

    const reposGithubApiResponse = {
      id: 123,
      full_name: 'backstage/mock',
      default_branch: 'main',
      branches_url:
        'https://api.github.com/repos/backstage/mock/branches{/branch}',
      archive_url:
        'https://api.github.com/repos/backstage/mock/{archive_format}{/ref}',
    } as Partial<GhRepoResponse>;

    const reposGheApiResponse = {
      id: 123,
      full_name: 'backstage/mock',
      default_branch: 'main',
      branches_url:
        'https://ghe.github.com/api/v3/repos/backstage/mock/branches{/branch}',
      archive_url:
        'https://ghe.github.com/api/v3/repos/backstage/mock/{archive_format}{/ref}',
    } as Partial<GhRepoResponse>;

    const commitStatusGithubResponse = {
      sha: 'etag123abc',
      repository: reposGithubApiResponse,
    } as Partial<GhCombinedCommitStatusResponse>;

    const commitStatusGheResponse = {
      sha: 'etag123abc',
      repository: reposGheApiResponse,
    } as Partial<GhCombinedCommitStatusResponse>;

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
          'https://api.github.com/repos/backstage/mock/commits/main/status',
          (req, res, ctx) => {
            if (req.url.searchParams.get('per_page') === '0') {
              return res(
                ctx.status(200),
                ctx.set('Content-Type', 'application/json'),
                ctx.json(commitStatusGithubResponse),
              );
            }

            return res(ctx.status(500));
          },
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
          'https://api.github.com/repos/backstage/mock/commits/branchDoesNotExist/status',
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
          'https://ghe.github.com/api/v3/repos/backstage/mock/commits/main/status',
          (req, res, ctx) => {
            if (req.url.searchParams.get('per_page') === '0') {
              return res(
                ctx.status(200),
                ctx.set('Content-Type', 'application/json'),
                ctx.json(commitStatusGheResponse),
              );
            }

            return res(ctx.status(500));
          },
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

      const dir = await response.dir({ targetDir: mockDir.path });

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

      mockCredentialsProvider.getCredentials.mockResolvedValue({
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

    it('should override the token when provided', async () => {
      expect.assertions(1);

      const mockHeaders = {
        Authorization: 'bearer blah',
      };

      mockCredentialsProvider.getCredentials.mockResolvedValue({
        headers: mockHeaders,
      });

      worker.use(
        rest.get(
          'https://ghe.github.com/api/v3/repos/backstage/mock/tarball/etag123abc',
          (req, res, ctx) => {
            expect(req.headers.get('authorization')).toBe(
              'Bearer overridentoken',
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
        { token: 'overridentoken' },
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

      const dir = await response.dir({ targetDir: mockDir.path });

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
          new GithubIntegration(
            readGithubIntegrationConfig(
              new ConfigReader({
                host: 'ghe.mycompany.net',
              }),
            ),
          ),
          {
            treeResponseFactory,
            credentialsProvider: mockCredentialsProvider,
          },
        );
      }).toThrow('must configure an explicit apiBaseUrl');
    });
  });

  /*
   * search
   */

  describe('search', () => {
    const repoBuffer = fs.readFileSync(
      path.resolve(__dirname, '__fixtures__/backstage-mock-etag123.tar.gz'),
    );

    const githubTreeContents: GhTreeResponse['tree'] = [
      {
        path: 'mkdocs.yml',
        type: 'blob',
        url: 'https://api.github.com/repos/backstage/mock/git/blobs/1',
      },
      {
        path: 'docs',
        type: 'tree',
        url: 'https://api.github.com/repos/backstage/mock/git/trees/2',
      },
      {
        path: 'docs/index.md',
        type: 'blob',
        url: 'https://api.github.com/repos/backstage/mock/git/blobs/3',
      },
    ];

    const gheTreeContents: GhTreeResponse['tree'] = [
      {
        path: 'mkdocs.yml',
        type: 'blob',
        url: 'https://ghe.github.com/api/v3/repos/backstage/mock/git/blobs/1',
      },
      {
        path: 'docs',
        type: 'tree',
        url: 'https://ghe.github.com/api/v3/repos/backstage/mock/git/trees/2',
      },
      {
        path: 'docs/index.md',
        type: 'blob',
        url: 'https://ghe.github.com/api/v3/repos/backstage/mock/git/blobs/3',
      },
    ];

    // Tarballs
    beforeEach(() => {
      worker.use(
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
      );
    });

    // Repo details
    beforeEach(() => {
      const githubResponse = {
        id: 123,
        full_name: 'backstage/mock',
        default_branch: 'main',
        branches_url:
          'https://api.github.com/repos/backstage/mock/branches{/branch}',
        archive_url:
          'https://api.github.com/repos/backstage/mock/{archive_format}{/ref}',
        trees_url:
          'https://api.github.com/repos/backstage/mock/git/trees{/sha}',
      } as Partial<GhRepoResponse>;

      const gheResponse = {
        id: 123,
        full_name: 'backstage/mock',
        default_branch: 'main',
        branches_url:
          'https://ghe.github.com/api/v3/repos/backstage/mock/branches{/branch}',
        archive_url:
          'https://ghe.github.com/api/v3/repos/backstage/mock/{archive_format}{/ref}',
        trees_url:
          'https://ghe.github.com/api/v3/repos/backstage/mock/git/trees{/sha}',
      } as Partial<GhRepoResponse>;

      worker.use(
        rest.get('https://api.github.com/repos/backstage/mock', (_, res, ctx) =>
          res(
            ctx.status(200),
            ctx.set('Content-Type', 'application/json'),
            ctx.json(githubResponse),
          ),
        ),
        rest.get(
          'https://ghe.github.com/api/v3/repos/backstage/mock',
          (_, res, ctx) =>
            res(
              ctx.status(200),
              ctx.set('Content-Type', 'application/json'),
              ctx.json(gheResponse),
            ),
        ),
      );
    });

    // commit status for branch details
    beforeEach(() => {
      const githubResponse = {
        sha: 'etag123abc',
        repository: {
          id: 123,
          full_name: 'backstage/mock',
          default_branch: 'main',
          branches_url:
            'https://api.github.com/repos/backstage/mock/branches{/branch}',
          archive_url:
            'https://api.github.com/repos/backstage/mock/{archive_format}{/ref}',
          trees_url:
            'https://api.github.com/repos/backstage/mock/git/trees{/sha}',
        },
      } as Partial<GhCombinedCommitStatusResponse>;

      const gheResponse = {
        sha: 'etag123abc',
        repository: {
          id: 123,
          full_name: 'backstage/mock',
          default_branch: 'main',
          branches_url:
            'https://ghe.github.com/api/v3/repos/backstage/mock/branches{/branch}',
          archive_url:
            'https://ghe.github.com/api/v3/repos/backstage/mock/{archive_format}{/ref}',
          trees_url:
            'https://ghe.github.com/api/v3/repos/backstage/mock/git/trees{/sha}',
        },
      } as Partial<GhCombinedCommitStatusResponse>;

      worker.use(
        rest.get(
          'https://api.github.com/repos/backstage/mock/commits/main/status',
          (req, res, ctx) => {
            if (req.url.searchParams.get('per_page') === '0') {
              return res(
                ctx.status(200),
                ctx.set('Content-Type', 'application/json'),
                ctx.json(githubResponse),
              );
            }

            return res(ctx.status(500));
          },
        ),
        rest.get(
          'https://ghe.github.com/api/v3/repos/backstage/mock/commits/main/status',
          (req, res, ctx) => {
            if (req.url.searchParams.get('per_page') === '0') {
              return res(
                ctx.status(200),
                ctx.set('Content-Type', 'application/json'),
                ctx.json(gheResponse),
              );
            }

            return res(ctx.status(500));
          },
        ),
        rest.get(
          'https://api.github.com/repos/backstage/mock/commits/branchDoesNotExist/status',
          (_, res, ctx) => res(ctx.status(404)),
        ),
      );
    });

    // Blobs
    beforeEach(() => {
      const blob1Response = {
        content: Buffer.from('site_name: Test\n').toString('base64'),
      } as Partial<GhBlobResponse>;

      const blob3Response = {
        content: Buffer.from('# Test\n').toString('base64'),
      } as Partial<GhBlobResponse>;

      worker.use(
        rest.get(
          'https://api.github.com/repos/backstage/mock/git/blobs/1',
          (_, res, ctx) =>
            res(
              ctx.status(200),
              ctx.set('Content-Type', 'application/json'),
              ctx.json(blob1Response),
            ),
        ),
        rest.get(
          'https://api.github.com/repos/backstage/mock/git/blobs/3',
          (_, res, ctx) =>
            res(
              ctx.status(200),
              ctx.set('Content-Type', 'application/json'),
              ctx.json(blob3Response),
            ),
        ),
        rest.get(
          'https://ghe.github.com/api/v3/repos/backstage/mock/git/blobs/1',
          (_, res, ctx) =>
            res(
              ctx.status(200),
              ctx.set('Content-Type', 'application/json'),
              ctx.json(blob1Response),
            ),
        ),
        rest.get(
          'https://ghe.github.com/api/v3/repos/backstage/mock/git/blobs/3',
          (_, res, ctx) =>
            res(
              ctx.status(200),
              ctx.set('Content-Type', 'application/json'),
              ctx.json(blob3Response),
            ),
        ),
      );
    });

    async function runTests(reader: GithubUrlReader, baseUrl: string) {
      const r1 = await reader.search(
        `${baseUrl}/backstage/mock/tree/main/**/*`,
      );
      expect(r1.etag).toBe('etag123abc');
      expect(r1.files.length).toBe(2);

      const r2 = await reader.search(
        `${baseUrl}/backstage/mock/tree/main/**/*`,
        { etag: 'somethingElse' },
      );
      expect(r2.etag).toBe('etag123abc');
      expect(r2.files.length).toBe(2);

      const r3 = await reader.search(`${baseUrl}/backstage/mock/tree/main/o`);
      expect(r3.files.length).toBe(0);

      const r4 = await reader.search(
        `${baseUrl}/backstage/mock/tree/main/*docs*`,
      );
      expect(r4.files.length).toBe(1);
      expect(r4.files[0].url).toBe(
        `${baseUrl}/backstage/mock/tree/main/mkdocs.yml`,
      );
      await expect(r4.files[0].content()).resolves.toEqual(
        Buffer.from('site_name: Test\n'),
      );

      const r5 = await reader.search(
        `${baseUrl}/backstage/mock/tree/main/*/index.*`,
      );
      expect(r5.files.length).toBe(1);
      expect(r5.files[0].url).toBe(
        `${baseUrl}/backstage/mock/tree/main/docs/index.md`,
      );
      await expect(r5.files[0].content()).resolves.toEqual(
        Buffer.from('# Test\n'),
      );
    }

    // eslint-disable-next-line jest/expect-expect
    it('succeeds on github when going via repo listing', async () => {
      worker.use(
        rest.get(
          'https://api.github.com/repos/backstage/mock/git/trees/etag123abc',
          (_, res, ctx) =>
            res(
              ctx.status(200),
              ctx.set('Content-Type', 'application/json'),
              ctx.json({
                truncated: false,
                tree: githubTreeContents,
              } as Partial<GhTreeResponse>),
            ),
        ),
      );
      await runTests(githubProcessor, 'https://github.com');
    });

    // eslint-disable-next-line jest/expect-expect
    it('succeeds on github when going via readTree', async () => {
      worker.use(
        rest.get(
          'https://api.github.com/repos/backstage/mock/git/trees/etag123abc',
          (_, res, ctx) =>
            res(
              ctx.status(200),
              ctx.set('Content-Type', 'application/json'),
              ctx.json({
                truncated: true,
                tree: [],
              } as Partial<GhTreeResponse>),
            ),
        ),
      );
      await runTests(githubProcessor, 'https://github.com');
    });

    // eslint-disable-next-line jest/expect-expect
    it('succeeds on ghe when going via repo listing', async () => {
      worker.use(
        rest.get(
          'https://ghe.github.com/api/v3/repos/backstage/mock/git/trees/etag123abc',
          (_, res, ctx) =>
            res(
              ctx.status(200),
              ctx.set('Content-Type', 'application/json'),
              ctx.json({
                truncated: false,
                tree: gheTreeContents,
              } as Partial<GhTreeResponse>),
            ),
        ),
      );
      await runTests(gheProcessor, 'https://ghe.github.com');
    });

    it('passes through a token for the search request', async () => {
      expect.assertions(1);

      worker.use(
        rest.get(
          'https://ghe.github.com/api/v3/repos/backstage/mock/git/trees/etag123abc',
          (req, res, ctx) => {
            expect(req.headers.get('authorization')).toBe(
              'Bearer overridentoken',
            );
            return res(
              ctx.status(200),
              ctx.set('Content-Type', 'application/json'),
              ctx.json({
                truncated: true,
                tree: [],
              } as Partial<GhTreeResponse>),
            );
          },
        ),
      );

      await gheProcessor.search(
        `https://ghe.github.com/backstage/mock/tree/main/**/*`,
        { token: 'overridentoken' },
      );
    });

    // eslint-disable-next-line jest/expect-expect
    it('succeeds on ghe when going via readTree', async () => {
      worker.use(
        rest.get(
          'https://ghe.github.com/api/v3/repos/backstage/mock/git/trees/etag123abc',
          (_, res, ctx) =>
            res(
              ctx.status(200),
              ctx.set('Content-Type', 'application/json'),
              ctx.json({
                truncated: true,
                tree: [],
              } as Partial<GhTreeResponse>),
            ),
        ),
      );
      await runTests(gheProcessor, 'https://ghe.github.com');
    });

    it('throws NotModifiedError when same etag', async () => {
      await expect(
        githubProcessor.search(
          'https://githib.com/backstage/mock/tree/main/**/*',
          { etag: 'etag123abc' },
        ),
      ).rejects.toThrow(NotModifiedError);
    });

    it('throws NotFoundError when missing branch', async () => {
      await expect(
        githubProcessor.search(
          'https://githib.com/backstage/mock/tree/branchDoesNotExist/**/*',
        ),
      ).rejects.toThrow(NotFoundError);
    });
  });
});
