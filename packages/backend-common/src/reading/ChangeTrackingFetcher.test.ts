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

import { msw } from '@backstage/test-utils';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { NotModifiedError } from '../errors';
import { ChangeTrackingFetcher } from './ChangeTrackingFetcher';

describe('ChangeTrackingFetcher', () => {
  const worker = setupServer();
  msw.setupDefaultHandlers(worker);

  it('issues a regular fetch when no options', async () => {
    worker.use(
      rest.get('http://a.com/', (req, res, ctx) =>
        res(
          ctx.status(200),
          ctx.json({
            url: req.url.toString(),
            headers: req.headers.getAllHeaders(),
          }),
        ),
      ),
    );

    const f = new ChangeTrackingFetcher({ maxAgeMillis: 1000 });

    let response = await f.fetch('http://a.com/');
    let inputs = await response.json();
    expect(response.status).toBe(200);
    expect(inputs.url).toBe('http://a.com/');
    expect(inputs.headers.etag).toBeUndefined();

    response = await f.fetch('http://a.com/');
    inputs = await response.json();
    expect(response.status).toBe(200);
    expect(inputs.url).toBe('http://a.com/');
    expect(inputs.headers.etag).toBeUndefined();
  });

  it('issues a regular fetch first and handle a 304', async () => {
    worker.use(
      rest.get('http://a.com/', (req, res, ctx) => {
        if (!req.headers.has('if-none-match')) {
          return res(
            ctx.status(200),
            ctx.set('ETag', 'blah'),
            ctx.json({
              url: req.url.toString(),
              headers: req.headers.getAllHeaders(),
            }),
          );
        }
        return res(
          ctx.status(304),
          ctx.json({
            url: req.url.toString(),
            headers: req.headers.getAllHeaders(),
          }),
        );
      }),
    );

    const f = new ChangeTrackingFetcher({ maxAgeMillis: 1000000 });

    let response = await f.fetch('http://a.com/', undefined, {
      refetchStrategy: 'if-changed',
    });
    let inputs = await response.json();
    expect(response.status).toBe(200);
    expect(inputs.url).toBe('http://a.com/');
    expect(inputs.headers.etag).toBeUndefined();

    await expect(
      f.fetch('http://a.com/', undefined, {
        refetchStrategy: 'if-changed',
      }),
    ).rejects.toThrow(NotModifiedError);

    await expect(
      f.fetch('http://a.com/', undefined, {
        refetchStrategy: 'if-changed',
      }),
    ).rejects.toThrow(NotModifiedError);

    response = await f.fetch('http://a.com/');
    inputs = await response.json();
    expect(response.status).toBe(200);
    expect(inputs.url).toBe('http://a.com/');
    expect(inputs.headers.etag).toBeUndefined();
  });

  it('merges headers', async () => {
    worker.use(
      rest.get('http://a.com/', (req, res, ctx) =>
        res(
          ctx.status(200),
          ctx.json({
            url: req.url.toString(),
            headers: req.headers.getAllHeaders(),
          }),
        ),
      ),
    );

    const f = new ChangeTrackingFetcher({ maxAgeMillis: 1000 });

    const response = await f.fetch(
      'http://a.com/',
      { headers: { prev: 'v' } },
      {
        refetchStrategy: 'if-changed',
      },
    );
    const inputs = await response.json();
    expect(response.status).toBe(200);
    expect(inputs.url).toBe('http://a.com/');
    expect(inputs.headers.etag).toBeUndefined();
    expect(inputs.headers.prev).toBe('v');
  });
});
