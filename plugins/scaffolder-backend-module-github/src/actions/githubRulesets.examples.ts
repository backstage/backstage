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

import { TemplateExample } from '@backstage/plugin-scaffolder-node';
import yaml from 'yaml';

export const examples: TemplateExample[] = [
  {
    description: `Require a pull request with one approval and passing status checks on the repository's default branch.`,
    example: yaml.stringify({
      steps: [
        {
          action: 'github:repo:rulesets:create',
          name: 'Protect default branch',
          input: {
            repoUrl: 'github.com?repo=repo&owner=owner',
            name: 'default-branch',
            conditions: {
              ref_name: {
                include: ['~DEFAULT_BRANCH'],
                exclude: [],
              },
            },
            rules: [
              { type: 'deletion' },
              { type: 'non_fast_forward' },
              {
                type: 'pull_request',
                parameters: {
                  required_approving_review_count: 1,
                  dismiss_stale_reviews_on_push: true,
                  require_code_owner_review: false,
                  require_last_push_approval: false,
                  required_review_thread_resolution: false,
                },
              },
              {
                type: 'required_status_checks',
                parameters: {
                  strict_required_status_checks_policy: true,
                  required_status_checks: [{ context: 'ci/build' }],
                },
              },
            ],
          },
        },
      ],
    }),
  },
  {
    description: `Evaluate a ruleset requiring signed commits on release branches without enforcing it. The evaluate enforcement level is not available on all GitHub plans.`,
    example: yaml.stringify({
      steps: [
        {
          action: 'github:repo:rulesets:create',
          name: 'Evaluate signed commits',
          input: {
            repoUrl: 'github.com?repo=repo&owner=owner',
            name: 'release-signed-commits',
            enforcement: 'evaluate',
            conditions: {
              ref_name: {
                include: ['refs/heads/release/*'],
              },
            },
            rules: [{ type: 'required_signatures' }],
          },
        },
      ],
    }),
  },
  {
    description: `Prevent version tags from being updated or deleted.`,
    example: yaml.stringify({
      steps: [
        {
          action: 'github:repo:rulesets:create',
          name: 'Protect version tags',
          input: {
            repoUrl: 'github.com?repo=repo&owner=owner',
            name: 'version-tags',
            target: 'tag',
            conditions: {
              ref_name: {
                include: ['refs/tags/v*'],
              },
            },
            rules: [{ type: 'update' }, { type: 'deletion' }],
          },
        },
      ],
    }),
  },
  {
    description: `Require linear history on all branches, allowing repository admins to bypass the ruleset.`,
    example: yaml.stringify({
      steps: [
        {
          action: 'github:repo:rulesets:create',
          name: 'Require linear history',
          input: {
            repoUrl: 'github.com?repo=repo&owner=owner',
            name: 'linear-history',
            conditions: {
              ref_name: {
                include: ['~ALL'],
              },
            },
            rules: [{ type: 'required_linear_history' }],
            bypassActors: [
              {
                actor_id: 5,
                actor_type: 'RepositoryRole',
                bypass_mode: 'always',
              },
            ],
          },
        },
      ],
    }),
  },
];
