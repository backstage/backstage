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

import { yeomanRun } from './yeomanRun';

jest.mock('./yeomanRun');

import { createMockActionContext } from '@backstage/plugin-scaffolder-node-test-utils';
import os from 'os';
import { createRunYeomanAction } from './yeoman';
import type { ActionContext } from '@backstage/plugin-scaffolder-node';
import { JsonObject } from '@backstage/types';
import yaml from 'yaml';
import { examples } from './yeoman.examples';

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

  it(`should ${examples[0].description}`, async () => {
    const namespace = yaml.parse(examples[0].example).steps[0].input.namespace;
    const input = yaml.parse(examples[0].example).steps[0].input;
    mockContext = createMockActionContext({
      input: input,
      workspacePath: mockTmpDir,
    });

    await action.handler(mockContext);
    expect(yeomanRun).toHaveBeenCalledWith(
      mockTmpDir,
      namespace,
      undefined,
      undefined,
    );
  });

  it(`should ${examples[1].description}`, async () => {
    const namespace = yaml.parse(examples[1].example).steps[0].input.namespace;
    const input = yaml.parse(examples[1].example).steps[0].input;
    const args: string[] = yaml.parse(examples[1].example).steps[0].input.args;
    mockContext = createMockActionContext({
      input: input,
      workspacePath: mockTmpDir,
    });

    await action.handler(mockContext);
    expect(yeomanRun).toHaveBeenCalledWith(
      mockTmpDir,
      namespace,
      args,
      undefined,
    );
  });

  it(`should ${examples[2].description}`, async () => {
    const namespace = yaml.parse(examples[2].example).steps[0].input.namespace;
    const input = yaml.parse(examples[2].example).steps[0].input;
    const options = yaml.parse(examples[2].example).steps[0].input.options;
    mockContext = createMockActionContext({
      input: input,
      workspacePath: mockTmpDir,
    });

    await action.handler(mockContext);
    expect(yeomanRun).toHaveBeenCalledWith(
      mockTmpDir,
      namespace,
      undefined,
      options,
    );
  });

  it(`should ${examples[3].description}`, async () => {
    const namespace = yaml.parse(examples[3].example).steps[0].input.namespace;
    const input = yaml.parse(examples[3].example).steps[0].input;
    const options = yaml.parse(examples[3].example).steps[0].input.options;
    const args: string[] = yaml.parse(examples[1].example).steps[0].input.args;
    mockContext = createMockActionContext({
      input: input,
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
