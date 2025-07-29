/*
 * Copyright 2025 The Backstage Authors
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
type ResolveFn<T> = (value: T | PromiseLike<T>) => void;
type RejectFn = (reason?: any) => void;
type Executor<T> = (resolve: ResolveFn<T>, reject: RejectFn) => void;

export class MockPromise<T> extends Promise<T> {
  private _resolve!: ResolveFn<T>;
  private _reject!: RejectFn;

  constructor(executor?: Executor<T>) {
    if (executor !== undefined) {
      super(executor);
      return;
    }

    let res: ResolveFn<T>;
    let rej: RejectFn;
    super((resolve, reject) => {
      res = resolve;
      rej = reject;
    });
    this._resolve = res!;
    this._reject = rej!;
  }

  get resolve() {
    return this._resolve;
  }

  get reject() {
    return this._reject;
  }
}
