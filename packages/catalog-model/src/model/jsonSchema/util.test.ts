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

import { isJsonObject, isJsonObjectDeep } from './util';

describe('isJsonObject', () => {
  it('should return true for a valid JSON object', () => {
    expect(isJsonObject({ foo: 'bar' })).toBe(true);
  });

  it('should return false for a non-object', () => {
    expect(isJsonObject('foo')).toBe(false);
  });

  it('should return false for an array', () => {
    expect(isJsonObject(['foo', 'bar'])).toBe(false);
  });
});

describe('isJsonObjectDeep', () => {
  it('should return true for an empty object', () => {
    expect(isJsonObjectDeep({})).toBe(true);
  });

  it('should return true for an object with JSON primitive values', () => {
    expect(isJsonObjectDeep({ s: 'hello', n: 42, b: true, nil: null })).toBe(
      true,
    );
  });

  it('should return true for nested objects and arrays', () => {
    expect(
      isJsonObjectDeep({
        nested: { deep: { value: 'ok' } },
        list: [1, 'two', { three: 3 }],
      }),
    ).toBe(true);
  });

  it('should return false for non-objects', () => {
    expect(isJsonObjectDeep('string')).toBe(false);
    expect(isJsonObjectDeep(42)).toBe(false);
    expect(isJsonObjectDeep(null)).toBe(false);
    expect(isJsonObjectDeep(undefined)).toBe(false);
    expect(isJsonObjectDeep([1, 2])).toBe(false);
  });

  it('should return false when a nested value is a function', () => {
    expect(isJsonObjectDeep({ fn: () => {} })).toBe(false);
  });

  it('should return false when a deeply nested value is invalid', () => {
    expect(isJsonObjectDeep({ a: { b: { c: undefined } } })).toBe(false);
  });

  it('should return false when an array contains invalid values', () => {
    expect(isJsonObjectDeep({ list: [1, Symbol('bad')] })).toBe(false);
  });

  it('should return false for circular references without crashing', () => {
    const obj: Record<string, unknown> = { a: 1 };
    obj.self = obj;
    expect(isJsonObjectDeep(obj)).toBe(false);
  });

  it('should return false for deeply nested circular references', () => {
    const inner: Record<string, unknown> = { x: 1 };
    const obj = { a: { b: inner } };
    inner.loop = obj;
    expect(isJsonObjectDeep(obj)).toBe(false);
  });
});
