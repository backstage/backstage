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
import { join as joinPath, relative as relativePath } from 'path';
import { createMockDirectory, MockDirectory } from './MockDirectory';

describe('createMockDirectory', () => {
  const mockDir = createMockDirectory();

  beforeEach(mockDir.clear);

  it('should resolve paths', () => {
    expect(mockDir.path).toEqual(expect.any(String));
    expect(relativePath(mockDir.path, mockDir.resolve('a'))).toBe('a');
    expect(relativePath(mockDir.path, mockDir.resolve('a/b/c'))).toBe(
      joinPath('a', 'b', 'c'),
    );
  });

  it('should remove itself', async () => {
    await expect(fs.pathExists(mockDir.path)).resolves.toBe(true);
    mockDir.remove();
    await expect(fs.pathExists(mockDir.path)).resolves.toBe(false);
  });

  it('should populate a directory with text files', () => {
    mockDir.setContent({
      'a.txt': 'a',
      'a/b.txt': 'b',
      'a/b/c.txt': 'c',
      'a/b/d.txt': 'd',
    });

    expect(mockDir.content()).toEqual({
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

  it('should mix text and binary files', () => {
    mockDir.setContent({
      'a.txt': 'a',
      'a/b.txt': 'b',
      'a/b/c.bin': Buffer.from([0xc]),
      'a/b/d.bin': Buffer.from([0xd]),
    });

    expect(mockDir.content()).toEqual({
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

  it('should be able to add content', () => {
    mockDir.setContent({
      'a.txt': 'a',
      b: {},
    });

    expect(mockDir.content()).toEqual({
      'a.txt': 'a',
      b: {},
    });

    mockDir.addContent({
      'b.txt': 'b',
      [mockDir.resolve('b')]: {
        'c.txt': 'c',
      },
    });

    expect(mockDir.content()).toEqual({
      'a.txt': 'a',
      'b.txt': 'b',
      b: {
        'c.txt': 'c',
      },
    });
  });

  it('should replace existing files', () => {
    mockDir.setContent({
      'a.txt': 'a',
    });

    mockDir.addContent({
      'a.txt': 'a2',
    });

    expect(mockDir.content()).toEqual({
      'a.txt': 'a2',
    });
  });

  it('should be able to use callback for more detailed file system operations', () => {
    mockDir.setContent({
      'a.txt': 'a',
      'b.txt': ctx => ctx.symlink('./a.txt'),
      'c.txt': ctx => fs.copyFileSync(mockDir.resolve('a.txt'), ctx.path),
    });

    expect(mockDir.content()).toEqual({
      'a.txt': 'a',
      'b.txt': 'a',
      'c.txt': 'a',
    });
  });

  it('should read content from sub dirs', () => {
    mockDir.setContent({
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

    expect(mockDir.content()).toEqual(expected);
    expect(mockDir.content({ path: mockDir.path })).toEqual(expected);
    expect(mockDir.content({ path: mockDir.resolve('.') })).toEqual(expected);
    expect(mockDir.content({ path: 'b' })).toEqual(expected.b);
    expect(mockDir.content({ path: './b' })).toEqual(expected.b);
    expect(mockDir.content({ path: mockDir.resolve('b') })).toEqual(expected.b);
    expect(mockDir.content({ path: 'b/c' })).toEqual(expected.b.c);
    expect(mockDir.content({ path: './b/c' })).toEqual(expected.b.c);
    expect(mockDir.content({ path: mockDir.resolve('b/c') })).toEqual(
      expected.b.c,
    );
    expect(mockDir.content({ path: mockDir.resolve('b', 'c') })).toEqual(
      expected.b.c,
    );
  });

  it('should allow text reading to be configured', () => {
    const text = 'a';
    const binary = Buffer.from('a', 'utf8');

    mockDir.setContent({
      a: binary,
      'a.txt': text,
      'a.bin': binary,
    });

    expect(mockDir.content()).toEqual({
      a: binary,
      'a.txt': text,
      'a.bin': binary,
    });

    expect(mockDir.content({ shouldReadAsText: false })).toEqual({
      a: binary,
      'a.txt': binary,
      'a.bin': binary,
    });

    expect(mockDir.content({ shouldReadAsText: true })).toEqual({
      a: text,
      'a.txt': text,
      'a.bin': text,
    });

    expect(
      mockDir.content({ shouldReadAsText: path => path.length > 3 }),
    ).toEqual({
      a: binary,
      'a.txt': text,
      'a.bin': text,
    });
  });

  it('should provide a posix path to shouldReadAsText', () => {
    const shouldReadAsText = jest.fn().mockReturnValue(true);

    mockDir.setContent({ 'a/b/c': 'c' });

    expect(mockDir.content({ shouldReadAsText })).toEqual({
      a: { b: { c: 'c' } },
    });
    expect(shouldReadAsText).toHaveBeenCalledWith(
      'a/b/c',
      Buffer.from('c', 'utf8'),
    );
  });

  it('should not override directories', () => {
    mockDir.setContent({
      'a.txt': 'a',
      b: {},
    });

    expect(() =>
      mockDir.addContent({
        'a.txt': {},
      }),
    ).toThrow('EEXIST');

    expect(() =>
      mockDir.addContent({
        b: 'b',
      }),
    ).toThrow('EISDIR');
  });

  it('examples should work', () => {
    mockDir.setContent({
      'test.txt': 'content',
      'sub-dir': {
        'file.txt': 'content',
        'nested-dir/file.txt': 'content',
      },
      'empty-dir': {},
      'binary-file': Buffer.from([0, 1, 2]),
    });

    mockDir.addContent({
      'test.txt': 'content',
      'sub-dir': {
        'file.txt': 'content',
        'nested-dir/file.txt': 'content',
      },
      'empty-dir': {},
      'binary-file': Buffer.from([0, 1, 2]),
    });

    expect(mockDir.content()).toEqual({
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

  it('should reject non-child paths', () => {
    const path = mockDir.resolve('/root/a.txt');
    expect(() => mockDir.setContent({ '/root/a.txt': 'a' })).toThrow(
      `Provided path must resolve to a child path of the mock directory, got '${path}'`,
    );
    expect(() => mockDir.addContent({ '/root/a.txt': 'a' })).toThrow(
      `Provided path must resolve to a child path of the mock directory, got '${path}'`,
    );
    expect(() => mockDir.content({ path: '/root/a.txt' })).toThrow(
      `Provided path must resolve to a child path of the mock directory, got '${path}'`,
    );
  });

  describe('tmpdir mock', () => {
    let tmpDirMock: MockDirectory;

    describe('inner', () => {
      tmpDirMock = createMockDirectory({ mockOsTmpDir: true });

      it('should mock os.tmpdir()', () => {
        expect(os.tmpdir()).toBe(tmpDirMock.path);
      });

      it('should refuce to mock os.tmpdir() again', () => {
        expect(() => createMockDirectory({ mockOsTmpDir: true })).toThrow(
          'Cannot mock os.tmpdir() when it has already been mocked',
        );
      });
    });

    it('should restore os.tmpdir()', () => {
      expect(os.tmpdir()).not.toBe(tmpDirMock.path);
    });
  });
});
