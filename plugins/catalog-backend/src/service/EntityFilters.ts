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
import { EntitiesSearchFilter, EntityFilter } from '../database';

/**
 * A builder that assists in creating entity filter instances.
 */
export class EntityFilters {
  // Builds a filter from the value of a filter=a=1,b=2 type filter string
  static ofFilterString(filterString: string): EntityFilter | undefined {
    const builder = new EntityFilters();
    builder.addFilterString(filterString);
    return builder.build();
  }

  // Builds a filter from an entire query params structure
  static ofQuery(query: Record<string, any>): EntityFilter | undefined {
    const filterStrings = [query.filter || []].flat();

    if (filterStrings.some(f => typeof f !== 'string')) {
      throw new InputError(
        'Only string type filter query parameters are supported',
      );
    }

    const builder = new EntityFilters();
    for (const filterString of filterStrings) {
      builder.addFilterString(filterString);
    }

    return builder.build();
  }

  // Builds a filter from a { key: value } matcher object
  static ofMatchers(
    matchers: Record<string, string | string[]>,
  ): EntityFilter | undefined {
    const builder = new EntityFilters();
    builder.addMatchers(matchers);
    return builder.build();
  }

  private filters: EntitiesSearchFilter[][];

  constructor() {
    this.filters = [];
  }

  addFilterString(filterString: string): EntityFilters {
    const filtersByKey: Record<string, EntitiesSearchFilter> = {};

    const addFilter = (key: string, value: string) => {
      const f =
        key in filtersByKey
          ? filtersByKey[key]
          : (filtersByKey[key] = { key, matchValueIn: [] });
      f.matchValueIn!.push(value);
    };

    const statements = filterString
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    for (const statement of statements) {
      const equalsIndex = statement.indexOf('=');
      if (equalsIndex < 1) {
        throw new InputError('Malformed filter query');
      } else {
        const key = statement.substr(0, equalsIndex).trim();
        const value = statement.substr(equalsIndex + 1).trim();
        if (!key || !value) {
          throw new InputError('Malformed filter query');
        }
        addFilter(key, value);
      }
    }

    this.filters.push(Object.values(filtersByKey));

    return this;
  }

  addMatchers(matchers: Record<string, string | string[]>): EntityFilters {
    const filters: EntitiesSearchFilter[] = [];

    for (const [key, value] of Object.entries(matchers)) {
      filters.push({ key, matchValueIn: [value].flat() });
    }

    if (filters.length) {
      this.filters.push(filters);
    }

    return this;
  }

  build(): EntityFilter | undefined {
    if (!this.filters.length) {
      return undefined;
    }

    return { anyOf: this.filters.map(f => ({ allOf: f })) };
  }
}
