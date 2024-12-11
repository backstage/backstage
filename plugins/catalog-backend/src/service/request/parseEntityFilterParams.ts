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

import { InputError } from '@backstage/errors';
import { parseStringsParam } from './common';
import {
  EntitiesSearchFilter,
  EntityFilter,
} from '@backstage/plugin-catalog-node';

/**
 * Parses the filtering part of a query, like
 * /entities?filter=metadata.namespace=default,kind=Component
 */
export function parseEntityFilterParams(
  params: Record<string, unknown>,
): EntityFilter | undefined {
  // Each filter string is on the form a=b,c=d
  const filterStrings = parseStringsParam(params.filter, 'filter');
  if (!filterStrings) {
    return undefined;
  }

  // Outer array: "any of the inner ones"
  // Inner arrays: "all of these must match"
  const filters = filterStrings
    .map(parseEntityFilterString)
    .filter((r): r is EntitiesSearchFilter[] => Boolean(r));
  if (!filters.length) {
    return undefined;
  }

  const outer = filters.map(inner =>
    inner.length === 1 ? inner[0] : { allOf: inner },
  );
  return outer.length === 1 ? outer[0] : { anyOf: outer };
}

/**
 * Parses a single filter string as seen in a filter query, for example
 * metadata.namespace=default,kind=Component
 */
export function parseEntityFilterString(
  filterString: string,
): EntitiesSearchFilter[] | undefined {
  const statements = filterString
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

  if (!statements.length) {
    return undefined;
  }

  const filtersByKey = new Map<string, EntitiesSearchFilter>();

  for (const statement of statements) {
    const equalsIndex = statement.indexOf('=');

    const key =
      equalsIndex === -1
        ? statement
        : statement.substring(0, equalsIndex).trim();
    const value =
      equalsIndex === -1
        ? undefined
        : statement.substring(equalsIndex + 1).trim();
    if (!key) {
      throw new InputError(
        `Invalid filter, '${statement}' is not a valid statement (expected a string on the form a=b or a= or a)`,
      );
    }

    let f = filtersByKey.get(key);
    if (!f) {
      f = { key };
      filtersByKey.set(key, f);
    }

    if (value !== undefined) {
      f.values = f.values || [];
      f.values.push(value);
    }
  }

  return Array.from(filtersByKey.values());
}
