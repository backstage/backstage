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
  static create(options?: {
    data?: JsonObject;
    context?: string;
  }): MutableConfigSource {
    return new MutableConfigSource(
      options?.context ?? 'mutable-config',
      options?.data,
    );
  }

  #currentData?: JsonObject;
  #deferred: SimpleDeferred<void>;
  readonly #context: string;
  readonly #abortController = new AbortController();

  private constructor(context: string, initialData?: JsonObject) {
    this.#currentData = initialData;
    this.#context = context;
    this.#deferred = simpleDefer();
  }

  async *readConfigData(
    options?: ReadConfigDataOptions | undefined,
  ): AsyncConfigSourceIterator {
    let deferredPromise = this.#deferred.promise;

    if (this.#currentData !== undefined) {
      yield { data: [{ data: this.#currentData, context: this.#context }] };
    }

    for (;;) {
      const [ok] = await waitOrAbort(deferredPromise, [
        options?.signal,
        this.#abortController.signal,
      ]);
      if (!ok) {
        return;
      }
      deferredPromise = this.#deferred.promise;

      if (this.#currentData !== undefined) {
        yield { data: [{ data: this.#currentData, context: this.#context }] };
      }
    }
  }

  setData(data: JsonObject): void {
    if (!this.#abortController.signal.aborted) {
      this.#currentData = data;
      const oldDeferred = this.#deferred;
      this.#deferred = simpleDefer();
      oldDeferred.resolve();
    }
  }

  close(): void {
    this.#currentData = undefined;
    this.#abortController.abort();
  }
}
