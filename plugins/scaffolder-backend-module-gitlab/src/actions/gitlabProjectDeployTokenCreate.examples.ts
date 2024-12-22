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
    description: 'Create a GitLab project deploy token with minimal options.',
    example: yaml.stringify({
      steps: [
        {
          id: 'createDeployToken',
          action: 'gitlab:projectDeployToken:create',
          name: 'Create GitLab Project Deploy Token',
          input: {
            repoUrl: 'gitlab.com?repo=repo&owner=owner',
            projectId: '456',
            name: 'tokenname',
            scopes: ['read_registry'],
          },
        },
      ],
    }),
  },
  {
    description:
      'Create a GitLab project deploy token with many custom scopes.',
    example: yaml.stringify({
      steps: [
        {
          id: 'createDeployToken',
          action: 'gitlab:projectDeployToken:create',
          name: 'Create GitLab Project Deploy Token',
          input: {
            repoUrl: 'gitlab.com?repo=repo&owner=owner',
            projectId: '789',
            name: 'tokenname',
            scopes: ['read_registry', 'write_repository'],
          },
        },
      ],
    }),
  },
  {
    description: 'Create a GitLab project deploy token with a specified name.',
    example: yaml.stringify({
      steps: [
        {
          id: 'createDeployToken',
          action: 'gitlab:projectDeployToken:create',
          name: 'Create GitLab Project Deploy Token',
          input: {
            repoUrl: 'gitlab.com?repo=repo&owner=owner',
            projectId: '101112',
            name: 'my-custom-token',
            scopes: ['read_registry'],
          },
        },
      ],
    }),
  },
  {
    description:
      'Create a GitLab project deploy token with a numeric project ID.',
    example: yaml.stringify({
      steps: [
        {
          id: 'createDeployToken',
          action: 'gitlab:projectDeployToken:create',
          name: 'Create GitLab Project Deploy Token',
          input: {
            repoUrl: 'gitlab.com?repo=repo&owner=owner',
            projectId: 42,
            name: 'tokenname',
            scopes: ['read_registry'],
          },
        },
      ],
    }),
  },

  {
    description: 'Create a GitLab project deploy token with a custom username',
    example: yaml.stringify({
      steps: [
        {
          id: 'createDeployToken',
          action: 'gitlab:projectDeployToken:create',
          name: 'Create GitLab Project Deploy Token',
          input: {
            repoUrl: 'gitlab.com?repo=repo&owner=owner',
            projectId: 42,
            name: 'tokenname',
            username: 'tokenuser',
            scopes: ['read_registry'],
          },
        },
      ],
    }),
  },
];
