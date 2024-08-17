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

import { ConfigReader } from '@backstage/config';
import { ScmIntegrations } from '@backstage/integration';
import { createMockActionContext } from '@backstage/plugin-scaffolder-node-test-utils';
import yaml from 'yaml';
import { createGitlabProjectVariableAction } from './gitlabProjectVariableCreate';
import { examples } from './gitlabProjectVariableCreate.examples';

const mockGitlabClient = {
  ProjectVariables: {
    create: jest.fn(),
  },
};
jest.mock('@gitbeaker/rest', () => ({
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
          apiBaseUrl: 'https://api.gitlab.com/api/v4',
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
      'MY_VARIABLE',
      'my_value',
      {
        variableType: 'env_var', // Correctly using variableType
        environmentScope: '*',
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
      'MY_VARIABLE',
      'my-file-content',
      {
        variableType: 'file', // Correctly using variableType
        protected: false,
        masked: false,
        raw: false,
        environmentScope: '*',
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
      'MY_VARIABLE',
      'my_value',
      {
        masked: false,
        raw: false,
        environmentScope: '*',
        variableType: 'env_var', // Correctly using variableType
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
      'DB_PASSWORD',
      'password123',
      {
        protected: false,
        raw: false,
        environmentScope: '*',
        variableType: 'env_var', // Correctly using variableType
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
      'MY_VARIABLE',
      'my_value',
      {
        protected: false,
        environmentScope: '*',
        variableType: 'env_var', // Correctly using variableType
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
      'MY_VARIABLE',
      'my_value',
      {
        protected: false,
        variableType: 'env_var', // Correctly using variableType
        masked: false,
        raw: false,
        environmentScope: 'production',
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
      'MY_VARIABLE',
      'my_value',
      {
        protected: false,
        variableType: 'env_var', // Correctly using variableType
        masked: false,
        raw: false,
        environmentScope: '*',
      },
    );
  });
});
