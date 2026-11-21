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

describe('sanitizeConfigSchema', () => {
  it('removes regex, format and identifier keywords at every schema level', () => {
    const sanitized = sanitizeConfigSchema({
      $id: 'https://example.com/schema.json',
      $schema: 'http://json-schema.org/draft-07/schema#',
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
      $schema: 'http://json-schema.org/draft-07/schema#',
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

  it('keeps only references that point inside the document', () => {
    const sanitized = sanitizeConfigSchema({
      type: 'object',
      properties: {
        local: { $ref: '#/definitions/shared' },
        remote: { $ref: 'https://example.com/other.json' },
        relative: { $ref: 'other.json#/definitions/x' },
        root: { $ref: '#' },
      },
      definitions: { shared: { type: 'string' } },
    });

    assert.deepEqual(sanitized.properties, {
      local: { $ref: '#/definitions/shared' },
      remote: {},
      relative: {},
      root: {},
    });
  });

  it('keeps config properties and data that share a keyword name', () => {
    const sanitized = sanitizeConfigSchema({
      type: 'object',
      properties: {
        pattern: { type: 'string', default: 'a*' },
        format: { type: 'string', enum: ['json', 'yaml'] },
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
        $ref: { type: 'string' },
        example: { type: 'object', default: { pattern: 'keep', format: 'me' } },
      },
      required: ['pattern'],
    });
  });

  it('treats a __proto__ key as data and does not touch the prototype', () => {
    const sanitized = sanitizeConfigSchema(
      JSON.parse(
        '{"type":"object","properties":{"__proto__":{"type":"string"}}}',
      ),
    );

    assert.equal(Object.getPrototypeOf(sanitized.properties), Object.prototype);
    assert.deepEqual(
      Object.keys(sanitized.properties as Record<string, unknown>),
      ['__proto__'],
    );
    assert.equal(({} as Record<string, unknown>).type, undefined);
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
