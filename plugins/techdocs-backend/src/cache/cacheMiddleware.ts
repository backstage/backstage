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
import type { OutgoingHttpHeader, OutgoingHttpHeaders } from 'node:http';
import { TechDocsCache } from './TechDocsCache';
import { LoggerService } from '@backstage/backend-plugin-api';

type CacheMiddlewareOptions = {
  cache: TechDocsCache;
  logger: LoggerService;
};

type WriteCallback = (err?: Error | null) => void;

type CachedResponse = {
  statusCode: number;
  headers: Record<string, string | string[] | number>;
  body: Buffer;
};

const CACHE_VERSION_HEADER = 'x-backstage-techdocs-cache-version';
const CACHE_VERSION = '1';
const HEADER_SEPARATOR = Buffer.from('\r\n\r\n');

const omittedCachedHeaders = new Set([
  'connection',
  'content-encoding',
  'content-length',
  'date',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailer',
  'transfer-encoding',
  'upgrade',
]);

function serializeCachedResponse(
  statusCode: number,
  headers: Record<string, string | string[] | number>,
  body: Buffer,
): Buffer {
  const headerLines = Object.entries({
    ...headers,
    [CACHE_VERSION_HEADER]: CACHE_VERSION,
    'content-length': body.length,
    connection: 'close',
  }).flatMap(([name, value]) =>
    (Array.isArray(value) ? value : [value]).map(item => `${name}: ${item}`),
  );

  // Keep the entry valid as a raw HTTP response so that old instances can
  // safely serve entries written by new instances during a rolling update.
  return Buffer.concat([
    Buffer.from(
      `HTTP/1.1 ${statusCode} OK\r\n${headerLines.join('\r\n')}`,
      'latin1',
    ),
    HEADER_SEPARATOR,
    body,
  ]);
}

function deserializeCachedResponse(
  data: Buffer | undefined,
): CachedResponse | undefined {
  if (!data) {
    return undefined;
  }

  try {
    const headersEnd = data.indexOf(HEADER_SEPARATOR);
    if (headersEnd === -1) {
      return undefined;
    }

    const [statusLine, ...headerLines] = data
      .toString('latin1', 0, headersEnd)
      .split('\r\n');
    if (statusLine !== 'HTTP/1.1 200 OK') {
      return undefined;
    }

    const headers: Record<string, string | string[] | number> = {};
    for (const line of headerLines) {
      const separator = line.indexOf(':');
      if (separator <= 0) {
        return undefined;
      }
      const name = line.slice(0, separator).trim().toLowerCase();
      const value = line.slice(separator + 1).trim();
      const existing = headers[name];
      if (existing === undefined) {
        headers[name] = value;
      } else if (Array.isArray(existing)) {
        headers[name] = [...existing, value];
      } else {
        headers[name] = [String(existing), value];
      }
    }

    if (headers[CACHE_VERSION_HEADER] !== CACHE_VERSION) {
      return undefined;
    }
    delete headers[CACHE_VERSION_HEADER];

    const body = data.subarray(headersEnd + HEADER_SEPARATOR.length);
    if (headers['content-length'] !== String(body.length)) {
      return undefined;
    }
    delete headers['content-length'];
    delete headers.connection;

    return {
      statusCode: 200,
      headers,
      body,
    };
  } catch {
    return undefined;
  }
}

function getCacheableHeaders(
  headers: OutgoingHttpHeaders,
): Record<string, string | string[] | number> {
  return Object.fromEntries(
    Object.entries(headers).filter(
      (entry): entry is [string, string | string[] | number] =>
        entry[1] !== undefined &&
        !omittedCachedHeaders.has(entry[0].toLowerCase()),
    ),
  );
}

function captureWriteHeadHeaders(
  target: OutgoingHttpHeaders,
  headers: OutgoingHttpHeaders | OutgoingHttpHeader[] | undefined,
) {
  if (!headers) {
    return;
  }

  if (!Array.isArray(headers)) {
    for (const [name, value] of Object.entries(headers)) {
      target[name.toLowerCase()] = value;
    }
    return;
  }

  for (let i = 0; i < headers.length; i += 2) {
    const name = headers[i];
    const value = headers[i + 1];
    if (typeof name !== 'string' || value === undefined) {
      continue;
    }

    const normalizedName = name.toLowerCase();
    const existing = target[normalizedName];
    if (existing === undefined) {
      target[normalizedName] = value;
    } else {
      target[normalizedName] = [
        ...(Array.isArray(existing) ? existing : [String(existing)]),
        ...(Array.isArray(value) ? value : [String(value)]),
      ];
    }
  }
}

