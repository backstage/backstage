/*
 * Copyright 2021 The Backstage Authors
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
    description: 'Initialize git repository with required properties',
    example: yaml.stringify({
      steps: [
        {
          action: 'publish:bitbucketServer',
          id: 'publish-bitbucket-server-minimal',
          name: 'Publish To Bitbucket Server',
          input: {
            repoUrl: 'hosted.bitbucket.com?project=project&repo=repo',
          },
        },
      ],
    }),
  },
  {
    description: 'Initialize git repository with all properties',
    example: yaml.stringify({
      steps: [
        {
          action: 'publish:bitbucketServer',
          id: 'publish-bitbucket-server-minimal',
          name: 'Publish To Bitbucket Server',
          input: {
            repoUrl: 'hosted.bitbucket.com?project=project&repo=repo',
            description: 'This is a test repository',
            repoVisibility: 'private',
            defaultBranch: 'main',
            sourcePath: 'packages/backend',
            enableLFS: false,
            token: 'test-token',
            gitCommitMessage: 'Init check commit',
            gitAuthorName: 'Test User',
            gitAuthorEmail: 'test.user@example.com',
          },
        },
      ],
    }),
  },
  {
    description: 'Initialize git repository with public visibility',
    example: yaml.stringify({
      steps: [
        {
          action: 'publish:bitbucketServer',
          id: 'publish-bitbucket-server-minimal',
          name: 'Publish To Bitbucket Server',
          input: {
            repoUrl: 'hosted.bitbucket.com?project=project&repo=repo',
            description: 'This is a test repository',
            repoVisibility: 'public',
            defaultBranch: 'main',
            sourcePath: 'packages/backend',
            enableLFS: true,
            token: 'test-token',
            gitCommitMessage: 'Init check commit',
            gitAuthorName: 'Test User',
            gitAuthorEmail: 'test.user@example.com',
          },
        },
      ],
    }),
  },
  {
    description: 'Initialize git repository with different default branch',
    example: yaml.stringify({
      steps: [
        {
          action: 'publish:bitbucketServer',
          id: 'publish-bitbucket-server-minimal',
          name: 'Publish To Bitbucket Server',
          input: {
            repoUrl: 'hosted.bitbucket.com?project=project&repo=repo',
            description: 'This is a test repository',
            repoVisibility: 'public',
            defaultBranch: 'develop',
            sourcePath: 'packages/backend',
            enableLFS: true,
            token: 'test-token',
            gitCommitMessage: 'Init check commit',
            gitAuthorName: 'Test User',
            gitAuthorEmail: 'test.user@example.com',
          },
        },
      ],
    }),
  },
  {
    description: 'Initialize git repository with different source path',
    example: yaml.stringify({
      steps: [
        {
          action: 'publish:bitbucketServer',
          id: 'publish-bitbucket-server-minimal',
          name: 'Publish To Bitbucket Server',
          input: {
            repoUrl: 'hosted.bitbucket.com?project=project&repo=repo',
            description: 'This is a test repository',
            repoVisibility: 'public',
            defaultBranch: 'develop',
            sourcePath: 'packages/api',
            enableLFS: true,
            token: 'test-token',
            gitCommitMessage: 'Init check commit',
            gitAuthorName: 'Test User',
            gitAuthorEmail: 'test.user@example.com',
          },
        },
      ],
    }),
  },
];
