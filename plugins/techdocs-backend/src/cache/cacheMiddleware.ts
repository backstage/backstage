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
import { Socket } from 'node:net';

type CacheMiddlewareOptions = {
  cache: TechDocsCache;
  logger: LoggerService;
};

type CacheData = {
  chunks: Buffer[];
  writeToCache: boolean;
};

type ErrorCallback = (err?: Error) => void;

export const createCacheMiddleware = ({
  cache,
  logger,
}: CacheMiddlewareOptions): Router => {
  const cacheMiddleware = router();

  // Middleware that, through socket monkey patching, captures responses as
  // they're sent over /static/docs/* and caches them. Subsequent requests are
  // loaded from cache. Cache key is the object's path (after `/static/docs/`).

  const socketDataMap = new WeakMap<Socket, Map<string, CacheData>>();

  cacheMiddleware.use(async (req, res, next) => {
    const socket = res.socket;

    // Make concrete references to these things.
    const isCacheable = req.path.startsWith('/static/docs/');
    const isGetRequest = req.method === 'GET';

    // Continue early if this is non-cacheable, or there's no socket.
    if (!isCacheable || !isGetRequest || !socket) {
      next();
      return;
    }

    const reqPath = decodeURI(req.path.match(/\/static\/docs\/(.*)$/)![1]);
    const realEnd = socket.end.bind(socket);
    const realWrite = socket.write.bind(socket);

    let requestPathDataMap = socketDataMap.get(socket);
    if (!requestPathDataMap) {
      requestPathDataMap = new Map();
      socketDataMap.set(socket, requestPathDataMap);

      socket.on('close', async hadError => {
        if (!requestPathDataMap) return;
        logger.debug(`Closed socket for ${requestPathDataMap.size} paths`);
        for (const [path, { chunks, writeToCache }] of requestPathDataMap) {
          const content = Buffer.concat(chunks);
          const is200Resp = content
            .toString('utf8', 0, 12)
            .match(/HTTP\/\d\.\d 200/);
          if (!hadError && is200Resp && writeToCache) {
            await cache.set(path, content);
          }
        }

        socketDataMap.delete(socket);
      });

      socket.write = (
        chunk: string | Uint8Array,
        encoding?: BufferEncoding | ErrorCallback,
        callback?: ErrorCallback,
      ) => {
        const data = requestPathDataMap?.get(reqPath);
        if (data) data.chunks.push(Buffer.from(chunk));

        if (typeof encoding === 'function') {
          return realWrite(chunk, encoding);
        }
        return realWrite(chunk, encoding, callback);
      };
    }

    const data: CacheData = { chunks: [], writeToCache: true };
    if (requestPathDataMap.has(reqPath)) {
      // If we've already seen this request, remove it from the map. This is
      // to ensure that we don't duplicate the data in the map if multiple
      // requests are made for the same path.
      requestPathDataMap.delete(reqPath);
    }
    requestPathDataMap.set(reqPath, data);

    // Attempt to retrieve data from the cache.
    const cached = await cache.get(reqPath);

    // If there is a cache hit, write it out on the socket, ensure we don't re-
    // cache the data, and prevent going back to canonical storage by never
    // calling next().
    if (cached) {
      logger.debug(`Cache hit for ${reqPath}`);
      data.writeToCache = false;
      realEnd(cached);
      return;
    }

    // No data retrieved from cache: allow retrieval from canonical storage.
    next();
  });

  return cacheMiddleware;
};
