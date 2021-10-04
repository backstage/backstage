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

import { JsonObject } from '@backstage/config';
import { ConfigVisibility } from './types';
import { filterByVisibility } from './filtering';

const data = {
  arr: ['f', 'b', 's'],
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
        },
        filteredKeys: [
          'arr[1]',
          'arr[2]',
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
      filterByVisibility(data, filter, visibility, undefined, true),
    ).toEqual(expected);
  });
});
