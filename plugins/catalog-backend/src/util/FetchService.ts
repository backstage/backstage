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
import { ThrottlingConfig } from '@backstage/integration';
import pThrottle from 'p-throttle';
import { durationToMilliseconds } from '@backstage/types';

export type FetchFunction = (
  url: RequestInfo,
  init?: RequestInit,
) => Promise<Response>;

export class FetchService {
  private static cache: Record<string, FetchFunction> = {};
  private constructor() {}
  public static get(options: { host: string; throttling?: ThrottlingConfig }) {
    let func = this.cache[options.host];
    if (func !== undefined) {
      return func;
    }

    if (options.throttling === undefined) {
      console.log('NO THROTTLING');
      func = (url: RequestInfo, init?: RequestInit) => {
        if (typeof url === 'string') console.log(`fetch(${url})`);
        else if ('href' in url) console.log(`fetch(${url.href})`);
        else if ('url' in url) console.log(`fetch(${url.url})`);

        return fetch(url, init);
      };
    } else {
      console.log('THROTTLING ENABLED');
      const throttle = pThrottle({
        limit: options.throttling.count,
        interval: durationToMilliseconds(options.throttling.interval),
      });
      func = throttle(async (url: RequestInfo, init?: RequestInit) => {
        if (typeof url === 'string') console.log(`throttled_fetch(${url})`);
        else if ('href' in url) console.log(`throttled_fetch(${url.href})`);
        else if ('url' in url) console.log(`throttled_fetch(${url.url})`);

        return fetch(url, init);
      });
    }

    this.cache[options.host] = func;
    return func;
  }
}
