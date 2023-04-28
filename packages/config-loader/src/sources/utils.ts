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

/** @internal */
export interface SimpleDeferred<T> {
  promise: Promise<T>;
  resolve(value: T): void;
}

/** @internal */
export function simpleDefer<T>(): SimpleDeferred<T> {
  let resolve: (value: T) => void;
  const promise = new Promise<T>(_resolve => {
    resolve = _resolve;
  });
  return { promise, resolve: resolve! };
}

/** @internal */
export async function waitOrAbort<T>(
  promise: PromiseLike<T>,
  signal?: AbortSignal | Array<AbortSignal | undefined>,
): Promise<[ok: true, value: T] | [ok: false]> {
  const signals = [signal].flat().filter((x): x is AbortSignal => !!x);
  return new Promise((resolve, reject) => {
    if (signals.some(s => s.aborted)) {
      resolve([false]);
    }
    const onAbort = () => {
      resolve([false]);
    };
    promise.then(
      value => {
        resolve([true, value]);
        signals.forEach(s => s.removeEventListener('abort', onAbort));
      },
      error => {
        reject(error);
        signals.forEach(s => s.removeEventListener('abort', onAbort));
      },
    );
    signals.forEach(s => s.addEventListener('abort', onAbort));
  });
}
