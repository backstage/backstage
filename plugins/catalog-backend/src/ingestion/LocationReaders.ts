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

import { FileLocationSource } from './sources/FileLocationSource';
import { LocationSource } from './sources/types';
import { LocationReader, ReaderOutput } from './types';

export class LocationReaders implements LocationReader {
  static create(): LocationReader {
    return new LocationReaders({
      file: new FileLocationSource(),
    });
  }

  constructor(private readonly sources: Record<string, LocationSource>) {}

  async read(type: string, target: string): Promise<ReaderOutput[]> {
    const source = this.sources[type];
    if (!source) {
      throw new Error(`Unknown location type ${type}`);
    }

    return source.read(target);
  }
}
