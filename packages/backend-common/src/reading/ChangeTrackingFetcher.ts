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

import { NotModifiedError } from '../errors';
import { ReadOptions } from './types';
import fetch from 'cross-fetch';

type UrlState = {
  expiresAt: number;
  etag: string;
};

/**
 * Works like fetch, but with the addition that it memorizes and uses ETag
 * headers.
 */
export class ChangeTrackingFetcher {
  private readonly state = new Map<string, UrlState>();
  private readonly maxAgeMillis: number;

  constructor(options: { maxAgeMillis: number }) {
    this.maxAgeMillis = options.maxAgeMillis;
  }

  /**
   * Fetches a URL.
   *
   * @param url The URL to fetch
   * @param init The init options, as in the second fetch argument
   * @param options Additional options affecting the fetch
   * @returns The response
   * @throws NotModifiedError if options.refetchStrategy is 'if-changed' and
   *         the request ended in a 304.
   */
  async fetch(
    url: string,
    init?: RequestInit | undefined,
    options?: ReadOptions | undefined,
  ): Promise<Response> {
    const headers = new Headers(init?.headers);
    const key = this.stateKey(url, headers);
    let updatedInit = init;

    if (options?.refetchStrategy === 'if-changed') {
      const oldState = this.state.get(key);
      if (oldState && oldState.expiresAt > Date.now()) {
        headers.set('if-none-match', oldState.etag);
        updatedInit = { ...updatedInit, headers };
      }
    }

    const response = await fetch(url, updatedInit);

    const etag = response.headers?.get('etag');
    if (etag) {
      const oldState = this.state.get(key);
      if (
        !oldState ||
        oldState.expiresAt < Date.now() ||
        oldState.etag !== etag
      ) {
        this.state.set(key, {
          expiresAt: Date.now() + this.maxAgeMillis,
          etag,
        });
      }
    }

    if (response.status === 304) {
      throw new NotModifiedError();
    }

    return response;
  }

  private stateKey(url: string, headers: Headers): string {
    const data = [url];

    const vary = headers.get('vary');
    if (vary) {
      data.push(vary);
      for (const headerName of vary.split(',').map(x => x.trim())) {
        data.push(headers.get(headerName) || '');
      }
    }

    return data.join('~');
  }
}
