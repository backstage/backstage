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
    description: 'Add users to a group using numeric group ID',
    example: yaml.stringify({
      steps: [
        {
          id: 'gitlabGroupAccess',
          name: 'Add Users to Group',
          action: 'gitlab:group:access',
          input: {
            repoUrl: 'gitlab.com',
            path: 123,
            userIds: [456, 789],
            accessLevel: 30,
          },
        },
      ],
    }),
  },
  {
    description: 'Add users to a group using string path',
    example: yaml.stringify({
      steps: [
        {
          id: 'gitlabGroupAccess',
          name: 'Add Users to Group',
          action: 'gitlab:group:access',
          input: {
            repoUrl: 'gitlab.com',
            path: 'group1',
            userIds: [456],
            accessLevel: 'developer',
          },
        },
      ],
    }),
  },
  {
    description: 'Remove users from a group',
    example: yaml.stringify({
      steps: [
        {
          id: 'gitlabGroupAccess',
          name: 'Remove Users from Group',
          action: 'gitlab:group:access',
          input: {
            repoUrl: 'gitlab.com',
            path: 123,
            userIds: [456, 789],
            action: 'remove',
          },
        },
      ],
    }),
  },
  {
    description: 'Share a group with another group',
    example: yaml.stringify({
      steps: [
        {
          id: 'gitlabGroupAccess',
          name: 'Share Group',
          action: 'gitlab:group:access',
          input: {
            repoUrl: 'gitlab.com',
            path: 123,
            groupIds: [456],
            accessLevel: 30,
          },
        },
      ],
    }),
  },
  {
    description: 'Unshare a group',
    example: yaml.stringify({
      steps: [
        {
          id: 'gitlabGroupAccess',
          name: 'Unshare Group',
          action: 'gitlab:group:access',
          input: {
            repoUrl: 'gitlab.com',
            path: 123,
            groupIds: [456],
            action: 'remove',
          },
        },
      ],
    }),
  },
];
