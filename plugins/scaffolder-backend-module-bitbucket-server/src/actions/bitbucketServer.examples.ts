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
  {
    description:
      'Initialize git repository with default settings and custom author information',
    example: yaml.stringify({
      steps: [
        {
          action: 'publish:bitbucketServer',
          id: 'publish-bitbucket-server-custom-author',
          name: 'Publish To Bitbucket Server',
          input: {
            repoUrl: 'hosted.bitbucket.com?project=project&repo=repo',
            gitAuthorName: 'Custom Author',
            gitAuthorEmail: 'custom.author@example.com',
          },
        },
      ],
    }),
  },
  {
    description:
      'Initialize git repository with LFS enabled and a specific commit message',
    example: yaml.stringify({
      steps: [
        {
          action: 'publish:bitbucketServer',
          id: 'publish-bitbucket-server-lfs-commit',
          name: 'Publish To Bitbucket Server',
          input: {
            repoUrl: 'hosted.bitbucket.com?project=project&repo=repo',
            enableLFS: true,
            gitCommitMessage: 'Initial commit with LFS enabled',
          },
        },
      ],
    }),
  },
  {
    description:
      'Initialize git repository with a custom source path and token',
    example: yaml.stringify({
      steps: [
        {
          action: 'publish:bitbucketServer',
          id: 'publish-bitbucket-server-custom-source',
          name: 'Publish To Bitbucket Server',
          input: {
            repoUrl: 'hosted.bitbucket.com?project=project&repo=repo',
            sourcePath: 'custom/source/path',
            token: 'custom-token',
          },
        },
      ],
    }),
  },
  {
    description:
      'Initialize git repository with private visibility and custom author details',
    example: yaml.stringify({
      steps: [
        {
          action: 'publish:bitbucketServer',
          id: 'publish-bitbucket-server-private-custom-author',
          name: 'Publish To Bitbucket Server',
          input: {
            repoUrl: 'hosted.bitbucket.com?project=project&repo=repo',
            repoVisibility: 'private',
            gitAuthorName: 'Private Author',
            gitAuthorEmail: 'private.author@example.com',
          },
        },
      ],
    }),
  },
  {
    description:
      'Initialize git repository with public visibility and specific commit message',
    example: yaml.stringify({
      steps: [
        {
          action: 'publish:bitbucketServer',
          id: 'publish-bitbucket-server-public-commit',
          name: 'Publish To Bitbucket Server',
          input: {
            repoUrl: 'hosted.bitbucket.com?project=project&repo=repo',
            repoVisibility: 'public',
            gitCommitMessage: 'Public repository initial commit',
          },
        },
      ],
    }),
  },
  {
    description: 'Initialize git repository with all settings customized',
    example: yaml.stringify({
      steps: [
        {
          action: 'publish:bitbucketServer',
          id: 'publish-bitbucket-server-all-custom',
          name: 'Publish To Bitbucket Server',
          input: {
            repoUrl: 'hosted.bitbucket.com?project=project&repo=repo',
            description: 'A fully customized repository',
            repoVisibility: 'private',
            defaultBranch: 'development',
            sourcePath: 'src/backend',
            enableLFS: true,
            token: 'custom-token',
            gitCommitMessage: 'Fully customized initial commit',
            gitAuthorName: 'Custom Dev',
            gitAuthorEmail: 'custom.dev@example.com',
          },
        },
      ],
    }),
  },
  {
    description:
      'Initialize git repository with a specific default branch and no LFS',
    example: yaml.stringify({
      steps: [
        {
          action: 'publish:bitbucketServer',
          id: 'publish-bitbucket-server-no-lfs',
          name: 'Publish To Bitbucket Server',
          input: {
            repoUrl: 'hosted.bitbucket.com?project=project&repo=repo',
            defaultBranch: 'main',
            enableLFS: false,
          },
        },
      ],
    }),
  },
  {
    description:
      'Initialize git repository with a custom repository description and public visibility',
    example: yaml.stringify({
      steps: [
        {
          action: 'publish:bitbucketServer',
          id: 'publish-bitbucket-server-custom-description',
          name: 'Publish To Bitbucket Server',
          input: {
            repoUrl: 'hosted.bitbucket.com?project=project&repo=repo',
            description: 'A public repository with a custom description',
            repoVisibility: 'public',
          },
        },
      ],
    }),
  },
  {
    description:
      'Initialize git repository with a custom token for authentication',
    example: yaml.stringify({
      steps: [
        {
          action: 'publish:bitbucketServer',
          id: 'publish-bitbucket-server-custom-token',
          name: 'Publish To Bitbucket Server',
          input: {
            repoUrl: 'hosted.bitbucket.com?project=project&repo=repo',
            token: 'custom-auth-token',
          },
        },
      ],
    }),
  },
  {
    description:
      'Initialize git repository with a different repository root path',
    example: yaml.stringify({
      steps: [
        {
          action: 'publish:bitbucketServer',
          id: 'publish-bitbucket-server-different-root',
          name: 'Publish To Bitbucket Server',
          input: {
            repoUrl: 'hosted.bitbucket.com?project=project&repo=repo',
            sourcePath: 'different/root/path',
          },
        },
      ],
    }),
  },
  {
    description:
      'Initialize git repository with private visibility and LFS enabled',
    example: yaml.stringify({
      steps: [
        {
          action: 'publish:bitbucketServer',
          id: 'publish-bitbucket-server-private-lfs',
          name: 'Publish To Bitbucket Server',
          input: {
            repoUrl: 'hosted.bitbucket.com?project=project&repo=repo',
            repoVisibility: 'private',
            enableLFS: true,
          },
        },
      ],
    }),
  },
];
