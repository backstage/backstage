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

  it('does not throw on a null entity_ref', () => {
    // Regression: a null entity_ref used to throw and break the entire table
    // while searching.
    expect(entityRefFilterAndSearch('anything', { entity_ref: null })).toBe(
      false,
    );
  });
});
