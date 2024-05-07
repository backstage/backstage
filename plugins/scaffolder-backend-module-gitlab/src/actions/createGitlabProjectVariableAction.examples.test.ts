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

import { createGitlabProjectVariableAction } from './createGitlabProjectVariableAction';
import { createMockActionContext } from '@backstage/plugin-scaffolder-node-test-utils';
import { ScmIntegrations } from '@backstage/integration';
import { ConfigReader } from '@backstage/config';
import yaml from 'yaml';
import { examples } from './createGitlabProjectVariableAction.examples';

const mockGitlabClient = {
  ProjectVariables: {
    create: jest.fn(),
  },
};
jest.mock('@gitbeaker/node', () => ({
  Gitlab: class {
    constructor() {
      return mockGitlabClient;
    }
  },
}));

describe('gitlab:projectVariableAction: create examples', () => {
  const config = new ConfigReader({
    integrations: {
      gitlab: [
        {
          host: 'gitlab.com',
          token: 'tokenlols',
          apiBaseUrl: 'https://api.gitlab.com',
        },
        {
          host: 'hosted.gitlab.com',
          apiBaseUrl: 'https://api.hosted.gitlab.com',
        },
      ],
    },
  });

  const integrations = ScmIntegrations.fromConfig(config);
  const action = createGitlabProjectVariableAction({ integrations });
  const mockContext = createMockActionContext({
    input: {
      repoUrl: 'gitlab.com?repo=repo&owner=owner',
      projectId: '123',
      key: 'MY_VARIABLE',
      value: 'my_value',
      variableType: 'env_var',
    },
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it(`Should ${examples[0].description}`, async () => {
    mockGitlabClient.ProjectVariables.create.mockResolvedValue({
      token: 'TOKEN',
    });

    await action.handler({
      ...mockContext,
      input: yaml.parse(examples[0].example).steps[0].input,
    });

    expect(mockGitlabClient.ProjectVariables.create).toHaveBeenCalledWith(
      '123',
      {
        key: 'MY_VARIABLE',
        value: 'my_value',
        variable_type: 'env_var',
        environment_scope: '*',
        masked: false,
        protected: false,
        raw: false,
      },
    );
  });
  it(`Should ${examples[1].description}`, async () => {
    mockGitlabClient.ProjectVariables.create.mockResolvedValue({
      token: 'TOKEN',
    });

    await action.handler({
      ...mockContext,
      input: yaml.parse(examples[1].example).steps[0].input,
    });

    expect(mockGitlabClient.ProjectVariables.create).toHaveBeenCalledWith(
      '123',
      {
        key: 'MY_VARIABLE',
        value: 'my-file-content',
        protected: false,
        masked: false,
        raw: false,
        environment_scope: '*',
        variable_type: 'file',
      },
    );
  });

  it(`Should ${examples[2].description}`, async () => {
    mockGitlabClient.ProjectVariables.create.mockResolvedValue({
      token: 'TOKEN',
    });

    await action.handler({
      ...mockContext,
      input: yaml.parse(examples[2].example).steps[0].input,
    });

    expect(mockGitlabClient.ProjectVariables.create).toHaveBeenCalledWith(
      '456',
      {
        key: 'MY_VARIABLE',
        value: 'my_value',
        masked: false,
        raw: false,
        environment_scope: '*',
        variable_type: 'env_var',
        protected: true,
      },
    );
  });

  it(`Should ${examples[3].description}`, async () => {
    mockGitlabClient.ProjectVariables.create.mockResolvedValue({
      token: 'TOKEN',
    });

    await action.handler({
      ...mockContext,
      input: yaml.parse(examples[3].example).steps[0].input,
    });

    expect(mockGitlabClient.ProjectVariables.create).toHaveBeenCalledWith(
      '789',
      {
        key: 'DB_PASSWORD',
        value: 'password123',
        protected: false,
        raw: false,
        environment_scope: '*',
        variable_type: 'env_var',
        masked: true,
      },
    );
  });

  it(`Should ${examples[4].description}`, async () => {
    mockGitlabClient.ProjectVariables.create.mockResolvedValue({
      token: 'TOKEN',
    });

    await action.handler({
      ...mockContext,
      input: yaml.parse(examples[4].example).steps[0].input,
    });

    expect(mockGitlabClient.ProjectVariables.create).toHaveBeenCalledWith(
      '123',
      {
        key: 'MY_VARIABLE',
        value: 'my_value',
        protected: false,
        environment_scope: '*',
        variable_type: 'env_var',
        masked: false,
        raw: true,
      },
    );
  });

  it(`Should ${examples[5].description}`, async () => {
    mockGitlabClient.ProjectVariables.create.mockResolvedValue({
      token: 'TOKEN',
    });

    await action.handler({
      ...mockContext,
      input: yaml.parse(examples[5].example).steps[0].input,
    });

    expect(mockGitlabClient.ProjectVariables.create).toHaveBeenCalledWith(
      '123',
      {
        key: 'MY_VARIABLE',
        value: 'my_value',
        protected: false,
        variable_type: 'env_var',
        masked: false,
        raw: false,
        environment_scope: 'production',
      },
    );
  });

  it(`Should ${examples[6].description}`, async () => {
    mockGitlabClient.ProjectVariables.create.mockResolvedValue({
      token: 'TOKEN',
    });

    await action.handler({
      ...mockContext,
      input: yaml.parse(examples[6].example).steps[0].input,
    });

    expect(mockGitlabClient.ProjectVariables.create).toHaveBeenCalledWith(
      '123',
      {
        key: 'MY_VARIABLE',
        value: 'my_value',
        protected: false,
        variable_type: 'env_var',
        masked: false,
        raw: false,
        environment_scope: '*',
      },
    );
  });
});
