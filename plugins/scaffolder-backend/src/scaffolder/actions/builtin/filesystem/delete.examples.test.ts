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

import { createFilesystemDeleteAction } from './delete';
import { createMockActionContext } from '@backstage/plugin-scaffolder-node-test-utils';
import { resolve as resolvePath } from 'path';
import fs from 'fs-extra';
import yaml from 'yaml';
import { examples } from './delete.examples';
import { createMockDirectory } from '@backstage/backend-test-utils';

describe('fs:delete examples', () => {
  const action = createFilesystemDeleteAction();

  const mockDir = createMockDirectory();
  const workspacePath = resolvePath(mockDir.path, 'workspace');

  const files: string[] = yaml.parse(examples[0].example).steps[0].input.files;

  const mockContext = createMockActionContext({
    input: {
      files: files,
    },
    workspacePath,
  });

  beforeEach(() => {
    jest.restoreAllMocks();

    mockDir.setContent({
      [workspacePath]: {
        [files[0]]: 'hello',
        [files[1]]: 'world',
        'a-folder': {
          'unit-test-in-a-folder.js2': 'content',
        },
      },
    });
  });

  it('should call fs.rm with the correct values', async () => {
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
