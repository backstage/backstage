/*
 * Copyright 2021 The Backstage Authors
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

import express from 'express';
import compression from 'compression';
import http from 'node:http';
import net, { AddressInfo } from 'node:net';
import request from 'supertest';
import { createCacheMiddleware } from './cacheMiddleware';
import { TechDocsCache } from './TechDocsCache';
import { mockServices } from '@backstage/backend-test-utils';

/**
 * Mocks cached HTTP response.
 */
const getMockHttpResponseFor = (content: string): Buffer => {
  return Buffer.from(
    [
      'HTTP/1.1 200 OK',
      'Content-Type: text/plain; charset=utf-8',
      'Accept-Ranges: bytes',
      'Cache-Control: public, max-age=0',
      'Last-Modified: Sat, 1 Jul 2021 12:00:00 GMT',
      'Date: Sat, 1 Jul 2021 12:00:00 GMT',
      'Connection: close',
      `Content-Length: ${content.length}`,
      '',
      content,
    ].join('\r\n'),
  );
};

const waitForCacheWrite = () => new Promise(resolve => setTimeout(resolve, 0));

const listen = async (app: express.Express) => {
  const server = http.createServer(app);
  await new Promise<void>((resolve, reject) => {
    server.listen(0, '127.0.0.1', resolve);
    server.once('error', reject);
  });
  return server;
};

const sendRawRequests = async (server: http.Server, requests: string[]) => {
  const { port } = server.address() as AddressInfo;
  return new Promise<string>((resolve, reject) => {
    const chunks: Buffer[] = [];
    const socket = net.connect({ host: '127.0.0.1', port }, () => {
      socket.write(`${requests.join('\r\n\r\n')}\r\n\r\n`);
    });
    socket.on('data', chunk => chunks.push(chunk));
    socket.on('end', () => resolve(Buffer.concat(chunks).toString()));
    socket.on('error', reject);
  });
};

