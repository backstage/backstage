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

import {
  getOriginUrl,
  getRepoRoot,
  parseGitRemote,
  projectSlugAnnotation,
} from './gitRemote';

describe('parseGitRemote', () => {
  it('parses ssh and https remotes for GitHub, GitLab and Enterprise hosts', () => {
    expect(parseGitRemote('git@github.com:backstage/backstage.git')).toEqual({
      host: 'github.com',
      fullName: 'backstage/backstage',
      provider: 'github',
    });
    expect(parseGitRemote('https://github.com/backstage/backstage')).toEqual({
      host: 'github.com',
      fullName: 'backstage/backstage',
      provider: 'github',
    });
    expect(parseGitRemote('https://github.acme.com/org/repo.git')).toEqual({
      host: 'github.acme.com',
      fullName: 'org/repo',
      provider: 'github',
    });
    expect(parseGitRemote('git@gitlab.com:group/sub/repo.git')).toEqual({
      host: 'gitlab.com',
      fullName: 'group/sub/repo',
      provider: 'gitlab',
    });
    expect(
      projectSlugAnnotation(parseGitRemote('git@github.acme.com:o/r.git')),
    ).toBe('github.com/project-slug');
    expect(
      projectSlugAnnotation(parseGitRemote('https://gitlab.acme.com/o/r.git')),
    ).toBe('gitlab.com/project-slug');
  });

  it('rejects remotes that do not parse or use unsupported hosts, pointing at --entity', () => {
    expect(() => parseGitRemote('https://bitbucket.org/a/b.git')).toThrow(
      /Unsupported git host "bitbucket.org".*--entity/,
    );
    expect(() => parseGitRemote('')).toThrow(/--entity/);
    expect(() => parseGitRemote('nonsense')).toThrow(/--entity/);
  });
});

describe('getOriginUrl', () => {
  it('returns the trimmed origin URL and asks git for the origin remote', async () => {
    const exec = jest
      .fn()
      .mockResolvedValue({ stdout: 'git@github.com:a/b.git\n' });
    await expect(getOriginUrl(exec)).resolves.toBe('git@github.com:a/b.git');
    expect(exec).toHaveBeenCalledWith('git', ['remote', 'get-url', 'origin']);
  });

  it('fails with guidance when there is no origin remote', async () => {
    const exec = jest.fn().mockRejectedValue(new Error('No such remote'));
    await expect(getOriginUrl(exec)).rejects.toThrow(
      /Could not read the "origin" git remote \(No such remote\).*--entity/,
    );
    const empty = jest.fn().mockResolvedValue({ stdout: '  \n' });
    await expect(getOriginUrl(empty)).rejects.toThrow(/--entity/);
  });
});

describe('getRepoRoot', () => {
  it('returns the trimmed top-level directory, or undefined outside a repository', async () => {
    const exec = jest.fn().mockResolvedValue({ stdout: '/work/repo\n' });
    await expect(getRepoRoot(exec)).resolves.toBe('/work/repo');
    expect(exec).toHaveBeenCalledWith('git', ['rev-parse', '--show-toplevel']);

    const notARepo = jest.fn().mockRejectedValue(new Error('not a git repo'));
    await expect(getRepoRoot(notARepo)).resolves.toBeUndefined();
    const empty = jest.fn().mockResolvedValue({ stdout: '\n' });
    await expect(getRepoRoot(empty)).resolves.toBeUndefined();
  });
});
