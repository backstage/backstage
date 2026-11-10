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

import fs from 'fs-extra';
import { createMockDirectory } from '@backstage/backend-test-utils';
import { targetPaths } from '@backstage/cli-common';
import {
  addCodeownersEntry,
  isValidSingleOwnerId,
  parseOwnerIds,
} from './codeowners';

describe('codeowners', () => {
  it('isValidSingleOwnerId', () => {
    [
      '@foo',
      '@a-b',
      '@org-a/team-a',
      '@a/b',
      'adam_driver+spam@deathstar.com',
    ].forEach(id => {
      expect(isValidSingleOwnerId(id)).toBeTruthy();
    });

    [
      '',
      '@',
      '@/team-a',
      '@orsdsd/',
      'adam_driver@deathstar',
      'something',
    ].forEach(id => {
      expect(isValidSingleOwnerId(id)).toBeFalsy();
    });
  });

  it('parseOwnerIds', () => {
    expect(parseOwnerIds('')).toBeUndefined();
    expect(parseOwnerIds('@foo')).toEqual(['@foo']);
    expect(parseOwnerIds(' @foo  @bar/baz   ')).toEqual(['@foo', '@bar/baz']);
    expect(parseOwnerIds(' @foo  @bar/   ')).toBeUndefined();
  });

  describe('addCodeownersEntry', () => {
    const mockDir = createMockDirectory();
    const existing = [
      '# Header comment',
      '',
      '*                   @backstage/core',
      '/packages/foo/      @org/foo-team',
      '',
      '# Section comment',
      '/plugins/bar/  @org/bar-team  @someone',
      '',
    ].join('\n');

    beforeEach(() => {
      mockDir.setContent({ '.github/CODEOWNERS': existing });
    });

    it('preserves existing content and appends a repo-relative entry', async () => {
      const file = mockDir.resolve('.github/CODEOWNERS');
      await expect(
        addCodeownersEntry('packages/zz-lib', '@org/new-team', file),
      ).resolves.toBe(true);
      expect(await fs.readFile(file, 'utf8')).toBe(
        `${existing}/packages/zz-lib/ @org/new-team\n`,
      );
    });

    it('converts absolute paths to repo-relative paths', async () => {
      const file = mockDir.resolve('.github/CODEOWNERS');
      await addCodeownersEntry(
        targetPaths.resolveRoot('packages', 'zz-lib'),
        '@org/new-team @someone',
        file,
      );
      expect(await fs.readFile(file, 'utf8')).toBe(
        `${existing}/packages/zz-lib/ @org/new-team @someone\n`,
      );
    });

    it('adds a newline if the file lacks a trailing one', async () => {
      mockDir.setContent({ CODEOWNERS: '# c\n* @a/b' });
      const file = mockDir.resolve('CODEOWNERS');
      await addCodeownersEntry('plugins/x', '@a/b', file);
      expect(await fs.readFile(file, 'utf8')).toBe(
        '# c\n* @a/b\n/plugins/x/ @a/b\n',
      );
    });

    it('rejects invalid owners without touching the file', async () => {
      const file = mockDir.resolve('.github/CODEOWNERS');
      await expect(
        addCodeownersEntry('packages/x', 'nope', file),
      ).resolves.toBe(false);
      expect(await fs.readFile(file, 'utf8')).toBe(existing);
    });
  });
});
