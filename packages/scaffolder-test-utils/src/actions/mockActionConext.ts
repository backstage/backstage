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

/**
 * A utility method to create a mock action context for scaffolder actions.
 *
 * @param input - a schema for user input parameters
 *
 * @public
 */
export const createMockActionContext = <
  TActionInput extends JsonObject = JsonObject,
  TActionOutput extends JsonObject = JsonObject,
>(
  input?: TActionInput,
): ActionContext<TActionInput, TActionOutput> => {
  const mockDir = createMockDirectory();

  return {
    workspacePath: mockDir.path,
    logger: getVoidLogger(),
    logStream: new PassThrough(),
    output: jest.fn(),
    createTemporaryDirectory: jest.fn(),
    input: (input ? input : {}) as TActionInput,
  };
};
