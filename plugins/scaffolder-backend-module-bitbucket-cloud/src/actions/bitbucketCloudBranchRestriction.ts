/*
 * Copyright 2025 The Backstage Authors
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
import { ScmIntegrationRegistry } from '@backstage/integration';
import {
  createTemplateAction,
  parseRepoUrl,
} from '@backstage/plugin-scaffolder-node';
import { InputError } from '@backstage/errors';
import { getBitbucketClient } from './helpers';
import { examples } from './bitbucketCloudBranchRestriction.examples';

const createBitbucketCloudBranchRestriction = async (opts: {
  workspace: string;
  repo: string;
  kind: string;
  branchMatchKind?: string;
  branchType?: string;
  pattern?: string;
  value?: number;
  users?: { uuid: string; type: string }[];
  groups?: { slug: string; type: string }[];
  authorization: {
    token?: string;
    username?: string;
    appPassword?: string;
  };
}) => {
  const {
    workspace,
    repo,
    kind,
    branchMatchKind,
    branchType,
    pattern,
    value,
    users,
    groups,
    authorization,
  } = opts;

  const bitbucket = getBitbucketClient(authorization);
  return await bitbucket.branchrestrictions.create({
    _body: {
      groups: groups,
      users: users,
      branch_match_kind: branchMatchKind,
      kind: kind,
      type: 'branchrestriction',
      value: kind === 'push' ? null : value,
      pattern: branchMatchKind === 'glob' ? pattern : undefined,
      branch_type:
        branchMatchKind === 'branching_model' ? branchType : undefined,
    },
    repo_slug: repo,
    workspace: workspace,
  });
};

/**
 * Creates a new action that adds a branch restriction to a Bitbucket Cloud repository.
 * @public
 */
export function createBitbucketCloudBranchRestrictionAction(options: {
  integrations: ScmIntegrationRegistry;
}) {
  const { integrations } = options;
  return createTemplateAction({
    id: 'bitbucketCloud:branchRestriction:create',
    examples,
    description:
      'Creates branch restrictions for a Bitbucket Cloud repository.',
    schema: {
      input: {
        repoUrl: z =>
          z.string({
            description: `Accepts the format 'bitbucket.org?repo=reponame&workspace=workspace&project=project' where 'reponame' is the new repository name`,
          }),
        kind: z =>
          z.enum(
            [
              'push',
              'force',
              'delete',
              'restrict_merges',
              'require_tasks_to_be_completed',
              'require_approvals_to_merge',
              'require_default_reviewer_approvals_to_merge',
              'require_no_changes_requested',
              'require_passing_builds_to_merge',
              'require_commits_behind',
              'reset_pullrequest_approvals_on_change',
              'smart_reset_pullrequest_approvals',
              'reset_pullrequest_changes_requested_on_change',
              'require_all_dependencies_merged',
              'enforce_merge_checks',
              'allow_auto_merge_when_builds_pass',
            ],
            {
              description: 'The kind of restriction.',
            },
          ),
        branchMatchKind: z =>
          z
            .enum(['glob', 'branching_model'], {
              description: 'The branch match kind.',
            })
            .optional(),
        branchType: z =>
          z
            .enum(
              [
                'feature',
                'bugfix',
                'release',
                'hotfix',
                'development',
                'production',
              ],
              {
                description:
                  'The branch type. When branchMatchKind is set to branching_model, this field is required.',
              },
            )
            .optional(),
        pattern: z =>
          z
            .string({
              description:
                'The pattern to match branches against. This field is required when branchMatchKind is set to glob.',
            })
            .optional(),
        value: z =>
          z
            .number({
              description:
                'The value of the restriction. This field is required when kind is one of require_approvals_to_merge / require_default_reviewer_approvals_to_merge / require_passing_builds_to_merge / require_commits_behind.',
            })
            .optional(),
        users: z =>
          z
            .array(
              z.object({
                uuid: z.string({
                  description:
                    'The UUID of the user in the format "{a-b-c-d}".',
                }),
              }),
              {
                description:
                  'Names of users that can bypass the push / restrict_merges restriction kind. For any other kind, this field will be ignored.',
              },
            )
            .optional(),
        groups: z =>
          z
            .array(
              z.object({
                slug: z.string({
                  description: 'The name of the group.',
                }),
              }),
              {
                description:
                  'Names of groups that can bypass the push / restrict_merges restriction kind. For any other kind, this field will be ignored.',
              },
            )
            .optional(),
        token: z =>
          z
            .string({
              description:
                'The token to use for authorization to BitBucket Cloud',
            })
            .optional(),
      },
      output: {
        json: z =>
          z.string({
            description: 'The response from bitbucket cloud',
          }),
        statusCode: z =>
          z.number({
            description: 'The status code of the response',
          }),
      },
    },
    async handler(ctx) {
      const {
        repoUrl,
        kind,
        branchMatchKind = 'branching_model',
        branchType = 'development',
        pattern = '',
        value = 1,
        users = [],
        groups = [],
        token = '',
      } = ctx.input;

      const { workspace, repo, host } = parseRepoUrl(repoUrl, integrations);

      if (!workspace) {
        throw new InputError(
          `Invalid URL provider was included in the repo URL to create ${ctx.input.repoUrl}, missing workspace`,
        );
      }

      const integrationConfig = integrations.bitbucketCloud.byHost(host);
      if (!integrationConfig) {
        throw new InputError(
          `No matching integration configuration for host ${host}, please check your integrations config`,
        );
      }

      const authorization = token ? { token: token } : integrationConfig.config;

      const response = await createBitbucketCloudBranchRestriction({
        workspace: workspace,
        repo,
        kind: kind,
        branchMatchKind: branchMatchKind,
        branchType: branchType,
        pattern: pattern,
        value: value,
        users: users.map((user: { uuid: string }) => ({
          uuid: user.uuid,
          type: 'user',
        })),
        groups: groups.map((group: { slug: string }) => ({
          slug: group.slug,
          type: 'group',
        })),
        authorization,
      });
      if (response.data.errors) {
        ctx.logger.error(
          `Error from Bitbucket Cloud Branch Restrictions: ${JSON.stringify(
            response.data.errors,
          )}`,
        );
      }
      ctx.logger.info(
        `Response from Bitbucket Cloud: ${JSON.stringify(response)}`,
      );
      ctx.output('statusCode', response.status);
      ctx.output('json', JSON.stringify(response));
    },
  });
}
