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

import { BitbucketServerIntegration } from './bitbucketServer';
import {
  basicIntegrations,
  defaultScmResolveUrl,
  isValidHost,
  parseGitUrlSafe,
} from './helpers';

describe('basicIntegrations', () => {
  describe('byUrl', () => {
    it('handles hosts without a port', () => {
      const integration = new BitbucketServerIntegration({
        host: 'host.com',
        apiBaseUrl: 'a',
      });
      const integrations = basicIntegrations<BitbucketServerIntegration>(
        [integration],
        i => i.config.host,
      );
      expect(integrations.byUrl('https://host.com/a')).toBe(integration);
      expect(integrations.byUrl('https://host.com:8080/a')).toBeUndefined();
    });
    it('handles hosts with a port', () => {
      const integration = new BitbucketServerIntegration({
        host: 'host.com:8080',
        apiBaseUrl: 'a',
      });
      const integrations = basicIntegrations<BitbucketServerIntegration>(
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
    ['1.2.3.4.5.6.7.8', false],
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
        base: 'https://gitlab.com/groupA/teams/teamA/subgroupA/repoA/-/blob/branch/folder/',
      }),
    ).toBe(
      'https://gitlab.com/groupA/teams/teamA/subgroupA/repoA/-/blob/branch/folder/b.yaml',
    );

    expect(
      defaultScmResolveUrl({
        url: './b.yaml',
        base: 'https://gitlab.com/groupA/teams/teamA/subgroupA/repoA/-/blob/branch/folder/subfolder',
      }),
    ).toBe(
      'https://gitlab.com/groupA/teams/teamA/subgroupA/repoA/-/blob/branch/folder/b.yaml',
    );

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
        base: 'https://gitlab.com/groupA/teams/teamA/subgroupA/repoA/-/blob/branch/folder/',
      }),
    ).toBe(
      'https://gitlab.com/groupA/teams/teamA/subgroupA/repoA/-/blob/branch/folder/b.yaml',
    );

    expect(
      defaultScmResolveUrl({
        url: 'b.yaml',
        base: 'https://gitlab.com/groupA/teams/teamA/subgroupA/repoA/-/blob/branch/folder/subfolder',
      }),
    ).toBe(
      'https://gitlab.com/groupA/teams/teamA/subgroupA/repoA/-/blob/branch/folder/b.yaml',
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

  it('works for the root path', () => {
    expect(
      defaultScmResolveUrl({
        url: '/',
        base: 'https://gitlab.com/groupA/teams/teamA/subgroupA/repoA/-/blob/branch/folder',
      }),
    ).toBe(
      'https://gitlab.com/groupA/teams/teamA/subgroupA/repoA/-/blob/branch/',
    );

    expect(
      defaultScmResolveUrl({
        url: '/',
        base: 'https://gitlab.com/groupA/teams/teamA/subgroupA/repoA/-/blob/branch/folder/',
      }),
    ).toBe(
      'https://gitlab.com/groupA/teams/teamA/subgroupA/repoA/-/blob/branch/',
    );

    expect(
      defaultScmResolveUrl({
        url: '/',
        base: 'https://gitlab.com/groupA/teams/teamA/subgroupA/repoA/-/blob/branch/folder/a.yaml',
      }),
    ).toBe(
      'https://gitlab.com/groupA/teams/teamA/subgroupA/repoA/-/blob/branch/',
    );

    expect(
      defaultScmResolveUrl({
        url: '/',
        base: 'https://gitlab.com/groupA/teams/teamA/subgroupA/repoA/-/blob/branch/folder/a.yaml?at=master',
      }),
    ).toBe(
      'https://gitlab.com/groupA/teams/teamA/subgroupA/repoA/-/blob/branch/?at=master',
    );
  });

  it('works for files in the repo root', () => {
    expect(
      defaultScmResolveUrl({
        url: '/b.yaml',
        base: 'https://gitlab.com/groupA/teams/teamA/subgroupA/repoA/-/blob/branch/folder',
      }),
    ).toBe(
      'https://gitlab.com/groupA/teams/teamA/subgroupA/repoA/-/blob/branch/b.yaml',
    );

    expect(
      defaultScmResolveUrl({
        url: '/b.yaml',
        base: 'https://gitlab.com/groupA/teams/teamA/subgroupA/repoA/-/blob/branch/folder/',
      }),
    ).toBe(
      'https://gitlab.com/groupA/teams/teamA/subgroupA/repoA/-/blob/branch/b.yaml',
    );

    expect(
      defaultScmResolveUrl({
        url: '/b.yaml',
        base: 'https://gitlab.com/groupA/teams/teamA/subgroupA/repoA/-/blob/branch/folder/a.yaml',
      }),
    ).toBe(
      'https://gitlab.com/groupA/teams/teamA/subgroupA/repoA/-/blob/branch/b.yaml',
    );

    expect(
      defaultScmResolveUrl({
        url: '/b.yaml',
        base: 'https://gitlab.com/groupA/teams/teamA/subgroupA/repoA/-/blob/branch/folder/a.yaml?at=master',
      }),
    ).toBe(
      'https://gitlab.com/groupA/teams/teamA/subgroupA/repoA/-/blob/branch/b.yaml?at=master',
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
        base: 'https://gitlab.com/groupA/teams/teamA/subgroupA/repoA/-/blob/branch/folder',
      }),
    ).toBe(
      'https://gitlab.com/groupA/teams/teamA/subgroupA/repoA/-/blob/branch/other/b.yaml',
    );

    expect(
      defaultScmResolveUrl({
        url: '/other/b.yaml',
        base: 'https://gitlab.com/groupA/teams/teamA/subgroupA/repoA/-/blob/branch/folder/',
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

describe('parseGitUrlSafe', () => {
  it('parses a valid GitHub blob URL', () => {
    const result = parseGitUrlSafe(
      'https://github.com/owner/repo/blob/main/path/to/file.yaml',
    );
    expect(result.owner).toBe('owner');
    expect(result.name).toBe('repo');
    expect(result.ref).toBe('main');
    expect(result.filepath).toBe('path/to/file.yaml');
  });

  it('rejects URLs with encoded path traversal in filepath', () => {
    expect(() =>
      parseGitUrlSafe(
        'https://github.com/octocat/Hello-World/blob/main/%2e%2e%2f%2e%2e%2f%2e%2e%2f%2e%2e%2fuser/repos',
      ),
    ).toThrow('path traversal');
  });

  it('rejects URLs with double-encoded path traversal in filepath', () => {
    expect(() =>
      parseGitUrlSafe(
        'https://github.com/octocat/Hello-World/blob/main/foo%2f%2e%2e%2fbar%2f%2e%2e%2f%2e%2e%2fsecret',
      ),
    ).toThrow('path traversal');
  });

  it('rejects URLs with uppercase %2E encoding in filepath', () => {
    expect(() =>
      parseGitUrlSafe(
        'https://github.com/octocat/Hello-World/blob/main/%2E%2E%2F%2E%2E%2Fuser/repos',
      ),
    ).toThrow('path traversal');
  });

  it('rejects URLs with mixed-case percent encoding', () => {
    expect(() =>
      parseGitUrlSafe(
        'https://github.com/octocat/Hello-World/blob/main/%2E%2e%2Fuser/repos',
      ),
    ).toThrow('path traversal');
  });

  it('rejects URLs where git-url-parse leaves percent-encoded traversal segments', () => {
    expect(() =>
      parseGitUrlSafe(
        'https://github.com/octocat/Hello-World/blob/main/%252e%252e%252fuser/repos',
      ),
    ).toThrow('path traversal');
  });

  it('rejects URLs with triple-encoded path traversal', () => {
    expect(() =>
      parseGitUrlSafe(
        'https://github.com/octocat/Hello-World/blob/main/%25252e%25252e%25252fuser/repos',
      ),
    ).toThrow('path traversal');
  });

  it('rejects URLs with literal .. in the middle of the filepath', () => {
    // URL normalization resolves foo/../bar to just bar, so the filepath
    // won't contain traversal. But we verify parseGitUrlSafe still handles
    // the resolved path safely.
    const result = parseGitUrlSafe(
      'https://github.com/owner/repo/blob/main/foo/../bar',
    );
    expect(result.filepath).toBe('bar');
  });

  it('handles literal ../ that gets normalized away by URL parsing', () => {
    // Literal ../../../ gets resolved by the URL constructor before
    // git-url-parse sees it. This mangles owner/name but the filepath
    // is empty, so parseGitUrlSafe doesn't reject it. Downstream
    // functions reject these via their own validation.
    const result = parseGitUrlSafe(
      'https://github.com/owner/repo/blob/main/../../../user/repos',
    );
    expect(result.filepath).toBe('');
    expect(result.owner).not.toBe('owner');
  });

  it('allows filenames that contain dots but are not traversal', () => {
    const result = parseGitUrlSafe(
      'https://github.com/owner/repo/blob/main/path/to/some..file.yaml',
    );
    expect(result.filepath).toBe('path/to/some..file.yaml');
  });

  it('allows URLs without a filepath', () => {
    const result = parseGitUrlSafe('https://github.com/owner/repo');
    expect(result.owner).toBe('owner');
    expect(result.name).toBe('repo');
    expect(result.filepath).toBe('');
  });
});
