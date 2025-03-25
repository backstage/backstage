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

const repoUrl = {
  title: 'Repository Location',
  description: `Accepts the format 'bitbucket.org?repo=reponame&workspace=workspace&project=project' where 'reponame' is the new repository name`,
  type: 'string',
};

const workspace = {
  title: 'Workspace',
  description: `The workspace name`,
  type: 'string',
};

const repo_slug = {
  title: 'Repository name',
  description: 'The repository name',
  type: 'string',
};

const ref_type = {
  title: 'ref_type',
  type: 'string',
};

const type = {
  title: 'type',
  type: 'string',
};

const ref_name = {
  title: 'ref_name',
  type: 'string',
};
const source = {
  title: 'source',
  type: 'string',
};
const destination = {
  title: 'destination',
  type: 'string',
};
const hash = {
  title: 'hash',
  type: 'string',
};

const pattern = {
  title: 'pattern',
  type: 'string',
};

const id = {
  title: 'id',
  type: 'string',
};

const key = {
  title: 'key',
  type: 'string',
};
const value = {
  title: 'value',
  type: 'string',
};
const secured = {
  title: 'secured',
  type: 'boolean',
};

const token = {
  title: 'Authentication Token',
  type: 'string',
  description: 'The token to use for authorization to BitBucket Cloud',
};

const destination_commit = {
  title: 'destination_commit',
  type: 'object',
  properties: {
    hash,
  },
};

const commit = {
  title: 'commit',
  type: 'object',
  properties: {
    type,
    hash,
  },
};

const selector = {
  title: 'selector',
  type: 'object',
  properties: {
    type,
    pattern,
  },
};

const pull_request = {
  title: 'pull_request',
  type: 'object',
  properties: {
    id,
  },
};

const pipelinesRunBody = {
  title: 'Request Body',
  description:
    'Request body properties: see Bitbucket Cloud Rest API documentation for more details',
  type: 'object',
  properties: {
    target: {
      title: 'target',
      type: 'object',
      properties: {
        ref_type,
        type,
        ref_name,
        source,
        destination,
        destination_commit,
        commit,
        selector,
        pull_request,
      },
    },
    variables: {
      title: 'variables',
      type: 'array',
      items: {
        type: 'object',
        properties: {
          key,
          value,
          secured,
        },
      },
    },
  },
};

const restriction = {
  kind: {
    title: 'kind',
    description: 'The kind of restriction.',
    type: 'string',
    enum: [
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
  },
  branchMatchKind: {
    title: 'branch_match_kind',
    description: 'The branch match kind.',
    type: 'string',
    enum: ['glob', 'branching_model'],
  },
  branchType: {
    title: 'branch_type',
    description:
      'The branch type. When branchMatchKind is set to branching_model, this field is required.',
    type: 'string',
    enum: [
      'feature',
      'bugfix',
      'release',
      'hotfix',
      'development',
      'production',
    ],
  },
  pattern: {
    title: 'pattern',
    description:
      'The pattern to match branches against. This field is required when branchMatchKind is set to glob.',
    type: 'string',
  },
  value: {
    title: 'value',
    description:
      'The value of the restriction. This field is required when kind is one of require_approvals_to_merge / require_default_reviewer_approvals_to_merge / require_passing_builds_to_merge / require_commits_behind.',
    type: 'number',
  },
  users: {
    title: 'users',
    description:
      'Names of users that can bypass the push / restrict_merges restriction kind. For any other kind, this field will be ignored.',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        uuid: {
          title: 'uuid',
          description: 'The UUID of the user in the format "{a-b-c-d}".',
          type: 'string',
        },
      },
    },
  },
  groups: {
    title: 'groups',
    description:
      'Names of groups that can bypass the push / restrict_merges restriction kind. For any other kind, this field will be ignored.',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        slug: {
          title: 'slug',
          description: 'The name of the group.',
          type: 'string',
        },
      },
    },
  },
};

export { workspace, repo_slug, pipelinesRunBody, token };
export { repoUrl, restriction };
