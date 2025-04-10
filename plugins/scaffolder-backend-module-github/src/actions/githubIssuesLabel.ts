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
import { assertError, InputError } from '@backstage/errors';
import { Octokit } from 'octokit';
import { getOctokitOptions } from '../util';
import { examples } from './githubIssuesLabel.examples';

/**
 * Adds labels to a pull request or issue on GitHub
 * @public
 */
export function createGithubIssuesLabelAction(options: {
  integrations: ScmIntegrationRegistry;
  githubCredentialsProvider?: GithubCredentialsProvider;
}) {
  const { integrations, githubCredentialsProvider } = options;

  return createTemplateAction<{
    repoUrl: string;
    number: number;
    labels: string[];
    token?: string;
  }>({
    id: 'github:issues:label',
    description: 'Adds labels to a pull request or issue on GitHub.',
    examples,
    schema: {
      input: {
        type: 'object',
        required: ['repoUrl', 'number', 'labels'],
        properties: {
          repoUrl: {
            title: 'Repository Location',
            description:
              'Accepts the format `github.com?repo=reponame&owner=owner` where `reponame` is the repository name and `owner` is an organization or username',
            type: 'string',
          },
          number: {
            title: 'Pull Request or issue number',
            description: 'The pull request or issue number to add labels to',
            type: 'number',
          },
          labels: {
            title: 'Labels',
            description: 'The labels to add to the pull request or issue',
            type: 'array',
            items: {
              type: 'string',
            },
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
      const { repoUrl, number, labels, token: providedToken } = ctx.input;

      const { host, owner, repo } = parseRepoUrl(repoUrl, integrations);
      ctx.logger.info(`Adding labels to ${number} issue on repo ${repo}`);

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

      try {
        await ctx.checkpoint({
          key: `github.issues.add.label.${owner}.${repo}.${number}`,
          fn: async () => {
            await client.rest.issues.addLabels({
              owner,
              repo,
              issue_number: number,
              labels,
            });
          },
        });
      } catch (e) {
        assertError(e);
        ctx.logger.warn(
          `Failed: adding labels to issue: '${number}' on repo: '${repo}', ${e.message}`,
        );
      }
    },
  });
}
