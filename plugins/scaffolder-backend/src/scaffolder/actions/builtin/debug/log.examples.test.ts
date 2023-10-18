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

import { getVoidLogger } from '@backstage/backend-common';
import { Writable } from 'stream';
import { createDebugLogAction } from './log';
import { join } from 'path';
import yaml from 'yaml';
import { examples } from './log.examples';
import { createMockDirectory } from '@backstage/backend-test-utils';

describe('debug:log examples', () => {
  const logStream = {
    write: jest.fn(),
  } as jest.Mocked<Partial<Writable>> as jest.Mocked<Writable>;

  const mockDir = createMockDirectory();
  const workspacePath = mockDir.resolve('workspace');

  const mockContext = {
    input: {},
    baseUrl: 'somebase',
    workspacePath,
    logger: getVoidLogger(),
    logStream,
    output: jest.fn(),
    createTemporaryDirectory: jest.fn(),
  };

  const action = createDebugLogAction();

  beforeEach(() => {
    mockDir.setContent({
      [`${workspacePath}/README.md`]: '',
      [`${workspacePath}/a-directory/index.md`]: '',
    });
    jest.resetAllMocks();
  });

  it('should log message', async () => {
    const context = {
      ...mockContext,
      input: yaml.parse(examples[0].example).steps[0].input,
    };

    await action.handler(context);

    expect(logStream.write).toHaveBeenCalledTimes(1);
    expect(logStream.write).toHaveBeenCalledWith(
      expect.stringContaining('Hello Backstage!'),
    );
  });

  it('should log the workspace content, if active', async () => {
    const context = {
      ...mockContext,
      input: yaml.parse(examples[1].example).steps[0].input,
    };

    await action.handler(context);

    expect(logStream.write).toHaveBeenCalledTimes(1);
    expect(logStream.write).toHaveBeenCalledWith(
      expect.stringContaining('README.md'),
    );
    expect(logStream.write).toHaveBeenCalledWith(
      expect.stringContaining(join('a-directory', 'index.md')),
    );
  });
});
