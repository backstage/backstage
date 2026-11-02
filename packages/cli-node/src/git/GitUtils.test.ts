/*
 * Copyright 2022 The Backstage Authors
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

import { createMockDirectory } from '@backstage/backend-test-utils';
import { overrideTargetPaths } from '@backstage/cli-common/testUtils';
import { runGit, GitUtils, readFilesAtRef } from './GitUtils';

const mockDir = createMockDirectory();
overrideTargetPaths(mockDir.path);

// Avoid depending on the developer's git identity and signing configuration.
function commit(message: string) {
  return runGit(
    '-c',
    'user.name=Test',
    '-c',
    'user.email=test@example.com',
    '-c',
    'commit.gpgsign=false',
    'commit',
    '--quiet',
    '--all',
    '--message',
    message,
  );
}

beforeAll(async () => {
  mockDir.setContent({
    'a.txt': 'a',
    'b.txt': 'b',
    'dir/ö.txt': 'åäö\n',
    'dir/e.txt': 'e',
  });
  await runGit('init', '--quiet', '--initial-branch', 'main');
  await runGit('add', '.');
  await commit('initial');

  await runGit('checkout', '--quiet', '-b', 'feature');
  mockDir.addContent({ 'a.txt': 'changed', 'dir/e.txt': 'changed' });
  await commit('change a');

  mockDir.addContent({
    'b.txt': 'uncommitted',
    'c.txt': 'untracked',
    'dir/f.txt': 'untracked',
  });
});

describe('runGit', () => {
  it('runs a git command', async () => {
    await expect(runGit('log', 'HEAD..HEAD')).resolves.toEqual(['']);
  });

  it('fails for unknown commands', async () => {
    await expect(runGit('ryckbegäran')).rejects.toThrow(
      /^git ryckbegäran failed, git: 'ryckbegäran' is not a git command/,
    );
  });

  it('forwards failures', async () => {
    await expect(
      runGit(
        'show',
        '--quiet',
        '--pretty=format:%s',
        '0000000000000000000000000000000000000000',
      ),
    ).rejects.toThrow(
      'git show failed, fatal: bad object 0000000000000000000000000000000000000000',
    );
  });
});

describe('listChangedFiles', () => {
  it('requires a ref', async () => {
    await expect(GitUtils.listChangedFiles('')).rejects.toThrow(
      'ref is required',
    );
  });

  it('lists committed, uncommitted, and untracked changes since the merge base', async () => {
    await expect(GitUtils.listChangedFiles('main')).resolves.toEqual([
      'a.txt',
      'b.txt',
      'dir/e.txt',
      'c.txt',
      'dir/f.txt',
    ]);
  });

  it('lists and reads files relative to a workspace root in a subdirectory of the repo', async () => {
    const subdir = overrideTargetPaths(mockDir.resolve('dir'));
    try {
      await expect(GitUtils.listChangedFiles('main')).resolves.toEqual([
        'e.txt',
        'f.txt',
      ]);
      await expect(GitUtils.readFileAtRef('e.txt', 'main')).resolves.toBe('e');
    } finally {
      subdir.restore();
      overrideTargetPaths(mockDir.path);
    }
  });
});

describe('readFilesAtRef', () => {
  it('reads files at the merge base in one go', async () => {
    await expect(readFilesAtRef([], 'main')).resolves.toEqual([]);
    await expect(
      readFilesAtRef(
        ['a.txt', 'missing.txt', 'dir', 'dir/ö.txt', 'b.txt'],
        'main',
      ),
    ).resolves.toEqual(['a', undefined, undefined, 'åäö\n', 'b']);
    await expect(readFilesAtRef(['a.txt'], 'feature')).resolves.toEqual([
      'changed',
    ]);
    await expect(readFilesAtRef(['a.txt'], 'missing-ref')).resolves.toEqual([
      undefined,
    ]);

    // Paths are relative to a workspace root in a subdirectory of the repo
    const subdir = overrideTargetPaths(mockDir.resolve('dir'));
    try {
      await expect(readFilesAtRef(['ö.txt'], 'main')).resolves.toEqual([
        'åäö\n',
      ]);
    } finally {
      subdir.restore();
    }
  });
});
