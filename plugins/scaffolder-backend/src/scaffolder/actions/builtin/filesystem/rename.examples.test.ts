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

import * as os from 'os';
import mockFs from 'mock-fs';
import { resolve as resolvePath } from 'path';
import { createFilesystemRenameAction } from './rename';
import { getVoidLogger } from '@backstage/backend-common';
import { PassThrough } from 'stream';
import fs from 'fs-extra';
import yaml from 'yaml';
import { examples } from './rename.examples';

const root = os.platform() === 'win32' ? 'C:\\rootDir' : '/rootDir';
const workspacePath = resolvePath(root, 'my-workspace');

describe('fs:rename examples', () => {
  const action = createFilesystemRenameAction();
  const files: { from: string; to: string }[] = yaml.parse(examples[0].example)
    .steps[0].input.files;

  const mockContext = {
    input: {
      files: files,
    },
    workspacePath,
    logger: getVoidLogger(),
    logStream: new PassThrough(),
    output: jest.fn(),
    createTemporaryDirectory: jest.fn(),
  };

  beforeEach(() => {
    jest.restoreAllMocks();

    mockFs({
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

  afterEach(() => {
    mockFs.restore();
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
