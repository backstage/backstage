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

import { BitbucketIntegration } from './bitbucket';
import {
  basicIntegrations,
  defaultScmResolveUrl,
  isValidHost,
  defaultScmParseUrl,
  parseShorthandScmUrl,
} from './helpers';

describe('basicIntegrations', () => {
  describe('byUrl', () => {
    it('handles hosts without a port', () => {
      const integration = new BitbucketIntegration({ host: 'host.com' });
      const integrations = basicIntegrations<BitbucketIntegration>(
        [integration],
        i => i.config.host,
      );
      expect(integrations.byUrl('https://host.com/a')).toBe(integration);
      expect(integrations.byUrl('https://host.com:8080/a')).toBeUndefined();
    });
    it('handles hosts with a port', () => {
      const integration = new BitbucketIntegration({ host: 'host.com:8080' });
      const integrations = basicIntegrations<BitbucketIntegration>(
        [integration],
        i => i.config.host,
      );
      expect(integrations.byUrl('https://host.com:8080/a')).toBe(integration);
      expect(integrations.byUrl('https://host.com/a')).toBeUndefined();
    });
  });
});

describe('isValidHost', () => {
  it.each([
    ['example.com', true],
    ['foo', true],
    ['foo:1', true],
    ['foo:10000', true],
    ['foo.bar', true],
    ['foo.bar.baz', true],
    ['1.2.3.4', true],
    ['[::]', true],
    ['[::1]', true],
    ['[1:2:3:4:5:6:7:8]', true],
    ['1.2.3.4.5.6.7.8', true],
    ['https://example.com', false],
    ['foo:100000', false],
    ['FOO', false],
    ['Foo', false],
    ['foo/bar', false],
    ['//foo', false],
    ['foo:bar', false],
    ['foo?', false],
    ['foo?bar', false],
    ['foo#', false],
    ['foo#bar', false],
    ['::', false],
    ['::1', false],
    ['1:2:3:4:5:6:7:8', false],
    ['???????', false],
    ['€&()=)&(', false],
    ['höst', false],
    ['πœπœﬁπœ', false],
  ])('Should check whether %s is a valid host', (str, expected) => {
    expect(isValidHost(str)).toBe(expected);
  });
});

describe('defaultScmResolveUrl', () => {
  it('works for relative paths and retains query params', () => {
    expect(
      defaultScmResolveUrl({
        url: './b.yaml',
        base: 'https://gitlab.com/groupA/teams/teamA/subgroupA/repoA/-/blob/branch/folder/a.yaml',
      }),
    ).toBe(
      'https://gitlab.com/groupA/teams/teamA/subgroupA/repoA/-/blob/branch/folder/b.yaml',
    );

    expect(
      defaultScmResolveUrl({
        url: './b.yaml',
        base: 'https://gitlab.com/groupA/teams/teamA/subgroupA/repoA/-/blob/branch/folder/a.yaml?at=master',
      }),
    ).toBe(
      'https://gitlab.com/groupA/teams/teamA/subgroupA/repoA/-/blob/branch/folder/b.yaml?at=master',
    );

    expect(
      defaultScmResolveUrl({
        url: 'b.yaml',
        base: 'https://gitlab.com/groupA/teams/teamA/subgroupA/repoA/-/blob/branch/folder/a.yaml',
      }),
    ).toBe(
      'https://gitlab.com/groupA/teams/teamA/subgroupA/repoA/-/blob/branch/folder/b.yaml',
    );
  });

  it('works for absolute paths and retains query params', () => {
    expect(
      defaultScmResolveUrl({
        url: '/other/b.yaml',
        base: 'https://gitlab.com/groupA/teams/teamA/subgroupA/repoA/-/blob/branch/folder/a.yaml',
      }),
    ).toBe(
      'https://gitlab.com/groupA/teams/teamA/subgroupA/repoA/-/blob/branch/other/b.yaml',
    );

    expect(
      defaultScmResolveUrl({
        url: '/other/b.yaml',
        base: 'https://gitlab.com/groupA/teams/teamA/subgroupA/repoA/-/blob/branch/folder/a.yaml?at=master',
      }),
    ).toBe(
      'https://gitlab.com/groupA/teams/teamA/subgroupA/repoA/-/blob/branch/other/b.yaml?at=master',
    );
  });

  it('works in various situations with line numbers', () => {
    expect(
      defaultScmResolveUrl({
        url: './b.yaml',
        base: 'https://gitlab.com/groupA/teams/teamA/subgroupA/repoA/-/blob/branch/folder/a.yaml?at=master',
        lineNumber: 11,
      }),
    ).toBe(
      'https://gitlab.com/groupA/teams/teamA/subgroupA/repoA/-/blob/branch/folder/b.yaml?at=master#L11',
    );

    expect(
      defaultScmResolveUrl({
        url: 'b.yaml',
        base: 'https://gitlab.com/groupA/teams/teamA/subgroupA/repoA/-/blob/branch/folder/a.yaml',
        lineNumber: 12,
      }),
    ).toBe(
      'https://gitlab.com/groupA/teams/teamA/subgroupA/repoA/-/blob/branch/folder/b.yaml#L12',
    );

    expect(
      defaultScmResolveUrl({
        url: '/other/b.yaml',
        base: 'https://gitlab.com/groupA/teams/teamA/subgroupA/repoA/-/blob/branch/folder/a.yaml',
        lineNumber: 13,
      }),
    ).toBe(
      'https://gitlab.com/groupA/teams/teamA/subgroupA/repoA/-/blob/branch/other/b.yaml#L13',
    );

    expect(
      defaultScmResolveUrl({
        url: '/other/b.yaml',
        base: 'https://gitlab.com/groupA/teams/teamA/subgroupA/repoA/-/blob/branch/folder/a.yaml?at=master',
        lineNumber: 14,
      }),
    ).toBe(
      'https://gitlab.com/groupA/teams/teamA/subgroupA/repoA/-/blob/branch/other/b.yaml?at=master#L14',
    );
  });

  it('works for full urls and throws away query params', () => {
    expect(
      defaultScmResolveUrl({
        url: 'https://b.com/b.yaml',
        base: 'https://gitlab.com/groupA/teams/teamA/subgroupA/repoA/-/blob/branch/folder/a.yaml?at=master',
      }),
    ).toBe('https://b.com/b.yaml');
  });
});

