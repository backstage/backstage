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
import yaml from 'yaml';
import { examples } from './rename.examples';
import { createMockDirectory } from '@backstage/backend-test-utils';

describe('fs:rename examples', () => {
  const action = createFilesystemRenameAction();
  const files: { from: string; to: string }[] = yaml.parse(examples[0].example)
    .steps[0].input.files;

  const mockDir = createMockDirectory();
  const workspacePath = resolvePath(mockDir.path, 'workspace');

  const mockContext = createMockActionContext({
    input: {
      files,
    },
    workspacePath,
  });

  beforeEach(() => {
    jest.restoreAllMocks();

    mockDir.setContent({
      [workspacePath]: {
        [files[0].from]: 'hello',
        [files[1].from]: 'world',
        [files[2].from]: '!!!',
        'file3Renamed.txt': 'I will be overwritten :(',
        'a-folder': {
          'file.md': 'content',
        },
      },
    });
  });

  it('should call fs.move with the correct values', async () => {
    mockContext.input.files.forEach(file => {
      const filePath = resolvePath(workspacePath, file.from);
      const fileExists = fs.existsSync(filePath);
      expect(fileExists).toBe(true);
    });

    await action.handler(mockContext);

    mockContext.input.files.forEach(file => {
      const filePath = resolvePath(workspacePath, file.from);
      const fileExists = fs.existsSync(filePath);
      expect(fileExists).toBe(false);
    });
  });

  it('should override when requested', async () => {
    const sourceFile = files[2].from;
    const destFile = files[2].to;
    const sourceFilePath = resolvePath(workspacePath, sourceFile);
    const destFilePath = resolvePath(workspacePath, destFile);

    const sourceBeforeContent = await fs.readFile(sourceFilePath, 'utf-8');
    const destBeforeContent = await fs.readFile(destFilePath, 'utf-8');

    expect(sourceBeforeContent).not.toEqual(destBeforeContent);

    await action.handler({
      ...mockContext,
      input: {
        files,
      },
    });

    const destAfterContent = await fs.readFile(destFilePath, 'utf-8');

    expect(sourceBeforeContent).toEqual(destAfterContent);
  });
});
