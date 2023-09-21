/*
 * Copyright 2023 The Backstage Authors
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

import { MockDirectory } from './MockDirectory';

describe('MockDirectory', () => {
  const mockDir = MockDirectory.create();

  it('should populate a directory with text files', async () => {
    await mockDir.setContent({
      'a.txt': 'a',
      'a/b.txt': 'b',
      'a/b/c.txt': 'c',
      'a/b/d.txt': 'd',
    });

    await expect(mockDir.content()).resolves.toEqual({
      'a.txt': 'a',
      a: {
        'b.txt': 'b',
        b: {
          'c.txt': 'c',
          'd.txt': 'd',
        },
      },
    });
  });

  it('should mix text and binary files', async () => {
    await mockDir.setContent({
      'a.txt': 'a',
      'a/b.txt': 'b',
      'a/b/c.bin': Buffer.from([0xc]),
      'a/b/d.bin': Buffer.from([0xd]),
    });

    await expect(mockDir.content()).resolves.toEqual({
      'a.txt': 'a',
      a: {
        'b.txt': 'b',
        b: {
          'c.bin': Buffer.from([0xc]),
          'd.bin': Buffer.from([0xd]),
        },
      },
    });
  });

  it('should be able to add content', async () => {
    await mockDir.setContent({
      'a.txt': 'a',
      b: {},
    });

    await expect(mockDir.content()).resolves.toEqual({
      'a.txt': 'a',
      b: {},
    });

    await mockDir.addContent({
      'b.txt': 'b',
      b: {
        'c.txt': 'c',
      },
    });

    await expect(mockDir.content()).resolves.toEqual({
      'a.txt': 'a',
      'b.txt': 'b',
      b: {
        'c.txt': 'c',
      },
    });
  });

  it('should replace existing files', async () => {
    await mockDir.setContent({
      'a.txt': 'a',
    });

    await mockDir.addContent({
      'a.txt': 'a2',
    });

    await expect(mockDir.content()).resolves.toEqual({
      'a.txt': 'a2',
    });
  });

  it('should not override directories', async () => {
    await mockDir.setContent({
      'a.txt': 'a',
      b: {},
    });

    await expect(
      mockDir.addContent({
        'a.txt': {},
      }),
    ).rejects.toThrow('EEXIST');

    await expect(
      mockDir.addContent({
        b: 'b',
      }),
    ).rejects.toThrow('EISDIR');
  });

  it('examples should work', async () => {
    await mockDir.setContent({
      'test.txt': 'content',
      'sub-dir': {
        'file.txt': 'content',
        'nested-dir/file.txt': 'content',
      },
      'empty-dir': {},
      'binary-file': Buffer.from([0, 1, 2]),
    });

    await mockDir.addContent({
      'test.txt': 'content',
      'sub-dir': {
        'file.txt': 'content',
        'nested-dir/file.txt': 'content',
      },
      'empty-dir': {},
      'binary-file': Buffer.from([0, 1, 2]),
    });

    await expect(mockDir.content()).resolves.toEqual({
      'test.txt': 'content',
      'sub-dir': {
        'file.txt': 'content',
        'nested-dir': {
          'file.txt': 'content',
        },
      },
      'empty-dir': {},
      'binary-file': Buffer.from([0, 1, 2]),
    });
  });

  describe('cleanup', () => {
    let cleanupMockDir: MockDirectory;

    describe('inner', () => {
      cleanupMockDir = MockDirectory.create();

      it('should populate a directory', async () => {
        await cleanupMockDir.setContent({
          'a.txt': 'a',
        });

        await expect(cleanupMockDir.content()).resolves.toEqual({
          'a.txt': 'a',
        });
      });
    });

    it('should clean up after itself automatically', async () => {
      await expect(cleanupMockDir.content()).resolves.toBeUndefined();
    });
  });
});
