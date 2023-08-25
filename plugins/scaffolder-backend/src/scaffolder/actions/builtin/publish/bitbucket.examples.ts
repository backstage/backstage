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
      'Initializes a git repository of contents in workspace and publish it to Bitbucket with default configuration.',
    example: yaml.stringify({
      steps: [
        {
          id: 'publish',
          action: 'publish:bitbucket',
          name: 'Publish to Bitbucket',
          input: {
            repoUrl:
              'bitbucket.org?repo=repo&workspace=workspace&project=project',
          },
        },
      ],
    }),
  },
  {
    description: 'Add a description.',
    example: yaml.stringify({
      steps: [
        {
          id: 'publish',
          action: 'publish:bitbucket',
          name: 'Publish to Bitbucket',
          input: {
            repoUrl:
              'bitbucket.org?repo=repo&workspace=workspace&project=project',
            description: 'Initialize a git repository',
          },
        },
      ],
    }),
  },
  {
    description: 'Change visibility of the repository.',
    example: yaml.stringify({
      steps: [
        {
          id: 'publish',
          action: 'publish:bitbucket',
          name: 'Publish to Bitbucket',
          input: {
            repoUrl:
              'bitbucket.org?repo=repo&workspace=workspace&project=project',
            description: 'Initialize a git repository',
            repoVisibility: 'public',
          },
        },
      ],
    }),
  },
  {
    description: 'Set the default branch.',
    example: yaml.stringify({
      steps: [
        {
          id: 'publish',
          action: 'publish:bitbucket',
          name: 'Publish to Bitbucket',
          input: {
            repoUrl:
              'bitbucket.org?repo=repo&workspace=workspace&project=project',
            description: 'Initialize a git repository',
            repoVisibility: 'public',
            defaultBranch: 'main',
          },
        },
      ],
    }),
  },
  {
    description: 'Specify a source path within the workspace.',
    example: yaml.stringify({
      steps: [
        {
          id: 'publish',
          action: 'publish:bitbucket',
          name: 'Publish to Bitbucket',
          input: {
            repoUrl:
              'bitbucket.org?repo=repo&workspace=workspace&project=project',
            description: 'Initialize a git repository',
            repoVisibility: 'public',
            defaultBranch: 'main',
            sourcePath: './repoRoot',
          },
        },
      ],
    }),
  },
  {
    description: 'Enable LFS for the repository.',
    example: yaml.stringify({
      steps: [
        {
          id: 'publish',
          action: 'publish:bitbucket',
          name: 'Publish to Bitbucket',
          input: {
            repoUrl: 'hosted.bitbucket.com?project=project&repo=repo',
            description: 'Initialize a git repository',
            repoVisibility: 'public',
            defaultBranch: 'main',
            sourcePath: './repoRoot',
            enableLFS: true,
          },
        },
      ],
    }),
  },
  {
    description: 'Provide an authentication token for Bitbucket.',
    example: yaml.stringify({
      steps: [
        {
          id: 'publish',
          action: 'publish:bitbucket',
          name: 'Publish to Bitbucket',
          input: {
            repoUrl:
              'bitbucket.org?repo=repo&workspace=workspace&project=project',
            description: 'Initialize a git repository',
            repoVisibility: 'public',
            defaultBranch: 'main',
            token: 'your-auth-token',
          },
        },
      ],
    }),
  },
  {
    description: 'Set a custom commit message.',
    example: yaml.stringify({
      steps: [
        {
          id: 'publish',
          action: 'publish:bitbucket',
          name: 'Publish to Bitbucket',
          input: {
            repoUrl:
              'bitbucket.org?repo=repo&workspace=workspace&project=project',
            description: 'Initialize a git repository',
            repoVisibility: 'public',
            defaultBranch: 'main',
            token: 'your-auth-token',
            gitCommitMessage: 'Initial commit with custom message',
          },
        },
      ],
    }),
  },
  {
    description: 'Set a custom author name and email for the commit.',
    example: yaml.stringify({
      steps: [
        {
          id: 'publish',
          action: 'publish:bitbucket',
          name: 'Publish to Bitbucket',
          input: {
            repoUrl:
              'bitbucket.org?repo=repo&workspace=workspace&project=project',
            description: 'Initialize a git repository',
            repoVisibility: 'public',
            defaultBranch: 'main',
            token: 'your-auth-token',
            gitCommitMessage: 'Initial commit with custom message',
            gitAuthorName: 'Your Name',
            gitAuthorEmail: 'your.email@example.com',
          },
        },
      ],
    }),
  },
];
