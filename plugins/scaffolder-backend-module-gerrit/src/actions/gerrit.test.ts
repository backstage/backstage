/*
 * Copyright 2022 The Backstage Authors
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
    initRepoAndPush: jest.fn().mockResolvedValue({
      commitHash: '220f19cc36b551763d157f1b5e4a4b446165dbd6',
    }),
    commitAndPushRepo: jest.fn().mockResolvedValue({
      commitHash: '220f19cc36b551763d157f1b5e4a4b446165dbd6',
    }),
  };
});

import path from 'path';
import { createPublishGerritAction } from './gerrit';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { setupRequestMockHandlers } from '@backstage/backend-test-utils';
import { ScmIntegrations } from '@backstage/integration';
import { ConfigReader } from '@backstage/config';
import { getVoidLogger } from '@backstage/backend-common';
import { PassThrough } from 'stream';
import { initRepoAndPush } from '@backstage/plugin-scaffolder-node';

describe('publish:gerrit', () => {
  const config = new ConfigReader({
    integrations: {
      gerrit: [
        {
          host: 'gerrithost.org',
          username: 'gerrituser',
          password: 'usertoken',
        },
      ],
    },
  });

  const description = 'for the lols';
  const integrations = ScmIntegrations.fromConfig(config);
  const action = createPublishGerritAction({ integrations, config });
  const mockContext = {
    input: {
      repoUrl:
        'gerrithost.org?owner=owner&workspace=parent&project=project&repo=repo',
      description,
    },
    workspacePath: 'lol',
    logger: getVoidLogger(),
    logStream: new PassThrough(),
    output: jest.fn(),
    createTemporaryDirectory: jest.fn(),
  };
  const server = setupServer();
  setupRequestMockHandlers(server);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should throw an error when the repoUrl is not well formed', async () => {
    await expect(
      action.handler({
        ...mockContext,
        input: { repoUrl: 'gerrithost.org?workspace=w&owner=o', description },
      }),
    ).rejects.toThrow(/missing repo/);
  });

  it('should throw if there is no integration config provided', async () => {
    await expect(
      action.handler({
        ...mockContext,
        input: {
          repoUrl: 'missing.com?workspace=w&owner=o&repo=repo',
          description,
        },
      }),
    ).rejects.toThrow(/No matching integration configuration/);
  });

  it('can correctly create a new project', async () => {
    expect.assertions(5);
    server.use(
      rest.put('https://gerrithost.org/a/projects/repo', (req, res, ctx) => {
        expect(req.headers.get('Authorization')).toBe(
          'Basic Z2Vycml0dXNlcjp1c2VydG9rZW4=',
        );
        expect(req.body).toEqual({
          branches: ['master'],
          create_empty_commit: false,
          owners: ['owner'],
          description,
          parent: 'workspace',
        });
        return res(
          ctx.status(201),
          ctx.set('Content-Type', 'application/json'),
          ctx.json({}),
        );
      }),
    );

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        repoUrl: 'gerrithost.org?workspace=workspace&owner=owner&repo=repo',
      },
    });

    expect(initRepoAndPush).toHaveBeenCalledWith({
      dir: mockContext.workspacePath,
      remoteUrl: 'https://gerrithost.org/a/repo',
      defaultBranch: 'master',
      auth: { username: 'gerrituser', password: 'usertoken' },
      logger: mockContext.logger,
      commitMessage: expect.stringContaining('initial commit\n\nChange-Id:'),
      gitAuthorInfo: {},
    });

    expect(mockContext.output).toHaveBeenCalledWith(
      'remoteUrl',
      'https://gerrithost.org/a/repo',
    );
    expect(mockContext.output).toHaveBeenCalledWith(
      'repoContentsUrl',
      'https://gerrithost.org/repo/+/refs/heads/master',
    );
  });

  it('can correctly create a new project with a specific sourcePath', async () => {
    expect.assertions(5);
    server.use(
      rest.put('https://gerrithost.org/a/projects/repo', (req, res, ctx) => {
        expect(req.headers.get('Authorization')).toBe(
          'Basic Z2Vycml0dXNlcjp1c2VydG9rZW4=',
        );
        expect(req.body).toEqual({
          branches: ['master'],
          create_empty_commit: false,
          owners: ['owner'],
          description,
          parent: 'workspace',
        });
        return res(
          ctx.status(201),
          ctx.set('Content-Type', 'application/json'),
          ctx.json({}),
        );
      }),
    );

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        repoUrl: 'gerrithost.org?workspace=workspace&owner=owner&repo=repo',
        sourcePath: 'repository/',
      },
    });

    expect(initRepoAndPush).toHaveBeenCalledWith({
      dir: `${mockContext.workspacePath}${path.sep}repository${path.sep}`,
      remoteUrl: 'https://gerrithost.org/a/repo',
      defaultBranch: 'master',
      auth: { username: 'gerrituser', password: 'usertoken' },
      logger: mockContext.logger,
      commitMessage: expect.stringContaining('initial commit\n\nChange-Id:'),
      gitAuthorInfo: {},
    });

    expect(mockContext.output).toHaveBeenCalledWith(
      'remoteUrl',
      'https://gerrithost.org/a/repo',
    );
    expect(mockContext.output).toHaveBeenCalledWith(
      'repoContentsUrl',
      'https://gerrithost.org/repo/+/refs/heads/master',
    );
  });

  it('can correctly create a new project without specifying owner', async () => {
    expect.assertions(5);
    server.use(
      rest.put('https://gerrithost.org/a/projects/repo', (req, res, ctx) => {
        expect(req.headers.get('Authorization')).toBe(
          'Basic Z2Vycml0dXNlcjp1c2VydG9rZW4=',
        );
        expect(req.body).toEqual({
          branches: ['master'],
          create_empty_commit: false,
          owners: [],
          description,
          parent: 'workspace',
        });
        return res(
          ctx.status(201),
          ctx.set('Content-Type', 'application/json'),
          ctx.json({}),
        );
      }),
    );

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        repoUrl: 'gerrithost.org?workspace=workspace&repo=repo',
        sourcePath: 'repository/',
      },
    });

    expect(initRepoAndPush).toHaveBeenCalledWith({
      dir: `${mockContext.workspacePath}${path.sep}repository${path.sep}`,
      remoteUrl: 'https://gerrithost.org/a/repo',
      defaultBranch: 'master',
      auth: { username: 'gerrituser', password: 'usertoken' },
      logger: mockContext.logger,
      commitMessage: expect.stringContaining('initial commit\n\nChange-Id:'),
      gitAuthorInfo: {},
    });

    expect(mockContext.output).toHaveBeenCalledWith(
      'remoteUrl',
      'https://gerrithost.org/a/repo',
    );
    expect(mockContext.output).toHaveBeenCalledWith(
      'repoContentsUrl',
      'https://gerrithost.org/repo/+/refs/heads/master',
    );
  });

  it('can correctly create a new project with main as default branch', async () => {
    expect.assertions(5);
    server.use(
      rest.put('https://gerrithost.org/a/projects/repo', (req, res, ctx) => {
        expect(req.headers.get('Authorization')).toBe(
          'Basic Z2Vycml0dXNlcjp1c2VydG9rZW4=',
        );
        expect(req.body).toEqual({
          branches: ['main'],
          create_empty_commit: false,
          owners: [],
          description,
          parent: 'workspace',
        });
        return res(
          ctx.status(201),
          ctx.set('Content-Type', 'application/json'),
          ctx.json({}),
        );
      }),
    );

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        repoUrl: 'gerrithost.org?workspace=workspace&repo=repo',
        defaultBranch: 'main',
      },
    });

    expect(initRepoAndPush).toHaveBeenCalledWith({
      dir: mockContext.workspacePath,
      remoteUrl: 'https://gerrithost.org/a/repo',
      defaultBranch: 'main',
      auth: { username: 'gerrituser', password: 'usertoken' },
      logger: mockContext.logger,
      commitMessage: expect.stringContaining('initial commit\n\nChange-Id:'),
      gitAuthorInfo: {},
    });

    expect(mockContext.output).toHaveBeenCalledWith(
      'remoteUrl',
      'https://gerrithost.org/a/repo',
    );
    expect(mockContext.output).toHaveBeenCalledWith(
      'repoContentsUrl',
      'https://gerrithost.org/repo/+/refs/heads/main',
    );
  });

  it('should not create new projects on dryRun', async () => {
    await action.handler({
      ...mockContext,
      isDryRun: true,
      input: {
        ...mockContext.input,
        repoUrl: 'gerrithost.org?workspace=workspace&repo=repo',
        sourcePath: 'repository/',
      },
    });

    expect(mockContext.output).toHaveBeenCalledWith(
      'commitHash',
      'abcd-dry-run-1234',
    );
  });
  afterEach(() => {
    jest.resetAllMocks();
  });
});
