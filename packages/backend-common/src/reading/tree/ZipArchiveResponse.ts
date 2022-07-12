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

import archiver from 'archiver';
import unzipper2, { Entry } from 'yauzl';
import fs from 'fs-extra';
import platformPath from 'path';
import { Readable } from 'stream';
// import unzipper, { Entry } from 'unzipper';
import {
  ReadTreeResponse,
  ReadTreeResponseDirOptions,
  ReadTreeResponseFile,
} from '../types';

const streamToBuffer = async (stream: Readable): Promise<Buffer> => {
  const buffers: Buffer[] = [];
  return new Promise((resolve, reject) => {
    stream.on('data', (data: Buffer) => buffers.push(data));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(buffers)));
  });
};
/**
 * Wraps a zip archive stream into a tree response reader.
 */
export class ZipArchiveResponse implements ReadTreeResponse {
  private read = false;

  constructor(
    private readonly stream: Readable,
    private readonly subPath: string,
    private readonly workDir: string,
    public readonly etag: string,
    private readonly filter?: (path: string, info: { size: number }) => boolean,
  ) {
    if (subPath) {
      if (!subPath.endsWith('/')) {
        this.subPath += '/';
      }
      if (subPath.startsWith('/')) {
        throw new TypeError(
          `ZipArchiveResponse subPath must not start with a /, got '${subPath}'`,
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

  // File path relative to the root extracted directory or a sub directory if subpath is set.
  private getInnerPath(path: string): string {
    return path.slice(this.subPath.length);
  }

  private shouldBeIncluded(entry: Entry): boolean {
    if (this.subPath) {
      if (!entry.fileName.startsWith(this.subPath)) {
        return false;
      }
    }
    if (this.filter) {
      return this.filter(this.getInnerPath(entry.fileName), {
        size: entry.uncompressedSize,
      });
    }
    return true;
  }

  async files(): Promise<ReadTreeResponseFile[]> {
    this.onlyOnce();
    const files = Array<ReadTreeResponseFile>();

    const buffer = await streamToBuffer(this.stream);
    return await new Promise((resolve, reject) => {
      unzipper2.fromBuffer(buffer, { lazyEntries: false }, (err, zipfile) => {
        if (err) {
          reject(err);
          return;
        }
        zipfile.on('entry', async (entry: Entry) => {
          // If it's not a directory, and it's included, then grab the contents of the file from the buffer
          if (!/\/$/.test(entry.fileName) && this.shouldBeIncluded(entry)) {
            files.push({
              path: this.getInnerPath(entry.fileName),
              content: () =>
                new Promise<Buffer>((cResolve, cReject) => {
                  zipfile.openReadStream(entry, async (cError, readStream) => {
                    if (cError) {
                      return cReject(cError);
                    }
                    return cResolve(await streamToBuffer(readStream));
                  });
                }),
            });
          }
        });

        zipfile.once('end', () => resolve(files));
      });
    });
  }

  async archive(): Promise<Readable> {
    this.onlyOnce();

    if (!this.subPath) {
      return this.stream;
    }

    const buffer = await streamToBuffer(this.stream);
    const archive = archiver('zip');

    await new Promise<void>((resolve, reject) => {
      unzipper2.fromBuffer(buffer, { lazyEntries: false }, (err, zipfile) => {
        if (err) {
          reject(err);
          return;
        }
        zipfile.on('entry', async (entry: Entry) => {
          // If it's not a directory, and it's included, then grab the contents of the file from the buffer
          if (!/\/$/.test(entry.fileName) && this.shouldBeIncluded(entry)) {
            zipfile.openReadStream(entry, async (err2, readStream) => {
              if (err2) {
                reject(err2);
                return;
              }
              archive.append(await streamToBuffer(readStream), {
                name: this.getInnerPath(entry.fileName),
              });
            });
          }
        });
        zipfile.once('end', () => resolve());
      });
    });

    archive.finalize();

    return archive;
  }

  async dir(options?: ReadTreeResponseDirOptions): Promise<string> {
    this.onlyOnce();
    const dir =
      options?.targetDir ??
      (await fs.mkdtemp(platformPath.join(this.workDir, 'backstage-')));

    const buffer = await streamToBuffer(this.stream);
    return await new Promise<string>((resolve, reject) => {
      unzipper2.fromBuffer(buffer, { lazyEntries: false }, (err, zipfile) => {
        if (err) {
          reject(err);
          return;
        }
        zipfile.on('entry', async (entry: Entry) => {
          // If it's not a directory, and it's included, then grab the contents of the file from the buffer
          if (!/\/$/.test(entry.fileName) && this.shouldBeIncluded(entry)) {
            const entryPath = this.getInnerPath(entry.fileName);
            const dirname = platformPath.dirname(entryPath);

            if (dirname) {
              await fs.mkdirp(platformPath.join(dir, dirname));
            }

            zipfile.openReadStream(entry, async (err2, readStream) => {
              if (err2) {
                reject(err2);
                return;
              }

              readStream.pipe(
                fs.createWriteStream(platformPath.join(dir, entryPath)),
              );
            });
          }
        });
        zipfile.once('end', () => resolve(dir));
      });
    });
  }
}
