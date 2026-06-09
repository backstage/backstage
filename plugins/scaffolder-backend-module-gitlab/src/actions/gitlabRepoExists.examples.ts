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
    description: 'Check whether a GitLab repository exists',
    example: yaml.stringify({
      steps: [
        {
          id: 'repoExists',
          name: 'Check repository exists',
          action: 'gitlab:repo:exists',
          input: {
            repoUrl: 'gitlab.com?repo=project_name&owner=group_name',
          },
        },
      ],
    }),
  },
  {
    description:
      'Check whether a GitLab repository exists using a custom token for authorization',
    example: yaml.stringify({
      steps: [
        {
          id: 'repoExists',
          name: 'Check repository exists',
          action: 'gitlab:repo:exists',
          input: {
            repoUrl: 'gitlab.com?repo=project_name&owner=group_name',
            token: '${{ secrets.GITLAB_TOKEN }}',
          },
        },
      ],
    }),
  },
  {
    description:
      'Use the `exists` output to conditionally run a later step only when the repository does not already exist',
    example: yaml.stringify({
      steps: [
        {
          id: 'repoExists',
          name: 'Check repository exists',
          action: 'gitlab:repo:exists',
          input: {
            repoUrl: 'gitlab.com?repo=project_name&owner=group_name',
          },
        },
        {
          id: 'publish',
          name: 'Publish repository',
          if: '${{ not steps.repoExists.output.exists }}',
          action: 'publish:gitlab',
          input: {
            repoUrl: 'gitlab.com?repo=project_name&owner=group_name',
          },
        },
      ],
    }),
  },
];
