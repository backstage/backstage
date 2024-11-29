/*
 * Copyright 2021 The Backstage Authors
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

import { resolve as resolvePath } from 'path';
import { createFilesystemDeleteAction } from './delete';
import { createMockActionContext } from '@backstage/plugin-scaffolder-node-test-utils';
import fs from 'fs-extra';
import { createMockDirectory } from '@backstage/backend-test-utils';

describe('fs:delete', () => {
  const action = createFilesystemDeleteAction();

  const mockDir = createMockDirectory();
  const workspacePath = resolvePath(mockDir.path, 'workspace');

  const mockContext = createMockActionContext({
    input: {
      files: ['unit-test-a.js', 'unit-test-b.js'],
    },
    workspacePath,
  });

  beforeEach(() => {
    jest.restoreAllMocks();

    mockDir.setContent({
      [workspacePath]: {
        'unit-test-a.js': 'hello',
        'unit-test-b.js': 'world',
        'a-folder': {
          'unit-test-in-a-folder.js2': 'content',
        },
      },
    });
  });

  it('should throw an error when files is not an array', async () => {
    await expect(
      action.handler({
        ...mockContext,
        input: { files: undefined } as any,
      }),
    ).rejects.toThrow(/files must be an Array/);

    await expect(
      action.handler({
        ...mockContext,
        input: { files: {} } as any,
      }),
    ).rejects.toThrow(/files must be an Array/);

    await expect(
      action.handler({
        ...mockContext,
        input: { files: '' } as any,
      }),
    ).rejects.toThrow(/files must be an Array/);

    await expect(
      action.handler({
        ...mockContext,
        input: { files: null } as any,
      }),
    ).rejects.toThrow(/files must be an Array/);
  });

  it('should throw when file name is not relative to the workspace', async () => {
    await expect(
      action.handler({
        ...mockContext,
        input: { files: ['/foo/../../../index.js'] },
      }),
    ).rejects.toThrow(
      /Relative path is not allowed to refer to a directory outside its parent/,
    );

    await expect(
      action.handler({
        ...mockContext,
        input: { files: ['../../../index.js'] },
      }),
    ).rejects.toThrow(
      /Relative path is not allowed to refer to a directory outside its parent/,
    );
  });

  it('should call fs.rm with the correct values', async () => {
    const files = ['unit-test-a.js', 'unit-test-b.js'];

    files.forEach(file => {
      const filePath = resolvePath(workspacePath, file);
      const fileExists = fs.existsSync(filePath);
      expect(fileExists).toBe(true);
    });

    await action.handler(mockContext);

    files.forEach(file => {
      const filePath = resolvePath(workspacePath, file);
      const fileExists = fs.existsSync(filePath);
      expect(fileExists).toBe(false);
    });
  });
});
