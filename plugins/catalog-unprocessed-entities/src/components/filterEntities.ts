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

import { UnprocessedEntity } from '@backstage/plugin-catalog-unprocessed-entities-common';

/**
 * Case-insensitive search predicate for the entityRef column, shared by the
 * failed and pending entity tables.
 *
 * Every input is treated as nullable on purpose: the row or its `entity_ref`
 * may be missing (and the query is empty until the user types), and calling
 * string methods on those nullish values would otherwise throw and break the
 * whole table while searching.
 */
export const entityRefFilterAndSearch = (
  query: string | null | undefined,
  row:
    | { entity_ref?: UnprocessedEntity['entity_ref'] | null }
    | null
    | undefined,
): boolean => {
  if (!query) return true;
  return String(row?.entity_ref ?? '')
    .toUpperCase()
    .includes(String(query).toUpperCase());
};
