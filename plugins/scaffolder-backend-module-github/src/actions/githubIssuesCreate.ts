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
import { examples } from './githubIssuesCreate.examples';

/**
 * Creates an issue on GitHub
 * @public
 */
export function createGithubIssuesCreateAction(options: {
  integrations: ScmIntegrationRegistry;
  githubCredentialsProvider?: GithubCredentialsProvider;
}) {
  const { integrations, githubCredentialsProvider } = options;

  return createTemplateAction({
    id: 'github:issues:create',
    description: 'Creates an issue on GitHub.',
    examples,
    supportsDryRun: true,
    schema: {
      input: {
        repoUrl: z =>
          z.string({
            description:
              'Accepts the format `github.com?repo=reponame&owner=owner` where `reponame` is the repository name and `owner` is an organization or username',
          }),
        title: z =>
          z.string({
            description: 'The title of the issue',
          }),
        body: z =>
          z
            .string({
              description: 'The contents of the issue',
            })
            .optional(),
        assignees: z =>
          z
            .array(z.string(), {
              description:
                'Logins for Users to assign to this issue. NOTE: Only users with push access can set assignees for new issues. Assignees are silently dropped otherwise.',
            })
            .optional(),
        milestone: z =>
          z
            .union([z.string(), z.number()], {
              description:
                'The number of the milestone to associate this issue with. NOTE: Only users with push access can set the milestone for new issues. The milestone is silently dropped otherwise.',
            })
            .optional(),
        labels: z =>
          z
            .array(z.string(), {
              description:
                'Labels to associate with this issue. NOTE: Only users with push access can set labels for new issues. Labels are silently dropped otherwise.',
            })
            .optional(),
        token: z =>
          z
            .string({
              description:
                'The `GITHUB_TOKEN` to use for authorization to GitHub',
            })
            .optional(),
      },
      output: {
        issueUrl: z =>
          z.string({
            description: 'The URL of the created issue',
          }),
        issueNumber: z =>
          z.number({
            description: 'The number of the created issue',
          }),
      },
    },
    async handler(ctx) {
      const {
        repoUrl,
        title,
        body,
        assignees,
        milestone,
        labels,
        token: providedToken,
      } = ctx.input;

      const { host, owner, repo } = parseRepoUrl(repoUrl, integrations);
      ctx.logger.info(`Creating issue "${title}" on repo ${repo}`);

      if (!owner) {
        throw new InputError('Invalid repository owner provided in repoUrl');
      }

      const octokitOptions = await getOctokitOptions({
        integrations,
        credentialsProvider: githubCredentialsProvider,
        host,
        owner,
        repo,
        token: providedToken,
      });

      const client = new Octokit({
        ...octokitOptions,
        log: ctx.logger,
      });

      if (ctx.isDryRun) {
        ctx.logger.info(`Performing dry run of creating issue "${title}"`);
        ctx.output('issueUrl', `https://github.com/${owner}/${repo}/issues/42`);
        ctx.output('issueNumber', 42);
        ctx.logger.info(`Dry run complete`);
        return;
      }

      try {
        const issue = await ctx.checkpoint({
          key: `github.issues.create.${owner}.${repo}.${title}`,
          fn: async () => {
            const response = await client.rest.issues.create({
              owner,
              repo,
              title,
              body,
              assignees,
              milestone,
              labels,
            });

            return {
              html_url: response.data.html_url,
              number: response.data.number,
            };
          },
        });

        if (!issue) {
          throw new Error('Failed to create issue');
        }

        ctx.output('issueUrl', issue.html_url);
        ctx.output('issueNumber', issue.number);

        ctx.logger.info(
          `Successfully created issue #${issue.number}: ${issue.html_url}`,
        );
      } catch (e) {
        assertError(e);
        ctx.logger.warn(
          `Failed: creating issue '${title}' on repo: '${repo}', ${e.message}`,
        );
        throw e;
      }
    },
  });
}
