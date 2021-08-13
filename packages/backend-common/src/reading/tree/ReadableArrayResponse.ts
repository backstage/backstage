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

import getRawBody from 'raw-body';
import { Readable } from 'stream';
import { ReadTreeResponse, ReadTreeResponseFile } from '../types';

/**
 * Wraps a array of Readable objects into a tree response reader.
 */
export class ReadableArrayResponse implements ReadTreeResponse {
  private read = false;

  constructor(
    private readonly stream: Readable[],
    public readonly etag: string,
  ) {
    this.etag = etag;
  }

  // Make sure the input stream is only read once
  private onlyOnce() {
    if (this.read) {
      throw new Error('Response has already been read');
    }
    this.read = true;
  }

  async files(): Promise<ReadTreeResponseFile[]> {
    this.onlyOnce();

    const files = Array<ReadTreeResponseFile>();

    for (let i = 0; i < this.stream.length; i++) {
      if (!(this.stream[i] as any).path.endsWith('/')) {
        files.push({
          path: (this.stream[i] as any).path,
          content: () => getRawBody(this.stream[i]),
        });
      }
    }

    return files;
  }

  archive(): Promise<NodeJS.ReadableStream> {
    throw new Error('Method not implemented.');
  }

  dir(): Promise<string> {
    throw new Error('Method not implemented.');
  }
}
