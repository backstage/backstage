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

import { GithubTopicFilters } from '../providers/GithubEntityProviderConfig';
import { parseGithubOrgUrl, satisfiesTopicFilter } from './util';

describe('parseGithubOrgUrl', () => {
  it('only supports clean org urls, and decodes them', () => {
    expect(() => parseGithubOrgUrl('https://github.com')).toThrow();
    expect(() => parseGithubOrgUrl('https://github.com/org/foo')).toThrow();
    expect(() =>
      parseGithubOrgUrl('https://github.com/org/foo/teams'),
    ).toThrow();
    expect(parseGithubOrgUrl('https://github.com/foo%32')).toEqual({
      org: 'foo2',
    });
  });
});

describe('satisfiesTopicFilter', () => {
  it('handles cases where the filter will never apply', () => {
    expect(satisfiesTopicFilter([], undefined)).toEqual(true);
    expect(
      satisfiesTopicFilter([], { include: undefined, exclude: undefined }),
    ).toEqual(true);
    expect(satisfiesTopicFilter([], { include: [], exclude: [] })).toEqual(
      true,
    );
  });

  it('handles cases where include filter is configured', () => {
    const filter: GithubTopicFilters = {
      include: ['backstage-include', 'open-source'],
      exclude: undefined,
    };
    expect(satisfiesTopicFilter([], filter)).toEqual(false);
    expect(satisfiesTopicFilter(['blah', 'something-else'], filter)).toEqual(
      false,
    );
    expect(satisfiesTopicFilter(['backstage-include'], filter)).toEqual(true);
    expect(
      satisfiesTopicFilter(['backstage-include', 'open-source'], filter),
    ).toEqual(true);
  });

  it('handles cases where exclude filter is configured', () => {
    const filter: GithubTopicFilters = {
      include: undefined,
      exclude: ['backstage-exclude', 'experiment'],
    };
    expect(satisfiesTopicFilter([], filter)).toEqual(true);
    expect(satisfiesTopicFilter(['blah', 'bleh'], filter)).toEqual(true);
    expect(
      satisfiesTopicFilter(['backstage-include', 'backstage-exclude'], filter),
    ).toEqual(false);
    expect(
      satisfiesTopicFilter(['experiment', 'backstage-include'], filter),
    ).toEqual(false);
  });

  it('handles cases where both exclusion filters are configured', () => {
    const filter: GithubTopicFilters = {
      include: ['backstage-include', 'blah'],
      exclude: ['backstage-exclude', 'bleh'],
    };
    expect(satisfiesTopicFilter([], filter)).toEqual(false);
    expect(satisfiesTopicFilter(['backstage-include'], filter)).toEqual(true);
    expect(satisfiesTopicFilter(['blah', 'nothing'], filter)).toEqual(true);
    expect(satisfiesTopicFilter(['backstage-exclude'], filter)).toEqual(false);
    expect(satisfiesTopicFilter(['bleh, nothing'], filter)).toEqual(false);
    expect(satisfiesTopicFilter(['abc123'], filter)).toEqual(false);
    expect(
      satisfiesTopicFilter(['backstage-include', 'backstage-exclude'], filter),
    ).toEqual(false);
  });
});
