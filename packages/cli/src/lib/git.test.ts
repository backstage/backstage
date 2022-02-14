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

import { runGit, listChangedFiles } from './git';

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
    await expect(listChangedFiles('')).rejects.toThrow('ref is required');
  });

  it('should return something', async () => {
    await expect(listChangedFiles('HEAD')).resolves.toEqual(expect.any(Array));
  });
});
