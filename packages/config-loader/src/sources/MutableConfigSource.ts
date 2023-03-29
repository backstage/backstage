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

import { JsonObject } from '@backstage/types';
import {
  AsyncConfigSourceIterator,
  ConfigSource,
  ReadConfigDataOptions,
} from './types';
import { simpleDefer, SimpleDeferred, waitOrAbort } from './utils';

export class MutableConfigSource implements ConfigSource {
  static create(options: { data: JsonObject; context?: string }): ConfigSource {
    return new MutableConfigSource(
      options.data,
      options.context ?? 'mutable-config',
    );
  }

  #currentData: JsonObject;
  #deferred: SimpleDeferred<void>;
  readonly #context: string;

  private constructor(initialData: JsonObject, context: string) {
    this.#currentData = initialData;
    this.#context = context;
    this.#deferred = simpleDefer();
  }

  async *readConfigData(
    options?: ReadConfigDataOptions | undefined,
  ): AsyncConfigSourceIterator {
    yield { data: [{ data: this.#currentData, context: this.#context }] };

    for (;;) {
      const [ok] = await waitOrAbort(this.#deferred.promise, options?.signal);
      if (!ok) {
        return;
      }

      yield { data: [{ data: this.#currentData, context: this.#context }] };
    }
  }

  setData(data: JsonObject) {
    this.#currentData = data;
    this.#deferred.resolve();
    this.#deferred = simpleDefer();
  }
}
