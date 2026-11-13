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
  getMainCheckoutRoot,
  getOriginUrl,
  getRepoRoot,
  getRepoPrefix,
  isManagedWithinSameRepo,
  parseCatalogFileFolder,
  parseFileLocationFolder,
  parseSourceLocationFolder,
  repoUrlFromRemote,
} from './gitRemote';

describe('repoUrlFromRemote', () => {
  it('normalizes ssh, https and .git remotes, GitLab subgroups and Enterprise hosts', () => {
    expect(repoUrlFromRemote('git@github.com:backstage/backstage.git')).toBe(
      'https://github.com/backstage/backstage',
    );
    expect(repoUrlFromRemote('https://github.com/backstage/backstage')).toBe(
      'https://github.com/backstage/backstage',
    );
    expect(repoUrlFromRemote('https://github.acme.com/org/repo.git\n')).toBe(
      'https://github.acme.com/org/repo',
    );
    expect(repoUrlFromRemote('git@gitlab.com:group/sub/repo.git')).toBe(
      'https://gitlab.com/group/sub/repo',
    );
    expect(repoUrlFromRemote('git@git.acme.com:o/r.git')).toBe(
      'https://git.acme.com/o/r',
    );
  });

  it('rejects remotes that do not parse, pointing at --entity', () => {
    expect(() => repoUrlFromRemote('')).toThrow(/--entity/);
    expect(() => repoUrlFromRemote('nonsense')).toThrow(/--entity/);
  });
});

describe('getRepoPrefix', () => {
  it('returns the folder without a trailing slash, empty at the root', async () => {
    const exec = jest.fn().mockResolvedValue({ stdout: 'packages/a/\n' });
    await expect(getRepoPrefix(exec)).resolves.toBe('packages/a');
    expect(exec).toHaveBeenCalledWith('git', ['rev-parse', '--show-prefix']);
    await expect(
      getRepoPrefix(jest.fn().mockResolvedValue({ stdout: '\n' })),
    ).resolves.toBe('');
    await expect(
      getRepoPrefix(jest.fn().mockRejectedValue(new Error('not a repo'))),
    ).rejects.toThrow(/not a repo.*--entity/);
  });
});

