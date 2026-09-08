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
import { entityRefFilterAndSearch } from './filterEntities';

describe('entityRefFilterAndSearch', () => {
  it('matches case-insensitively on a substring of the entity ref', () => {
    const row = { entity_ref: 'component:default/My-Service' };

    expect(entityRefFilterAndSearch('my-service', row)).toBe(true);
    expect(entityRefFilterAndSearch('DEFAULT', row)).toBe(true);
    expect(entityRefFilterAndSearch('component', row)).toBe(true);
    expect(entityRefFilterAndSearch('missing', row)).toBe(false);
  });

  it('treats an empty query as matching every row', () => {
    expect(
      entityRefFilterAndSearch('', { entity_ref: 'component:default/a' }),
    ).toBe(true);
  });

  it('does not throw when the row, entity_ref or query is nullish', () => {
    // Regression: a null entity_ref (or query) used to throw
    // "Cannot read properties of null (reading 'toLocaleUpperCase')"
    // and break the entire table while searching.
    expect(entityRefFilterAndSearch('anything', { entity_ref: null })).toBe(
      false,
    );
    expect(
      entityRefFilterAndSearch('anything', { entity_ref: undefined }),
    ).toBe(false);
    expect(entityRefFilterAndSearch('anything', null)).toBe(false);
    expect(entityRefFilterAndSearch('anything', undefined)).toBe(false);
    expect(
      entityRefFilterAndSearch(null, { entity_ref: 'component:default/a' }),
    ).toBe(true);
    expect(entityRefFilterAndSearch(null, null)).toBe(true);
    expect(entityRefFilterAndSearch('', null)).toBe(true);
  });
});
