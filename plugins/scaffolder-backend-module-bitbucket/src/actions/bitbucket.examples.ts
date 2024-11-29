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
      'Initializes a git repository with the content in the workspace, and publishes it to Bitbucket with the default configuration.',
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
    description: 'Initializes a Bitbucket repository with a description.',
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
    description:
      'Initializes a Bitbucket repository with public repo visibility, if not set defaults to private',
    example: yaml.stringify({
      steps: [
        {
          id: 'publish',
          action: 'publish:bitbucket',
          name: 'Publish to Bitbucket',
          input: {
            repoUrl:
              'bitbucket.org?repo=repo&workspace=workspace&project=project',
            repoVisibility: 'public',
          },
        },
      ],
    }),
  },
  {
    description:
      'Initializes a Bitbucket repository with a default branch, if not set defaults to master',
    example: yaml.stringify({
      steps: [
        {
          id: 'publish',
          action: 'publish:bitbucket',
          name: 'Publish to Bitbucket',
          input: {
            repoUrl:
              'bitbucket.org?repo=repo&workspace=workspace&project=project',
            defaultBranch: 'main',
          },
        },
      ],
    }),
  },
  {
    description:
      'Path within the workspace that will be used as the repository root. If omitted, the entire workspace will be published as the repository',
    example: yaml.stringify({
      steps: [
        {
          id: 'publish',
          action: 'publish:bitbucket',
          name: 'Publish to Bitbucket',
          input: {
            repoUrl:
              'bitbucket.org?repo=repo&workspace=workspace&project=project',
            sourcePath: './repoRoot',
          },
        },
      ],
    }),
  },
  {
    description: 'Initializes a Bitbucket repository with LFS enabled',
    example: yaml.stringify({
      steps: [
        {
          id: 'publish',
          action: 'publish:bitbucket',
          name: 'Publish to Bitbucket',
          input: {
            repoUrl: 'hosted.bitbucket.com?project=project&repo=repo',
            enableLFS: true,
          },
        },
      ],
    }),
  },
  {
    description:
      'Initializes a Bitbucket repository with a custom authentication token',
    example: yaml.stringify({
      steps: [
        {
          id: 'publish',
          action: 'publish:bitbucket',
          name: 'Publish to Bitbucket',
          input: {
            repoUrl:
              'bitbucket.org?repo=repo&workspace=workspace&project=project',
            token: 'your-auth-token',
          },
        },
      ],
    }),
  },
  {
    description:
      'Initializes a Bitbucket repository with an initial commit message, if not set defaults to `initial commit`',
    example: yaml.stringify({
      steps: [
        {
          id: 'publish',
          action: 'publish:bitbucket',
          name: 'Publish to Bitbucket',
          input: {
            repoUrl:
              'bitbucket.org?repo=repo&workspace=workspace&project=project',
            gitCommitMessage: 'Initial commit with custom message',
          },
        },
      ],
    }),
  },
  {
    description: 'Initializes a Bitbucket repository with a custom author',
    example: yaml.stringify({
      steps: [
        {
          id: 'publish',
          action: 'publish:bitbucket',
          name: 'Publish to Bitbucket',
          input: {
            repoUrl:
              'bitbucket.org?repo=repo&workspace=workspace&project=project',
            gitAuthorName: 'Your Name',
            gitAuthorEmail: 'your.email@example.com',
          },
        },
      ],
    }),
  },
  {
    description:
      'Initializes a Bitbucket repository with all proporties being set',
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
