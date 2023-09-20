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

import { DirectoryMocker } from './DirectoryMocker';

describe('DirectoryMocker', () => {
  const mocker = DirectoryMocker.create();

  it('should populate a directory with text files', async () => {
    await mocker.setContent({
      'a.txt': 'a',
      'a/b.txt': 'b',
      'a/b/c.txt': 'c',
      'a/b/d.txt': 'd',
    });

    await expect(mocker.getContent()).resolves.toEqual({
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
    await mocker.setContent({
      'a.txt': 'a',
      'a/b.txt': 'b',
      'a/b/c.bin': Buffer.from([0xc]),
      'a/b/d.bin': Buffer.from([0xd]),
    });

    await expect(mocker.getContent()).resolves.toEqual({
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

  describe('cleanup', () => {
    let cleanupMocker: DirectoryMocker;

    describe('inner', () => {
      cleanupMocker = DirectoryMocker.create();

      it('should populate a directory', async () => {
        await cleanupMocker.setContent({
          'a.txt': 'a',
        });

        await expect(cleanupMocker.getContent()).resolves.toEqual({
          'a.txt': 'a',
        });
      });
    });

    it('should clean up after itself automatically', async () => {
      await expect(cleanupMocker.getContent()).resolves.toBeUndefined();
    });
  });
});
