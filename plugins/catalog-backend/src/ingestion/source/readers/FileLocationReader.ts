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

import fs from 'fs-extra';
import { LocationReader } from './types';

/**
 * Reads a file from the local file system.
 */
export class FileLocationReader implements LocationReader {
  async tryRead(type: string, target: string): Promise<Buffer | undefined> {
    if (type !== 'file') {
      return undefined;
    }

    try {
      return await fs.readFile(target);
    } catch (e) {
      throw new Error(`Unable to read "${target}", ${e}`);
    }
  }
}
