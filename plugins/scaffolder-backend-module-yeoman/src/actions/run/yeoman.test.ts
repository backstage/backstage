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

import { yeomanRun } from './yeomanRun';

jest.mock('./yeomanRun');

import { createMockActionContext } from '@backstage/plugin-scaffolder-node-test-utils';
import os from 'os';
import { createRunYeomanAction } from './yeoman';
import type { ActionContext } from '@backstage/plugin-scaffolder-node';
import { JsonObject } from '@backstage/types';

describe('run:yeoman', () => {
  const mockTmpDir = os.tmpdir();

  let mockContext: ActionContext<{
    namespace: string;
    args?: string[];
    options?: JsonObject;
  }>;

  const action = createRunYeomanAction();

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should call yeomanRun with the correct variables', async () => {
    const namespace = 'whatever:app';
    const args = ['aa', 'bb'];
    const options = {
      code: 'owner',
    };
    mockContext = createMockActionContext({
      input: {
        namespace,
        args,
        options,
      },
      workspacePath: mockTmpDir,
    });

    await action.handler(mockContext);
    expect(yeomanRun).toHaveBeenCalledWith(
      mockTmpDir,
      namespace,
      args,
      options,
    );
  });
});
