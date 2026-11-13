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

import {
  describeJsonSchemaFields,
  renderJsonSchemaField,
} from './describeJsonSchema';

const fieldLines = (schema: object, maxDepth = 3, omit?: string[]) =>
  describeJsonSchemaFields(schema, {
    maxDepth,
    omitRootProperties: omit ? new Set(omit) : undefined,
  }).map(renderJsonSchemaField);

describe('describeJsonSchemaFields', () => {
  it('lists fields by dot path, honoring the options', () => {
    const schema = {
      type: 'object',
      required: ['name'],
      properties: {
        id: { type: 'string' },
        name: { type: 'string', maxLength: 64, description: 'The\nname.' },
        nested: {
          type: 'object',
          properties: {
            inner: { type: 'object', properties: { deep: { type: 'number' } } },
          },
        },
      },
    };

    expect(fieldLines(schema, 2, ['id'])).toEqual([
      '* "name" (string, required, max length 64): The name.',
      '* "nested" (object)',
      '* "nested.inner" (object, has nested fields not listed here)',
    ]);
    expect(fieldLines(schema)).toContain('* "nested.inner.deep" (number)');
    expect(fieldLines(schema)).toContain('* "id" (string)');
  });

  it('marks allOf instead of merging it', () => {
    expect(
      fieldLines({
        properties: {
          value: { allOf: [{ type: 'integer' }, { minimum: 2 }] },
        },
      }),
    ).toEqual([
      '* "value" (unknown, has conditional constraints not listed here)',
    ]);
  });

  it('renders extra parts added to a field', () => {
    const [field] = describeJsonSchemaFields(
      { properties: { owner: { type: 'string' } } },
      { maxDepth: 1 },
    );
    field.parts.push('extra');
    expect(renderJsonSchemaField(field)).toBe('* "owner" (string, extra)');
  });
});
