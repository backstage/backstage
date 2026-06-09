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

import { ScmIntegrations } from '@backstage/integration';
import { createMockActionContext } from '@backstage/plugin-scaffolder-node-test-utils';
import yaml from 'yaml';
import { createGitlabRepoExistsAction } from './gitlabRepoExists';
import { examples } from './gitlabRepoExists.examples';
import { mockServices } from '@backstage/backend-test-utils';

const mockGitlabClient = {
  Projects: {
    show: jest.fn(),
  },
};

jest.mock('@gitbeaker/rest', () => ({
  Gitlab: class {
    constructor() {
      return mockGitlabClient;
    }
  },
}));

describe('gitlab:repo:exists examples', () => {
  const mockContext = createMockActionContext();

  const config = mockServices.rootConfig({
    data: {
      integrations: {
        gitlab: [
          {
            host: 'gitlab.com',
            token: 'tokenlols',
            apiBaseUrl: 'https://gitlab.com/api/v4',
          },
        ],
      },
    },
  });
  const integrations = ScmIntegrations.fromConfig(config);
  const action = createGitlabRepoExistsAction({ integrations });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it(`Should ${examples[0].description}`, async () => {
    mockGitlabClient.Projects.show.mockResolvedValue({
      id: 1,
      path_with_namespace: 'group_name/project_name',
    });

    await action.handler({
      ...mockContext,
      input: yaml.parse(examples[0].example).steps[0].input,
    });

    expect(mockGitlabClient.Projects.show).toHaveBeenCalledWith(
      'group_name/project_name',
    );
    expect(mockContext.output).toHaveBeenCalledWith('exists', true);
  });

  it(`Should ${examples[1].description}`, async () => {
    mockGitlabClient.Projects.show.mockResolvedValue({
      id: 1,
      path_with_namespace: 'group_name/project_name',
    });

    await action.handler({
      ...mockContext,
      input: yaml.parse(examples[1].example).steps[0].input,
    });

    expect(mockGitlabClient.Projects.show).toHaveBeenCalledWith(
      'group_name/project_name',
    );
    expect(mockContext.output).toHaveBeenCalledWith('exists', true);
  });

  it(`Should ${examples[2].description}`, async () => {
    mockGitlabClient.Projects.show.mockRejectedValue({
      cause: { response: { status: 404 } },
    });

    await action.handler({
      ...mockContext,
      input: yaml.parse(examples[2].example).steps[0].input,
    });

    expect(mockGitlabClient.Projects.show).toHaveBeenCalledWith(
      'group_name/project_name',
    );
    expect(mockContext.output).toHaveBeenCalledWith('exists', false);
  });
});
