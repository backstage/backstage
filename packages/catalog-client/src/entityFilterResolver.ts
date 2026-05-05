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

import { Entity } from '@backstage/catalog-model';
import {
  FilterPredicateOptions,
  getJsonValueAtPath,
} from '@backstage/filter-predicates';
import { JsonValue } from '@backstage/types';

/**
 * Resolves a filter key to a value on a catalog entity, with support for the
 * special `relations.<relationType>` syntax used by the catalog search table.
 *
 * @remarks
 *
 * When the key starts with `relations.`, the remainder is treated as a relation
 * type and the resolver returns all matching `targetRef` values as an array.
 * This enables filters like `{ "relations.ownedby": "group:default/my-team" }`
 * to work in-memory with the same semantics as the catalog backend's search
 * table, where each relation is stored as a separate row.
 *
 * For all other keys, the default dot-path lookup is used.
 *
 * @public
 */
export function resolveEntityFilterValue(
  entity: unknown,
  key: string,
): unknown {
  if (key.toLocaleLowerCase('en-US').startsWith('relations.')) {
    const relationType = key.slice('relations.'.length);
    const relations = (entity as Entity)?.relations;
    if (!Array.isArray(relations)) {
      return undefined;
    }
    const targetRefs = relations
      .filter(
        r =>
          r.type.toLocaleLowerCase('en-US') ===
          relationType.toLocaleLowerCase('en-US'),
      )
      .map(r => r.targetRef);
    return targetRefs.length > 0 ? targetRefs : undefined;
  }

  return getJsonValueAtPath(entity as JsonValue, key);
}

/**
 * Options for {@link @backstage/filter-predicates#filterPredicateToFilterFunction}
 * that enable catalog entity relation filtering via the `relations.<type>` syntax.
 *
 * @public
 */
export const entityFilterOptions: FilterPredicateOptions = {
  resolveValue: resolveEntityFilterValue,
};
