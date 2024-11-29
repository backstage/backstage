/*
 * Copyright 2021 The Backstage Authors
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

import { assertError, isError } from './assertion';
import { NotFoundError } from './common';
import { CustomErrorBase } from './CustomErrorBase';

const areErrors = [
  { name: 'e', message: '' },
  new Error(),
  new NotFoundError(),
  Object.create({ name: 'e', message: '' }),
  Object.assign(Object.create({ name: 'e' }), {
    get message() {
      return '';
    },
  }),
  new (class extends class {
    message = '';
  } {
    name = 'e';
  })(),
  new (class SubclassError extends CustomErrorBase {})(),
  new (class SubclassError extends NotFoundError {})(),
];

const notErrors = [
  null,
  0,
  'loller',
  Symbol(),
  [],
  BigInt(0),
  false,
  true,
  { name: 'e' },
  { message: '' },
  { name: '', message: 'oh no' },
  new (class {})(),
];

describe('assertError', () => {
  it.each(areErrors)('should assert that things are errors %#', error => {
    expect(assertError(error)).toBeUndefined();
  });

  it.each(notErrors)(
    'should assert that things are not errors %#',
    notError => {
      expect(() => assertError(notError)).toThrow();
    },
  );
});

describe('isError', () => {
  it.each(areErrors)('should assert that things are errors %#', error => {
    expect(isError(error)).toBe(true);
  });

  it.each(notErrors)(
    'should assert that things are not errors %#',
    notError => {
      expect(isError(notError)).toBe(false);
    },
  );
});
