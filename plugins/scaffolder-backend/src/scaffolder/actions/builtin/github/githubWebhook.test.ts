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

import { createGithubWebhookAction } from './githubWebhook';
import {
  ScmIntegrations,
  DefaultGithubCredentialsProvider,
  GithubCredentialsProvider,
} from '@backstage/integration';
import { ConfigReader } from '@backstage/config';
import { getVoidLogger } from '@backstage/backend-common';
import { PassThrough } from 'stream';
import { TemplateAction } from '../..';

const mockOctokit = {
  rest: {
    repos: {
      createWebhook: jest.fn(),
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
  let githubCredentialsProvider: GithubCredentialsProvider;
  const defaultWebhookSecret = 'aafdfdivierernfdk23f';
  let action: TemplateAction<any>;

  beforeEach(() => {
    jest.resetAllMocks();
    githubCredentialsProvider =
      DefaultGithubCredentialsProvider.fromIntegrations(integrations);
    action = createGithubWebhookAction({
      integrations,
      defaultWebhookSecret,
      githubCredentialsProvider,
    });
  });

  const mockContext = {
    input: {
      repoUrl: 'github.com?repo=repo&owner=owner',
      webhookUrl: 'https://example.com/payload',
    },
    workspacePath: 'lol',
    logger: getVoidLogger(),
    logStream: new PassThrough(),
    output: jest.fn(),
    createTemporaryDirectory: jest.fn(),
  };

  it('should call the githubApi for creating repository Webhook', async () => {
    const repoUrl = 'github.com?repo=repo&owner=owner';
    const webhookUrl = 'https://example.com/payload';
    const ctx = Object.assign({}, mockContext, {
      input: { repoUrl, webhookUrl },
    });
    await action.handler(ctx);

    expect(mockOctokit.rest.repos.createWebhook).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repo',
      events: ['push'],
      active: true,
      config: {
        url: webhookUrl,
        content_type: 'form',
        secret: defaultWebhookSecret,
        insecure_ssl: '0',
      },
    });

    const webhookSecret = 'yet_another_secret';
    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        webhookSecret,
      },
    });

    expect(mockOctokit.rest.repos.createWebhook).toHaveBeenCalledWith({
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

    expect(mockOctokit.rest.repos.createWebhook).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repo',
      events: ['push', 'pull_request'],
      active: true,
      config: {
        url: webhookUrl,
        content_type: 'form',
        secret: defaultWebhookSecret,
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

    expect(mockOctokit.rest.repos.createWebhook).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repo',
      events: ['push'],
      active: true,
      config: {
        url: webhookUrl,
        content_type: 'json',
        secret: defaultWebhookSecret,
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

    expect(mockOctokit.rest.repos.createWebhook).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repo',
      events: ['push'],
      active: true,
      config: {
        url: webhookUrl,
        content_type: 'form',
        secret: defaultWebhookSecret,
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

    expect(mockOctokit.rest.repos.createWebhook).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repo',
      events: ['push'],
      active: true,
      config: {
        url: webhookUrl,
        content_type: 'form',
        secret: defaultWebhookSecret,
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

    expect(mockOctokit.rest.repos.createWebhook).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repo',
      events: ['push'],
      active: false,
      config: {
        url: webhookUrl,
        content_type: 'form',
        secret: defaultWebhookSecret,
        insecure_ssl: '0',
      },
    });
  });

  it('should validate input', async () => {
    const Validator = require('jsonschema').Validator;
    const v = new Validator();

    // validate default input without events specified
    expect(v.validate(mockContext.input, action.schema?.input).valid).toBe(
      true,
    );

    const inputWithValidEvent = {
      ...mockContext.input,
      events: ['push'],
    };
    expect(v.validate(inputWithValidEvent, action.schema?.input).valid).toBe(
      true,
    );

    const inputWithMultipleValidEvents = {
      ...mockContext.input,
      events: ['push', 'pull_request'],
    };
    expect(
      v.validate(inputWithMultipleValidEvents, action.schema?.input).valid,
    ).toBe(true);

    const inputWithInvalidEvent = {
      ...mockContext.input,
      events: ['unexpected_event'],
    };
    expect(v.validate(inputWithInvalidEvent, action.schema?.input).valid).toBe(
      false,
    );

    const inputWithOneInvalidEvent = {
      ...mockContext.input,
      events: ['push', 'unexpected_event'],
    };
    expect(
      v.validate(inputWithOneInvalidEvent, action.schema?.input).valid,
    ).toBe(false);

    const inputWithAllEvents = {
      ...mockContext.input,
      events: ['*'],
    };
    expect(v.validate(inputWithAllEvents, action.schema?.input).valid).toBe(
      true,
    );

    const inputWithAllEventsAndMore = {
      ...mockContext.input,
      events: ['*', 'push'],
    };
    expect(
      v.validate(inputWithAllEventsAndMore, action.schema?.input).valid,
    ).toBe(false);
  });
});
