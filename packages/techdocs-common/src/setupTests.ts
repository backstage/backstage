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

import os from 'os';
import path from 'path';
import fs from 'fs-extra';

const rootDir: string = os.platform() === 'win32' ? 'C:\\rootDir' : '/rootDir';

const encoding = 'utf8';

class StorageFilesMock implements IStorageFilesMock {
  private files: Record<string, string>;

  constructor() {
    this.files = {};
  }

  public emptyFiles(): void {
    this.files = {};
  }

  public fileExists(targetPath: string): boolean {
    const filePath = path.join(rootDir, targetPath);
    const posixPath = filePath.split(path.posix.sep).join(path.sep);
    return this.files[posixPath] !== undefined;
  }

  public readFile(targetPath: string): Buffer {
    const filePath = path.join(rootDir, targetPath);
    return Buffer.from(this.files[filePath] ?? '', encoding);
  }

  public writeFile(targetPath: string, sourcePath: string): void;
  public writeFile(targetPath: string, sourceBuffer: Buffer): void;
  public writeFile(targetPath: string, source: string | Buffer): void {
    const filePath = path.join(rootDir, targetPath);
    if (typeof source === 'string') {
      this.files[filePath] = fs.readFileSync(source).toString(encoding);
    } else {
      this.files[filePath] = source.toString(encoding);
    }
  }
}

global.rootDir = rootDir;
global.storageFilesMock = new StorageFilesMock();
