/*
 * Copyright 2023 The Backstage Authors
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
import { JsonObject } from '@backstage/types';
import { getVoidLogger } from '../logging';
import { setupRequestMockHandlers } from '@backstage/backend-test-utils';
import { DefaultReadTreeResponseFactory } from './tree';
import { AzureBlobStorageUrlReader } from './AzureBlobStorageUrlReader';
import { UrlReaderPredicateTuple } from './types';
import { NotFoundError, NotModifiedError } from '@backstage/errors';
import os from 'os';
import mockFs from 'mock-fs';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import getRawBody from 'raw-body';

const tmpDir = os.platform() === 'win32' ? 'C:\\tmp' : '/tmp';

describe('AzureBlobStorageUrlReader', () => {
  const createReader = (config: JsonObject): UrlReaderPredicateTuple[] => {
    return AzureBlobStorageUrlReader.factory({
      config: new ConfigReader(config),
      logger: getVoidLogger(),
      treeResponseFactory: DefaultReadTreeResponseFactory.create({
        config: new ConfigReader({}),
      }),
    });
  };

  beforeEach(() => {
    mockFs({
      [tmpDir]: mockFs.directory(),
    });
  });

  afterEach(() => {
    mockFs.restore();
  });

  const worker = setupServer();
  setupRequestMockHandlers(worker);

  it('does not create a reader without the azureBlobStorage field', () => {
    const entries = createReader({
      integrations: {},
    });
    expect(entries).toHaveLength(0);
  });

  it('creates a reader with credentials correctly configured', () => {
    const entries = createReader({
      integrations: {
        azureBlobStorage: [
          {
            accountName: 'account',
            secretAccessKey: 'private-secret',
          },
        ],
      },
    });
    expect(entries).toHaveLength(1);
  });

  it('creates a reader with toString correctly', () => {
    const entries = createReader({
      integrations: {
        azureBlobStorage: [
          {
            accountName: 'account',
            secretAccessKey: 'private-secret',
          },
        ],
      },
    });
    expect(entries).toHaveLength(1);
    expect(entries[0].reader.toString()).toBe(
      'azureBlobStorage{host=account,authed=true}',
    );
  });

  describe('predicate', () => {
    const readers = createReader({
      integrations: {
        azureBlobStorage: [
          {
            accountName: 'account',
            secretAccessKey: 'private-secret',
          },
        ],
      },
    });
    const predicate = readers[0].predicate;

    it('return true for correct storage host', () => {
      expect(predicate(new URL('https://account.blob.core.windows.net'))).toBe(
        true,
      );
    });
    it('returns true for a url with the full path and the correct host', () => {
      expect(
        predicate(
          new URL(
            'https://account.blob.core.windows.net/container/catalog-info.yaml',
          ),
        ),
      ).toBe(true);
    });

    it('returns false for the wrong hostname under lob.core.windows.net', () => {
      expect(predicate(new URL('https://account2.blob.core.windows.net'))).toBe(
        false,
      );
    });
    it('returns false for a partially correct host', () => {
      expect(predicate(new URL('https://blob.core.windows.net'))).toBe(false);
    });
    it('returns false for a completely different host', () => {
      expect(predicate(new URL('https://a.example.com/test'))).toBe(false);
    });
  });

  describe('readUrl', () => {
    const { reader } = createReader({
      integrations: {
        azureBlobStorage: [
          {
            accountName: 'account',
            secretAccessKey: '?private-secret',
          },
        ],
      },
    })[0];

    it('should be able to readUrl via buffer without ETag', async () => {
      worker.use(
        rest.get(
          'https://account.blob.core.windows.net/container/dir/path/file.txt',
          (req, res, ctx) => {
            expect(req.headers.get('If-None-Match')).toBeNull();
            expect(req.url.searchParams.has('private-secret')).toBe(true);
            return res(
              ctx.status(200),
              ctx.body('foo'),
              ctx.set('ETag', 'etag-value'),
            );
          },
        ),
      );
      const result = await reader.readUrl(
        'https://account.blob.core.windows.net/container/dir/path/file.txt',
      );
      const buffer = await result.buffer();
      expect(buffer.toString()).toBe('foo');
    });

    it('should be able to readUrl via stream without ETag', async () => {
      worker.use(
        rest.get(
          'https://account.blob.core.windows.net/container/dir/path/file.txt',
          (req, res, ctx) => {
            expect(req.headers.get('If-None-Match')).toBeNull();
            expect(req.url.searchParams.has('private-secret')).toBe(true);
            return res(
              ctx.status(200),
              ctx.body('foo'),
              ctx.set('ETag', 'etag-value'),
            );
          },
        ),
      );
      const result = await reader.readUrl(
        'https://account.blob.core.windows.net/container/dir/path/file.txt',
      );
      const fromStream = await getRawBody(result.stream!());
      expect(fromStream.toString()).toBe('foo');
    });

    it('should be able to readUrl without matching ETag', async () => {
      worker.use(
        rest.get(
          'https://account.blob.core.windows.net/container/dir/path/file.txt',
          (req, res, ctx) => {
            expect(req.headers.get('If-None-Match')).toBe(
              'previous-etag-value',
            );
            expect(req.url.searchParams.has('private-secret')).toBe(true);
            return res(
              ctx.status(200),
              ctx.body('foo'),
              ctx.set('ETag', 'new-etag-value'),
            );
          },
        ),
      );

      const result = await reader.readUrl(
        'https://account.blob.core.windows.net/container/dir/path/file.txt',
        { etag: 'previous-etag-value' },
      );
      const buffer = await result.buffer();
      expect(buffer.toString()).toBe('foo');
      expect(result.etag).toBe('new-etag-value');
    });

    it('throws NotModifiedError if read url blob is not modified', async () => {
      worker.use(
        rest.get(
          'https://account.blob.core.windows.net/container/dir/path/file.txt',
          (req, res, ctx) => {
            expect(req.headers.get('If-Modified-Since')).toBe(
              'Thu, 27 Apr 2023 11:51:14 GMT',
            );
            expect(req.url.searchParams.has('private-secret')).toBe(true);
            return res(ctx.status(304));
          },
        ),
      );

      await expect(
        reader.readUrl(
          'https://account.blob.core.windows.net/container/dir/path/file.txt',
          { lastModifiedAfter: new Date('2023 04 27 11:51:14 GMT') },
        ),
      ).rejects.toThrow(NotModifiedError);
    });

    it('should be able to readUrl when If-Modified-Since is before Last-Modified', async () => {
      worker.use(
        rest.get(
          'https://account.blob.core.windows.net/container/dir/path/file.txt',
          (req, res, ctx) => {
            expect(req.headers.get('If-Modified-Since')).toBe(
              'Wed, 26 Apr 2023 11:51:14 GMT',
            );
            expect(req.url.searchParams.has('private-secret')).toBe(true);
            return res(
              ctx.status(200),
              ctx.set('Last-Modified', 'Thu, 27 Apr 2023 11:51:14 GMT'),
              ctx.body('foo'),
            );
          },
        ),
      );

      const result = await reader.readUrl(
        'https://account.blob.core.windows.net/container/dir/path/file.txt',
        { lastModifiedAfter: new Date('2023 04 26 11:51:14 GMT') },
      );
      const buffer = await result.buffer();
      expect(buffer.toString()).toBe('foo');
      expect(result.lastModifiedAt).toEqual(
        new Date('2023-04-27T11:51:14.000Z'),
      );
    });

    it('throws NotFoundError if read url could not be read', async () => {
      worker.use(
        rest.get(
          'https://account.blob.core.windows.net/container/dir/path/file.txt',
          (req, res, ctx) => {
            expect(req.url.searchParams.has('private-secret')).toBe(true);
            return res(ctx.status(404));
          },
        ),
      );
      await expect(
        reader.readUrl(
          'https://account.blob.core.windows.net/container/dir/path/file.txt',
        ),
      ).rejects.toThrow(NotFoundError);
    });

    it('throws Error if read url fails', async () => {
      worker.use(
        rest.get(
          'https://account.blob.core.windows.net/container/dir/path/file.txt',
          (req, res, ctx) => {
            expect(req.url.searchParams.has('private-secret')).toBe(true);
            return res(ctx.status(500));
          },
        ),
      );
      await expect(
        reader.readUrl(
          'https://account.blob.core.windows.net/container/dir/path/file.txt',
        ),
      ).rejects.toThrow(Error);
    });
  });
});
