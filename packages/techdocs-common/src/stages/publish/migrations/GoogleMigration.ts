/*
 * Copyright 2021 The Backstage Authors
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

import { File } from '@google-cloud/storage';
import { Writable } from 'stream';
import { Logger } from 'winston';
import { lowerCaseEntityTripletInStoragePath } from '../helpers';

/**
 * Writable stream to handle object copy/move operations. This implementation
 * ensures we don't read in files from GCS faster than GCS can copy/move them.
 */
export class MigrateWriteStream extends Writable {
  protected logger: Logger;
  protected removeOriginal: boolean;
  protected maxConcurrency: number;
  protected inFlight = 0;

  constructor(logger: Logger, removeOriginal: boolean, concurrency: number) {
    super({ objectMode: true });
    this.logger = logger;
    this.removeOriginal = removeOriginal;
    this.maxConcurrency = concurrency;
  }

  _write(file: File, _encoding: BufferEncoding, next: Function) {
    let shouldCallNext = true;
    let newFile;
    try {
      newFile = lowerCaseEntityTripletInStoragePath(file.name);
    } catch (e) {
      this.logger.warn(e.message);
      next();
      return;
    }

    // If all parts are already lowercase, ignore.
    if (newFile === file.name) {
      next();
      return;
    }

    // Allow up to n-many files to be migrated at a time.
    this.inFlight++;
    if (this.inFlight < this.maxConcurrency) {
      next();
      shouldCallNext = false;
    }

    // Otherwise, copy or move the file.
    const migrate = this.removeOriginal
      ? file.move.bind(file)
      : file.copy.bind(file);
    this.logger.debug(`Migrating ${file.name}`);
    migrate(newFile)
      .catch(e =>
        this.logger.warn(`Unable to migrate ${file.name}: ${e.message}`),
      )
      .finally(() => {
        this.inFlight--;
        if (shouldCallNext) {
          next();
        }
      });
  }
}
