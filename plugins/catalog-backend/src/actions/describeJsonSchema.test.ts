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
          name: { type: 'string' },
          id: { type: ['string', 'number'] },
          anything: {},
          owner: { $ref: '#/definitions/Owner' },
          target: { type: 'object', $ref: '#/definitions/Target' },
          lifecycle: { type: 'string', enum: ['production', 'experimental'] },
          version: { const: 2 },
          mode: { enum: ['fast', 'slow'], const: 'slow' },
          endpoint: {
            enum: [{ host: 'a', port: 1 }],
            const: { port: 1, host: 'a' },
          },
        },
        { required: ['name', 'owner'] },
      ),
    ).toEqual([
      '* "name" (string, required)',
      '* "id" (string | number)',
      '* "anything" (unknown)',
      '* "owner" (reference to "#/definitions/Owner", required)',
      '* "target" (object, reference to "#/definitions/Target")',
      '* "lifecycle" (string, one of "production", "experimental")',
      '* "version" (unknown, const 2)',
      // const and enum together allow only the values both permit
      '* "mode" (unknown, const "slow")',
      // Equal objects match whatever their key order
      '* "endpoint" (unknown, const {"host":"a","port":1})',
    ]);
  });

  it('describes bounds, formats, patterns and defaults', () => {
    expect(
      fieldLines({
        count: { type: 'integer', minimum: 0, maximum: 10, default: 5 },
        ratio: { type: 'number', exclusiveMinimum: 0, exclusiveMaximum: 1 },
        // A minimum length of 1 gets a shorter wording
        title: { type: 'string', minLength: 1 },
        email: {
          type: 'string',
          minLength: 3,
          maxLength: 64,
          format: 'email',
          pattern: '^[a-z]+@',
        },
        tags: { type: 'array', minItems: 1, maxItems: 5 },
        labels: { type: 'object', minProperties: 1, maxProperties: 3 },
        presence: { type: 'string', default: 'required' },
      }),
    ).toEqual([
      '* "count" (integer, min 0, max 10, default 5)',
      '* "ratio" (number, over 0, under 1)',
      '* "title" (string, non-empty)',
      '* "email" (string, min length 3, max length 64, format: email, pattern: "^[a-z]+@")',
      '* "tags" (array, at least 1 item, at most 5 items)',
      '* "labels" (object, at least 1 key, at most 3 keys)',
      '* "presence" (string, default "required")',
    ]);
  });

  it('describes arrays, tuples and boolean schemas', () => {
    expect(
      fieldLines({
        tags: { type: 'array', items: { type: 'string' } },
        modes: { type: 'array', items: { type: 'string', enum: ['a', 'b'] } },
        refs: { type: 'array', items: { $ref: '#/definitions/Ref' } },
        anyList: { type: 'array' },
        emptyList: { type: 'array', items: false },
        matrix: {
          type: 'array',
          items: { type: 'array', items: { type: 'number' } },
        },
        pair: {
          type: 'array',
          items: [{ type: 'string' }, { type: 'number' }],
          additionalItems: false,
        },
        point: {
          type: 'array',
          prefixItems: [{ type: 'number' }, true],
          items: { type: 'string' },
        },
        anything: true,
        removed: false,
        // Items show the same details as fields
        codes: {
          type: 'array',
          items: { type: 'string', maxLength: 4, pattern: '^[A-Z]+$' },
        },
        slots: {
          type: 'array',
          items: { anyOf: [{ type: 'string' }, { type: 'number' }] },
        },
        range: {
          type: 'array',
          prefixItems: [
            { type: 'integer', minimum: 0 },
            { type: 'integer', maximum: 100 },
          ],
          items: false,
        },
        // An array that is one member of a type union keeps its items
        aliases: {
          type: ['array', 'null'],
          items: { type: 'string', enum: ['a', 'b'] },
        },
      }),
    ).toEqual([
      '* "tags" (array of string)',
      '* "modes" (array of string [one of "a", "b"])',
      '* "refs" (array of reference to "#/definitions/Ref")',
      '* "anyList" (array)',
      '* "emptyList" (empty array)',
      '* "matrix" (array of array of number)',
      '* "pair" (tuple of [string, number] with no further items)',
      '* "point" (tuple of [number, any value] followed by string)',
      '* "anything" (any value)',
      '* "removed" (not allowed)',
      '* "codes" (array of string [max length 4, pattern: "^[A-Z]+$"])',
      '* "slots" (array of unknown [has conditional constraints not listed here])',
      '* "range" (tuple of [integer [min 0], integer [max 100]] with no further items)',
      '* "aliases" (array of string [one of "a", "b"] | null)',
    ]);
  });

  it('lists nested fields down to the maximum depth and marks the rest', () => {
    expect(
      fieldLines(
        {
          kind: { type: 'string' },
          spec: {
            type: 'object',
            required: ['owner'],
            properties: {
              owner: { type: 'string' },
              profile: {
                type: 'object',
                properties: {
                  email: { type: 'string' },
                  address: {
                    type: 'object',
                    properties: { city: { type: 'string' } },
                  },
                },
              },
              // Properties of array items are listed under the array's path
              links: {
                type: 'array',
                items: {
                  type: 'object',
                  required: ['url'],
                  properties: { url: { type: 'string' } },
                },
              },
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
        },
        { maxDepth: 3, omit: ['kind'] },
      ),
    ).toEqual([
      '* "spec" (object)',
      '* "spec.owner" (string, required)',
      '* "spec.profile" (object)',
      '* "spec.profile.email" (string)',
      '* "spec.profile.address" (object, has nested fields not listed here)',
      '* "spec.links" (array of object)',
      '* "spec.links.url" (string, required)',
      '* "matrix" (array of array of object, has nested fields not listed here)',
      '* "pair" (tuple of [object], has nested fields not listed here)',
    ]);

    // Only root properties are omitted
    expect(
      fieldLines(
        {
          kind: { type: 'string' },
          spec: { type: 'object', properties: { kind: { type: 'string' } } },
        },
        { omit: ['kind'] },
      ),
    ).toEqual(['* "spec" (object)', '* "spec.kind" (string)']);
  });

  it('lists properties and items only where the type allows them', () => {
    expect(
      fieldLines({
        nullable: {
          type: ['object', 'null'],
          properties: { name: { type: 'string' } },
        },
        untyped: { properties: { name: { type: 'string' } } },
        // items only apply to arrays, and properties only to objects
        record: {
          type: 'object',
          properties: { name: { type: 'string' } },
          items: { type: 'object', properties: { stray: { type: 'string' } } },
        },
        text: { type: 'string', properties: { stray: { type: 'string' } } },
        list: {
          type: 'array',
          properties: { stray: { type: 'string' } },
          items: { type: 'object', properties: { url: { type: 'string' } } },
        },
        // A schema for both objects and arrays has both kinds of fields
        either: {
          type: ['object', 'array'],
          properties: { name: { type: 'string' } },
          items: { type: 'object', properties: { url: { type: 'string' } } },
        },
        loose: {
          properties: { name: { type: 'string' } },
          items: { properties: { url: { type: 'string' } } },
        },
      }),
    ).toEqual([
      '* "nullable" (object | null)',
      '* "nullable.name" (string)',
      '* "untyped" (unknown)',
      '* "untyped.name" (string)',
      '* "record" (object)',
      '* "record.name" (string)',
      '* "text" (string)',
      '* "list" (array of object)',
      '* "list.url" (string)',
      '* "either" (object | array of object)',
      '* "either.name" (string)',
      '* "either.url" (string)',
      '* "loose" (unknown)',
      '* "loose.name" (string)',
      '* "loose.url" (string)',
    ]);
  });

  it('marks keys and constraints that are not listed', () => {
    expect(
      fieldLines({
        labels: { type: 'object', additionalProperties: { type: 'string' } },
        annotations: {
          type: 'object',
          additionalProperties: { type: 'string', maxLength: 63 },
        },
        closed: { type: 'object', additionalProperties: false },
        extensions: {
          type: 'object',
          patternProperties: { '^x-': { type: 'string' } },
        },
        combined: { allOf: [{ type: 'string' }, { minLength: 2 }] },
        target: { anyOf: [{ type: 'string' }, { type: 'number' }] },
        conditional: {
          type: 'object',
          properties: { kind: { type: 'string' } },
          if: { properties: { kind: { const: 'url' } } },
          then: { required: ['url'] },
        },
        contact: {
          type: 'object',
          dependentRequired: { email: ['name'] },
        },
      }),
    ).toEqual([
      '* "labels" (object, other keys: string)',
      '* "annotations" (object, other keys: string [max length 63])',
      '* "closed" (object, no other keys)',
      '* "extensions" (object, has pattern-matched keys not listed here)',
      '* "combined" (unknown, has conditional constraints not listed here)',
      '* "target" (unknown, has conditional constraints not listed here)',
      '* "conditional" (object, has conditional constraints not listed here)',
      // Properties declared outside of the conditions are still listed
      '* "conditional.kind" (string)',
      '* "contact" (object, has conditional constraints not listed here)',
    ]);
  });

  it('renders descriptions and extra parts on one line', () => {
    const fields = describeJsonSchemaFields(
      {
        properties: {
          owner: {
            type: 'string',
            description: 'The owner.\n\nRequired for all kinds.',
          },
          system: { type: 'string' },
        },
      },
      { maxDepth: 1 },
    );

    // Callers such as the catalog add their own facts to a field
    fields[0].parts.push('relation "ownedBy"');
    expect(fields.map(renderJsonSchemaField)).toEqual([
      '* "owner" (string, relation "ownedBy"): The owner. Required for all kinds.',
      '* "system" (string)',
    ]);
  });
});
