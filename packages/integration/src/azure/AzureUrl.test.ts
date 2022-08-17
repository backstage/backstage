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

import { AzureUrl } from './AzureUrl';

describe('AzureUrl', () => {
  it('should work with the short URL form', () => {
    const url = AzureUrl.fromRepoUrl(
      'https://dev.azure.com/my-org/_git/my-project',
    );

    expect(url.getOwner()).toBe('my-org');
    expect(url.getProject()).toBe('my-project');
    expect(url.getRepo()).toBe('my-project');
    expect(url.getRef()).toBeUndefined();
    expect(url.getPath()).toBeUndefined();

    expect(url.toRepoUrl()).toBe(
      'https://dev.azure.com/my-org/_git/my-project',
    );
    expect(() => url.toFileUrl()).toThrow(
      'Azure URL must point to a specific path to be able to download a file',
    );
    expect(url.toArchiveUrl()).toBe(
      'https://dev.azure.com/my-org/my-project/_apis/git/repositories/my-project/items?recursionLevel=full&download=true&api-version=6.0',
    );
    expect(url.toCommitsUrl()).toBe(
      'https://dev.azure.com/my-org/my-project/_apis/git/repositories/my-project/commits?api-version=6.0',
    );
  });

  it('should work with the short URL form with a path', () => {
    const url = AzureUrl.fromRepoUrl(
      'https://dev.azure.com/my-org/_git/my-project?path=%2Ftest.yaml',
    );

    expect(url.getOwner()).toBe('my-org');
    expect(url.getProject()).toBe('my-project');
    expect(url.getRepo()).toBe('my-project');
    expect(url.getRef()).toBeUndefined();
    expect(url.getPath()).toBe('/test.yaml');

    expect(url.toRepoUrl()).toBe(
      'https://dev.azure.com/my-org/_git/my-project?path=%2Ftest.yaml',
    );
    expect(url.toFileUrl()).toBe(
      'https://dev.azure.com/my-org/my-project/_apis/git/repositories/my-project/items?api-version=6.0&path=%2Ftest.yaml',
    );
    expect(url.toArchiveUrl()).toBe(
      'https://dev.azure.com/my-org/my-project/_apis/git/repositories/my-project/items?recursionLevel=full&download=true&api-version=6.0&scopePath=%2Ftest.yaml',
    );
    expect(url.toCommitsUrl()).toBe(
      'https://dev.azure.com/my-org/my-project/_apis/git/repositories/my-project/commits?api-version=6.0',
    );
  });

  it('should work with the short URL form with a path and ref', () => {
    const url = AzureUrl.fromRepoUrl(
      'https://dev.azure.com/my-org/_git/my-project?path=%2Ftest.yaml&version=GBtest-branch',
    );

    expect(url.getOwner()).toBe('my-org');
    expect(url.getProject()).toBe('my-project');
    expect(url.getRepo()).toBe('my-project');
    expect(url.getRef()).toBe('test-branch');
    expect(url.getPath()).toBe('/test.yaml');

    expect(url.toRepoUrl()).toBe(
      'https://dev.azure.com/my-org/_git/my-project?path=%2Ftest.yaml&version=GBtest-branch',
    );
    expect(url.toFileUrl()).toBe(
      'https://dev.azure.com/my-org/my-project/_apis/git/repositories/my-project/items?api-version=6.0&path=%2Ftest.yaml&version=test-branch',
    );
    expect(url.toArchiveUrl()).toBe(
      'https://dev.azure.com/my-org/my-project/_apis/git/repositories/my-project/items?recursionLevel=full&download=true&api-version=6.0&scopePath=%2Ftest.yaml&version=test-branch',
    );
    expect(url.toCommitsUrl()).toBe(
      'https://dev.azure.com/my-org/my-project/_apis/git/repositories/my-project/commits?api-version=6.0&searchCriteria.itemVersion.version=test-branch',
    );
  });

  it('should work with the long URL', () => {
    const url = AzureUrl.fromRepoUrl(
      'http://my-host/my-org/my-project/_git/my-repo',
    );

    expect(url.getOwner()).toBe('my-org');
    expect(url.getProject()).toBe('my-project');
    expect(url.getRepo()).toBe('my-repo');
    expect(url.getRef()).toBeUndefined();
    expect(url.getPath()).toBeUndefined();

    expect(url.toRepoUrl()).toBe(
      'http://my-host/my-org/my-project/_git/my-repo',
    );
    expect(() => url.toFileUrl()).toThrow(
      'Azure URL must point to a specific path to be able to download a file',
    );
    expect(url.toArchiveUrl()).toBe(
      'http://my-host/my-org/my-project/_apis/git/repositories/my-repo/items?recursionLevel=full&download=true&api-version=6.0',
    );
    expect(url.toCommitsUrl()).toBe(
      'http://my-host/my-org/my-project/_apis/git/repositories/my-repo/commits?api-version=6.0',
    );
  });

  it('should work with the long URL form with a path and ref', () => {
    const url = AzureUrl.fromRepoUrl(
      'http://my-host/my-org/my-project/_git/my-repo?path=%2Ffolder&version=GBtest-branch',
    );

    expect(url.getOwner()).toBe('my-org');
    expect(url.getProject()).toBe('my-project');
    expect(url.getRepo()).toBe('my-repo');
    expect(url.getRef()).toBe('test-branch');
    expect(url.getPath()).toBe('/folder');

    expect(url.toRepoUrl()).toBe(
      'http://my-host/my-org/my-project/_git/my-repo?path=%2Ffolder&version=GBtest-branch',
    );
    expect(url.toFileUrl()).toBe(
      'http://my-host/my-org/my-project/_apis/git/repositories/my-repo/items?api-version=6.0&path=%2Ffolder&version=test-branch',
    );
    expect(url.toArchiveUrl()).toBe(
      'http://my-host/my-org/my-project/_apis/git/repositories/my-repo/items?recursionLevel=full&download=true&api-version=6.0&scopePath=%2Ffolder&version=test-branch',
    );
    expect(url.toCommitsUrl()).toBe(
      'http://my-host/my-org/my-project/_apis/git/repositories/my-repo/commits?api-version=6.0&searchCriteria.itemVersion.version=test-branch',
    );
  });

  it('should work with the old tfs long URL', () => {
    const url = AzureUrl.fromRepoUrl(
      'http://my-host/tfs/projects/my-project/_git/my-repo',
    );

    expect(url.getOwner()).toBe('tfs/projects');
    expect(url.getProject()).toBe('my-project');
    expect(url.getRepo()).toBe('my-repo');
    expect(url.getRef()).toBeUndefined();
    expect(url.getPath()).toBeUndefined();
  });

  it('should work with the old tfs long URL form with a path and ref', () => {
    const url = AzureUrl.fromRepoUrl(
      'http://my-host/tfs/projects/my-project/_git/my-repo?path=%2Ffolder&version=GBtest-branch',
    );

    expect(url.getOwner()).toBe('tfs/projects');
    expect(url.getProject()).toBe('my-project');
    expect(url.getRepo()).toBe('my-repo');
    expect(url.getRef()).toBe('test-branch');
    expect(url.getPath()).toBe('/folder');
  });

  it('should reject non-branch refs', () => {
    expect(() =>
      AzureUrl.fromRepoUrl(
        'https://dev.azure.com/my-org/_git/my-project?version=GC6eead79870d998a3befd4bc7c72cc89e446f2970',
      ),
    ).toThrow('Azure URL version must point to a git branch');
  });

  it('should reject non-repo URLs', () => {
    expect(() =>
      AzureUrl.fromRepoUrl('https://dev.azure.com/my-org/_git'),
    ).toThrow('Azure URL must point to a git repository');
    expect(() =>
      AzureUrl.fromRepoUrl('https://dev.azure.com/my-org/_git/'),
    ).toThrow('Azure URL must point to a git repository');
    expect(() =>
      AzureUrl.fromRepoUrl('https://dev.azure.com/my-org/my-project/'),
    ).toThrow('Azure URL must point to a git repository');
    expect(() =>
      AzureUrl.fromRepoUrl('https://dev.azure.com/my-org/my-project/_not-git'),
    ).toThrow('Azure URL must point to a git repository');
    expect(() =>
      AzureUrl.fromRepoUrl(
        'https://dev.azure.com/my-org/my-project/_not-git/my-repo',
      ),
    ).toThrow('Azure URL must point to a git repository');
    expect(() =>
      AzureUrl.fromRepoUrl(
        'https://dev.azure.com/my-org/_workitems/recentlyupdated/',
      ),
    ).toThrow('Azure URL must point to a git repository');
  });
});
