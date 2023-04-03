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
import { Operation } from 'effection';
import { PromiseOrValue } from '../types';

export function isPromise<T>(x: PromiseOrValue<T>): x is Promise<T> {
  return typeof (x as Promise<T>).then === 'function';
}

export function* unwrap<T>(promiseOrValue: PromiseOrValue<T> | Operation<T>): {
  [Symbol.iterator](): Iterator<Operation<T>, T, any>;
} {
  if (isPromise(promiseOrValue)) {
    return yield promiseOrValue;
  }
  return promiseOrValue as T;
}
