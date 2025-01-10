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
import { getAuthorizationHeader } from './helpers';
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
  users?: Array<object>;
  groups?: Array<object>;
  authorization: string;
  apiBaseUrl: string;
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
    apiBaseUrl,
  } = opts;

  const body = new Map();
  body.set('branch_match_kind', branchMatchKind || 'branching_model');
  if (kind in ['push', 'restrict_merges']) {
    body.set('users', kind in ['push', 'restrict_merges'] ? users || [] : null);
    body.set(
      'groups',
      kind in ['push', 'restrict_merges'] ? groups || [] : null,
    );
  }
  body.set('kind', kind);
  if (
    kind === 'require_approvals_to_merge' ||
    kind === 'require_default_reviewer_approvals_to_merge' ||
    kind === 'require_commits_behind' ||
    kind === 'require_passing_builds_to_merge'
  ) {
    body.set('value', value || 1);
  }
  if (branchMatchKind === 'glob') {
    body.set('pattern', pattern || '');
  }
  if (branchMatchKind === 'branching_model') {
    body.set('branch_type', branchType || 'development');
  }

  const options: RequestInit = {
    method: 'POST',
    body: JSON.stringify(Object.fromEntries(body)),
    headers: {
      Authorization: authorization,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  };

  let response: Response;
  try {
    response = await fetch(
      `${apiBaseUrl}/repositories/${workspace}/${repo}/branch-restrictions`,
      options,
    );
  } catch (e) {
    throw new Error(
      `Unable to set branch restrictions for the repository, ${e}`,
    );
  }

  if (response.status !== 201) {
    throw new Error(
      `Unable to set branch restrictions for the repository, ${
        response.status
      } ${response.statusText}, ${await response.text()}`,
    );
  }
  return response;
};

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
    users?: Array<object>;
    groups?: Array<object>;
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
        pattern,
        value,
        users,
        groups,
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

      const authorization = getAuthorizationHeader(
        ctx.input.token ? { token: ctx.input.token } : integrationConfig.config,
      );

      const apiBaseUrl = integrationConfig.config.apiBaseUrl;

      const response = await createBitbucketCloudBranchRestriction({
        workspace: workspace,
        repo,
        kind: kind,
        branchMatchKind: branchMatchKind,
        branchType: branchType,
        pattern: pattern,
        value: value,
        users: users,
        groups: groups,
        authorization,
        apiBaseUrl,
      });
      ctx.output('statusCode', response.status);
      ctx.output('json', JSON.stringify(await response.json()));
    },
  });
}
