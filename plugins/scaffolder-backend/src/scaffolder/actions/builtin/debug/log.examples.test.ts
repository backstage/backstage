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
import { createDebugLogAction } from './log';
import { join } from 'path';
import yaml from 'yaml';
import { examples } from './log.examples';
import { createMockDirectory } from '@backstage/backend-test-utils';
import { Logger } from 'winston';

describe('debug:log examples', () => {
  const logger = {
    info: jest.fn(),
  } as unknown as jest.Mocked<Logger>;

  const mockDir = createMockDirectory();
  const workspacePath = mockDir.resolve('workspace');

  const mockContext = createMockActionContext({
    logger,
    workspacePath,
  });

  const action = createDebugLogAction();

  beforeEach(() => {
    mockDir.setContent({
      [`${workspacePath}/README.md`]: '',
      [`${workspacePath}/a-directory/index.md`]: '',
    });
    jest.resetAllMocks();
  });

  it('should log message', async () => {
    await action.handler({
      ...mockContext,
      input: yaml.parse(examples[0].example).steps[0].input,
    });

    expect(logger.info).toHaveBeenCalledWith(
      expect.stringContaining('Hello Backstage!'),
    );
  });

  it('should log the workspace content, if active', async () => {
    await action.handler({
      ...mockContext,
      input: yaml.parse(examples[1].example).steps[0].input,
    });

    expect(logger.info).toHaveBeenCalledWith(
      expect.stringContaining('README.md'),
    );
    expect(logger.info).toHaveBeenCalledWith(
      expect.stringContaining(join('a-directory', 'index.md')),
    );
  });
});
