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
import { parseGitUrlSafe } from './parseGitUrlSafe';

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

    // A malformed escape in one segment stops the decoding of the whole
    // component, leaving an encoded dot segment that still resolves as
    // traversal once the path lands in a request URL
    expect(() =>
      parseGitUrlSafe(
        'https://github.com/o/r/blob/main/%25zz%2F%252e%252e%2F%252e%252e%2Fx',
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

  it('rejects encoded traversal in the repository path when the filepath is empty', () => {
    // The encoded part of the repository path decodes to traversal segments in
    // full_name and owner, while the filepath stays empty
    expect(() =>
      parseGitUrlSafe(
        'https://github.com/acme/..%2Foctocat%2FHello-World/tree/master',
      ),
    ).toThrow('path traversal');

    // A malformed escape keeps the dot segments encoded, bypassing the
    // decode loop while still retargeting the request URL
    expect(() =>
      parseGitUrlSafe(
        'https://github.com/acme/x%25zz%2F%252e%252e%2F%252e%252e%2Foctocat%2FHello-World/tree/master',
      ),
    ).toThrow('path traversal');

    // A tab or newline inside a dot segment of the repository path is
    // removed by the URL parser before the request URL is normalized
    expect(() =>
      parseGitUrlSafe(
        'https://github.com/acme/.%09.%2Foctocat%2FHello-World/tree/master',
      ),
    ).toThrow('path traversal');
    expect(() =>
      parseGitUrlSafe(
        'https://github.com/acme/.%0D.%2Foctocat%2FHello-World/tree/master',
      ),
    ).toThrow('path traversal');
  });

  it('rejects encoded traversal in the owner and ref components', () => {
    expect(() =>
      parseGitUrlSafe(
        'https://github.com/owned%2Fpublic%2F..%2F..%2Fowned%2Fprivate%2Factions%2Fjobs%2F42%2Flogs%23/x/blob/main/readme.txt',
      ),
    ).toThrow('path traversal');

    // Double-encoded traversal in the owner, left partially encoded by the
    // first decoding pass
    expect(() =>
      parseGitUrlSafe(
        'https://github.com/%252e%252e%252f%252e%252e%252fvictim/x/blob/main/readme.txt',
      ),
    ).toThrow('path traversal');

    // Backslashes act as path separators when the component is interpolated
    // into a request URL, so this is the same as a/../victim
    expect(() =>
      parseGitUrlSafe(
        'https://github.com/a%5C..%5Cvictim/x/blob/main/readme.txt',
      ),
    ).toThrow('path traversal');

    expect(() =>
      parseGitUrlSafe('https://github.com/owner/repo/tree/..%2F..%2Fother'),
    ).toThrow('path traversal');

    // Same as above, with a malformed escape keeping the dot segments
    // percent-encoded in the owner
    expect(() =>
      parseGitUrlSafe(
        'https://github.com/acme%25zz%2F%252e%252e%2Foctocat/Hello-World/blob/main/readme.txt',
      ),
    ).toThrow('path traversal');

    // Tabs and newlines are removed from URLs before parsing, so a dot
    // segment that holds one still resolves as traversal in the request URL
    expect(() =>
      parseGitUrlSafe(
        'https://github.com/a%2F.%09.%2Foctocat/Hello-World/blob/main/readme.txt',
      ),
    ).toThrow('path traversal');
    expect(() =>
      parseGitUrlSafe(
        'https://github.com/a%2F.%0A.%2Foctocat/Hello-World/blob/main/readme.txt',
      ),
    ).toThrow('path traversal');

    // A tab combined with an escape that the decode loop cannot resolve
    expect(() =>
      parseGitUrlSafe(
        'https://github.com/a%25zz%2F.%09.%2Foctocat/Hello-World/blob/main/readme.txt',
      ),
    ).toThrow('path traversal');
  });

  it('rejects fragment and query delimiters in the owner components', () => {
    // A decoded # or ? in these components truncates the request URL that the
    // component is interpolated into, redirecting the request to a different
    // API path
    expect(() =>
      parseGitUrlSafe(
        'https://github.com/owned%2Fprivate%2Factions%2Fjobs%2F42%2Flogs%23/x/blob/main/readme.txt',
      ),
    ).toThrow('URL fragment and query delimiters');
    expect(() =>
      parseGitUrlSafe(
        'https://github.com/owned%2Fprivate%2Flogs%3F/x/blob/main/readme.txt',
      ),
    ).toThrow('URL fragment and query delimiters');
  });

  it('rejects dot segments terminated by query or fragment delimiters', () => {
    // A decoded ? or # in a component ends the path of the request URL
    // that the component is interpolated into, leaving a dot segment
    // behind it that URL parsing then resolves as traversal
    expect(() =>
      parseGitUrlSafe('https://github.com/owner/repo/tree/..%3F'),
    ).toThrow('path traversal');
    expect(() =>
      parseGitUrlSafe('https://github.com/owner/repo/tree/..%23'),
    ).toThrow('path traversal');
    expect(() =>
      parseGitUrlSafe('https://github.com/o/r/blob/main/..%3F'),
    ).toThrow('path traversal');
    expect(() =>
      parseGitUrlSafe('https://github.com/o/r/blob/main/..%23'),
    ).toThrow('path traversal');
    expect(() =>
      parseGitUrlSafe('https://github.com/a%2F..%3F/x/blob/main/readme.txt'),
    ).toThrow('path traversal');
    expect(() =>
      parseGitUrlSafe(
        'https://github.com/a%2F%2e%2e%23/x/blob/main/readme.txt',
      ),
    ).toThrow('path traversal');
    expect(() =>
      parseGitUrlSafe('https://github.com/owner/x%2F%2e%2e%3Fvictim'),
    ).toThrow('path traversal');
  });

  it('still allows multi-segment owners and refs that contain dots or delimiters', () => {
    const nested = parseGitUrlSafe(
      'https://gitlab.com/groupA/teams/teamA/subgroupA/repoA/-/blob/branch/folder/a.yaml',
    );
    expect(nested.owner).toBe('groupA/teams/teamA/subgroupA');
    expect(nested.full_name).toBe('groupA/teams/teamA/subgroupA/repoA');

    const bitbucket = parseGitUrlSafe(
      'https://bitbucket.org/orgname/reponame/src/master/file.yaml',
    );
    expect(bitbucket.owner).toBe('orgname');
    expect(bitbucket.ref).toBe('master');

    // Filenames keep their delimiters, since the filepath is only ever used
    // as a trailing part of the intended API path
    const delimited = parseGitUrlSafe(
      'https://github.com/o/r/blob/main/foo%23bar.md',
    );
    expect(delimited.filepath).toBe('foo#bar.md');

    // References may contain delimiters too, for example a Bitbucket Server
    // branch that contains `#`, since they never precede the owner and
    // repository name in the constructed request URLs
    const branch = parseGitUrlSafe(
      'https://bitbucket.company.com/projects/PROJ/repos/repo/browse/path/to/file.yaml?at=feature%23123',
    );
    expect(branch.owner).toBe('PROJ');
    expect(branch.ref).toBe('feature#123');

    // Filenames may contain a literal tab, which the URL parser removes
    // from the request URL but which is harmless here
    const tabbed = parseGitUrlSafe('https://github.com/o/r/blob/main/a%09b.md');
    expect(tabbed.filepath).toBe('a\tb.md');
  });

  it('can skip the delimiter check for the repository path components', () => {
    // For storage providers the owner and name hold object names, which
    // consumers such as link resolution never place into request URLs
    const s3 = parseGitUrlSafe(
      'https://bucket.s3.us-east-1.amazonaws.com/a%23b/catalog-info.yaml',
      { allowUrlDelimiters: true },
    );
    expect(s3.owner).toBe('a#b');
    expect(s3.name).toBe('catalog-info.yaml');

    const gcs = parseGitUrlSafe(
      'https://storage.cloud.google.com/bucket/c%23.yaml',
      { allowUrlDelimiters: true },
    );
    expect(gcs.owner).toBe('bucket');
    expect(gcs.name).toBe('c#.yaml');

    // Traversal is still rejected with the option enabled
    expect(() =>
      parseGitUrlSafe(
        'https://bucket.s3.us-east-1.amazonaws.com/a%23b/..%2Fx/catalog-info.yaml',
        { allowUrlDelimiters: true },
      ),
    ).toThrow('path traversal');

    // Without the option the delimiters are rejected as usual
    expect(() =>
      parseGitUrlSafe(
        'https://bucket.s3.us-east-1.amazonaws.com/a%23b/catalog-info.yaml',
      ),
    ).toThrow('URL fragment and query delimiters');
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
