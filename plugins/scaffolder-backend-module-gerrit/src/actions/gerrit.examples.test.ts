/*
 * Copyright 2024 The Backstage Authors
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
      commitHash: '460f19cc36b551763d157f1b5e4a4b446165dbb8',
    }),
    commitAndPushRepo: jest.fn().mockResolvedValue({
      commitHash: '460f19cc36b551763d157f1b5e4a4b446165dbb8',
    }),
  };
});

import path from 'path';
import { createPublishGerritAction } from './gerrit';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { registerMswTestHooks } from '@backstage/backend-test-utils';
import { ScmIntegrations } from '@backstage/integration';
import { ConfigReader } from '@backstage/config';
import { initRepoAndPush } from '@backstage/plugin-scaffolder-node';
import { createMockActionContext } from '@backstage/plugin-scaffolder-node-test-utils';
import { examples } from './gerrit.examples';
import yaml from 'yaml';

describe('publish:gerrit', () => {
  const config = new ConfigReader({
    integrations: {
      gerrit: [
        {
          host: 'gerrit.com',
          gitilesBaseUrl: 'https://gerrit.com/gitiles',
          username: 'demouser',
          password: 'accesstoken',
        },
      ],
    },
  });

  const description = 'sample description';
  const integrations = ScmIntegrations.fromConfig(config);
  const action = createPublishGerritAction({ integrations, config });
  const mockContext = createMockActionContext({
    input: {
      repoUrl:
        'gerrit.com?owner=owner&workspace=parent&project=project&repo=repo',
      description,
    },
  });
  const server = setupServer();
  registerMswTestHooks(server);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it(`should ${examples[0].description}`, async () => {
    expect.assertions(5);
    server.use(
      rest.put('https://gerrit.com/a/projects/repo', (req, res, ctx) => {
        expect(req.headers.get('Authorization')).toBe(
          'Basic ZGVtb3VzZXI6YWNjZXNzdG9rZW4=',
        );
        expect(req.body).toEqual({
          branches: ['master'],
          create_empty_commit: false,
          owners: ['owner'],
          description,
          parent: 'parent',
        });
        return res(
          ctx.status(201),
          ctx.set('Content-Type', 'application/json'),
          ctx.json({}),
        );
      }),
    );

    const suffixPath = '&workspace=parent&project=test-project';
    let input;
    try {
      input = yaml.parse(examples[0].example).steps[0].input;
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...input,
        repoUrl: input.repoUrl + suffixPath,
      },
    });

    expect(initRepoAndPush).toHaveBeenCalledWith({
      dir: mockContext.workspacePath,
      remoteUrl: 'https://gerrit.com/a/repo',
      defaultBranch: 'master',
      auth: { username: 'demouser', password: 'accesstoken' },
      logger: mockContext.logger,
      commitMessage: expect.stringContaining('initial commit\n\nChange-Id:'),
      gitAuthorInfo: {},
    });

    expect(mockContext.output).toHaveBeenCalledWith(
      'remoteUrl',
      'https://gerrit.com/a/repo',
    );
    expect(mockContext.output).toHaveBeenCalledWith(
      'repoContentsUrl',
      'https://gerrit.com/gitiles/repo/+/refs/heads/master',
    );
  });

  it(`should ${examples[1].description}`, async () => {
    expect.assertions(5);
    server.use(
      rest.put('https://gerrit.com/a/projects/repo', (req, res, ctx) => {
        expect(req.headers.get('Authorization')).toBe(
          'Basic ZGVtb3VzZXI6YWNjZXNzdG9rZW4=',
        );
        expect(req.body).toEqual({
          branches: ['master'],
          create_empty_commit: false,
          owners: ['owner'],
          description: yaml.parse(examples[1].example).steps[0].input
            .description,
          parent: 'parent',
        });
        return res(
          ctx.status(201),
          ctx.set('Content-Type', 'application/json'),
          ctx.json({}),
        );
      }),
    );

    const suffixPath = '&workspace=parent&project=test-project';
    let input;
    try {
      input = yaml.parse(examples[1].example).steps[0].input;
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...input,
        repoUrl: input.repoUrl + suffixPath,
      },
    });

    expect(initRepoAndPush).toHaveBeenCalledWith({
      dir: mockContext.workspacePath,
      remoteUrl: 'https://gerrit.com/a/repo',
      defaultBranch: 'master',
      auth: { username: 'demouser', password: 'accesstoken' },
      logger: mockContext.logger,
      commitMessage: expect.stringContaining('initial commit\n\nChange-Id:'),
      gitAuthorInfo: {},
    });
    expect(mockContext.output).toHaveBeenCalledWith(
      'remoteUrl',
      'https://gerrit.com/a/repo',
    );
    expect(mockContext.output).toHaveBeenCalledWith(
      'repoContentsUrl',
      'https://gerrit.com/gitiles/repo/+/refs/heads/master',
    );
  });

  it(`should ${examples[2].description}`, async () => {
    expect.assertions(5);
    server.use(
      rest.put('https://gerrit.com/a/projects/repo', (req, res, ctx) => {
        expect(req.headers.get('Authorization')).toBe(
          'Basic ZGVtb3VzZXI6YWNjZXNzdG9rZW4=',
        );
        expect(req.body).toEqual({
          branches: ['staging'],
          create_empty_commit: false,
          owners: ['owner'],
          description,
          parent: 'parent',
        });
        return res(
          ctx.status(201),
          ctx.set('Content-Type', 'application/json'),
          ctx.json({}),
        );
      }),
    );

    const suffixPath = '&workspace=parent&project=test-project';
    let input;
    try {
      input = yaml.parse(examples[2].example).steps[0].input;
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...input,
        repoUrl: input.repoUrl + suffixPath,
      },
    });

    expect(initRepoAndPush).toHaveBeenCalledWith({
      dir: mockContext.workspacePath,
      remoteUrl: 'https://gerrit.com/a/repo',
      defaultBranch: 'staging',
      auth: { username: 'demouser', password: 'accesstoken' },
      logger: mockContext.logger,
      commitMessage: expect.stringContaining('initial commit\n\nChange-Id:'),
      gitAuthorInfo: {},
    });
    expect(mockContext.output).toHaveBeenCalledWith(
      'remoteUrl',
      'https://gerrit.com/a/repo',
    );
    expect(mockContext.output).toHaveBeenCalledWith(
      'repoContentsUrl',
      'https://gerrit.com/gitiles/repo/+/refs/heads/staging',
    );
  });

  it(`should ${examples[3].description}`, async () => {
    expect.assertions(5);
    server.use(
      rest.put('https://gerrit.com/a/projects/repo', (req, res, ctx) => {
        expect(req.headers.get('Authorization')).toBe(
          'Basic ZGVtb3VzZXI6YWNjZXNzdG9rZW4=',
        );
        expect(req.body).toEqual({
          branches: ['master'],
          create_empty_commit: false,
          owners: ['owner'],
          description,
          parent: 'parent',
        });
        return res(
          ctx.status(201),
          ctx.set('Content-Type', 'application/json'),
          ctx.json({}),
        );
      }),
    );

    const suffixPath = '&workspace=parent&project=test-project';
    let input;
    try {
      input = yaml.parse(examples[3].example).steps[0].input;
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...input,
        repoUrl: input.repoUrl + suffixPath,
      },
    });

    expect(initRepoAndPush).toHaveBeenCalledWith({
      dir: mockContext.workspacePath,
      remoteUrl: 'https://gerrit.com/a/repo',
      defaultBranch: 'master',
      auth: { username: 'demouser', password: 'accesstoken' },
      logger: mockContext.logger,
      commitMessage: expect.stringContaining(
        'Initial Commit Message\n\nChange-Id:',
      ),
      gitAuthorInfo: {},
    });

    expect(mockContext.output).toHaveBeenCalledWith(
      'remoteUrl',
      'https://gerrit.com/a/repo',
    );
    expect(mockContext.output).toHaveBeenCalledWith(
      'repoContentsUrl',
      'https://gerrit.com/gitiles/repo/+/refs/heads/master',
    );
  });

  it(`should ${examples[4].description}`, async () => {
    expect.assertions(5);
    server.use(
      rest.put('https://gerrit.com/a/projects/repo', (req, res, ctx) => {
        expect(req.headers.get('Authorization')).toBe(
          'Basic ZGVtb3VzZXI6YWNjZXNzdG9rZW4=',
        );
        expect(req.body).toEqual({
          branches: ['master'],
          create_empty_commit: false,
          owners: ['owner'],
          description,
          parent: 'parent',
        });
        return res(
          ctx.status(201),
          ctx.set('Content-Type', 'application/json'),
          ctx.json({}),
        );
      }),
    );

    const suffixPath = '&workspace=parent&project=test-project';
    let input;
    try {
      input = yaml.parse(examples[4].example).steps[0].input;
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...input,
        repoUrl: input.repoUrl + suffixPath,
      },
    });

    expect(initRepoAndPush).toHaveBeenCalledWith({
      dir: mockContext.workspacePath,
      remoteUrl: 'https://gerrit.com/a/repo',
      defaultBranch: 'master',
      auth: { username: 'demouser', password: 'accesstoken' },
      logger: mockContext.logger,
      commitMessage: expect.stringContaining('initial commit\n\nChange-Id:'),
      gitAuthorInfo: { name: 'John Doe' },
    });

    expect(mockContext.output).toHaveBeenCalledWith(
      'remoteUrl',
      'https://gerrit.com/a/repo',
    );
    expect(mockContext.output).toHaveBeenCalledWith(
      'repoContentsUrl',
      'https://gerrit.com/gitiles/repo/+/refs/heads/master',
    );
  });

  it(`should ${examples[5].description}`, async () => {
    expect.assertions(5);
    server.use(
      rest.put('https://gerrit.com/a/projects/repo', (req, res, ctx) => {
        expect(req.headers.get('Authorization')).toBe(
          'Basic ZGVtb3VzZXI6YWNjZXNzdG9rZW4=',
        );
        expect(req.body).toEqual({
          branches: ['master'],
          create_empty_commit: false,
          owners: ['owner'],
          description,
          parent: 'parent',
        });
        return res(
          ctx.status(201),
          ctx.set('Content-Type', 'application/json'),
          ctx.json({}),
        );
      }),
    );

    const suffixPath = '&workspace=parent&project=test-project';
    let input;
    try {
      input = yaml.parse(examples[5].example).steps[0].input;
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...input,
        repoUrl: input.repoUrl + suffixPath,
      },
    });

    expect(initRepoAndPush).toHaveBeenCalledWith({
      dir: mockContext.workspacePath,
      remoteUrl: 'https://gerrit.com/a/repo',
      defaultBranch: 'master',
      auth: { username: 'demouser', password: 'accesstoken' },
      logger: mockContext.logger,
      commitMessage: expect.stringContaining('initial commit\n\nChange-Id:'),
      gitAuthorInfo: { email: 'johndoe@email.com' },
    });

    expect(mockContext.output).toHaveBeenCalledWith(
      'remoteUrl',
      'https://gerrit.com/a/repo',
    );
    expect(mockContext.output).toHaveBeenCalledWith(
      'repoContentsUrl',
      'https://gerrit.com/gitiles/repo/+/refs/heads/master',
    );
  });

  it(`should ${examples[6].description}`, async () => {
    expect.assertions(5);
    server.use(
      rest.put('https://gerrit.com/a/projects/repo', (req, res, ctx) => {
        expect(req.headers.get('Authorization')).toBe(
          'Basic ZGVtb3VzZXI6YWNjZXNzdG9rZW4=',
        );
        expect(req.body).toEqual({
          branches: ['master'],
          create_empty_commit: false,
          owners: ['owner'],
          description,
          parent: 'parent',
        });
        return res(
          ctx.status(201),
          ctx.set('Content-Type', 'application/json'),
          ctx.json({}),
        );
      }),
    );

    const suffixPath = '&workspace=parent&project=test-project';
    let input;
    try {
      input = yaml.parse(examples[6].example).steps[0].input;
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...input,
        repoUrl: input.repoUrl + suffixPath,
      },
    });

    expect(initRepoAndPush).toHaveBeenCalledWith({
      dir: `${mockContext.workspacePath}${path.sep}repository${path.sep}`,
      remoteUrl: 'https://gerrit.com/a/repo',
      defaultBranch: 'master',
      auth: { username: 'demouser', password: 'accesstoken' },
      logger: mockContext.logger,
      commitMessage: expect.stringContaining('initial commit\n\nChange-Id:'),
      gitAuthorInfo: {},
    });

    expect(mockContext.output).toHaveBeenCalledWith(
      'remoteUrl',
      'https://gerrit.com/a/repo',
    );
    expect(mockContext.output).toHaveBeenCalledWith(
      'repoContentsUrl',
      'https://gerrit.com/gitiles/repo/+/refs/heads/master',
    );
  });

  it(`should ${examples[7].description}`, async () => {
    expect.assertions(5);
    server.use(
      rest.put('https://gerrit.com/a/projects/repo', (req, res, ctx) => {
        expect(req.headers.get('Authorization')).toBe(
          'Basic ZGVtb3VzZXI6YWNjZXNzdG9rZW4=',
        );
        expect(req.body).toEqual({
          branches: ['staging'],
          create_empty_commit: false,
          owners: ['owner'],
          description: 'Initialize a gerrit repository',
          parent: 'parent',
        });
        return res(
          ctx.status(201),
          ctx.set('Content-Type', 'application/json'),
          ctx.json({}),
        );
      }),
    );

    const suffixPath = '&workspace=parent&project=test-project';
    let input;
    try {
      input = yaml.parse(examples[7].example).steps[0].input;
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...input,
        repoUrl: input.repoUrl + suffixPath,
      },
    });

    expect(initRepoAndPush).toHaveBeenCalledWith({
      dir: `${mockContext.workspacePath}${path.sep}repository${path.sep}`,
      remoteUrl: 'https://gerrit.com/a/repo',
      defaultBranch: 'staging',
      auth: { username: 'demouser', password: 'accesstoken' },
      logger: mockContext.logger,
      commitMessage: expect.stringContaining(
        'Initial Commit Message\n\nChange-Id:',
      ),
      gitAuthorInfo: { name: 'John Doe', email: 'johndoe@email.com' },
    });

    expect(mockContext.output).toHaveBeenCalledWith(
      'remoteUrl',
      'https://gerrit.com/a/repo',
    );
    expect(mockContext.output).toHaveBeenCalledWith(
      'repoContentsUrl',
      'https://gerrit.com/gitiles/repo/+/refs/heads/staging',
    );
  });

  it('should not create new projects on dryRun', async () => {
    await action.handler({
      ...mockContext,
      isDryRun: true,
      input: {
        ...mockContext.input,
        repoUrl: 'gerrit.com?workspace=workspace&repo=repo',
        sourcePath: 'repository/',
      },
    });

    expect(mockContext.output).toHaveBeenCalledWith(
      'commitHash',
      'abcd-dry-run-1234',
    );
  });

  it('should fail if repoUrl is incorrect', async () => {
    await expect(
      action.handler({
        ...mockContext,
        input: { repoUrl: 'check.com?workspace=w&owner=o', description },
      }),
    ).rejects.toThrow(
      /No matching integration configuration for host check.com, please check your integrations config/,
    );
  });

  it('should fail if no integration config is given', async () => {
    await expect(
      action.handler({
        ...mockContext,
        input: {
          repoUrl: 'missing.com?workspace=w&owner=o&repo=r',
          description,
        },
      }),
    ).rejects.toThrow(/No matching integration configuration/);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });
});
