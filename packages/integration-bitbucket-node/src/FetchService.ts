/*
 * Copyright 2022 The Backstage Authors
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

import fetch, { Response, RequestInfo, RequestInit } from 'node-fetch';
import pThrottle from 'p-throttle';
import { durationToMilliseconds } from '@backstage/types';
import { ThrottlingConfig } from '@backstage/integration';

/**
 * A function that is a wrapper for the `fetch` function in node-fetch.
 * This will either be a direct call to `fetch` or a throttled version of it.
 * @public
 */
export type FetchFunction = (
  url: RequestInfo,
  init?: RequestInit,
) => Promise<Response>;

/**
 * A service that provides a `fetch` function that can be used to make HTTP requests.
 * This service can be configured to throttle the number of requests that can be made.
 * @internal
 */
export class FetchService {
  private static cache: Record<string, FetchFunction | undefined> = {};
  private constructor() {}

  /**
   * Get a `fetch` function that can be used to make HTTP requests.
   * This function will either be a direct call to `fetch` or a throttled version of it.
   * The function is cached based on the host of the URL that is being fetched, and will return the same function for the same host.
   */
  public static get(options: { host: string; throttling?: ThrottlingConfig }) {
    let func = this.cache[options.host];
    if (func !== undefined) {
      return func;
    }

    if (options.throttling === undefined) {
      func = (url: RequestInfo, init?: RequestInit) => {
        return fetch(url, init);
      };
    } else {
      const throttle = pThrottle({
        limit: options.throttling.count,
        interval: durationToMilliseconds(options.throttling.interval),
      });
      func = throttle(async (url: RequestInfo, init?: RequestInit) => {
        console.log(`fetch_throttled(${(url as any).url})`);
        return fetch(url, init);
      });
    }

    this.cache[options.host] = func;
    return func;
  }
}
