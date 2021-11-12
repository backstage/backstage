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

import {
  ContextValues,
  findInContextValues,
  unshiftContextValues,
} from './values';

describe('ContextValues', () => {
  it('can start from the empty list', () => {
    let list: ContextValues = undefined;
    expect(findInContextValues(list, 'a')).toBeUndefined();
    list = unshiftContextValues(list, 'a', 'b');
    expect(findInContextValues(list, 'a')).toBe('b');
    expect(findInContextValues(list, 'x')).toBeUndefined();
  });

  it('always fetches the most recent value', () => {
    let list: ContextValues = undefined;
    expect(findInContextValues(list, 'a')).toBeUndefined();
    list = unshiftContextValues(list, 'a', 1);
    expect(findInContextValues(list, 'a')).toBe(1);
    list = unshiftContextValues(list, 'a', 2);
    expect(findInContextValues(list, 'a')).toBe(2);
  });

  it('handles all key types', () => {
    let list: ContextValues = undefined;
    const symbol1 = Symbol('str');
    const symbol2 = Symbol('str');
    list = unshiftContextValues(list, 'str', 'str');
    list = unshiftContextValues(list, symbol1, 'sym');
    expect(findInContextValues(list, 'str')).toBe('str');
    expect(findInContextValues(list, symbol1)).toBe('sym');
    expect(findInContextValues(list, 'blah')).toBeUndefined();
    expect(findInContextValues(list, symbol2)).toBeUndefined();
  });
});
