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

import {
  GithubCredentialsProvider,
  ScmIntegrationRegistry,
} from '@backstage/integration';
import {
  createTemplateAction,
  parseRepoUrl,
} from '@backstage/plugin-scaffolder-node';
import { emitterEventNames } from '@octokit/webhooks';
import { assertError, InputError } from '@backstage/errors';
import { Octokit } from 'octokit';
import { getOctokitOptions } from '../util';
import { examples } from './githubWebhook.examples';

/**
 * Creates new action that creates a webhook for a repository on GitHub.
 * @public
 */
export function createGithubWebhookAction(options: {
  integrations: ScmIntegrationRegistry;
  defaultWebhookSecret?: string;
  githubCredentialsProvider?: GithubCredentialsProvider;
}) {
  const { integrations, defaultWebhookSecret, githubCredentialsProvider } =
    options;

  const eventNames = emitterEventNames.filter(event => !event.includes('.'));

  return createTemplateAction<{
    repoUrl: string;
    webhookUrl: string;
    webhookSecret?: string;
    events?: string[];
    active?: boolean;
    contentType?: 'form' | 'json';
    insecureSsl?: boolean;
    token?: string;
  }>({
    id: 'github:webhook',
    description: 'Creates webhook for a repository on GitHub.',
    examples,
    supportsDryRun: true,
    schema: {
      input: {
        type: 'object',
        required: ['repoUrl', 'webhookUrl'],
        properties: {
          repoUrl: {
            title: 'Repository Location',
            description:
              'Accepts the format `github.com?repo=reponame&owner=owner` where `reponame` is the new repository name and `owner` is an organization or username',
            type: 'string',
          },
          webhookUrl: {
            title: 'Webhook URL',
            description: 'The URL to which the payloads will be delivered',
            type: 'string',
          },
          webhookSecret: {
            title: 'Webhook Secret',
            description:
              'Webhook secret value. The default can be provided internally in action creation',
            type: 'string',
          },
          events: {
            title: 'Triggering Events',
            description:
              'Determines what events the hook is triggered for. Default: `[push]`',
            type: 'array',
            default: ['push'],
            oneOf: [
              {
                items: {
                  type: 'string',
                  enum: eventNames,
                },
              },
              {
                items: {
                  type: 'string',
                  const: '*',
                },
              },
            ],
          },
          active: {
            title: 'Active',
            type: 'boolean',
            default: true,
            description:
              'Determines if notifications are sent when the webhook is triggered. Default: `true`',
          },
          contentType: {
            title: 'Content Type',
            type: 'string',
            enum: ['form', 'json'],
            default: 'form',
            description:
              'The media type used to serialize the payloads. The default is `form`',
          },
          insecureSsl: {
            title: 'Insecure SSL',
            type: 'boolean',
            default: false,
            description:
              'Determines whether the SSL certificate of the host for url will be verified when delivering payloads. Default `false`',
          },
          token: {
            title: 'Authentication Token',
            type: 'string',
            description:
              'The `GITHUB_TOKEN` to use for authorization to GitHub',
          },
        },
      },
    },
    async handler(ctx) {
      const {
        repoUrl,
        webhookUrl,
        webhookSecret = defaultWebhookSecret,
        events = ['push'],
        active = true,
        contentType = 'form',
        insecureSsl = false,
        token: providedToken,
      } = ctx.input;

      ctx.logger.info(`Creating webhook ${webhookUrl} for repo ${repoUrl}`);
      const { host, owner, repo } = parseRepoUrl(repoUrl, integrations);

      if (!owner) {
        throw new InputError('Invalid repository owner provided in repoUrl');
      }

      const client = new Octokit(
        await getOctokitOptions({
          integrations,
          credentialsProvider: githubCredentialsProvider,
          host,
          owner,
          repo,
          token: providedToken,
        }),
      );

      // If this is a dry run, log and return
      if (ctx.isDryRun) {
        ctx.logger.info(`Dry run complete`);
        return;
      }

      try {
        const insecure_ssl = insecureSsl ? '1' : '0';

        await ctx.checkpoint({
          key: `create.webhhook.${owner}.${repo}.${webhookUrl}`,
          fn: async () => {
            await client.rest.repos.createWebhook({
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
          },
        });

        ctx.logger.info(`Webhook '${webhookUrl}' created successfully`);
      } catch (e) {
        assertError(e);
        ctx.logger.warn(
          `Failed: create webhook '${webhookUrl}' on repo: '${repo}', ${e.message}`,
        );
      }
    },
  });
}
