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

  return createTemplateAction<{
    repoUrl: string;
    buildType?: 'legacy' | 'workflow';
    sourceBranch?: string;
    sourcePath?: '/' | '/docs';
    token?: string;
  }>({
    id: 'github:pages:enable',
    examples,
    description: 'Enables GitHub Pages for a repository.',
    schema: {
      input: {
        type: 'object',
        required: ['repoUrl'],
        properties: {
          repoUrl: {
            title: 'Repository Location',
            description:
              'Accepts the format `github.com?repo=reponame&owner=owner` where `reponame` is the new repository name and `owner` is an organization or username',
            type: 'string',
          },
          buildType: {
            title: 'Build Type',
            type: 'string',
            default: 'workflow',
            description:
              'The GitHub Pages build type - `legacy` or `workflow`. Default is `workflow`',
            enum: ['legacy', 'workflow'],
          },
          sourceBranch: {
            title: 'Source Branch',
            type: 'string',
            default: 'main',
            description: 'The GitHub Pages source branch. Default is "main"',
          },
          sourcePath: {
            title: 'Source Path',
            type: 'string',
            default: '/',
            description:
              'The GitHub Pages source path - "/" or "/docs". Default is "/"',
            enum: ['/', '/docs'],
          },
          token: {
            title: 'Authorization Token',
            type: 'string',
            description: 'The token to use for authorization to GitHub',
          },
        },
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
      const client = new Octokit(octokitOptions);

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
