/*
 * Copyright 2023 The Backstage Authors
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

import { ConfigReader } from '@backstage/config';
import {
  ActionInput,
  createCopierFetchAction,
} from './createCopierFetchAction';
import { ContainerRunner, getVoidLogger } from '@backstage/backend-common';
import { ActionContext } from '@backstage/plugin-scaffolder-node';
import { PassThrough } from 'stream';
import { CopierRunner } from './CopierRunner';
import { z } from 'zod';

describe('createCopierFetchAction', () => {
  const containerRunner: jest.Mocked<ContainerRunner> = {
    runContainer: jest.fn(),
  };
  const action = createCopierFetchAction({
    config: new ConfigReader({}),
    containerRunner,
  });

  const mockCopierRunner: jest.Mocked<CopierRunner> = {
    run: jest.fn(),
  } as any as jest.Mocked<CopierRunner>;

  let mockContext: ActionContext<z.infer<typeof ActionInput>>;

  beforeEach(() => {
    jest.resetAllMocks();
    jest.spyOn(CopierRunner, 'fromConfig').mockReturnValue(mockCopierRunner);
    mockContext = {
      input: {
        url: 'https://www.google.com/template',
        values: {},
      },
      output: jest.fn(),
      workspacePath: '/tmp',
      logger: getVoidLogger(),
      logStream: new PassThrough(),
      createTemporaryDirectory: jest.fn().mockResolvedValue('/tmp'),
    };
  });

  it('should infer the template name from the url', async () => {
    await action.handler(mockContext);
    expect(mockCopierRunner.run).toHaveBeenCalledWith({
      answerFileDirectory: '/tmp',
      values: {},
      args: {
        answerFile: '.template-answers.yaml',
        url: 'https://www.google.com/template',
        pretend: undefined,
      },
    });
  });
  it.each([
    { url: 'https://www.github.com' },
    { url: 'https://www.github.com/.' },
    { url: 'https://www.github.com/..' },
    { url: 'https://www.github.com/tree' },
    { url: 'https://www.github.com/tree/main' },
    { url: 'https://www.github.com/tree/master' },
    { url: 'https://www.github.com/tree/HEAD' },
  ])(
    'should prevent the user from using hard-to-infer urls: $url',
    async ({ url }) => {
      mockContext.input.url = url;
      await expect(action.handler(mockContext)).rejects.toThrow(
        /Could not infer answerfile name from url/,
      );
    },
  );
  it('should allow users to specify a custom name for the answerfile', async () => {
    mockContext.input.answerFile = 'custom.yaml';
    await action.handler(mockContext);
    expect(mockCopierRunner.run).toHaveBeenCalledWith({
      answerFileDirectory: '/tmp',
      values: {},
      args: {
        answerFile: 'custom.yaml',
        url: 'https://www.google.com/template',
        pretend: undefined,
      },
    });
  });
  it('should allow the user to supply a directory to store answerfiles', async () => {
    mockContext.input.answerFileDirectory = '/tmp/answers';
    await action.handler(mockContext);
    expect(mockCopierRunner.run).toHaveBeenCalledWith({
      answerFileDirectory: '/tmp/answers',
      values: {},
      args: {
        answerFile: '.template-answers.yaml',
        url: 'https://www.google.com/template',
        pretend: undefined,
      },
    });
  });
});
