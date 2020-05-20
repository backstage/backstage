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

import { CommonValidatorFunctions } from './CommonValidatorFunctions';

describe('CommonValidatorFunctions', () => {
  describe('isValidPrefixAndOrSuffix', () => {
    it('only accepts strings', () => {
      expect(
        CommonValidatorFunctions.isValidPrefixAndOrSuffix(
          null,
          '/',
          () => true,
          () => true,
        ),
      ).toBe(false);
      expect(
        CommonValidatorFunctions.isValidPrefixAndOrSuffix(
          7,
          '/',
          () => true,
          () => true,
        ),
      ).toBe(false);
      expect(
        CommonValidatorFunctions.isValidPrefixAndOrSuffix(
          () => 'hello',
          '/',
          () => true,
          () => true,
        ),
      ).toBe(false);
    });

    it('only accepts one or two parts', () => {
      expect(
        CommonValidatorFunctions.isValidPrefixAndOrSuffix(
          'a',
          '/',
          () => true,
          () => true,
        ),
      ).toBe(true);
      expect(
        CommonValidatorFunctions.isValidPrefixAndOrSuffix(
          'a/b',
          '/',
          () => true,
          () => true,
        ),
      ).toBe(true);
      expect(
        CommonValidatorFunctions.isValidPrefixAndOrSuffix(
          'a/b/c',
          '/',
          () => true,
          () => true,
        ),
      ).toBe(false);
    });

    it('checks the prefix and suffix', () => {
      expect(
        CommonValidatorFunctions.isValidPrefixAndOrSuffix(
          'a/b',
          '/',
          () => true,
          () => true,
        ),
      ).toBe(true);
      expect(
        CommonValidatorFunctions.isValidPrefixAndOrSuffix(
          'a/b',
          '/',
          () => false,
          () => true,
        ),
      ).toBe(false);
      expect(
        CommonValidatorFunctions.isValidPrefixAndOrSuffix(
          'a/b',
          '/',
          () => true,
          () => false,
        ),
      ).toBe(false);
    });
  });

  it.each([
    [null, true],
    [undefined, false],
    [1, true],
    ['a', true],
    [() => 'a', false],
    [Symbol('a'), false],
    [[], true],
    [[1], true],
    [[undefined], false],
    [{}, true],
    [{ a: 1 }, true],
    [{ a: undefined }, false],
  ] as [any, boolean][])('isJsonSafe', (value, result) => {
    expect(CommonValidatorFunctions.isJsonSafe(value)).toBe(result);
  });

  it.each([
    [null, false],
    [7, false],
    ['', false],
    ['a', true],
    ['a-b', true],
    ['-a-b', false],
    ['a-b-', false],
    ['a--b', false],
    ['a_b', false],
    ['adam.bertil.caesar', true],
    ['adam.ber-til.caesar', true],
    ['adam.-bertil.caesar', false],
    ['adam.bertil-.caesar', false],
    ['adam/bertil.caesar', false],
    [`a.${'b'.repeat(63)}.c`, true],
    [`a.${'b'.repeat(64)}.c`, false],
    [
      `${'a'.repeat(63)}.${'a'.repeat(63)}.${'a'.repeat(63)}.${'a'.repeat(61)}`,
      true,
    ],
    [
      `${'a'.repeat(63)}.${'a'.repeat(63)}.${'a'.repeat(63)}.${'a'.repeat(62)}`,
      false,
    ],
  ])('isValidDnsSubdomain', (value, result) => {
    expect(CommonValidatorFunctions.isValidDnsSubdomain(value)).toBe(result);
  });

  it.each([
    [null, false],
    [7, false],
    ['', false],
    ['a', true],
    ['a-b', true],
    ['-a-b', false],
    ['a-b-', false],
    ['a--b', false],
    ['a_b', false],
    [`${'a'.repeat(63)}`, true],
    [`${'a'.repeat(64)}`, false],
  ])('isValidDnsLabel', (value, result) => {
    expect(CommonValidatorFunctions.isValidDnsLabel(value)).toBe(result);
  });

  it.each([
    ['', ''],
    ['a', 'a'],
    ['a-b', 'ab'],
    ['-a-b', 'ab'],
    ['a_b', 'ab'],
    [`${'a'.repeat(6000)}`, `${'a'.repeat(6000)}`],
    ['_:;>!"#€', ''],
  ])('normalizeToLowercaseAlphanum', (value, result) => {
    expect(CommonValidatorFunctions.normalizeToLowercaseAlphanum(value)).toBe(
      result,
    );
  });
});
