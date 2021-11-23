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

import { isValidUrl, validUrlResult } from './urls';

describe('isValidUrl', () => {
  it('should return true for url', () => {
    const validUrl = isValidUrl('http://some.valid.url');
    expect(validUrl).toBe(true);
  });

  it('should return false for absolute path', () => {
    const validUrl = isValidUrl('/some/absolute/path');
    expect(validUrl).toBe(false);
  });

  it('should return false for relative path', () => {
    const validUrl = isValidUrl('../some/relative/path');
    expect(validUrl).toBe(false);
  });
});


describe('validUrlResult', () => {
  it('should return url value for url', () => {
    let url = validUrlResult('http://some.valid.url');
    expect(url).not.toBeNull();
    url = url as URL;
    
    const expected = new URL('http://some.valid.url');
    expect(url).toEqual(expected);
    expect(url.href).toBe(expected.href);
  });

  it('should return null for absolute path', () => {
    const validUrl = validUrlResult('/some/absolute/path');
    expect(validUrl).toBe(null);
  });

  it('should return null for relative path', () => {
    const validUrl = validUrlResult('../some/relative/path');
    expect(validUrl).toBe(null);
  });
});
