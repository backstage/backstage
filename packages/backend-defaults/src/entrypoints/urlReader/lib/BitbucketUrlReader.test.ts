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
  BitbucketIntegration,
  readBitbucketIntegrationConfig,
} from '@backstage/integration';
import {
  createMockDirectory,
  mockServices,
  registerMswTestHooks,
} from '@backstage/backend-test-utils';
import fs from 'fs-extra';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import path from 'path';
import { NotModifiedError } from '@backstage/errors';
import { BitbucketUrlReader } from './BitbucketUrlReader';
import { DefaultReadTreeResponseFactory } from './tree';
import getRawBody from 'raw-body';
import { UrlReaderServiceReadUrlResponse } from '@backstage/backend-plugin-api';

const logger = mockServices.logger.mock();

describe('BitbucketUrlReader.factory', () => {
  it('only apply integration configs not inherited from bitbucketCloud or bitbucketServer', () => {
    const config = new ConfigReader({
      integrations: {
        bitbucket: [],
        bitbucketCloud: [
          {
            username: 'username',
            appPassword: 'password',
          },
        ],
        bitbucketServer: [
          {
            host: 'bitbucket-server.local',
            token: 'test-token',
          },
        ],
      },
    });
    const treeResponseFactory = DefaultReadTreeResponseFactory.create({
      config: config,
    });

    const tuples = BitbucketUrlReader.factory({
      config,
      logger,
      treeResponseFactory,
    });

    expect(tuples).toHaveLength(0);
  });
});

