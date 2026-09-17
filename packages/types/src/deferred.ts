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

/**
 * A deferred promise that can be resolved or rejected later.
 *
 * @public
 */
export type DeferredPromise<
  TResolved = void,
  TRejected = Error,
> = Promise<TResolved> & {
  resolve(value: TResolved | PromiseLike<TResolved>): void;
  reject(reason?: TRejected): void;
};

class Deferred<TResolved, TRejected>
  implements DeferredPromise<TResolved, TRejected>
{
  #resolve?: (value: TResolved | PromiseLike<TResolved>) => void;
  #reject?: (reason?: TRejected) => void;

  public get resolve() {
    return this.#resolve!;
  }
  public get reject() {
    return this.#reject!;
  }

  public then: Promise<TResolved>['then'];
  public catch: Promise<TResolved>['catch'];
  public finally: Promise<TResolved>['finally'];

  public constructor() {
    const promise = new Promise<TResolved>((resolve, reject) => {
      this.#resolve = resolve;
      this.#reject = reject;
    });

    this.then = promise.then.bind(promise);
    this.catch = promise.catch.bind(promise);
    this.finally = promise.finally.bind(promise);
  }

  [Symbol.toStringTag]: 'DeferredPromise' = 'DeferredPromise';
}

/**
 * Creates a deferred promise that can be resolved or rejected later.
 *
 * @public
 */
export function createDeferred<
  TResolved = void,
  TRejected = Error,
>(): DeferredPromise<TResolved, TRejected> {
  return new Deferred();
}
