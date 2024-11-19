/*
 * Copyright 2024 The Backstage Authors
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

import { createFilesystemReadDirAction } from './read';
import { createMockActionContext } from '@backstage/plugin-scaffolder-node-test-utils';
import { resolve as resolvePath } from 'path';
import { createMockDirectory } from '@backstage/backend-test-utils';
import { examples } from './read.examples';
import yaml from 'yaml';

describe('fs:readdir examples', () => {
  const action = createFilesystemReadDirAction();

  const mockDir = createMockDirectory();
  mockDir.setContent({
    workspace: {
      'file1.txt': 'hello',
      'file2.txt': 'world',
      docs: {
        'doc1.md': 'hello',
        'doc2.md': 'world',
        assets: {
          'asset1.jpg': 'sddfsdfsdfsdf',
        },
      },
    },
  });
  const workspacePath = resolvePath(mockDir.path, 'workspace');

  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('should be able to read workspace root', async () => {
    const example = examples[0].example;
    const mockContext = createMockActionContext<any, any>({
      workspacePath,
      input: yaml.parse(example).steps[0].input,
    });
    await action.handler(mockContext);
    expect(mockContext.output).toHaveBeenNthCalledWith(1, 'files', [
      {
        name: 'file1.txt',
        path: 'file1.txt',
        fullPath: resolvePath(workspacePath, 'file1.txt'),
      },
      {
        name: 'file2.txt',
        path: 'file2.txt',
        fullPath: resolvePath(workspacePath, 'file2.txt'),
      },
    ]);
    expect(mockContext.output).toHaveBeenNthCalledWith(2, 'folders', [
      {
        name: 'docs',
        path: 'docs',
        fullPath: resolvePath(workspacePath, 'docs'),
      },
    ]);
  });

  it('should be able to read directory recursively', async () => {
    const example = examples[1].example;
    const mockContext = createMockActionContext<any, any>({
      workspacePath,
      input: yaml.parse(example).steps[0].input,
    });
    await action.handler(mockContext);
    expect(mockContext.output).toHaveBeenNthCalledWith(1, 'files', [
      {
        name: 'doc1.md',
        path: 'docs/doc1.md',
        fullPath: resolvePath(workspacePath, 'docs/doc1.md'),
      },
      {
        name: 'doc2.md',
        path: 'docs/doc2.md',
        fullPath: resolvePath(workspacePath, 'docs/doc2.md'),
      },
      {
        name: 'asset1.jpg',
        path: 'docs/assets/asset1.jpg',
        fullPath: resolvePath(workspacePath, 'docs/assets/asset1.jpg'),
      },
    ]);
    expect(mockContext.output).toHaveBeenNthCalledWith(2, 'folders', [
      {
        name: 'assets',
        path: 'docs/assets',
        fullPath: resolvePath(workspacePath, 'docs/assets'),
      },
    ]);
  });
});
