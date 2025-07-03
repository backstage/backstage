/*
 * Copyright 2024 The Backstage Authors
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
import { Octokit } from 'octokit';
import {
  createTemplateAction,
  parseRepoUrl,
} from '@backstage/plugin-scaffolder-node';
import { examples } from './githubPagesEnable.examples';
import { getOctokitOptions } from '../util';

/**
 * Creates a new action that enables GitHub Pages for a repository.
 *
 * @public
 */
export function createGithubPagesEnableAction(options: {
  integrations: ScmIntegrationRegistry;
  githubCredentialsProvider?: GithubCredentialsProvider;
}) {
  const { integrations, githubCredentialsProvider } = options;

  return createTemplateAction({
    id: 'github:pages:enable',
    examples,
    description: 'Enables GitHub Pages for a repository.',
    schema: {
      input: {
        repoUrl: z =>
          z.string({
            description:
              'Accepts the format `github.com?repo=reponame&owner=owner` where `reponame` is the new repository name and `owner` is an organization or username',
          }),
        buildType: z =>
          z
            .enum(['legacy', 'workflow'], {
              description:
                'The GitHub Pages build type - `legacy` or `workflow`. Default is `workflow`',
            })
            .default('workflow')
            .optional(),
        sourceBranch: z =>
          z
            .string({
              description: 'The GitHub Pages source branch. Default is "main"',
            })
            .default('main')
            .optional(),
        sourcePath: z =>
          z
            .enum(['/', '/docs'], {
              description:
                'The GitHub Pages source path - "/" or "/docs". Default is "/"',
            })
            .default('/')
            .optional(),
        token: z =>
          z
            .string({
              description: 'The token to use for authorization to GitHub',
            })
            .optional(),
      },
    },
    async handler(ctx) {
      const {
        repoUrl,
        buildType = 'workflow',
        sourceBranch = 'main',
        sourcePath = '/',
        token: providedToken,
      } = ctx.input;

      const { host, owner, repo } = parseRepoUrl(repoUrl, integrations);

      if (!owner) {
        throw new InputError('Invalid repository owner provided in repoUrl');
      }

      const octokitOptions = await getOctokitOptions({
        integrations,
        credentialsProvider: githubCredentialsProvider,
        token: providedToken,
        host,
        owner,
        repo,
      });
      const client = new Octokit({
        ...octokitOptions,
        log: ctx.logger,
      });

      ctx.logger.info(
        `Attempting to enable GitHub Pages for ${owner}/${repo} with "${buildType}" build type, on source branch "${sourceBranch}" and source path "${sourcePath}"`,
      );

      await ctx.checkpoint({
        key: `enabled.github.pages.${owner}.${repo}`,
        fn: async () => {
          await client.request('POST /repos/{owner}/{repo}/pages', {
            owner: owner,
            repo: repo,
            build_type: buildType,
            source: {
              branch: sourceBranch,
              path: sourcePath,
            },
            headers: {
              'X-GitHub-Api-Version': '2022-11-28',
            },
          });
        },
      });

      ctx.logger.info('Completed enabling GitHub Pages');
    },
  });
}
