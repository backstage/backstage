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

import { z as zod } from 'zod';

const repoUrl = (z: typeof zod) =>
  z.string({
    description: `Accepts the format 'bitbucket.org?repo=reponame&workspace=workspace&project=project' where 'reponame' is the new repository name`,
  });

const workspace = (z: typeof zod) =>
  z.string({
    description: 'The workspace name',
  });

const repo_slug = (z: typeof zod) =>
  z.string({
    description: 'The repository name',
  });

const ref_type = (z: typeof zod) =>
  z.string({
    description: 'ref_type',
  });

const type = (z: typeof zod) =>
  z.string({
    description: 'type',
  });

const ref_name = (z: typeof zod) =>
  z.string({
    description: 'ref_name',
  });

const source = (z: typeof zod) =>
  z.string({
    description: 'source',
  });

const destination = (z: typeof zod) =>
  z.string({
    description: 'destination',
  });

const hash = (z: typeof zod) =>
  z.string({
    description: 'hash',
  });

const pattern = (z: typeof zod) =>
  z.string({
    description: 'pattern',
  });

const id = (z: typeof zod) =>
  z.string({
    description: 'id',
  });

const key = (z: typeof zod) =>
  z.string({
    description: 'key',
  });

const value = (z: typeof zod) =>
  z.string({
    description: 'value',
  });

const secured = (z: typeof zod) =>
  z.boolean({
    description: 'secured',
  });

const token = (z: typeof zod) =>
  z
    .string({
      description: 'The token to use for authorization to BitBucket Cloud',
    })
    .optional();

const destination_commit = (z: typeof zod) =>
  z.object({
    hash: hash(z),
  });

const commit = (z: typeof zod) =>
  z.object({
    type: type(z),
    hash: hash(z),
  });

const selector = (z: typeof zod) =>
  z.object({
    type: type(z),
    pattern: pattern(z),
  });

const pull_request = (z: typeof zod) =>
  z.object({
    id: id(z),
  });

const pipelinesRunBody = (z: typeof zod) =>
  z
    .object(
      {
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
              secured: secured(z),
            }),
          )
          .optional(),
      },
      {
        description:
          'Request body properties: see Bitbucket Cloud Rest API documentation for more details',
      },
    )
    .optional();

const restriction = {
  kind: (z: typeof zod) =>
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
  branchMatchKind: (z: typeof zod) =>
    z
      .enum(['glob', 'branching_model'], {
        description: 'The branch match kind.',
      })
      .optional(),
  branchType: (z: typeof zod) =>
    z
      .enum(
        ['feature', 'bugfix', 'release', 'hotfix', 'development', 'production'],
        {
          description:
            'The branch type. When branchMatchKind is set to branching_model, this field is required.',
        },
      )
      .optional(),
  pattern: (z: typeof zod) =>
    z
      .string({
        description:
          'The pattern to match branches against. This field is required when branchMatchKind is set to glob.',
      })
      .optional(),
  value: (z: typeof zod) =>
    z
      .union([z.number(), z.null()], {
        description:
          'The value of the restriction. This field is required when kind is one of require_approvals_to_merge / require_default_reviewer_approvals_to_merge / require_passing_builds_to_merge / require_commits_behind.',
      })
      .optional(),
  users: (z: typeof zod) =>
    z
      .array(
        z.object({
          uuid: z.string({
            description: 'The UUID of the user in the format "{a-b-c-d}".',
          }),
        }),
        {
          description:
            'Names of users that can bypass the push / restrict_merges restriction kind. For any other kind, this field will be ignored.',
        },
      )
      .optional(),
  groups: (z: typeof zod) =>
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
};

export { workspace, repo_slug, pipelinesRunBody, token };
export { repoUrl, restriction };
