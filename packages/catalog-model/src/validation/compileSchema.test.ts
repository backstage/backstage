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

import { compileSchema } from './compileSchema';
import { ajvSchemaEngine } from './engine/ajvSchemaEngine';
import {
  cfworkerSchemaEngine,
  validateAgainstMetaSchema,
} from './engine/cfworkerSchemaEngine';

describe('compileSchema', () => {
  const schema = {
    type: 'object',
    required: ['kind'],
    properties: {
      kind: { enum: ['Component'] },
      tags: { type: 'array', items: { type: 'string' } },
      metadata: { $ref: 'EntityMeta' },
    },
  };

  it.each([
    ['cfworker', cfworkerSchemaEngine],
    ['ajv', ajvSchemaEngine],
  ])('validates with the %s engine', (_name, engine) => {
    const validate = compileSchema(engine, schema, { disableCache: true });

    expect(validate({ kind: 'Component', metadata: { name: 'a' } })).toBe(
      undefined,
    );
    expect(validate({ kind: 'Api' })).toEqual([
      expect.objectContaining({ instancePath: '/kind', keyword: 'enum' }),
    ]);
    expect(validate({ kind: 'Component', metadata: { name: 7 } })).toEqual([
      expect.objectContaining({
        instancePath: '/metadata/name',
        keyword: 'type',
      }),
    ]);
    // undefined properties are absent, undefined array items are invalid
    expect(validate({ kind: 'Component', tags: undefined })).toBe(undefined);
    expect(validate({ kind: 'Component', tags: ['a', undefined] })).toEqual([
      expect.objectContaining({ instancePath: '/tags/1', keyword: 'type' }),
    ]);
    expect(validate(undefined)).toEqual([
      expect.objectContaining({ instancePath: '', keyword: 'type' }),
    ]);
  });

  it.each([
    ['cfworker', cfworkerSchemaEngine],
    ['ajv', ajvSchemaEngine],
  ])('handles edge case values with the %s engine', (_name, engine) => {
    const validate = compileSchema(
      engine,
      {
        type: 'object',
        additionalProperties: false,
        properties: {
          a: { type: 'array', items: { type: 'null' } },
          b: { type: 'string' },
        },
      },
      { disableCache: true },
    );

    // undefined array items fail even where null would pass
    expect(validate({ a: [undefined] })).toEqual([
      expect.objectContaining({ instancePath: '/a/0', keyword: 'type' }),
    ]);
    // an own __proto__ key is still seen as an additional property, also when
    // the undefined values are normalized away
    expect(validate(JSON.parse('{"__proto__":{"x":1}}'))).toEqual([
      expect.objectContaining({ keyword: 'additionalProperties' }),
    ]);
    expect(
      validate({ ...JSON.parse('{"__proto__":{"x":1}}'), b: undefined }),
    ).toEqual([expect.objectContaining({ keyword: 'additionalProperties' })]);

    // other schema errors are kept next to undefined array items
    expect(validate({ a: [undefined], b: 1 })).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ instancePath: '/a/0', keyword: 'type' }),
        expect.objectContaining({ instancePath: '/b', keyword: 'type' }),
      ]),
    );

    // circular references are reported rather than overflowing the stack
    const circular: Record<string, unknown> = { b: 'x' };
    circular.self = circular;
    expect(validate(circular)).toEqual([expect.anything()]);
    expect(validate({ a: [null], b: 'x', c: undefined, d: circular })).toEqual(
      expect.arrayContaining([expect.anything()]),
    );
  });

  it('rejects invalid schemas with ajv at compile time', () => {
    expect(() =>
      compileSchema(ajvSchemaEngine, { type: 'object', unknownKeyword: 1 }),
    ).toThrow(/unknown keyword/);
  });

  it('rejects malformed schemas with cfworker at compile time', () => {
    const compile = (s: object) =>
      compileSchema(cfworkerSchemaEngine, s, { disableCache: true });
    expect(() => compile({ type: 'not-a-type' })).toThrow(
      /Invalid JSON schema/,
    );
    expect(() =>
      compile({ properties: { a: { type: 'string', minimumLength: 3 } } }),
    ).toThrow(/unknown keyword "minimumLength" at path \/properties\/a/);
    expect(() =>
      compile({ $schema: 'https://json-schema.org/draft/2020-12/schema' }),
    ).toThrow(/unsupported \$schema/);
    expect(() =>
      compile({ $schema: 'https://json-schema.org/draft-07/schema#' }),
    ).toThrow(/unsupported \$schema/);
    expect(() =>
      compile({
        $schema: 'http://json-schema.org/draft-07/schema#',
        dependencies: { a: ['b'] },
      }),
    ).not.toThrow();
  });

  it.each([
    ['cfworker', cfworkerSchemaEngine],
    ['ajv', ajvSchemaEngine],
  ])('supports nullable with the %s engine', (_name, engine) => {
    const validate = compileSchema(
      engine,
      {
        type: 'object',
        properties: {
          a: { type: 'string', nullable: true },
          b: { type: 'string', enum: ['x', null], nullable: true },
          c: { type: 'string', nullable: false },
        },
      },
      { disableCache: true },
    );
    expect(validate({ a: null, b: null })).toBe(undefined);
    expect(validate({ a: 'x', b: 'x', c: 'x' })).toBe(undefined);
    expect(validate({ a: 1 })).toEqual([
      expect.objectContaining({ instancePath: '/a' }),
    ]);
    expect(validate({ b: 'y' })).toEqual([
      expect.objectContaining({ instancePath: '/b' }),
    ]);
    expect(validate({ c: null })).toEqual([
      expect.objectContaining({ instancePath: '/c' }),
    ]);
  });

  it.each([
    ['cfworker', cfworkerSchemaEngine],
    ['ajv', ajvSchemaEngine],
  ])('handles false schemas with the %s engine', (_name, engine) => {
    const reject = compileSchema(engine, false as any, { disableCache: true });
    expect(reject({})).toEqual([expect.anything()]);

    const validate = compileSchema(
      engine,
      { properties: { forbidden: false, name: { type: 'string' } } },
      { disableCache: true },
    );
    expect(validate({ forbidden: 1, name: 2 })).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ instancePath: '/forbidden' }),
        expect.objectContaining({ instancePath: '/name', keyword: 'type' }),
      ]),
    );
  });

  it('validates schemas against the meta schema', () => {
    expect(validateAgainstMetaSchema(schema)).toBe(undefined);
    expect(validateAgainstMetaSchema({ type: 'what-is-this' })).toEqual(
      expect.objectContaining({ instancePath: '/type' }),
    );
  });
});
