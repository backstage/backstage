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
import { Readable } from 'stream';

const storage = global.storageFilesMock;

class GCSFile {
  private readonly path: string;

  constructor(path: string) {
    this.path = path;
  }

  exists() {
    return new Promise(async (resolve, reject) => {
      if (storage.fileExists(this.path)) {
        resolve([true]);
      } else {
        reject();
      }
    });
  }

  createReadStream() {
    const readable = new Readable();
    readable._read = () => {};

    process.nextTick(() => {
      if (storage.fileExists(this.path)) {
        if (readable.eventNames().includes('pipe')) {
          readable.emit('pipe');
        }
        readable.emit('data', storage.readFile(this.path));
        readable.emit('end');
      } else {
        readable.emit(
          'error',
          new Error(`The file ${this.path} does not exist!`),
        );
      }
    });

    return readable;
  }
}

class Bucket {
  private readonly bucketName;

  constructor(bucketName: string) {
    this.bucketName = bucketName;
  }

  async getMetadata() {
    if (this.bucketName === 'bad_bucket_name') {
      throw Error('Bucket does not exist');
    }
    return '';
  }

  upload(source: string, { destination }) {
    return new Promise(async resolve => {
      storage.writeFile(destination, source);
      resolve(null);
    });
  }

  file(destinationFilePath: string) {
    return new GCSFile(destinationFilePath);
  }
}

export class Storage {
  constructor() {
    storage.emptyFiles();
  }

  bucket(bucketName) {
    return new Bucket(bucketName);
  }
}