describe('defaultScmParseUrl', () => {
  it('handles well known good URLs', () => {
    expect(
      defaultScmParseUrl(
        'https://github.com/backstage/community/blob/main/README.md',
      ),
    ).toEqual({
      url: {
        host: 'github.com',
        root: 'https://github.com',
      },
      repository: {
        // TODO(freben): GitHub returning an organization is actually
        // unexpected, but since it's a quirk of the underlying library, we'll
        // let it through for now rather than writing special case code to
        // exclude it.
        organization: 'backstage',
        owner: 'backstage',
        name: 'community',
      },
      target: {
        ref: 'main',
        path: '/README.md',
        pathType: 'blob',
      },
    });
  });
});

describe('parseShorthandScmUrl', () => {
  it('returns false for things that do not look like a shorthand', () => {
    expect(parseShorthandScmUrl(7 as any)).toEqual(false);
    expect(parseShorthandScmUrl('')).toEqual(false);
    expect(
      parseShorthandScmUrl(
        'https://github.com/backstage/community/blob/main/README.md',
      ),
    ).toEqual(false);
  });

  it('extract all parts of shorthands', () => {
    expect(
      parseShorthandScmUrl(
        'git.company.com/root?organization=spotify&owner=backstage&name=community&ref=main&path=%C3%A2.md&pathType=blob',
      ),
    ).toEqual({
      url: {
        host: 'git.company.com',
        root: 'https://git.company.com/root',
      },
      repository: {
        organization: 'spotify',
        owner: 'backstage',
        name: 'community',
      },
      target: {
        ref: 'main',
        path: '/â.md',
        pathType: 'blob',
      },
    });
  });

  it('works with and without protocol', () => {
    expect((parseShorthandScmUrl('a.com?owner=x&name=y') as any).url.root).toBe(
      'https://a.com',
    );
    expect(
      (parseShorthandScmUrl('https://a.com?owner=x&name=y') as any).url.root,
    ).toBe('https://a.com');
    expect(
      (parseShorthandScmUrl('http://a.com?owner=x&name=y') as any).url.root,
    ).toBe('http://a.com');
  });

  it('handles all forms of paths correctly', () => {
    expect(
      (parseShorthandScmUrl('a.com?owner=x&name=y') as any).target.path,
    ).toBe(undefined);
    expect(
      (parseShorthandScmUrl('a.com?owner=x&name=y&path=') as any).target.path,
    ).toBe(undefined);
    expect(
      (parseShorthandScmUrl('a.com?owner=x&name=y&path=a') as any).target.path,
    ).toBe('/a');
    expect(
      (parseShorthandScmUrl('a.com?owner=x&name=y&path=/a') as any).target.path,
    ).toBe('/a');
  });
});
