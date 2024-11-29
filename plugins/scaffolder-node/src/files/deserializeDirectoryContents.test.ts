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
import { deserializeDirectoryContents } from './deserializeDirectoryContents';
import { serializeDirectoryContents } from './serializeDirectoryContents';

describe('deserializeDirectoryContents', () => {
  const mockDir = createMockDirectory();

  beforeEach(() => {
    mockDir.clear();
  });

  it('deserializes contents into a directory', async () => {
    await deserializeDirectoryContents(mockDir.path, [
      {
        path: 'a.txt',
        content: Buffer.from('a', 'utf8'),
      },
    ]);
    await expect(serializeDirectoryContents(mockDir.path)).resolves.toEqual([
      {
        path: 'a.txt',
        content: Buffer.from('a', 'utf8'),
        executable: false,
        symlink: false,
      },
    ]);
  });

  it('deserializes contents into a deep directory structure', async () => {
    await deserializeDirectoryContents(mockDir.path, [
      {
        path: 'a.txt',
        content: Buffer.from('a', 'utf8'),
      },
      {
        path: 'a/b.txt',
        content: Buffer.from('b', 'utf8'),
      },
      {
        path: 'a/b/c.txt',
        content: Buffer.from('c', 'utf8'),
      },
    ]);
    await expect(serializeDirectoryContents(mockDir.path)).resolves.toEqual([
      {
        path: 'a.txt',
        content: Buffer.from('a', 'utf8'),
        executable: false,
        symlink: false,
      },
      {
        path: 'a/b.txt',
        content: Buffer.from('b', 'utf8'),
        executable: false,
        symlink: false,
      },
      {
        path: 'a/b/c.txt',
        content: Buffer.from('c', 'utf8'),
        executable: false,
        symlink: false,
      },
    ]);
  });
});
