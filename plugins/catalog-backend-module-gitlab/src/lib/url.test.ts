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

import { parseGroupUrl, getUrlPathComponents } from './url';

describe('parseGroupUrl', () => {
  it('returns undefined if the url is valid but no group path', () => {
    expect(parseGroupUrl('https://example.com/')).toBeUndefined();
    expect(parseGroupUrl('https://example.com')).toBeUndefined();
    expect(parseGroupUrl('https://example.com/groups')).toBeUndefined();
  });

  it('returns gitlab group path with multiple levels of subgroups', () => {
    expect(parseGroupUrl('https://example.com/a')).toEqual('a');
    expect(parseGroupUrl('https://example.com/a/b')).toEqual('a/b');
    expect(parseGroupUrl('https://example.com/a/b/c')).toEqual('a/b/c');
  });

  it('handles reserved GitLab path components', () => {
    // first path component with groups redirects to path without groups
    expect(parseGroupUrl('https://example.com/groups/parent')).toEqual(
      'parent',
    );
    expect(parseGroupUrl('https://example.com/groups/a/b/c')).toEqual('a/b/c');

    // hyphen path component after group path is used to delimit subpages
    expect(
      parseGroupUrl('https://example.com/groups/parent/-/group_members'),
    ).toEqual('parent');
    expect(
      parseGroupUrl('https://example.com/groups/a/b/c/-/group_members'),
    ).toEqual('a/b/c');
  });

  it('throws error if group url invalid', () => {
    expect(() => parseGroupUrl('invalid/url')).toThrow();
  });
});

describe('getUrlPathComponents', () => {
  it('should provide array of group path components', () => {
    // simple use case
    expect(getUrlPathComponents('https://example.com/')).toEqual([]);
    expect(getUrlPathComponents('https://example.com/a')).toEqual(['a']);
    expect(getUrlPathComponents('https://example.com/a/')).toEqual(['a']);
    expect(getUrlPathComponents('https://example.com/a/b')).toEqual(['a', 'b']);
    expect(getUrlPathComponents('https://example.com/a/b/')).toEqual([
      'a',
      'b',
    ]);
  });

  it('should strip out base URL path components', () => {
    expect(
      getUrlPathComponents(
        'https://example.com/dir',
        'https://example.com/dir',
      ),
    ).toEqual([]);
    expect(
      getUrlPathComponents(
        'https://example.com/dir/a',
        'https://example.com/dir',
      ),
    ).toEqual(['a']);
    expect(
      getUrlPathComponents(
        'https://example.com/dir/a',
        'https://example.com/dir/',
      ),
    ).toEqual(['a']);

    expect(
      getUrlPathComponents(
        'https://example.com/dir/a/',
        'https://example.com/dir',
      ),
    ).toEqual(['a']);
    expect(
      getUrlPathComponents(
        'https://example.com/dir/a/b',
        'https://example.com/dir',
      ),
    ).toEqual(['a', 'b']);
    expect(
      getUrlPathComponents(
        'https://example.com/dir/a/b/',
        'https://example.com/dir',
      ),
    ).toEqual(['a', 'b']);
  });

  it('should handle base URL with no path components', () => {
    expect(
      getUrlPathComponents('https://example.com/a', 'https://example.com/'),
    ).toEqual(['a']);
    expect(
      getUrlPathComponents('https://example.com/a/', 'https://example.com/'),
    ).toEqual(['a']);

    expect(
      getUrlPathComponents('https://example.com/a/b', 'https://example.com'),
    ).toEqual(['a', 'b']);
    expect(
      getUrlPathComponents('https://example.com/a/b/', 'https://example.com'),
    ).toEqual(['a', 'b']);
  });

  it('throws error if base url is not a substring of the group url', () => {
    expect(() =>
      getUrlPathComponents(
        'https://example.com/groups',
        'https://wrong.example.com/dir',
      ),
    ).toThrow();
  });
});
