/*
 * Copyright 2026 The Backstage Authors
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
    description: 'Get current authenticated user information',
    example: yaml.stringify({
      steps: [
        {
          id: 'gitlabUserInfo',
          name: 'Get Current User Info',
          action: 'gitlab:user:info',
          input: {
            repoUrl: 'gitlab.com?repo=repo&owner=owner',
          },
        },
      ],
    }),
  },
  {
    description: 'Get user information by user ID',
    example: yaml.stringify({
      steps: [
        {
          id: 'gitlabUserInfo',
          name: 'Get User Info',
          action: 'gitlab:user:info',
          input: {
            repoUrl: 'gitlab.com?repo=repo&owner=owner',
            userId: 12345,
          },
        },
      ],
    }),
  },
  {
    description: 'Get user information with a custom token',
    example: yaml.stringify({
      steps: [
        {
          id: 'gitlabUserInfo',
          name: 'Get User Info',
          action: 'gitlab:user:info',
          input: {
            repoUrl: 'gitlab.com?repo=repo&owner=owner',
            token: '${{ secrets.GITLAB_TOKEN }}',
            userId: 12345,
          },
        },
      ],
    }),
  },
  {
    description: 'Get user information from a self-hosted GitLab instance',
    example: yaml.stringify({
      steps: [
        {
          id: 'gitlabUserInfo',
          name: 'Get User Info',
          action: 'gitlab:user:info',
          input: {
            repoUrl: 'gitlab.example.com?repo=repo&owner=owner',
            userId: 12345,
          },
        },
      ],
    }),
  },
];
