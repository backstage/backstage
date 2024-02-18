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
import { getVoidLogger } from '@backstage/backend-common';
import { createMockDirectory } from '@backstage/backend-test-utils';
import { JsonObject } from '@backstage/types';
import { ActionContext } from '@backstage/plugin-scaffolder-node';
import * as winston from 'winston';
import { TemplateInfo } from '@backstage/plugin-scaffolder-common';

/**
 * A utility method to create a mock action context for scaffolder actions.
 *
 *
 *
 * @public
 * @param options
 */
export const createMockActionContext = <
  TActionInput extends JsonObject = JsonObject,
  TActionOutput extends JsonObject = JsonObject,
>(options?: {
  input?: TActionInput;
  workspacePath?: string;
  logger?: winston.Logger;
  templateInfo?: TemplateInfo;
}): ActionContext<TActionInput, TActionOutput> => {
  const defaultContext = {
    logger: getVoidLogger(),
    logStream: new PassThrough(),
    output: jest.fn(),
    createTemporaryDirectory: jest.fn(),
    input: {} as TActionInput,
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

  const { input, workspacePath, logger, templateInfo } = options;
  return {
    ...defaultContext,
    ...(workspacePath ? { workspacePath } : createDefaultWorkspace()),
    ...(logger && { logger }),
    ...(input && { input }),
    templateInfo,
  };
};
