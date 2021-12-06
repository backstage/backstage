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
import { parseGitLabGroupUrl } from './org';

describe('parseGitLabGroupUrl', () => {
  it('returns null if the url is valid but no group path', () => {
    expect(parseGitLabGroupUrl('https://example.com/')).toBeNull();
    expect(parseGitLabGroupUrl('https://example.com')).toBeNull();
  });

  it('returns gitlab group path with multiple levels of subgroups', () => {
    expect(parseGitLabGroupUrl('https://example.com/a')).toEqual('a');
    expect(parseGitLabGroupUrl('https://example.com/a/b')).toEqual('a/b');
    expect(parseGitLabGroupUrl('https://example.com/a/b/c')).toEqual('a/b/c');
  });

  it('handles reserved GitLab path components', () => {
    // first path component with groups redirects to path without groups
    expect(parseGitLabGroupUrl('https://example.com/groups/parent')).toEqual(
      'parent',
    );
    expect(parseGitLabGroupUrl('https://example.com/groups/a/b/c')).toEqual(
      'a/b/c',
    );

    // hyphen path component after group path is used to delimit subpages
    expect(
      parseGitLabGroupUrl('https://example.com/groups/parent/-/group_members'),
    ).toEqual('parent');
    expect(
      parseGitLabGroupUrl('https://example.com/groups/a/b/c/-/group_members'),
    ).toEqual('a/b/c');
  });

  it('throws error if group url invalid', () => {
    expect(() => parseGitLabGroupUrl('https://example.com/groups')).toThrow();
    expect(() => parseGitLabGroupUrl('invalid/url')).toThrow();
  });
});
