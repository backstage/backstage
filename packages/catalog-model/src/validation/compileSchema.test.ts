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

  it('rejects invalid schemas with ajv at compile time', () => {
    expect(() =>
      compileSchema(ajvSchemaEngine, { type: 'object', unknownKeyword: 1 }),
    ).toThrow(/unknown keyword/);
  });

  it('validates schemas against the meta schema', () => {
    expect(validateAgainstMetaSchema(schema)).toBe(undefined);
    expect(validateAgainstMetaSchema({ type: 'what-is-this' })).toEqual(
      expect.objectContaining({ instancePath: '/type' }),
    );
  });
});
