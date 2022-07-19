/*
 * Copyright 2020 The Backstage Authors
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

import { JsonObject } from '@backstage/types';
import { ConfigVisibility } from './types';
import { filterByVisibility, filterErrorsByVisibility } from './filtering';

const data = {
  arr: ['f', 'b', 's'],
  arrU: ['f', 'b', 't'],
  objArr: [
    { f: 1, b: 2, s: 3 },
    { f: 4, b: 5, s: 6 },
  ],
  obj: {
    f: 'a',
    b: {
      s: true,
    },
  },
  arrF: [{ never: 'here' }],
  arrB: [{ never: 'here' }],
  arrS: [{ never: 'here' }],
  objF: { never: 'here' },
  objB: { never: 'here' },
  objS: { never: 'here' },
};

const visibility = new Map<string, ConfigVisibility>(
  Object.entries({
    '/arrU': 'frontend',
    '/arrU/2': 'backend',
    '/arr/0': 'frontend',
    '/arr/1': 'backend',
    '/arr/2': 'secret',
    '/obj/f': 'frontend',
    '/obj/b': 'backend',
    '/obj/b/s': 'secret',
    '/objArr/0/f': 'frontend',
    '/objArr/0/b': 'backend',
    '/objArr/0/s': 'secret',
    '/objArr/1/f': 'frontend',
    '/objArr/1/b': 'backend',
    '/objArr/1/s': 'secret',
    '/arrF': 'frontend',
    '/arrB': 'backend',
    '/arrS': 'secret',
    '/objF': 'frontend',
    '/objB': 'backend',
    '/objS': 'secret',
  }),
);

const deprecations = new Map<string, string>(
  Object.entries({
    '/arr': 'deprecated array',
    '/objB/never': 'deprecated nested property',
  }),
);

describe('filterByVisibility', () => {
  test.each<[ConfigVisibility[], JsonObject]>([
    [
      [],
      {
        data: {},
        filteredKeys: [
          'arr[0]',
          'arr[1]',
          'arr[2]',
          'arrU[0]',
          'arrU[1]',
          'arrU[2]',
          'objArr[0].f',
          'objArr[0].b',
          'objArr[0].s',
          'objArr[1].f',
          'objArr[1].b',
          'objArr[1].s',
          'obj.f',
          'obj.b.s',
          'arrF[0].never',
          'arrB[0].never',
          'arrS[0].never',
          'objF.never',
          'objB.never',
          'objS.never',
        ],
      },
    ],
    [
      ['frontend'],
      {
        data: {
          arr: ['f'],
          objArr: [{ f: 1 }, { f: 4 }],
          obj: { f: 'a' },
          arrF: [],
          objF: {},
          arrU: ['f', 'b'],
        },
        filteredKeys: [
          'arr[1]',
          'arr[2]',
          'arrU[2]',
          'objArr[0].b',
          'objArr[0].s',
          'objArr[1].b',
          'objArr[1].s',
          'obj.b.s',
          'arrF[0].never',
          'arrB[0].never',
          'arrS[0].never',
          'objF.never',
          'objB.never',
          'objS.never',
        ],
      },
    ],
    [
      ['backend'],
      {
        data: {
          arr: ['b'],
          arrU: ['t'],
          objArr: [{ b: 2 }, { b: 5 }],
          obj: { b: {} },
          arrF: [{ never: 'here' }],
          arrB: [{ never: 'here' }],
          arrS: [{ never: 'here' }],
          objF: { never: 'here' },
          objB: { never: 'here' },
          objS: { never: 'here' },
        },
        filteredKeys: [
          'arr[0]',
          'arr[2]',
          'arrU[0]',
          'arrU[1]',
          'objArr[0].f',
          'objArr[0].s',
          'objArr[1].f',
          'objArr[1].s',
          'obj.f',
          'obj.b.s',
        ],
      },
    ],
    [
      ['secret'],
      {
        data: {
          arr: ['s'],
          objArr: [{ s: 3 }, { s: 6 }],
          obj: { b: { s: true } },
          arrS: [],
          objS: {},
        },
        filteredKeys: [
          'arr[0]',
          'arr[1]',
          'arrU[0]',
          'arrU[1]',
          'arrU[2]',
          'objArr[0].f',
          'objArr[0].b',
          'objArr[1].f',
          'objArr[1].b',
          'obj.f',
          'arrF[0].never',
          'arrB[0].never',
          'arrS[0].never',
          'objF.never',
          'objB.never',
          'objS.never',
        ],
      },
    ],
    [['frontend', 'backend', 'secret'], { data, filteredKeys: [] }],
  ])('should filter correctly with %p', (filter, expected) => {
    expect(
      filterByVisibility(
        data,
        filter,
        visibility,
        deprecations,
        undefined,
        true,
        false,
      ),
    ).toEqual(expected);
  });

  it('should include deprecated keys regardless of visibility', () => {
    expect(
      filterByVisibility(
        data,
        [],
        visibility,
        deprecations,
        undefined,
        true,
        true,
      ).deprecatedKeys,
    ).toEqual([
      { key: 'arr', description: 'deprecated array' },
      { key: 'objB.never', description: 'deprecated nested property' },
    ]);
  });
});

describe('filterErrorsByVisibility', () => {
  it('should allow empty input', () => {
    expect(
      filterErrorsByVisibility(undefined, ['frontend'], new Map(), new Map()),
    ).toEqual([]);
    expect(
      filterErrorsByVisibility(
        ['my-error' as any],
        undefined,
        new Map(),
        new Map(),
      ),
    ).toEqual(['my-error']);
    expect(
      filterErrorsByVisibility([], ['frontend'], new Map(), new Map()),
    ).toEqual([]);
  });

  it('should filter generic errors', () => {
    const errors = [
      {
        keyword: 'something',
        instancePath: '/a',
        schemaPath: '#/properties/a/something',
        params: {},
        message: 'a',
      },
      {
        keyword: 'something',
        instancePath: '/b',
        schemaPath: '#/properties/b/something',
        params: {},
        message: 'b',
      },
      {
        keyword: 'something',
        instancePath: '/c',
        schemaPath: '#/properties/c/something',
        params: {},
        message: 'c',
      },
    ];
    const visibilityByDataPath = new Map<string, ConfigVisibility>([
      ['/a', 'frontend'],
      ['/c', 'secret'],
    ]);

    expect(
      filterErrorsByVisibility(
        errors,
        undefined,
        visibilityByDataPath,
        new Map(),
      ),
    ).toEqual([
      expect.objectContaining({ message: 'a' }),
      expect.objectContaining({ message: 'b' }),
      expect.objectContaining({ message: 'c' }),
    ]);
    expect(
      filterErrorsByVisibility(
        errors,
        ['frontend'],
        visibilityByDataPath,
        new Map(),
      ),
    ).toEqual([expect.objectContaining({ message: 'a' })]);
    expect(
      filterErrorsByVisibility(
        errors,
        ['backend'],
        visibilityByDataPath,
        new Map(),
      ),
    ).toEqual([expect.objectContaining({ message: 'b' })]);
    expect(
      filterErrorsByVisibility(
        errors,
        ['secret'],
        visibilityByDataPath,
        new Map(),
      ),
    ).toEqual([expect.objectContaining({ message: 'c' })]);
    expect(
      filterErrorsByVisibility(errors, [], visibilityByDataPath, new Map()),
    ).toEqual([]);
  });

  it('should always forward structural type errors', () => {
    const errors = [
      {
        keyword: 'type',
        instancePath: '/a',
        schemaPath: '#/properties/a/type',
        params: { type: 'number' },
        message: 'a',
      },
      {
        keyword: 'type',
        instancePath: '/b',
        schemaPath: '#/properties/b/type',
        params: { type: 'string' },
        message: 'b',
      },
      {
        keyword: 'type',
        instancePath: '/c',
        schemaPath: '#/properties/c/type',
        params: { type: 'array' },
        message: 'c',
      },
      {
        keyword: 'type',
        instancePath: '/c',
        schemaPath: '#/properties/c/type',
        params: { type: 'object' },
        message: 'd',
      },
      {
        keyword: 'type',
        instancePath: '/c',
        schemaPath: '#/properties/c/type',
        params: { type: 'null' },
        message: 'e',
      },
    ];
    const visibilityByDataPath = new Map<string, ConfigVisibility>([
      ['/a', 'secret'],
      ['/b', 'secret'],
      ['/c', 'secret'],
      ['/d', 'secret'],
      ['/e', 'secret'],
    ]);

    expect(
      filterErrorsByVisibility(
        errors,
        ['frontend'],
        visibilityByDataPath,
        new Map(),
      ),
    ).toEqual([
      expect.objectContaining({ message: 'c' }),
      expect.objectContaining({ message: 'd' }),
    ]);
  });

  it('should filter requirement errors based on schema path', () => {
    const errors = [
      {
        keyword: 'required',
        instancePath: '/a',
        schemaPath: '#/properties/o/required',
        params: { missingProperty: 'a' },
        message: 'a',
      },
      {
        keyword: 'required',
        instancePath: '/b',
        schemaPath: '#/properties/o/required',
        params: { missingProperty: 'b' },
        message: 'b',
      },
      {
        keyword: 'required',
        instancePath: '/c',
        schemaPath: '#/properties/o/required',
        params: { missingProperty: 'c' },
        message: 'c',
      },
    ];
    const visibilityBySchemaPath = new Map<string, ConfigVisibility>([
      ['/properties/o', 'secret'],
      ['/properties/o/properties/a', 'frontend'],
      ['/properties/o/properties/b', 'secret'],
      ['/properties/o/properties/c/properties/x', 'frontend'],
    ]);

    expect(
      filterErrorsByVisibility(
        errors,
        ['frontend'],
        new Map(),
        visibilityBySchemaPath,
      ),
    ).toEqual([
      expect.objectContaining({ message: 'a' }),
      expect.objectContaining({ message: 'c' }),
    ]);
  });
});