function captureChunk(
  chunks: Buffer[],
  chunk: string | Uint8Array | undefined,
  encoding?: BufferEncoding | WriteCallback,
) {
  if (chunk === undefined) {
    return;
  }
  chunks.push(
    typeof chunk === 'string'
      ? Buffer.from(chunk, typeof encoding === 'string' ? encoding : undefined)
      : Buffer.from(chunk),
  );
}

export const createCacheMiddleware = ({
  cache,
}: CacheMiddlewareOptions): Router => {
  const cacheMiddleware = router();

  // Middleware that captures responses sent over /static/docs/* and caches
  // them. Subsequent requests are loaded from cache. Cache key is the object's
  // path (after `/static/docs/`).
  cacheMiddleware.use(async (req, res, next) => {
    const isCacheable = req.path.startsWith('/static/docs/');
    const isGetRequest = req.method === 'GET';

    if (!isCacheable) {
      next();
      return;
    }

    const reqPath = decodeURI(req.path.match(/\/static\/docs\/(.*)$/)![1]);
    const cached = deserializeCachedResponse(await cache.get(reqPath));
    if (cached) {
      res.status(cached.statusCode);
      for (const [name, value] of Object.entries(cached.headers)) {
        res.setHeader(name, value);
      }
      res.setHeader('Content-Length', cached.body.length);
      res.end(req.method === 'HEAD' ? undefined : cached.body);
      return;
    }

    if (isGetRequest) {
      const chunks: Buffer[] = [];
      const writeHeadHeaders: OutgoingHttpHeaders = {};
      const realWrite = res.write.bind(res);
      const realEnd = res.end.bind(res);
      const realWriteHead = res.writeHead.bind(res);

      res.writeHead = (
        statusCode: number,
        statusMessageOrHeaders?:
          | string
          | OutgoingHttpHeaders
          | OutgoingHttpHeader[],
        headers?: OutgoingHttpHeaders | OutgoingHttpHeader[],
      ) => {
        let result;
        if (typeof statusMessageOrHeaders === 'string') {
          result = realWriteHead(statusCode, statusMessageOrHeaders, headers);
        } else {
          result = realWriteHead(statusCode, statusMessageOrHeaders);
        }
        captureWriteHeadHeaders(
          writeHeadHeaders,
          typeof statusMessageOrHeaders === 'string'
            ? headers
            : statusMessageOrHeaders,
        );
        return result;
      };

      res.write = (
        chunk: string | Uint8Array,
        encoding?: BufferEncoding | WriteCallback,
        callback?: WriteCallback,
      ) => {
        captureChunk(chunks, chunk, encoding);
        if (typeof encoding === 'function') {
          return realWrite(chunk, encoding);
        }
        if (encoding === undefined) {
          return callback ? realWrite(chunk, callback) : realWrite(chunk);
        }
        return realWrite(chunk, encoding, callback);
      };

      res.end = (
        chunk?: string | Uint8Array | WriteCallback,
        encoding?: BufferEncoding | WriteCallback,
        callback?: WriteCallback,
      ) => {
        if (typeof chunk === 'function') {
          return realEnd(chunk);
        }
        captureChunk(chunks, chunk, encoding);
        if (typeof encoding === 'function') {
          return realEnd(chunk, encoding);
        }
        if (encoding === undefined) {
          return callback ? realEnd(chunk, callback) : realEnd(chunk);
        }
        return realEnd(chunk, encoding, callback);
      };

      res.once('finish', () => {
        if (res.statusCode === 200) {
          void cache.set(
            reqPath,
            serializeCachedResponse(
              res.statusCode,
              getCacheableHeaders({
                ...res.getHeaders(),
                ...writeHeadHeaders,
              }),
              Buffer.concat(chunks),
            ),
          );
        }
      });
    }

    next();
  });

  return cacheMiddleware;
};