describe('createCacheMiddleware', () => {
  let cache: jest.Mocked<TechDocsCache>;
  let app: express.Express;

  beforeEach(async () => {
    cache = {
      get: jest.fn().mockResolvedValue(undefined),
      set: jest.fn().mockResolvedValue(undefined),
      invalidate: jest.fn().mockResolvedValue(undefined),
      invalidateMultiple: jest.fn().mockResolvedValue(undefined),
    } as unknown as jest.Mocked<TechDocsCache>;
    const router = await createCacheMiddleware({
      logger: mockServices.logger.mock(),
      cache,
    });
    app = express().use(router);
    app.use((req, res, next) => {
      // By default, send cacheable content.
      if (req.path !== '/static/docs/error.png') {
        res.send('default-response');
      } else {
        next(new Error());
      }
    });
  });

  describe('middleware', () => {
    it('does not apply to non-static/docs paths', async () => {
      await request(app)
        .get('/static/not-docs')
        .expect(200, 'default-response');

      expect(cache.set).not.toHaveBeenCalled();
    });

    it('replaces legacy raw cache entries', async () => {
      cache.get.mockResolvedValueOnce(getMockHttpResponseFor('xyz'));

      await request(app)
        .get('/static/docs/foo.html')
        .expect(200, 'default-response');

      await waitForCacheWrite();
      expect(cache.set).toHaveBeenCalledTimes(1);
    });

    it('serves cached headers without a body for head requests', async () => {
      const entries = new Map<string, Buffer>();
      cache.get.mockImplementation(async path => entries.get(path));
      cache.set.mockImplementation(async (path, value) => {
        entries.set(path, value);
      });

      await request(app)
        .get('/static/docs/foo.html')
        .expect(200, 'default-response');
      await waitForCacheWrite();

      await request(app)
        .head('/static/docs/foo.html')
        .expect('Content-Length', String(Buffer.byteLength('default-response')))
        .expect(response => expect(response.text).toBeUndefined())
        .expect(200);

      expect(cache.set).toHaveBeenCalledTimes(1);
    });

    it('sets cache when content is cacheable', async () => {
      const expectedPath = 'default/api/xyz/index.html';
      await request(app)
        .get(`/static/docs/${expectedPath}`)
        .expect(200, 'default-response');

      await waitForCacheWrite();
      expect(cache.set).toHaveBeenCalled();

      const [actualPath, actualBuffer] = (cache.set as jest.Mock).mock.calls[0];
      expect(actualPath).toBe(expectedPath);
      expect(actualBuffer).toEqual(expect.any(Buffer));
      expect(actualBuffer.toString()).toMatch(/^HTTP\/1\.1 200 OK\r\n/);
      expect(actualBuffer.toString()).toContain(
        '\r\nx-backstage-techdocs-cache-version: 1\r\n',
      );
      expect(actualBuffer.toString().endsWith('\r\n\r\ndefault-response')).toBe(
        true,
      );
    });

    it('serves cached streamed responses with fresh content negotiation', async () => {
      const entries = new Map<string, Buffer>();
      cache.get.mockImplementation(async path => entries.get(path));
      cache.set.mockImplementation(async (path, value) => {
        entries.set(path, value);
      });
      let sourceCalls = 0;
      const router = await createCacheMiddleware({
        logger: mockServices.logger.mock(),
        cache,
      });
      const body = 'cached-body'.repeat(200);
      const cacheApp = express()
        .use(compression())
        .use(router)
        .use((_req, res) => {
          sourceCalls += 1;
          res.status(200).set('X-TechDocs-Test', 'present').type('text/plain');
          res.write(body.slice(0, 1_000));
          res.end(body.slice(1_000));
        });

      await request(cacheApp)
        .get('/static/docs/default/component/example/index.html')
        .set('Accept-Encoding', 'gzip')
        .expect('Content-Encoding', 'gzip')
        .expect(200, body);
      await waitForCacheWrite();

      await request(cacheApp)
        .get('/static/docs/default/component/example/index.html')
        .set('Accept-Encoding', 'identity')
        .expect('X-TechDocs-Test', 'present')
        .expect(res => {
          expect(res.header['content-encoding']).toBeUndefined();
        })
        .expect(200, body);

      expect(sourceCalls).toBe(1);
    });

    it('does not set cache on error', async () => {
      await request(app).get('/static/docs/error.png').expect(500);

      await waitForCacheWrite();
      expect(cache.set).not.toHaveBeenCalled();
    });

    it('does not set cache on head requests', async () => {
      const expectedPath = 'default/api/xyz/index.html';
      await request(app).head(`/static/docs/${expectedPath}`).expect(200);

      await waitForCacheWrite();
      expect(cache.set).not.toHaveBeenCalled();
    });

    it('does not accumulate listeners across keep-alive requests', async () => {
      const server = await listen(app);
      const serverSockets = new Set<net.Socket>();
      server.on('connection', socket => serverSockets.add(socket));
      const agent = new http.Agent({ keepAlive: true, maxSockets: 1 });
      try {
        for (let i = 0; i < 15; i += 1) {
          // eslint-disable-next-line no-await-in-loop
          await new Promise<void>((resolve, reject) => {
            const req = http.get(
              {
                host: '127.0.0.1',
                port: (server.address() as AddressInfo).port,
                path: `/static/docs/default/api/example/index-${i}.html`,
                agent,
              },
              response => {
                response.resume();
                response.on('end', resolve);
                response.on('error', reject);
              },
            );
            req.on('error', reject);
          });
        }

        expect(serverSockets.size).toBe(1);
        const [socket] = serverSockets;
        expect(socket.listenerCount('close')).toBeLessThanOrEqual(1);
      } finally {
        agent.destroy();
        await new Promise<void>(resolve => server.close(() => resolve()));
      }
    });

    it('does not mix pipelined responses into a cache entry', async () => {
      const entries = new Map<string, Buffer>();
      cache.get.mockImplementation(async path => entries.get(path));
      cache.set.mockImplementation(async (path, value) => {
        entries.set(path, value);
      });
      const router = await createCacheMiddleware({
        logger: mockServices.logger.mock(),
        cache,
      });
      const pipelineApp = express()
        .use(router)
        .use((req, res) => {
          if (req.path.startsWith('/static/docs/')) {
            res.send('techdocs-response');
          } else {
            res.send('unrelated-response');
          }
        });
      const server = await listen(pipelineApp);
      try {
        await sendRawRequests(server, [
          'GET /static/docs/default/component/example/index.html HTTP/1.1\r\nHost: 127.0.0.1\r\nConnection: keep-alive',
          'GET /unrelated HTTP/1.1\r\nHost: 127.0.0.1\r\nConnection: close',
        ]);

        const cachedResponse = await sendRawRequests(server, [
          'GET /static/docs/default/component/example/index.html HTTP/1.1\r\nHost: 127.0.0.1\r\nConnection: close',
        ]);

        expect(cachedResponse.match(/HTTP\/1\.1 200/g)).toHaveLength(1);
        expect(cachedResponse).toContain('techdocs-response');
        expect(cachedResponse).not.toContain('unrelated-response');
      } finally {
        await new Promise<void>(resolve => server.close(() => resolve()));
      }
    });
  });
});
