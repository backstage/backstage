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
import { createExtensionTester } from '@backstage/frontend-test-utils';
import {
  EntityContextMenuItemBlueprint,
  type EntityContextMenuItemParams,
} from './EntityContextMenuItemBlueprint';
import { Entity } from '@backstage/catalog-model';

describe('EntityContextMenuItemBlueprint', () => {
  function getMenuItemData(params: EntityContextMenuItemParams) {
    const extension = EntityContextMenuItemBlueprint.make({
      name: 'test',
      params,
    });

    return createExtensionTester(extension).get(
      EntityContextMenuItemBlueprint.dataRefs.data,
    );
  }

  const data = [
    {
      icon: <span>Test</span>,
      useProps: () => ({
        title: 'Test',
        href: '/somewhere',
        component: 'a',
        disabled: true,
      }),
    },
    {
      icon: <span>Test</span>,
      useProps: () => ({
        title: 'Test',
        onClick: async () => {},
      }),
    },
  ];

  it.each(data)('should return an extension with sane defaults, %#', params => {
    const extension = EntityContextMenuItemBlueprint.make({
      name: 'test',
      params,
    });

    expect(extension).toMatchInlineSnapshot(`
      {
        "$$type": "@backstage/ExtensionDefinition",
        "T": undefined,
        "attachTo": {
          "id": "page:catalog/entity",
          "input": "contextMenuItems",
        },
        "configSchema": {
          "parse": [Function],
          "schema": [Function],
        },
        "disabled": false,
        "factory": [Function],
        "if": undefined,
        "inputs": {},
        "kind": "entity-context-menu-item",
        "name": "test",
        "output": [
          [Function],
          {
            "$$type": "@backstage/ExtensionDataRef",
            "config": {
              "optional": true,
            },
            "id": "catalog.entity-filter-function",
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

  it('should output menu item data', () => {
    const icon = <span>Icon</span>;
    const useProps = () => ({ title: 'Test', onClick: () => {} });

    expect(getMenuItemData({ icon, useProps })).toEqual({
      icon,
      useProps,
    });
  });

  it.each([
    { filter: { kind: 'Api' } },
    { filter: (e: Entity) => e.kind.toLowerCase() === 'api' },
  ])('should return a filter function, %#', async ({ filter }) => {
    const extension = EntityContextMenuItemBlueprint.make({
      name: 'test',
      params: {
        icon: <span>Icon</span>,
        useProps: () => ({ title: 'Test', onClick: () => {} }),
        filter,
      },
    });

    const tester = createExtensionTester(extension);

    const filterFn = tester.get(
      EntityContextMenuItemBlueprint.dataRefs.filterFunction,
    );

    expect(filterFn).toBeDefined();
    expect(filterFn?.({ kind: 'Api' } as Entity)).toBe(true);
    expect(filterFn?.({ kind: 'Component' } as Entity)).toBe(false);
  });
});
