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
import { NotFoundError, NotModifiedError } from '@backstage/errors';
import { setupRequestMockHandlers } from '@backstage/test-utils';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { getVoidLogger } from '../logging';
import { FetchUrlReader } from './FetchUrlReader';
import { DefaultReadTreeResponseFactory } from './tree';

const fetchUrlReader = new FetchUrlReader();

describe('FetchUrlReader', () => {
  const worker = setupServer();

  setupRequestMockHandlers(worker);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    worker.use(
      rest.get('https://backstage.io/some-resource', (req, res, ctx) => {
        if (req.headers.get('if-none-match') === 'foo') {
          return res(
            ctx.status(304),
            ctx.set('Content-Type', 'text/plain'),
            ctx.set('etag', 'foo'),
          );
        }

        return res(
          ctx.status(200),
          ctx.set('Content-Type', 'text/plain'),
          ctx.set('etag', 'foo'),
          ctx.body('content foo'),
        );
      }),
    );

    worker.use(
      rest.get('https://backstage.io/not-exists', (_req, res, ctx) => {
        return res(ctx.status(404));
      }),
    );

    worker.use(
      rest.get('https://backstage.io/error', (_req, res, ctx) => {
        return res(ctx.status(500), ctx.body('An internal error occured'));
      }),
    );
  });

  it('factory should create a single entry with a predicate that matches config', async () => {
    const entries = FetchUrlReader.factory({
      config: new ConfigReader({
        backend: {
          reading: {
            allow: [
              { host: 'example.com' },
              { host: 'example.com:700' },
              { host: '*.examples.org' },
              { host: '*.examples.org:700' },
            ],
          },
        },
      }),
      logger: getVoidLogger(),
      treeResponseFactory: DefaultReadTreeResponseFactory.create({
        config: new ConfigReader({}),
      }),
    });

    expect(entries.length).toBe(1);
    const [{ predicate }] = entries;

    expect(predicate(new URL('https://example.com/test'))).toBe(true);
    expect(predicate(new URL('https://a.example.com/test'))).toBe(false);
    expect(predicate(new URL('https://example.com:600/test'))).toBe(false);
    expect(predicate(new URL('https://a.example.com:600/test'))).toBe(false);
    expect(predicate(new URL('https://example.com:700/test'))).toBe(true);
    expect(predicate(new URL('https://a.example.com:700/test'))).toBe(false);
    expect(predicate(new URL('https://other.com/test'))).toBe(false);
    expect(predicate(new URL('https://examples.org/test'))).toBe(false);
    expect(predicate(new URL('https://a.examples.org/test'))).toBe(true);
    expect(predicate(new URL('https://a.b.examples.org/test'))).toBe(true);
    expect(predicate(new URL('https://examples.org:600/test'))).toBe(false);
    expect(predicate(new URL('https://a.examples.org:600/test'))).toBe(false);
    expect(predicate(new URL('https://a.b.examples.org:600/test'))).toBe(false);
    expect(predicate(new URL('https://examples.org:700/test'))).toBe(false);
    expect(predicate(new URL('https://a.examples.org:700/test'))).toBe(true);
    expect(predicate(new URL('https://a.b.examples.org:700/test'))).toBe(true);
  });

  describe('read', () => {
    it('should return etag from the response', async () => {
      const buffer = await fetchUrlReader.read(
        'https://backstage.io/some-resource',
      );
      expect(buffer.toString()).toBe('content foo');
    });

    it('should throw NotFound if server responds with 404', async () => {
      await expect(
        fetchUrlReader.read('https://backstage.io/not-exists'),
      ).rejects.toThrow(NotFoundError);
    });

    it('should throw Error if server responds with 500', async () => {
      await expect(
        fetchUrlReader.read('https://backstage.io/error'),
      ).rejects.toThrow(Error);
    });
  });

  describe('readUrl', () => {
    it('should throw NotModified if server responds with 304', async () => {
      await expect(
        fetchUrlReader.readUrl('https://backstage.io/some-resource', {
          etag: 'foo',
        }),
      ).rejects.toThrow(NotModifiedError);
    });

    it('should return etag from the response', async () => {
      const response = await fetchUrlReader.readUrl(
        'https://backstage.io/some-resource',
      );
      expect(response.etag).toBe('foo');
      expect((await response.buffer()).toString()).toEqual('content foo');
    });

    it('should throw NotFound if server responds with 404', async () => {
      await expect(
        fetchUrlReader.readUrl('https://backstage.io/not-exists'),
      ).rejects.toThrow(NotFoundError);
    });

    it('should throw Error if server responds with 500', async () => {
      await expect(
        fetchUrlReader.readUrl('https://backstage.io/error'),
      ).rejects.toThrow(Error);
    });
  });
});
