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
  it('returns empty object when schema has no properties', () => {
    expect(schemaToFlags({})).toEqual({});
    expect(schemaToFlags({ properties: {} })).toEqual({});
  });

  it('converts string properties to String flags', () => {
    const flags = schemaToFlags({
      properties: {
        myProp: { type: 'string', description: 'A string prop' },
      },
    });

    expect(flags).toEqual({
      myProp: { type: String, description: 'A string prop' },
    });
  });

  it('converts number and integer properties to Number flags', () => {
    const flags = schemaToFlags({
      properties: {
        count: { type: 'integer' },
        amount: { type: 'number', description: 'An amount' },
      },
    });

    expect(flags.count).toEqual({ type: Number, description: undefined });
    expect(flags.amount).toEqual({ type: Number, description: 'An amount' });
  });

  it('converts boolean properties to Boolean flags', () => {
    const flags = schemaToFlags({
      properties: {
        verbose: { type: 'boolean', description: 'Enable verbose output' },
      },
    });

    expect(flags.verbose).toEqual({
      type: Boolean,
      description: 'Enable verbose output',
    });
  });

  it('skips non-primitive properties like object and array', () => {
    const flags = schemaToFlags({
      properties: {
        name: { type: 'string' },
        metadata: { type: 'object' },
        tags: { type: 'array' },
      },
    });

    expect(Object.keys(flags)).toEqual(['name']);
  });

  it('skips properties with no type or composite types', () => {
    const flags = schemaToFlags({
      properties: {
        noType: {},
        name: { type: 'string' },
      },
    });

    expect(Object.keys(flags)).toEqual(['name']);
  });

  it('uses first type when type is an array', () => {
    const flags = schemaToFlags({
      properties: {
        value: { type: ['string', 'null'] },
      },
    });

    expect(flags.value).toEqual({ type: String, description: undefined });
  });

  it('appends enum values to description', () => {
    const flags = schemaToFlags({
      properties: {
        color: {
          type: 'string',
          description: 'Pick a color',
          enum: ['red', 'green', 'blue'],
        },
        bare: { type: 'string', enum: ['a', 'b'] },
      },
    });

    expect(flags.color.description).toBe('Pick a color [red, green, blue]');
    expect(flags.bare.description).toBe('[a, b]');
  });

  it('marks required fields in description', () => {
    const flags = schemaToFlags({
      properties: {
        name: { type: 'string', description: 'The name' },
        optional: { type: 'string', description: 'Optional field' },
        bare: { type: 'string' },
      },
      required: ['name', 'bare'],
    });

    expect(flags.name.description).toBe('The name (required)');
    expect(flags.optional.description).toBe('Optional field');
    expect(flags.bare.description).toBe('(required)');
  });

  it('applies default values from schema', () => {
    const flags = schemaToFlags({
      properties: {
        count: { type: 'number', default: 10 },
        name: { type: 'string' },
      },
    });

    expect(flags.count.default).toBe(10);
    expect(flags.name.default).toBeUndefined();
  });

  it('combines enum and required in description', () => {
    const flags = schemaToFlags({
      properties: {
        env: {
          type: 'string',
          description: 'Target env',
          enum: ['dev', 'prod'],
        },
      },
      required: ['env'],
    });

    expect(flags.env.description).toBe('Target env [dev, prod] (required)');
  });

  it('preserves camelCase property names as flag keys', () => {
    const flags = schemaToFlags({
      properties: {
        targetEntityRef: { type: 'string' },
        maxResults: { type: 'integer' },
      },
    });

    expect(Object.keys(flags)).toEqual(['targetEntityRef', 'maxResults']);
  });
});
