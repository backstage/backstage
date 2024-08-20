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

import { isJsonObject, getLastKey } from './util';

describe('isJsonObject', () => {
  it('should return true for non-null objects', () => {
    expect(isJsonObject({})).toBe(true);
    expect(isJsonObject({ key: 'value' })).toBe(true);
  });

  it('should return false for arrays', () => {
    expect(isJsonObject([])).toBe(false);
    expect(isJsonObject([1, 2, 3])).toBe(false);
  });

  it('should return false for non-objects', () => {
    expect(isJsonObject('string')).toBe(false);
    expect(isJsonObject(123)).toBe(false);
    expect(isJsonObject(true)).toBe(false);
    expect(isJsonObject(undefined)).toBe(false);
  });

  it('should return false for null values', () => {
    expect(isJsonObject(null)).toBe(false);
  });
});

describe('getLastKey', () => {
  it('should return the last part of a simple key', () => {
    expect(getLastKey('simple')).toBe('simple');
  });

  it('should return the last part of a nested key', () => {
    expect(getLastKey('parent/child')).toBe('child');
  });

  it('should return the last part of a deeply nested key', () => {
    expect(getLastKey('grandparent/parent/child')).toBe('child');
  });

  it('should handle keys with trailing slash', () => {
    expect(getLastKey('parent/child/')).toBe('');
  });

  it('should handle empty string', () => {
    expect(getLastKey('')).toBe('');
  });

  it('should handle keys with multiple consecutive slashes', () => {
    expect(getLastKey('parent//child')).toBe('child');
  });

  it('should handle keys with only slashes', () => {
    expect(getLastKey('////')).toBe('');
  });

  it('should handle keys with spaces', () => {
    expect(getLastKey('parent/child with spaces')).toBe('child with spaces');
  });

  it('should handle keys with special characters', () => {
    expect(getLastKey('parent/child@!#$%^&*()')).toBe('child@!#$%^&*()');
  });
});
