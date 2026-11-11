/*
 * Copyright 2026 The Backstage Authors
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

// This package is inlined, so the marker must work across separate copies.
/** @internal */
export const resolvedApiPromise = Symbol.for('@backstage/resolved-api-promise');

/** @internal */
export type ResolvedApiPromise<T> = Promise<T> & {
  readonly [resolvedApiPromise]?: { readonly value: T };
};
