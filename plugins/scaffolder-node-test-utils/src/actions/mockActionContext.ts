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

import { PassThrough } from 'stream';
import { loggerToWinstonLogger } from '@backstage/backend-common';
import {
  createMockDirectory,
  mockCredentials,
  mockServices,
} from '@backstage/backend-test-utils';
import { JsonObject } from '@backstage/types';
import { ActionContext } from '@backstage/plugin-scaffolder-node';

/**
 * A utility method to create a mock action context for scaffolder actions.
 *
 * @public
 * @param options - optional parameters to override default mock context
 */
export const createMockActionContext = <
  TActionInput extends JsonObject = JsonObject,
  TActionOutput extends JsonObject = JsonObject,
>(
  options?: Partial<ActionContext<TActionInput, TActionOutput>>,
): ActionContext<TActionInput, TActionOutput> => {
  const credentials = mockCredentials.user();
  const defaultContext = {
    logger: loggerToWinstonLogger(mockServices.logger.mock()),
    logStream: new PassThrough(),
    output: jest.fn(),
    createTemporaryDirectory: jest.fn(),
    input: {} as TActionInput,
    checkpoint: jest.fn(),
    getInitiatorCredentials: () => Promise.resolve(credentials),
    task: {
      id: 'mock-task-id',
    },
  };

  const createDefaultWorkspace = () => ({
    workspacePath: createMockDirectory().resolve('workspace'),
  });

  if (!options) {
    return {
      ...defaultContext,
      ...createDefaultWorkspace(),
    };
  }

  const {
    input,
    logger,
    logStream,
    secrets,
    templateInfo,
    workspacePath,
    task,
  } = options;

  return {
    ...defaultContext,
    ...(workspacePath ? { workspacePath } : createDefaultWorkspace()),
    ...(workspacePath && {
      createTemporaryDirectory: jest.fn().mockResolvedValue(workspacePath),
    }),
    ...(logger && { logger }),
    ...(logStream && { logStream }),
    ...(input && { input }),
    ...(secrets && { secrets }),
    ...(task && { task }),
    templateInfo,
  };
};
