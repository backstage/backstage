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
} from './CatalogColumnBlueprint';
import { createExtensionTester } from '@backstage/frontend-test-utils';

describe('CatalogColumnBlueprint', () => {
  const mockColumn = { title: 'Test', field: 'metadata.name' };
  const ctx = (kind?: string): CatalogColumnFilterContext => ({
    kind,
    entities: [],
  });

  it('should return an extension with sensible defaults', () => {
    const extension = CatalogColumnBlueprint.make({
      name: 'test',
      params: { column: mockColumn },
    });

    expect(extension).toMatchInlineSnapshot(`
      {
        "$$type": "@backstage/ExtensionDefinition",
        "T": undefined,
        "attachTo": {
          "id": "page:catalog",
          "input": "columns",
        },
        "configSchema": {
          "parse": [Function],
          "schema": [Function],
        },
        "disabled": false,
        "factory": [Function],
        "if": undefined,
        "inputs": {},
        "kind": "catalog-column",
        "name": "test",
        "output": [
          [Function],
          {
            "$$type": "@backstage/ExtensionDataRef",
            "config": {
              "optional": true,
            },
            "id": "catalog.table-column-filter",
            "optional": [Function],
            "toString": [Function],
          },
        ],
        "override": [Function],
        "toString": [Function],
        "version": "v2",
      }
    `);
  });

  it('should output the column data ref', () => {
    const tester = createExtensionTester(
      CatalogColumnBlueprint.make({
        name: 'test',
        params: { column: mockColumn },
      }),
    );

    expect(tester.get(CatalogColumnBlueprint.dataRefs.column)).toBe(mockColumn);
  });

  it('should output the code filter when provided in params', () => {
    const mockFilter = (_ctx: CatalogColumnFilterContext) => true;

    const tester = createExtensionTester(
      CatalogColumnBlueprint.make({
        name: 'test',
        params: { column: mockColumn, filter: mockFilter },
      }),
    );

    expect(tester.get(CatalogColumnBlueprint.dataRefs.filter)).toBe(mockFilter);
  });

  it('should not output a filter when none is provided', () => {
    const tester = createExtensionTester(
      CatalogColumnBlueprint.make({
        name: 'test',
        params: { column: mockColumn },
      }),
    );

    expect(tester.get(CatalogColumnBlueprint.dataRefs.filter)).toBeUndefined();
  });

  it('should resolve a config filter predicate object', () => {
    const tester = createExtensionTester(
      CatalogColumnBlueprint.make({
        name: 'test',
        params: { column: mockColumn },
      }),
      { config: { filter: { kind: 'component' } } },
    );

    const filterFn = tester.get(CatalogColumnBlueprint.dataRefs.filter)!;
    expect(filterFn(ctx('component'))).toBe(true);
    expect(filterFn(ctx('user'))).toBe(false);
    expect(filterFn(ctx(undefined))).toBe(false);
  });

  it('should support $in operator in config filter', () => {
    const tester = createExtensionTester(
      CatalogColumnBlueprint.make({
        name: 'test',
        params: { column: mockColumn },
      }),
      { config: { filter: { kind: { $in: ['component', 'api'] } } } },
    );

    const filterFn = tester.get(CatalogColumnBlueprint.dataRefs.filter)!;
    expect(filterFn(ctx('component'))).toBe(true);
    expect(filterFn(ctx('api'))).toBe(true);
    expect(filterFn(ctx('user'))).toBe(false);
  });

  it('should support $not operator in config filter', () => {
    const tester = createExtensionTester(
      CatalogColumnBlueprint.make({
        name: 'test',
        params: { column: mockColumn },
      }),
      { config: { filter: { $not: { kind: 'user' } } } },
    );

    const filterFn = tester.get(CatalogColumnBlueprint.dataRefs.filter)!;
    expect(filterFn(ctx('component'))).toBe(true);
    expect(filterFn(ctx('user'))).toBe(false);
  });

  it('should AND config filter with code filter', () => {
    const codeFilter = (c: CatalogColumnFilterContext) => c.kind !== 'group';

    const tester = createExtensionTester(
      CatalogColumnBlueprint.make({
        name: 'test',
        params: { column: mockColumn, filter: codeFilter },
      }),
      { config: { filter: { kind: { $in: ['component', 'group'] } } } },
    );

    const filterFn = tester.get(CatalogColumnBlueprint.dataRefs.filter)!;
    // config allows component+group, code blocks group => only component passes
    expect(filterFn(ctx('component'))).toBe(true);
    expect(filterFn(ctx('group'))).toBe(false);
    // config blocks user
    expect(filterFn(ctx('user'))).toBe(false);
  });
});
