/*
 * Copyright 2022 The Backstage Authors
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
  createMockDirectory,
  mockServices,
  registerMswTestHooks,
} from '@backstage/backend-test-utils';
import { ConfigReader } from '@backstage/config';
import { NotModifiedError } from '@backstage/errors';
import {
  GerritIntegration,
  readGerritIntegrationConfig,
} from '@backstage/integration';
import { JsonObject } from '@backstage/types';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import fs from 'fs-extra';
import path from 'path';
import { UrlReaderPredicateTuple } from './types';
import { DefaultReadTreeResponseFactory } from './tree';
import { GerritUrlReader } from './GerritUrlReader';
import getRawBody from 'raw-body';

const mockDir = createMockDirectory({ mockOsTmpDir: true });

const treeResponseFactory = DefaultReadTreeResponseFactory.create({
  config: new ConfigReader({}),
});

// Gerrit processor without a gitilesBaseUrl configured
const gerritProcessor = new GerritUrlReader(
  new GerritIntegration(
    readGerritIntegrationConfig(
      new ConfigReader({
        host: 'gerrit.com',
        gitilesBaseUrl: 'https://gerrit.com/gitiles',
      }),
    ),
  ),
  { treeResponseFactory },
);

// Gerrit processor with a gitilesBaseUrl configured.
// Use to test readTree with Gitiles archive download.
const gerritProcessorWithGitiles = new GerritUrlReader(
  new GerritIntegration(
    readGerritIntegrationConfig(
      new ConfigReader({
        host: 'gerrit.com',
        gitilesBaseUrl: 'https://gerrit.com/gitiles',
      }),
    ),
  ),
  { treeResponseFactory },
);

const createReader = (config: JsonObject): UrlReaderPredicateTuple[] => {
  return GerritUrlReader.factory({
    config: new ConfigReader(config),
    logger: mockServices.logger.mock(),
    treeResponseFactory,
  });
};

// TODO(Rugvip): These tests seem to be a direct or indirect cause of the TaskWorker test flakiness
//               We're not sure why at this point, but while investigating these tests are disabled
// eslint-disable-next-line jest/no-disabled-tests
describe.skip('GerritUrlReader', () => {
  const worker = setupServer();
  registerMswTestHooks(worker);

  beforeEach(() => {
    mockDir.clear();
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  describe('reader factory', () => {
    it('creates a reader.', () => {
      const readers = createReader({
        integrations: {
          gerrit: [
            {
              host: 'gerrit.com',
              gitilesBaseUrl: 'https://gerrit.com/gitiles',
            },
          ],
        },
      });
      expect(readers).toHaveLength(1);
    });

    it('should not create a default entry.', () => {
      const readers = createReader({
        integrations: {},
      });
      expect(readers).toHaveLength(0);
    });
  });

  describe('predicates without Gitiles', () => {
    const readers = createReader({
      integrations: {
        gerrit: [
          { host: 'gerrit.com', gitilesBaseUrl: 'https://gerrit.com/gitiles' },
        ],
      },
    });
    const predicate = readers[0].predicate;

    it('returns true for the configured host', () => {
      expect(predicate(new URL('https://gerrit.com/path'))).toBe(true);
    });

    it('returns false for a different host.', () => {
      expect(predicate(new URL('https://github.com/path'))).toBe(false);
    });
  });

  describe('predicates with gitilesBaseUrl set.', () => {
    const readers = createReader({
      integrations: {
        gerrit: [
          { host: 'gerrit-review.com', gitilesBaseUrl: 'https://gerrit.com' },
        ],
      },
    });
    const predicate = readers[0].predicate;

    it('returns false since gitilesBaseUrl is set to the api host.', () => {
      expect(predicate(new URL('https://gerrit-review.com/path'))).toBe(false);
    });

    it('returns false for host.', () => {
      expect(predicate(new URL('https://gerrit.com/path'))).toBe(true);
    });
  });

  describe('readUrl', () => {
    const responseBuffer = Buffer.from('Apache License');
    it('should be able to read file contents as buffer', async () => {
      worker.use(
        rest.get(
          'https://gerrit.com/projects/web%2Fproject/branches/master/files/LICENSE/content',
          (_, res, ctx) => {
            return res(
              ctx.status(200),
              ctx.body(responseBuffer.toString('base64')),
            );
          },
        ),
      );

      const result = await gerritProcessor.readUrl(
        'https://gerrit.com/web/project/+/refs/heads/master/LICENSE',
      );
      const buffer = await result.buffer();
      expect(buffer.toString()).toBe(responseBuffer.toString());
    });
    it('should be able to read file contents of a commit as buffer', async () => {
      worker.use(
        rest.get(
          'https://gerrit.com/projects/web%2Fproject/commits/f775f9119c313c7ffc890d7908a45997273434d5/files/LICENSE/content',
          (_, res, ctx) => {
            return res(
              ctx.status(200),
              ctx.body(responseBuffer.toString('base64')),
            );
          },
        ),
      );
      const result = await gerritProcessor.readUrl(
        'https://gerrit.com/web/project/+/f775f9119c313c7ffc890d7908a45997273434d5/LICENSE',
      );
      const buffer = await result.buffer();
      expect(buffer.toString()).toBe(responseBuffer.toString());
    });
    it('should be able to read file contents as stream', async () => {
      worker.use(
        rest.get(
          'https://gerrit.com/projects/web%2Fproject/branches/master/files/LICENSE/content',
          (_, res, ctx) => {
            return res(
              ctx.status(200),
              ctx.body(responseBuffer.toString('base64')),
            );
          },
        ),
      );

      const result = await gerritProcessor.readUrl(
        'https://gerrit.com/web/project/+/refs/heads/master/LICENSE',
      );
      const fromStream = await getRawBody(result.stream!());
      expect(fromStream.toString()).toBe(responseBuffer.toString());
    });

    it('should raise NotFoundError on 404.', async () => {
      worker.use(
        rest.get(
          'https://gerrit.com/projects/web%2Fproject/branches/master/files/LICENSE/content',
          (_, res, ctx) => {
            return res(ctx.status(404, 'File not found.'));
          },
        ),
      );

      await expect(
        gerritProcessor.readUrl(
          'https://gerrit.com/web/project/+/refs/heads/master/LICENSE',
        ),
      ).rejects.toThrow(
        'File https://gerrit.com/web/project/+/refs/heads/master/LICENSE not found.',
      );
    });

    it('should throw an error on non 404 errors.', async () => {
      worker.use(
        rest.get(
          'https://gerrit.com/projects/web%2Fproject/branches/master/files/LICENSE/content',
          (_, res, ctx) => {
            return res(ctx.status(500, 'Error!!!'));
          },
        ),
      );

      await expect(
        gerritProcessor.readUrl(
          'https://gerrit.com/web/project/+/refs/heads/master/LICENSE',
        ),
      ).rejects.toThrow(
        'https://gerrit.com/web/project/+/refs/heads/master/LICENSE' +
          ' could not be read as https://gerrit.com/projects/web%2Fproject' +
          '/branches/master/files/LICENSE/content, 500 Error!!!',
      );
    });
  });

  describe('readTree', () => {
    const branchAPIUrl =
      'https://gerrit.com/projects/app%2Fweb/branches/master';
    const branchAPIresponse = fs.readFileSync(
      path.resolve(__dirname, '__fixtures__/gerrit/branch-info-response.txt'),
    );
    const treeUrl = 'https://gerrit.com/app/web/+/refs/heads/master/';
    const treeUrlGitiles =
      'https://gerrit.com/gitiles/app/web/+/refs/heads/master/';
    const etag = '52432507a70b677b5674b019c9a46b2e9f29d0a1';
    const sha = 'f775f9119c313c7ffc890d7908a45997273434d5';
    const mkdocsContent = 'a repo fetched using git clone';
    const mdContent = 'doc';
    const repoArchiveBuffer = fs.readFileSync(
      path.resolve(__dirname, '__fixtures__/gerrit/gerrit-master.tar.gz'),
    );
    const repoArchiveDocsBuffer = fs.readFileSync(
      path.resolve(__dirname, '__fixtures__/gerrit/gerrit-master-docs.tar.gz'),
    );

    beforeEach(async () => {
      mockDir.setContent({
        'repo/mkdocs.yml': mkdocsContent,
        'repo/docs/first.md': mdContent,
      });
      const spy = jest.spyOn(fs, 'mkdtemp');
      spy.mockImplementation(() => mockDir.path);

      worker.use(
        rest.get(
          'https://gerrit.com/gitiles/app/web/\\+archive/refs/heads/master.tar.gz',
          (_, res, ctx) =>
            res(
              ctx.status(200),
              ctx.set('Content-Type', 'application/x-gzip'),
              ctx.set(
                'content-disposition',
                'attachment; filename=web-refs/heads/master.tar.gz',
              ),
              ctx.body(repoArchiveBuffer),
            ),
        ),
        rest.get(
          'https://gerrit.com/gitiles/app/web/\\+archive/refs/heads/master/docs.tar.gz',
          (_, res, ctx) =>
            res(
              ctx.status(200),
              ctx.set('Content-Type', 'application/x-gzip'),
              ctx.set(
                'content-disposition',
                'attachment; filename=web-refs/heads/master-docs.tar.gz',
              ),
              ctx.body(repoArchiveDocsBuffer),
            ),
        ),
        rest.get(
          `https://gerrit.com/gitiles/app/web/\\+archive/${sha}.tar.gz`,
          (_, res, ctx) =>
            res(
              ctx.status(200),
              ctx.set('Content-Type', 'application/x-gzip'),
              ctx.set(
                'content-disposition',
                'attachment; filename=web-refs/heads/master.tar.gz',
              ),
              ctx.body(repoArchiveBuffer),
            ),
        ),
      );
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('reads the wanted files correctly using gitiles.', async () => {
      worker.use(
        rest.get(branchAPIUrl, (_, res, ctx) => {
          return res(ctx.status(200), ctx.body(branchAPIresponse));
        }),
      );

      const response = await gerritProcessorWithGitiles.readTree(
        treeUrlGitiles,
      );

      expect(response.etag).toBe(etag);

      const files = await response.files();
      expect(files.length).toBe(2);

      const docsYaml = await files[0].content();
      expect(docsYaml.toString()).toBe('# Test\n');

      const mdFile = await files[1].content();
      expect(mdFile.toString()).toBe('site_name: Test\n');
    });

    it('throws NotModifiedError for matching etags.', async () => {
      worker.use(
        rest.get(branchAPIUrl, (_, res, ctx) => {
          return res(ctx.status(200), ctx.body(branchAPIresponse));
        }),
      );

      await expect(gerritProcessor.readTree(treeUrl, { etag })).rejects.toThrow(
        NotModifiedError,
      );
    });

    it('throws ResponseError if branch info not found.', async () => {
      worker.use(
        rest.get(branchAPIUrl, (_, res, ctx) => {
          return res(ctx.status(404, 'Not found.'));
        }),
      );

      await expect(
        gerritProcessor.readTree(treeUrl),
      ).rejects.toMatchInlineSnapshot(
        `[ResponseError: Request failed with 404 Not found.]`,
      );
    });

    it('should throw on failures while getting branch info.', async () => {
      worker.use(
        rest.get(branchAPIUrl, (_, res, ctx) => {
          return res(ctx.status(500, 'Error'));
        }),
      );

      await expect(gerritProcessor.readTree(treeUrl)).rejects.toThrow(Error);
    });

    it('should returns wanted files with a subpath using gitiles', async () => {
      worker.use(
        rest.get(branchAPIUrl, (_, res, ctx) => {
          return res(ctx.status(200), ctx.body(branchAPIresponse));
        }),
      );

      const response = await gerritProcessorWithGitiles.readTree(
        `${treeUrlGitiles}/docs`,
      );

      expect(response.etag).toBe(etag);

      const files = await response.files();
      expect(files.length).toBe(1);

      const mdFile = await files[0].content();
      expect(mdFile.toString()).toBe('# Test\n');
    });
    it('throws NotModifiedError for a known commit.', async () => {
      const shaTreeUrl = `https://gerrit.com/app/web/+/${sha}/`;

      await expect(
        gerritProcessor.readTree(shaTreeUrl, { etag: sha }),
      ).rejects.toThrow(NotModifiedError);
    });
    it('can fetch files for a specifc sha.', async () => {
      const response = await gerritProcessorWithGitiles.readTree(
        `https://gerrit.com/gitiles/app/web/+/${sha}/`,
      );

      expect(response.etag).toBe(sha);
    });
  });

  describe('search', () => {
    const responseBuffer = Buffer.from('Apache License');
    const branchAPIUrl =
      'https://gerrit.com/projects/app%2Fweb/branches/master';
    const branchAPIresponse = fs.readFileSync(
      path.resolve(__dirname, '__fixtures__/gerrit/branch-info-response.txt'),
    );
    const searchUrl =
      'https://gerrit.com/gitiles/app/web/+/refs/heads/master/**/catalog-info.yaml';
    const etag = '52432507a70b677b5674b019c9a46b2e9f29d0a1';
    const treeRecursiveResponse = fs.readFileSync(
      path.resolve(
        __dirname,
        '__fixtures__/gerrit/tree-recursive-response.txt',
      ),
    );

    beforeEach(async () => {
      worker.use(
        rest.get(
          'https://gerrit.com/projects/app%2Fweb/branches/master/files/catalog-info.yaml/content',
          (_, res, ctx) => {
            return res(
              ctx.status(200),
              ctx.body(Buffer.from('Backstage manifest').toString('base64')),
            );
          },
        ),
      );
      worker.use(
        rest.get(
          'https://gerrit.com/gitiles/app/web/\\+/refs/heads/master/',
          (req, res, ctx) => {
            if (
              req.url.searchParams.has('format', 'JSON') &&
              req.url.searchParams.has('recursive')
            ) {
              return res(
                ctx.status(200),
                ctx.set('Content-Type', 'application/json'),
                ctx.set('content-disposition', 'attachment'),
                ctx.body(treeRecursiveResponse),
              );
            }

            return res(ctx.status(404));
          },
        ),
      );
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should return a single file when given an exact URL', async () => {
      worker.use(
        rest.get(
          'https://gerrit.com/projects/web%2Fproject/branches/master/files/LICENSE/content',
          (_, res, ctx) => {
            return res(
              ctx.status(200),
              ctx.body(responseBuffer.toString('base64')),
            );
          },
        ),
      );

      const data = await gerritProcessor.search(
        'https://gerrit.com/web/project/+/refs/heads/master/LICENSE',
      );
      expect(data.etag).toBe('');
      expect(data.files.length).toBe(1);
      expect(data.files[0].url).toBe(
        'https://gerrit.com/web/project/+/refs/heads/master/LICENSE',
      );
      expect((await data.files[0].content()).toString()).toEqual(
        'Apache License',
      );
    });

    it('should return empty list of files for not found files.', async () => {
      worker.use(
        rest.get(
          'https://gerrit.com/projects/web%2Fproject/branches/master/files/LICENSE/content',
          (_, res, ctx) => {
            return res(ctx.status(404, 'File not found.'));
          },
        ),
      );

      const data = await gerritProcessor.search(
        'https://gerrit.com/web/project/+/refs/heads/master/LICENSE',
      );
      expect(data.etag).toBe('');
      expect(data.files.length).toBe(0);
    });

    it('reads the wanted files correctly using gitiles.', async () => {
      worker.use(
        rest.get(branchAPIUrl, (_, res, ctx) => {
          return res(ctx.status(200), ctx.body(branchAPIresponse));
        }),
      );

      const response = await gerritProcessor.search(searchUrl);

      expect(response.etag).toBe(etag);

      expect(response.files.length).toBe(3);

      expect(response.files[0].url).toEqual(
        'https://gerrit.com/gitiles/app/web/+/refs/heads/master/catalog-info.yaml',
      );
      expect(response.files[1].url).toEqual(
        'https://gerrit.com/gitiles/app/web/+/refs/heads/master/microservices/petstore-api/catalog-info.yaml',
      );
      expect(response.files[2].url).toEqual(
        'https://gerrit.com/gitiles/app/web/+/refs/heads/master/microservices/petstore-consumer/catalog-info.yaml',
      );

      const docsYaml = await response.files[0].content();
      expect(docsYaml.toString()).toBe('Backstage manifest');
    });

    it('throws NotModifiedError for matching etags.', async () => {
      worker.use(
        rest.get(branchAPIUrl, (_, res, ctx) => {
          return res(ctx.status(200), ctx.body(branchAPIresponse));
        }),
      );

      await expect(gerritProcessor.search(searchUrl, { etag })).rejects.toThrow(
        NotModifiedError,
      );
    });

    it('should throw on failures while getting branch info.', async () => {
      worker.use(
        rest.get(branchAPIUrl, (_, res, ctx) => {
          return res(ctx.status(500, 'Error'));
        }),
      );

      await expect(gerritProcessor.search(searchUrl)).rejects.toThrow(Error);
    });
  });
});
