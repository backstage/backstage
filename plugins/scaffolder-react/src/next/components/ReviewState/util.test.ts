/*
 * Copyright 2022 The Backstage Authors
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

import { flattenObject, isJsonObject } from './util';
import { Draft07 as JSONSchema } from 'json-schema-library';
import { ParsedTemplateSchema } from '../../hooks/useTemplateSchema';

describe('isJsonObject', () => {
  it('should return true for non-null objects', () => {
    expect(isJsonObject({})).toBe(true);
    expect(isJsonObject({ key: 'value' })).toBe(true);
  });

  it('should return false for null', () => {
    expect(isJsonObject(null)).toBe(false);
  });

  it('should return false for arrays', () => {
    expect(isJsonObject([])).toBe(false);
    expect(isJsonObject([1, 2, 3])).toBe(false);
  });

  it('should return false for non-objects', () => {
    expect(isJsonObject('string')).toBe(false);
    expect(isJsonObject(123)).toBe(false);
    expect(isJsonObject(true)).toBe(false);
    expect(isJsonObject(undefined)).toBe(false);
  });
});

describe('flattenObject', () => {
  it('should handle an empty object', () => {
    const schemas: ParsedTemplateSchema[] = [
      {
        mergedSchema: {
          type: 'object',
          properties: {
            name: {
              type: 'object',
              'ui:backstage': {
                review: {
                  explode: true,
                },
              },
              properties: {},
            },
          },
        },
        schema: {},
        title: 'test',
        uiSchema: {},
      },
    ];

    const parsedSchema = new JSONSchema(schemas[0].mergedSchema);

    const result = flattenObject({}, '', parsedSchema, {});

    expect(result).toEqual([]);
  });

  it('should flatten a simple object', () => {
    const formState = {
      name: {
        foo: 'value1',
        bar: 'value2',
      },
    };

    const schemas: ParsedTemplateSchema[] = [
      {
        mergedSchema: {
          type: 'object',
          properties: {
            name: {
              type: 'object',
              'ui:backstage': {
                review: {
                  explode: true,
                },
              },
              properties: {
                foo: {
                  type: 'string',
                },
                bar: {
                  type: 'string',
                },
              },
            },
          },
        },
        schema: {},
        title: 'test',
        uiSchema: {},
      },
    ];

    const [key, value] = Object.entries(formState)[0];
    const parsedSchema = new JSONSchema(schemas[0].mergedSchema);

    const result = flattenObject(value, key, parsedSchema, formState);

    expect(result).toEqual([
      ['foo', 'value1'],
      ['bar', 'value2'],
    ]);
  });

  it('should recurse into a nested object', () => {
    const formState = {
      name: {
        foo: 'value1',
        bar: 'value2',
        example: {
          test: 'value3',
        },
      },
    };
    const schemas: ParsedTemplateSchema[] = [
      {
        mergedSchema: {
          type: 'object',
          properties: {
            name: {
              type: 'object',
              'ui:backstage': {
                review: {
                  explode: true,
                },
              },
              properties: {
                foo: {
                  type: 'string',
                },
                bar: {
                  type: 'string',
                },
                example: {
                  type: 'object',
                  'ui:backstage': {
                    review: {
                      explode: true,
                    },
                  },
                  properties: {
                    test: {
                      type: 'string',
                    },
                  },
                },
              },
            },
          },
        },
        schema: {},
        title: 'test',
        uiSchema: {},
      },
    ];

    const [key, value] = Object.entries(formState)[0];
    const parsedSchema = new JSONSchema(schemas[0].mergedSchema);

    const result = flattenObject(value, key, parsedSchema, formState);

    expect(result).toEqual([
      ['foo', 'value1'],
      ['bar', 'value2'],
      ['test', 'value3'],
    ]);
  });
});
