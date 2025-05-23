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
import * as inputProps from './inputProperties';
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
  return createTemplateAction<{
    repoUrl: string;
    kind: string;
    branchMatchKind?: string;
    branchType?: string;
    pattern?: string;
    value?: number;
    users?: { uuid: string }[];
    groups?: { slug: string }[];
    token?: string;
  }>({
    id: 'bitbucketCloud:branchRestriction:create',
    examples,
    description:
      'Creates branch restrictions for a Bitbucket Cloud repository.',
    schema: {
      input: {
        type: 'object',
        required: ['repoUrl', 'kind'],
        properties: {
          repoUrl: inputProps.repoUrl,
          kind: inputProps.restriction.kind,
          branchMatchKind: inputProps.restriction.branchMatchKind,
          branchType: inputProps.restriction.branchType,
          pattern: inputProps.restriction.pattern,
          value: inputProps.restriction.value,
          users: inputProps.restriction.users,
          groups: inputProps.restriction.groups,
          token: inputProps.token,
        },
      },
      output: {
        type: 'object',
        properties: {
          json: {
            title: 'The response from bitbucket cloud',
            type: 'string',
          },
          statusCode: {
            title: 'The status code of the response',
            type: 'number',
          },
        },
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
        users: users.map(user => ({ uuid: user.uuid, type: 'user' })),
        groups: groups.map(group => ({ slug: group.slug, type: 'group' })),
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
