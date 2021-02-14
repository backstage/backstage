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
import type { S3 as S3Types } from 'aws-sdk';
import { EventEmitter } from 'events';
import fs from 'fs';

export class S3 {
  private readonly options;

  constructor(options: S3Types.ClientConfiguration) {
    this.options = options;
  }

  headObject({ Key }: { Key: string }) {
    return {
      promise: () => this.checkFileExists(Key),
    };
  }

  getObject({ Key }: { Key: string }) {
    return {
      promise: () => this.checkFileExists(Key),
      createReadStream: () => {
        const emitter = new EventEmitter();
        process.nextTick(() => {
          if (fs.existsSync(Key)) {
            emitter.emit('data', Buffer.from(fs.readFileSync(Key)));
          } else {
            emitter.emit(
              'error',
              new Error(`The file ${Key} doest not exist !`),
            );
          }
          emitter.emit('end');
        });
        return emitter;
      },
    };
  }

  checkFileExists(Key: string) {
    return new Promise((resolve, reject) => {
      if (fs.existsSync(Key)) {
        resolve('');
      } else {
        reject({ message: 'The object doest not exist !' });
      }
    });
  }

  headBucket() {
    return new Promise(resolve => {
      resolve('');
    });
  }

  upload({ Key }: { Key: string }) {
    return {
      promise: () =>
        new Promise((resolve, reject) => {
          resolve('');
        }),
    };
  }
}

export default {
  S3,
};
