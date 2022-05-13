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

import { setupRequestMockHandlers } from '@backstage/backend-test-utils';
import { ConfigReader } from '@backstage/config';
import { NotModifiedError, NotFoundError } from '@backstage/errors';
import {
  GerritIntegration,
  readGerritIntegrationConfig,
} from '@backstage/integration';
import { JsonObject } from '@backstage/types';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import mockFs from 'mock-fs';
import fs from 'fs-extra';
import path from 'path';
import { getVoidLogger } from '../logging';
import { UrlReaderPredicateTuple } from './types';
import { DefaultReadTreeResponseFactory } from './tree';
import { GerritUrlReader } from './GerritUrlReader';
import getRawBody from 'raw-body';

const treeResponseFactory = DefaultReadTreeResponseFactory.create({
  config: new ConfigReader({}),
});

jest.mock('../scm', () => ({
  Git: {
    fromAuth: () => ({
      clone: jest.fn(() => Promise.resolve({})),
    }),
  },
}));

const gerritProcessor = new GerritUrlReader(
  new GerritIntegration(
    readGerritIntegrationConfig(
      new ConfigReader({
        host: 'gerrit.com',
      }),
    ),
  ),
  { treeResponseFactory },
  '/tmp',
);

const createReader = (config: JsonObject): UrlReaderPredicateTuple[] => {
  return GerritUrlReader.factory({
    config: new ConfigReader(config),
    logger: getVoidLogger(),
    treeResponseFactory,
  });
};

describe('GerritUrlReader', () => {
  const worker = setupServer();
  setupRequestMockHandlers(worker);

  afterAll(() => {
    jest.clearAllMocks();
  });

  describe('reader factory', () => {
    it('creates a reader.', () => {
      const readers = createReader({
        integrations: {
          gerrit: [{ host: 'gerrit.com' }],
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
        gerrit: [{ host: 'gerrit.com' }],
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
    const etag = '52432507a70b677b5674b019c9a46b2e9f29d0a1';
    const mkdocsContent = 'great content';
    const mdContent = 'doc';

    beforeEach(() => {
      mockFs({
        '/tmp/': mockFs.directory(),
        '/tmp/gerrit-clone-123abc/repo/mkdocs.yml': mkdocsContent,
        '/tmp/gerrit-clone-123abc/repo/docs/first.md': mdContent,
      });
      const spy = jest.spyOn(fs, 'mkdtemp');
      spy.mockImplementation(() => '/tmp/gerrit-clone-123abc');
    });

    afterEach(() => {
      mockFs.restore();
      jest.clearAllMocks();
    });

    it('reads the wanted files correctly.', async () => {
      worker.use(
        rest.get(branchAPIUrl, (_, res, ctx) => {
          return res(ctx.status(200), ctx.body(branchAPIresponse));
        }),
      );

      const response = await gerritProcessor.readTree(treeUrl);

      expect(response.etag).toBe(etag);

      const files = await response.files();
      expect(files.length).toBe(2);

      const docsYaml = await files[0].content();
      expect(docsYaml.toString()).toBe(mkdocsContent);

      const mdFile = await files[1].content();
      expect(mdFile.toString()).toBe(mdContent);
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

    it('throws NotFoundError if branch info not found.', async () => {
      worker.use(
        rest.get(branchAPIUrl, (_, res, ctx) => {
          return res(ctx.status(404, 'Not found.'));
        }),
      );

      await expect(gerritProcessor.readTree(treeUrl)).rejects.toThrow(
        NotFoundError,
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

    it('should returns wanted files with a subpath', async () => {
      worker.use(
        rest.get(branchAPIUrl, (_, res, ctx) => {
          return res(ctx.status(200), ctx.body(branchAPIresponse));
        }),
      );

      const response = await gerritProcessor.readTree(`${treeUrl}/docs`);

      expect(response.etag).toBe(etag);

      const files = await response.files();
      expect(files.length).toBe(1);

      const mdFile = await files[0].content();
      expect(mdFile.toString()).toBe(mdContent);
    });
  });
});
