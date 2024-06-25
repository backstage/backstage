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
import fs from 'fs-extra';
import platformPath from 'path';
import { pipeline as pipelineCb, Readable } from 'stream';
import tar, { Parse, ParseStream, ReadEntry } from 'tar';
import { promisify } from 'util';
import { stripFirstDirectoryFromPath } from './util';

// Tar types for `Parse` is not a proper constructor, but it should be
const TarParseStream = Parse as unknown as { new (): ParseStream };

const pipeline = promisify(pipelineCb);

/**
 * Wraps a tar archive stream into a tree response reader.
 */
export class TarArchiveResponse implements UrlReaderServiceReadTreeResponse {
  private read = false;

  constructor(
    private readonly stream: Readable,
    private readonly subPath: string,
    private readonly workDir: string,
    public readonly etag: string,
    private readonly filter?: (path: string, info: { size: number }) => boolean,
    private readonly stripFirstDirectory: boolean = true,
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
    const parser = new TarParseStream();

    parser.on('entry', (entry: ReadEntry & Readable) => {
      if (entry.type === 'Directory') {
        entry.resume();
        return;
      }

      // File path relative to the root extracted directory. Will remove the
      // top level dir name from the path since its name is hard to predetermine.
      const relativePath = this.stripFirstDirectory
        ? stripFirstDirectoryFromPath(entry.path)
        : entry.path;

      if (this.subPath) {
        if (!relativePath.startsWith(this.subPath)) {
          entry.resume();
          return;
        }
      }

      const path = relativePath.slice(this.subPath.length);
      if (this.filter) {
        if (!this.filter(path, { size: entry.remain })) {
          entry.resume();
          return;
        }
      }

      const content = new Promise<Buffer>(async resolve => {
        await pipeline(entry, concatStream(resolve));
      });

      files.push({
        path,
        content: () => content,
      });

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

  async dir(
    options?: UrlReaderServiceReadTreeResponseDirOptions,
  ): Promise<string> {
    this.onlyOnce();

    const dir =
      options?.targetDir ??
      (await fs.mkdtemp(platformPath.join(this.workDir, 'backstage-')));

    // Equivalent of tar --strip-components=N
    // When no subPath is given, remove just 1 top level directory
    let strip = this.subPath ? this.subPath.split('/').length : 1;
    if (!this.stripFirstDirectory) {
      strip--;
    }

    let filterError: Error | undefined = undefined;
    await pipeline(
      this.stream,
      tar.extract({
        strip,
        cwd: dir,
        filter: (path, stat) => {
          // Filter errors will short-circuit the rest of the filtering and then throw
          if (filterError) {
            return false;
          }

          // File path relative to the root extracted directory. Will remove the
          // top level dir name from the path since its name is hard to predetermine.
          const relativePath = this.stripFirstDirectory
            ? stripFirstDirectoryFromPath(path)
            : path;
          if (this.subPath && !relativePath.startsWith(this.subPath)) {
            return false;
          }
          if (this.filter) {
            const innerPath = path.split('/').slice(strip).join('/');
            try {
              return this.filter(innerPath, { size: stat.size });
            } catch (error) {
              filterError = error;
              return false;
            }
          }
          return true;
        },
      }),
    );

    if (filterError) {
      // If the dir was provided we don't want to remove it, but if it wasn't it means
      // we created a temporary directory and we should remove it.
      if (!options?.targetDir) {
        await fs.remove(dir).catch(() => {});
      }
      throw filterError;
    }

    return dir;
  }
}
