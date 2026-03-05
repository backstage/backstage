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
import { serializeDirectoryContents } from './serializeDirectoryContents';

describe('serializeDirectoryContents', () => {
  const mockDir = createMockDirectory();

  it('should list files in this directory', async () => {
    await expect(serializeDirectoryContents(__dirname)).resolves.toEqual(
      expect.arrayContaining([
        {
          path: 'index.ts',
          executable: false,
          symlink: false,
          content: expect.any(Buffer),
        },
        {
          path: 'types.ts',
          executable: false,
          symlink: false,
          content: expect.any(Buffer),
        },
        {
          path: 'serializeDirectoryContents.ts',
          executable: false,
          symlink: false,
          content: expect.any(Buffer),
        },
        {
          path: 'serializeDirectoryContents.test.ts',
          executable: false,
          symlink: false,
          content: expect.any(Buffer),
        },
      ]),
    );
  });

  it('should list files in a mock directory', async () => {
    mockDir.setContent({
      'a.txt': 'a',
      b: {
        'b1.txt': 'b1',
        'b2.txt': 'b2',
      },
      c: {
        c1: {
          'c11.txt': 'c11',
          c11: {
            'c111.txt': 'c111',
          },
        },
      },
    });

    await expect(serializeDirectoryContents(mockDir.path)).resolves.toEqual([
      {
        path: 'a.txt',
        executable: false,
        symlink: false,
        content: Buffer.from('a', 'utf8'),
      },
      {
        path: 'b/b1.txt',
        executable: false,
        symlink: false,
        content: Buffer.from('b1', 'utf8'),
      },
      {
        path: 'b/b2.txt',
        executable: false,
        symlink: false,
        content: Buffer.from('b2', 'utf8'),
      },
      {
        path: 'c/c1/c11.txt',
        executable: false,
        symlink: false,
        content: Buffer.from('c11', 'utf8'),
      },
      {
        path: 'c/c1/c11/c111.txt',
        executable: false,
        symlink: false,
        content: Buffer.from('c111', 'utf8'),
      },
    ]);
  });

  it('should ignore symlinked files', async () => {
    mockDir.setContent({
      'a.txt': 'some text',
      sym: ctx => ctx.symlink('./a.txt'),
    });

    await expect(serializeDirectoryContents(mockDir.path)).resolves.toEqual([
      {
        path: 'a.txt',
        executable: false,
        symlink: false,
        content: Buffer.from('some text', 'utf8'),
      },
    ]);
  });

  it('should pick up broken symlinks', async () => {
    mockDir.setContent({
      'b.txt': ctx => ctx.symlink('./a.txt'),
    });

    await expect(serializeDirectoryContents(mockDir.path)).resolves.toEqual([
      {
        path: 'b.txt',
        executable: true,
        symlink: true,
        content: Buffer.from('./a.txt', 'utf8'),
      },
    ]);
  });

  it('should ignore symlinked folder files', async () => {
    mockDir.setContent({
      'a.txt': 'some text',
      linkme: {
        'b.txt': 'lols',
      },
      sym: ctx => ctx.symlink('./linkme'),
    });

    await expect(serializeDirectoryContents(mockDir.path)).resolves.toEqual([
      {
        path: 'a.txt',
        executable: false,
        symlink: false,
        content: Buffer.from('some text', 'utf8'),
      },
      {
        path: 'linkme/b.txt',
        executable: false,
        symlink: false,
        content: Buffer.from('lols', 'utf8'),
      },
    ]);
  });

  it('should ignore gitignored files', async () => {
    mockDir.setContent({
      '.gitignore': '*.txt',
      'a.txt': 'a',
      'a.log': 'a',
    });

    await expect(
      serializeDirectoryContents(mockDir.path, {
        gitignore: true,
      }),
    ).resolves.toEqual([
      {
        path: '.gitignore',
        executable: false,
        symlink: false,
        content: Buffer.from('*.txt', 'utf8'),
      },
      {
        path: 'a.log',
        executable: false,
        symlink: false,
        content: Buffer.from('a', 'utf8'),
      },
    ]);
  });

  it('should use custom glob patterns', async () => {
    mockDir.setContent({
      '.a': 'a',
      'a.log': 'a',
      'a.txt': 'a',
      b: {
        '.b': 'b',
        'b.log': 'b',
        'b.txt': 'b',
      },
      c: {
        '.c': 'c',
        'c.log': 'c',
        'c.txt': 'c',
      },
    });

    await expect(
      serializeDirectoryContents(mockDir.path, {
        gitignore: true,
        globPatterns: ['**/*.txt', '*/.?', '*/*.log', '!c/**/.*', '!b/*.log'],
      }).then(files => files.sort((a, b) => a.path.localeCompare(b.path))),
    ).resolves.toEqual([
      {
        path: 'a.txt',
        executable: false,
        symlink: false,
        content: Buffer.from('a', 'utf8'),
      },
      {
        path: 'b/.b',
        executable: false,
        symlink: false,
        content: Buffer.from('b', 'utf8'),
      },
      {
        path: 'b/b.txt',
        executable: false,
        symlink: false,
        content: Buffer.from('b', 'utf8'),
      },
      {
        path: 'c/c.log',
        executable: false,
        symlink: false,
        content: Buffer.from('c', 'utf8'),
      },
      {
        path: 'c/c.txt',
        executable: false,
        symlink: false,
        content: Buffer.from('c', 'utf8'),
      },
    ]);
  });
});
