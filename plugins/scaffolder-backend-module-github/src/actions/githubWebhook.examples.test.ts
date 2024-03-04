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
import { TemplateAction } from '@backstage/plugin-scaffolder-node';
import { createMockActionContext } from '@backstage/plugin-scaffolder-node-test-utils';
import { ConfigReader } from '@backstage/config';
import {
  DefaultGithubCredentialsProvider,
  GithubCredentialsProvider,
  ScmIntegrations,
} from '@backstage/integration';
import { createGithubWebhookAction } from './githubWebhook';
import yaml from 'yaml';
import { examples } from './githubWebhook.examples';

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

describe('github:webhook examples', () => {
  const config = new ConfigReader({
    integrations: {
      github: [
        { host: 'github.com', token: 'tokenlols' },
        { host: 'ghe.github.com' },
      ],
    },
  });

  const defaultWebhookSecret = 'aafdfdivierernfdk23f';
  const integrations = ScmIntegrations.fromConfig(config);
  let githubCredentialsProvider: GithubCredentialsProvider;
  let action: TemplateAction<any>;

  const mockContext = createMockActionContext();

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

  it('Create a GitHub webhook for a repository', async () => {
    const input = yaml.parse(examples[0].example).steps[0].input;

    await action.handler({
      ...mockContext,
      input,
    });

    expect(mockOctokit.rest.repos.createWebhook).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repo',
      config: {
        url: input.webhookUrl,
        content_type: input.contentType,
        secret: input.webhookSecret,
        insecure_ssl: '0',
      },
      events: input.events,
      active: input.active,
    });
  });

  it('Create a GitHub webhook with minimal configuration', async () => {
    const input = yaml.parse(examples[1].example).steps[0].input;

    await action.handler({
      ...mockContext,
      input,
    });

    expect(mockOctokit.rest.repos.createWebhook).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repo',
      config: {
        url: 'https://example.com/my-webhook',
        content_type: 'form',
        secret: defaultWebhookSecret,
        insecure_ssl: '0',
      },
      events: ['push'],
      active: true,
    });
  });

  it('Create a GitHub webhook with custom events', async () => {
    const input = yaml.parse(examples[2].example).steps[0].input;

    await action.handler({
      ...mockContext,
      input,
    });

    expect(mockOctokit.rest.repos.createWebhook).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repo',
      config: {
        url: 'https://example.com/my-webhook',
        content_type: 'form',
        secret: defaultWebhookSecret,
        insecure_ssl: '0',
      },
      events: ['push', 'pull_request'],
      active: true,
    });
  });

  it('Create a GitHub webhook with JSON content type', async () => {
    const input = yaml.parse(examples[3].example).steps[0].input;

    await action.handler({
      ...mockContext,
      input,
    });

    expect(mockOctokit.rest.repos.createWebhook).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repo',
      config: {
        url: 'https://example.com/my-webhook',
        content_type: 'json',
        secret: defaultWebhookSecret,
        insecure_ssl: '0',
      },
      events: ['push'],
      active: true,
    });
  });

  it('Create a GitHub webhook with insecure SSL', async () => {
    const input = yaml.parse(examples[4].example).steps[0].input;

    await action.handler({
      ...mockContext,
      input,
    });

    expect(mockOctokit.rest.repos.createWebhook).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repo',
      config: {
        url: 'https://example.com/my-webhook',
        content_type: 'form',
        secret: defaultWebhookSecret,
        insecure_ssl: '1',
      },
      events: ['push'],
      active: true,
    });
  });

  it('Create an inactive GitHub webhook', async () => {
    const input = yaml.parse(examples[5].example).steps[0].input;

    await action.handler({
      ...mockContext,
      input,
    });

    expect(mockOctokit.rest.repos.createWebhook).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repo',
      config: {
        url: 'https://example.com/my-webhook',
        content_type: 'form',
        secret: defaultWebhookSecret,
        insecure_ssl: '0',
      },
      events: ['push'],
      active: false,
    });
  });
});
