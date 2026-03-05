/*
 * Copyright 2024 The Backstage Authors
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
import { flattenParams, parseNumberParam, parseStringsParam } from './helpers';

describe('parseStringsParam', () => {
  it('should parse a single string', () => {
    expect(parseStringsParam('hello', 'param')).toEqual(['hello']);
  });

  it('should parse an array of strings', () => {
    expect(parseStringsParam(['hello', 'world'], 'param')).toEqual([
      'hello',
      'world',
    ]);
  });

  it('should return undefined for undefined', () => {
    expect(parseStringsParam(undefined, 'param')).toBeUndefined();
  });

  it('should throw an error for non-string values', () => {
    expect(() => parseStringsParam(5, 'param')).toThrow(
      'Invalid param, not a string or array of strings',
    );
  });
});

describe('parseNumberParam', () => {
  it('should parse a number', () => {
    expect(parseNumberParam('5', 'param')).toEqual([5]);
  });

  it('should throw an error for a non-number', () => {
    expect(() => parseNumberParam('hello', 'param')).toThrow(
      'Invalid param parameter "hello", expected a number or array of numbers',
    );
  });

  it('should return undefined for undefined', () => {
    expect(parseNumberParam(undefined, 'param')).toBeUndefined();
  });
});

describe('flattenParams', () => {
  it('should flatten a single string', () => {
    expect(flattenParams<string>('hello')).toEqual(['hello']);
  });

  it('should flatten an array of strings', () => {
    expect(flattenParams<string>(['hello', 'world'])).toEqual([
      'hello',
      'world',
    ]);
  });

  it('should flatten mixed parameters', () => {
    expect(flattenParams<string>(['hello', 'world'], 'foo', undefined)).toEqual(
      ['hello', 'world', 'foo'],
    );
  });
});
