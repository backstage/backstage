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
  ScmIntegrations,
} from '@backstage/integration';
import {
  createTemplateAction,
  parseRepoUrl,
} from '@backstage/plugin-scaffolder-node';
import { Octokit } from 'octokit';
import { getOctokitOptions } from '../util';
import { examples } from './githubRulesetCreate.examples';

type CreateRepoRulesetParams = NonNullable<
  Parameters<Octokit['rest']['repos']['createRepoRuleset']>[0]
>;

/**
 * Creates a GitHub repository ruleset.
 *
 * @public
 */
export function createGithubRulesetCreateAction(options: {
  integrations: ScmIntegrations;
  githubCredentialsProvider?: GithubCredentialsProvider;
}) {
  const { integrations, githubCredentialsProvider } = options;

  return createTemplateAction({
    id: 'github:ruleset:create',
    description: 'Creates a GitHub repository ruleset.',
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
            description: 'The name of the ruleset.',
          }),
        target: z =>
          z
            .enum(['branch', 'tag', 'push'], {
              description:
                'The target of the ruleset. The default value is `branch`.',
            })
            .default('branch')
            .optional(),
        enforcement: z =>
          z.enum(['disabled', 'active', 'evaluate'], {
            description: 'The enforcement level of the ruleset.',
          }),
        bypassActors: z =>
          z
            .array(
              z.object({
                actorId: z.number().nullable().optional(),
                actorType: z.enum([
                  'Integration',
                  'OrganizationAdmin',
                  'RepositoryRole',
                  'Team',
                  'DeployKey',
                  'User',
                ]),
                bypassMode: z
                  .enum(['always', 'pull_request', 'exempt'])
                  .optional(),
              }),
              {
                description:
                  'Actors that can bypass the rules in this ruleset.',
              },
            )
            .optional(),
        conditions: z =>
          z
            .object(
              {
                refName: z
                  .object({
                    include: z.array(z.string()),
                    exclude: z.array(z.string()),
                  })
                  .optional(),
              },
              {
                description:
                  'Conditions for matching refs. Use `~DEFAULT_BRANCH` to include the default branch or `~ALL` to include all branches.',
              },
            )
            .optional(),
        rules: z =>
          z.array(z.record(z.any()), {
            description:
              'The rules within the ruleset, using the GitHub REST API rule shape.',
          }),
        token: z =>
          z
            .string({
              description: 'The token to use for authorization to GitHub',
            })
            .optional(),
      },
      output: {
        rulesetId: z =>
          z.number({
            description: 'The ID of the created ruleset.',
          }),
        rulesetName: z =>
          z.string({
            description: 'The name of the created ruleset.',
          }),
        rulesetUrl: z =>
          z
            .string({
              description: 'The API URL of the created ruleset.',
            })
            .optional(),
      },
    },
    async handler(ctx) {
      const {
        repoUrl,
        name,
        target = 'branch',
        enforcement,
        bypassActors,
        conditions,
        rules,
        token,
      } = ctx.input;

      const { host, owner, repo } = parseRepoUrl(repoUrl, integrations);

      if (!owner) {
        throw new InputError('Invalid repository owner provided in repoUrl');
      }

      const octokitOptions = await getOctokitOptions({
        integrations,
        credentialsProvider: githubCredentialsProvider,
        token,
        host,
        owner,
        repo,
      });
      const client = new Octokit({
        ...octokitOptions,
        log: ctx.logger,
      });
      // GitHub supports User actors and exempt bypass mode for repository
      // rulesets, but the generated Octokit type in this repo is narrower.
      const bypassActorsParam = bypassActors?.map(actor => ({
        actor_id: actor.actorId,
        actor_type: actor.actorType,
        bypass_mode: actor.bypassMode,
      })) as CreateRepoRulesetParams['bypass_actors'];

      const ruleset = await ctx.checkpoint({
        key: `create.ruleset.${owner}.${repo}.${name}`,
        fn: async () => {
          const response = await client.rest.repos.createRepoRuleset({
            owner,
            repo,
            name,
            target,
            enforcement,
            bypass_actors: bypassActorsParam,
            conditions: conditions?.refName
              ? {
                  ref_name: {
                    include: conditions.refName.include,
                    exclude: conditions.refName.exclude,
                  },
                }
              : undefined,
            rules: rules as CreateRepoRulesetParams['rules'],
          });

          return {
            id: response.data.id,
            name: response.data.name,
            rulesetUrl: response.data._links?.self?.href,
          };
        },
      });

      ctx.output('rulesetId', ruleset.id);
      ctx.output('rulesetName', ruleset.name);
      if (ruleset.rulesetUrl) {
        ctx.output('rulesetUrl', ruleset.rulesetUrl);
      }
    },
  });
}
