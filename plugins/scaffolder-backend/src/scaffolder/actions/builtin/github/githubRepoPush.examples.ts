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
    description: 'Setup repo with no modifications to branch protection rules',
    example: yaml.stringify({
      steps: [
        {
          action: 'github:repo:push',
          name: 'Create test repo with testuser as owner.',
          input: {
            repoUrl: 'github.com?repo=test&owner=testuser',
          },
        },
      ],
    }),
  },
  {
    description: 'Setup repo with required codeowners check',
    example: yaml.stringify({
      steps: [
        {
          action: 'github:repo:push',
          name: 'Require codeowner branch protection rule',
          input: {
            repoUrl: 'github.com?repo=reponame&owner=owner',
            requireCodeOwnerReviews: true,
          },
        },
      ],
    }),
  },
  {
    description: 'Change the default required number of approvals',
    example: yaml.stringify({
      steps: [
        {
          action: 'github:repo:push',
          name: 'Require two approvals before merging',
          input: {
            repoUrl: 'github.com?repo=reponame&owner=owner',
            requiredApprovingReviewCount: 2,
          },
        },
      ],
    }),
  },
];
