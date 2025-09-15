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
import * as yaml from 'yaml';

export const examples: TemplateExample[] = [
  {
    description: 'Create a simple issue',
    example: yaml.stringify({
      steps: [
        {
          action: 'github:issues:create',
          name: 'Create issue',
          input: {
            repoUrl: 'github.com?repo=repo&owner=owner',
            title: 'Bug report',
            body: 'Found a bug that needs to be fixed',
          },
        },
      ],
    }),
  },
  {
    description: 'Create an issue with labels and assignees',
    example: yaml.stringify({
      steps: [
        {
          action: 'github:issues:create',
          name: 'Create issue with metadata',
          input: {
            repoUrl: 'github.com?repo=repo&owner=owner',
            title: 'Feature request',
            body: 'This is a new feature request',
            labels: ['enhancement', 'needs-review'],
            assignees: ['octocat'],
            milestone: 1,
          },
        },
      ],
    }),
  },
  {
    description: 'Create an issue with specific token',
    example: yaml.stringify({
      steps: [
        {
          action: 'github:issues:create',
          name: 'Create issue with token',
          input: {
            repoUrl: 'github.com?repo=repo&owner=owner',
            title: 'Documentation update',
            body: 'Update the documentation for the new API',
            labels: ['documentation'],
            token: 'gph_YourGitHubToken',
          },
        },
      ],
    }),
  },
];
