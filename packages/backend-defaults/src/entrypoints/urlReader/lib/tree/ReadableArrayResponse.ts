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

import {
  UrlReaderServiceReadTreeResponse,
  UrlReaderServiceReadTreeResponseDirOptions,
  UrlReaderServiceReadTreeResponseFile,
} from '@backstage/backend-plugin-api';
import concatStream from 'concat-stream';
import platformPath, { dirname } from 'path';
import getRawBody from 'raw-body';
import fs from 'fs-extra';
import { promisify } from 'util';
import tar from 'tar';
import { pipeline as pipelineCb, Readable } from 'stream';
import { FromReadableArrayOptions } from '../types';

const pipeline = promisify(pipelineCb);

/**
 * Wraps a array of Readable objects into a tree response reader.
 */
export class ReadableArrayResponse implements UrlReaderServiceReadTreeResponse {
  private read = false;

  constructor(
    private readonly stream: FromReadableArrayOptions,
    private readonly workDir: string,
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

  async files(): Promise<UrlReaderServiceReadTreeResponseFile[]> {
    this.onlyOnce();

    const files = Array<UrlReaderServiceReadTreeResponseFile>();

    for (let i = 0; i < this.stream.length; i++) {
      if (!this.stream[i].path.endsWith('/')) {
        files.push({
          path: this.stream[i].path,
          content: () => getRawBody(this.stream[i].data),
          lastModifiedAt: this.stream[i]?.lastModifiedAt,
        });
      }
    }

    return files;
  }

  async archive(): Promise<NodeJS.ReadableStream> {
    const tmpDir = await this.dir();

    try {
      const data = await new Promise<Buffer>(async resolve => {
        await pipeline(
          tar.create({ cwd: tmpDir }, ['']),
          concatStream(resolve),
        );
      });
      return Readable.from(data);
    } finally {
      await fs.remove(tmpDir);
    }
  }

  async dir(
    options?: UrlReaderServiceReadTreeResponseDirOptions,
  ): Promise<string> {
    this.onlyOnce();

    const dir =
      options?.targetDir ??
      (await fs.mkdtemp(platformPath.join(this.workDir, 'backstage-')));

    for (let i = 0; i < this.stream.length; i++) {
      if (!this.stream[i].path.endsWith('/')) {
        const filePath = platformPath.join(dir, this.stream[i].path);
        await fs.mkdir(dirname(filePath), { recursive: true });
        await pipeline(this.stream[i].data, fs.createWriteStream(filePath));
      }
    }

    return dir;
  }
}
