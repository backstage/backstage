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

import { validateMetaSchema } from './validateMetaSchema';

describe('validateMetaSchema', () => {
  it('should validate a valid schema', () => {
    const simpleSchema = {
      type: 'object',
      properties: {
        name: { type: 'string' },
      },
    };
    expect(validateMetaSchema(simpleSchema)).toEqual(true);
    const complexSchema = require('../../schema/kinds/Component.v1alpha1.schema.json');
    expect(validateMetaSchema(complexSchema)).toEqual(true);
  });

  it('should throw an error for an invalid schema', () => {
    const schema = {
      type: 'object',
      properties: {
        name: { type: 'what-is-this' },
      },
    };
    expect(() => validateMetaSchema(schema)).toThrow('Invalid JSON schema');
  });

  it('should gracefully handle completely wrong input', () => {
    expect(() => validateMetaSchema(undefined)).toThrow('Invalid JSON schema');
    expect(() => validateMetaSchema(null)).toThrow('Invalid JSON schema');
    expect(() => validateMetaSchema(true)).toThrow('Invalid JSON schema');
    expect(() => validateMetaSchema(false)).toThrow('Invalid JSON schema');
    expect(() => validateMetaSchema(123)).toThrow('Invalid JSON schema');
    expect(() => validateMetaSchema('string')).toThrow('Invalid JSON schema');
  });
});
