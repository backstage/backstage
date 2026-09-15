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

import { generatePath } from './generatePath';

describe('generatePath', () => {
  it('should interpolate params', () => {
    expect(
      generatePath('/entity/:kind/:name', {
        kind: 'component',
        name: 'foo',
      }),
    ).toBe('/entity/component/foo');
  });

  it('should handle optional params', () => {
    expect(generatePath('/entity/:id?', {})).toBe('/entity');
  });

  it('should handle splat routes', () => {
    expect(generatePath('/files/*', { '*': 'path/to/file' })).toBe(
      '/files/path/to/file',
    );
  });

  it('should throw for missing required params', () => {
    expect(() =>
      generatePath('/entity/:kind/:name', { kind: 'component' }),
    ).toThrow('Missing required param "name"');
  });

  it('should encode dangerous characters in param values', () => {
    expect(generatePath('/entity/:name', { name: 'foo/bar' })).toBe(
      '/entity/foo%2Fbar',
    );
    expect(generatePath('/entity/:name', { name: 'a&b?c#d;e' })).toBe(
      '/entity/a%26b%3Fc%23d%3Be',
    );
  });

  it('should not double-encode percent signs', () => {
    expect(generatePath('/entity/:name', { name: 'foo%2Fbar' })).toBe(
      '/entity/foo%2Fbar',
    );
  });

  it('should keep a trailing `*` that is part of a param value', () => {
    expect(generatePath('/search/:term', { term: 'C*' })).toBe('/search/C*');
    expect(generatePath('/search/:term/*', { term: 'C*', '*': 'a*/b' })).toBe(
      '/search/C*/a*/b',
    );
  });

  it('should support hyphenated param names', () => {
    expect(generatePath('/entity/:my-param', { 'my-param': 'x' })).toBe(
      '/entity/x',
    );
    expect(generatePath('/entity/:my-param?', {})).toBe('/entity');
    expect(() => generatePath('/entity/:my-param', {})).toThrow(
      'Missing required param "my-param"',
    );
  });

  it('should handle paths with no params', () => {
    expect(generatePath('/simple/path')).toBe('/simple/path');
  });

  it('should collapse double slashes from optional params', () => {
    expect(generatePath('/a/:b?/c', {})).toBe('/a/c');
  });
});
