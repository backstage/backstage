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

const repoUrl = (z: any) =>
  z.string({
    description: `Accepts the format 'bitbucket.org?repo=reponame&workspace=workspace&project=project' where 'reponame' is the new repository name`,
  });

const workspace = (z: any) =>
  z.string({
    description: `The workspace name`,
  });

const repo_slug = (z: any) =>
  z.string({
    description: 'The repository name',
  });

const ref_type = (z: any) =>
  z.string({
    description: 'The ref type',
  });

const type = (z: any) =>
  z.string({
    description: 'The type',
  });

const ref_name = (z: any) =>
  z.string({
    description: 'The ref name',
  });

const source = (z: any) =>
  z.string({
    description: 'The source',
  });

const destination = (z: any) =>
  z.string({
    description: 'The destination',
  });

const hash = (z: any) =>
  z.string({
    description: 'The hash',
  });

const pattern = (z: any) =>
  z.string({
    description: 'The pattern',
  });

const id = (z: any) =>
  z.string({
    description: 'The id',
  });

const key = (z: any) =>
  z.string({
    description: 'The key',
  });

const value = (z: any) =>
  z.string({
    description: 'The value',
  });

const secured = (z: any) =>
  z.boolean({
    description: 'Whether the value is secured',
  });

const token = (z: any) =>
  z.string({
    description: 'The token to use for authorization to BitBucket Cloud',
  });

const destination_commit = (z: any) =>
  z.object({
    hash: hash(z),
  });

const commit = (z: any) =>
  z.object({
    type: type(z),
    hash: hash(z),
  });

const selector = (z: any) =>
  z.object({
    type: type(z),
    pattern: pattern(z),
  });

const pull_request = (z: any) =>
  z.object({
    id: id(z),
  });

const pipelinesRunBody = (z: any) =>
  z.object({
    target: z
      .object({
        ref_type: ref_type(z).optional(),
        type: type(z).optional(),
        ref_name: ref_name(z).optional(),
        source: source(z).optional(),
        destination: destination(z).optional(),
        destination_commit: destination_commit(z).optional(),
        commit: commit(z).optional(),
        selector: selector(z).optional(),
        pull_request: pull_request(z).optional(),
      })
      .optional(),
    variables: z
      .array(
        z.object({
          key: key(z),
          value: value(z),
          secured: secured(z).optional(),
        }),
      )
      .optional(),
  });

const restriction = (z: any) => ({
  kind: z.enum(
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
  branchMatchKind: z.enum(['glob', 'branching_model'], {
    description: 'The branch match kind.',
  }),
  branchType: z.enum(
    ['feature', 'bugfix', 'release', 'hotfix', 'development', 'production'],
    {
      description:
        'The branch type. When branchMatchKind is set to branching_model, this field is required.',
    },
  ),
  pattern: z.string({
    description:
      'The pattern to match branches against. This field is required when branchMatchKind is set to glob.',
  }),
  value: z.number({
    description:
      'The value of the restriction. This field is required when kind is one of require_approvals_to_merge / require_default_reviewer_approvals_to_merge / require_passing_builds_to_merge / require_commits_behind.',
  }),
  users: z.array(
    z.object({
      uuid: z.string({
        description: 'The UUID of the user in the format "{a-b-c-d}".',
      }),
    }),
    {
      description:
        'Names of users that can bypass the push / restrict_merges restriction kind. For any other kind, this field will be ignored.',
    },
  ),
  groups: z.array(
    z.object({
      slug: z.string({
        description: 'The name of the group.',
      }),
    }),
    {
      description:
        'Names of groups that can bypass the push / restrict_merges restriction kind. For any other kind, this field will be ignored.',
    },
  ),
});

export { workspace, repo_slug, pipelinesRunBody, token };
export { repoUrl, restriction };
