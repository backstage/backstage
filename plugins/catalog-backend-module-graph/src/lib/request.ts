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

import type { EntityFilterQuery } from '@backstage/catalog-client';

import { ensureArray } from './array';

/**
 * Collects all kinds mentioned in the filter, returning undefined if any of
 * the filters allows all kinds.
 */
export function getAllKindsFromFilter(
  filter: EntityFilterQuery,
): Set<string> | undefined {
  let hasAny = false;

  const kindsSet = ensureArray(filter ?? []).reduce((acc, cur) => {
    const kindValues = cur.kind;
    if (typeof kindValues === 'string') {
      acc.add(kindValues.toLocaleLowerCase('en-US'));
    } else if (Array.isArray(kindValues)) {
      if (kindValues.length === 0) {
        hasAny = true;
      }
      kindValues.forEach(k => {
        if (typeof k === 'string') {
          acc.add(k.toLocaleLowerCase('en-US'));
        }
      });
    } else {
      hasAny = true;
    }

    return acc;
  }, new Set<string>());

  return kindsSet.size === 0 || hasAny ? undefined : kindsSet;
}
