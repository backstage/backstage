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
  ScmIntegrations,
} from '@backstage/integration';
import {
  createTemplateAction,
  parseRepoUrl,
} from '@backstage/plugin-scaffolder-node';
import { Octokit } from 'octokit';
import { examples } from './githubAutolinks.examples';
import { getOctokitOptions } from '../util';

/**
 * Create an autolink reference for a repository
 * @public
 */
export function createGithubAutolinksAction(options: {
  integrations: ScmIntegrations;
  githubCredentialsProvider?: GithubCredentialsProvider;
}) {
  const { integrations, githubCredentialsProvider } = options;

  return createTemplateAction<{
    repoUrl: string;
    keyPrefix: string;
    urlTemplate: string;
    isAlphanumeric?: boolean;
    token?: string;
  }>({
    id: 'github:autolinks:create',
    description: 'Create an autolink reference for a repository',
    examples,
    schema: {
      input: {
        type: 'object',
        required: ['repoUrl', 'keyPrefix', 'urlTemplate'],
        properties: {
          repoUrl: {
            title: 'Repository Location',
            description:
              'Accepts the format `github.com?repo=reponame&owner=owner` where `reponame` is the new repository name and `owner` is an organization or username',
            type: 'string',
          },
          keyPrefix: {
            title: 'Key Prefix',
            description:
              'This prefix appended by certain characters will generate a link any time it is found in an issue, pull request, or commit.',
            type: 'string',
          },
          urlTemplate: {
            title: 'URL Template',
            description:
              'The URL must contain `<num>` for the reference number. `<num>` matches different characters depending on the value of isAlphanumeric.',
            type: 'string',
          },
          isAlphanumeric: {
            title: 'Alphanumeric',
            description:
              'Whether this autolink reference matches alphanumeric characters. If `true`, the `<num>` parameter of the `url_template` matches alphanumeric characters `A-Z` (case insensitive), `0-9`, and `-`. If `false`, this autolink reference only matches numeric characters. Default: `true`',
            type: 'boolean',
            default: true,
          },
          token: {
            title: 'Authentication Token',
            type: 'string',
            description: 'The token to use for authorization to GitHub',
          },
        },
      },
    },
    async handler(ctx) {
      const { repoUrl, keyPrefix, urlTemplate, isAlphanumeric, token } =
        ctx.input;

      ctx.logger.info(`Creating autolink reference for repo ${repoUrl}`);

      const { host, owner, repo } = parseRepoUrl(repoUrl, integrations);

      if (!owner) {
        throw new InputError('Invalid repository owner provided in repoUrl');
      }

      const client = new Octokit(
        await getOctokitOptions({
          integrations,
          host,
          owner,
          repo,
          credentialsProvider: githubCredentialsProvider,
          token,
        }),
      );

      await ctx.checkpoint({
        key: `create.auto.link.${owner}.${repo}`,
        fn: async () => {
          await client.rest.repos.createAutolink({
            owner,
            repo,
            key_prefix: keyPrefix,
            url_template: urlTemplate,
            is_alphanumeric: isAlphanumeric,
          });

          ctx.logger.info(`Autolink reference created successfully`);
        },
      });
    },
  });
}
