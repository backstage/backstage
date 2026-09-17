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

import { mergeJsonSchemas } from './mergeJsonSchemas';

describe('mergeJsonSchemas', () => {
  it('preserves literal JSON values inside const and default keywords', () => {
    expect(
      mergeJsonSchemas(
        { const: 'previous', default: 'previous' },
        { const: null, default: null },
      ),
    ).toEqual({ const: null, default: null });
    expect(
      mergeJsonSchemas(
        { const: { type: 'old', name: 'old' } },
        { const: { type: 'new', nested: null } },
      ),
    ).toEqual({ const: { type: 'new', nested: null } });
    expect(
      mergeJsonSchemas({}, { properties: { nothing: { const: null } } }),
    ).toEqual({ properties: { nothing: { const: null } } });
    expect(
      mergeJsonSchemas(
        {},
        { default: { config: { type: 'data', nullable: null } } },
      ),
    ).toEqual({ default: { config: { type: 'data', nullable: null } } });
  });

  it('preserves sibling schemas when updating a property named type', () => {
    for (const keyword of [
      'properties',
      'patternProperties',
      'definitions',
      '$defs',
    ]) {
      expect(
        mergeJsonSchemas(
          {
            [keyword]: {
              type: { type: 'string', minLength: 1 },
              owner: { type: 'string' },
            },
          },
          { [keyword]: { type: { enum: ['service'] } } },
        ),
      ).toEqual({
        [keyword]: {
          type: { type: 'string', minLength: 1, enum: ['service'] },
          owner: { type: 'string' },
        },
      });
    }
  });

  it('compares union types by value and retains constraints when adding a type', () => {
    expect(
      mergeJsonSchemas(
        { type: ['string', 'null'], minLength: 1 },
        { type: ['string', 'null'], description: 'updated' },
      ),
    ).toEqual({
      type: ['string', 'null'],
      minLength: 1,
      description: 'updated',
    });
    expect(
      mergeJsonSchemas(
        { properties: { name: { type: 'string' } } },
        { type: 'object' },
      ),
    ).toEqual({ type: 'object', properties: { name: { type: 'string' } } });
  });

  it('applies deletions inside newly added schemas', () => {
    expect(
      mergeJsonSchemas(
        {},
        { properties: { spec: { type: 'object', description: null } } },
      ),
    ).toEqual({ properties: { spec: { type: 'object' } } });
  });

  it('retains constraints when equivalent type unions are reordered', () => {
    expect(
      mergeJsonSchemas(
        { type: ['string', 'null'], minLength: 1 },
        { type: ['null', 'string'] },
      ),
    ).toEqual({ type: ['null', 'string'], minLength: 1 });
  });

  it('should merge scalar properties from source into target', () => {
    const result = mergeJsonSchemas(
      { type: 'object', description: 'old' },
      { description: 'new', title: 'My Schema' },
    );

    expect(result).toEqual({
      type: 'object',
      description: 'new',
      title: 'My Schema',
    });
  });

  it('should deep merge nested objects', () => {
    const result = mergeJsonSchemas(
      {
        type: 'object',
        properties: {
          spec: { type: 'object', properties: { owner: { type: 'string' } } },
        },
      },
      {
        properties: {
          spec: { properties: { name: { type: 'string' } } },
        },
      },
    );

    expect(result).toEqual({
      type: 'object',
      properties: {
        spec: {
          type: 'object',
          properties: {
            owner: { type: 'string' },
            name: { type: 'string' },
          },
        },
      },
    });
  });

  it('should delete properties when source value is null', () => {
    const result = mergeJsonSchemas(
      { type: 'object', description: 'remove me', title: 'keep' },
      { description: null },
    );

    expect(result).toEqual({ type: 'object', title: 'keep' });
  });

  it('should delete nested properties when source value is null', () => {
    const result = mergeJsonSchemas(
      {
        type: 'object',
        properties: {
          spec: { type: 'object', description: 'gone' },
          status: { type: 'object' },
        },
      },
      { properties: { spec: { description: null } } },
    );

    expect(result).toEqual({
      type: 'object',
      properties: {
        spec: { type: 'object' },
        status: { type: 'object' },
      },
    });
  });

  it('should fully replace when source has a different type', () => {
    const result = mergeJsonSchemas(
      { type: 'object', properties: { spec: { type: 'object' } } },
      { type: 'string', minLength: 1 },
    );

    expect(result).toEqual({ type: 'string', minLength: 1 });
  });

  it('should not fully replace when types match', () => {
    const result = mergeJsonSchemas(
      { type: 'object', description: 'old' },
      { type: 'object', title: 'added' },
    );

    expect(result).toEqual({
      type: 'object',
      description: 'old',
      title: 'added',
    });
  });

  it('should replace arrays rather than merging them', () => {
    const result = mergeJsonSchemas(
      { type: 'object', required: ['a', 'b'] },
      { required: ['c'] },
    );

    expect(result).toEqual({ type: 'object', required: ['c'] });
  });

  it('should not mutate target or source', () => {
    const target = {
      type: 'object',
      properties: { spec: { type: 'object', description: 'old' } },
    };
    const source = {
      properties: { spec: { description: 'new' } },
    };

    const targetCopy = JSON.parse(JSON.stringify(target));
    const sourceCopy = JSON.parse(JSON.stringify(source));

    mergeJsonSchemas(target, source);

    expect(target).toEqual(targetCopy);
    expect(source).toEqual(sourceCopy);
  });

  it('should handle source adding entirely new nested objects', () => {
    const result = mergeJsonSchemas(
      { type: 'object' },
      { properties: { spec: { type: 'object' } } },
    );

    expect(result).toEqual({
      type: 'object',
      properties: { spec: { type: 'object' } },
    });
  });

  it('should handle an empty source as a no-op', () => {
    const target = { type: 'object', description: 'keep' };
    const result = mergeJsonSchemas(target, {});

    expect(result).toEqual({ type: 'object', description: 'keep' });
  });
});
