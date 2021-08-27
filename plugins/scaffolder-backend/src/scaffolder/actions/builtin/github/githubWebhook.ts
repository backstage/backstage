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
import { InputError } from '@backstage/errors';
import {
  GithubCredentialsProvider,
  ScmIntegrationRegistry,
} from '@backstage/integration';
import { Octokit } from '@octokit/rest';
import { parseRepoUrl } from '../publish/util';
import { createTemplateAction } from '../../createTemplateAction';

type ContentType = 'form' | 'json';

export function createGithubWebhookAction(options: {
  integrations: ScmIntegrationRegistry;
}) {
  const { integrations } = options;

  const credentialsProviders = new Map(
    integrations.github.list().map(integration => {
      const provider = GithubCredentialsProvider.create(integration.config);
      return [integration.config.host, provider];
    }),
  );

  return createTemplateAction<{
    repoUrl: string;
    webhookUrl: string;
    webhookSecret?: string;
    events?: string[];
    active?: boolean;
    contentType?: ContentType;
    insecureSsl?: boolean;
  }>({
    id: 'github:webhook',
    description: 'Creates webhook for a repository on GitHub.',
    schema: {
      input: {
        type: 'object',
        required: ['repoUrl', 'webhookUrl'],
        properties: {
          repoUrl: {
            title: 'Repository Location',
            description: `Accepts the format 'github.com?repo=reponame&owner=owner' where 'reponame' is the new repository name and 'owner' is an organization or username`,
            type: 'string',
          },
          webhookUrl: {
            title: 'Webhook URL',
            description: 'The URL to which the payloads will be delivered',
            type: 'string',
          },
          webhookSecret: {
            title: 'Webhook Secret',
            description: 'Webhook secret value',
            type: 'string',
          },
          events: {
            title: 'Triggering Events',
            description:
              'Determines what events the hook is triggered for. Default: push',
            type: 'array',
            items: {
              type: 'string',
            },
          },
          active: {
            title: 'Active',
            type: 'boolean',
            description: `Determines if notifications are sent when the webhook is triggered. Default: true`,
          },
          contentType: {
            title: 'Content Type',
            type: 'string',
            enum: ['form', 'json'],
            description: `The media type used to serialize the payloads. The default is 'form'`,
          },
          insecureSsl: {
            title: 'Insecure SSL',
            type: 'boolean',
            description: `Determines whether the SSL certificate of the host for url will be verified when delivering payloads. Default 'false'`,
          },
        },
      },
    },
    async handler(ctx) {
      const {
        repoUrl,
        webhookUrl,
        webhookSecret,
        events = ['push'],
        active = true,
        contentType = 'form',
        insecureSsl = false,
      } = ctx.input;

      const { owner, repo, host } = parseRepoUrl(repoUrl, integrations);

      if (!owner) {
        throw new InputError(`No owner provided for repo ${repoUrl}`);
      }

      ctx.logger.info(`Creating webhook ${webhookUrl} for repo ${repoUrl}`);

      const credentialsProvider = credentialsProviders.get(host);
      const integrationConfig = integrations.github.byHost(host);

      if (!credentialsProvider || !integrationConfig) {
        throw new InputError(
          `No matching integration configuration for host ${host}, please check your integrations config`,
        );
      }

      const { token } = await credentialsProvider.getCredentials({
        url: `https://${host}/${encodeURIComponent(owner)}/${encodeURIComponent(
          repo,
        )}`,
      });

      if (!token) {
        throw new InputError(
          `No token available for host: ${host}, with owner ${owner}, and repo ${repo}`,
        );
      }

      const client = new Octokit({
        auth: token,
        baseUrl: integrationConfig.config.apiBaseUrl,
        previews: ['nebula-preview'],
      });

      try {
        const insecure_ssl = insecureSsl ? '1' : '0';
        await client.repos.createWebhook({
          owner,
          repo,
          config: {
            url: webhookUrl,
            content_type: contentType,
            secret: webhookSecret,
            insecure_ssl,
          },
          events,
          active,
        });
        ctx.logger.info(`Webhook '${webhookUrl}' created successfully`);
      } catch (e) {
        ctx.logger.warn(
          `Failed: create webhook '${webhookUrl}' on repo: '${repo}', ${e.message}`,
        );
      }
    },
  });
}
