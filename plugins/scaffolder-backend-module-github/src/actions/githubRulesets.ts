/*
 * Copyright 2026 The Backstage Authors
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
import {
  createTemplateAction,
  parseRepoUrl,
} from '@backstage/plugin-scaffolder-node';
import { Octokit } from 'octokit';
import { examples } from './githubRulesets.examples';
import { getOctokitOptions } from '../util';

type CreateRepoRulesetParameters = Parameters<
  Octokit['rest']['repos']['createRepoRuleset']
>[0] & {};

/**
 * Creates a `github:repo:rulesets:create` Scaffolder action that creates a ruleset in a GitHub repository.
 *
 * @public
 */
export function createGithubRepoRulesetsCreateAction(options: {
  integrations: ScmIntegrationRegistry;
  githubCredentialsProvider?: GithubCredentialsProvider;
  requireScmUserCredentials?: boolean;
}) {
  const { integrations, githubCredentialsProvider, requireScmUserCredentials } =
    options;

  return createTemplateAction({
    id: 'github:repo:rulesets:create',
    description: 'Creates a ruleset in a GitHub repository.',
    examples,
    schema: {
      input: {
        repoUrl: z =>
          z.string({
            description:
              'Accepts the format `github.com?repo=reponame&owner=owner` where `reponame` is the repository name and `owner` is an organization or username',
          }),
        name: z =>
          z.string({
            description: 'The name of the ruleset',
          }),
        target: z =>
          z
            .enum(['branch', 'tag'], {
              description:
                'The target of the ruleset - `branch` or `tag`. Default is `branch`',
            })
            .default('branch'),
        enforcement: z =>
          z
            .enum(['active', 'evaluate', 'disabled'], {
              description:
                'The enforcement level of the ruleset - `active`, `evaluate` or `disabled`. Default is `active`. `evaluate` is not available on all GitHub plans, see https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets',
            })
            .default('active'),
        conditions: z =>
          z
            .object(
              {
                ref_name: z
                  .object({
                    include: z.array(z.string()).optional(),
                    exclude: z.array(z.string()).optional(),
                  })
                  .optional(),
              },
              {
                description:
                  'The conditions that determine which refs the ruleset applies to. Ref name patterns also accept `~DEFAULT_BRANCH` and `~ALL`. Without conditions, the ruleset applies to no refs',
              },
            )
            .optional(),
        rules: z =>
          z
            .array(
              z.object({
                type: z.string(),
                parameters: z.record(z.string(), z.any()).optional(),
              }),
              {
                description:
                  'The rules to enforce, in the format of the GitHub REST API, for example `{ type: pull_request, parameters: { ... } }`',
              },
            )
            .optional(),
        bypassActors: z =>
          z
            .array(
              z.object({
                actor_id: z.number().int().nullable().optional(),
                actor_type: z.string(),
                bypass_mode: z
                  .enum(['always', 'pull_request', 'exempt'])
                  .optional(),
              }),
              {
                description:
                  'The actors that can bypass the ruleset, in the format of the GitHub REST API',
              },
            )
            .optional(),
        token: z =>
          z
            .string({
              description: 'The token to use for authorization to GitHub',
            })
            .optional(),
      },
      output: {
        id: z =>
          z.number({
            description: 'The ID of the created ruleset',
          }),
      },
    },
    async handler(ctx) {
      const {
        repoUrl,
        name,
        target = 'branch',
        enforcement = 'active',
        conditions,
        rules,
        bypassActors,
        token: providedToken,
      } = ctx.input;

      const { host, owner, repo } = parseRepoUrl(repoUrl, integrations);

      if (!owner) {
        throw new InputError(`No owner provided for repo ${repoUrl}`);
      }

      const octokitOptions = await getOctokitOptions({
        integrations,
        requireScmUserCredentials,
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

      ctx.logger.info(`Creating ruleset "${name}" in ${owner}/${repo}`);

      const id = await ctx.checkpoint({
        key: `create.ruleset.${JSON.stringify([host, owner, repo, name])}`,
        fn: async () => {
          const { data } = await client.rest.repos.createRepoRuleset({
            owner,
            repo,
            name,
            target,
            enforcement,
            conditions,
            rules: rules as CreateRepoRulesetParameters['rules'],
            bypass_actors:
              bypassActors as CreateRepoRulesetParameters['bypass_actors'],
          });
          return data.id;
        },
      });

      ctx.output('id', id);
    },
  });
}
