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
import { Router } from 'express';
import router from 'express-promise-router';
import { TechDocsCache } from './TechDocsCache';
import { LoggerService } from '@backstage/backend-plugin-api';

type CacheMiddlewareOptions = {
  cache: TechDocsCache;
  logger: LoggerService;
};

type ErrorCallback = (err?: Error) => void;

export const createCacheMiddleware = ({
  cache,
}: CacheMiddlewareOptions): Router => {
  const cacheMiddleware = router();

  // Middleware that, through socket monkey patching, captures responses as
  // they're sent over /static/docs/* and caches them. Subsequent requests are
  // loaded from cache. Cache key is the object's path (after `/static/docs/`).
  cacheMiddleware.use(async (req, res, next) => {
    const socket = res.socket;
    const isCacheable = req.path.startsWith('/static/docs/');
    const isGetRequest = req.method === 'GET';

    // Continue early if this is non-cacheable, or there's no socket.
    if (!isCacheable || !socket) {
      next();
      return;
    }

    // Make concrete references to these things.
    const reqPath = decodeURI(req.path.match(/\/static\/docs\/(.*)$/)![1]);
    const realEnd = socket.end.bind(socket);
    const realWrite = socket.write.bind(socket);
    let writeToCache = true;
    const chunks: Buffer[] = [];

    // Monkey-patch the response's socket to keep track of chunks as they are
    // written over the wire.
    socket.write = (
      data: string | Uint8Array,
      encoding?: BufferEncoding | ErrorCallback,
      callback?: ErrorCallback,
    ) => {
      // This cast is obviously weird, but it covers a type bug in @types/node
      // which does not gracefully handle union types.
      chunks.push(
        typeof data === 'string' ? Buffer.from(data) : Buffer.from(data),
      );
      if (typeof encoding === 'function') {
        return realWrite(data, encoding);
      }
      return realWrite(data, encoding, callback);
    };

    // When a socket is closed, if there were no errors and the data written
    // over the socket should be cached, cache it!
    socket.on('close', async hadError => {
      const content = Buffer.concat(chunks);
      const head = content.toString('utf8', 0, 12);
      if (
        isGetRequest &&
        writeToCache &&
        !hadError &&
        head.match(/HTTP\/\d\.\d 200/)
      ) {
        await cache.set(reqPath, content);
      }
    });

    // Attempt to retrieve data from the cache.
    const cached = await cache.get(reqPath);

    // If there is a cache hit, write it out on the socket, ensure we don't re-
    // cache the data, and prevent going back to canonical storage by never
    // calling next().
    if (cached) {
      writeToCache = false;
      realEnd(cached);
      return;
    }

    // No data retrieved from cache: allow retrieval from canonical storage.
    next();
  });

  return cacheMiddleware;
};
