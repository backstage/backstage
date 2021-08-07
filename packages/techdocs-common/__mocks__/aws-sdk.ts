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
import { EventEmitter } from 'events';
import { ReadStream } from 'fs';

export { Credentials } from 'aws-sdk';

const storage = new (global as any).StorageFilesMock();

export class S3 {
  constructor() {
    storage.emptyFiles();
  }

  headObject({ Key }: { Key: string }) {
    return {
      promise: async () => {
        if (!storage.fileExists(Key)) {
          throw new Error('File does not exist');
        }
      },
    };
  }

  getObject({ Key }: { Key: string }) {
    return {
      promise: async () => storage.fileExists(Key),
      createReadStream: () => {
        const emitter = new EventEmitter();
        process.nextTick(() => {
          if (storage.fileExists(Key)) {
            emitter.emit('data', Buffer.from(storage.readFile(Key)));
            emitter.emit('end');
          } else {
            emitter.emit('error', new Error(`The file ${Key} does not exist!`));
          }
        });
        return emitter;
      },
    };
  }

  headBucket({ Bucket }) {
    return {
      promise: async () => {
        if (Bucket === 'errorBucket') {
          throw new Error('Bucket does not exist');
        }
        return {};
      },
    };
  }

  upload({ Key, Body }: { Key: string; Body: ReadStream }) {
    return {
      promise: () =>
        new Promise(async resolve => {
          const chunks = [];
          Body.on('data', chunk => {
            chunks.push(chunk);
          });
          Body.once('end', () => {
            storage.writeFile(Key, Buffer.concat(chunks));
            resolve(null);
          });
        }),
    };
  }
}

export default {
  S3,
};
