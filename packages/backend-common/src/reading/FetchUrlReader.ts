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

import fetch from 'cross-fetch';
import { NotFoundError } from '../errors';
import { ReadTreeResponse, UrlReader } from './types';

/**
 * A UrlReader that does a plain fetch of the URL.
 */
export class FetchUrlReader implements UrlReader {
  async read(url: string): Promise<Buffer> {
    let response: Response;
    try {
      response = await fetch(url);
    } catch (e) {
      throw new Error(`Unable to read ${url}, ${e}`);
    }

    if (response.ok) {
      return Buffer.from(await response.text());
    }

    const message = `could not read ${url}, ${response.status} ${response.statusText}`;
    if (response.status === 404) {
      throw new NotFoundError(message);
    }
    throw new Error(message);
  }

  readTree(): Promise<ReadTreeResponse> {
    throw new Error('FetchUrlReader does not implement readTree');
  }

  toString() {
    return 'fetch{}';
  }
}
