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
    description: 'Creating a group at the top level',
    example: yaml.stringify({
      steps: [
        {
          id: 'gitlabGroup',
          name: 'Group',
          action: 'gitlab:group:ensureExists',
          input: {
            repoUrl: 'gitlab.com',
            path: ['group1'],
          },
        },
      ],
    }),
  },
  {
    description: 'Create a group nested within another group',
    example: yaml.stringify({
      steps: [
        {
          id: 'gitlabGroup',
          name: 'Group',
          action: 'gitlab:group:ensureExists',
          input: {
            repoUrl: 'gitlab.com',
            path: ['group1', 'group2'],
          },
        },
      ],
    }),
  },
  {
    description: 'Create a group nested within multiple other groups',
    example: yaml.stringify({
      steps: [
        {
          id: 'gitlabGroup',
          name: 'Group',
          action: 'gitlab:group:ensureExists',
          input: {
            repoUrl: 'gitlab.com',
            path: ['group1', 'group2', 'group3'],
          },
        },
      ],
    }),
  },
  {
    description: 'Create a group in dry run mode',
    example: yaml.stringify({
      steps: [
        {
          id: 'gitlabGroup',
          name: 'Group',
          action: 'gitlab:group:ensureExists',
          isDryRun: true,
          input: {
            repoUrl: 'https://gitlab.com/my-repo',
            path: ['group1', 'group2', 'group3'],
          },
        },
      ],
    }),
  },
  {
    description: 'Create a group nested within another group using objects',
    example: yaml.stringify({
      steps: [
        {
          id: 'gitlabGroup',
          name: 'Group',
          action: 'gitlab:group:ensureExists',
          input: {
            repoUrl: 'gitlab.com',
            path: [
              { name: 'Group 1', slug: 'group1' },
              { name: 'Group 2', slug: 'group2' },
              { name: 'Group 3', slug: 'group3' },
            ],
          },
        },
      ],
    }),
  },
];
