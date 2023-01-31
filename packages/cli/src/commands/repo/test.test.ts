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

import { createFlagFinder } from './test';

describe('createFlagFinder', () => {
  it('finds flags', () => {
    const find = createFlagFinder([
      '--foo',
      '--no-bar',
      '-b',
      '-c',
      '--baz=1',
      '--qux',
      '2',
      '-de',
    ]);

    expect(
      find('--foo', '--bar', '-b', '-c', '--baz', '--qux', '-d', '-e'),
    ).toBe(true);
    expect(find('--foo')).toBe(true);
    expect(find('--bar')).toBe(true);
    expect(find('--no-bar')).toBe(false);
    expect(find('-a')).toBe(false);
    expect(find('-b')).toBe(true);
    expect(find('-c')).toBe(true);
    expect(find('-d')).toBe(true);
    expect(find('-e')).toBe(true);
    expect(find('--baz')).toBe(true);
    expect(find('--qux')).toBe(true);
    expect(find('--qux')).toBe(true);
  });
});
