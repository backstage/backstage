/*
 * Copyright 2024 The Backstage Authors
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

import { ThrottlingConfig } from '@backstage/integration';
import { durationToMilliseconds } from '@backstage/types';
import pThrottle from 'p-throttle';

/**
 * Represents any fetch-like function
 *
 * @public
 */
export type FetchLike<TInput extends string | URL | { url: string }> = (
  input: TInput,
  init?: any,
) => Promise<any>;

const THROTTLED_SYMBOL = Symbol.for(
  '@backstage/integration-bitbucket-common.throttled',
);

/**
 * Creates throttled versions of fetch-like functions
 *
 * @public
 */
export class ThrottleService {
  #hostThrottler: Map<string, ReturnType<typeof pThrottle>> = new Map();

  throttle<T extends FetchLike<any>>(
    fetch: T,
    options: {
      host: string;
      throttling?: ThrottlingConfig;
    },
  ): T {
    if (!options.throttling || (fetch as any)[THROTTLED_SYMBOL]) {
      return fetch;
    }

    let throttler = this.#hostThrottler.get(options.host);
    if (!throttler) {
      const limit = options.throttling.count;
      const interval = durationToMilliseconds(options.throttling.interval);
      throttler = pThrottle({
        limit,
        interval,
      });
      this.#hostThrottler.set(options.host, throttler);
    }

    const result = throttler(fetch) as unknown as T;
    (result as any)[THROTTLED_SYMBOL] = true;

    return result;
  }
}
