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

import { DefaultCatalogGraphApi } from './DefaultCatalogGraphApi';

describe('DefaultCatalogGraphApi', () => {
  it('default config', async () => {
    const { defaultRelations } = new DefaultCatalogGraphApi();

    expect(defaultRelations.includes('')).toBe(false);
    expect(defaultRelations.includes('fooRelation')).toBe(false);
    expect(defaultRelations.includes('ownedBy')).toBe(true);
    expect(defaultRelations.includes('hasPart')).toBe(true);
  });

  it('empty include config', async () => {
    const { defaultRelations } = new DefaultCatalogGraphApi({
      defaultRelationTypes: { include: [] },
    });

    expect(defaultRelations.includes('')).toBe(false);
    expect(defaultRelations.includes('fooRelation')).toBe(false);
    expect(defaultRelations.includes('ownedBy')).toBe(false);
    expect(defaultRelations.includes('hasPart')).toBe(false);
  });

  it('include config', async () => {
    const { defaultRelations } = new DefaultCatalogGraphApi({
      defaultRelationTypes: { include: ['ownedBy'] },
    });

    expect(defaultRelations.includes('')).toBe(false);
    expect(defaultRelations.includes('fooRelation')).toBe(false);
    expect(defaultRelations.includes('ownedBy')).toBe(true);
    expect(defaultRelations.includes('hasPart')).toBe(false);
  });

  it('exclude config', async () => {
    const { defaultRelations } = new DefaultCatalogGraphApi({
      defaultRelationTypes: { exclude: ['ownedBy', 'ownerOf'] },
    });

    expect(defaultRelations.includes('')).toBe(false);
    expect(defaultRelations.includes('fooRelation')).toBe(false);
    expect(defaultRelations.includes('ownedBy')).toBe(false);
    expect(defaultRelations.includes('hasPart')).toBe(true);
  });
});
