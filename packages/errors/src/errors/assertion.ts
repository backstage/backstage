/*
 * Copyright 2021 The Backstage Authors
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

export type ErrorLike = {
  name: string;
  message: string;
  stack?: string;
  [unknownKeys: string]: unknown;
};

export function isError(val: unknown): val is ErrorLike {
  if (typeof val !== 'object' || val === null || Array.isArray(val)) {
    return false;
  }
  const maybe = val as Partial<ErrorLike>;
  if (typeof maybe.name !== 'string' || maybe.name === '') {
    return false;
  }
  if (typeof maybe.message !== 'string') {
    return false;
  }
  return true;
}

export function assertError(val: unknown): asserts val is ErrorLike {
  if (typeof val !== 'object' || val === null || Array.isArray(val)) {
    throw new Error(`Encountered invalid error, not an object, got '${val}'`);
  }
  const maybe = val as Partial<ErrorLike>;
  if (typeof maybe.name !== 'string' || maybe.name === '') {
    throw new Error(`Encountered error object without a name, got '${val}'`);
  }
  if (typeof maybe.message !== 'string') {
    throw new Error(`Encountered error object without a message, got '${val}'`);
  }
}
