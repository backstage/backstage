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
import getRawBody from 'raw-body';
import { Readable } from 'stream';
import { ReadUrlResponseFactory } from './ReadUrlResponseFactory';

describe('ReadUrlResponseFactory', () => {
  describe("fromReadable's", () => {
    const expectedText = 'expected text';
    let readable: Readable;

    beforeEach(() => {
      readable = Readable.from(expectedText, {
        objectMode: false,
      });
    });

    it('etag is passed through', async () => {
      const expectedEtag = 'xyz';
      const response = await ReadUrlResponseFactory.fromReadable(readable, {
        etag: expectedEtag,
      });
      expect(response.etag).toEqual(expectedEtag);
    });

    it('buffer returns expected data', async () => {
      const response = await ReadUrlResponseFactory.fromReadable(readable);
      const buffer = await response.buffer();
      expect(buffer.toString()).toEqual(expectedText);
    });

    it('buffer can be called multiple times', async () => {
      const response = await ReadUrlResponseFactory.fromReadable(readable);
      const buffer1 = await response.buffer();
      const buffer2 = await response.buffer();
      expect(buffer1.toString()).toEqual(expectedText);
      expect(buffer2.toString()).toEqual(expectedText);
    });

    it('buffer cannot be called after stream is called', async () => {
      const response = await ReadUrlResponseFactory.fromReadable(readable);
      response.stream!();
      expect(() => response.buffer()).toThrow(ConflictError);
    });

    it('stream returns expected data', async () => {
      const response = await ReadUrlResponseFactory.fromReadable(readable);
      const stream = response.stream!();
      const bufferFromStream = await getRawBody(stream);
      expect(bufferFromStream.toString()).toEqual(expectedText);
    });

    it('stream cannot be called after buffer is called', async () => {
      const response = await ReadUrlResponseFactory.fromReadable(readable);
      response.buffer();
      expect(() => response.stream!()).toThrow(ConflictError);
    });
  });

  describe("fromNodeJSReadable's", () => {
    const expectedText = 'expected text';
    let readable: NodeJS.ReadableStream;

    beforeEach(() => {
      readable = Readable.from(Buffer.from(expectedText));
    });

    it('etag is passed through', async () => {
      const expectedEtag = 'xyz';
      const response = await ReadUrlResponseFactory.fromNodeJSReadable(
        readable,
        {
          etag: expectedEtag,
        },
      );
      expect(response.etag).toEqual(expectedEtag);
    });

    it('buffer returns expected data', async () => {
      const response =
        await ReadUrlResponseFactory.fromNodeJSReadable(readable);
      const buffer = await response.buffer();
      expect(buffer.toString()).toEqual(expectedText);
    });

    it('stream returns expected data', async () => {
      const response =
        await ReadUrlResponseFactory.fromNodeJSReadable(readable);
      const stream = response.stream!();
      const bufferFromStream = await getRawBody(stream);
      expect(bufferFromStream.toString()).toEqual(expectedText);
    });
  });
});
