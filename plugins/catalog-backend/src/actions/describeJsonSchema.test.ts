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
  describeJsonSchemaFields,
  JsonSchemaField,
  renderJsonSchemaField,
} from './describeJsonSchema';

// Renders the fields of an object schema with the given properties
function fieldLines(
  properties: Record<string, unknown>,
  options: { maxDepth?: number; omit?: string[]; required?: string[] } = {},
): string[] {
  return describeJsonSchemaFields(
    { type: 'object', required: options.required, properties },
    {
      maxDepth: options.maxDepth ?? 3,
      omitRootProperties: options.omit ? new Set(options.omit) : undefined,
    },
  ).map(renderJsonSchemaField);
}

describe('describeJsonSchemaFields', () => {
  it('describes types, references and allowed values', () => {
    expect(
      fieldLines(
        {
          text: { type: 'string' },
          either: { type: ['string', 'number'] },
          none: { type: [] },
          untyped: {},
          ref: { $ref: '#/definitions/A' },
          typedRef: { type: 'object', $ref: '#/definitions/A' },
          choice: { type: 'string', enum: ['b', 'a'] },
          single: { enum: ['only'] },
          empty: { enum: [] },
          fixed: { const: { b: 2, a: [1, { d: 4, c: 3 }] } },
          nothing: { const: null },
          pinned: { enum: ['a', 'b'], const: 'b' },
          conflicting: { enum: ['a'], const: 'b' },
          keyOrder: {
            enum: [{ host: 'a', port: 1 }],
            const: { port: 1, host: 'a' },
          },
        },
        { required: ['text', 'ref'] },
      ),
    ).toEqual([
      '* "text" (string, required)',
      '* "either" (string | number)',
      '* "none" (no valid type)',
      '* "untyped" (unknown)',
      '* "ref" (reference to "#/definitions/A", required)',
      '* "typedRef" (object, reference to "#/definitions/A")',
      // A single enum keeps its declared order
      '* "choice" (string, one of "b", "a")',
      '* "single" (unknown, one of "only")',
      '* "empty" (unknown, no allowed values)',
      // Object keys are sorted, at any depth
      '* "fixed" (unknown, const {"a":[1,{"c":3,"d":4}],"b":2})',
      '* "nothing" (unknown, const null)',
      // const and enum narrow each other, comparing values deeply
      '* "pinned" (unknown, const "b")',
      '* "conflicting" (unknown, no allowed values)',
      '* "keyOrder" (unknown, const {"host":"a","port":1})',
    ]);
  });

  it('describes bounds, formats, patterns and defaults', () => {
    expect(
      fieldLines({
        count: {
          type: 'integer',
          minimum: 0,
          exclusiveMinimum: -1,
          maximum: 10,
          exclusiveMaximum: 11,
          default: 5,
        },
        name: { type: 'string', minLength: 1 },
        code: {
          type: 'string',
          minLength: 2,
          maxLength: 1,
          format: 'email',
          pattern: '^"a"\\d',
        },
        list: { type: 'array', minItems: 1, maxItems: 2 },
        map: { type: 'object', minProperties: 0, maxProperties: 1 },
        options: { type: 'object', default: { b: true, a: null } },
        // Bounds that are not numbers are ignored
        legacy: { type: 'number', exclusiveMinimum: true, maxLength: '5' },
      }),
    ).toEqual([
      '* "count" (integer, min 0, over -1, max 10, under 11, default 5)',
      // A minimum length of 1 only rules out empty strings and is left out
      '* "name" (string)',
      '* "code" (string, min length 2, max length 1, format: email, pattern: "^\\"a\\"\\\\d")',
      '* "list" (array, at least 1 item, at most 2 items)',
      '* "map" (object, at least 0 keys, at most 1 key)',
      '* "options" (object, default {"a":null,"b":true})',
      '* "legacy" (number)',
    ]);
  });

  it('describes arrays, tuples and boolean schemas', () => {
    expect(
      fieldLines(
        {
          tags: { type: 'array', items: { type: 'string', enum: ['x'] } },
          plain: { type: 'array' },
          anyItems: { type: 'array', items: true },
          noItems: { type: 'array', items: false },
          refs: { type: 'array', items: { $ref: '#/definitions/Ref' } },
          matrix: {
            type: 'array',
            items: { type: 'array', items: { type: 'number', const: 0 } },
          },
          pair: {
            type: 'array',
            items: [{ type: 'string' }, true, false, 7],
            additionalItems: false,
          },
          point: {
            type: 'array',
            prefixItems: [{ type: 'number' }],
            items: { type: 'string' },
          },
          open: { type: 'array', prefixItems: [{ type: 'number' }] },
          anything: true,
          forbidden: false,
          // Values that are not schemas are skipped
          broken: 'string',
        },
        { required: ['forbidden'] },
      ),
    ).toEqual([
      '* "tags" (array of string [one of "x"])',
      '* "plain" (array)',
      '* "anyItems" (array)',
      '* "noItems" (empty array)',
      '* "refs" (array of reference to "#/definitions/Ref")',
      '* "matrix" (array of array of number [const 0])',
      '* "pair" (tuple of [string, any value, nothing, unknown] with no further items)',
      '* "point" (tuple of [number] followed by string)',
      '* "open" (tuple of [number])',
      '* "anything" (any value)',
      '* "forbidden" (not allowed, required)',
    ]);
  });

  it('lists nested fields down to the maximum depth and marks the rest', () => {
    const lines = fieldLines(
      {
        id: { type: 'string' },
        a: {
          type: 'object',
          required: ['b'],
          properties: {
            b: {
              type: 'object',
              properties: { c: { type: 'object', properties: { d: {} } } },
            },
          },
        },
        endpoints: {
          type: 'array',
          items: {
            type: 'object',
            required: ['url'],
            properties: { url: { type: 'string' } },
          },
        },
        matrix: {
          type: 'array',
          items: {
            type: 'array',
            items: { type: 'object', properties: { cell: {} } },
          },
        },
        pair: {
          type: 'array',
          items: [{ type: 'object', properties: { x: {} } }],
        },
        rest: {
          type: 'array',
          prefixItems: [{ type: 'string' }],
          items: { type: 'object', properties: { y: {} } },
        },
        // Arrays of arrays without object items have nothing more to list
        grid: { type: 'array', items: { type: 'array' } },
      },
      { omit: ['id'] },
    );

    expect(lines).toEqual([
      '* "a" (object)',
      '* "a.b" (object, required)',
      '* "a.b.c" (object, has nested fields not listed here)',
      '* "endpoints" (array of object)',
      '* "endpoints.url" (string, required)',
      '* "matrix" (array of array of object, has nested fields not listed here)',
      '* "pair" (tuple of [object], has nested fields not listed here)',
      '* "rest" (tuple of [string] followed by object, has nested fields not listed here)',
      '* "grid" (array of array)',
    ]);

    // Omitting only applies to root properties, and depth counts from them
    expect(
      fieldLines(
        {
          id: { type: 'string' },
          nested: { type: 'object', properties: { id: { type: 'string' } } },
        },
        { maxDepth: 1, omit: ['id'] },
      ),
    ).toEqual(['* "nested" (object, has nested fields not listed here)']);
    expect(
      fieldLines(
        { nested: { type: 'object', properties: { id: { type: 'string' } } } },
        { omit: ['id'] },
      ),
    ).toEqual(['* "nested" (object)', '* "nested.id" (string)']);
  });

  it('marks keys and constraints that are not listed', () => {
    const conditional = [
      'allOf',
      'anyOf',
      'oneOf',
      'if',
      'then',
      'else',
      'not',
      'dependencies',
      'dependentRequired',
      'dependentSchemas',
    ];
    expect(
      fieldLines(
        Object.fromEntries(
          conditional.map(keyword => [
            keyword,
            { type: 'object', [keyword]: keyword === 'not' ? {} : [] },
          ]),
        ),
      ),
    ).toEqual(
      conditional.map(
        keyword =>
          `* "${keyword}" (object, has conditional constraints not listed here)`,
      ),
    );

    expect(
      fieldLines({
        labels: { type: 'object', additionalProperties: { type: 'string' } },
        closed: { type: 'object', additionalProperties: false },
        open: { type: 'object', additionalProperties: true },
        patterned: {
          type: 'object',
          patternProperties: { '^x-': { type: 'string' } },
        },
        noPatterns: { type: 'object', patternProperties: {} },
        // Only the properties declared outside of the combined schemas show
        mixed: {
          type: 'object',
          properties: { known: { type: 'string' } },
          anyOf: [{ properties: { other: { type: 'string' } } }],
          additionalProperties: { const: 1 },
        },
      }),
    ).toEqual([
      '* "labels" (object, other keys: string)',
      '* "closed" (object, no other keys)',
      '* "open" (object)',
      '* "patterned" (object, has pattern-matched keys not listed here)',
      '* "noPatterns" (object)',
      '* "mixed" (object, other keys: unknown [const 1], has conditional constraints not listed here)',
      '* "mixed.known" (string)',
    ]);
  });

  it('returns field parts and descriptions for rendering', () => {
    const fields = describeJsonSchemaFields(
      {
        properties: {
          owner: {
            type: 'string',
            description: '  The owner.\n\n  Required for\tall kinds. ',
          },
          blank: { type: 'string', description: ' \n ' },
          notText: { type: 'string', description: 42 },
        },
      },
      { maxDepth: 1 },
    );

    expect(fields).toEqual<JsonSchemaField[]>([
      {
        path: 'owner',
        parts: ['string'],
        description: 'The owner. Required for all kinds.',
      },
      { path: 'blank', parts: ['string'], description: undefined },
      { path: 'notText', parts: ['string'], description: undefined },
    ]);

    // Callers can add their own parts before rendering
    fields[0].parts.push('relation "ownedBy"');
    expect(renderJsonSchemaField(fields[0])).toBe(
      '* "owner" (string, relation "ownedBy"): The owner. Required for all kinds.',
    );
    expect(renderJsonSchemaField(fields[1])).toBe('* "blank" (string)');
    expect(
      describeJsonSchemaFields({ type: 'object' }, { maxDepth: 3 }),
    ).toEqual([]);
  });
});
