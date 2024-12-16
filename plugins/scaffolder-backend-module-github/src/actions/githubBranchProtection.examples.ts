/*
 * Copyright 2024 The Backstage Authors
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
    description: `GitHub Branch Protection for repository's default branch.`,
    example: yaml.stringify({
      steps: [
        {
          action: 'github:branch-protection:create',
          name: 'Setup Branch Protection',
          input: {
            repoUrl: 'github.com?repo=repo&owner=owner',
          },
        },
      ],
    }),
  },
  {
    description: `GitHub Branch Protection for a specific branch.`,
    example: yaml.stringify({
      steps: [
        {
          action: 'github:branch-protection:create',
          name: 'Setup Branch Protection',
          input: {
            repoUrl: 'github.com?repo=repo&owner=owner',
            branch: 'my-awesome-branch',
          },
        },
      ],
    }),
  },
  {
    description: `GitHub Branch Protection and required commit signing on default branch.`,
    example: yaml.stringify({
      steps: [
        {
          action: 'github:branch-protection:create',
          name: 'Setup Branch Protection',
          input: {
            repoUrl: 'github.com?repo=repo&owner=owner',
            requireCodeOwnerReviews: true,
            requiredStatusCheckContexts: ['test'],
            dismissStaleReviews: true,
            requireLastPushApproval: true,
            requiredConversationResolution: true,
            requiredCommitSigning: true,
          },
        },
      ],
    }),
  },
  {
    description: `GitHub Branch Protection and required linear history on default branch.`,
    example: yaml.stringify({
      steps: [
        {
          action: 'github:branch-protection:create',
          name: 'Setup Branch Protection',
          input: {
            repoUrl: 'github.com?repo=repo&owner=owner',
            requireCodeOwnerReviews: true,
            requiredStatusCheckContexts: ['test'],
            dismissStaleReviews: true,
            requireLastPushApproval: true,
            requiredConversationResolution: true,
            requiredCommitSigning: true,
            requiredLinearHistory: true,
          },
        },
      ],
    }),
  },
];
