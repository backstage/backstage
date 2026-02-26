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

import { constantOrEnumSchema, stringOrStringArraySchema } from './util';

describe('constantOrEnumSchema', () => {
  it('accepts a const string', () => {
    expect(constantOrEnumSchema.parse({ const: 'Component' })).toEqual({
      const: 'Component',
    });
  });

  it('accepts an enum with one value', () => {
    expect(
      constantOrEnumSchema.parse({ enum: ['backstage.io/v1alpha1'] }),
    ).toEqual({ enum: ['backstage.io/v1alpha1'] });
  });

  it('accepts an enum with multiple values', () => {
    expect(
      constantOrEnumSchema.parse({
        enum: ['backstage.io/v1alpha1', 'backstage.io/v1beta1'],
      }),
    ).toEqual({ enum: ['backstage.io/v1alpha1', 'backstage.io/v1beta1'] });
  });

  it('rejects an empty const string', () => {
    expect(() => constantOrEnumSchema.parse({ const: '' })).toThrow();
  });

  it('rejects an empty enum array', () => {
    expect(() => constantOrEnumSchema.parse({ enum: [] })).toThrow();
  });

  it('rejects an enum with empty strings', () => {
    expect(() => constantOrEnumSchema.parse({ enum: [''] })).toThrow();
  });

  it('rejects a missing const and enum', () => {
    expect(() => constantOrEnumSchema.parse({})).toThrow();
  });

  it('rejects non-string enum values', () => {
    expect(() => constantOrEnumSchema.parse({ enum: [1, 2] })).toThrow();
  });

  it('rejects a non-string const value', () => {
    expect(() => constantOrEnumSchema.parse({ const: 123 })).toThrow();
  });
});

describe('stringOrStringArraySchema', () => {
  it('accepts a string type', () => {
    expect(stringOrStringArraySchema.parse({ type: 'string' })).toEqual({
      type: 'string',
    });
  });

  it('accepts a string type as array', () => {
    expect(stringOrStringArraySchema.parse({ type: ['string'] })).toEqual({
      type: ['string'],
    });
  });

  it('accepts an array type with string items', () => {
    expect(
      stringOrStringArraySchema.parse({
        type: 'array',
        items: { type: 'string' },
      }),
    ).toEqual({ type: 'array', items: { type: 'string' } });
  });

  it('accepts an array type as array with string items', () => {
    expect(
      stringOrStringArraySchema.parse({
        type: ['array'],
        items: { type: 'string' },
      }),
    ).toEqual({ type: ['array'], items: { type: 'string' } });
  });

  it('accepts a mixed type array with string items', () => {
    expect(
      stringOrStringArraySchema.parse({
        type: ['string', 'array'],
        items: { type: 'string' },
      }),
    ).toEqual({ type: ['string', 'array'], items: { type: 'string' } });
  });

  it('accepts an array type with items type as array', () => {
    expect(
      stringOrStringArraySchema.parse({
        type: 'array',
        items: { type: ['string'] },
      }),
    ).toEqual({ type: 'array', items: { type: ['string'] } });
  });

  it('rejects an array type with non-string items type array', () => {
    expect(() =>
      stringOrStringArraySchema.parse({
        type: 'array',
        items: { type: ['number'] },
      }),
    ).toThrow();
  });

  it('rejects an array type without items', () => {
    expect(() => stringOrStringArraySchema.parse({ type: 'array' })).toThrow();
  });

  it('rejects an array type with non-string items', () => {
    expect(() =>
      stringOrStringArraySchema.parse({
        type: 'array',
        items: { type: 'number' },
      }),
    ).toThrow();
  });

  it('rejects a number type', () => {
    expect(() => stringOrStringArraySchema.parse({ type: 'number' })).toThrow();
  });

  it('rejects a missing type', () => {
    expect(() => stringOrStringArraySchema.parse({})).toThrow();
  });
});
