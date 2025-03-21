/*
 * Copyright 2024 The Backstage Authors
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
import React from 'react';
import { EntityContentBlueprint } from './EntityContentBlueprint';
import {
  createExtensionTester,
  renderInTestApp,
} from '@backstage/frontend-test-utils';
import {
  coreExtensionData,
  createExtension,
  createExtensionInput,
  createRouteRef,
} from '@backstage/frontend-plugin-api';
import { Entity } from '@backstage/catalog-model';
import { waitFor, screen } from '@testing-library/react';

describe('EntityContentBlueprint', () => {
  it('should return an extension with sane defaults', () => {
    const extension = EntityContentBlueprint.make({
      name: 'test',
      params: {
        defaultPath: '/test',
        defaultTitle: 'Test',
        loader: async () => <div>Test!</div>,
      },
    });

    expect(extension).toMatchInlineSnapshot(`
      {
        "$$type": "@backstage/ExtensionDefinition",
        "T": undefined,
        "attachTo": {
          "id": "page:catalog/entity",
          "input": "contents",
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
                    "type": "string",
                  },
                  {
                    "anyOf": [
                      {
                        "anyOf": [
                          {
                            "type": [
                              "string",
                              "number",
                              "boolean",
                            ],
                          },
                          {
                            "items": {
                              "$ref": "#/properties/filter/anyOf/1/anyOf/0/anyOf/0",
                            },
                            "type": "array",
                          },
                        ],
                      },
                      {
                        "additionalProperties": false,
                        "properties": {
                          "$all": {
                            "items": {
                              "$ref": "#/properties/filter/anyOf/1",
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
                              "$ref": "#/properties/filter/anyOf/1",
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
                            "$ref": "#/properties/filter/anyOf/1",
                          },
                        },
                        "required": [
                          "$not",
                        ],
                        "type": "object",
                      },
                      {
                        "additionalProperties": {
                          "anyOf": [
                            {
                              "$ref": "#/properties/filter/anyOf/1/anyOf/0",
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
                                    "$ref": "#/properties/filter/anyOf/1/anyOf/0/anyOf/0",
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
                                  "$ref": "#/properties/filter/anyOf/1",
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
                    ],
                  },
                ],
              },
              "group": {
                "anyOf": [
                  {
                    "const": false,
                    "type": "boolean",
                  },
                  {
                    "type": "string",
                  },
                ],
              },
              "path": {
                "type": "string",
              },
              "title": {
                "type": "string",
              },
            },
            "type": "object",
          },
        },
        "disabled": false,
        "factory": [Function],
        "inputs": {},
        "kind": "entity-content",
        "name": "test",
        "output": [
          [Function],
          [Function],
          [Function],
          {
            "$$type": "@backstage/ExtensionDataRef",
            "config": {
              "optional": true,
            },
            "id": "core.routing.ref",
            "optional": [Function],
            "toString": [Function],
          },
          {
            "$$type": "@backstage/ExtensionDataRef",
            "config": {
              "optional": true,
            },
            "id": "catalog.entity-filter-function",
            "optional": [Function],
            "toString": [Function],
          },
          {
            "$$type": "@backstage/ExtensionDataRef",
            "config": {
              "optional": true,
            },
            "id": "catalog.entity-filter-expression",
            "optional": [Function],
            "toString": [Function],
          },
          {
            "$$type": "@backstage/ExtensionDataRef",
            "config": {
              "optional": true,
            },
            "id": "catalog.entity-content-group",
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

  it('should emit the correct defaults', () => {
    const mockRouteRef = createRouteRef();
    const extension = EntityContentBlueprint.make({
      name: 'test',
      params: {
        defaultPath: '/test',
        defaultTitle: 'Test',
        routeRef: mockRouteRef,
        loader: async () => <div>Test!</div>,
      },
    });

    const tester = createExtensionTester(extension);

    // todo(blam): route paths are always set to / in the createExtensionTester. This will work eventually.
    // expect(tester.get(coreExtensionData.routePath)).toBe('/test');

    expect(tester.get(coreExtensionData.routeRef)).toBe(mockRouteRef);
    expect(tester.get(EntityContentBlueprint.dataRefs.title)).toBe('Test');
  });

  it('should emit the correct filter output', () => {
    const mockFilter = (_entity: Entity) => true;

    expect(
      createExtensionTester(
        EntityContentBlueprint.make({
          name: 'test',
          params: {
            defaultPath: '/test',
            defaultTitle: 'Test',
            loader: async () => <div>Test!</div>,
            filter: 'test',
          },
        }),
      ).get(EntityContentBlueprint.dataRefs.filterExpression),
    ).toBe('test');

    expect(
      createExtensionTester(
        EntityContentBlueprint.make({
          name: 'test',
          params: {
            defaultPath: '/test',
            defaultTitle: 'Test',
            loader: async () => <div>Test!</div>,
          },
        }),
        { config: { filter: 'test' } },
      ).get(EntityContentBlueprint.dataRefs.filterExpression),
    ).toBe('test');

    expect(
      createExtensionTester(
        EntityContentBlueprint.make({
          name: 'test',
          params: {
            defaultPath: '/test',
            defaultTitle: 'Test',
            filter: mockFilter,
            loader: async () => <div>Test!</div>,
          },
        }),
      ).get(EntityContentBlueprint.dataRefs.filterFunction),
    ).toBe(mockFilter);
  });

  it('should allow overriding config and inputs', async () => {
    const extension = EntityContentBlueprint.makeWithOverrides({
      name: 'test',
      inputs: {
        mock: createExtensionInput([coreExtensionData.reactElement]),
      },
      config: {
        schema: {
          mock: z => z.string(),
        },
      },
      factory(originalFactory, { inputs, config }) {
        return originalFactory({
          defaultPath: '/test',
          defaultTitle: 'Test',
          loader: async () => (
            <div data-testid="test">
              config: {config.mock}
              <div data-testid="contents">
                {inputs.mock.map((i, k) => (
                  <div key={k}>{i.get(coreExtensionData.reactElement)}</div>
                ))}
              </div>
            </div>
          ),
        });
      },
    });

    const mockExtension = createExtension({
      attachTo: { id: 'entity-content:test', input: 'mock' },
      output: [coreExtensionData.reactElement],
      factory() {
        return [coreExtensionData.reactElement(<div>im a mock</div>)];
      },
    });

    renderInTestApp(
      createExtensionTester(extension, { config: { mock: 'mock test config' } })
        .add(mockExtension)
        .reactElement(),
    );

    await waitFor(() => {
      expect(screen.getByTestId('test')).toBeInTheDocument();
      expect(screen.getByTestId('test')).toHaveTextContent(
        'config: mock test config',
      );
      expect(screen.getByTestId('contents')).toHaveTextContent('im a mock');
    });
  });
});
