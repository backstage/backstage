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
  CatalogModelKindRootSchema,
  validateKindRootSchemaSemantics,
} from './validateKindRootSchemaSemantics';

describe('validateKindRootSchemaSemantics', () => {
  it('should accept a valid schema with custom properties', () => {
    expect(() =>
      validateKindRootSchemaSemantics({
        type: 'object',
        properties: {
          spec: { type: 'object' },
          status: { type: 'object' },
        },
      }),
    ).not.toThrow();
  });

  it('should reject non-object input', () => {
    expect(() => validateKindRootSchemaSemantics(undefined)).toThrow(
      'Schema must be an object',
    );
    expect(() => validateKindRootSchemaSemantics(null)).toThrow(
      'Schema must be an object',
    );
    expect(() => validateKindRootSchemaSemantics('string')).toThrow(
      'Schema must be an object',
    );
    expect(() => validateKindRootSchemaSemantics(123)).toThrow(
      'Schema must be an object',
    );
    expect(() => validateKindRootSchemaSemantics([])).toThrow(
      'Schema must be an object',
    );
  });

  it('should reject schemas that use structural keywords in the root', () => {
    for (const keyword of [
      'allOf',
      'oneOf',
      'anyOf',
      'if',
      'else',
      'then',
      'not',
      '$ref',
    ]) {
      expect(() =>
        validateKindRootSchemaSemantics({
          properties: { spec: { type: 'object' } },
          [keyword]: [],
        }),
      ).toThrow(`Schema must not use "${keyword}" keyword in the root`);
    }
  });

  it('should accept schemas that do not use structural keywords in the root', () => {
    expect(() =>
      validateKindRootSchemaSemantics({
        type: 'object',
        properties: { spec: { type: 'object' } },
      }),
    ).not.toThrow();
  });

  it('should reject schemas without a properties field', () => {
    expect(() => validateKindRootSchemaSemantics({ type: 'object' })).toThrow(
      'Schema must have a "properties" field that is an object',
    );
  });

  it('should reject schemas where properties is not an object', () => {
    expect(() =>
      validateKindRootSchemaSemantics({ properties: 'not-an-object' }),
    ).toThrow('Schema must have a "properties" field that is an object');
  });

  it('should reject schemas that declare reserved root fields', () => {
    for (const field of ['kind', 'apiVersion', 'metadata']) {
      expect(() =>
        validateKindRootSchemaSemantics({
          type: 'object',
          properties: { [field]: { type: 'string' } },
        }),
      ).toThrow(`reserved root field "${field}"`);
    }
  });

  it('should reject schemas where a root field schema is not an object', () => {
    expect(() =>
      validateKindRootSchemaSemantics({
        type: 'object',
        properties: { spec: 'not-an-object' },
      }),
    ).toThrow('Schema for root field "spec" must be an object');
  });

  it('should reject schemas that use structural keywords in root field schemas', () => {
    for (const keyword of [
      'allOf',
      'oneOf',
      'anyOf',
      'if',
      'else',
      'then',
      'not',
      '$ref',
    ]) {
      expect(() =>
        validateKindRootSchemaSemantics({
          type: 'object',
          properties: {
            spec: { type: 'object', [keyword]: [] },
          },
        }),
      ).toThrow(
        `Schema for root field "spec" must not use "${keyword}" keyword`,
      );
    }
  });

  it('should accept arbitrary extra fields at all levels via the type', () => {
    // This test is a compile-time check that CatalogModelKindRootSchema
    // allows unknown properties at every level, not just the forbidden ones.
    const schema: CatalogModelKindRootSchema = {
      type: 'object',
      foo: 'bar',
      properties: {
        spec: {
          type: 'object',
          foo: 'bar',
          properties: {
            owner: {
              type: 'string',
              foo: 'bar',
            },
          },
        },
      },
    };
    expect(schema).toBeDefined();
  });
});
