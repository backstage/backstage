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
    description: 'Create a GitHub repository ruleset requiring pull requests.',
    example: yaml.stringify({
      steps: [
        {
          action: 'github:ruleset:create',
          name: 'Create a pull request ruleset',
          input: {
            repoUrl: 'github.com?repo=repo&owner=owner',
            name: 'Require pull requests',
            enforcement: 'active',
            conditions: {
              refName: {
                include: ['~DEFAULT_BRANCH'],
                exclude: [],
              },
            },
            rules: [
              {
                type: 'pull_request',
                parameters: {
                  dismiss_stale_reviews_on_push: true,
                  require_code_owner_review: true,
                  require_last_push_approval: false,
                  required_approving_review_count: 1,
                  required_review_thread_resolution: true,
                },
              },
            ],
          },
        },
      ],
    }),
  },
  {
    description: 'Create a GitHub repository ruleset requiring status checks.',
    example: yaml.stringify({
      steps: [
        {
          action: 'github:ruleset:create',
          name: 'Create a required status checks ruleset',
          input: {
            repoUrl: 'github.com?repo=repo&owner=owner',
            name: 'Require status checks',
            enforcement: 'active',
            conditions: {
              refName: {
                include: ['~DEFAULT_BRANCH'],
                exclude: [],
              },
            },
            rules: [
              {
                type: 'required_status_checks',
                parameters: {
                  required_status_checks: [{ context: 'build' }],
                  strict_required_status_checks_policy: true,
                },
              },
            ],
          },
        },
      ],
    }),
  },
  {
    description: 'Create a GitHub repository ruleset with bypass actors.',
    example: yaml.stringify({
      steps: [
        {
          action: 'github:ruleset:create',
          name: 'Create a ruleset with bypass actors',
          input: {
            repoUrl: 'github.com?repo=repo&owner=owner',
            name: 'Require pull requests',
            enforcement: 'active',
            bypassActors: [
              {
                actorId: 1,
                actorType: 'Team',
                bypassMode: 'always',
              },
            ],
            conditions: {
              refName: {
                include: ['~DEFAULT_BRANCH'],
                exclude: [],
              },
            },
            rules: [
              {
                type: 'pull_request',
                parameters: {
                  dismiss_stale_reviews_on_push: false,
                  require_code_owner_review: false,
                  require_last_push_approval: false,
                  required_approving_review_count: 1,
                  required_review_thread_resolution: false,
                },
              },
            ],
          },
        },
      ],
    }),
  },
  {
    description: 'Create a GitHub repository tag ruleset.',
    example: yaml.stringify({
      steps: [
        {
          action: 'github:ruleset:create',
          name: 'Create a tag ruleset',
          input: {
            repoUrl: 'github.com?repo=repo&owner=owner',
            name: 'Protect release tags',
            target: 'tag',
            enforcement: 'active',
            conditions: {
              refName: {
                include: ['refs/tags/v*'],
                exclude: [],
              },
            },
            rules: [
              {
                type: 'deletion',
              },
            ],
          },
        },
      ],
    }),
  },
];