describe('parseCatalogFileFolder', () => {
  const repo = 'https://github.com/acme/mono';

  it('returns the possible folders of the catalog file for each ref split', () => {
    expect(
      parseCatalogFileFolder(`url:${repo}/blob/main/catalog-info.yaml`, repo),
    ).toEqual([[]]);
    expect(
      parseCatalogFileFolder(
        `url:${repo}/blob/main/services/api/catalog-info.yaml?raw=1`,
        repo,
      ),
    ).toEqual([['services', 'api'], ['api']]);
    expect(
      parseCatalogFileFolder(`url:${repo}/tree/feature/x/svc/c.yaml`, repo),
    ).toEqual([['x', 'svc'], ['svc']]);
    expect(
      parseCatalogFileFolder(
        `URL:${repo.toUpperCase()}/blob/main/a/c.yaml`,
        repo,
      ),
    ).toEqual([['a']]);
    expect(
      parseCatalogFileFolder(
        'url:https://gitlab.com/g/sub/repo/-/blob/main/svc/catalog-info.yaml',
        'https://gitlab.com/g/sub/repo',
      ),
    ).toEqual([['svc']]);
  });

  it('returns undefined for other repos, folders, other shapes and file locations', () => {
    expect(
      parseCatalogFileFolder(`url:${repo}-other/blob/main/a/c.yaml`, repo),
    ).toBeUndefined();
    expect(
      parseCatalogFileFolder(`url:${repo}/blob/main/a/`, repo),
    ).toBeUndefined();
    expect(
      parseCatalogFileFolder(`url:${repo}/blob/catalog-info.yaml`, repo),
    ).toBeUndefined();
    expect(
      parseCatalogFileFolder(`url:${repo}/raw/main/c.yaml`, repo),
    ).toBeUndefined();
    expect(
      parseCatalogFileFolder('file:/work/repo/catalog-info.yaml', repo),
    ).toBeUndefined();
    expect(parseCatalogFileFolder('', repo)).toBeUndefined();
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

describe('getMainCheckoutRoot', () => {
  it('returns the parent of the common git directory, also for worktrees', async () => {
    const exec = (stdout: string) => jest.fn().mockResolvedValue({ stdout });
    await expect(getMainCheckoutRoot(exec('/work/main/.git\n'))).resolves.toBe(
      '/work/main',
    );
    await expect(getMainCheckoutRoot(exec('/bare/repo.git\n'))).resolves.toBe(
      undefined,
    );
    await expect(
      getMainCheckoutRoot(jest.fn().mockRejectedValue(new Error('no git'))),
    ).resolves.toBe(undefined);
  });
});

describe('parseFileLocationFolder', () => {
  it('returns the folder relative to the first root containing the file', () => {
    const roots = ['/work/wt', '/work/main'];
    expect(
      parseFileLocationFolder('file:/work/main/svc/api/c.yaml', roots),
    ).toEqual(['svc', 'api']);
    expect(parseFileLocationFolder('file:/work/wt/c.yaml', roots)).toEqual([]);
    expect(parseFileLocationFolder('file:/work/mainx/c.yaml', roots)).toBe(
      undefined,
    );
    expect(parseFileLocationFolder('file:/elsewhere/c.yaml', roots)).toBe(
      undefined,
    );
    expect(parseFileLocationFolder('file:c.yaml', roots)).toBe(undefined);
    expect(parseFileLocationFolder('url:https://x/y', roots)).toBe(undefined);
    expect(
      parseFileLocationFolder('file:/work/main/svc/api', roots, {
        isFolder: true,
      }),
    ).toEqual(['svc', 'api']);
  });
});

describe('isManagedWithinSameRepo', () => {
  const repo = 'https://github.com/acme/mono';
  const roots = ['/work/wt', '/work/main'];

  it('requires the managed-by location in the same repo or checkout', () => {
    const source = `url:${repo}/tree/main/svc`;
    expect(
      isManagedWithinSameRepo(source, `url:${repo}/blob/main/c.yaml`, repo, []),
    ).toBe(true);
    expect(
      isManagedWithinSameRepo(
        source,
        `url:${repo.toUpperCase()}/blob/main/c.yaml`,
        repo,
        [],
      ),
    ).toBe(true);
    expect(
      isManagedWithinSameRepo(
        source,
        'url:https://github.com/acme/other/blob/main/c.yaml',
        repo,
        [],
      ),
    ).toBe(false);
    expect(isManagedWithinSameRepo(source, '', repo, [])).toBe(false);
    expect(
      isManagedWithinSameRepo(source, 'file:/work/main/c.yaml', repo, roots),
    ).toBe(false);

    const fileSource = 'file:/work/main/svc';
    expect(
      isManagedWithinSameRepo(
        fileSource,
        'file:/work/main/c.yaml',
        repo,
        roots,
      ),
    ).toBe(true);
    expect(
      isManagedWithinSameRepo(fileSource, 'file:/work/wt/c.yaml', repo, roots),
    ).toBe(false);
    expect(
      isManagedWithinSameRepo(fileSource, 'file:/else/c.yaml', repo, roots),
    ).toBe(false);
    expect(
      isManagedWithinSameRepo(
        fileSource,
        `url:${repo}/blob/main/c.yaml`,
        repo,
        roots,
      ),
    ).toBe(false);
  });
});

describe('parseSourceLocationFolder', () => {
  const repo = 'https://github.com/acme/mono';

  it('returns the possible folders of a tree location, for GitHub and GitLab', () => {
    expect(
      parseSourceLocationFolder(`url:${repo}/tree/main/svc/api`, repo),
    ).toEqual([['svc', 'api'], ['api']]);
    expect(parseSourceLocationFolder(`url:${repo}/tree/main`, repo)).toEqual([
      [],
    ]);
    expect(
      parseSourceLocationFolder(`url:${repo}/-/tree/main/svc`, repo),
    ).toEqual([['svc']]);
    expect(
      parseSourceLocationFolder(`url:${repo}/tree/main/svc?x=1#y`, repo),
    ).toEqual([['svc']]);
  });

  it('rejects other repositories and unsupported shapes', () => {
    expect(
      parseSourceLocationFolder(
        'url:https://github.com/acme/other/tree/main/a',
        repo,
      ),
    ).toBeUndefined();
    expect(
      parseSourceLocationFolder(`url:${repo}/issues/1`, repo),
    ).toBeUndefined();
    expect(parseSourceLocationFolder(`file:/work/svc`, repo)).toBeUndefined();
  });
});
