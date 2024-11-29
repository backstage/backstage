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
import { createFilesystemRenameAction } from './rename';
import { createMockActionContext } from '@backstage/plugin-scaffolder-node-test-utils';
import fs from 'fs-extra';
import { createMockDirectory } from '@backstage/backend-test-utils';

describe('fs:rename', () => {
  const action = createFilesystemRenameAction();

  const mockDir = createMockDirectory();
  const workspacePath = resolvePath(mockDir.path, 'workspace');

  const mockInputFiles = [
    {
      from: 'unit-test-a.js',
      to: 'new-a.js',
    },
    {
      from: 'unit-test-b.js',
      to: 'new-b.js',
    },
    {
      from: 'a-folder',
      to: 'brand-new-folder',
    },
  ];
  const mockContext = createMockActionContext({
    input: {
      files: mockInputFiles,
    },
    workspacePath,
  });

  beforeEach(() => {
    jest.restoreAllMocks();

    mockDir.setContent({
      [workspacePath]: {
        'unit-test-a.js': 'hello',
        'unit-test-b.js': 'world',
        'unit-test-c.js': 'i will be overwritten :-(',
        'a-folder': {
          'file.md': 'content',
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

  it('should throw an error when files have missing from/to', async () => {
    await expect(
      action.handler({
        ...mockContext,
        input: { files: ['old.md'] } as any,
      }),
    ).rejects.toThrow(/each file must have a from and to property/);

    await expect(
      action.handler({
        ...mockContext,
        input: { files: [{ from: 'old.md' }] } as any,
      }),
    ).rejects.toThrow(/each file must have a from and to property/);

    await expect(
      action.handler({
        ...mockContext,
        input: { files: [{ to: 'new.md' }] } as any,
      }),
    ).rejects.toThrow(/each file must have a from and to property/);
  });

  it('should throw when file name is not relative to the workspace', async () => {
    await expect(
      action.handler({
        ...mockContext,
        input: { files: [{ from: 'index.js', to: '/core/../../../index.js' }] },
      }),
    ).rejects.toThrow(
      /Relative path is not allowed to refer to a directory outside its parent/,
    );

    await expect(
      action.handler({
        ...mockContext,
        input: { files: [{ from: '/core/../../../index.js', to: 'index.js' }] },
      }),
    ).rejects.toThrow(
      /Relative path is not allowed to refer to a directory outside its parent/,
    );
  });

  it('should throw is trying to override by mistake', async () => {
    const destFile = 'unit-test-c.js';
    const filePath = resolvePath(workspacePath, destFile);
    const beforeContent = await fs.readFile(filePath, 'utf-8');

    await expect(
      action.handler({
        ...mockContext,
        input: {
          files: [
            {
              from: 'unit-test-a.js',
              to: 'unit-test-c.js',
            },
          ],
        },
      }),
    ).rejects.toThrow(/dest already exists/);

    const afterContent = await fs.readFile(filePath, 'utf-8');

    expect(beforeContent).toEqual(afterContent);
  });

  it('should call fs.move with the correct values', async () => {
    mockInputFiles.forEach(file => {
      const filePath = resolvePath(workspacePath, file.from);
      const fileExists = fs.existsSync(filePath);
      expect(fileExists).toBe(true);
    });

    await action.handler(mockContext);

    mockInputFiles.forEach(file => {
      const filePath = resolvePath(workspacePath, file.from);
      const fileExists = fs.existsSync(filePath);
      expect(fileExists).toBe(false);
    });
  });

  it('should override when requested', async () => {
    const sourceFile = 'unit-test-a.js';
    const destFile = 'unit-test-c.js';
    const sourceFilePath = resolvePath(workspacePath, sourceFile);
    const destFilePath = resolvePath(workspacePath, destFile);

    const sourceBeforeContent = await fs.readFile(sourceFilePath, 'utf-8');
    const destBeforeContent = await fs.readFile(destFilePath, 'utf-8');

    expect(sourceBeforeContent).not.toEqual(destBeforeContent);

    await action.handler({
      ...mockContext,
      input: {
        files: [
          {
            from: sourceFile,
            to: destFile,
            overwrite: true,
          },
        ],
      },
    });

    const destAfterContent = await fs.readFile(destFilePath, 'utf-8');

    expect(sourceBeforeContent).toEqual(destAfterContent);
  });
});
