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
import { InputError } from '@backstage/errors';
import { REQUEST_COLUMN_ENTITY_FILTER_MAP } from '../types';
import { ParsedQs } from 'qs';
import { EntityFilterQuery } from '@backstage/catalog-client';

type FilterValue = string | string[];
type FilterObj = Record<string, FilterValue>;

function remapKey(k: string): string {
  return REQUEST_COLUMN_ENTITY_FILTER_MAP[k] ?? k; // if already a dot path (e.g. 'spec.type'), it stays as-is
}

function normVal(v: unknown): FilterValue {
  if (Array.isArray(v)) {
    return v.map(String);
  }
  return String(v);
}

const normObj = (requestQuery: object): FilterObj => {
  const out: FilterObj = {};
  for (const [k, v] of Object.entries(requestQuery ?? {})) {
    const mapped = remapKey(k);
    out[mapped] = normVal(v);
  }
  return out;
};

export const toEntityFilterQuery = (
  requestQuery: ParsedQs,
): EntityFilterQuery | undefined => {
  if (requestQuery === null) {
    return undefined;
  }
  if (typeof requestQuery === 'string') {
    try {
      const parsed = JSON.parse(requestQuery);
      return toEntityFilterQuery(parsed);
    } catch {
      throw new InputError(
        '`filter(s)` must be an object/array or valid JSON string',
      );
    }
  }
  if (Array.isArray(requestQuery)) {
    return requestQuery.map(normObj);
  }
  if (typeof requestQuery === 'object') {
    return normObj(requestQuery);
  }
  throw new InputError('`filter(s)` must be an object or array of objects');
};
