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

import { FileLocationReader } from './readers/FileLocationReader';
import { GitHubLocationReader } from './readers/GitHubLocationReader';
import { LocationReader } from './readers/types';

export class LocationReaders implements LocationReader {
  private readonly readers: LocationReader[];

  static defaultReaders(): LocationReader[] {
    return [new FileLocationReader(), new GitHubLocationReader()];
  }

  constructor(readers: LocationReader[] = LocationReaders.defaultReaders()) {
    this.readers = readers;
  }

  async tryRead(type: string, target: string): Promise<Buffer | undefined> {
    for (const reader of this.readers) {
      const result = await reader.tryRead(type, target);
      if (result) {
        return result;
      }
    }
    throw new Error(`Could not read unknown location "${type}", "${target}"`);
  }
}
