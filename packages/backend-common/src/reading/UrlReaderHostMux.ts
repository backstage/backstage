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

import { UrlReader } from './types';

/**
 * A UrlReader implementation that selects from a set of UrlReaders
 * based on the host in the URL.
 */
export class UrlReaderHostMux implements UrlReader {
  private readonly readers = new Map<string, UrlReader>();

  register(host: string, reader: UrlReader): void {
    this.readers.set(host, reader);
  }

  read(url: string): Promise<Buffer> {
    const parsed = new URL(url);

    const reader = this.readers.get(parsed.host);
    if (!reader) {
      throw new Error(`No reader registered for host ${parsed.host}`);
    }

    return reader.read(url);
  }
}
