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

import fs from 'fs-extra';
import os from 'os';
import { relative as relativePath } from 'path';
import { MockDirectory } from './MockDirectory';

describe('MockDirectory', () => {
  const mockDir = MockDirectory.create();

  beforeEach(mockDir.clear);

  it('should resolve paths', () => {
    expect(mockDir.path).toEqual(expect.any(String));
    expect(relativePath(mockDir.path, mockDir.resolve('a'))).toBe('a');
    expect(relativePath(mockDir.path, mockDir.resolve('a/b/c'))).toBe('a/b/c');
  });

  it('should remove itself', async () => {
    await expect(fs.pathExists(mockDir.path)).resolves.toBe(true);
    await mockDir.remove();
    await expect(fs.pathExists(mockDir.path)).resolves.toBe(false);
  });

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

  it('should read content from sub dirs', async () => {
    await mockDir.setContent({
      'a.txt': 'a',
      'b/b.txt': 'b',
      'b/c/c.txt': 'c',
    });

    const expected = {
      'a.txt': 'a',
      b: {
        'b.txt': 'b',
        c: {
          'c.txt': 'c',
        },
      },
    };

    await expect(mockDir.content()).resolves.toEqual(expected);
    await expect(mockDir.content({ path: mockDir.path })).resolves.toEqual(
      expected,
    );
    await expect(
      mockDir.content({ path: mockDir.resolve('.') }),
    ).resolves.toEqual(expected);
    await expect(mockDir.content({ path: 'b' })).resolves.toEqual(expected.b);
    await expect(mockDir.content({ path: './b' })).resolves.toEqual(expected.b);
    await expect(
      mockDir.content({ path: mockDir.resolve('b') }),
    ).resolves.toEqual(expected.b);
    await expect(mockDir.content({ path: 'b/c' })).resolves.toEqual(
      expected.b.c,
    );
    await expect(mockDir.content({ path: './b/c' })).resolves.toEqual(
      expected.b.c,
    );
    await expect(
      mockDir.content({ path: mockDir.resolve('b/c') }),
    ).resolves.toEqual(expected.b.c);
    await expect(
      mockDir.content({ path: mockDir.resolve('b', 'c') }),
    ).resolves.toEqual(expected.b.c);
  });

  it('should allow text reading to be configured', async () => {
    const text = 'a';
    const binary = Buffer.from('a', 'utf8');

    await mockDir.setContent({
      a: binary,
      'a.txt': text,
      'a.bin': binary,
    });

    await expect(mockDir.content()).resolves.toEqual({
      a: binary,
      'a.txt': text,
      'a.bin': binary,
    });

    await expect(mockDir.content({ shouldReadAsText: false })).resolves.toEqual(
      {
        a: binary,
        'a.txt': binary,
        'a.bin': binary,
      },
    );

    await expect(mockDir.content({ shouldReadAsText: true })).resolves.toEqual({
      a: text,
      'a.txt': text,
      'a.bin': text,
    });

    await expect(
      mockDir.content({ shouldReadAsText: path => path.length > 3 }),
    ).resolves.toEqual({
      a: binary,
      'a.txt': text,
      'a.bin': text,
    });
  });

  it('should provide a posix path to shouldReadAsText', async () => {
    const shouldReadAsText = jest.fn().mockReturnValue(true);

    await mockDir.setContent({ 'a/b/c': 'c' });

    await expect(mockDir.content({ shouldReadAsText })).resolves.toEqual({
      a: { b: { c: 'c' } },
    });
    expect(shouldReadAsText).toHaveBeenCalledWith(
      'a/b/c',
      Buffer.from('c', 'utf8'),
    );
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

  it('should reject non-child paths', async () => {
    await expect(mockDir.setContent({ '/root/a.txt': 'a' })).rejects.toThrow(
      "Provided path must resolve to a child path of the mock directory, got '/root/a.txt'",
    );
    await expect(mockDir.addContent({ '/root/a.txt': 'a' })).rejects.toThrow(
      "Provided path must resolve to a child path of the mock directory, got '/root/a.txt'",
    );
    await expect(mockDir.content({ path: '/root/a.txt' })).rejects.toThrow(
      "Provided path must resolve to a child path of the mock directory, got '/root/a.txt'",
    );
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

  describe('tmpdir mock', () => {
    let tmpDirMock: MockDirectory;

    describe('inner', () => {
      tmpDirMock = MockDirectory.mockOsTmpDir();

      it('should mock os.tmpdir()', async () => {
        expect(os.tmpdir()).toBe(tmpDirMock.path);
      });
    });

    it('should restore os.tmpdir()', async () => {
      expect(os.tmpdir()).not.toBe(tmpDirMock.path);
    });
  });

  describe('existing directory', () => {
    let existingMockDir: MockDirectory;

    describe('inner', () => {
      existingMockDir = MockDirectory.create({ root: __dirname }); // hardcore mode

      it('should read existing directory', async () => {
        await expect(existingMockDir.content()).resolves.toMatchObject({
          'index.ts': expect.any(String),
        });
      });
    });

    it('should remove existing directory', async () => {
      await expect(fs.pathExists(__dirname)).resolves.toBe(true);
    });
  });
});
