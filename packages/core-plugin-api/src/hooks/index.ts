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

import { useRef } from 'react';

/**
 * Re-use the same object reference if the props are the same.
 *
 * Performs 1-level equality checks, so deep object changes will not be caught.
 *
 * @param obj The object to return (or get previous instance of)
 * @returns obj or a previous instance which is prop-by-prop wise identical.
 *
 * @public
 */
export function useReusedObjectReference<T extends {} | undefined>(obj: T): T {
  const ref = useRef<T>();

  const setNew = () => {
    ref.current = obj;
    return obj;
  };

  if (!ref.current !== !obj) {
    return setNew();
  }

  if (!obj) {
    return obj;
  }

  if (!ref.current) {
    return setNew();
  }

  const prevEntries = Object.entries(ref.current);
  const curEntries = Object.entries(obj);

  if (prevEntries.length !== curEntries.length) {
    return setNew();
  }

  const prevMap = new Map(prevEntries);
  if (curEntries.some(([k]) => !prevMap.has(k))) {
    return setNew();
  }

  if (curEntries.some(([k, v]) => prevMap.get(k) !== v)) {
    return setNew();
  }

  // Same keys and values, reuse
  return ref.current;
}
