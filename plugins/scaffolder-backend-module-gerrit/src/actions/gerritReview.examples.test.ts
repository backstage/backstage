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

jest.mock('@backstage/plugin-scaffolder-node', () => {
  return {
    ...jest.requireActual('@backstage/plugin-scaffolder-node'),
    commitAndPushRepo: jest.fn(),
  };
});

import { createPublishGerritReviewAction } from './gerritReview';
import { ScmIntegrations } from '@backstage/integration';
import { ConfigReader } from '@backstage/config';
import { commitAndPushRepo } from '@backstage/plugin-scaffolder-node';
import { createMockActionContext } from '@backstage/plugin-scaffolder-node-test-utils';
import yaml from 'yaml';
import { examples } from './gerritReview.examples';

describe('publish:gerrit:review', () => {
  const config = new ConfigReader({
    integrations: {
      gerrit: [
        {
          host: 'gerrithost.org',
          gitilesBaseUrl: 'https://gerrithost.org/gitiles',
          username: 'gerrituser',
          password: 'usertoken',
        },
      ],
    },
  });

  const integrations = ScmIntegrations.fromConfig(config);
  const action = createPublishGerritReviewAction({ integrations, config });
  const mockContext = createMockActionContext({
    input: {
      repoUrl:
        'gerrithost.org?owner=owner&workspace=parent&project=project&repo=repo',
      gitCommitMessage: 'Review from backstage',
    },
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it(`Should ${examples[0].description}`, async () => {
    expect.assertions(3);

    const input = yaml.parse(examples[0].example).steps[0].input;
    await action.handler({
      ...mockContext,
      input,
    });

    expect(commitAndPushRepo).toHaveBeenCalledWith({
      dir: mockContext.workspacePath,
      auth: { username: 'gerrituser', password: 'usertoken' },
      logger: mockContext.logger,
      commitMessage: expect.stringContaining('Initial Commit Message'),
      gitAuthorInfo: {},
      branch: 'master',
      remoteRef: 'refs/for/master',
    });

    expect(mockContext.output).toHaveBeenCalledWith(
      'repoContentsUrl',
      'https://gerrithost.org/gitiles/repo/+/refs/heads/master',
    );
    expect(mockContext.output).toHaveBeenCalledWith(
      'reviewUrl',
      expect.stringMatching(new RegExp('^https://gerrithost.org/#/q/I')),
    );
  });

  it(`Should ${examples[1].description}`, async () => {
    expect.assertions(3);

    const input = yaml.parse(examples[1].example).steps[0].input;
    await action.handler({
      ...mockContext,
      input,
    });

    expect(commitAndPushRepo).toHaveBeenCalledWith({
      dir: mockContext.workspacePath,
      auth: { username: 'gerrituser', password: 'usertoken' },
      logger: mockContext.logger,
      commitMessage: expect.stringContaining('Initial Commit Message'),
      gitAuthorInfo: {
        email: undefined,
        name: 'Test User',
      },
      branch: 'master',
      remoteRef: 'refs/for/master',
    });

    expect(mockContext.output).toHaveBeenCalledWith(
      'repoContentsUrl',
      'https://gerrithost.org/gitiles/repo/+/refs/heads/master',
    );
    expect(mockContext.output).toHaveBeenCalledWith(
      'reviewUrl',
      expect.stringMatching(new RegExp('^https://gerrithost.org/#/q/I')),
    );
  });

  it(`Should ${examples[2].description}`, async () => {
    expect.assertions(3);

    const input = yaml.parse(examples[2].example).steps[0].input;
    await action.handler({
      ...mockContext,
      input,
    });

    expect(commitAndPushRepo).toHaveBeenCalledWith({
      dir: mockContext.workspacePath,
      auth: { username: 'gerrituser', password: 'usertoken' },
      logger: mockContext.logger,
      commitMessage: expect.stringContaining('Initial Commit Message'),
      gitAuthorInfo: {
        email: 'test.user@example.com',
        name: 'Test User',
      },
      branch: 'master',
      remoteRef: 'refs/for/master',
    });

    expect(mockContext.output).toHaveBeenCalledWith(
      'repoContentsUrl',
      'https://gerrithost.org/gitiles/repo/+/refs/heads/master',
    );
    expect(mockContext.output).toHaveBeenCalledWith(
      'reviewUrl',
      expect.stringMatching(new RegExp('^https://gerrithost.org/#/q/I')),
    );
  });

  it(`Should ${examples[3].description}`, async () => {
    expect.assertions(3);

    const input = yaml.parse(examples[3].example).steps[0].input;
    await action.handler({
      ...mockContext,
      input,
    });

    expect(commitAndPushRepo).toHaveBeenCalledWith({
      dir: mockContext.workspacePath,
      auth: { username: 'gerrituser', password: 'usertoken' },
      logger: mockContext.logger,
      commitMessage: expect.stringContaining('Initial Commit Message'),
      gitAuthorInfo: {},
      branch: 'develop',
      remoteRef: 'refs/for/develop',
    });

    expect(mockContext.output).toHaveBeenCalledWith(
      'repoContentsUrl',
      'https://gerrithost.org/gitiles/repo/+/refs/heads/develop',
    );
    expect(mockContext.output).toHaveBeenCalledWith(
      'reviewUrl',
      expect.stringMatching(new RegExp('^https://gerrithost.org/#/q/I')),
    );
  });

  it(`Should ${examples[4].description}`, async () => {
    expect.assertions(3);

    const input = yaml.parse(examples[4].example).steps[0].input;
    await action.handler({
      ...mockContext,
      input,
    });

    expect(commitAndPushRepo).toHaveBeenCalledWith({
      dir: `${mockContext.workspacePath}/src`,
      auth: { username: 'gerrituser', password: 'usertoken' },
      logger: mockContext.logger,
      commitMessage: expect.stringContaining('Initial Commit Message'),
      gitAuthorInfo: {},
      branch: 'master',
      remoteRef: 'refs/for/master',
    });

    expect(mockContext.output).toHaveBeenCalledWith(
      'repoContentsUrl',
      'https://gerrithost.org/gitiles/repo/+/refs/heads/master',
    );
    expect(mockContext.output).toHaveBeenCalledWith(
      'reviewUrl',
      expect.stringMatching(new RegExp('^https://gerrithost.org/#/q/I')),
    );
  });

  it(`Should ${examples[5].description}`, async () => {
    expect.assertions(3);

    const input = yaml.parse(examples[5].example).steps[0].input;
    await action.handler({
      ...mockContext,
      input,
    });

    expect(commitAndPushRepo).toHaveBeenCalledWith({
      dir: `${mockContext.workspacePath}/src`,
      auth: { username: 'gerrituser', password: 'usertoken' },
      logger: mockContext.logger,
      commitMessage: expect.stringContaining('Initial Commit Message'),
      gitAuthorInfo: {
        email: 'test.user@example.com',
        name: 'Test User',
      },
      branch: 'develop',
      remoteRef: 'refs/for/develop',
    });

    expect(mockContext.output).toHaveBeenCalledWith(
      'repoContentsUrl',
      'https://gerrithost.org/gitiles/repo/+/refs/heads/develop',
    );
    expect(mockContext.output).toHaveBeenCalledWith(
      'reviewUrl',
      expect.stringMatching(new RegExp('^https://gerrithost.org/#/q/I')),
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });
});
