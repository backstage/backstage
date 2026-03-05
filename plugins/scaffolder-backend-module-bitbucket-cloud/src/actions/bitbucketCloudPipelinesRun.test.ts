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

import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { registerMswTestHooks } from '@backstage/backend-test-utils';
import { createBitbucketPipelinesRunAction } from './bitbucketCloudPipelinesRun';
import { ConfigReader } from '@backstage/config';
import { ScmIntegrations } from '@backstage/integration';
import { createMockActionContext } from '@backstage/plugin-scaffolder-node-test-utils';

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
  const mockContext = createMockActionContext();
  const workspace = 'test-workspace';
  const repo_slug = 'test-repo-slug';
  const responseJson = {
    repository: {
      links: {
        html: { href: 'https://bitbucket.org/test-workspace/test-repo-slug' },
      },
    },
    build_number: 1,
  };
  const worker = setupServer();
  registerMswTestHooks(worker);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw if there is no integration credentials or token provided', async () => {
    const configNoCreds = new ConfigReader({
      integrations: {
        bitbucketCloud: [],
      },
    });

    const integrationsNoCreds = ScmIntegrations.fromConfig(configNoCreds);
    const actionNoCreds = createBitbucketPipelinesRunAction({
      integrations: integrationsNoCreds,
    });

    const testContext = Object.assign({}, mockContext, {
      input: { workspace, repo_slug },
    });

    await expect(actionNoCreds.handler(testContext)).rejects.toThrow(
      /Authorization has not been provided for Bitbucket Cloud/,
    );
  });

  it('should call the bitbucket api for running a pipeline with integration credentials', async () => {
    expect.assertions(1);
    worker.use(
      rest.post(
        `https://api.bitbucket.org/2.0/repositories/${workspace}/${repo_slug}/pipelines`,
        (req, res, ctx) => {
          expect(req.headers.get('Authorization')).toBe('Basic dTpw');
          return res(
            ctx.status(201),
            ctx.set('Content-Type', 'application/json'),
            ctx.json(responseJson),
          );
        },
      ),
    );

    const testContext = Object.assign({}, mockContext, {
      input: { workspace, repo_slug },
    });
    await action.handler(testContext);
  });

  it('should call the bitbucket api for running a pipeline with input token', async () => {
    expect.assertions(1);
    worker.use(
      rest.post(
        `https://api.bitbucket.org/2.0/repositories/${workspace}/${repo_slug}/pipelines`,
        (req, res, ctx) => {
          expect(req.headers.get('Authorization')).toBe('Bearer abc');
          return res(
            ctx.status(201),
            ctx.set('Content-Type', 'application/json'),
            ctx.json(responseJson),
          );
        },
      ),
    );

    const testContext = Object.assign({}, mockContext, {
      input: { workspace, repo_slug, token: 'abc' },
    });
    await action.handler(testContext);
  });

  it('should call outputs with the correct data', async () => {
    worker.use(
      rest.post(
        `https://api.bitbucket.org/2.0/repositories/${workspace}/${repo_slug}/pipelines`,
        (_, res, ctx) => {
          return res(
            ctx.status(201),
            ctx.set('Content-Type', 'application/json'),
            ctx.json(responseJson),
          );
        },
      ),
    );

    const testContext = Object.assign({}, mockContext, {
      input: { workspace, repo_slug, token: 'abc' },
    });
    await action.handler(testContext);
    expect(testContext.output).toHaveBeenCalledWith('buildNumber', 1);
    expect(testContext.output).toHaveBeenCalledWith(
      'repoUrl',
      'https://bitbucket.org/test-workspace/test-repo-slug',
    );
    expect(testContext.output).toHaveBeenCalledWith(
      'pipelinesUrl',
      'https://bitbucket.org/test-workspace/test-repo-slug/pipelines',
    );
  });
});
