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

import { getRootLogger } from '@backstage/backend-common';
import { ConfigReader } from '@backstage/config';
import {
  GithubCredentialsProvider,
  ScmIntegrations,
} from '@backstage/integration';
import mockFs from 'mock-fs';
import os from 'os';
import { resolve as resolvePath } from 'path';
import { Writable } from 'stream';
import { ActionContext, TemplateAction } from '../../types';
import {
  createPublishGithubPullRequestAction,
  OctokitWithPullRequestPluginClient,
} from './githubPullRequest';

const root = os.platform() === 'win32' ? 'C:\\root' : '/root';
const workspacePath = resolvePath(root, 'my-workspace');

type GithubPullRequestActionInput = ReturnType<
  typeof createPublishGithubPullRequestAction
> extends TemplateAction<infer U>
  ? U
  : never;

describe('createPublishGithubPullRequestAction', () => {
  let instance: TemplateAction<GithubPullRequestActionInput>;
  let fakeClient: {
    createPullRequest: jest.Mock;
    rest: {
      pulls: { requestReviewers: jest.Mock };
    };
  };

  beforeEach(() => {
    const integrations = ScmIntegrations.fromConfig(new ConfigReader({}));
    fakeClient = {
      createPullRequest: jest.fn(async (_: any) => {
        return {
          url: 'https://api.github.com/myorg/myrepo/pull/123',
          headers: {},
          status: 201,
          data: {
            html_url: 'https://github.com/myorg/myrepo/pull/123',
            number: 123,
          },
        };
      }),
      rest: {
        pulls: {
          requestReviewers: jest.fn(async (_: any) => ({ data: {} })),
        },
      },
    };
    const clientFactory = jest.fn(
      async () => fakeClient as unknown as OctokitWithPullRequestPluginClient,
    );
    const githubCredentialsProvider: GithubCredentialsProvider = {
      getCredentials: jest.fn(),
    };

    instance = createPublishGithubPullRequestAction({
      integrations,
      githubCredentialsProvider,
      clientFactory,
    });
  });

  afterEach(() => {
    mockFs.restore();
    jest.resetAllMocks();
  });

  describe('with no sourcePath', () => {
    let input: GithubPullRequestActionInput;
    let ctx: ActionContext<GithubPullRequestActionInput>;

    beforeEach(() => {
      input = {
        repoUrl: 'github.com?owner=myorg&repo=myrepo',
        title: 'Create my new app',
        branchName: 'new-app',
        description: 'This PR is really good',
        draft: true,
      };

      mockFs({
        [workspacePath]: { 'file.txt': 'Hello there!' },
      });

      ctx = {
        createTemporaryDirectory: jest.fn(),
        output: jest.fn(),
        logger: getRootLogger(),
        logStream: new Writable(),
        input,
        workspacePath,
      };
    });

    it('creates a pull request', async () => {
      await instance.handler(ctx);

      expect(fakeClient.createPullRequest).toHaveBeenCalledWith({
        owner: 'myorg',
        repo: 'myrepo',
        title: 'Create my new app',
        head: 'new-app',
        body: 'This PR is really good',
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
    });

    it('creates outputs for the pull request url and number', async () => {
      await instance.handler(ctx);

      expect(ctx.output).toHaveBeenCalledWith(
        'remoteUrl',
        'https://github.com/myorg/myrepo/pull/123',
      );
      expect(ctx.output).toHaveBeenCalledWith('pullRequestNumber', 123);
    });
  });

  describe('with sourcePath', () => {
    let input: GithubPullRequestActionInput;
    let ctx: ActionContext<GithubPullRequestActionInput>;

    beforeEach(() => {
      input = {
        repoUrl: 'github.com?owner=myorg&repo=myrepo',
        title: 'Create my new app',
        branchName: 'new-app',
        description: 'This PR is really good',
        sourcePath: 'source',
      };

      mockFs({
        [workspacePath]: {
          source: { 'foo.txt': 'Hello there!' },
          irrelevant: { 'bar.txt': 'Nothing to see here' },
        },
      });

      ctx = {
        createTemporaryDirectory: jest.fn(),
        output: jest.fn(),
        logger: getRootLogger(),
        logStream: new Writable(),
        input,
        workspacePath,
      };
    });

    it('creates a pull request with only relevant files', async () => {
      await instance.handler(ctx);

      expect(fakeClient.createPullRequest).toHaveBeenCalledWith({
        owner: 'myorg',
        repo: 'myrepo',
        title: 'Create my new app',
        head: 'new-app',
        body: 'This PR is really good',
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
    });

    it('should not allow to use files outside of the workspace', async () => {
      input.sourcePath = '../../test';

      await expect(instance.handler(ctx)).rejects.toThrow(
        'Relative path is not allowed to refer to a directory outside its parent',
      );
    });
  });

  describe('with repoUrl', () => {
    let input: GithubPullRequestActionInput;
    let ctx: ActionContext<GithubPullRequestActionInput>;

    beforeEach(() => {
      input = {
        repoUrl: 'github.com?owner=myorg&repo=myrepo',
        title: 'Create my new app',
        branchName: 'new-app',
        description: 'This PR is really good',
      };

      mockFs({
        [workspacePath]: { 'file.txt': 'Hello there!' },
      });

      ctx = {
        createTemporaryDirectory: jest.fn(),
        output: jest.fn(),
        logger: getRootLogger(),
        logStream: new Writable(),
        input,
        workspacePath,
      };
    });
    it('creates a pull request', async () => {
      await instance.handler(ctx);

      expect(fakeClient.createPullRequest).toHaveBeenCalledWith({
        owner: 'myorg',
        repo: 'myrepo',
        title: 'Create my new app',
        head: 'new-app',
        body: 'This PR is really good',
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
    });

    it('creates outputs for the pull request url and number', async () => {
      await instance.handler(ctx);

      expect(ctx.output).toHaveBeenCalledWith(
        'remoteUrl',
        'https://github.com/myorg/myrepo/pull/123',
      );
      expect(ctx.output).toHaveBeenCalledWith('pullRequestNumber', 123);
    });
  });

  describe('with reviewers and teamReviewers', () => {
    let input: GithubPullRequestActionInput;
    let ctx: ActionContext<GithubPullRequestActionInput>;

    beforeEach(() => {
      input = {
        repoUrl: 'github.com?owner=myorg&repo=myrepo',
        title: 'Create my new app',
        branchName: 'new-app',
        description: 'This PR is really good',
        reviewers: ['foobar'],
        teamReviewers: ['team-foo'],
      };

      mockFs({ [workspacePath]: {} });

      ctx = {
        createTemporaryDirectory: jest.fn(),
        output: jest.fn(),
        logger: getRootLogger(),
        logStream: new Writable(),
        input,
        workspacePath,
      };
    });

    it('creates a pull request and requests a review from the given reviewers', async () => {
      await instance.handler(ctx);

      expect(fakeClient.createPullRequest).toHaveBeenCalled();
      expect(fakeClient.rest.pulls.requestReviewers).toHaveBeenCalledWith({
        owner: 'myorg',
        repo: 'myrepo',
        pull_number: 123,
        reviewers: ['foobar'],
        team_reviewers: ['team-foo'],
      });
    });

    it('creates outputs for the pull request url and number even if requesting reviewers fails', async () => {
      fakeClient.rest.pulls.requestReviewers.mockImplementation(() => {
        throw new Error('a random error');
      });

      await instance.handler(ctx);

      expect(ctx.output).toHaveBeenCalledWith(
        'remoteUrl',
        'https://github.com/myorg/myrepo/pull/123',
      );
      expect(ctx.output).toHaveBeenCalledWith('pullRequestNumber', 123);
    });
  });

  describe('with no reviewers and teamReviewers', () => {
    let input: GithubPullRequestActionInput;
    let ctx: ActionContext<GithubPullRequestActionInput>;

    beforeEach(() => {
      input = {
        repoUrl: 'github.com?owner=myorg&repo=myrepo',
        title: 'Create my new app',
        branchName: 'new-app',
        description: 'This PR is really good',
      };

      mockFs({ [workspacePath]: {} });

      ctx = {
        createTemporaryDirectory: jest.fn(),
        output: jest.fn(),
        logger: getRootLogger(),
        logStream: new Writable(),
        input,
        workspacePath,
      };
    });

    it('does not call the API endpoint for requesting reviewers', async () => {
      await instance.handler(ctx);

      expect(fakeClient.createPullRequest).toHaveBeenCalled();
      expect(fakeClient.rest.pulls.requestReviewers).not.toHaveBeenCalled();
    });
  });

  describe('with broken symlink', () => {
    let input: GithubPullRequestActionInput;
    let ctx: ActionContext<GithubPullRequestActionInput>;

    beforeEach(() => {
      input = {
        repoUrl: 'github.com?owner=myorg&repo=myrepo',
        title: 'Create my new app',
        branchName: 'new-app',
        description: 'This PR is really good',
      };

      mockFs({
        [workspacePath]: {
          Makefile: mockFs.symlink({
            path: '../../nothing/yet',
          }),
        },
      });

      ctx = {
        createTemporaryDirectory: jest.fn(),
        output: jest.fn(),
        logger: getRootLogger(),
        logStream: new Writable(),
        input,
        workspacePath,
      };
    });
    it('creates a pull request', async () => {
      await instance.handler(ctx);

      expect(fakeClient.createPullRequest).toHaveBeenCalledWith({
        owner: 'myorg',
        repo: 'myrepo',
        title: 'Create my new app',
        head: 'new-app',
        body: 'This PR is really good',
        changes: [
          {
            commit: 'Create my new app',
            files: {
              Makefile: {
                content: Buffer.from('../../nothing/yet').toString('utf-8'),
                encoding: 'utf-8',
                mode: '120000',
              },
            },
          },
        ],
      });
    });
  });

  describe('with executable file mode 755', () => {
    let input: GithubPullRequestActionInput;
    let ctx: ActionContext<GithubPullRequestActionInput>;

    beforeEach(() => {
      input = {
        repoUrl: 'github.com?owner=myorg&repo=myrepo',
        title: 'Create my new app',
        branchName: 'new-app',
        description: 'This PR is really good',
      };

      mockFs({
        [workspacePath]: {
          'hello.sh': mockFs.file({
            content: 'echo Hello there!',
            mode: 0o100755,
          }),
        },
      });

      ctx = {
        createTemporaryDirectory: jest.fn(),
        output: jest.fn(),
        logger: getRootLogger(),
        logStream: new Writable(),
        input,
        workspacePath,
      };
    });
    it('creates a pull request', async () => {
      await instance.handler(ctx);

      expect(fakeClient.createPullRequest).toHaveBeenCalledWith({
        owner: 'myorg',
        repo: 'myrepo',
        title: 'Create my new app',
        head: 'new-app',
        body: 'This PR is really good',
        changes: [
          {
            commit: 'Create my new app',
            files: {
              'hello.sh': {
                content: Buffer.from('echo Hello there!').toString('base64'),
                encoding: 'base64',
                mode: '100755',
              },
            },
          },
        ],
      });
    });

    it('creates outputs for the pull request url and number', async () => {
      await instance.handler(ctx);

      expect(ctx.output).toHaveBeenCalledWith(
        'remoteUrl',
        'https://github.com/myorg/myrepo/pull/123',
      );
      expect(ctx.output).toHaveBeenCalledWith('pullRequestNumber', 123);
    });
  });

  describe('with executable file mode 775', () => {
    let input: GithubPullRequestActionInput;
    let ctx: ActionContext<GithubPullRequestActionInput>;

    beforeEach(() => {
      input = {
        repoUrl: 'github.com?owner=myorg&repo=myrepo',
        title: 'Create my new app',
        branchName: 'new-app',
        description: 'This PR is really good',
      };

      mockFs({
        [workspacePath]: {
          'hello.sh': mockFs.file({
            content: 'echo Hello there!',
            mode: 0o100775,
          }),
        },
      });

      ctx = {
        createTemporaryDirectory: jest.fn(),
        output: jest.fn(),
        logger: getRootLogger(),
        logStream: new Writable(),
        input,
        workspacePath,
      };
    });
    it('creates a pull request', async () => {
      await instance.handler(ctx);

      expect(fakeClient.createPullRequest).toHaveBeenCalledWith({
        owner: 'myorg',
        repo: 'myrepo',
        title: 'Create my new app',
        head: 'new-app',
        body: 'This PR is really good',
        changes: [
          {
            commit: 'Create my new app',
            files: {
              'hello.sh': {
                content: Buffer.from('echo Hello there!').toString('base64'),
                encoding: 'base64',
                mode: '100755',
              },
            },
          },
        ],
      });
    });

    it('creates outputs for the pull request url and number', async () => {
      await instance.handler(ctx);

      expect(ctx.output).toHaveBeenCalledWith(
        'remoteUrl',
        'https://github.com/myorg/myrepo/pull/123',
      );
      expect(ctx.output).toHaveBeenCalledWith('pullRequestNumber', 123);
    });
  });
});
