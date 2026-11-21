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

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  ConfigSchemaLimitError,
  MAX_CONFIG_SCHEMA_BYTES,
  MAX_CONFIG_SCHEMA_DEPTH,
  sanitizeConfigSchema,
} from './sanitizeConfigSchema';

function nested(levels: number): Record<string, unknown> {
  let schema: Record<string, unknown> = { type: 'string' };
  for (let i = 0; i < levels; i++) {
    schema = { type: 'object', properties: { child: schema } };
  }
  return schema;
}

// Every keyword and position that must never reach the stored schema.
function containsKey(value: unknown, forbidden: Set<string>): boolean {
  if (Array.isArray(value)) {
    return value.some(item => containsKey(item, forbidden));
  }
  if (typeof value === 'object' && value !== null) {
    return Object.entries(value).some(
      ([key, item]) => forbidden.has(key) || containsKey(item, forbidden),
    );
  }
  return false;
}

describe('sanitizeConfigSchema', () => {
  it('keeps the keywords a configuration form needs', () => {
    const schema = {
      type: 'object',
      title: 'Example',
      description: 'Example plugin settings.',
      properties: {
        endpoint: { type: 'string', minLength: 1, maxLength: 200 },
        mode: { type: 'string', enum: ['a', 'b'], default: 'a' },
        retries: { type: 'integer', minimum: 0, maximum: 10 },
        tags: {
          type: 'array',
          items: { type: 'string' },
          minItems: 1,
          uniqueItems: true,
        },
        either: { anyOf: [{ type: 'string' }, { type: 'null' }] },
        extra: { type: 'object', additionalProperties: { type: 'string' } },
        flag: { type: ['boolean', 'null'], default: false, deprecated: true },
      },
      required: ['endpoint'],
    };

    assert.deepEqual(sanitizeConfigSchema(schema), schema);
  });

  it('removes regex, format, identifier and meta keywords at every level', () => {
    const sanitized = sanitizeConfigSchema({
      $id: 'https://example.com/schema.json',
      $schema: 'http://json-schema.org/draft-07/schema#',
      $comment: 'internal',
      type: 'object',
      properties: {
        name: { type: 'string', pattern: '^(a+)+$', format: 'email' },
        list: {
          type: 'array',
          items: { type: 'string', pattern: 'x', $id: 'item' },
        },
        either: {
          anyOf: [{ type: 'string', format: 'uri' }, { type: 'null' }],
        },
      },
      patternProperties: { '^x-': { type: 'string' } },
      additionalProperties: { type: 'string', pattern: 'y' },
      definitions: { shared: { type: 'string', format: 'date' } },
    });

    assert.deepEqual(sanitized, {
      type: 'object',
      properties: {
        name: { type: 'string' },
        list: { type: 'array', items: { type: 'string' } },
        either: { anyOf: [{ type: 'string' }, { type: 'null' }] },
      },
      additionalProperties: { type: 'string' },
      definitions: { shared: { type: 'string' } },
    });
  });

  it('drops unlisted subschema keywords so nothing nested under them survives', () => {
    const regex = { type: 'string', pattern: '^(a+)+$', format: 'email' };
    const sanitized = sanitizeConfigSchema({
      type: 'object',
      properties: { kept: { type: 'string' } },
      dependencies: { kept: { properties: { x: regex } } },
      dependentSchemas: { kept: { properties: { x: regex } } },
      prefixItems: [regex],
      unevaluatedProperties: regex,
      unevaluatedItems: regex,
      contentSchema: regex,
      contains: regex,
      propertyNames: regex,
      not: regex,
      if: regex,
      then: { patternProperties: { '^x': regex } },
      else: regex,
      additionalItems: regex,
      items: { type: 'array', items: regex, contains: regex },
      allOf: [
        { dependencies: { a: regex }, type: 'object' },
        { properties: { deep: { not: regex, type: 'string' } } },
      ],
      definitions: {
        shared: { type: 'object', dependentSchemas: { a: regex } },
      },
      $defs: { other: { unevaluatedProperties: regex, type: 'string' } },
    });

    assert.deepEqual(sanitized, {
      type: 'object',
      properties: { kept: { type: 'string' } },
      items: { type: 'array', items: { type: 'string' } },
      allOf: [{ type: 'object' }, { properties: { deep: { type: 'string' } } }],
      definitions: { shared: { type: 'object' } },
      $defs: { other: { type: 'string' } },
    });
    assert.equal(
      containsKey(
        sanitized,
        new Set(['pattern', 'format', 'patternProperties', 'dependencies']),
      ),
      false,
    );
  });

  it('drops unknown and extension keywords instead of copying them', () => {
    const sanitized = sanitizeConfigSchema({
      type: 'object',
      'x-ui': { pattern: '^(a+)+$' },
      tsType: 'Foo',
      visibility: 'secret',
      properties: {
        name: {
          type: 'string',
          $dynamicRef: '#meta',
          $anchor: 'name',
          contentEncoding: 'base64',
          'x-custom': { format: 'email' },
        },
      },
    });

    assert.deepEqual(sanitized, {
      type: 'object',
      properties: { name: { type: 'string' } },
    });
  });

  it('only allows references to definitions that are kept in the output', () => {
    const sanitized = sanitizeConfigSchema({
      type: 'object',
      properties: {
        local: { $ref: '#/definitions/shared' },
        modern: { $ref: '#/$defs/modern' },
        encoded: { $ref: '#/definitions/Record%3Cstring%2Cstring%3E' },
        missing: { $ref: '#/definitions/missing' },
        nested: { $ref: '#/definitions/shared/properties/a' },
        pointer: { $ref: '#/properties/local' },
        root: { $ref: '#' },
        remote: { $ref: 'https://example.com/other.json' },
        relative: { $ref: 'other.json#/definitions/x' },
        file: { $ref: 'file:///etc/passwd' },
        wrongMap: { $ref: '#/$defs/shared' },
        notString: { $ref: { $ref: '#/definitions/shared' } },
      },
      definitions: {
        shared: { type: 'string' },
        'Record<string,string>': { type: 'object' },
      },
      $defs: { modern: { type: 'number' } },
    });

    assert.deepEqual(sanitized.properties, {
      local: { $ref: '#/definitions/shared' },
      modern: { $ref: '#/$defs/modern' },
      encoded: { $ref: '#/definitions/Record%3Cstring%2Cstring%3E' },
      missing: {},
      nested: {},
      pointer: {},
      root: {},
      remote: {},
      relative: {},
      file: {},
      wrongMap: {},
      notString: {},
    });
  });

  it('keeps config properties and data that share a keyword name', () => {
    const sanitized = sanitizeConfigSchema({
      type: 'object',
      properties: {
        pattern: { type: 'string', default: 'a*' },
        format: { type: 'string', enum: ['json', 'yaml'] },
        dependencies: { type: 'string' },
        $ref: { type: 'string' },
        example: { type: 'object', default: { pattern: 'keep', format: 'me' } },
      },
      required: ['pattern'],
    });

    assert.deepEqual(sanitized, {
      type: 'object',
      properties: {
        pattern: { type: 'string', default: 'a*' },
        format: { type: 'string', enum: ['json', 'yaml'] },
        dependencies: { type: 'string' },
        $ref: { type: 'string' },
        example: { type: 'object', default: { pattern: 'keep', format: 'me' } },
      },
      required: ['pattern'],
    });
  });

  it('drops keywords with values of the wrong type', () => {
    const sanitized = sanitizeConfigSchema({
      type: 'object',
      title: { pattern: 'x' },
      required: 'name',
      minProperties: '1',
      maxProperties: Infinity,
      uniqueItems: 'yes',
      properties: { bad: 'not a schema', worse: ['x'], ok: { type: 'bogus' } },
      items: 'string',
    });

    assert.deepEqual(sanitized, { type: 'object', properties: { ok: {} } });
  });

  it('treats a __proto__ key as data and does not touch the prototype', () => {
    const sanitized = sanitizeConfigSchema(
      JSON.parse(
        '{"type":"object","properties":{"__proto__":{"type":"string"}},"default":{"__proto__":{"polluted":true}}}',
      ),
    );

    assert.equal(Object.getPrototypeOf(sanitized.properties), Object.prototype);
    assert.deepEqual(
      Object.keys(sanitized.properties as Record<string, unknown>),
      ['__proto__'],
    );
    assert.equal(({} as Record<string, unknown>).polluted, undefined);
  });

  it('rejects recursive references and reference fan-out', () => {
    assert.throws(
      () =>
        sanitizeConfigSchema({
          type: 'object',
          properties: { tree: { $ref: '#/definitions/node' } },
          definitions: {
            node: {
              type: 'object',
              properties: { child: { $ref: '#/definitions/node' } },
            },
          },
        }),
      (error: unknown) =>
        error instanceof ConfigSchemaLimitError &&
        error.reason === 'config-schema-invalid',
    );
    assert.throws(
      () =>
        sanitizeConfigSchema({
          definitions: {
            a: { allOf: [{ $ref: '#/definitions/b' }] },
            b: { allOf: [{ $ref: '#/definitions/a' }] },
          },
        }),
      ConfigSchemaLimitError,
    );

    // Each level references the next one twice, so the expanded form doubles
    // at every level even though the stored schema stays small.
    const definitions: Record<string, unknown> = {};
    for (let i = 0; i < 20; i++) {
      definitions[`d${i}`] = {
        allOf: [
          { $ref: `#/definitions/d${i + 1}` },
          { $ref: `#/definitions/d${i + 1}` },
        ],
      };
    }
    definitions.d20 = { type: 'string' };
    assert.throws(
      () =>
        sanitizeConfigSchema({
          type: 'object',
          properties: { start: { $ref: '#/definitions/d0' } },
          definitions,
        }),
      (error: unknown) =>
        error instanceof ConfigSchemaLimitError &&
        error.reason === 'config-schema-too-large',
    );
  });

  it('rejects schemas that are nested too deeply', () => {
    assert.ok(Object.keys(sanitizeConfigSchema(nested(10))).length > 0);
    assert.throws(
      () => sanitizeConfigSchema(nested(MAX_CONFIG_SCHEMA_DEPTH)),
      (error: unknown) =>
        error instanceof ConfigSchemaLimitError &&
        error.reason === 'config-schema-too-deep',
    );

    let data: unknown = 'leaf';
    for (let i = 0; i < MAX_CONFIG_SCHEMA_DEPTH + 5; i++) {
      data = [data];
    }
    assert.throws(
      () => sanitizeConfigSchema({ type: 'array', default: data }),
      ConfigSchemaLimitError,
    );
  });

  it('rejects schemas that are too large and non-object input', () => {
    assert.throws(
      () =>
        sanitizeConfigSchema({
          type: 'string',
          description: 'x'.repeat(MAX_CONFIG_SCHEMA_BYTES),
        }),
      (error: unknown) =>
        error instanceof ConfigSchemaLimitError &&
        error.reason === 'config-schema-too-large',
    );
    assert.throws(
      () => sanitizeConfigSchema(['not', 'an', 'object']),
      TypeError,
    );
    assert.throws(() => sanitizeConfigSchema('string'), TypeError);
  });
});
