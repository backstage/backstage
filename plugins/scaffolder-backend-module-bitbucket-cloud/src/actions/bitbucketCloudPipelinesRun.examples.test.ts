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

import { getVoidLogger } from '@backstage/backend-common';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { PassThrough } from 'stream';
import { createBitbucketPipelinesRunAction } from './bitbucketCloudPipelinesRun';
import yaml from 'yaml';
import { examples } from './bitbucketCloudPipelinesRun.examples';
import { ConfigReader } from '@backstage/config';
import { ScmIntegrations } from '@backstage/integration';
import { setupRequestMockHandlers } from '@backstage/backend-test-utils';

describe('bitbucket:pipelines:run', () => {
  const config = new ConfigReader({
    integrations: {
      bitbucketCloud: [
        {
          username: 'u',
          appPassword: 'p',
        },
      ],
    },
  });

  const integrations = ScmIntegrations.fromConfig(config);
  const action = createBitbucketPipelinesRunAction({ integrations });
  const mockContext = {
    input: {},
    workspacePath: 'wsp',
    logger: getVoidLogger(),
    logStream: new PassThrough(),
    output: jest.fn(),
    createTemporaryDirectory: jest.fn(),
  };
  const responseJson = {
    repository: {
      links: {
        html: { href: 'https://bitbucket.org/test-workspace/test-repo-slug' },
      },
    },
    build_number: 1,
  };
  const worker = setupServer();
  setupRequestMockHandlers(worker);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should trigger a pipeline for a branch', async () => {
    expect.assertions(2);
    worker.use(
      rest.post(
        'https://api.bitbucket.org/2.0/repositories/test-workspace/test-repo-slug/pipelines',
        (req, res, ctx) => {
          expect(req.headers.get('Authorization')).toBe('Basic dTpw');
          expect(req.body).toEqual({
            target: {
              ref_type: 'branch',
              type: 'pipeline_ref_target',
              ref_name: 'master',
            },
          });
          return res(
            ctx.status(201),
            ctx.set('Content-Type', 'application/json'),
            ctx.json(responseJson),
          );
        },
      ),
    );
    const ctx = Object.assign({}, mockContext, {
      input: yaml.parse(examples[0].example).steps[0].input,
    });
    await action.handler(ctx);
  });

  it('should trigger a pipeline for a commit on a branch', async () => {
    expect.assertions(2);
    worker.use(
      rest.post(
        'https://api.bitbucket.org/2.0/repositories/test-workspace/test-repo-slug/pipelines',
        (req, res, ctx) => {
          expect(req.headers.get('Authorization')).toBe('Basic dTpw');
          expect(req.body).toEqual({
            target: {
              commit: {
                type: 'commit',
                hash: 'ce5b7431602f7cbba007062eeb55225c6e18e956',
              },
              ref_type: 'branch',
              type: 'pipeline_ref_target',
              ref_name: 'master',
            },
          });
          return res(
            ctx.status(201),
            ctx.set('Content-Type', 'application/json'),
            ctx.json(responseJson),
          );
        },
      ),
    );
    const ctx = Object.assign({}, mockContext, {
      input: yaml.parse(examples[1].example).steps[0].input,
    });
    await action.handler(ctx);
  });

  it('should trigger a specific pipeline definition for a commit', async () => {
    expect.assertions(2);
    worker.use(
      rest.post(
        'https://api.bitbucket.org/2.0/repositories/test-workspace/test-repo-slug/pipelines',
        (req, res, ctx) => {
          expect(req.headers.get('Authorization')).toBe('Basic dTpw');
          expect(req.body).toEqual({
            target: {
              commit: {
                type: 'commit',
                hash: 'a3c4e02c9a3755eccdc3764e6ea13facdf30f923',
              },
              selector: {
                type: 'custom',
                pattern: 'Deploy to production',
              },
              type: 'pipeline_commit_target',
            },
          });
          return res(
            ctx.status(201),
            ctx.set('Content-Type', 'application/json'),
            ctx.json(responseJson),
          );
        },
      ),
    );
    const ctx = Object.assign({}, mockContext, {
      input: yaml.parse(examples[2].example).steps[0].input,
    });
    await action.handler(ctx);
  });

  it('should trigger a specific pipeline definition for a commit on a branch or tag', async () => {
    expect.assertions(2);
    worker.use(
      rest.post(
        'https://api.bitbucket.org/2.0/repositories/test-workspace/test-repo-slug/pipelines',
        (req, res, ctx) => {
          expect(req.headers.get('Authorization')).toBe('Basic dTpw');
          expect(req.body).toEqual({
            target: {
              commit: {
                type: 'commit',
                hash: 'a3c4e02c9a3755eccdc3764e6ea13facdf30f923',
              },
              selector: {
                type: 'custom',
                pattern: 'Deploy to production',
              },
              type: 'pipeline_ref_target',
              ref_name: 'master',
              ref_type: 'branch',
            },
          });
          return res(
            ctx.status(201),
            ctx.set('Content-Type', 'application/json'),
            ctx.json(responseJson),
          );
        },
      ),
    );
    const ctx = Object.assign({}, mockContext, {
      input: yaml.parse(examples[3].example).steps[0].input,
    });
    await action.handler(ctx);
  });

  it('should trigger a custom pipeline with variables', async () => {
    expect.assertions(2);
    worker.use(
      rest.post(
        'https://api.bitbucket.org/2.0/repositories/test-workspace/test-repo-slug/pipelines',
        (req, res, ctx) => {
          expect(req.headers.get('Authorization')).toBe('Basic dTpw');
          expect(req.body).toEqual({
            target: {
              type: 'pipeline_ref_target',
              ref_name: 'master',
              ref_type: 'branch',
              selector: {
                type: 'custom',
                pattern: 'Deploy to production',
              },
            },
            variables: [
              { key: 'var1key', value: 'var1value', secured: true },
              {
                key: 'var2key',
                value: 'var2value',
              },
            ],
          });
          return res(
            ctx.status(201),
            ctx.set('Content-Type', 'application/json'),
            ctx.json(responseJson),
          );
        },
      ),
    );
    const ctx = Object.assign({}, mockContext, {
      input: yaml.parse(examples[4].example).steps[0].input,
    });
    await action.handler(ctx);
  });

  it('should trigger a pull request pipeline', async () => {
    expect.assertions(2);
    worker.use(
      rest.post(
        'https://api.bitbucket.org/2.0/repositories/test-workspace/test-repo-slug/pipelines',
        (req, res, ctx) => {
          expect(req.headers.get('Authorization')).toBe('Basic dTpw');
          expect(req.body).toEqual({
            target: {
              type: 'pipeline_pullrequest_target',
              source: 'pull-request-branch',
              destination: 'master',
              destination_commit: {
                hash: '9f848b7',
              },
              commit: {
                hash: '1a372fc',
              },
              pull_request: {
                id: '3',
              },
              selector: {
                type: 'pull-requests',
                pattern: '**',
              },
            },
          });
          return res(
            ctx.status(201),
            ctx.set('Content-Type', 'application/json'),
            ctx.json(responseJson),
          );
        },
      ),
    );
    const ctx = Object.assign({}, mockContext, {
      input: yaml.parse(examples[5].example).steps[0].input,
    });
    await action.handler(ctx);
  });
});
