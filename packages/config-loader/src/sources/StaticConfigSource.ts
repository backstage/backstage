/*
 * Copyright 2023 The Backstage Authors
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

import { JsonObject, Observable } from '@backstage/types';
import {
  AsyncConfigSourceIterator,
  ConfigSource,
  ReadConfigDataOptions,
} from './types';
import { simpleDefer } from './utils';

/**
 * Options for {@link StaticConfigSource.create}.
 *
 * @public
 */
export interface StaticConfigSourceOptions {
  data:
    | JsonObject
    | Observable<JsonObject>
    | PromiseLike<JsonObject>
    | AsyncIterable<JsonObject>;
  context?: string;
}

/** @internal */
class StaticObservableConfigSource implements ConfigSource {
  constructor(
    private readonly data: Observable<JsonObject>,
    private readonly context: string,
  ) {}

  async *readConfigData(
    options?: ReadConfigDataOptions | undefined,
  ): AsyncConfigSourceIterator {
    const queue = new Array<JsonObject>();
    let deferred = simpleDefer<void>();

    const sub = this.data.subscribe({
      next(value) {
        queue.push(value);
        deferred.resolve();
        deferred = simpleDefer();
      },
      complete() {
        deferred.resolve();
      },
    });

    const signal = options?.signal;
    if (signal) {
      const onAbort = () => {
        sub.unsubscribe();
        queue.length = 0;
        deferred.resolve();
        signal.removeEventListener('abort', onAbort);
      };

      signal.addEventListener('abort', onAbort);
    }

    for (;;) {
      await deferred.promise;
      if (queue.length === 0) {
        return;
      }
      while (queue.length > 0) {
        yield { configs: [{ data: queue.shift()!, context: this.context }] };
      }
    }
  }
}

function isObservable<T>(value: {}): value is Observable<T> {
  return 'subscribe' in value && typeof (value as any).subscribe === 'function';
}

function isAsyncIterable<T>(value: {}): value is AsyncIterable<T> {
  return Symbol.asyncIterator in value;
}

/**
 * A configuration source that reads from a static object, promise, iterable, or observable.
 *
 * @public
 */
export class StaticConfigSource implements ConfigSource {
  /**
   * Creates a new {@link StaticConfigSource}.
   *
   * @param options - Options for the config source
   * @returns A new static config source
   */
  static create(options: StaticConfigSourceOptions): ConfigSource {
    const { data, context = 'static-config' } = options;
    if (!data) {
      return {
        async *readConfigData(): AsyncConfigSourceIterator {
          yield { configs: [] };
          return;
        },
      };
    }

    if (isObservable<JsonObject>(data)) {
      return new StaticObservableConfigSource(data, context);
    }

    if (isAsyncIterable(data)) {
      return {
        async *readConfigData(): AsyncConfigSourceIterator {
          for await (const value of data) {
            yield { configs: [{ data: value, context }] };
          }
        },
      };
    }

    return new StaticConfigSource(data, context);
  }

  private constructor(
    private readonly promise: JsonObject | PromiseLike<JsonObject>,
    private readonly context: string,
  ) {}

  async *readConfigData(): AsyncConfigSourceIterator {
    yield { configs: [{ data: await this.promise, context: this.context }] };
    return;
  }

  toString() {
    return `StaticConfigSource{}`;
  }
}
