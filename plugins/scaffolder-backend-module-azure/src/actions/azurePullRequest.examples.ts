/*
 * Copyright 2025 The Backstage Authors
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
      'Creates a pull request in Azure DevOps with the minimum required fields.',
    example: yaml.stringify({
      steps: [
        {
          id: 'create-pr',
          action: 'publish:azure:pull-request',
          name: 'Create Azure DevOps Pull Request',
          input: {
            repoUrl:
              'dev.azure.com?organization=my-org&project=my-project&repo=my-repo',
            branchName: 'feature/new-stuff',
            title: 'My New Feature',
            description: 'This PR introduces a new feature.',
          },
        },
      ],
    }),
  },
  {
    description:
      'Creates a draft pull request with a specific target branch and reviewers.',
    example: yaml.stringify({
      steps: [
        {
          id: 'create-pr',
          action: 'publish:azure:pull-request',
          name: 'Create Azure DevOps Pull Request',
          input: {
            repoUrl:
              'dev.azure.com?organization=my-org&project=my-project&repo=my-repo',
            branchName: 'feature/new-stuff',
            targetBranchName: 'develop',
            title: 'My New Feature',
            description: 'This PR introduces a new feature.',
            draft: true,
            reviewers: ['user1@example.com', 'user2@example.com'],
          },
        },
      ],
    }),
  },
  {
    description: 'Creates a source branch before creating the pull request.',
    example: yaml.stringify({
      steps: [
        {
          id: 'create-pr',
          action: 'publish:azure:pull-request',
          name: 'Create Azure DevOps Pull Request',
          input: {
            repoUrl:
              'dev.azure.com?organization=my-org&project=my-project&repo=my-repo',
            branchName: 'feature/new-stuff',
            title: 'My New Feature',
            description: 'This PR introduces a new feature.',
            createSourceBranch: true,
          },
        },
      ],
    }),
  },
  {
    description: 'Creates a pull request with assignees.',
    example: yaml.stringify({
      steps: [
        {
          id: 'create-pr',
          action: 'publish:azure:pull-request',
          name: 'Create Azure DevOps Pull Request',
          input: {
            repoUrl:
              'dev.azure.com?organization=my-org&project=my-project&repo=my-repo',
            branchName: 'feature/new-stuff',
            title: 'My New Feature',
            description: 'This PR introduces a new feature.',
            assignees: ['user1@example.com', 'user2@example.com'],
          },
        },
      ],
    }),
  },
  {
    description: 'Creates a pull request and deletes specified files.',
    example: yaml.stringify({
      steps: [
        {
          id: 'create-pr',
          action: 'publish:azure:pull-request',
          name: 'Create Azure DevOps Pull Request',
          input: {
            repoUrl:
              'dev.azure.com?organization=my-org&project=my-project&repo=my-repo',
            branchName: 'feature/new-stuff',
            title: 'My New Feature',
            description: 'This PR introduces a new feature.',
            filesToDelete: ['file1.txt', 'folder/file2.txt'],
          },
        },
      ],
    }),
  },
  {
    description: 'Creates a pull request with a custom commit author.',
    example: yaml.stringify({
      steps: [
        {
          id: 'create-pr',
          action: 'publish:azure:pull-request',
          name: 'Create Azure DevOps Pull Request',
          input: {
            repoUrl:
              'dev.azure.com?organization=my-org&project=my-project&repo=my-repo',
            branchName: 'feature/new-stuff',
            title: 'My New Feature',
            description: 'This PR introduces a new feature.',
            gitAuthorName: 'John Doe',
            gitAuthorEmail: 'john.doe@example.com',
          },
        },
      ],
    }),
  },
];
