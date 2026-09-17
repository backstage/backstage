/*
 * Copyright 2023 The Backstage Authors
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
    description:
      'restrict push to the main branch, except for alice, bob, and the admins group',
    example: yaml.stringify({
      steps: [
        {
          id: 'createBranchRestriction',
          action: 'bitbucketCloud:branchRestriction:create',
          name: 'Create Bitbucket Cloud branch restriction',
          input: {
            repoUrl:
              'bitbucket.org?repo=repo&workspace=workspace&project=project',
            kind: 'push',
            users: [
              {
                uuid: '{a-b-c-d}',
              },
              {
                uuid: '{e-f-g-h}',
              },
            ],
            groups: [
              {
                slug: 'admins',
              },
            ],
          },
        },
      ],
    }),
  },
  {
    description:
      'restrict push to the main branch, except for the admins group',
    example: yaml.stringify({
      steps: [
        {
          id: 'restrictPushToFeatureBranches',
          action: 'bitbucketCloud:branchRestriction:create',
          name: 'Create Bitbucket Cloud branch restriction by branch type',
          input: {
            repoUrl:
              'bitbucket.org?repo=repo&workspace=workspace&project=project',
            kind: 'push',
            groups: [
              {
                slug: 'admins',
              },
            ],
          },
        },
      ],
    }),
  },
  {
    description:
      'require passing builds to merge to branches matching a pattern test-feature/*',
    example: yaml.stringify({
      steps: [
        {
          id: 'requirePassingBuildsToMergeByPattern',
          action: 'bitbucketCloud:branchRestriction:create',
          name: 'Create Bitbucket Cloud require passing build to merge to branches matching a pattern',
          input: {
            repoUrl:
              'bitbucket.org?repo=repo&workspace=workspace&project=project',
            kind: 'require_passing_builds_to_merge',
            branchMatchKind: 'glob',
            pattern: 'test-feature/*',
          },
        },
      ],
    }),
  },
  {
    description:
      'require approvals to merge to branches matching a pattern test-feature/*',
    example: yaml.stringify({
      steps: [
        {
          id: 'requireApprovalsToMergeByPattern',
          action: 'bitbucketCloud:branchRestriction:create',
          name: 'Create Bitbucket Cloud require approvals to merge branch restriction',
          input: {
            repoUrl:
              'bitbucket.org?repo=repo&workspace=workspace&project=project',
            kind: 'require_approvals_to_merge',
            branchMatchKind: 'glob',
            pattern: 'test-feature/*',
          },
        },
      ],
    }),
  },
];
