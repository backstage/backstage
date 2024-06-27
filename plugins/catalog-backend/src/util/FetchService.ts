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
import { HumanDuration } from '@backstage/types';
import { Config, readDurationFromConfig } from '@backstage/config';

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
  private static cache: Record<string, FetchFunction> = {};
  private constructor() {}

  /**
   * Get a `fetch` function that can be used to make HTTP requests.
   * This function will either be a direct call to `fetch` or a throttled version of it.
   * The function is cached based on the host of the URL that is being fetched, and will return the same function for the same host.
   */
  public static get(options: {
    host: string;
    debug?: boolean;
    throttling?: ThrottlingConfig;
  }) {
    let func = this.cache[options.host];
    if (func !== undefined) {
      return func;
    }

    const debug = options.debug ?? false;

    if (options.throttling === undefined) {
      func = (url: RequestInfo, init?: RequestInit) => {
        if (typeof url === 'string') this.log(`fetch(${url})`, debug);
        else if ('href' in url) this.log(`fetch(${url.href})`, debug);
        else if ('url' in url) this.log(`fetch(${url.url})`, debug);

        return fetch(url, init);
      };
    } else {
      const throttle = pThrottle({
        limit: options.throttling.count,
        interval: durationToMilliseconds(options.throttling.interval),
      });
      func = throttle(async (url: RequestInfo, init?: RequestInit) => {
        if (typeof url === 'string') this.log(`throttled_fetch(${url})`, debug);
        else if ('href' in url) this.log(`throttled_fetch(${url.href})`, debug);
        else if ('url' in url) this.log(`throttled_fetch(${url.url})`, debug);

        return fetch(url, init);
      });
    }

    this.cache[options.host] = func;
    return func;
  }

  private static log(msg: string, debug: boolean) {
    if (debug) {
      console.log(msg);
    }
  }
}

/**
 * Reads the throttling configuration from the provided config object.
 * @public
 */
export function readThrottlingConfig(config: Config): ThrottlingConfig {
  return {
    count: config.getNumber('count'),
    interval: readDurationFromConfig(config.getConfig('interval')),
  };
}

/**
 * Configuration for the throttling of HTTP requests.
 * @public
 */
export type ThrottlingConfig = {
  count: number;
  interval: HumanDuration;
};
