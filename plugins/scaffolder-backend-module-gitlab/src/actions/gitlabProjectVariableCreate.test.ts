/*
 * Copyright 2026 The Backstage Authors
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
import { createGitlabProjectVariableAction } from './gitlabProjectVariableCreate';

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

describe('gitlab:projectVariable:create', () => {
  const config = new ConfigReader({
    integrations: {
      gitlab: [
        {
          host: 'gitlab.com',
          token: 'tokenlols',
          apiBaseUrl: 'https://api.gitlab.com',
        },
      ],
    },
  });

  const integrations = ScmIntegrations.fromConfig(config);
  const action = createGitlabProjectVariableAction({ integrations });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('creates a project variable and checkpoints without the secret value', async () => {
    const mockContext = createMockActionContext({
      input: {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        projectId: '123',
        key: 'MY_SECRET',
        value: 'super-secret-value',
        variableType: 'env_var',
        masked: true,
        environmentScope: 'production',
      },
    });
    const checkpointSpy = jest.spyOn(mockContext, 'checkpoint');

    mockGitlabClient.ProjectVariables.create.mockResolvedValue({});

    await action.handler(mockContext);

    expect(mockGitlabClient.ProjectVariables.create).toHaveBeenCalledWith(
      '123',
      'MY_SECRET',
      'super-secret-value',
      {
        variableType: 'env_var',
        protected: false,
        masked: true,
        masked_and_hidden: false,
        raw: false,
        environmentScope: 'production',
      },
    );

    expect(checkpointSpy).toHaveBeenCalledWith({
      key: 'create.project.variables.123.MY_SECRET.production',
      fn: expect.any(Function),
    });
    expect(checkpointSpy.mock.calls[0][0].key).not.toContain(
      'super-secret-value',
    );
  });

  it('uses the default environment scope in the checkpoint key', async () => {
    const mockContext = createMockActionContext({
      input: {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        projectId: 456,
        key: 'API_TOKEN',
        value: 'another-secret',
        variableType: 'env_var',
      },
    });
    const checkpointSpy = jest.spyOn(mockContext, 'checkpoint');

    mockGitlabClient.ProjectVariables.create.mockResolvedValue({});

    await action.handler(mockContext);

    expect(checkpointSpy).toHaveBeenCalledWith({
      key: 'create.project.variables.456.API_TOKEN.*',
      fn: expect.any(Function),
    });
    expect(checkpointSpy.mock.calls[0][0].key).not.toContain('another-secret');
  });
});
