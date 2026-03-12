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

import { schemaToFlags } from './schemaToFlags';

describe('schemaToFlags', () => {
  describe('flag type resolution', () => {
    it('generates String type flags for string properties', () => {
      const { flags } = schemaToFlags({
        properties: { name: { type: 'string' } },
      });
      expect(flags.name.type).toBe(String);
    });

    it('generates Number type flags for number and integer properties', () => {
      const { flags } = schemaToFlags({
        properties: {
          count: { type: 'number' },
          age: { type: 'integer' },
        },
      });
      expect(flags.count.type).toBe(Number);
      expect(flags.age.type).toBe(Number);
    });

    it('generates Boolean type flags for boolean properties', () => {
      const { flags } = schemaToFlags({
        properties: { enabled: { type: 'boolean' } },
      });
      expect(flags.enabled.type).toBe(Boolean);
    });
  });

  describe('flag descriptions', () => {
    it('appends enum values to the description', () => {
      const { flags } = schemaToFlags({
        properties: {
          color: {
            type: 'string',
            description: 'Pick a color',
            enum: ['red', 'green', 'blue'],
          },
        },
      });
      expect(flags.color.description).toBe(
        'Pick a color, one of: red, green, blue',
      );
    });

    it('uses enum values as description when no description exists', () => {
      const { flags } = schemaToFlags({
        properties: {
          size: { type: 'string', enum: ['small', 'large'] },
        },
      });
      expect(flags.size.description).toBe('one of: small, large');
    });

    it('marks required properties with required in the description', () => {
      const { flags } = schemaToFlags({
        properties: {
          name: { type: 'string', description: 'Your name' },
          email: { type: 'string' },
        },
        required: ['name', 'email'],
      });
      expect(flags.name.description).toBe('Your name (required)');
      expect(flags.email.description).toBe('(required)');
    });

    it('combines enum values and required marker correctly', () => {
      const { flags } = schemaToFlags({
        properties: {
          env: { type: 'string', enum: ['dev', 'prod'] },
        },
        required: ['env'],
      });
      expect(flags.env.description).toBe('one of: dev, prod (required)');
    });
  });

  describe('skipped types', () => {
    it('skips object and array properties', () => {
      const { flags } = schemaToFlags({
        properties: {
          tags: { type: 'array' },
          config: { type: 'object' },
          name: { type: 'string' },
        },
      });
      expect(Object.keys(flags)).toEqual(['name']);
    });

    it('skips anyOf, oneOf, and allOf properties', () => {
      const { flags } = schemaToFlags({
        properties: {
          a: { anyOf: [{ type: 'string' }, { type: 'number' }] },
          b: { oneOf: [{ type: 'string' }, { type: 'boolean' }] },
          c: { allOf: [{ type: 'string' }] },
          d: { type: 'string' },
        },
      });
      expect(Object.keys(flags)).toEqual(['d']);
    });
  });

  describe('flag name conversion', () => {
    it('converts camelCase property names to kebab-case flag names', () => {
      const { flags } = schemaToFlags({
        properties: {
          myPropertyName: { type: 'string' },
          anotherOne: { type: 'number' },
        },
      });
      expect(flags['my-property-name']).toBeDefined();
      expect(flags['another-one']).toBeDefined();
      expect(flags.myPropertyName).toBeUndefined();
    });
  });

  describe('parseInput', () => {
    it('converts kebab-case keys back to camelCase', () => {
      const { parseInput } = schemaToFlags({ properties: {} });
      const result = parseInput({ 'my-flag': 'value', 'another-flag': 42 });
      expect(result).toEqual({ myFlag: 'value', anotherFlag: 42 });
    });

    it('strips undefined values', () => {
      const { parseInput } = schemaToFlags({ properties: {} });
      const result = parseInput({ present: 'yes', missing: undefined });
      expect(result).toEqual({ present: 'yes' });
      expect('missing' in result).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('returns empty flags for an empty schema', () => {
      const { flags } = schemaToFlags({});
      expect(flags).toEqual({});
    });

    it('returns empty flags for a schema with no properties', () => {
      const { flags } = schemaToFlags({ type: 'object', required: [] });
      expect(flags).toEqual({});
    });
  });
});
