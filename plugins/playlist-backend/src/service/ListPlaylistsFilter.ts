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

import { InputError } from '@backstage/errors';

// TODO(kuangp): this filter shape was basically plagiarized from catalog-backend,
// it should probably be abstracted into a common plugin module to allow others to reuse the same pattern

/**
 * @public
 */
export type ListPlaylistsMatchFilter = {
  key: string;
  values: any[];
};

/**
 * @public
 */
export type ListPlaylistsFilter =
  | { allOf: ListPlaylistsFilter[] }
  | { anyOf: ListPlaylistsFilter[] }
  | { not: ListPlaylistsFilter }
  | ListPlaylistsMatchFilter;

export function parseListPlaylistsFilterParams(
  params: Record<string, unknown>,
): ListPlaylistsFilter | undefined {
  if (!params.filter) {
    return undefined;
  }

  // Each filter string is on the form a=b,c=d
  const filterStrings = [params.filter].flat();
  if (filterStrings.some(p => typeof p !== 'string')) {
    throw new InputError('Invalid filter');
  }

  // Outer array: "any of the inner ones"
  // Inner arrays: "all of these must match"
  const filters = (filterStrings as string[])
    .map(parseListPlaylistsFilterString)
    .filter(Boolean);
  if (!filters.length) {
    return undefined;
  }

  return { anyOf: filters.map(f => ({ allOf: f! })) };
}

export function parseListPlaylistsFilterString(
  filterString: string,
): ListPlaylistsMatchFilter[] | undefined {
  const statements = filterString
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

  if (!statements.length) {
    return undefined;
  }

  const filtersByKey = new Map<string, ListPlaylistsMatchFilter>();

  for (const statement of statements) {
    const equalsIndex = statement.indexOf('=');

    const key =
      equalsIndex === -1 ? statement : statement.substr(0, equalsIndex).trim();
    const value =
      equalsIndex === -1 ? undefined : statement.substr(equalsIndex + 1).trim();

    if (!key || !value) {
      throw new InputError(
        `Invalid filter, '${statement}' is not a valid statement (expected a string of the form a=b)`,
      );
    }

    const f = filtersByKey.has(key)
      ? filtersByKey.get(key)
      : filtersByKey.set(key, { key, values: [] }).get(key);

    f!.values.push(value);
  }

  return [...filtersByKey.values()];
}
