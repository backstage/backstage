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
import { createGitlabUserInfoAction } from './gitlabUserInfo';
import { mockServices } from '@backstage/backend-test-utils';

const mockGitlabClient = {
  Users: {
    show: jest.fn(),
    showCurrentUser: jest.fn(),
  },
};
jest.mock('@gitbeaker/rest', () => ({
  Gitlab: class {
    constructor() {
      return mockGitlabClient;
    }
  },
}));

describe('gitlab:user:info', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const config = mockServices.rootConfig({
    data: {
      integrations: {
        gitlab: [
          {
            host: 'gitlab.com',
            token: 'myIntegrationsToken',
            apiBaseUrl: 'https://gitlab.com/api/v4',
          },
        ],
      },
    },
  });
  const integrations = ScmIntegrations.fromConfig(config);

  const action = createGitlabUserInfoAction({ integrations });

  it('should return current user info when no userId is specified', async () => {
    const mockContext = createMockActionContext({
      input: {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
      },
      workspacePath: '/tmp/workspace',
    });

    mockGitlabClient.Users.showCurrentUser.mockResolvedValue({
      id: 1,
      username: 'johndoe',
      name: 'John Doe',
      state: 'active',
      web_url: 'https://gitlab.com/johndoe',
      email: 'john@example.com',
      created_at: '2020-01-01T00:00:00Z',
      public_email: 'john.public@example.com',
    });

    await action.handler(mockContext);

    expect(mockGitlabClient.Users.showCurrentUser).toHaveBeenCalled();
    expect(mockGitlabClient.Users.show).not.toHaveBeenCalled();

    expect(mockContext.output).toHaveBeenCalledWith('id', 1);
    expect(mockContext.output).toHaveBeenCalledWith('username', 'johndoe');
    expect(mockContext.output).toHaveBeenCalledWith('name', 'John Doe');
    expect(mockContext.output).toHaveBeenCalledWith('state', 'active');
    expect(mockContext.output).toHaveBeenCalledWith(
      'webUrl',
      'https://gitlab.com/johndoe',
    );
    expect(mockContext.output).toHaveBeenCalledWith(
      'email',
      'john@example.com',
    );
    expect(mockContext.output).toHaveBeenCalledWith(
      'createdAt',
      '2020-01-01T00:00:00Z',
    );
    expect(mockContext.output).toHaveBeenCalledWith(
      'publicEmail',
      'john.public@example.com',
    );
  });

  it('should return user info when userId is specified', async () => {
    const mockContext = createMockActionContext({
      input: {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        userId: 123,
      },
      workspacePath: '/tmp/workspace',
    });

    mockGitlabClient.Users.show.mockResolvedValue({
      id: 123,
      username: 'janedoe',
      name: 'Jane Doe',
      state: 'active',
      web_url: 'https://gitlab.com/janedoe',
    });

    await action.handler(mockContext);

    expect(mockGitlabClient.Users.show).toHaveBeenCalledWith(123);
    expect(mockGitlabClient.Users.showCurrentUser).not.toHaveBeenCalled();

    expect(mockContext.output).toHaveBeenCalledWith('id', 123);
    expect(mockContext.output).toHaveBeenCalledWith('username', 'janedoe');
    expect(mockContext.output).toHaveBeenCalledWith('name', 'Jane Doe');
    expect(mockContext.output).toHaveBeenCalledWith('state', 'active');
    expect(mockContext.output).toHaveBeenCalledWith(
      'webUrl',
      'https://gitlab.com/janedoe',
    );
  });

  it('should work with a custom token', async () => {
    const mockContext = createMockActionContext({
      input: {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        token: 'custom-oauth-token',
      },
      workspacePath: '/tmp/workspace',
    });

    mockGitlabClient.Users.showCurrentUser.mockResolvedValue({
      id: 1,
      username: 'johndoe',
      name: 'John Doe',
      state: 'active',
      web_url: 'https://gitlab.com/johndoe',
    });

    await action.handler(mockContext);

    expect(mockGitlabClient.Users.showCurrentUser).toHaveBeenCalled();
    expect(mockContext.output).toHaveBeenCalledWith('id', 1);
  });

  it('should handle minimal user response', async () => {
    const mockContext = createMockActionContext({
      input: {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        userId: 456,
      },
      workspacePath: '/tmp/workspace',
    });

    mockGitlabClient.Users.show.mockResolvedValue({
      id: 456,
      username: 'minimaluser',
      name: 'Minimal User',
      state: 'blocked',
      web_url: 'https://gitlab.com/minimaluser',
    });

    await action.handler(mockContext);

    expect(mockContext.output).toHaveBeenCalledWith('id', 456);
    expect(mockContext.output).toHaveBeenCalledWith('username', 'minimaluser');
    expect(mockContext.output).toHaveBeenCalledWith('name', 'Minimal User');
    expect(mockContext.output).toHaveBeenCalledWith('state', 'blocked');
    expect(mockContext.output).toHaveBeenCalledWith(
      'webUrl',
      'https://gitlab.com/minimaluser',
    );
    // Optional fields should not be output if not present
    expect(mockContext.output).not.toHaveBeenCalledWith(
      'email',
      expect.anything(),
    );
  });

  it('should throw an error when the API call fails', async () => {
    const mockContext = createMockActionContext({
      input: {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        userId: 999,
      },
      workspacePath: '/tmp/workspace',
    });

    mockGitlabClient.Users.show.mockRejectedValue(new Error('User not found'));

    await expect(action.handler(mockContext)).rejects.toThrow(
      'Failed to retrieve GitLab user info: Error: User not found',
    );
  });
});
