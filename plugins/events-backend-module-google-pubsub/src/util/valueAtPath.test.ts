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

import { valueAtPath } from './valueAtPath';

describe('valueAtPath', () => {
  const subject = {
    name: 'Test',
    fields: {
      value: 123,
      tags: ['production', 'beta'],
      array: [1, 2, { nested: 'value' }],
      nested: {
        level: 1,
        deeper: {
          level: 2,
        },
      },
    },
    mixed: {
      'foo.bar.baz': 1,
      foo: { 'bar.baz': 3, bar: { baz: 4, qux: 4 } },
      'foo.bar': { baz: 2, qux: 2, quux: 2 },
      annotations: {
        'example.com/description': 'A test subject',
        'long.domain.example.com/custom': 'long',
      },
    },
  };

  it.each([
    ['name', 'Test'],
    ['unknown', undefined],
    ['fields.value', 123],
    ['fields.tags', ['production', 'beta']],
    ['fields.array', [1, 2, { nested: 'value' }]],
    ['fields.array.0', undefined], // Arrays are not traversed
    ['fields.array.2', undefined], // Arrays are not traversed
    ['fields.array.2.nested', undefined], // Arrays are not traversed
    ['fields.nested.level', 1],
    ['fields.nested.deeper.level', 2],
    ['mixed.foo.bar.baz', 1], // First one wins
    ['mixed.foo.bar.qux', 4], // First one wins
    ['mixed.foo.bar.quux', 2], // Should not get stuck in earlier partial matches
    ['mixed.annotations.example.com/description', 'A test subject'],
    ['mixed.annotations.long.domain.example.com/custom', 'long'],
  ])(`should find value at path %s`, (path, expected) => {
    expect(valueAtPath(subject, path)).toEqual(expected);
  });
});
