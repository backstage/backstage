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

jest.mock('@octokit/rest');

import { createGithubCreateRepositoryWebhookAction } from './githubCreateRepositoryWebhook';
import { ScmIntegrations } from '@backstage/integration';
import { ConfigReader } from '@backstage/config';
import { getVoidLogger } from '@backstage/backend-common';
import { PassThrough } from 'stream';

describe('github:repository:webhook:create', () => {
  const config = new ConfigReader({
    integrations: {
      github: [
        { host: 'github.com', token: 'tokenlols' },
        { host: 'ghe.github.com' },
      ],
    },
  });

  const integrations = ScmIntegrations.fromConfig(config);
  const action = createGithubCreateRepositoryWebhookAction({ integrations });

  const mockContext = {
    input: {
      repoUrl: 'github.com?repo=repo&owner=owner',
      webhookUrl: 'https://example.com/payload',
      webhookSecret: 'aafdfdivierernfdk23f',
    },
    workspacePath: 'lol',
    logger: getVoidLogger(),
    logStream: new PassThrough(),
    output: jest.fn(),
    createTemporaryDirectory: jest.fn(),
  };

  const { mockGithubClient } = require('@octokit/rest');

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should throw an error when the repoUrl is not well formed', async () => {
    await expect(
      action.handler({
        ...mockContext,
        input: { repoUrl: 'github.com?repo=bob' },
      }),
    ).rejects.toThrow(/missing owner/);

    await expect(
      action.handler({
        ...mockContext,
        input: { repoUrl: 'github.com?owner=owner' },
      }),
    ).rejects.toThrow(/missing repo/);
  });

  it('should throw if there is no integration config provided', async () => {
    await expect(
      action.handler({
        ...mockContext,
        input: { repoUrl: 'missing.com?repo=bob&owner=owner' },
      }),
    ).rejects.toThrow(/No matching integration configuration/);
  });

  it('should throw if there is no token in the integration config that is returned', async () => {
    await expect(
      action.handler({
        ...mockContext,
        input: {
          repoUrl: 'ghe.github.com?repo=bob&owner=owner',
        },
      }),
    ).rejects.toThrow(/No token available for host/);
  });

  it('should call the githubApi for creating repository Webhook', async () => {
    const repoUrl = 'github.com?repo=repo&owner=owner';
    const webhookUrl = 'https://example.com/payload';
    const webhookSecret = 'aafdfdivierernfdk23f';
    const ctx = Object.assign({}, mockContext, {
      input: { repoUrl, webhookUrl, webhookSecret },
    });
    await action.handler(ctx);

    expect(mockGithubClient.repos.createWebhook).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repo',
      events: ['push'],
      active: true,
      config: {
        url: webhookUrl,
        content_type: 'form',
        secret: webhookSecret,
        insecure_ssl: '0',
      },
    });

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        events: ['push', 'pull_request'],
      },
    });

    expect(mockGithubClient.repos.createWebhook).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repo',
      events: ['push', 'pull_request'],
      active: true,
      config: {
        url: webhookUrl,
        content_type: 'form',
        secret: webhookSecret,
        insecure_ssl: '0',
      },
    });

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        contentType: 'json',
      },
    });

    expect(mockGithubClient.repos.createWebhook).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repo',
      events: ['push'],
      active: true,
      config: {
        url: webhookUrl,
        content_type: 'json',
        secret: webhookSecret,
        insecure_ssl: '0',
      },
    });

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        insecureSsl: true,
      },
    });

    expect(mockGithubClient.repos.createWebhook).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repo',
      events: ['push'],
      active: true,
      config: {
        url: webhookUrl,
        content_type: 'form',
        secret: webhookSecret,
        insecure_ssl: '1',
      },
    });

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        insecureSsl: true,
      },
    });

    expect(mockGithubClient.repos.createWebhook).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repo',
      events: ['push'],
      active: true,
      config: {
        url: webhookUrl,
        content_type: 'form',
        secret: webhookSecret,
        insecure_ssl: '1',
      },
    });

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        active: false,
      },
    });

    expect(mockGithubClient.repos.createWebhook).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repo',
      events: ['push'],
      active: false,
      config: {
        url: webhookUrl,
        content_type: 'form',
        secret: webhookSecret,
        insecure_ssl: '0',
      },
    });
  });
});
