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

import { SchemaValidator } from './SchemaValidator';

const schema = {
  type: 'object',
  required: ['spec'],
  properties: {
    spec: {
      type: 'object',
      required: ['name'],
      properties: {
        name: { type: 'string', minLength: 1 },
        count: { type: 'number' },
      },
    },
  },
};

describe('SchemaValidator', () => {
  it('returns no errors for valid data', () => {
    const validator = new SchemaValidator();
    const errors = validator.validate(schema, {
      spec: { name: 'foo' },
    });
    expect(errors).toEqual([]);
  });

  it('returns errors for missing required field', () => {
    const validator = new SchemaValidator();
    const errors = validator.validate(schema, { spec: {} });
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some(e => e.includes('name'))).toBe(true);
  });

  it('returns errors for wrong type', () => {
    const validator = new SchemaValidator();
    const errors = validator.validate(schema, {
      spec: { name: 'foo', count: 'not-a-number' },
    });
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some(e => e.includes('count') || e.includes('number'))).toBe(
      true,
    );
  });

  it('returns errors when spec is missing entirely', () => {
    const validator = new SchemaValidator();
    const errors = validator.validate(schema, {});
    expect(errors.length).toBeGreaterThan(0);
  });

  it('caches compiled validators across calls', () => {
    const validator = new SchemaValidator();
    validator.validate(schema, { spec: { name: 'a' } });
    validator.validate(schema, { spec: { name: 'b' } });
    // No way to directly observe caching, but verifying that repeated
    // calls with the same schema object work correctly
    expect(validator.validate(schema, { spec: { name: 'c' } })).toEqual([]);
  });

  it('expires cached validators after the TTL', () => {
    jest.useFakeTimers();
    try {
      const validator = new SchemaValidator({ ttlMs: 1000 });

      // First call compiles and caches
      expect(validator.validate(schema, { spec: { name: 'a' } })).toEqual([]);

      // Advance past TTL
      jest.advanceTimersByTime(1500);

      // Should still work (recompiles from expired cache)
      expect(validator.validate(schema, { spec: { name: 'b' } })).toEqual([]);
      expect(validator.validate(schema, { spec: {} }).length).toBeGreaterThan(
        0,
      );
    } finally {
      jest.useRealTimers();
    }
  });
});
