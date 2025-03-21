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

import { createMockActionContext } from '@backstage/plugin-scaffolder-node-test-utils';
import { Logger } from 'winston';
import { createDebugLogAction } from './log';
import { join } from 'path';
import yaml from 'yaml';
import { createMockDirectory } from '@backstage/backend-test-utils';

describe('debug:log', () => {
  const logger = {
    info: jest.fn(),
  } as unknown as jest.Mocked<Logger>;

  const mockDir = createMockDirectory();
  const workspacePath = mockDir.resolve('workspace');

  const mockContext = createMockActionContext({ workspacePath, logger });

  const action = createDebugLogAction();

  beforeEach(() => {
    mockDir.setContent({
      [`${mockContext.workspacePath}/README.md`]: 'This is a README file',
      [`${mockContext.workspacePath}/a-directory/index.md`]:
        'This is a markdown file',
    });
    jest.resetAllMocks();
  });

  it('should log the workspace content, if active', async () => {
    const context = {
      ...mockContext,
      input: {
        listWorkspace: true,
      },
    };

    await action.handler(context);

    expect(logger.info).toHaveBeenCalledWith(
      expect.stringContaining('README.md'),
    );
    expect(logger.info).toHaveBeenCalledWith(
      expect.stringContaining(join('a-directory', 'index.md')),
    );
  });

  it('should log message', async () => {
    const context = {
      ...mockContext,
      input: {
        message: 'Hello Backstage!',
      },
    };

    await action.handler(context);

    expect(logger.info).toHaveBeenCalledWith(
      expect.stringContaining('Hello Backstage!'),
    );
  });

  it('should log the workspace content from an example, if active', async () => {
    const example = action.examples?.find(
      sample => sample.description === 'List the workspace directory',
    )?.example as string;
    expect(typeof example).toEqual('string');
    const context = {
      ...mockContext,
      ...yaml.parse(example).steps[0],
    };

    await action.handler(context);

    expect(logger.info).toHaveBeenCalledWith(
      expect.stringContaining('README.md'),
    );
    expect(logger.info).toHaveBeenCalledWith(
      expect.stringContaining(join('a-directory', 'index.md')),
    );
  });

  it('should log the workspace content with file contents from an example, if active', async () => {
    const example = action.examples?.find(
      sample =>
        sample.description ===
        'List the workspace directory with file contents',
    )?.example as string;
    expect(typeof example).toEqual('string');
    const context = {
      ...mockContext,
      ...yaml.parse(example).steps[0],
    };

    await action.handler(context);

    expect(logger.info).toHaveBeenCalledWith(
      expect.stringContaining('README.md'),
    );
    expect(logger.info).toHaveBeenCalledWith(
      expect.stringContaining(join('a-directory', 'index.md')),
    );
    expect(logger.info).toHaveBeenCalledWith(
      expect.stringContaining('This is a README file'),
    );
    expect(logger.info).toHaveBeenCalledWith(
      expect.stringContaining('This is a markdown file'),
    );
  });

  it('should log message from an example', async () => {
    const example = action.examples?.find(
      sample => sample.description === 'Write a debug message',
    )?.example as string;

    const context = {
      ...mockContext,
      ...yaml.parse(example).steps[0],
    };

    await action.handler(context);

    expect(logger.info).toHaveBeenCalledWith(
      expect.stringContaining('Hello Backstage!'),
    );
  });
});
