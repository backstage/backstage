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
import { EntityCardBlueprint } from './EntityCardBlueprint';
import {
  coreExtensionData,
  createExtension,
  createExtensionInput,
} from '@backstage/frontend-plugin-api';
import {
  createExtensionTester,
  renderInTestApp,
} from '@backstage/frontend-test-utils';
import { waitFor, screen } from '@testing-library/react';
import { Entity } from '@backstage/catalog-model';

describe('EntityCardBlueprint', () => {
  it('should return an extension with sensible defaults', () => {
    const extension = EntityCardBlueprint.make({
      name: 'test',
      params: {
        filter: 'has:labels',
        loader: async () => <div>im a card</div>,
      },
    });

    expect(extension).toMatchInlineSnapshot(`
      {
        "$$type": "@backstage/ExtensionDefinition",
        "T": undefined,
        "attachTo": {
          "id": "entity-content:catalog/overview",
          "input": "cards",
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
              "type": {
                "enum": [
                  "summary",
                  "info",
                  "content",
                ],
                "type": "string",
              },
            },
            "type": "object",
          },
        },
        "disabled": false,
        "factory": [Function],
        "inputs": {},
        "kind": "entity-card",
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
            "id": "catalog.entity-card-type",
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

  it('should output the correct filter output', () => {
    const mockFilter = (_entity: Entity) => true;

    expect(
      createExtensionTester(
        EntityCardBlueprint.make({
          name: 'test',
          params: {
            loader: async () => <div>Test!</div>,
            filter: 'test',
          },
        }),
      ).get(EntityCardBlueprint.dataRefs.filterExpression),
    ).toBe('test');

    expect(
      createExtensionTester(
        EntityCardBlueprint.make({
          name: 'test',
          params: {
            loader: async () => <div>Test!</div>,
          },
        }),
        { config: { filter: 'test' } },
      ).get(EntityCardBlueprint.dataRefs.filterExpression),
    ).toBe('test');

    expect(
      createExtensionTester(
        EntityCardBlueprint.make({
          name: 'test',
          params: {
            filter: mockFilter,
            loader: async () => <div>Test!</div>,
          },
        }),
      ).get(EntityCardBlueprint.dataRefs.filterFunction),
    ).toBe(mockFilter);
  });

  it('should allow overriding config and inputs', async () => {
    const extension = EntityCardBlueprint.makeWithOverrides({
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
      attachTo: { id: 'entity-card:test', input: 'mock' },
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
