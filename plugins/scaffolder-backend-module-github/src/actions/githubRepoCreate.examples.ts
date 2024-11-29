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
    description: 'Creates a GitHub repository with default configuration.',
    example: yaml.stringify({
      steps: [
        {
          action: 'github:repo:create',
          name: 'Create a new GitHub repository',
          input: {
            repoUrl: 'github.com?repo=repo&owner=owner',
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
          action: 'github:repo:create',
          name: 'Create a new GitHub repository with a description',
          input: {
            repoUrl: 'github.com?repo=repo&owner=owner',
            description: 'My new repository',
          },
        },
      ],
    }),
  },
  {
    description: 'Disable wiki and issues.',
    example: yaml.stringify({
      steps: [
        {
          action: 'github:repo:create',
          name: 'Create a new GitHub repository without wiki and issues',
          input: {
            repoUrl: 'github.com?repo=repo&owner=owner',
            hasIssues: false,
            hasWiki: false,
          },
        },
      ],
    }),
  },
  {
    description: 'Set repository homepage.',
    example: yaml.stringify({
      steps: [
        {
          action: 'github:repo:create',
          name: 'Create a new GitHub repository with homepage',
          input: {
            repoUrl: 'github.com?repo=repo&owner=owner',
            homepage: 'https://example.com',
          },
        },
      ],
    }),
  },
  {
    description: 'Create a private repository.',
    example: yaml.stringify({
      steps: [
        {
          action: 'github:repo:create',
          name: 'Create a new private GitHub repository',
          input: {
            repoUrl: 'github.com?repo=repo&owner=owner',
            repoVisibility: 'private',
          },
        },
      ],
    }),
  },
  {
    description: 'Enable required code owner reviews.',
    example: yaml.stringify({
      steps: [
        {
          action: 'github:repo:create',
          name: 'Create a new GitHub repository with required code owner reviews',
          input: {
            repoUrl: 'github.com?repo=repo&owner=owner',
            requireCodeOwnerReviews: true,
          },
        },
      ],
    }),
  },
  {
    description: 'Set required approving review count to 2.',
    example: yaml.stringify({
      steps: [
        {
          action: 'github:repo:create',
          name: 'Create a new GitHub repository with required approving review count',
          input: {
            repoUrl: 'github.com?repo=repo&owner=owner',
            requiredApprovingReviewCount: 2,
          },
        },
      ],
    }),
  },
  {
    description: 'Allow squash merge only.',
    example: yaml.stringify({
      steps: [
        {
          action: 'github:repo:create',
          name: 'Create a new GitHub repository allowing only squash merge',
          input: {
            repoUrl: 'github.com?repo=repo&owner=owner',
            allowMergeCommit: false,
            allowSquashMerge: true,
            allowRebaseMerge: false,
          },
        },
      ],
    }),
  },
  {
    description: 'Set squash merge commit title to pull request title.',
    example: yaml.stringify({
      steps: [
        {
          action: 'github:repo:create',
          name: 'Create a new GitHub repository with squash merge commit title set to pull request title',
          input: {
            repoUrl: 'github.com?repo=repo&owner=owner',
            squashMergeCommitTitle: 'pull_request_title',
          },
        },
      ],
    }),
  },
  {
    description: 'Set squash merge commit message to blank.',
    example: yaml.stringify({
      steps: [
        {
          action: 'github:repo:create',
          name: 'Create a new GitHub repository with squash merge commit message set to blank',
          input: {
            repoUrl: 'github.com?repo=repo&owner=owner',
            squashMergeCommitMessage: 'blank',
          },
        },
      ],
    }),
  },
  {
    description: 'Allow auto-merge.',
    example: yaml.stringify({
      steps: [
        {
          action: 'github:repo:create',
          name: 'Create a new GitHub repository allowing auto-merge',
          input: {
            repoUrl: 'github.com?repo=repo&owner=owner',
            allowAutoMerge: true,
          },
        },
      ],
    }),
  },
  {
    description: 'Set collaborators with push access.',
    example: yaml.stringify({
      steps: [
        {
          action: 'github:repo:create',
          name: 'Create a new GitHub repository with collaborators having push access',
          input: {
            repoUrl: 'github.com?repo=repo&owner=owner',
            collaborators: [
              { username: 'user1', permission: 'push' },
              { username: 'user2', permission: 'push' },
            ],
          },
        },
      ],
    }),
  },
  {
    description: 'Add topics to repository.',
    example: yaml.stringify({
      steps: [
        {
          action: 'github:repo:create',
          name: 'Create a new GitHub repository with topics',
          input: {
            repoUrl: 'github.com?repo=repo&owner=owner',
            topics: ['devops', 'kubernetes', 'ci-cd'],
          },
        },
      ],
    }),
  },
  {
    description: 'Add secret variables to repository.',
    example: yaml.stringify({
      steps: [
        {
          action: 'github:repo:create',
          name: 'Create a new GitHub repository with secret variables',
          input: {
            repoUrl: 'github.com?repo=repo&owner=owner',
            secrets: [
              { name: 'SECRET_KEY', value: 'supersecretkey' },
              { name: 'API_TOKEN', value: 'tokenvalue' },
            ],
          },
        },
      ],
    }),
  },
  {
    description: 'Enable branch protection requiring status checks.',
    example: yaml.stringify({
      steps: [
        {
          action: 'github:repo:create',
          name: 'Create a new GitHub repository with branch protection requiring status checks',
          input: {
            repoUrl: 'github.com?repo=repo&owner=owner',
            requiredStatusCheckContexts: ['ci/circleci: build'],
          },
        },
      ],
    }),
  },
  {
    description: 'Require branches to be up-to-date before merging.',
    example: yaml.stringify({
      steps: [
        {
          action: 'github:repo:create',
          name: 'Create a new GitHub repository requiring branches to be up-to-date before merging',
          input: {
            repoUrl: 'github.com?repo=repo&owner=owner',
            requireBranchesToBeUpToDate: true,
          },
        },
      ],
    }),
  },
  {
    description: 'Require conversation resolution before merging.',
    example: yaml.stringify({
      steps: [
        {
          action: 'github:repo:create',
          name: 'Create a new GitHub repository requiring conversation resolution before merging',
          input: {
            repoUrl: 'github.com?repo=repo&owner=owner',
            requiredConversationResolution: true,
          },
        },
      ],
    }),
  },
  {
    description: 'Delete branch on merge.',
    example: yaml.stringify({
      steps: [
        {
          action: 'github:repo:create',
          name: 'Create a new GitHub repository with branch deletion on merge',
          input: {
            repoUrl: 'github.com?repo=repo&owner=owner',
            deleteBranchOnMerge: true,
          },
        },
      ],
    }),
  },
  {
    description: 'Customize OIDC token.',
    example: yaml.stringify({
      steps: [
        {
          action: 'github:repo:create',
          name: 'Create a new GitHub repository with OIDC token customization',
          input: {
            repoUrl: 'github.com?repo=repo&owner=owner',
            oidcCustomization: {
              sub: 'repo:owner/repo',
              aud: 'https://github.com',
            },
          },
        },
      ],
    }),
  },
  {
    description: 'Require commit signing.',
    example: yaml.stringify({
      steps: [
        {
          action: 'github:repo:create',
          name: 'Create a new GitHub repository requiring commit signing',
          input: {
            repoUrl: 'github.com?repo=repo&owner=owner',
            requiredCommitSigning: true,
          },
        },
      ],
    }),
  },
  {
    description:
      'Set multiple properties including description, homepage, and visibility.',
    example: yaml.stringify({
      steps: [
        {
          action: 'github:repo:create',
          name: 'Create a new GitHub repository with multiple properties',
          input: {
            repoUrl: 'github.com?repo=repo&owner=owner',
            description: 'A repository for project XYZ',
            homepage: 'https://project-xyz.com',
            repoVisibility: 'internal',
          },
        },
      ],
    }),
  },
  {
    description: 'Configure branch protection with multiple settings.',
    example: yaml.stringify({
      steps: [
        {
          action: 'github:repo:create',
          name: 'Create a new GitHub repository with branch protection settings',
          input: {
            repoUrl: 'github.com?repo=repo&owner=owner',
            requiredStatusCheckContexts: [
              'ci/circleci: build',
              'ci/circleci: test',
            ],
            requireBranchesToBeUpToDate: true,
            requiredConversationResolution: true,
            requiredApprovingReviewCount: 2,
          },
        },
      ],
    }),
  },
  {
    description:
      'Set repository access to private and add collaborators with admin access.',
    example: yaml.stringify({
      steps: [
        {
          action: 'github:repo:create',
          name: 'Create a new private GitHub repository with collaborators',
          input: {
            repoUrl: 'github.com?repo=repo&owner=owner',
            repoVisibility: 'private',
            collaborators: [
              { username: 'admin1', permission: 'admin' },
              { username: 'admin2', permission: 'admin' },
            ],
          },
        },
      ],
    }),
  },
  {
    description: 'Enable GitHub Projects for the repository.',
    example: yaml.stringify({
      steps: [
        {
          action: 'github:repo:create',
          name: 'Create a new GitHub repository with GitHub Projects enabled',
          input: {
            repoUrl: 'github.com?repo=repo&owner=owner',
            hasProjects: true,
          },
        },
      ],
    }),
  },
  {
    description:
      'Disable merge commits and allow only rebase and squash merges.',
    example: yaml.stringify({
      steps: [
        {
          action: 'github:repo:create',
          name: 'Create a new GitHub repository allowing only rebase and squash merges',
          input: {
            repoUrl: 'github.com?repo=repo&owner=owner',
            allowMergeCommit: false,
            allowRebaseMerge: true,
            allowSquashMerge: true,
          },
        },
      ],
    }),
  },
  {
    description:
      'Set repository access to internal with no projects and issues.',
    example: yaml.stringify({
      steps: [
        {
          action: 'github:repo:create',
          name: 'Create a new internal GitHub repository without projects and issues',
          input: {
            repoUrl: 'github.com?repo=repo&owner=owner',
            repoVisibility: 'internal',
            hasProjects: false,
            hasIssues: false,
          },
        },
      ],
    }),
  },
  {
    description:
      'Create repository with OIDC customization for specific audience.',
    example: yaml.stringify({
      steps: [
        {
          action: 'github:repo:create',
          name: 'Create a new GitHub repository with OIDC customization for specific audience',
          input: {
            repoUrl: 'github.com?repo=repo&owner=owner',
            oidcCustomization: {
              sub: 'repo:owner/repo',
              aud: 'https://specific-audience.com',
            },
          },
        },
      ],
    }),
  },
  {
    description: 'Require all branches to be up-to-date before merging.',
    example: yaml.stringify({
      steps: [
        {
          action: 'github:repo:create',
          name: 'Create a new GitHub repository requiring all branches to be up-to-date',
          input: {
            repoUrl: 'github.com?repo=repo&owner=owner',
            requireBranchesToBeUpToDate: true,
          },
        },
      ],
    }),
  },
  {
    description: 'Set description and topics for the repository.',
    example: yaml.stringify({
      steps: [
        {
          action: 'github:repo:create',
          name: 'Create a new GitHub repository with description and topics',
          input: {
            repoUrl: 'github.com?repo=repo&owner=owner',
            description: 'Repository for project ABC',
            topics: ['python', 'machine-learning', 'data-science'],
          },
        },
      ],
    }),
  },
  {
    description:
      'Set repository visibility to public and enable commit signing.',
    example: yaml.stringify({
      steps: [
        {
          action: 'github:repo:create',
          name: 'Create a new public GitHub repository with commit signing required',
          input: {
            repoUrl: 'github.com?repo=repo&owner=owner',
            repoVisibility: 'public',
            requiredCommitSigning: true,
          },
        },
      ],
    }),
  },
  {
    description:
      'Create a repository with collaborators and default branch protection.',
    example: yaml.stringify({
      steps: [
        {
          action: 'github:repo:create',
          name: 'Create a new GitHub repository with collaborators and branch protection',
          input: {
            repoUrl: 'github.com?repo=repo&owner=owner',
            collaborators: [
              { username: 'contributor1', permission: 'write' },
              { username: 'contributor2', permission: 'write' },
            ],
            requiredStatusCheckContexts: ['ci/travis: build'],
          },
        },
      ],
    }),
  },
  {
    description: 'Add multiple secret variables.',
    example: yaml.stringify({
      steps: [
        {
          action: 'github:repo:create',
          name: 'Create a new GitHub repository with multiple secret variables',
          input: {
            repoUrl: 'github.com?repo=repo&owner=owner',
            secrets: [
              { name: 'SECRET_KEY_1', value: 'value1' },
              { name: 'SECRET_KEY_2', value: 'value2' },
            ],
          },
        },
      ],
    }),
  },
  {
    description: 'Require a minimum of 2 approving reviews for merging.',
    example: yaml.stringify({
      steps: [
        {
          action: 'github:repo:create',
          name: 'Create a new GitHub repository with 2 required approving reviews',
          input: {
            repoUrl: 'github.com?repo=repo&owner=owner',
            requiredApprovingReviewCount: 2,
          },
        },
      ],
    }),
  },
  {
    description:
      'Enable branch protection with conversation resolution required.',
    example: yaml.stringify({
      steps: [
        {
          action: 'github:repo:create',
          name: 'Create a new GitHub repository with branch protection and conversation resolution required',
          input: {
            repoUrl: 'github.com?repo=repo&owner=owner',
            requiredConversationResolution: true,
          },
        },
      ],
    }),
  },
  {
    description:
      'Set repository visibility to internal with description and homepage.',
    example: yaml.stringify({
      steps: [
        {
          action: 'github:repo:create',
          name: 'Create a new internal GitHub repository with description and homepage',
          input: {
            repoUrl: 'github.com?repo=repo&owner=owner',
            repoVisibility: 'internal',
            description: 'Internal repository for team collaboration',
            homepage: 'https://internal.example.com',
          },
        },
      ],
    }),
  },
  {
    description: 'Disable auto-merge.',
    example: yaml.stringify({
      steps: [
        {
          action: 'github:repo:create',
          name: 'Create a new GitHub repository with auto-merge disabled',
          input: {
            repoUrl: 'github.com?repo=repo&owner=owner',
            allowAutoMerge: false,
          },
        },
      ],
    }),
  },
  {
    description: 'Set repository topics and enable GitHub Projects.',
    example: yaml.stringify({
      steps: [
        {
          action: 'github:repo:create',
          name: 'Create a new GitHub repository with topics and GitHub Projects enabled',
          input: {
            repoUrl: 'github.com?repo=repo&owner=owner',
            topics: ['opensource', 'nodejs', 'api'],
            hasProjects: true,
          },
        },
      ],
    }),
  },
  {
    description:
      'Create a private repository with collaborators having admin and write access.',
    example: yaml.stringify({
      steps: [
        {
          action: 'github:repo:create',
          name: 'Create a new private GitHub repository with multiple collaborators',
          input: {
            repoUrl: 'github.com?repo=repo&owner=owner',
            repoVisibility: 'private',
            collaborators: [
              { username: 'admin1', permission: 'admin' },
              { username: 'writer1', permission: 'write' },
            ],
          },
        },
      ],
    }),
  },
  {
    description: 'Disable branch deletion on merge.',
    example: yaml.stringify({
      steps: [
        {
          action: 'github:repo:create',
          name: 'Create a new GitHub repository with branch deletion on merge disabled',
          input: {
            repoUrl: 'github.com?repo=repo&owner=owner',
            deleteBranchOnMerge: false,
          },
        },
      ],
    }),
  },
  {
    description:
      'Set repository visibility to internal and enable commit signing.',
    example: yaml.stringify({
      steps: [
        {
          action: 'github:repo:create',
          name: 'Create a new internal GitHub repository with commit signing required',
          input: {
            repoUrl: 'github.com?repo=repo&owner=owner',
            repoVisibility: 'internal',
            requiredCommitSigning: true,
          },
        },
      ],
    }),
  },
  {
    description:
      'Create repository with description, homepage, and required status checks.',
    example: yaml.stringify({
      steps: [
        {
          action: 'github:repo:create',
          name: 'Create a new GitHub repository with description, homepage, and status checks',
          input: {
            repoUrl: 'github.com?repo=repo&owner=owner',
            description: 'Repository for web application project',
            homepage: 'https://webapp.example.com',
            requiredStatusCheckContexts: [
              'ci/travis: build',
              'ci/travis: lint',
            ],
          },
        },
      ],
    }),
  },
  {
    description:
      'Enable squash merges only and set commit message to pull request description.',
    example: yaml.stringify({
      steps: [
        {
          action: 'github:repo:create',
          name: 'Create a new GitHub repository allowing only squash merges with commit message set to pull request description',
          input: {
            repoUrl: 'github.com?repo=repo&owner=owner',
            allowMergeCommit: false,
            allowSquashMerge: true,
            allowRebaseMerge: false,
            squashMergeCommitMessage: 'pull_request_description',
          },
        },
      ],
    }),
  },
  {
    description: 'Enable rebase merges only and require commit signing.',
    example: yaml.stringify({
      steps: [
        {
          action: 'github:repo:create',
          name: 'Create a new GitHub repository allowing only rebase merges with commit signing required',
          input: {
            repoUrl: 'github.com?repo=repo&owner=owner',
            allowMergeCommit: false,
            allowRebaseMerge: true,
            allowSquashMerge: false,
            requiredCommitSigning: true,
          },
        },
      ],
    }),
  },
  {
    description:
      'Create repository with OIDC customization for multiple audiences.',
    example: yaml.stringify({
      steps: [
        {
          action: 'github:repo:create',
          name: 'Create a new GitHub repository with OIDC customization for multiple audiences',
          input: {
            repoUrl: 'github.com?repo=repo&owner=owner',
            oidcCustomization: {
              sub: 'repo:owner/repo',
              aud: ['https://audience1.com', 'https://audience2.com'],
            },
          },
        },
      ],
    }),
  },
  {
    description:
      'Enable branch protection with required approving reviews and status checks.',
    example: yaml.stringify({
      steps: [
        {
          action: 'github:repo:create',
          name: 'Create a new GitHub repository with branch protection requiring approving reviews and status checks',
          input: {
            repoUrl: 'github.com?repo=repo&owner=owner',
            requiredApprovingReviewCount: 2,
            requiredStatusCheckContexts: [
              'ci/circleci: build',
              'ci/circleci: test',
            ],
          },
        },
      ],
    }),
  },
  {
    description: 'Create a public repository with topics and secret variables.',
    example: yaml.stringify({
      steps: [
        {
          action: 'github:repo:create',
          name: 'Create a new public GitHub repository with topics and secret variables',
          input: {
            repoUrl: 'github.com?repo=repo&owner=owner',
            repoVisibility: 'public',
            topics: ['javascript', 'react', 'frontend'],
            secrets: [
              { name: 'API_KEY', value: 'apikeyvalue' },
              { name: 'DB_PASSWORD', value: 'dbpasswordvalue' },
            ],
          },
        },
      ],
    }),
  },
  {
    description: 'Set repository description and disable issues and wiki.',
    example: yaml.stringify({
      steps: [
        {
          action: 'github:repo:create',
          name: 'Create a new GitHub repository with description, and disable issues and wiki',
          input: {
            repoUrl: 'github.com?repo=repo&owner=owner',
            description: 'Repository for backend service',
            hasIssues: false,
            hasWiki: false,
          },
        },
      ],
    }),
  },
  {
    description: 'Enable required conversation resolution and commit signing.',
    example: yaml.stringify({
      steps: [
        {
          action: 'github:repo:create',
          name: 'Create a new GitHub repository with required conversation resolution and commit signing',
          input: {
            repoUrl: 'github.com?repo=repo&owner=owner',
            requiredConversationResolution: true,
            requiredCommitSigning: true,
          },
        },
      ],
    }),
  },
  {
    description:
      'Set repository visibility to private and require branches to be up-to-date.',
    example: yaml.stringify({
      steps: [
        {
          action: 'github:repo:create',
          name: 'Create a new private GitHub repository requiring branches to be up-to-date',
          input: {
            repoUrl: 'github.com?repo=repo&owner=owner',
            repoVisibility: 'private',
            requireBranchesToBeUpToDate: true,
          },
        },
      ],
    }),
  },
  {
    description:
      'Create a repository with default settings and add multiple topics.',
    example: yaml.stringify({
      steps: [
        {
          action: 'github:repo:create',
          name: 'Create a new GitHub repository with default settings and topics',
          input: {
            repoUrl: 'github.com?repo=repo&owner=owner',
            topics: ['devops', 'ci-cd', 'automation'],
          },
        },
      ],
    }),
  },
  {
    description:
      'Disable merge commits, enable auto-merge, and require commit signing.',
    example: yaml.stringify({
      steps: [
        {
          action: 'github:repo:create',
          name: 'Create a new GitHub repository disabling merge commits, enabling auto-merge, and requiring commit signing',
          input: {
            repoUrl: 'github.com?repo=repo&owner=owner',
            allowMergeCommit: false,
            allowAutoMerge: true,
            requiredCommitSigning: true,
          },
        },
      ],
    }),
  },
  {
    description:
      'Create a repository with homepage, collaborators, and topics.',
    example: yaml.stringify({
      steps: [
        {
          action: 'github:repo:create',
          name: 'Create a new GitHub repository with homepage, collaborators, and topics',
          input: {
            repoUrl: 'github.com?repo=repo&owner=owner',
            homepage: 'https://example.com',
            collaborators: [
              { username: 'user1', permission: 'push' },
              { username: 'user2', permission: 'admin' },
            ],
            topics: ['opensource', 'contribution'],
          },
        },
      ],
    }),
  },
  {
    description: 'Create a repository with branch protection and description.',
    example: yaml.stringify({
      steps: [
        {
          action: 'github:repo:create',
          name: 'Create a new GitHub repository with branch protection and description',
          input: {
            repoUrl: 'github.com?repo=repo&owner=owner',
            requiredStatusCheckContexts: ['ci/travis: build'],
            requiredApprovingReviewCount: 1,
            description: 'Repository for microservice development',
          },
        },
      ],
    }),
  },
  {
    description: 'Create a repository with OIDC customization and topics.',
    example: yaml.stringify({
      steps: [
        {
          action: 'github:repo:create',
          name: 'Create a new GitHub repository with OIDC customization and topics',
          input: {
            repoUrl: 'github.com?repo=repo&owner=owner',
            oidcCustomization: {
              sub: 'repo:owner/repo',
              aud: 'https://api.example.com',
            },
            topics: ['api', 'security'],
          },
        },
      ],
    }),
  },
  {
    description:
      'Enable required code owner reviews and branch deletion on merge.',
    example: yaml.stringify({
      steps: [
        {
          action: 'github:repo:create',
          name: 'Create a new GitHub repository with required code owner reviews and branch deletion on merge',
          input: {
            repoUrl: 'github.com?repo=repo&owner=owner',
            requireCodeOwnerReviews: true,
            deleteBranchOnMerge: true,
          },
        },
      ],
    }),
  },
  {
    description:
      'Create a repository with multiple secret variables and collaborators.',
    example: yaml.stringify({
      steps: [
        {
          action: 'github:repo:create',
          name: 'Create a new GitHub repository with multiple secret variables and collaborators',
          input: {
            repoUrl: 'github.com?repo=repo&owner=owner',
            secrets: [
              { name: 'API_SECRET', value: 'secretvalue' },
              { name: 'DB_USER', value: 'dbuser' },
            ],
            collaborators: [
              { username: 'dev1', permission: 'write' },
              { username: 'dev2', permission: 'push' },
            ],
          },
        },
      ],
    }),
  },
  {
    description:
      'Enable branch protection requiring status checks and conversation resolution.',
    example: yaml.stringify({
      steps: [
        {
          action: 'github:repo:create',
          name: 'Create a new GitHub repository with branch protection requiring status checks and conversation resolution',
          input: {
            repoUrl: 'github.com?repo=repo&owner=owner',
            requiredStatusCheckContexts: ['ci/build'],
            requiredConversationResolution: true,
          },
        },
      ],
    }),
  },
];
