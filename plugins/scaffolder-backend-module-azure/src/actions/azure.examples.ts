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
      'Initializes a git repository with the content in the workspace, and publishes it to Azure DevOps with the default configuration.',
    example: yaml.stringify({
      steps: [
        {
          id: 'publish',
          action: 'publish:azure',
          name: 'Publish to Azure',
          input: {
            repoUrl:
              'dev.azure.com?organization=organization&project=project&repo=repo',
          },
        },
      ],
    }),
  },
  {
    description: 'Initializes an Azure DevOps repository with a description.',
    example: yaml.stringify({
      steps: [
        {
          id: 'publish',
          action: 'publish:azure',
          name: 'Publish to Azure',
          input: {
            repoUrl:
              'dev.azure.com?organization=organization&project=project&repo=repo',
            description: 'Initialize a git repository',
          },
        },
      ],
    }),
  },
  {
    description:
      'Initializes an Azure DevOps repository with a default branch, if not set defaults to master',
    example: yaml.stringify({
      steps: [
        {
          id: 'publish',
          action: 'publish:azure',
          name: 'Publish to Azure',
          input: {
            repoUrl:
              'dev.azure.com?organization=organization&project=project&repo=repo',
            defaultBranch: 'main',
          },
        },
      ],
    }),
  },
  {
    description:
      'Initializes an Azure DevOps repository with a custom commit message',
    example: yaml.stringify({
      steps: [
        {
          id: 'publish',
          action: 'publish:azure',
          name: 'Publish to Azure',
          input: {
            repoUrl:
              'dev.azure.com?organization=organization&project=project&repo=repo',
            gitCommitMessage: 'Initial setup and configuration',
          },
        },
      ],
    }),
  },
  {
    description:
      'Initializes an Azure DevOps repository with a custom author name and email',
    example: yaml.stringify({
      steps: [
        {
          id: 'publish',
          action: 'publish:azure',
          name: 'Publish to Azure',
          input: {
            repoUrl:
              'dev.azure.com?organization=organization&project=project&repo=repo',
            gitAuthorName: 'John Doe',
            gitAuthorEmail: 'john.doe@example.com',
          },
        },
      ],
    }),
  },
  {
    description:
      'Initializes an Azure DevOps repository using a specific source path',
    example: yaml.stringify({
      steps: [
        {
          id: 'publish',
          action: 'publish:azure',
          name: 'Publish to Azure',
          input: {
            repoUrl:
              'dev.azure.com?organization=organization&project=project&repo=repo',
            sourcePath: 'path/to/source',
          },
        },
      ],
    }),
  },
  {
    description:
      'Initializes an Azure DevOps repository using an authentication token',
    example: yaml.stringify({
      steps: [
        {
          id: 'publish',
          action: 'publish:azure',
          name: 'Publish to Azure',
          input: {
            repoUrl:
              'dev.azure.com?organization=organization&project=project&repo=repo',
            token: 'personal-access-token',
          },
        },
      ],
    }),
  },
  {
    description:
      'Initializes an Azure DevOps repository using an custom repo url',
    example: yaml.stringify({
      steps: [
        {
          id: 'publish',
          action: 'publish:azure',
          name: 'Publish to Azure',
          input: {
            repoUrl:
              'test.azure.com?organization=organization&project=project&repo=repo',
          },
        },
      ],
    }),
  },
];
