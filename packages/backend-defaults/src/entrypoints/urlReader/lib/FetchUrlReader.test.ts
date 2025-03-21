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
import {
  mockServices,
  registerMswTestHooks,
} from '@backstage/backend-test-utils';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { FetchUrlReader } from './FetchUrlReader';
import { DefaultReadTreeResponseFactory } from './tree';

const fetchUrlReader = new FetchUrlReader();

describe('FetchUrlReader', () => {
  const worker = setupServer();

  registerMswTestHooks(worker);

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

        if (
          req.headers.get('if-modified-since') &&
          new Date(req.headers.get('if-modified-since') ?? '') <
            new Date('2021-01-01T00:00:00Z')
        ) {
          return res(
            ctx.status(304),
            ctx.set('Content-Type', 'text/plain'),
            ctx.set(
              'last-modified',
              new Date('2021-01-01T00:00:00Z').toUTCString(),
            ),
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
        return res(ctx.status(500), ctx.body('An internal error occurred'));
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
              { host: 'example.com:100-200' },
              { host: 'example.com:700' },
              { host: '*.examples.org' },
              { host: '*.examples.org:700' },
              { host: '*.examples.org:900-1000' },
              { host: '*.examples.org:900-1000' },
              { host: 'https.org:443' },
              { host: 'http.org:80' },
              {
                host: 'foobar.org',
                paths: ['/dir1/'],
              },
            ],
          },
        },
      }),
      logger: mockServices.logger.mock(),
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
    expect(predicate(new URL('https://foobar.org/dir1/subpath'))).toBe(true);
    expect(predicate(new URL('https://foobar.org/dir12'))).toBe(false);
    expect(predicate(new URL('https://foobar.org/'))).toBe(false);
    expect(predicate(new URL('https://a.examples.org:900/test'))).toBe(true);
    expect(predicate(new URL('https://a.examples.org:1000/test'))).toBe(true);
    expect(predicate(new URL('https://a.examples.org:950/test'))).toBe(true);
    expect(predicate(new URL('https://a.examples.org:1050/test'))).toBe(false);
    expect(predicate(new URL('https://example.com:150/test'))).toBe(true);
    expect(predicate(new URL('https://example.com:4000/test'))).toBe(false);
    expect(predicate(new URL('https://https.org'))).toBe(true);
    expect(predicate(new URL('http://https.org'))).toBe(false);
    expect(predicate(new URL('http://http.org'))).toBe(true);
    expect(predicate(new URL('https://http.org'))).toBe(false);
  });

  it('factory should throw for malformed uri', async () => {
    const buildFactory = (hosts: string[]) => {
      return FetchUrlReader.factory({
        config: new ConfigReader({
          backend: {
            reading: {
              allow: hosts.map(host => ({ host })),
            },
          },
        }),
        logger: mockServices.logger.mock(),
        treeResponseFactory: DefaultReadTreeResponseFactory.create({
          config: new ConfigReader({}),
        }),
      });
    };
    expect(() =>
      buildFactory(['example.com:100-200', 'example.com:100-']),
    ).toThrow();
    expect(() =>
      buildFactory(['example.com:100-200', 'example.com:-']),
    ).toThrow();
    expect(() =>
      buildFactory(['example.com:100-200', 'example.com:500-']),
    ).toThrow();
    expect(() =>
      buildFactory(['example.com:100-200', 'example.com:100-50']),
    ).toThrow();
    expect(() =>
      buildFactory(['example.com:100-200', 'example.com:-330-']),
    ).toThrow();
    expect(() =>
      buildFactory(['example.com:100-200', 'example.com:-100-300']),
    ).not.toThrow();
    expect(() =>
      buildFactory(['example.com:100-200', 'example.com:nb-300']),
    ).toThrow();
  });

  describe('read', () => {
    it('should return etag from the response', async () => {
      const { buffer } = await fetchUrlReader.readUrl(
        'https://backstage.io/some-resource',
      );
      const response = await buffer();
      expect(response.toString()).toBe('content foo');
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

  describe('readUrl', () => {
    it('should throw NotModified if server responds with 304 from etag', async () => {
      await expect(
        fetchUrlReader.readUrl('https://backstage.io/some-resource', {
          etag: 'foo',
        }),
      ).rejects.toThrow(NotModifiedError);
    });

    it('should throw NotModified if server responds with 304 from lastModifiedAfter', async () => {
      await expect(
        fetchUrlReader.readUrl('https://backstage.io/some-resource', {
          lastModifiedAfter: new Date('2020-01-01T00:00:00Z'),
        }),
      ).rejects.toThrow(NotModifiedError);
    });

    it('should send Authorization header if token is provided', async () => {
      expect.assertions(1);

      worker.use(
        rest.get(
          'https://backstage.io/requires-authentication',
          (req, res, ctx) => {
            expect(req.headers.get('authorization')).toBe('Bearer mytoken');
            return res(ctx.status(200));
          },
        ),
      );

      await fetchUrlReader.readUrl(
        'https://backstage.io/requires-authentication',
        {
          token: 'mytoken',
        },
      );
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

  describe('search', () => {
    it('should return a file', async () => {
      const data = await fetchUrlReader.search(
        `https://backstage.io/some-resource`,
        { etag: 'etag' },
      );
      expect(data.etag).toBe('foo');
      expect(data.files.length).toBe(1);
      expect(data.files[0].url).toBe(`https://backstage.io/some-resource`);
      expect((await data.files[0].content()).toString()).toEqual('content foo');
    });

    it('should return an empty list of file if not found', async () => {
      const data = await fetchUrlReader.search(
        `https://backstage.io/not-exists`,
        { etag: 'etag' },
      );
      expect(data.etag).toBe('');
      expect(data.files.length).toBe(0);
    });

    it('throws if given URL with wildcard', async () => {
      await expect(
        fetchUrlReader.search(`https://backstage.io/some-resource*`, {
          etag: 'etag',
        }),
      ).rejects.toThrow('Unsupported search pattern URL');
    });
  });
});
