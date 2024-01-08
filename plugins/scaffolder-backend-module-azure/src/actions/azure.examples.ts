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
      'Initializes a git repository of the content in the workspace, and publishes it to Azure.',
    example: yaml.stringify({
      steps: [
        {
          id: 'publish',
          action: 'publish:azure',
          name: 'Publish to Azure',
          input: {
            repoUrl:
              'dev.azure.com?organization=organization&owner=project&repo=repo',
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
          action: 'publish:azure',
          name: 'Publish to Azure',
          input: {
            repoUrl:
              'dev.azure.com?organization=organization&owner=project&repo=repo',
            description: 'Initialize a git repository',
          },
        },
      ],
    }),
  },
  {
    description: 'Change the default branch.',
    example: yaml.stringify({
      steps: [
        {
          id: 'publish',
          action: 'publish:azure',
          name: 'Publish to Azure',
          input: {
            repoUrl:
              'dev.azure.com?organization=organization&owner=project&repo=repo',
            description: 'Initialize a git repository',
            defaultBranch: 'main',
          },
        },
      ],
    }),
  },
];
