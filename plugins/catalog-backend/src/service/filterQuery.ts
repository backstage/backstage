/*
 * Copyright 2020 Spotify AB
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

import { InputError } from '@backstage/backend-common';
import { EntityFilters } from '../database';

export function translateQueryToEntityFilters(
  query: Record<string, any>,
): EntityFilters[] {
  if (!query.filter) {
    return [];
  }

  const filterStrings = [query.filter].flat();

  if (filterStrings.some(s => typeof s !== 'string')) {
    throw new InputError(
      'Only string type filter query parameters are supported',
    );
  }

  return filterStrings
    .filter(Boolean)
    .map(translateFilterQueryEntryToEntityFilters);
}

// Parses the value of a filter=a=1,b=2 type query param
export function translateFilterQueryEntryToEntityFilters(
  filterString: string,
): EntityFilters {
  const filters: Record<string, (string | null)[]> = {};

  const addFilter = (key: string, value: string | null) => {
    const matchers = key in filters ? filters[key] : (filters[key] = []);
    matchers.push(value || null);
  };

  const statements = filterString
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

  for (const statement of statements) {
    const equalsIndex = statement.indexOf('=');
    if (equalsIndex < 0) {
      // Check presence, any value
      addFilter(statement, '*');
    } else {
      const key = statement.substr(0, equalsIndex).trim();
      const value = statement.substr(equalsIndex + 1).trim();
      if (!key) {
        throw new InputError('Malformed filter query');
      }
      addFilter(key, value);
    }
  }

  return filters;
}
