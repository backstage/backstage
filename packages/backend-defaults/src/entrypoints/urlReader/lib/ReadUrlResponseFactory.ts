/*
 * Copyright 2022 The Backstage Authors
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

import { ConflictError } from '@backstage/errors';
import { UrlReaderServiceReadUrlResponse } from '@backstage/backend-plugin-api';
import getRawBody from 'raw-body';
import { Readable } from 'stream';
import { ReadUrlResponseFactoryFromStreamOptions } from './types';
import { parseLastModified, responseToReadable } from './util';

/**
 * Utility class for UrlReader implementations to create valid ReadUrlResponse
 * instances from common response primitives.
 *
 * @public
 */
export class ReadUrlResponseFactory {
  /**
   * Resolves a UrlReaderServiceReadUrlResponse from a Readable stream.
   */
  static async fromReadable(
    stream: Readable,
    options?: ReadUrlResponseFactoryFromStreamOptions,
  ): Promise<UrlReaderServiceReadUrlResponse> {
    // Reference to eventual buffer enables callers to call buffer() multiple
    // times without consequence.
    let buffer: Promise<Buffer>;

    // Prevent "stream is not readable" errors from bubbling up.
    const conflictError = new ConflictError(
      'Cannot use buffer() and stream() from the same ReadUrlResponse',
    );
    let hasCalledStream = false;
    let hasCalledBuffer = false;

    return {
      buffer: () => {
        hasCalledBuffer = true;
        if (hasCalledStream) throw conflictError;
        if (buffer) return buffer;
        buffer = getRawBody(stream);
        return buffer;
      },
      stream: () => {
        hasCalledStream = true;
        if (hasCalledBuffer) throw conflictError;
        return stream;
      },
      etag: options?.etag,
      lastModifiedAt: options?.lastModifiedAt,
    };
  }

  /**
   * Resolves a UrlReaderServiceReadUrlResponse from an old-style NodeJS.ReadableStream.
   */
  static async fromNodeJSReadable(
    oldStyleStream: NodeJS.ReadableStream,
    options?: ReadUrlResponseFactoryFromStreamOptions,
  ): Promise<UrlReaderServiceReadUrlResponse> {
    const readable = Readable.from(oldStyleStream);
    return ReadUrlResponseFactory.fromReadable(readable, options);
  }

  /**
   * Resolves a UrlReaderServiceReadUrlResponse from a native fetch response body.
   */
  static async fromResponse(
    response: Response,
  ): Promise<UrlReaderServiceReadUrlResponse> {
    const etag = response.headers.get('etag') || undefined;
    const lastModifiedAt = parseLastModified(
      response.headers.get('last-modified'),
    );

    return ReadUrlResponseFactory.fromReadable(responseToReadable(response), {
      etag,
      lastModifiedAt,
    });
  }
}
