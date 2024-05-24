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
import yauzl, { Entry } from 'yauzl';
import fs from 'fs-extra';
import platformPath from 'path';
import { Readable } from 'stream';
import {
  ReadTreeResponse,
  ReadTreeResponseDirOptions,
  ReadTreeResponseFile,
} from '../types';
import { streamToBuffer } from './util';
import { resolveSafeChildPath } from '@backstage/backend-plugin-api';

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

  private async streamToTemporaryFile(
    stream: Readable,
  ): Promise<{ fileName: string; cleanup: () => Promise<void> }> {
    const tmpDir = await fs.mkdtemp(
      platformPath.join(this.workDir, 'backstage-tmp'),
    );
    const tmpFile = platformPath.join(tmpDir, 'tmp.zip');

    const writeStream = fs.createWriteStream(tmpFile);

    return new Promise((resolve, reject) => {
      writeStream.on('error', reject);
      writeStream.on('finish', () => {
        writeStream.end();
        resolve({
          fileName: tmpFile,
          cleanup: () => fs.rm(tmpDir, { recursive: true }),
        });
      });
      stream.pipe(writeStream);
    });
  }

  private forEveryZipEntry(
    zip: string,
    callback: (entry: Entry, content: Readable) => Promise<void>,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      yauzl.open(zip, { lazyEntries: true }, (err, zipfile) => {
        if (err || !zipfile) {
          reject(err || new Error(`Failed to open zip file ${zip}`));
          return;
        }

        zipfile.on('entry', async (entry: Entry) => {
          // Check that the file is not a directory, and that is matches the filter.
          if (!entry.fileName.endsWith('/') && this.shouldBeIncluded(entry)) {
            zipfile.openReadStream(entry, async (openErr, readStream) => {
              if (openErr || !readStream) {
                reject(
                  openErr ||
                    new Error(`Failed to open zip entry ${entry.fileName}`),
                );
                return;
              }

              await callback(entry, readStream);
              zipfile.readEntry();
            });
          } else {
            zipfile.readEntry();
          }
        });
        zipfile.once('end', () => resolve());
        zipfile.on('error', e => reject(e));
        zipfile.readEntry();
      });
    });
  }

  async files(): Promise<ReadTreeResponseFile[]> {
    this.onlyOnce();
    const files = Array<ReadTreeResponseFile>();
    const temporary = await this.streamToTemporaryFile(this.stream);

    await this.forEveryZipEntry(temporary.fileName, async (entry, content) => {
      files.push({
        path: this.getInnerPath(entry.fileName),
        content: async () => await streamToBuffer(content),
        lastModifiedAt: entry.lastModFileTime
          ? new Date(entry.lastModFileTime)
          : undefined,
      });
    });

    await temporary.cleanup();

    return files;
  }

  async archive(): Promise<Readable> {
    this.onlyOnce();

    if (!this.subPath) {
      return this.stream;
    }

    const archive = archiver('zip');
    const temporary = await this.streamToTemporaryFile(this.stream);

    await this.forEveryZipEntry(temporary.fileName, async (entry, content) => {
      archive.append(await streamToBuffer(content), {
        name: this.getInnerPath(entry.fileName),
      });
    });

    archive.finalize();

    await temporary.cleanup();

    return archive;
  }

  async dir(options?: ReadTreeResponseDirOptions): Promise<string> {
    this.onlyOnce();
    const dir =
      options?.targetDir ??
      (await fs.mkdtemp(platformPath.join(this.workDir, 'backstage-')));

    const temporary = await this.streamToTemporaryFile(this.stream);

    await this.forEveryZipEntry(temporary.fileName, async (entry, content) => {
      const entryPath = this.getInnerPath(entry.fileName);
      const dirname = platformPath.dirname(entryPath);

      if (dirname) {
        await fs.mkdirp(resolveSafeChildPath(dir, dirname));
      }
      return new Promise(async (resolve, reject) => {
        const file = fs.createWriteStream(resolveSafeChildPath(dir, entryPath));
        file.on('finish', resolve);

        content.on('error', reject);
        content.pipe(file);
      });
    });

    await temporary.cleanup();

    return dir;
  }
}
