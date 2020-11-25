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

import tar, { Parse, ParseStream, ReadEntry } from 'tar';
import path from 'path';
import fs from 'fs-extra';
import { Readable, pipeline as pipelineCb } from 'stream';
import { promisify } from 'util';
import concatStream from 'concat-stream';
import {
  ReadTreeResponse,
  ReadTreeResponseFile,
  ReadTreeResponseDirOptions,
} from '../types';

// Tar types for `Parse` is not a proper constructor, but it should be
const TarParseStream = (Parse as unknown) as { new (): ParseStream };

const pipeline = promisify(pipelineCb);

/**
 * Wraps a tar archive stream into a tree response reader.
 */
export class TarArchiveResponse implements ReadTreeResponse {
  private read = false;

  constructor(
    private readonly stream: Readable,
    private readonly subPath: string,
    private readonly workDir: string,
    private readonly filter?: (path: string) => boolean,
  ) {
    if (subPath) {
      if (!subPath.endsWith('/')) {
        this.subPath += '/';
      }
      if (subPath.startsWith('/')) {
        throw new TypeError(
          `TarArchiveResponse subPath must not start with a /, got '${subPath}'`,
        );
      }
    }
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
    const parser = new TarParseStream();

    parser.on('entry', (entry: ReadEntry & Readable) => {
      if (entry.type === 'Directory') {
        entry.resume();
        return;
      }

      if (this.subPath) {
        if (!entry.path.startsWith(this.subPath)) {
          entry.resume();
          return;
        }
      }

      const path = entry.path.slice(this.subPath.length);
      if (this.filter) {
        if (!this.filter(path)) {
          entry.resume();
          return;
        }
      }

      const content = new Promise<Buffer>(async resolve => {
        await pipeline(entry, concatStream(resolve));
      });

      files.push({ path, content: () => content });

      entry.resume();
    });

    await pipeline(this.stream, parser);

    return files;
  }

  async archive(): Promise<Readable> {
    if (!this.subPath) {
      this.onlyOnce();

      return this.stream;
    }

    // TODO(Rugvip): method for repacking a tar with a subpath is to simply extract into a
    //               tmp dir and recreate the archive. Would be nicer to stream things instead.
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

  async dir(options?: ReadTreeResponseDirOptions): Promise<string> {
    this.onlyOnce();

    const dir =
      options?.targetDir ??
      (await fs.mkdtemp(path.join(this.workDir, 'backstage-')));

    const strip = this.subPath ? this.subPath.split('/').length - 1 : 0;

    await pipeline(
      this.stream,
      tar.extract({
        strip,
        cwd: dir,
        filter: path => {
          if (this.subPath && !path.startsWith(this.subPath)) {
            return false;
          }
          if (this.filter) {
            const innerPath = path.split('/').slice(strip).join('/');
            return this.filter(innerPath);
          }
          return true;
        },
      }),
    );

    return dir;
  }
}
