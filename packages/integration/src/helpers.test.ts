/*
 * Copyright 2020 Spotify AB
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

import { isValidHost } from './helpers';

describe('isValidHost', () => {
  it.each([
    ['example.com', true],
    ['foo', true],
    ['foo:1', true],
    ['foo:10000', true],
    ['foo.bar', true],
    ['foo.bar.baz', true],
    ['1.2.3.4', true],
    ['[::]', true],
    ['[::1]', true],
    ['[1:2:3:4:5:6:7:8]', true],
    ['1.2.3.4.5.6.7.8', true],
    ['https://example.com', false],
    ['foo:100000', false],
    ['FOO', false],
    ['Foo', false],
    ['foo/bar', false],
    ['//foo', false],
    ['foo:bar', false],
    ['foo?', false],
    ['foo?bar', false],
    ['foo#', false],
    ['foo#bar', false],
    ['::', false],
    ['::1', false],
    ['1:2:3:4:5:6:7:8', false],
    ['???????', false],
    ['€&()=)&(', false],
    ['höst', false],
    ['πœπœﬁπœ', false],
  ])('Should check whether %s is a valid host', (str, expected) => {
    expect(isValidHost(str)).toBe(expected);
  });
});