describe('BitbucketUrlReader', () => {
  const mockDir = createMockDirectory({ mockOsTmpDir: true });

  beforeEach(mockDir.clear);

  const treeResponseFactory = DefaultReadTreeResponseFactory.create({
    config: new ConfigReader({}),
  });

  const bitbucketProcessor = new BitbucketUrlReader(
    new BitbucketIntegration(
      readBitbucketIntegrationConfig(
        new ConfigReader({
          host: 'bitbucket.org',
          apiBaseUrl: 'https://api.bitbucket.org/2.0',
        }),
      ),
    ),
    logger,
    { treeResponseFactory },
  );

  const hostedBitbucketProcessor = new BitbucketUrlReader(
    new BitbucketIntegration(
      readBitbucketIntegrationConfig(
        new ConfigReader({
          host: 'bitbucket.mycompany.net',
          apiBaseUrl: 'https://api.bitbucket.mycompany.net/rest/api/1.0',
        }),
      ),
    ),
    logger,
    { treeResponseFactory },
  );

  const worker = setupServer();
  registerMswTestHooks(worker);

  describe('readUrl', () => {
    it('should be able to readUrl via buffer without ETag', async () => {
      worker.use(
        rest.get(
          'https://api.bitbucket.org/2.0/repositories/backstage-verification/test-template/src/master/template.yaml',
          (req, res, ctx) => {
            expect(req.headers.get('If-None-Match')).toBeNull();
            return res(
              ctx.status(200),
              ctx.body('foo'),
              ctx.set('ETag', 'etag-value'),
            );
          },
        ),
      );

      const result = await bitbucketProcessor.readUrl(
        'https://bitbucket.org/backstage-verification/test-template/src/master/template.yaml',
      );
      const buffer = await result.buffer();
      expect(buffer.toString()).toBe('foo');
    });

    it('should be able to readUrl via stream without ETag', async () => {
      worker.use(
        rest.get(
          'https://api.bitbucket.org/2.0/repositories/backstage-verification/test-template/src/master/template.yaml',
          (req, res, ctx) => {
            expect(req.headers.get('If-None-Match')).toBeNull();
            return res(
              ctx.status(200),
              ctx.body('foo'),
              ctx.set('ETag', 'etag-value'),
            );
          },
        ),
      );

      const result = await bitbucketProcessor.readUrl(
        'https://bitbucket.org/backstage-verification/test-template/src/master/template.yaml',
      );
      const fromStream = await getRawBody(result.stream!());
      expect(fromStream.toString()).toBe('foo');
    });

    it('should be able to readUrl with matching ETag', async () => {
      worker.use(
        rest.get(
          'https://api.bitbucket.org/2.0/repositories/backstage-verification/test-template/src/master/template.yaml',
          (req, res, ctx) => {
            expect(req.headers.get('If-None-Match')).toBe(
              'matching-etag-value',
            );
            return res(ctx.status(304));
          },
        ),
      );

      await expect(
        bitbucketProcessor.readUrl(
          'https://bitbucket.org/backstage-verification/test-template/src/master/template.yaml',
          { etag: 'matching-etag-value' },
        ),
      ).rejects.toThrow(NotModifiedError);
    });

    it('should be able to readUrl without matching ETag', async () => {
      worker.use(
        rest.get(
          'https://api.bitbucket.org/2.0/repositories/backstage-verification/test-template/src/master/template.yaml',
          (req, res, ctx) => {
            expect(req.headers.get('If-None-Match')).toBe(
              'previous-etag-value',
            );
            return res(
              ctx.status(200),
              ctx.body('foo'),
              ctx.set('ETag', 'new-etag-value'),
            );
          },
        ),
      );

      const result = await bitbucketProcessor.readUrl(
        'https://bitbucket.org/backstage-verification/test-template/src/master/template.yaml',
        { etag: 'previous-etag-value' },
      );
      const buffer = await result.buffer();
      expect(buffer.toString()).toBe('foo');
      expect(result.etag).toBe('new-etag-value');
    });

    it('should be able to readUrl via buffer without If-Modified-Since', async () => {
      worker.use(
        rest.get(
          'https://api.bitbucket.org/2.0/repositories/backstage-verification/test-template/src/master/template.yaml',
          (req, res, ctx) => {
            expect(req.headers.get('If-None-Match')).toBeNull();
            return res(
              ctx.status(200),
              ctx.body('foo'),
              ctx.set('ETag', 'etag-value'),
              ctx.set(
                'Last-Modified',
                new Date('2020-01-01T00:00:00Z').toUTCString(),
              ),
            );
          },
        ),
      );

      const result = await bitbucketProcessor.readUrl(
        'https://bitbucket.org/backstage-verification/test-template/src/master/template.yaml',
      );
      const buffer = await result.buffer();
      expect(result.lastModifiedAt).toEqual(new Date('2020-01-01T00:00:00Z'));
      expect(buffer.toString()).toBe('foo');
    });

    it('should be throw not modified when If-Modified-Since returns a 304', async () => {
      worker.use(
        rest.get(
          'https://api.bitbucket.org/2.0/repositories/backstage-verification/test-template/src/master/template.yaml',
          (req, res, ctx) => {
            expect(req.headers.get('If-Modified-Since')).toBe(
              new Date('1999 12 31 23:59:59 GMT').toUTCString(),
            );
            return res(ctx.status(304));
          },
        ),
      );

      await expect(
        bitbucketProcessor.readUrl(
          'https://bitbucket.org/backstage-verification/test-template/src/master/template.yaml',
          { lastModifiedAfter: new Date('1999 12 31 23:59:59 GMT') },
        ),
      ).rejects.toThrow(NotModifiedError);
    });

    it('should be able to readUrl when If-Modified-Since is before Last-Modified', async () => {
      worker.use(
        rest.get(
          'https://api.bitbucket.org/2.0/repositories/backstage-verification/test-template/src/master/template.yaml',
          (req, res, ctx) => {
            expect(req.headers.get('If-Modified-Since')).toBe(
              new Date('1999 12 31 23:59:59 GMT').toUTCString(),
            );
            return res(
              ctx.status(200),
              ctx.set(
                'Last-Modified',
                new Date('2020-01-01T00:00:00Z').toUTCString(),
              ),
              ctx.body('foo'),
            );
          },
        ),
      );

      const result = await bitbucketProcessor.readUrl(
        'https://bitbucket.org/backstage-verification/test-template/src/master/template.yaml',
        { lastModifiedAfter: new Date('1999 12 31 23:59:59 GMT') },
      );
      const buffer = await result.buffer();
      expect(buffer.toString()).toBe('foo');
      expect(result.lastModifiedAt).toEqual(new Date('2020-01-01T00:00:00Z'));
    });
  });

  describe('read', () => {
    it('rejects unknown targets', async () => {
      await expect(
        bitbucketProcessor.read('https://not.bitbucket.com/apa'),
      ).rejects.toThrow(
        'Incorrect URL: https://not.bitbucket.com/apa, Error: Invalid Bitbucket URL or file path',
      );
    });
  });

  describe('readTree', () => {
    const repoBuffer = fs.readFileSync(
      path.resolve(
        __dirname,
        '__fixtures__/bitbucket-repo-with-commit-hash.tar.gz',
      ),
    );

    const privateBitbucketRepoBuffer = fs.readFileSync(
      path.resolve(__dirname, '__fixtures__/bitbucket-server-repo.tar.gz'),
    );

    beforeEach(() => {
      worker.use(
        rest.get(
          'https://api.bitbucket.org/2.0/repositories/backstage/mock',
          (_, res, ctx) =>
            res(
              ctx.status(200),
              ctx.json({
                mainbranch: {
                  type: 'branch',
                  name: 'master',
                },
              }),
            ),
        ),
        rest.get(
          'https://bitbucket.org/backstage/mock/get/master.tar.gz',
          (_, res, ctx) =>
            res(
              ctx.status(200),
              ctx.set('Content-Type', 'application/zip'),
              ctx.set(
                'content-disposition',
                'attachment; filename=backstage-mock-12ab34cd56ef.tar.gz',
              ),
              ctx.body(repoBuffer),
            ),
        ),
        rest.get(
          'https://api.bitbucket.org/2.0/repositories/backstage/mock/commits/master',
          (_, res, ctx) =>
            res(
              ctx.status(200),
              ctx.json({
                values: [{ hash: '12ab34cd56ef78gh90ij12kl34mn56op78qr90st' }],
              }),
            ),
        ),
        rest.get(
          'https://api.bitbucket.mycompany.net/rest/api/1.0/projects/backstage/repos/mock/archive',
          (_, res, ctx) =>
            res(
              ctx.status(200),
              ctx.set('Content-Type', 'application/zip'),
              ctx.set(
                'content-disposition',
                'attachment; filename=backstage-mock.tgz',
              ),
              ctx.body(privateBitbucketRepoBuffer),
            ),
        ),
        rest.get(
          'https://api.bitbucket.mycompany.net/rest/api/1.0/projects/backstage/repos/mock/commits',
          (_, res, ctx) =>
            res(
              ctx.status(200),
              ctx.json({
                values: [{ id: '12ab34cd56ef78gh90ij12kl34mn56op78qr90st' }],
              }),
            ),
        ),
      );
    });

    it('returns the wanted files from an archive', async () => {
      const response = await bitbucketProcessor.readTree(
        'https://bitbucket.org/backstage/mock/src/master',
      );

      expect(response.etag).toBe('12ab34cd56ef');

      const files = await response.files();

      expect(files.length).toBe(2);
      const mkDocsFile = await files[0].content();
      const indexMarkdownFile = await files[1].content();

      expect(indexMarkdownFile.toString()).toBe('# Test\n');
      expect(mkDocsFile.toString()).toBe('site_name: Test\n');
    });

    it('creates a directory with the wanted files', async () => {
      const response = await bitbucketProcessor.readTree(
        'https://bitbucket.org/backstage/mock',
      );

      const dir = await response.dir({ targetDir: mockDir.path });

      await expect(
        fs.readFile(path.join(dir, 'mkdocs.yml'), 'utf8'),
      ).resolves.toBe('site_name: Test\n');
      await expect(
        fs.readFile(path.join(dir, 'docs', 'index.md'), 'utf8'),
      ).resolves.toBe('# Test\n');
    });

    it('uses private bitbucket host', async () => {
      const response = await hostedBitbucketProcessor.readTree(
        'https://bitbucket.mycompany.net/projects/backstage/repos/mock/browse/docs?at=some-branch',
      );

      expect(response.etag).toBe('12ab34cd56ef');

      const files = await response.files();

      expect(files.length).toBe(1);
      const indexMarkdownFile = await files[0].content();

      expect(indexMarkdownFile.toString()).toBe('# Test\n');
    });

    it('returns the wanted files from an archive with a subpath', async () => {
      const response = await bitbucketProcessor.readTree(
        'https://bitbucket.org/backstage/mock/src/master/docs',
      );

      expect(response.etag).toBe('12ab34cd56ef');

      const files = await response.files();

      expect(files.length).toBe(1);
      const indexMarkdownFile = await files[0].content();

      expect(indexMarkdownFile.toString()).toBe('# Test\n');
    });

    it('creates a directory with the wanted files with a subpath', async () => {
      const response = await bitbucketProcessor.readTree(
        'https://bitbucket.org/backstage/mock/src/master/docs',
      );

      const dir = await response.dir({ targetDir: mockDir.path });

      await expect(
        fs.readFile(path.join(dir, 'index.md'), 'utf8'),
      ).resolves.toBe('# Test\n');
    });

    it('throws a NotModifiedError when given a etag in options', async () => {
      const fnBitbucket = async () => {
        await bitbucketProcessor.readTree(
          'https://bitbucket.org/backstage/mock',
          { etag: '12ab34cd56ef' },
        );
      };

      await expect(fnBitbucket).rejects.toThrow(NotModifiedError);
    });

    it('should not throw a NotModifiedError when given an outdated etag in options', async () => {
      const response = await bitbucketProcessor.readTree(
        'https://bitbucket.org/backstage/mock',
        { etag: 'outdatedetag123abc' },
      );

      expect(response.etag).toBe('12ab34cd56ef');
    });
  });

  describe('search hosted', () => {
    const repoBuffer = fs.readFileSync(
      path.resolve(
        __dirname,
        '__fixtures__/bitbucket-repo-with-commit-hash.tar.gz',
      ),
    );

    beforeEach(() => {
      worker.use(
        rest.get(
          'https://api.bitbucket.org/2.0/repositories/backstage/mock',
          (_, res, ctx) =>
            res(
              ctx.status(200),
              ctx.json({
                mainbranch: {
                  type: 'branch',
                  name: 'master',
                },
              }),
            ),
        ),
        rest.get(
          'https://bitbucket.org/backstage/mock/get/master.tar.gz',
          (_, res, ctx) =>
            res(
              ctx.status(200),
              ctx.set('Content-Type', 'application/zip'),
              ctx.set(
                'content-disposition',
                'attachment; filename=backstage-mock-12ab34cd56ef.tar.gz',
              ),
              ctx.body(repoBuffer),
            ),
        ),
        rest.get(
          'https://api.bitbucket.org/2.0/repositories/backstage/mock/commits/master',
          (_, res, ctx) =>
            res(
              ctx.status(200),
              ctx.json({
                values: [{ hash: '12ab34cd56ef78gh90ij12kl34mn56op78qr90st' }],
              }),
            ),
        ),
      );
    });

    it('works for the naive case', async () => {
      const result = await bitbucketProcessor.search(
        'https://bitbucket.org/backstage/mock/src/master/**/index.*',
      );
      expect(result.etag).toBe('12ab34cd56ef');
      expect(result.files.length).toBe(1);
      expect(result.files[0].url).toBe(
        'https://bitbucket.org/backstage/mock/src/master/docs/index.md',
      );
      await expect(result.files[0].content()).resolves.toEqual(
        Buffer.from('# Test\n'),
      );
    });

    it('works in nested folders', async () => {
      const result = await bitbucketProcessor.search(
        'https://bitbucket.org/backstage/mock/src/master/docs/index.*',
      );
      expect(result.etag).toBe('12ab34cd56ef');
      expect(result.files.length).toBe(1);
      expect(result.files[0].url).toBe(
        'https://bitbucket.org/backstage/mock/src/master/docs/index.md',
      );
      await expect(result.files[0].content()).resolves.toEqual(
        Buffer.from('# Test\n'),
      );
    });

    it('throws NotModifiedError when same etag', async () => {
      await expect(
        bitbucketProcessor.search(
          'https://bitbucket.org/backstage/mock/src/master/**/index.*',
          { etag: '12ab34cd56ef' },
        ),
      ).rejects.toThrow(NotModifiedError);
    });
  });

  describe('search private', () => {
    const privateBitbucketRepoBuffer = fs.readFileSync(
      path.resolve(__dirname, '__fixtures__/bitbucket-server-repo.tar.gz'),
    );

    beforeEach(() => {
      worker.use(
        rest.get(
          'https://api.bitbucket.mycompany.net/rest/api/1.0/projects/backstage/repos/mock/archive',
          (_, res, ctx) =>
            res(
              ctx.status(200),
              ctx.set('Content-Type', 'application/zip'),
              ctx.set(
                'content-disposition',
                'attachment; filename=backstage-mock.tgz',
              ),
              ctx.body(privateBitbucketRepoBuffer),
            ),
        ),
        rest.get(
          'https://api.bitbucket.mycompany.net/rest/api/1.0/projects/backstage/repos/mock/commits',
          (_, res, ctx) =>
            res(
              ctx.status(200),
              ctx.json({
                values: [{ id: '12ab34cd56ef78gh90ij12kl34mn56op78qr90st' }],
              }),
            ),
        ),
      );
    });

    it('works for the naive case', async () => {
      const result = await hostedBitbucketProcessor.search(
        'https://bitbucket.mycompany.net/projects/backstage/repos/mock/browse/**/index.*?at=master',
      );
      expect(result.etag).toBe('12ab34cd56ef');
      expect(result.files.length).toBe(1);
      expect(result.files[0].url).toBe(
        'https://bitbucket.mycompany.net/projects/backstage/repos/mock/browse/docs/index.md?at=master',
      );
      await expect(result.files[0].content()).resolves.toEqual(
        Buffer.from('# Test\n'),
      );
    });

    it('works in nested folders', async () => {
      const result = await hostedBitbucketProcessor.search(
        'https://bitbucket.mycompany.net/projects/backstage/repos/mock/browse/docs/index.*?at=master',
      );
      expect(result.etag).toBe('12ab34cd56ef');
      expect(result.files.length).toBe(1);
      expect(result.files[0].url).toBe(
        'https://bitbucket.mycompany.net/projects/backstage/repos/mock/browse/docs/index.md?at=master',
      );
      await expect(result.files[0].content()).resolves.toEqual(
        Buffer.from('# Test\n'),
      );
    });

    it('throws NotModifiedError when same etag', async () => {
      await expect(
        hostedBitbucketProcessor.search(
          'https://bitbucket.mycompany.net/projects/backstage/repos/mock/browse/**/index.*?at=master',
          { etag: '12ab34cd56ef' },
        ),
      ).rejects.toThrow(NotModifiedError);
    });

    it('should work for exact URLs', async () => {
      hostedBitbucketProcessor.readUrl = jest.fn().mockResolvedValue({
        buffer: async () => Buffer.from('content'),
        etag: 'etag',
      } as UrlReaderServiceReadUrlResponse);

      const result = await hostedBitbucketProcessor.search(
        'https://bitbucket.mycompany.net/projects/backstage/repos/mock/browse/docs/index.md?at=master',
      );
      expect(result.etag).toBe('etag');
      expect(result.files.length).toBe(1);
      expect(result.files[0].url).toBe(
        'https://bitbucket.mycompany.net/projects/backstage/repos/mock/browse/docs/index.md?at=master',
      );
      expect((await result.files[0].content()).toString()).toEqual('content');
    });
  });
});
