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

import {
  CatalogColumnBlueprint,
  type CatalogColumnFilterContext,
  type CatalogColumnFilterFn,
} from '@backstage/plugin-catalog-react/alpha';
import { createExtensionTester } from '@backstage/frontend-test-utils';
import columns from './columns';

const ctx = (kind?: string): CatalogColumnFilterContext => ({
  kind,
  entities: [],
});

function getFilter(extension: any): CatalogColumnFilterFn | undefined {
  return createExtensionTester(extension).get(
    CatalogColumnBlueprint.dataRefs.filter,
  );
}

describe('default catalog columns', () => {
  it('should export seven columns', () => {
    expect(columns).toHaveLength(7);
  });

  it('should show name column for all kinds', () => {
    const filter = getFilter(columns[0]);
    expect(filter).toBeUndefined();
  });

  it('should hide system column for user, domain, system, group, template, and location kinds', () => {
    const filter = getFilter(columns[1])!;
    expect(filter).toBeDefined();

    expect(filter(ctx('component'))).toBe(true);
    expect(filter(ctx('api'))).toBe(true);
    expect(filter(ctx(undefined))).toBe(true);

    expect(filter(ctx('user'))).toBe(false);
    expect(filter(ctx('domain'))).toBe(false);
    expect(filter(ctx('system'))).toBe(false);
    expect(filter(ctx('group'))).toBe(false);
    expect(filter(ctx('template'))).toBe(false);
    expect(filter(ctx('location'))).toBe(false);
  });

  it('should hide owner column for user, group, template, and location kinds', () => {
    const filter = getFilter(columns[2])!;
    expect(filter).toBeDefined();

    expect(filter(ctx('component'))).toBe(true);
    expect(filter(ctx('api'))).toBe(true);
    expect(filter(ctx('domain'))).toBe(true);

    expect(filter(ctx('user'))).toBe(false);
    expect(filter(ctx('group'))).toBe(false);
    expect(filter(ctx('template'))).toBe(false);
    expect(filter(ctx('location'))).toBe(false);
  });

  it('should hide type column only for user kind', () => {
    const filter = getFilter(columns[3])!;
    expect(filter).toBeDefined();

    expect(filter(ctx('component'))).toBe(true);
    expect(filter(ctx('api'))).toBe(true);
    expect(filter(ctx('group'))).toBe(true);
    expect(filter(ctx(undefined))).toBe(true);

    expect(filter(ctx('user'))).toBe(false);
  });

  it('should hide lifecycle column for user, domain, system, group, template, and location kinds', () => {
    const filter = getFilter(columns[4])!;
    expect(filter).toBeDefined();

    expect(filter(ctx('component'))).toBe(true);
    expect(filter(ctx('api'))).toBe(true);

    expect(filter(ctx('user'))).toBe(false);
    expect(filter(ctx('domain'))).toBe(false);
    expect(filter(ctx('system'))).toBe(false);
    expect(filter(ctx('group'))).toBe(false);
    expect(filter(ctx('template'))).toBe(false);
    expect(filter(ctx('location'))).toBe(false);
  });

  it('should hide description column only for location kind', () => {
    const filter = getFilter(columns[5])!;
    expect(filter).toBeDefined();

    expect(filter(ctx('component'))).toBe(true);
    expect(filter(ctx('user'))).toBe(true);
    expect(filter(ctx(undefined))).toBe(true);

    expect(filter(ctx('location'))).toBe(false);
  });

  it('should hide tags column only for location kind', () => {
    const filter = getFilter(columns[6])!;
    expect(filter).toBeDefined();

    expect(filter(ctx('component'))).toBe(true);
    expect(filter(ctx('user'))).toBe(true);
    expect(filter(ctx(undefined))).toBe(true);

    expect(filter(ctx('location'))).toBe(false);
  });

  it('should handle case-insensitive kind matching', () => {
    const systemFilter = getFilter(columns[1])!;
    expect(systemFilter(ctx('User'))).toBe(false);
    expect(systemFilter(ctx('USER'))).toBe(false);
    expect(systemFilter(ctx('Component'))).toBe(true);
  });
});
