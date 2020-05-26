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

// @ts-nocheck
import { LocationSource, LocationReader, ReaderOutput } from '../types';

export class LocationReaders implements LocationReader {
  static create(): LocationReader {
    return {
      read: (type, target) => {
        if (type !== 'valid_type') {
          throw new Error(`Unknown location type ${type}`);
        }
        if (target === 'valid_target') {
          return Promise.resolve([{ type: 'data', data: {} }]);
        }
        throw new Error(
          `Can't read location at ${target} with error: Something is broken`,
        );
      },
    };
  }
  // eslint-disable-next-line
  constructor(private readonly sources: Record<string, LocationSource>) {}

  // eslint-disable-next-line
  async read(type: string, target: string): Promise<ReaderOutput[]> {
    return [];
  }
}
