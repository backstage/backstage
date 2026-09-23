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

/** @internal */
export type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K];
};

/**
 * Deeply freezes an object by recursively freezing all of its properties.
 * From https://gist.github.com/tkrotoff/e997cd6ff8d6cf6e51e6bb6146407fc3 +
 *  https://stackoverflow.com/a/69656011
 */
export function deepFreeze<T>(obj: T) {
  // Can cause: "Type instantiation is excessively deep and possibly infinite."
  // @ts-expect-error
  Object.values(obj).forEach(
    value => Object.isFrozen(value) || deepFreeze(value),
  );
  return Object.freeze(obj) as DeepReadonly<T>;
}
