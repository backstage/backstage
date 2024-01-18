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
      'Create a GitHub Environment (No Policies, No Variables, No Secrets)',
    example: yaml.stringify({
      steps: [
        {
          action: 'github:environment:create',
          name: 'Create Environment',
          input: {
            repoUrl: 'github.com?repo=repository&owner=owner',
            name: 'envname',
          },
        },
      ],
    }),
  },
  {
    description: 'Create a GitHub Environment with Protected Branch Policy',
    example: yaml.stringify({
      steps: [
        {
          action: 'github:environment:create',
          name: 'Create Environment',
          input: {
            repoUrl: 'github.com?repo=repository&owner=owner',
            name: 'envname',
            deploymentBranchPolicy: {
              protected_branches: true,
              custom_branch_policies: false,
            },
          },
        },
      ],
    }),
  },
  {
    description: 'Create a GitHub Environment with Custom Branch Policies',
    example: yaml.stringify({
      steps: [
        {
          action: 'github:environment:create',
          name: 'Create Environment',
          input: {
            repoUrl: 'github.com?repo=repository&owner=owner',
            name: 'envname',
            deploymentBranchPolicy: {
              protected_branches: false,
              custom_branch_policies: true,
            },
            customBranchPolicyNames: ['main', '*.*.*'],
          },
        },
      ],
    }),
  },
  {
    description:
      'Create a GitHub Environment with Environment Variables and Secrets',
    example: yaml.stringify({
      steps: [
        {
          action: 'github:environment:create',
          name: 'Create Environment',
          input: {
            repoUrl: 'github.com?repo=repository&owner=owner',
            name: 'envname',
            environmentVariables: {
              key1: 'val1',
              key2: 'val2',
            },
            secrets: {
              secret1: 'supersecret1',
              secret2: 'supersecret2',
            },
          },
        },
      ],
    }),
  },
];
