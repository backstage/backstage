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
    description: 'Create a GitLab project access token with minimal options.',
    example: yaml.stringify({
      steps: [
        {
          id: 'createAccessToken',
          action: 'gitlab:projectAccessToken:create',
          name: 'Create GitLab Project Access Token',
          input: {
            repoUrl: 'gitlab.com?repo=repo&owner=owner',
            projectId: '456',
          },
        },
      ],
    }),
  },
  {
    description: 'Create a GitLab project access token with custom scopes.',
    example: yaml.stringify({
      steps: [
        {
          id: 'createAccessToken',
          action: 'gitlab:projectAccessToken:create',
          name: 'Create GitLab Project Access Token',
          input: {
            repoUrl: 'gitlab.com?repo=repo&owner=owner',
            projectId: '789',
            scopes: ['read_registry', 'write_repository'],
          },
        },
      ],
    }),
  },
  {
    description: 'Create a GitLab project access token with a specified name.',
    example: yaml.stringify({
      steps: [
        {
          id: 'createAccessToken',
          action: 'gitlab:projectAccessToken:create',
          name: 'Create GitLab Project Access Token',
          input: {
            repoUrl: 'gitlab.com?repo=repo&owner=owner',
            projectId: '101112',
            name: 'my-custom-token',
          },
        },
      ],
    }),
  },
  {
    description:
      'Create a GitLab project access token with a numeric project ID.',
    example: yaml.stringify({
      steps: [
        {
          id: 'createAccessToken',
          action: 'gitlab:projectAccessToken:create',
          name: 'Create GitLab Project Access Token',
          input: {
            repoUrl: 'gitlab.com?repo=repo&owner=owner',
            projectId: 42,
          },
        },
      ],
    }),
  },
  {
    description:
      'Create a GitLab project access token with a specified expired Date.',
    example: yaml.stringify({
      steps: [
        {
          id: 'createAccessToken',
          action: 'gitlab:projectAccessToken:create',
          name: 'Create GitLab Project Access Token',
          input: {
            repoUrl: 'gitlab.com?repo=repo&owner=owner',
            projectId: '123',
            expiresAt: '2024-06-25',
          },
        },
      ],
    }),
  },
  {
    description: 'Create a GitLab project access token with an access level',
    example: yaml.stringify({
      steps: [
        {
          id: 'createAccessToken',
          action: 'gitlab:projectAccessToken:create',
          name: 'Create GitLab Project Access Token',
          input: {
            repoUrl: 'gitlab.com?repo=repo&owner=owner',
            projectId: '456',
            accessLevel: 30,
          },
        },
      ],
    }),
  },
  {
    description: 'Create a GitLab project access token with multiple options',
    example: yaml.stringify({
      steps: [
        {
          id: 'createAccessToken',
          action: 'gitlab:projectAccessToken:create',
          name: 'Create GitLab Project Access Token',
          input: {
            repoUrl: 'gitlab.com?repo=repo&owner=owner',
            projectId: '456',
            accessLevel: 40,
            name: 'full-access-token',
            expiresAt: '2024-12-31',
          },
        },
      ],
    }),
  },
  {
    description:
      'Create a GitLab project access token with a token for authorization',
    example: yaml.stringify({
      steps: [
        {
          id: 'createAccessToken',
          action: 'gitlab:projectAccessToken:create',
          name: 'Create GitLab Project Access Token',
          input: {
            repoUrl: 'gitlab.com?repo=repo&owner=owner',
            projectId: '101112',
            token: 'personal-access-token',
          },
        },
      ],
    }),
  },
  {
    description: 'Create a GitLab project access token with read-only scopes',
    example: yaml.stringify({
      steps: [
        {
          id: 'createAccessToken',
          action: 'gitlab:projectAccessToken:create',
          name: 'Create GitLab Project Access Token',
          input: {
            repoUrl: 'gitlab.com?repo=repo&owner=owner',
            projectId: '101112',
            scopes: ['read_repository', 'read_api'],
          },
        },
      ],
    }),
  },
  {
    description: 'Create a GitLab project access token with guest access level',
    example: yaml.stringify({
      steps: [
        {
          id: 'createAccessToken',
          action: 'gitlab:projectAccessToken:create',
          name: 'Create GitLab Project Access Token',
          input: {
            repoUrl: 'gitlab.com?repo=repo&owner=owner',
            projectId: '101112',
            accessLevel: 10,
          },
        },
      ],
    }),
  },
  {
    description:
      'Create a GitLab project access token with maintainer access level',
    example: yaml.stringify({
      steps: [
        {
          id: 'createAccessToken',
          action: 'gitlab:projectAccessToken:create',
          name: 'Create GitLab Project Access Token',
          input: {
            repoUrl: 'gitlab.com?repo=repo&owner=owner',
            projectId: '101112',
            accessLevel: 40,
          },
        },
      ],
    }),
  },
  {
    description: 'Create a GitLab project access token with owner access level',
    example: yaml.stringify({
      steps: [
        {
          id: 'createAccessToken',
          action: 'gitlab:projectAccessToken:create',
          name: 'Create GitLab Project Access Token',
          input: {
            repoUrl: 'gitlab.com?repo=repo&owner=owner',
            projectId: '101112',
            accessLevel: 50,
          },
        },
      ],
    }),
  },
  {
    description:
      'Create a GitLab project access token with a specified name and no expiration date',
    example: yaml.stringify({
      steps: [
        {
          id: 'createAccessToken',
          action: 'gitlab:projectAccessToken:create',
          name: 'Create GitLab Project Access Token',
          input: {
            repoUrl: 'gitlab.com?repo=repo&owner=owner',
            projectId: '101112',
            name: 'no-expiry-token',
          },
        },
      ],
    }),
  },
  {
    description:
      'Create a GitLab project access token for a specific gitlab instance',
    example: yaml.stringify({
      steps: [
        {
          id: 'createAccessToken',
          action: 'gitlab:projectAccessToken:create',
          name: 'Create GitLab Project Access Token',
          input: {
            repoUrl: 'gitlab.example.com?repo=repo&owner=owner',
            projectId: '101112',
          },
        },
      ],
    }),
  },
];
