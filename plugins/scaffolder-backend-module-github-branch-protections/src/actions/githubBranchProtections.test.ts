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

import { createGithubBranchProtectionsAction } from './githubBranchProtections';
import {
  ScmIntegrations,
  DefaultGithubCredentialsProvider,
  GithubCredentialsProvider,
} from '@backstage/integration';
import { ConfigReader } from '@backstage/config';
import { getVoidLogger } from '@backstage/backend-common';
import { TemplateAction } from '@backstage/plugin-scaffolder-node';
import { PassThrough } from 'stream';

const mockOctokit = {
  graphql: jest.fn(),
};

jest.mock('octokit', () => ({
  Octokit: class {
    constructor() {
      return mockOctokit;
    }
  },
}));

describe('github:branchprotections', () => {
  const config = new ConfigReader({
    integrations: {
      github: [
        { host: 'github.com', token: 'tokenlols' },
        { host: 'ghe.github.com' },
      ],
    },
  });

  const integrations = ScmIntegrations.fromConfig(config);
  let githubCredentialsProvider: GithubCredentialsProvider;
  let action: TemplateAction<any>;

  beforeEach(() => {
    jest.resetAllMocks();
    githubCredentialsProvider =
      DefaultGithubCredentialsProvider.fromIntegrations(integrations);
    action = createGithubBranchProtectionsAction({
      integrations,
      config,
      githubCredentialsProvider,
    });
  });

  const mockContext = {
    input: {
      repoUrl: 'github.com?repo=repo&owner=owner',
      branches: ['release/*'],
    },
    logger: getVoidLogger(),
    logStream: new PassThrough(),
    workspacePath: 'lol',
    output: jest.fn(),
    createTemporaryDirectory: jest.fn(),
  };

  it('should validate input', async () => {
    const Validator = require('jsonschema').Validator;
    const v = new Validator();

    // validate default input without events specified
    expect(v.validate(mockContext.input, action.schema?.input).valid).toBe(
      true,
    );
  });

  it('should call the githubApi for creating repository branch protections', async () => {
    const repoUrl = 'github.com?repo=repo&owner=owner';
    const branches = ['release/*', 'master'];
    const ctx = Object.assign({}, mockContext, {
      input: { repoUrl, branches },
    });

    const repository = { repository: { id: 'anId' } };
    mockOctokit.graphql.mockReturnValueOnce(repository);

    await action.handler(ctx);

    expect(mockOctokit.graphql).toHaveBeenCalled();
  });

  it('should reformat repository name where spaces are converted to dashes', async () => {
    const repoUrl = 'github.com?repo=repo name&owner=owner';
    const branches = ['release/*', 'master'];
    const ctx = Object.assign({}, mockContext, {
      input: { repoUrl, branches },
    });

    const repository = { repository: { id: 'anId' } };
    mockOctokit.graphql.mockReturnValueOnce(repository);

    await action.handler(ctx);

    expect(mockOctokit.graphql).toHaveBeenCalledWith(`
        {
          repository(followRenames: true, owner:"owner", name:"repo-name") {
            id
          }
        }
      `);
  });

  it('should fail if repository is missing', async () => {
    const repoUrl = 'github.com?repo=repo&owner=owner';
    const branches = ['release/*', 'master'];
    const ctx = Object.assign({}, mockContext, {
      input: { repoUrl, branches },
    });

    const repository = { error: 'anError' };
    mockOctokit.graphql.mockReturnValueOnce(repository);

    await expect(action.handler(ctx)).rejects.toThrow(
      'Input repository does not exist',
    );
  });

  it('should fail without branches', async () => {
    const repoUrl = 'github.com?repo=repo&owner=owner';
    const ctx = Object.assign({}, mockContext, {
      input: { repoUrl },
    });

    await expect(action.handler(ctx)).rejects.toThrow(
      'The branches field is empty',
    );

    expect(mockOctokit.graphql).not.toHaveBeenCalled();
  });

  it('should fail with empty branches input', async () => {
    const repoUrl = 'github.com?repo=repo&owner=owner';
    const branches: string[] = [];
    const ctx = Object.assign({}, mockContext, {
      input: { repoUrl, branches },
    });

    await expect(action.handler(ctx)).rejects.toThrow(
      'The branches field is empty',
    );

    expect(mockOctokit.graphql).not.toHaveBeenCalled();
  });

  it('should fail without an owner', async () => {
    const repoUrl = 'github.com?repo=repo';
    const ctx = Object.assign({}, mockContext, {
      input: { repoUrl },
    });

    await expect(action.handler(ctx)).rejects.toThrow(
      'Invalid repo URL passed to publisher: https://github.com/?repo=repo, missing owner',
    );

    expect(mockOctokit.graphql).not.toHaveBeenCalled();
  });
});
