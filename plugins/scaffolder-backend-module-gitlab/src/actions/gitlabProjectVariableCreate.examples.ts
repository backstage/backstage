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
    description: 'Creating a GitLab project variable of type env_var',
    example: yaml.stringify({
      steps: [
        {
          id: 'createVariable',
          action: 'gitlab:createGitlabProjectVariableAction',
          name: 'Create GitLab Project Variable',
          input: {
            repoUrl: 'gitlab.com?repo=repo&owner=owner',
            projectId: '123',
            key: 'MY_VARIABLE',
            value: 'my_value',
            variableType: 'env_var',
          },
        },
      ],
    }),
  },
  {
    description: 'Creating a GitLab project variable of type file',
    example: yaml.stringify({
      steps: [
        {
          id: 'createVariable',
          action: 'gitlab:createGitlabProjectVariableAction',
          name: 'Create GitLab Project Variable',
          input: {
            repoUrl: 'gitlab.com?repo=repo&owner=owner',
            projectId: '123',
            key: 'MY_VARIABLE',
            value: 'my-file-content',
            variableType: 'file',
          },
        },
      ],
    }),
  },
  {
    description: 'Create a GitLab project variable that is protected.',
    example: yaml.stringify({
      steps: [
        {
          id: 'createVariable',
          action: 'gitlab:createGitlabProjectVariableAction',
          name: 'Create GitLab Project Variable',
          input: {
            repoUrl: 'gitlab.com?repo=repo&owner=owner',
            projectId: '456',
            key: 'MY_VARIABLE',
            value: 'my_value',
            variableType: 'env_var',
            variableProtected: true,
          },
        },
      ],
    }),
  },
  {
    description: 'Create a GitLab project variable with masked flag as true',
    example: yaml.stringify({
      steps: [
        {
          id: 'createVariable',
          action: 'gitlab:createGitlabProjectVariableAction',
          name: 'Create GitLab Project Variable',
          input: {
            repoUrl: 'gitlab.com?repo=repo&owner=owner',
            projectId: '789',
            key: 'DB_PASSWORD',
            value: 'password123',
            variableType: 'env_var',
            masked: true,
          },
        },
      ],
    }),
  },
  {
    description: 'Create a GitLab project variable that is expandable.',
    example: yaml.stringify({
      steps: [
        {
          id: 'createVariable',
          action: 'gitlab:projectVariable:create',
          name: 'Create GitLab Project Variable',
          input: {
            repoUrl: 'gitlab.com?repo=repo&owner=owner',
            projectId: '123',
            key: 'MY_VARIABLE',
            value: 'my_value',
            variableType: 'env_var',
            raw: true,
          },
        },
      ],
    }),
  },
  {
    description:
      'Create a GitLab project variable with a specific environment scope.',
    example: yaml.stringify({
      steps: [
        {
          id: 'createVariable',
          action: 'gitlab:projectVariable:create',
          name: 'Create GitLab Project Variable',
          input: {
            repoUrl: 'gitlab.com?repo=repo&owner=owner',
            projectId: '123',
            key: 'MY_VARIABLE',
            value: 'my_value',
            variableType: 'env_var',
            environmentScope: 'production',
          },
        },
      ],
    }),
  },
  {
    description:
      'Create a GitLab project variable with a wildcard environment scope.',
    example: yaml.stringify({
      steps: [
        {
          id: 'createVariable',
          action: 'gitlab:projectVariable:create',
          name: 'Create GitLab Project Variable',
          input: {
            repoUrl: 'gitlab.com?repo=repo&owner=owner',
            projectId: '123',
            key: 'MY_VARIABLE',
            value: 'my_value',
            variableType: 'env_var',
            environmentScope: '*',
          },
        },
      ],
    }),
  },
];
