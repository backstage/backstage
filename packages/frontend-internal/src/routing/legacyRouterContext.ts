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

const originalContext = Symbol.for('@backstage/legacy-router-context');

/** Read a compatibility context without reporting framework bookkeeping as legacy usage. */
export function unwrapReactRouterContext<T>(value: T): T {
  return value && typeof value === 'object'
    ? (value as any)[originalContext] ?? value
    : value;
}

/** Report native React Router consumers, while allowing explicit adapters to replace the fallback. */
export function observeReactRouterContext<T extends object>(
  value: T,
  onUse?: () => void,
): T {
  if (!onUse) {
    return value;
  }
  return new Proxy(value, {
    get(target, key, receiver) {
      if (key === originalContext) {
        return target;
      }
      if (key === 'matches' || key === 'location' || key === 'navigator') {
        onUse();
      }
      return Reflect.get(target, key, receiver);
    },
  });
}
