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
import { cfworkerSchemaEngine } from './engine/cfworkerSchemaEngine';
import { getSchemaEngine, setSchemaEngine } from './engine/registry';

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

  afterEach(() => {
    setSchemaEngine(cfworkerSchemaEngine);
  });

  it('validates with either engine', () => {
    for (const engine of [cfworkerSchemaEngine, ajvSchemaEngine]) {
      setSchemaEngine(engine);
      const validate = compileSchema(schema, { disableCache: true });

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
    }
  });

  it('defaults to the interpreting engine and switches on next use', () => {
    expect(getSchemaEngine()).toBe(cfworkerSchemaEngine);

    const validate = compileSchema(schema);
    expect(validate({ kind: 'Api' })?.[0].message).toBe(
      'Instance does not match any of ["Component"].',
    );

    setSchemaEngine(ajvSchemaEngine);
    expect(validate({ kind: 'Api' })?.[0].message).toBe(
      'must be equal to one of the allowed values',
    );
  });

  it('validates schemas against the meta schema with either engine', () => {
    for (const engine of [cfworkerSchemaEngine, ajvSchemaEngine]) {
      expect(engine.validateSchema(schema)).toBe(undefined);
      expect(engine.validateSchema({ type: 'what-is-this' })).toEqual(
        expect.objectContaining({ instancePath: '/type' }),
      );
    }
  });
});
