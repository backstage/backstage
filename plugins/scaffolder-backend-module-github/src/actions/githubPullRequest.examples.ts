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
    description: 'Create a pull request',
    example: yaml.stringify({
      steps: [
        {
          action: 'publish:github:pull-request',
          name: 'Create a pull request',
          input: {
            repoUrl: 'github.com?repo=repo&owner=owner',
            branchName: 'new-app',
            title: 'Create my new app',
            description: 'This PR is really good',
          },
        },
      ],
    }),
  },
  {
    description: 'Create a pull request with target branch name',
    example: yaml.stringify({
      steps: [
        {
          action: 'publish:github:pull-request',
          name: 'Create a pull request with target branch name',
          input: {
            repoUrl: 'github.com?repo=repo&owner=owner',
            branchName: 'new-app',
            title: 'Create my new app',
            description: 'This PR is really good',
            targetBranchName: 'test',
          },
        },
      ],
    }),
  },
  {
    description: 'Create a pull request as draft',
    example: yaml.stringify({
      steps: [
        {
          action: 'publish:github:pull-request',
          name: 'Create a pull request as draft',
          input: {
            repoUrl: 'github.com?repo=repo&owner=owner',
            branchName: 'new-app',
            title: 'Create my new app',
            description: 'This PR is really good',
            draft: true,
          },
        },
      ],
    }),
  },
  {
    description: 'Create a pull request with target path',
    example: yaml.stringify({
      steps: [
        {
          action: 'publish:github:pull-request',
          name: 'Create a pull request with target path',
          input: {
            repoUrl: 'github.com?repo=repo&owner=owner',
            branchName: 'new-app',
            title: 'Create my new app',
            description: 'This PR is really good',
            targetPath: 'targetPath',
          },
        },
      ],
    }),
  },
  {
    description: 'Create a pull request with source path',
    example: yaml.stringify({
      steps: [
        {
          action: 'publish:github:pull-request',
          name: 'Create a pull request with source path',
          input: {
            repoUrl: 'github.com?repo=repo&owner=owner',
            branchName: 'new-app',
            title: 'Create my new app',
            description: 'This PR is really good',
            sourcePath: 'source',
          },
        },
      ],
    }),
  },
  {
    description: 'Create a pull request with token',
    example: yaml.stringify({
      steps: [
        {
          action: 'publish:github:pull-request',
          name: 'Create a pull request',
          input: {
            repoUrl: 'github.com?repo=repo&owner=owner',
            branchName: 'new-app',
            title: 'Create my new app',
            description: 'This PR is really good',
            token: 'gph_YourGitHubToken',
          },
        },
      ],
    }),
  },
  {
    description: 'Create a pull request with reviewers',
    example: yaml.stringify({
      steps: [
        {
          action: 'publish:github:pull-request',
          name: 'Create a pull request with reviewers',
          input: {
            repoUrl: 'github.com?repo=repo&owner=owner',
            branchName: 'new-app',
            title: 'Create my new app',
            description: 'This PR is really good',
            reviewers: ['foobar'],
          },
        },
      ],
    }),
  },
  {
    description: 'Create a pull request with team reviewers',
    example: yaml.stringify({
      steps: [
        {
          action: 'publish:github:pull-request',
          name: 'Create a pull request with team reviewers',
          input: {
            repoUrl: 'github.com?repo=repo&owner=owner',
            branchName: 'new-app',
            title: 'Create my new app',
            description: 'This PR is really good',
            teamReviewers: ['team-foo'],
          },
        },
      ],
    }),
  },
  {
    description: 'Create a pull request with commit message',
    example: yaml.stringify({
      steps: [
        {
          action: 'publish:github:pull-request',
          name: 'Create a pull request',
          input: {
            repoUrl: 'github.com?repo=repo&owner=owner',
            branchName: 'new-app',
            title: 'Create my new app',
            description: 'This PR is really good',
            commitMessage: 'Custom commit message',
          },
        },
      ],
    }),
  },
  {
    description: 'Create a pull request with a git author name and email',
    example: yaml.stringify({
      steps: [
        {
          action: 'publish:github:pull-request',
          name: 'Create a pull request',
          input: {
            repoUrl: 'github.com?repo=repo&owner=owner',
            branchName: 'new-app',
            title: 'Create my new app',
            description: 'This PR is really good',
            gitAuthorName: 'Foo Bar',
            gitAuthorEmail: 'foo@bar.example',
          },
        },
      ],
    }),
  },
  {
    description: 'Create a pull request with a git author name',
    example: yaml.stringify({
      steps: [
        {
          action: 'publish:github:pull-request',
          name: 'Create a pull request',
          input: {
            repoUrl: 'github.com?repo=repo&owner=owner',
            branchName: 'new-app',
            title: 'Create my new app',
            description: 'This PR is really good',
            // gitAuthorEmail will be 'scaffolder@backstage.io'
            // once one author attribute has been set we need to set both
            gitAuthorName: 'Foo Bar',
          },
        },
      ],
    }),
  },
  {
    description: 'Create a pull request with a git author email',
    example: yaml.stringify({
      steps: [
        {
          action: 'publish:github:pull-request',
          name: 'Create a pull request',
          input: {
            repoUrl: 'github.com?repo=repo&owner=owner',
            branchName: 'new-app',
            title: 'Create my new app',
            description: 'This PR is really good',
            // gitAuthorName will be 'Scaffolder'
            // once one author attribute has been set we need to set both
            gitAuthorEmail: 'foo@bar.example',
          },
        },
      ],
    }),
  },
  {
    description: 'Do not create empty pull request',
    example: yaml.stringify({
      steps: [
        {
          action: 'publish:github:pull-request',
          name: 'Create a pull request',
          input: {
            repoUrl: 'github.com?repo=repo&owner=owner',
            branchName: 'new-app',
            title: 'Create my new app',
            description: 'This PR is really good',
            createWhenEmpty: false,
          },
        },
      ],
    }),
  },
  {
    description: 'Create a pull request with all parameters',
    example: yaml.stringify({
      steps: [
        {
          action: 'publish:github:pull-request',
          name: 'Create a pull request',
          input: {
            repoUrl: 'github.com?repo=repo&owner=owner',
            branchName: 'new-app',
            title: 'Create my new app',
            description: 'This PR is really good',
            targetBranchName: 'test',
            draft: true,
            targetPath: 'targetPath',
            sourcePath: 'source',
            token: 'gph_YourGitHubToken',
            reviewers: ['foobar'],
            teamReviewers: ['team-foo'],
            commitMessage: 'Commit for foo changes',
            gitAuthorName: 'Foo Bar',
            gitAuthorEmail: 'foo@bar.example',
            createWhenEmpty: true,
          },
        },
      ],
    }),
  },
];
