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
import {
  shallowExtensionInstance,
  createExtensionTester,
  renderInTestApp,
} from '@backstage/frontend-test-utils';
import { EntityContextMenuItemBlueprint } from './EntityContextMenuItemBlueprint';
import { screen, waitFor } from '@testing-library/react';
import { EntityProvider } from '@backstage/plugin-catalog-react';
import { Entity } from '@backstage/catalog-model';

jest.mock('../../hooks/useEntityContextMenu', () => ({
  useEntityContextMenu: () => ({
    onMenuClose: jest.fn(),
  }),
}));

describe('EntityContextMenuItemBlueprint', () => {
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

  it.each(data)('should return an extension with sane defaults', params => {
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
          "schema": {
            "$schema": "http://json-schema.org/draft-07/schema#",
            "additionalProperties": false,
            "properties": {
              "filter": {
                "anyOf": [
                  {
                    "anyOf": [
                      {
                        "additionalProperties": {
                          "anyOf": [
                            {
                              "type": [
                                "string",
                                "number",
                                "boolean",
                              ],
                            },
                            {
                              "additionalProperties": false,
                              "properties": {
                                "$exists": {
                                  "type": "boolean",
                                },
                              },
                              "required": [
                                "$exists",
                              ],
                              "type": "object",
                            },
                            {
                              "additionalProperties": false,
                              "properties": {
                                "$in": {
                                  "items": {
                                    "$ref": "#/properties/filter/anyOf/0/anyOf/0/additionalProperties/anyOf/0",
                                  },
                                  "type": "array",
                                },
                              },
                              "required": [
                                "$in",
                              ],
                              "type": "object",
                            },
                            {
                              "additionalProperties": false,
                              "properties": {
                                "$contains": {
                                  "$ref": "#/properties/filter",
                                },
                              },
                              "required": [
                                "$contains",
                              ],
                              "type": "object",
                            },
                          ],
                        },
                        "propertyNames": {
                          "pattern": "^(?!\\$).*$",
                        },
                        "type": "object",
                      },
                      {
                        "additionalProperties": {
                          "not": {},
                        },
                        "propertyNames": {
                          "pattern": "^\\$",
                        },
                        "type": "object",
                      },
                    ],
                  },
                  {
                    "$ref": "#/properties/filter/anyOf/0/anyOf/0/additionalProperties/anyOf/0",
                  },
                  {
                    "additionalProperties": false,
                    "properties": {
                      "$all": {
                        "items": {
                          "$ref": "#/properties/filter",
                        },
                        "type": "array",
                      },
                    },
                    "required": [
                      "$all",
                    ],
                    "type": "object",
                  },
                  {
                    "additionalProperties": false,
                    "properties": {
                      "$any": {
                        "items": {
                          "$ref": "#/properties/filter",
                        },
                        "type": "array",
                      },
                    },
                    "required": [
                      "$any",
                    ],
                    "type": "object",
                  },
                  {
                    "additionalProperties": false,
                    "properties": {
                      "$not": {
                        "$ref": "#/properties/filter",
                      },
                    },
                    "required": [
                      "$not",
                    ],
                    "type": "object",
                  },
                ],
              },
            },
            "type": "object",
          },
        },
        "disabled": false,
        "factory": [Function],
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

  it('should render a menu item', async () => {
    const extension = EntityContextMenuItemBlueprint.make({
      name: 'test',
      params: {
        icon: <span>Icon</span>,
        useProps: () => ({
          title: 'Test',
          onClick: () => {},
        }),
      },
    });

    renderInTestApp(
      <EntityProvider
        entity={{
          apiVersion: 'v1',
          kind: 'Component',
          metadata: { name: 'test' },
        }}
      >
        <ul>{createExtensionTester(extension).reactElement()}</ul>
      </EntityProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText('Test')).toBeInTheDocument();
    });
  });

  it.each([
    { filter: { kind: 'Api' } },
    { filter: (e: Entity) => e.kind.toLowerCase() === 'api' },
  ])('should return a filter function', async ({ filter }) => {
    const extension = EntityContextMenuItemBlueprint.make({
      name: 'test',
      params: {
        icon: <span>Icon</span>,
        useProps: () => ({ title: 'Test', onClick: () => {} }),
        filter,
      },
    });

    const instance = shallowExtensionInstance(extension);

    const filterFn = instance.get(
      EntityContextMenuItemBlueprint.dataRefs.filterFunction,
    );

    expect(filterFn).toBeDefined();
    expect(filterFn?.({ kind: 'Api' } as Entity)).toBe(true);
    expect(filterFn?.({ kind: 'Component' } as Entity)).toBe(false);
  });
});
