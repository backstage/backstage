/*
 * Copyright 2023 The Backstage Authors
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

import { z as zodV3 } from 'zod/v3';
import { z as zodV4 } from 'zod/v4';
import {
  createConfigSchema,
  createDeprecatedConfigSchema,
  mergePortableSchemas,
} from './createPortableSchema';

describe('createConfigSchema', () => {
  describe('zod v4 schemas', () => {
    it('should report a missing required field', () => {
      const schema = createConfigSchema({ name: zodV4.string() });

      expect(() => schema.parse({})).toThrow(
        "Invalid input: expected string, received undefined at 'name'",
      );
    });

    it('should report a type mismatch', () => {
      const schema = createConfigSchema({ count: zodV4.number() });

      expect(() => schema.parse({ count: 'not a number' })).toThrow(
        "Invalid input: expected number, received string at 'count'",
      );
    });

    it('should report nested object errors with the full path', () => {
      const schema = createConfigSchema({
        settings: zodV4.object({ port: zodV4.number() }),
      });

      expect(() => schema.parse({ settings: { port: 'abc' } })).toThrow(
        "Invalid input: expected number, received string at 'settings.port'",
      );
    });

    it('should combine errors from multiple fields', () => {
      const schema = createConfigSchema({
        name: zodV4.string(),
        count: zodV4.number(),
      });

      expect(() => schema.parse({})).toThrow(
        "Invalid input: expected string, received undefined at 'name'; " +
          "Invalid input: expected number, received undefined at 'count'",
      );
    });

    it('should apply defaults for optional fields with defaults', () => {
      const schema = createConfigSchema({
        name: zodV4.string(),
        mode: zodV4.enum(['fast', 'slow']).default('fast'),
      });

      expect(schema.parse({ name: 'test' })).toEqual({
        name: 'test',
        mode: 'fast',
      });
    });

    it('should parse valid config', () => {
      const schema = createConfigSchema({
        name: zodV4.string(),
        count: zodV4.number().optional(),
      });

      expect(schema.parse({ name: 'hello' })).toEqual({ name: 'hello' });
      expect(schema.parse({ name: 'hello', count: 5 })).toEqual({
        name: 'hello',
        count: 5,
      });
    });
  });

  describe('zod v3 rejection', () => {
    it('should reject a direct zod v3 schema', () => {
      expect(() => createConfigSchema({ name: zodV3.string() as any })).toThrow(
        "Config schema for field 'name' uses a Zod v3 schema, which is " +
          'not supported by the `configSchema` option. Upgrade to the ' +
          '`zod` v4 package (`zod@^4.0.0`). Note that the `zod/v4` ' +
          'subpath export from the zod v3 package is also not supported, ' +
          'as it does not include JSON Schema conversion.',
      );
    });
  });

  describe('schema creation errors', () => {
    it('should reject a schema that is not a valid Standard Schema', () => {
      expect(() =>
        createConfigSchema({ bad: { notASchema: true } as any }),
      ).toThrow("Config schema for field 'bad' is not a valid Standard Schema");
    });

    it('should reject a Standard Schema without JSON Schema support', () => {
      const fakeStandardSchema = {
        '~standard': {
          version: 1,
          vendor: 'fake',
          validate: () => ({ value: 'ok' }),
        },
      };

      expect(() =>
        createConfigSchema({ field: fakeStandardSchema as any }),
      ).toThrow(
        "Config schema for field 'field' does not support JSON Schema conversion",
      );
    });
  });

  describe('JSON Schema generation', () => {
    it('should generate JSON Schema lazily via schema()', () => {
      const schema = createConfigSchema({
        title: zodV4.string(),
        count: zodV4.number().optional(),
      });

      const result = schema.schema();
      expect(result).toHaveProperty('schema');
      expect(result.schema).toMatchObject({
        type: 'object',
        properties: {
          title: { type: 'string' },
          count: { type: 'number' },
        },
        required: ['title'],
        additionalProperties: false,
      });
    });

    it('should return the schema as a method', () => {
      const schema = createConfigSchema({
        title: zodV4.string(),
      });

      const result = schema.schema();
      expect(result.schema.type).toBe('object');
      expect(result.schema.properties).toBeDefined();
    });
  });

  describe('merging schemas', () => {
    it('should merge two zod v4 schemas and parse correctly', () => {
      const a = createConfigSchema({ name: zodV4.string() });
      const b = createConfigSchema({ count: zodV4.number().default(0) });

      const merged = mergePortableSchemas(a, b)!;
      expect(merged.parse({ name: 'hello' })).toEqual({
        name: 'hello',
        count: 0,
      });
    });

    it('should merge deprecated v3 and new v4 schemas', () => {
      const a = createDeprecatedConfigSchema({ name: z => z.string() });
      const b = createConfigSchema({ count: zodV4.number().default(0) });

      const merged = mergePortableSchemas(a, b)!;
      expect(merged.parse({ name: 'hello' })).toEqual({
        name: 'hello',
        count: 0,
      });
    });

    it('should produce combined errors after merge', () => {
      const a = createDeprecatedConfigSchema({ name: z => z.string() });
      const b = createConfigSchema({ count: zodV4.number() });

      const merged = mergePortableSchemas(a, b)!;

      expect(() => merged.parse({})).toThrow(
        "Missing required value at 'name'; " +
          "Invalid input: expected number, received undefined at 'count'",
      );
    });

    it('should produce combined errors for type mismatches after merge', () => {
      const a = createDeprecatedConfigSchema({ name: z => z.string() });
      const b = createConfigSchema({ count: zodV4.number() });

      const merged = mergePortableSchemas(a, b)!;

      expect(() => merged.parse({ name: 123, count: 'not a number' })).toThrow(
        "Expected string, received number at 'name'; " +
          "Invalid input: expected number, received string at 'count'",
      );
    });

    it('should produce correct JSON Schema after merge', () => {
      const a = createDeprecatedConfigSchema({ name: z => z.string() });
      const b = createConfigSchema({ count: zodV4.number().optional() });

      const merged = mergePortableSchemas(a, b)!;
      const result = merged.schema();

      expect(result.schema).toMatchObject({
        type: 'object',
        properties: {
          name: { type: 'string' },
          count: { type: 'number' },
        },
        required: ['name'],
        additionalProperties: false,
      });
    });

    it('should handle merge with undefined', () => {
      const a = createConfigSchema({ name: zodV4.string() });

      expect(mergePortableSchemas(a, undefined)).toBe(a);
      expect(mergePortableSchemas(undefined, a)).toBe(a);
      expect(mergePortableSchemas(undefined, undefined)).toBeUndefined();
    });

    it('should let later fields win when merging overlapping keys', () => {
      const a = createDeprecatedConfigSchema({ x: z => z.string() });
      const b = createConfigSchema({ x: zodV4.number() });

      const merged = mergePortableSchemas(a, b)!;
      expect(merged.parse({ x: 42 })).toEqual({ x: 42 });
      expect(() => merged.parse({ x: 'hello' })).toThrow(
        "Invalid input: expected number, received string at 'x'",
      );
    });
  });

  describe('edge cases', () => {
    it('should handle an empty configSchema', () => {
      const schema = createConfigSchema({});

      expect(schema.parse({})).toEqual({});
      expect(schema.parse(undefined)).toEqual({});

      const result = schema.schema();
      expect(result.schema).toEqual({
        type: 'object',
        properties: {},
        additionalProperties: false,
      });
    });

    it('should throw a clear error for non-object input', () => {
      const schema = createConfigSchema({ title: zodV4.string() });

      expect(() => schema.parse('not an object')).toThrow(
        'Invalid config input, expected object but got string',
      );
      expect(() => schema.parse(42)).toThrow(
        'Invalid config input, expected object but got number',
      );
      expect(() => schema.parse([1, 2])).toThrow(
        'Invalid config input, expected object but got array',
      );
      expect(() => schema.parse(true)).toThrow(
        'Invalid config input, expected object but got boolean',
      );
    });

    it('should not produce undefined keys for absent optional fields', () => {
      const schema = createConfigSchema({
        name: zodV4.string(),
        title: zodV4.string().optional(),
        count: zodV4.number().default(42),
      });

      const result = schema.parse({ name: 'hello' });
      expect(result).toEqual({ name: 'hello', count: 42 });
      expect(Object.keys(result as object)).toEqual(['name', 'count']);
    });

    it('should not mark defaulted fields as required in JSON Schema', () => {
      const schema = createConfigSchema({
        name: zodV4.string(),
        title: zodV4.string().default('hello'),
        count: zodV4.number().optional(),
      });

      const result = schema.schema();
      expect(result.schema).toMatchObject({
        type: 'object',
        required: ['name'],
      });
    });
  });
});

describe('createDeprecatedConfigSchema', () => {
  it('should report a missing required field', () => {
    const schema = createDeprecatedConfigSchema({ name: z => z.string() });

    expect(() => schema.parse({})).toThrow("Missing required value at 'name'");
    expect(() => schema.parse(undefined)).toThrow(
      "Missing required value at 'name'",
    );
  });

  it('should report a type mismatch', () => {
    const schema = createDeprecatedConfigSchema({ count: z => z.number() });

    expect(() => schema.parse({ count: 'not a number' })).toThrow(
      "Expected number, received string at 'count'",
    );
  });

  it('should report nested object errors with the full path', () => {
    const schema = createDeprecatedConfigSchema({
      settings: z => z.object({ port: z.number() }),
    });

    expect(() => schema.parse({ settings: { port: 'abc' } })).toThrow(
      "Expected number, received string at 'settings.port'",
    );
  });

  it('should report errors for union types', () => {
    const schema = createDeprecatedConfigSchema({
      value: z => z.union([z.string(), z.number()]),
    });

    expect(() => schema.parse({})).toThrow("Missing required value at 'value'");
  });

  it('should apply defaults for optional fields with defaults', () => {
    const schema = createDeprecatedConfigSchema({
      name: z => z.string(),
      mode: z => z.enum(['fast', 'slow']).default('fast'),
    });

    expect(schema.parse({ name: 'test' })).toEqual({
      name: 'test',
      mode: 'fast',
    });
  });

  it('should generate JSON Schema lazily via schema()', () => {
    const schema = createDeprecatedConfigSchema({
      title: z => z.string(),
      count: z => z.number().optional(),
    });

    const result = schema.schema();
    expect(result).toHaveProperty('schema');
    expect(result.schema).toMatchObject({
      type: 'object',
      properties: {
        title: { type: 'string' },
        count: { type: 'number' },
      },
      required: ['title'],
      additionalProperties: false,
    });
  });

  it('should not mark defaulted fields as required in JSON Schema', () => {
    const schema = createDeprecatedConfigSchema({
      name: z => z.string(),
      title: z => z.string().default('hello'),
      count: z => z.number().optional(),
    });

    const result = schema.schema();
    expect(result.schema).toMatchObject({
      type: 'object',
      required: ['name'],
    });
  });
});
