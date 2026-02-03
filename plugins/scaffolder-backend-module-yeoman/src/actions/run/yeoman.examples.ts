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
    description: 'Run a Yeoman generator with minimal options',
    example: yaml.stringify({
      steps: [
        {
          id: 'run:yeoman',
          action: 'run:yeoman',
          name: 'Running a yeoman generator',
          input: {
            namespace: 'node:app',
          },
        },
      ],
    }),
  },
  {
    description:
      'Run a yeoman generator with arguments to pass on to Yeoman for templating',
    example: yaml.stringify({
      steps: [
        {
          id: 'run:yeoman',
          action: 'run:yeoman',
          name: 'Running a yeoman generator',
          input: {
            namespace: 'node:app',
            args: ['arg1', 'arg2'],
          },
        },
      ],
    }),
  },
  {
    description:
      'Run a yeoman generator with options to pass on to Yeoman for templating',
    example: yaml.stringify({
      steps: [
        {
          id: 'run:yeoman',
          action: 'run:yeoman',
          name: 'Running a yeoman generator',
          input: {
            namespace: 'node:app',
            options: { option1: 'value1', option2: 'value2' },
          },
        },
      ],
    }),
  },
  {
    description: 'Run a yeoman generator with all options',
    example: yaml.stringify({
      steps: [
        {
          id: 'run:yeoman',
          action: 'run:yeoman',
          name: 'Running a yeoman generator',
          input: {
            namespace: 'node:app',
            args: ['arg1', 'arg2'],
            options: { option1: 'value1', option2: 'value2' },
          },
        },
      ],
    }),
  },
];
