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
import request from 'supertest';
import http from 'node:http';
import net, { AddressInfo } from 'node:net';
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

/**
 * Wait for the socket to close. Works because, above, we set connection: close
 */
const waitForSocketClose = () => new Promise(resolve => setTimeout(resolve, 0));

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

    it('responds with cached response', async () => {
      cache.get.mockResolvedValueOnce(getMockHttpResponseFor('xyz'));

      await request(app).get('/static/docs/foo.html').expect(200, 'xyz');

      await waitForSocketClose();
      expect(cache.set).not.toHaveBeenCalled();
    });

    it('checks cache for head requests', async () => {
      cache.get.mockResolvedValueOnce(getMockHttpResponseFor('xyz'));

      await request(app).head('/static/docs/foo.html').expect(200);

      await waitForSocketClose();
      expect(cache.set).not.toHaveBeenCalled();
    });

    it('sets cache when content is cacheable', async () => {
      const expectedPath = 'default/api/xyz/index.html';
      await request(app)
        .get(`/static/docs/${expectedPath}`)
        .expect(200, 'default-response');

      await waitForSocketClose();
      expect(cache.set).toHaveBeenCalled();

      const [actualPath, actualBuffer] = (cache.set as jest.Mock).mock.calls[0];
      expect(actualPath).toBe(expectedPath);
      expect(actualBuffer.toString()).toContain('default-response');
    });

    it('does not set cache on error', async () => {
      await request(app).get('/static/docs/error.png').expect(500);

      await waitForSocketClose();
      expect(cache.set).not.toHaveBeenCalled();
    });

    it('does not set cache on head requests', async () => {
      const expectedPath = 'default/api/xyz/index.html';
      await request(app).head(`/static/docs/${expectedPath}`).expect(200);

      await waitForSocketClose();
      expect(cache.set).not.toHaveBeenCalled();
    });

    it('does not leak socket listeners across keep-alive requests', async () => {
      // Reuse a single underlying socket for multiple requests, like a real
      // keep-alive connection would. The middleware must not accumulate
      // listeners (or socket.write monkey-patches) on the shared socket.
      const server = app.listen(0);
      const serverSockets = new Set<net.Socket>();
      server.on('connection', socket => serverSockets.add(socket));
      try {
        const { port } = server.address() as AddressInfo;
        const agent = new http.Agent({ keepAlive: true, maxSockets: 1 });

        for (let i = 0; i < 15; i += 1) {
          // eslint-disable-next-line no-await-in-loop
          await new Promise<void>((resolve, reject) => {
            const req = http.get(
              {
                host: '127.0.0.1',
                port,
                path: `/static/docs/default/api/xyz/index-${i}.html`,
                agent,
              },
              response => {
                response.on('data', () => {});
                response.on('end', () => resolve());
                response.on('error', reject);
              },
            );
            req.on('error', reject);
          });
        }

        // All requests should have been served over the same socket, which
        // should not have accumulated 'close' listeners.
        expect(serverSockets.size).toBe(1);
        const [socket] = serverSockets;
        expect(socket.listenerCount('close')).toBeLessThanOrEqual(1);

        agent.destroy();
      } finally {
        await new Promise<void>(resolve => server.close(() => resolve()));
      }
    });
  });
});
