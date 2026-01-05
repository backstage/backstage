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

import { createPublishBitbucketServerPullRequestAction } from './bitbucketServerPullRequest';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { registerMswTestHooks } from '@backstage/backend-test-utils';
import { ScmIntegrations } from '@backstage/integration';
import { ConfigReader } from '@backstage/config';
import yaml from 'yaml';
import { examples } from './bitbucketServerPullRequest.examples';
import { createMockActionContext } from '@backstage/plugin-scaffolder-node-test-utils';

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

describe('publish:bitbucketServer:pull-request', () => {
  const config = new ConfigReader({
    integrations: {
      bitbucketServer: [
        {
          host: 'hosted.bitbucket.com',
          token: 'thing',
          apiBaseUrl: 'https://hosted.bitbucket.com/rest/api/1.0',
        },
        {
          host: 'basic-auth.bitbucket.com',
          username: 'test-user',
          password: 'test-password',
          apiBaseUrl: 'https://basic-auth.bitbucket.com/rest/api/1.0',
        },
        {
          host: 'no-credentials.bitbucket.com',
        },
      ],
    },
  });

  const integrations = ScmIntegrations.fromConfig(config);
  const action = createPublishBitbucketServerPullRequestAction({
    integrations,
    config,
  });
  const mockContext = createMockActionContext({
    input: {
      repoUrl: 'hosted.bitbucket.com?project=project&repo=repo',
      title: 'Add Scaffolder actions for Bitbucket Server',
      description:
        'I just made a Pull Request that Add Scaffolder actions for Bitbucket Server',
      targetBranch: 'master',
      sourceBranch: 'develop',
    },
  });
  const responseOfBranches = {
    size: 3,
    limit: 25,
    isLastPage: true,
    values: [
      {
        id: 'refs/heads/master',
        displayId: 'master',
        type: 'BRANCH',
        latestCommit: 'b1041e3f9b071b3d5cacd6826b7549cd624418f1',
        latestChangeset: 'b1041e3f9b071b3d5cacd6826b7549cd624418f1',
        isDefault: true,
      },
      {
        id: 'refs/heads/my-feature-branch',
        displayId: 'my-feature-branch',
        type: 'BRANCH',
        latestCommit: 'b1041e3f9b071b3d5cacd6826b7549cd624418f1',
        latestChangeset: 'b1041e3f9b071b3d5cacd6826b7549cd624418f1',
        isDefault: true,
      },
      {
        id: 'refs/heads/develop',
        displayId: 'develop',
        type: 'BRANCH',
        latestCommit: '98e21148205367aeb11c25a52eaca3c2945253fa',
        latestChangeset: '98e21148205367aeb11c25a52eaca3c2945253fa',
        isDefault: false,
      },
      {
        id: 'refs/heads/development',
        displayId: 'development',
        type: 'BRANCH',
        latestCommit: 'b1041e3f9b071b3d5cacd6826b7549cd624418f1',
        latestChangeset: 'b1041e3f9b071b3d5cacd6826b7549cd624418f1',
        isDefault: false,
      },
    ],
    start: 0,
  };
  const responseOfPullRequests = {
    id: 19,
    version: 0,
    title: 'Test for bitbucket server pull-requests',
    description: 'Test for bitbucket server pull-requests',
    state: 'OPEN',
    open: true,
    closed: false,
    createdDate: 1684200289521,
    updatedDate: 1684200289521,
    fromRef: {
      id: 'refs/heads/develop',
      displayId: 'develop',
      latestCommit: '98e21148205367aeb11c25a52eaca3c2945253fa',
      type: 'BRANCH',
      repository: {
        slug: 'repo',
        id: 1812,
        name: 'repo',
        description: 'This is a test repo',
        hierarchyId: '1da8822903a9b11a27b8',
        scmId: 'git',
        state: 'AVAILABLE',
        statusMessage: 'Available',
        forkable: true,
        project: {},
        public: false,
        links: {},
      },
    },
    toRef: {
      id: 'refs/heads/master',
      displayId: 'master',
      latestCommit: 'b1041e3f9b071b3d5cacd6826b7549cd624418f1',
      type: 'BRANCH',
      repository: {
        slug: 'repo',
        id: 1812,
        name: 'repo',
        description: 'This is a test repo',
        hierarchyId: '1da8822903a9b11a27b8',
        scmId: 'git',
        state: 'AVAILABLE',
        statusMessage: 'Available',
        forkable: true,
        project: {},
        public: false,
        links: {},
      },
    },
    locked: false,
    author: {
      user: {
        name: 'test-user',
        emailAddress: 'test-user@sample.com',
        id: 2944,
        displayName: 'test-user',
        active: true,
        slug: 'test-user',
        type: 'NORMAL',
        links: {},
      },
      role: 'AUTHOR',
      approved: false,
      status: 'UNAPPROVED',
    },
    reviewers: [],
    participants: [],
    links: {
      self: [
        {
          href: 'https://hosted.bitbucket.com/projects/project/repos/repo/pull-requests/1',
        },
      ],
    },
  };

  const server = setupServer();
  registerMswTestHooks(server);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it(`should ${examples[0].description}`, async () => {
    expect.assertions(3);
    server.use(
      http.get(
        'https://hosted.bitbucket.com/rest/api/1.0/projects/project/repos/repo/branches',
        ({ request }) => {
          expect(request.headers.get('Authorization')).toBe('Bearer thing');
          return HttpResponse.json(responseOfBranches, {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        },
      ),
      http.post(
        'https://hosted.bitbucket.com/rest/api/1.0/projects/project/repos/repo/pull-requests',
        ({ request }) => {
          expect(request.headers.get('Authorization')).toBe('Bearer thing');
          return HttpResponse.json(responseOfPullRequests, {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
          });
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
    expect.assertions(6);
    server.use(
      http.get(
        'https://hosted.bitbucket.com/rest/api/1.0/projects/project/repos/repo/branches',
        ({ request }) => {
          expect(request.headers.get('Authorization')).toBe('Bearer thing');
          return HttpResponse.json(responseOfBranches, {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        },
      ),
      http.post(
        'https://hosted.bitbucket.com/rest/api/1.0/projects/project/repos/repo/pull-requests',
        async ({ request }) => {
          const requestBody = (await request.json()) as {
            title: string;
            fromRef: { displayId: string };
            description: string;
          };
          expect(requestBody.title).toBe('My pull request');
          expect(requestBody.fromRef.displayId).toBe('my-feature-branch');
          expect(requestBody.description).toBe(
            'This is a detailed description of my pull request',
          );
          expect(request.headers.get('Authorization')).toBe('Bearer thing');
          return HttpResponse.json(responseOfPullRequests, {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
          });
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
    expect.assertions(6);
    server.use(
      http.get(
        'https://hosted.bitbucket.com/rest/api/1.0/projects/project/repos/repo/branches',
        ({ request }) => {
          expect(request.headers.get('Authorization')).toBe('Bearer thing');
          return HttpResponse.json(responseOfBranches, {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        },
      ),
      http.post(
        'https://hosted.bitbucket.com/rest/api/1.0/projects/project/repos/repo/pull-requests',
        async ({ request }) => {
          const requestBody = (await request.json()) as {
            title: string;
            toRef: { displayId: string };
            description: string;
          };
          expect(requestBody.title).toBe('My pull request');
          expect(requestBody.toRef.displayId).toBe('development');
          expect(requestBody.description).toBe(
            'I just made a Pull Request that Add Scaffolder actions for Bitbucket Server',
          );
          expect(request.headers.get('Authorization')).toBe('Bearer thing');
          return HttpResponse.json(responseOfPullRequests, {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
          });
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
    expect.assertions(3);
    server.use(
      http.get(
        'https://no-credentials.bitbucket.com/rest/api/1.0/projects/project/repos/repo/branches',
        ({ request }) => {
          expect(request.headers.get('Authorization')).toBe(
            `Bearer ${yaml.parse(examples[3].example).steps[0].input.token}`,
          );
          return HttpResponse.json(responseOfBranches, {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        },
      ),
      http.post(
        'https://no-credentials.bitbucket.com/rest/api/1.0/projects/project/repos/repo/pull-requests',
        ({ request }) => {
          expect(request.headers.get('Authorization')).toBe(
            `Bearer ${yaml.parse(examples[3].example).steps[0].input.token}`,
          );
          return HttpResponse.json(responseOfPullRequests, {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
          });
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
    expect.assertions(8);
    server.use(
      http.get(
        'https://no-credentials.bitbucket.com/rest/api/1.0/projects/project/repos/repo/branches',
        ({ request }) => {
          expect(request.headers.get('Authorization')).toBe(
            `Bearer ${yaml.parse(examples[4].example).steps[0].input.token}`,
          );
          return HttpResponse.json(responseOfBranches, {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        },
      ),
      http.post(
        'https://no-credentials.bitbucket.com/rest/api/1.0/projects/project/repos/repo/pull-requests',
        async ({ request }) => {
          const requestBody = (await request.json()) as {
            title: string;
            toRef: { displayId: string };
            fromRef: { displayId: string };
            description: string;
            reviewers: [{ user: { name: string } }];
          };
          expect(requestBody.title).toBe('My pull request');
          expect(requestBody.fromRef.displayId).toBe('my-feature-branch');
          expect(requestBody.toRef.displayId).toBe('development');
          expect(requestBody.description).toBe(
            'This is a detailed description of my pull request',
          );
          expect(requestBody.reviewers).toEqual([
            { user: { name: 'reviewer1' } },
            { user: { name: 'reviewer2' } },
          ]);
          expect(request.headers.get('Authorization')).toBe(
            `Bearer ${yaml.parse(examples[4].example).steps[0].input.token}`,
          );
          return HttpResponse.json(responseOfPullRequests, {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
          });
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
