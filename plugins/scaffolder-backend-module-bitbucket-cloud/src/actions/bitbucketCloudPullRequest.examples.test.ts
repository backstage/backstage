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
      commitHash: '220f19cc36b551763d157f1b5e4a4b446165dbd6',
    }),
    commitAndPushRepo: jest.fn().mockResolvedValue({
      commitHash: '220f19cc36b551763d157f1b5e4a4b446165dbd6',
    }),
  };
});

import { createPublishBitbucketCloudPullRequestAction } from './bitbucketCloudPullRequest';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { registerMswTestHooks } from '@backstage/backend-test-utils';
import { ScmIntegrations } from '@backstage/integration';
import { ConfigReader } from '@backstage/config';
import yaml from 'yaml';
import { examples } from './bitbucketCloudPullRequest.examples';
import { createMockActionContext } from '@backstage/plugin-scaffolder-node-test-utils';

describe('publish:bitbucketCloud:pull-request', () => {
  const config = new ConfigReader({
    integrations: {
      bitbucketCloud: [
        {
          username: 'test-user',
          appPassword: 'test-password',
        },
      ],
    },
  });

  const integrations = ScmIntegrations.fromConfig(config);
  const action = createPublishBitbucketCloudPullRequestAction({
    integrations,
    config,
  });
  const mockContext = createMockActionContext({
    input: {
      repoUrl: 'bitbucket.org?workspace=workspace&project=project&repo=repo',
      title: 'Add Scaffolder actions for Bitbucket Cloud',
      description:
        'I just made a Pull Request that Add Scaffolder actions for Bitbucket Cloud',
      targetBranch: 'master',
      sourceBranch: 'develop',
    },
  });
  const responseOfBranches = {
    pagelen: 1,
    size: 187,
    values: [
      {
        name: 'issue-9.3/AUI-5343-assistive-class',
        links: {
          commits: {
            href: 'https://api.bitbucket.org/2.0/repositories/atlassian/aui/commits/issue-9.3/AUI-5343-assistive-class',
          },
          self: {
            href: 'https://api.bitbucket.org/2.0/repositories/atlassian/aui/refs/branches/issue-9.3/AUI-5343-assistive-class',
          },
          html: {
            href: 'https://bitbucket.org/atlassian/aui/branch/issue-9.3/AUI-5343-assistive-class',
          },
        },
        default_merge_strategy: 'squash',
        merge_strategies: ['merge_commit', 'squash', 'fast_forward'],
        type: 'branch',
        target: {
          hash: 'e5d1cde9069fcb9f0af90403a4de2150c125a148',
          repository: {
            links: {
              self: {
                href: 'https://api.bitbucket.org/2.0/repositories/atlassian/aui',
              },
              html: { href: 'https://bitbucket.org/atlassian/aui' },
              avatar: {
                href: 'https://bytebucket.org/ravatar/%7B585074de-7b60-4fd1-81ed-e0bc7fafbda5%7D?ts=86317',
              },
            },
            type: 'repository',
            name: 'aui',
            full_name: 'atlassian/aui',
            uuid: '{585074de-7b60-4fd1-81ed-e0bc7fafbda5}',
          },
          links: {
            self: {
              href: 'https://api.bitbucket.org/2.0/repositories/atlassian/aui/commit/e5d1cde9069fcb9f0af90403a4de2150c125a148',
            },
            comments: {
              href: 'https://api.bitbucket.org/2.0/repositories/atlassian/aui/commit/e5d1cde9069fcb9f0af90403a4de2150c125a148/comments',
            },
            patch: {
              href: 'https://api.bitbucket.org/2.0/repositories/atlassian/aui/patch/e5d1cde9069fcb9f0af90403a4de2150c125a148',
            },
            html: {
              href: 'https://bitbucket.org/atlassian/aui/commits/e5d1cde9069fcb9f0af90403a4de2150c125a148',
            },
            diff: {
              href: 'https://api.bitbucket.org/2.0/repositories/atlassian/aui/diff/e5d1cde9069fcb9f0af90403a4de2150c125a148',
            },
            approve: {
              href: 'https://api.bitbucket.org/2.0/repositories/atlassian/aui/commit/e5d1cde9069fcb9f0af90403a4de2150c125a148/approve',
            },
            statuses: {
              href: 'https://api.bitbucket.org/2.0/repositories/atlassian/aui/commit/e5d1cde9069fcb9f0af90403a4de2150c125a148/statuses',
            },
          },
          author: {
            raw: 'Marcin Konopka <mkonopka@atlassian.com>',
            type: 'author',
            user: {
              display_name: 'Marcin Konopka',
              uuid: '{47cc24f4-2a05-4420-88fe-0417535a110a}',
              links: {
                self: {
                  href: 'https://api.bitbucket.org/2.0/users/%7B47cc24f4-2a05-4420-88fe-0417535a110a%7D',
                },
                html: {
                  href: 'https://bitbucket.org/%7B47cc24f4-2a05-4420-88fe-0417535a110a%7D/',
                },
                avatar: {
                  href: 'https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/initials/MK-1.png',
                },
              },
              nickname: 'Marcin Konopka',
              type: 'user',
              account_id: '60113d2b47a9540069f4de03',
            },
          },
          parents: [
            {
              hash: '87f7fc92b00464ae47b13ef65c91884e4ac9be51',
              type: 'commit',
              links: {
                self: {
                  href: 'https://api.bitbucket.org/2.0/repositories/atlassian/aui/commit/87f7fc92b00464ae47b13ef65c91884e4ac9be51',
                },
                html: {
                  href: 'https://bitbucket.org/atlassian/aui/commits/87f7fc92b00464ae47b13ef65c91884e4ac9be51',
                },
              },
            },
          ],
          date: '2021-04-13T13:44:49+00:00',
          message: 'wip\n',
          type: 'commit',
        },
      },
    ],
    page: 1,
    next: 'https://api.bitbucket.org/2.0/repositories/atlassian/aui/refs/branches?pagelen=1&page=2',
  };
  const responseOfPullRequests = {
    type: '<string>',
    links: {
      self: { href: '<string>', name: '<string>' },
      html: {
        href: 'https://bitbucket.org/workspace/repo/pull-requests/1',
        name: '<string>',
      },
      commits: { href: '<string>', name: '<string>' },
      approve: { href: '<string>', name: '<string>' },
      diff: { href: '<string>', name: '<string>' },
      diffstat: { href: '<string>', name: '<string>' },
      comments: { href: '<string>', name: '<string>' },
      activity: { href: '<string>', name: '<string>' },
      merge: { href: '<string>', name: '<string>' },
      decline: { href: '<string>', name: '<string>' },
    },
    id: 108,
    title: '<string>',
    rendered: {
      title: { raw: '<string>', markup: 'markdown', html: '<string>' },
      description: { raw: '<string>', markup: 'markdown', html: '<string>' },
      reason: { raw: '<string>', markup: 'markdown', html: '<string>' },
    },
    summary: { raw: '<string>', markup: 'markdown', html: '<string>' },
    state: 'OPEN',
    author: { type: '<string>' },
    source: {
      repository: { type: '<string>' },
      branch: {
        name: '<string>',
        merge_strategies: ['merge_commit'],
        default_merge_strategy: '<string>',
      },
      commit: { hash: '<string>' },
    },
    destination: {
      repository: { type: '<string>' },
      branch: {
        name: '<string>',
        merge_strategies: ['merge_commit'],
        default_merge_strategy: '<string>',
      },
      commit: { hash: '<string>' },
    },
    merge_commit: { hash: '<string>' },
    comment_count: 51,
    task_count: 53,
    close_source_branch: true,
    closed_by: { type: '<string>' },
    reason: '<string>',
    created_on: '<string>',
    updated_on: '<string>',
    reviewers: [{ type: '<string>' }],
    participants: [{ type: '<string>' }],
  };

  const server = setupServer();
  registerMswTestHooks(server);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it(`should ${examples[0].description}`, async () => {
    expect.assertions(2);
    server.use(
      rest.get(
        'https://api.bitbucket.org/2.0/repositories/workspace/repo/refs/branches',
        (req, res, ctx) => {
          expect(req.headers.get('Authorization')).toBe(
            'Basic dGVzdC11c2VyOnRlc3QtcGFzc3dvcmQ=',
          );
          return res(
            ctx.status(200),
            ctx.set('Content-Type', 'application/json'),
            ctx.json(responseOfBranches),
          );
        },
      ),
      rest.post(
        'https://api.bitbucket.org/2.0/repositories/workspace/repo/pullrequests',
        (req, res, ctx) => {
          expect(req.headers.get('Authorization')).toBe(
            'Basic dGVzdC11c2VyOnRlc3QtcGFzc3dvcmQ=',
          );
          return res(
            ctx.status(201),
            ctx.set('Content-Type', 'application/json'),
            ctx.json(responseOfPullRequests),
          );
        },
      ),
    );

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...yaml.parse(examples[0].example).steps[0].input,
      },
    });
  });

  it(`should ${examples[1].description}`, async () => {
    expect.assertions(2);
    server.use(
      rest.get(
        'https://api.bitbucket.org/2.0/repositories/workspace/repo/refs/branches',
        (req, res, ctx) => {
          expect(req.headers.get('Authorization')).toBe(
            'Basic dGVzdC11c2VyOnRlc3QtcGFzc3dvcmQ=',
          );
          return res(
            ctx.status(200),
            ctx.set('Content-Type', 'application/json'),
            ctx.json(responseOfBranches),
          );
        },
      ),
      rest.post(
        'https://api.bitbucket.org/2.0/repositories/workspace/repo/pullrequests',
        (req, res, ctx) => {
          expect(req.headers.get('Authorization')).toBe(
            'Basic dGVzdC11c2VyOnRlc3QtcGFzc3dvcmQ=',
          );
          return res(
            ctx.status(201),
            ctx.set('Content-Type', 'application/json'),
            ctx.json(responseOfPullRequests),
          );
        },
      ),
    );

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...yaml.parse(examples[1].example).steps[0].input,
      },
    });
  });

  it(`should ${examples[2].description}`, async () => {
    expect.assertions(2);
    server.use(
      rest.get(
        'https://api.bitbucket.org/2.0/repositories/workspace/repo/refs/branches',
        (req, res, ctx) => {
          expect(req.headers.get('Authorization')).toBe(
            'Basic dGVzdC11c2VyOnRlc3QtcGFzc3dvcmQ=',
          );
          return res(
            ctx.status(200),
            ctx.set('Content-Type', 'application/json'),
            ctx.json(responseOfBranches),
          );
        },
      ),
      rest.post(
        'https://api.bitbucket.org/2.0/repositories/workspace/repo/pullrequests',
        (req, res, ctx) => {
          expect(req.headers.get('Authorization')).toBe(
            'Basic dGVzdC11c2VyOnRlc3QtcGFzc3dvcmQ=',
          );
          return res(
            ctx.status(201),
            ctx.set('Content-Type', 'application/json'),
            ctx.json(responseOfPullRequests),
          );
        },
      ),
    );

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...yaml.parse(examples[2].example).steps[0].input,
      },
    });
  });

  it(`should ${examples[3].description}`, async () => {
    expect.assertions(2);
    server.use(
      rest.get(
        'https://api.bitbucket.org/2.0/repositories/workspace/repo/refs/branches',
        (req, res, ctx) => {
          expect(req.headers.get('Authorization')).toBe(
            `Bearer ${yaml.parse(examples[3].example).steps[0].input.token}`,
          );
          return res(
            ctx.status(200),
            ctx.set('Content-Type', 'application/json'),
            ctx.json(responseOfBranches),
          );
        },
      ),
      rest.post(
        'https://api.bitbucket.org/2.0/repositories/workspace/repo/pullrequests',
        (req, res, ctx) => {
          expect(req.headers.get('Authorization')).toBe(
            `Bearer ${yaml.parse(examples[3].example).steps[0].input.token}`,
          );
          return res(
            ctx.status(201),
            ctx.set('Content-Type', 'application/json'),
            ctx.json(responseOfPullRequests),
          );
        },
      ),
    );

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...yaml.parse(examples[3].example).steps[0].input,
      },
    });
  });

  it(`should ${examples[4].description}`, async () => {
    expect.assertions(2);
    server.use(
      rest.get(
        'https://api.bitbucket.org/2.0/repositories/workspace/repo/refs/branches',
        (req, res, ctx) => {
          expect(req.headers.get('Authorization')).toBe(
            `Bearer ${yaml.parse(examples[4].example).steps[0].input.token}`,
          );
          return res(
            ctx.status(200),
            ctx.set('Content-Type', 'application/json'),
            ctx.json(responseOfBranches),
          );
        },
      ),
      rest.post(
        'https://api.bitbucket.org/2.0/repositories/workspace/repo/pullrequests',
        (req, res, ctx) => {
          expect(req.headers.get('Authorization')).toBe(
            `Bearer ${yaml.parse(examples[4].example).steps[0].input.token}`,
          );
          return res(
            ctx.status(201),
            ctx.set('Content-Type', 'application/json'),
            ctx.json(responseOfPullRequests),
          );
        },
      ),
    );

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...yaml.parse(examples[4].example).steps[0].input,
      },
    });
  });
});
