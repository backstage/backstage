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
import { createGitlabRepoExistsAction } from './gitlabRepoExists';
import { getClient } from '../util';
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

jest.mock('../util', () => ({
  getClient: jest.fn().mockImplementation(() => mockGitlabClient),
  parseRepoUrl: () => ({ host: 'gitlab.com', owner: 'owner', repo: 'repo' }),
}));

describe('gitlab:repo:exists', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

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
  const mockContext = createMockActionContext();

  it('should output exists true when the repository exists', async () => {
    mockGitlabClient.Projects.show.mockResolvedValue({
      id: 1,
      path_with_namespace: 'owner/repo',
    });

    await action.handler({
      ...mockContext,
      input: {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
      },
    });

    expect(mockGitlabClient.Projects.show).toHaveBeenCalledWith('owner/repo');
    expect(mockContext.output).toHaveBeenCalledWith('exists', true);
  });

  it('should output exists false when the repository does not exist', async () => {
    mockGitlabClient.Projects.show.mockRejectedValue({
      cause: { response: { status: 404 } },
    });

    await expect(
      action.handler({
        ...mockContext,
        input: {
          repoUrl: 'gitlab.com?repo=repo&owner=owner',
        },
      }),
    ).resolves.toBeUndefined();

    expect(mockContext.output).toHaveBeenCalledWith('exists', false);
  });

  it('should rethrow non-404 errors', async () => {
    mockGitlabClient.Projects.show.mockRejectedValue({
      cause: { response: { status: 500 } },
    });

    await expect(
      action.handler({
        ...mockContext,
        input: {
          repoUrl: 'gitlab.com?repo=repo&owner=owner',
        },
      }),
    ).rejects.toEqual({ cause: { response: { status: 500 } } });
  });

  it('should use the token from the integration config when none is provided', async () => {
    mockGitlabClient.Projects.show.mockResolvedValue({
      id: 1,
      full_path: 'foobar',
    });

    await action.handler({
      ...mockContext,
      input: {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
      },
    });

    expect(getClient).toHaveBeenCalledWith(
      expect.not.objectContaining({
        token: expect.anything(),
      }),
    );
  });

  it('should use a provided token as bearer authentication', async () => {
    mockGitlabClient.Projects.show.mockResolvedValue({
      id: 1,
      full_path: 'foobar',
    });

    await action.handler({
      ...mockContext,
      input: {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        token: 'mysecrettoken',
      },
    });

    expect(getClient).toHaveBeenCalledWith(
      expect.objectContaining({
        token: 'mysecrettoken',
      }),
    );
  });
});
