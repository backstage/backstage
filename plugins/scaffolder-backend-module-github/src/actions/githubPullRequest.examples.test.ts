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

import { TemplateAction } from '@backstage/plugin-scaffolder-node';
import { ConfigReader } from '@backstage/config';
import {
  DefaultGithubCredentialsProvider,
  GithubCredentialsProvider,
  ScmIntegrations,
} from '@backstage/integration';
import { createMockActionContext } from '@backstage/plugin-scaffolder-node-test-utils';
import { createPublishGithubPullRequestAction } from './githubPullRequest';
import yaml from 'yaml';
import { examples } from './githubPullRequest.examples';
import { createMockDirectory } from '@backstage/backend-test-utils';

const mockOctokit = {
  rest: {
    pulls: {
      requestReviewers: jest.fn(),
    },
  },
};

jest.mock('octokit', () => ({
  Octokit: class {
    constructor() {
      return mockOctokit;
    }
  },
}));

describe('publish:github:pull-request examples', () => {
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

  const mockContext = createMockActionContext();
  let fakeClient: {
    createPullRequest: jest.Mock;
    rest: {
      pulls: { requestReviewers: jest.Mock };
    };
  };
  const mockDir = createMockDirectory();
  const workspacePath = mockDir.resolve('workspace');

  beforeEach(() => {
    mockDir.clear();
    jest.resetAllMocks();
    githubCredentialsProvider =
      DefaultGithubCredentialsProvider.fromIntegrations(integrations);
    fakeClient = {
      createPullRequest: jest.fn(async (_: any) => {
        return {
          url: 'https://api.github.com/myorg/myrepo/pull/123',
          headers: {},
          status: 201,
          data: {
            html_url: 'https://github.com/myorg/myrepo/pull/123',
            number: 123,
            base: {
              ref: 'main',
            },
          },
        };
      }),
      rest: {
        pulls: {
          requestReviewers: jest.fn(async (_: any) => ({ data: {} })),
        },
      },
    };

    const clientFactory = jest.fn(async () => fakeClient as any);

    mockDir.setContent({
      [workspacePath]: { 'file.txt': 'Hello there!' },
    });

    action = createPublishGithubPullRequestAction({
      integrations,
      githubCredentialsProvider,
      clientFactory,
      config,
    });
  });

  afterEach(jest.resetAllMocks);

  it('Create a pull request', async () => {
    const input = yaml.parse(examples[0].example).steps[0].input;

    await action.handler({
      ...mockContext,
      workspacePath,
      input,
    });

    expect(fakeClient.createPullRequest).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repo',
      title: 'Create my new app',
      body: 'This PR is really good',
      head: 'new-app',
      draft: undefined,
      changes: [
        {
          commit: 'Create my new app',
          files: {
            'file.txt': {
              content: Buffer.from('Hello there!').toString('base64'),
              encoding: 'base64',
              mode: '100644',
            },
          },
        },
      ],
    });
    expect(fakeClient.rest.pulls.requestReviewers).not.toHaveBeenCalled();
    expect(mockContext.output).toHaveBeenCalledTimes(3);
    expect(mockContext.output).toHaveBeenCalledWith('targetBranchName', 'main');
    expect(mockContext.output).toHaveBeenCalledWith(
      'remoteUrl',
      'https://github.com/myorg/myrepo/pull/123',
    );
    expect(mockContext.output).toHaveBeenCalledWith('pullRequestNumber', 123);
  });

  it('Create a pull request with target branch name', async () => {
    const input = yaml.parse(examples[1].example).steps[0].input;

    await action.handler({
      ...mockContext,
      workspacePath,
      input,
    });

    expect(fakeClient.createPullRequest).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repo',
      title: 'Create my new app',
      body: 'This PR is really good',
      head: 'new-app',
      draft: undefined,
      base: 'test',
      changes: [
        {
          commit: 'Create my new app',
          files: {
            'file.txt': {
              content: Buffer.from('Hello there!').toString('base64'),
              encoding: 'base64',
              mode: '100644',
            },
          },
        },
      ],
    });
    expect(fakeClient.rest.pulls.requestReviewers).not.toHaveBeenCalled();
    expect(mockContext.output).toHaveBeenCalledTimes(3);
    expect(mockContext.output).toHaveBeenCalledWith('targetBranchName', 'main');
    expect(mockContext.output).toHaveBeenCalledWith(
      'remoteUrl',
      'https://github.com/myorg/myrepo/pull/123',
    );
    expect(mockContext.output).toHaveBeenCalledWith('pullRequestNumber', 123);
  });

  it('Create a pull request as draft', async () => {
    const input = yaml.parse(examples[2].example).steps[0].input;

    await action.handler({
      ...mockContext,
      workspacePath,
      input,
    });

    expect(fakeClient.createPullRequest).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repo',
      title: 'Create my new app',
      body: 'This PR is really good',
      head: 'new-app',
      draft: true,
      changes: [
        {
          commit: 'Create my new app',
          files: {
            'file.txt': {
              content: Buffer.from('Hello there!').toString('base64'),
              encoding: 'base64',
              mode: '100644',
            },
          },
        },
      ],
    });
    expect(fakeClient.rest.pulls.requestReviewers).not.toHaveBeenCalled();
    expect(mockContext.output).toHaveBeenCalledTimes(3);
    expect(mockContext.output).toHaveBeenCalledWith('targetBranchName', 'main');
    expect(mockContext.output).toHaveBeenCalledWith(
      'remoteUrl',
      'https://github.com/myorg/myrepo/pull/123',
    );
    expect(mockContext.output).toHaveBeenCalledWith('pullRequestNumber', 123);
  });

  it('Create a pull request with target path', async () => {
    const input = yaml.parse(examples[3].example).steps[0].input;

    await action.handler({
      ...mockContext,
      workspacePath,
      input,
    });

    expect(fakeClient.createPullRequest).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repo',
      title: 'Create my new app',
      body: 'This PR is really good',
      head: 'new-app',
      draft: undefined,
      changes: [
        {
          commit: 'Create my new app',
          files: {
            'targetPath/file.txt': {
              content: Buffer.from('Hello there!').toString('base64'),
              encoding: 'base64',
              mode: '100644',
            },
          },
        },
      ],
    });

    expect(fakeClient.rest.pulls.requestReviewers).not.toHaveBeenCalled();
    expect(mockContext.output).toHaveBeenCalledTimes(3);
    expect(mockContext.output).toHaveBeenCalledWith('targetBranchName', 'main');
    expect(mockContext.output).toHaveBeenCalledWith(
      'remoteUrl',
      'https://github.com/myorg/myrepo/pull/123',
    );
    expect(mockContext.output).toHaveBeenCalledWith('pullRequestNumber', 123);
  });

  it('Create a pull request with source path', async () => {
    mockDir.setContent({
      [workspacePath]: {
        source: { 'foo.txt': 'Hello there!' },
        irrelevant: { 'bar.txt': 'Nothing to see here' },
      },
    });
    const input = yaml.parse(examples[4].example).steps[0].input;

    await action.handler({
      ...mockContext,
      workspacePath,
      input,
    });

    expect(fakeClient.createPullRequest).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repo',
      title: 'Create my new app',
      body: 'This PR is really good',
      head: 'new-app',
      draft: undefined,
      changes: [
        {
          commit: 'Create my new app',
          files: {
            'foo.txt': {
              content: Buffer.from('Hello there!').toString('base64'),
              encoding: 'base64',
              mode: '100644',
            },
          },
        },
      ],
    });

    expect(fakeClient.rest.pulls.requestReviewers).not.toHaveBeenCalled();
    expect(mockContext.output).toHaveBeenCalledTimes(3);
    expect(mockContext.output).toHaveBeenCalledWith('targetBranchName', 'main');
    expect(mockContext.output).toHaveBeenCalledWith(
      'remoteUrl',
      'https://github.com/myorg/myrepo/pull/123',
    );
    expect(mockContext.output).toHaveBeenCalledWith('pullRequestNumber', 123);
  });

  it('Create a pull request with token', async () => {
    const input = yaml.parse(examples[5].example).steps[0].input;

    await action.handler({
      ...mockContext,
      workspacePath,
      input,
    });

    expect(fakeClient.createPullRequest).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repo',
      title: 'Create my new app',
      body: 'This PR is really good',
      head: 'new-app',
      draft: undefined,
      changes: [
        {
          commit: 'Create my new app',
          files: {
            'file.txt': {
              content: Buffer.from('Hello there!').toString('base64'),
              encoding: 'base64',
              mode: '100644',
            },
          },
        },
      ],
    });

    expect(fakeClient.rest.pulls.requestReviewers).not.toHaveBeenCalled();
    expect(mockContext.output).toHaveBeenCalledTimes(3);
    expect(mockContext.output).toHaveBeenCalledWith('targetBranchName', 'main');
    expect(mockContext.output).toHaveBeenCalledWith(
      'remoteUrl',
      'https://github.com/myorg/myrepo/pull/123',
    );
    expect(mockContext.output).toHaveBeenCalledWith('pullRequestNumber', 123);
  });

  it('Create a pull request with reviewers', async () => {
    const input = yaml.parse(examples[6].example).steps[0].input;

    await action.handler({
      ...mockContext,
      workspacePath,
      input,
    });

    expect(fakeClient.createPullRequest).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repo',
      title: 'Create my new app',
      body: 'This PR is really good',
      head: 'new-app',
      draft: undefined,
      changes: [
        {
          commit: 'Create my new app',
          files: {
            'file.txt': {
              content: Buffer.from('Hello there!').toString('base64'),
              encoding: 'base64',
              mode: '100644',
            },
          },
        },
      ],
    });

    expect(fakeClient.rest.pulls.requestReviewers).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repo',
      pull_number: 123,
      reviewers: ['foobar'],
    });

    expect(mockContext.output).toHaveBeenCalledTimes(3);
    expect(mockContext.output).toHaveBeenCalledWith('targetBranchName', 'main');
    expect(mockContext.output).toHaveBeenCalledWith(
      'remoteUrl',
      'https://github.com/myorg/myrepo/pull/123',
    );
    expect(mockContext.output).toHaveBeenCalledWith('pullRequestNumber', 123);
  });

  it('Create a pull request with team reviewers', async () => {
    const input = yaml.parse(examples[7].example).steps[0].input;

    await action.handler({
      ...mockContext,
      workspacePath,
      input,
    });

    expect(fakeClient.createPullRequest).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repo',
      title: 'Create my new app',
      body: 'This PR is really good',
      head: 'new-app',
      draft: undefined,
      changes: [
        {
          commit: 'Create my new app',
          files: {
            'file.txt': {
              content: Buffer.from('Hello there!').toString('base64'),
              encoding: 'base64',
              mode: '100644',
            },
          },
        },
      ],
    });

    expect(fakeClient.rest.pulls.requestReviewers).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repo',
      pull_number: 123,
      team_reviewers: ['team-foo'],
    });

    expect(mockContext.output).toHaveBeenCalledTimes(3);
    expect(mockContext.output).toHaveBeenCalledWith('targetBranchName', 'main');
    expect(mockContext.output).toHaveBeenCalledWith(
      'remoteUrl',
      'https://github.com/myorg/myrepo/pull/123',
    );
    expect(mockContext.output).toHaveBeenCalledWith('pullRequestNumber', 123);
  });

  it('Create a pull request with commit message', async () => {
    const input = yaml.parse(examples[8].example).steps[0].input;

    await action.handler({
      ...mockContext,
      workspacePath,
      input,
    });

    expect(fakeClient.createPullRequest).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repo',
      title: 'Create my new app',
      body: 'This PR is really good',
      head: 'new-app',
      draft: undefined,
      changes: [
        {
          commit: 'Custom commit message',
          files: {
            'file.txt': {
              content: Buffer.from('Hello there!').toString('base64'),
              encoding: 'base64',
              mode: '100644',
            },
          },
        },
      ],
    });

    expect(fakeClient.rest.pulls.requestReviewers).not.toHaveBeenCalled();
    expect(mockContext.output).toHaveBeenCalledTimes(3);
    expect(mockContext.output).toHaveBeenCalledWith('targetBranchName', 'main');
    expect(mockContext.output).toHaveBeenCalledWith(
      'remoteUrl',
      'https://github.com/myorg/myrepo/pull/123',
    );
    expect(mockContext.output).toHaveBeenCalledWith('pullRequestNumber', 123);
  });

  it('Create a pull request with a git author name and email', async () => {
    const input = yaml.parse(examples[9].example).steps[0].input;

    await action.handler({
      ...mockContext,
      workspacePath,
      input,
    });

    expect(fakeClient.createPullRequest).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repo',
      title: 'Create my new app',
      body: 'This PR is really good',
      head: 'new-app',
      draft: undefined,
      changes: [
        {
          commit: 'Create my new app',
          files: {
            'file.txt': {
              content: Buffer.from('Hello there!').toString('base64'),
              encoding: 'base64',
              mode: '100644',
            },
          },
          author: {
            email: 'foo@bar.example',
            name: 'Foo Bar',
          },
        },
      ],
    });

    expect(fakeClient.rest.pulls.requestReviewers).not.toHaveBeenCalled();
    expect(mockContext.output).toHaveBeenCalledTimes(3);
    expect(mockContext.output).toHaveBeenCalledWith('targetBranchName', 'main');
    expect(mockContext.output).toHaveBeenCalledWith(
      'remoteUrl',
      'https://github.com/myorg/myrepo/pull/123',
    );
    expect(mockContext.output).toHaveBeenCalledWith('pullRequestNumber', 123);
  });

  it('Create a pull request with a git author name', async () => {
    const input = yaml.parse(examples[10].example).steps[0].input;

    await action.handler({
      ...mockContext,
      workspacePath,
      input,
    });

    expect(fakeClient.createPullRequest).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repo',
      title: 'Create my new app',
      body: 'This PR is really good',
      head: 'new-app',
      draft: undefined,
      changes: [
        {
          commit: 'Create my new app',
          files: {
            'file.txt': {
              content: Buffer.from('Hello there!').toString('base64'),
              encoding: 'base64',
              mode: '100644',
            },
          },
          author: {
            email: 'scaffolder@backstage.io',
            name: 'Foo Bar',
          },
        },
      ],
    });

    expect(fakeClient.rest.pulls.requestReviewers).not.toHaveBeenCalled();
    expect(mockContext.output).toHaveBeenCalledTimes(3);
    expect(mockContext.output).toHaveBeenCalledWith('targetBranchName', 'main');
    expect(mockContext.output).toHaveBeenCalledWith(
      'remoteUrl',
      'https://github.com/myorg/myrepo/pull/123',
    );
    expect(mockContext.output).toHaveBeenCalledWith('pullRequestNumber', 123);
  });

  it('Create a pull request with a git author email', async () => {
    const input = yaml.parse(examples[11].example).steps[0].input;

    await action.handler({
      ...mockContext,
      workspacePath,
      input,
    });

    expect(fakeClient.createPullRequest).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repo',
      title: 'Create my new app',
      body: 'This PR is really good',
      head: 'new-app',
      draft: undefined,
      changes: [
        {
          commit: 'Create my new app',
          files: {
            'file.txt': {
              content: Buffer.from('Hello there!').toString('base64'),
              encoding: 'base64',
              mode: '100644',
            },
          },
          author: {
            email: 'foo@bar.example',
            name: 'Scaffolder',
          },
        },
      ],
    });

    expect(fakeClient.rest.pulls.requestReviewers).not.toHaveBeenCalled();
    expect(mockContext.output).toHaveBeenCalledTimes(3);
    expect(mockContext.output).toHaveBeenCalledWith('targetBranchName', 'main');
    expect(mockContext.output).toHaveBeenCalledWith(
      'remoteUrl',
      'https://github.com/myorg/myrepo/pull/123',
    );
    expect(mockContext.output).toHaveBeenCalledWith('pullRequestNumber', 123);
  });

  it('Does not create an empty pull request', async () => {
    const input = yaml.parse(examples[12].example).steps[0].input;

    await action.handler({
      ...mockContext,
      workspacePath,
      input,
    });

    expect(fakeClient.createPullRequest).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repo',
      title: 'Create my new app',
      body: 'This PR is really good',
      head: 'new-app',
      draft: undefined,
      createWhenEmpty: false,
      changes: [
        {
          commit: 'Create my new app',
          files: {
            'file.txt': {
              content: Buffer.from('Hello there!').toString('base64'),
              encoding: 'base64',
              mode: '100644',
            },
          },
        },
      ],
    });

    expect(fakeClient.rest.pulls.requestReviewers).not.toHaveBeenCalled();
    expect(mockContext.output).toHaveBeenCalledTimes(3);
    expect(mockContext.output).toHaveBeenCalledWith('targetBranchName', 'main');
    expect(mockContext.output).toHaveBeenCalledWith(
      'remoteUrl',
      'https://github.com/myorg/myrepo/pull/123',
    );
    expect(mockContext.output).toHaveBeenCalledWith('pullRequestNumber', 123);
  });

  it('Create a pull request with all parameters', async () => {
    mockDir.setContent({
      [workspacePath]: {
        source: { 'foo.txt': 'Hello there!' },
        irrelevant: { 'bar.txt': 'Nothing to see here' },
      },
    });
    const input = yaml.parse(examples[13].example).steps[0].input;

    await action.handler({
      ...mockContext,
      workspacePath,
      input,
    });

    expect(fakeClient.createPullRequest).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repo',
      title: 'Create my new app',
      body: 'This PR is really good',
      head: 'new-app',
      base: 'test',
      draft: true,
      createWhenEmpty: true,
      changes: [
        {
          commit: 'Commit for foo changes',
          files: {
            'targetPath/foo.txt': {
              content: Buffer.from('Hello there!').toString('base64'),
              encoding: 'base64',
              mode: '100644',
            },
          },
          author: {
            email: 'foo@bar.example',
            name: 'Foo Bar',
          },
        },
      ],
    });

    expect(fakeClient.rest.pulls.requestReviewers).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repo',
      pull_number: 123,
      reviewers: ['foobar'],
      team_reviewers: ['team-foo'],
    });

    expect(mockContext.output).toHaveBeenCalledTimes(3);
    expect(mockContext.output).toHaveBeenCalledWith('targetBranchName', 'main');
    expect(mockContext.output).toHaveBeenCalledWith(
      'remoteUrl',
      'https://github.com/myorg/myrepo/pull/123',
    );
    expect(mockContext.output).toHaveBeenCalledWith('pullRequestNumber', 123);
  });
});
