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

import { serializeDirectoryContents } from './serializeDirectoryContents';
import mockFs from 'mock-fs';

describe('serializeDirectoryContents', () => {
  afterEach(() => {
    mockFs.restore();
  });

  it('should list files in this directory', async () => {
    await expect(serializeDirectoryContents(__dirname)).resolves.toEqual(
      expect.arrayContaining([
        {
          path: 'index.ts',
          executable: false,
          content: expect.any(Buffer),
        },
        {
          path: 'types.ts',
          executable: false,
          content: expect.any(Buffer),
        },
        {
          path: 'serializeDirectoryContents.ts',
          executable: false,
          content: expect.any(Buffer),
        },
        {
          path: 'serializeDirectoryContents.test.ts',
          executable: false,
          content: expect.any(Buffer),
        },
      ]),
    );
  });

  it('should list files in a mock directory', async () => {
    mockFs({
      root: {
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
      },
    });

    await expect(serializeDirectoryContents('root')).resolves.toEqual([
      {
        path: 'a.txt',
        executable: false,
        content: Buffer.from('a', 'utf8'),
      },
      {
        path: 'b/b1.txt',
        executable: false,
        content: Buffer.from('b1', 'utf8'),
      },
      {
        path: 'b/b2.txt',
        executable: false,
        content: Buffer.from('b2', 'utf8'),
      },
      {
        path: 'c/c1/c11.txt',
        executable: false,
        content: Buffer.from('c11', 'utf8'),
      },
      {
        path: 'c/c1/c11/c111.txt',
        executable: false,
        content: Buffer.from('c111', 'utf8'),
      },
    ]);
  });

  it('should ignore gitignored files', async () => {
    mockFs({
      root: {
        '.gitignore': '*.txt',
        'a.txt': 'a',
        'a.log': 'a',
      },
    });

    await expect(
      serializeDirectoryContents('root', {
        gitignore: true,
      }),
    ).resolves.toEqual([
      {
        path: '.gitignore',
        executable: false,
        content: Buffer.from('*.txt', 'utf8'),
      },
      {
        path: 'a.log',
        executable: false,
        content: Buffer.from('a', 'utf8'),
      },
    ]);
  });

  it('should use custom glob patterns', async () => {
    mockFs({
      root: {
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
      },
    });

    await expect(
      serializeDirectoryContents('root', {
        gitignore: true,
        globPatterns: ['**/*.txt', '*/.?', '*/*.log', '!c/**/.*', '!b/*.log'],
      }).then(files => files.sort((a, b) => a.path.localeCompare(b.path))),
    ).resolves.toEqual([
      {
        path: 'a.txt',
        executable: false,
        content: Buffer.from('a', 'utf8'),
      },
      {
        path: 'b/.b',
        executable: false,
        content: Buffer.from('b', 'utf8'),
      },
      {
        path: 'b/b.txt',
        executable: false,
        content: Buffer.from('b', 'utf8'),
      },
      {
        path: 'c/c.log',
        executable: false,
        content: Buffer.from('c', 'utf8'),
      },
      {
        path: 'c/c.txt',
        executable: false,
        content: Buffer.from('c', 'utf8'),
      },
    ]);
  });
});
