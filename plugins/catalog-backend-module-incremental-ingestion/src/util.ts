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

export class Deferred<T> implements Promise<T> {
  #resolve?: (value: T) => void;
  #reject?: (error: Error) => void;

  public get resolve() {
    return this.#resolve!;
  }
  public get reject() {
    return this.#reject!;
  }

  public then: Promise<T>['then'];
  public catch: Promise<T>['catch'];
  public finally: Promise<T>['finally'];

  public constructor() {
    const promise = new Promise<T>((resolve, reject) => {
      this.#resolve = resolve;
      this.#reject = reject;
    });

    this.then = promise.then.bind(promise);
    this.catch = promise.catch.bind(promise);
    this.finally = promise.finally.bind(promise);
  }

  [Symbol.toStringTag]: 'Deferred' = 'Deferred';
}
