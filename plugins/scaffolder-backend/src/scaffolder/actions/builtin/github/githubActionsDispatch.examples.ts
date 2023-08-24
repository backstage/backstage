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
    description: 'GitHub Action Workflow Without Inputs.',
    example: yaml.stringify({
      steps: [
        {
          action: 'github:actions:dispatch',
          name: 'Dispatch Github Action Workflow',
          input: {
            repoUrl: 'github.com?repo=repo&owner=owner',
            workflowId: 'WORKFLOW_ID',
            branchOrTagName: 'main',
          },
        },
      ],
    }),
  },
  {
    description: 'GitHub Action Workflow With Inputs',
    example: yaml.stringify({
      steps: [
        {
          action: 'github:actions:dispatch',
          name: 'Dispatch Github Action Workflow with inputs',
          input: {
            repoUrl: 'github.com?repo=repo&owner=owner',
            workflowId: 'WORKFLOW_ID',
            branchOrTagName: 'main',
            workflowInputs: {
              input1: 'value1',
              input2: 'value2',
            },
          },
        },
      ],
    }),
  },
  {
    description: 'GitHub Action Workflow With Custom Token',
    example: yaml.stringify({
      steps: [
        {
          action: 'github:actions:dispatch',
          name: 'Dispatch GitHub Action Workflow (custom token)',
          input: {
            repoUrl: 'github.com?repo=reponame&owner=owner',
            workflowId: 'WORKFLOW_ID',
            branchOrTagName: 'release-1.0',
            token: '${{ secrets.MY_CUSTOM_TOKEN }}',
          },
        },
      ],
    }),
  },
];
