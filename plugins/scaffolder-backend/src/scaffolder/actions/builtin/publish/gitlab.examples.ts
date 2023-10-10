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
      'Initializes a git repository of the content in the workspace, and publishes it to GitLab.',
    example: yaml.stringify({
      steps: [
        {
          id: 'publish',
          action: 'publish:gitlab',
          name: 'Publish to GitLab',
          input: {
            repoUrl: 'gitlab.com?repo=project_name&owner=group_name',
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
          action: 'publish:gitlab',
          name: 'Publish to GitLab',
          input: {
            repoUrl: 'gitlab.com?repo=project_name&owner=group_name',
            description: 'Initialize a git repository',
          },
        },
      ],
    }),
  },
  {
    description:
      'Sets the commit message on the repository. The default value is `initial commit`.',
    example: yaml.stringify({
      steps: [
        {
          id: 'publish',
          action: 'publish:gitlab',
          name: 'Publish to GitLab',
          input: {
            repoUrl: 'gitlab.com?repo=project_name&owner=group_name',
            description: 'Initialize a git repository',
            gitCommitMessage: 'Started a project.',
          },
        },
      ],
    }),
  },
  {
    description: 'Initializes a git repository with additional settings.',
    example: yaml.stringify({
      steps: [
        {
          id: 'publish',
          action: 'publish:gitlab',
          name: 'Publish to GitLab',
          input: {
            repoUrl: 'gitlab.com?repo=project_name&owner=group_name',
            settings: {
              ci_config_path: '.gitlab-ci.yml',
              visibility: 'public',
            },
          },
        },
      ],
    }),
  },
  {
    description: 'Initializes a git repository with branches settings',
    example: yaml.stringify({
      steps: [
        {
          id: 'publish',
          action: 'publish:gitlab',
          name: 'Publish to GitLab',
          input: {
            repoUrl: 'gitlab.com?repo=project_name&owner=group_name',
            branches: [
              {
                name: 'dev',
                create: true,
                protected: true,
                ref: 'master',
              },
              {
                name: 'master',
                protected: true,
              },
            ],
          },
        },
      ],
    }),
  },
  {
    description: 'Initializes a git repository with environment variables',
    example: yaml.stringify({
      steps: [
        {
          id: 'publish',
          action: 'publish:gitlab',
          name: 'Publish to GitLab',
          input: {
            repoUrl: 'gitlab.com?repo=project_name&owner=group_name',
            projectVariables: [
              {
                key: 'key1',
                value: 'value1',
                protected: true,
                masked: false,
              },
              {
                key: 'key2',
                value: 'value2',
                protected: true,
                masked: false,
              },
            ],
          },
        },
      ],
    }),
  },
];
