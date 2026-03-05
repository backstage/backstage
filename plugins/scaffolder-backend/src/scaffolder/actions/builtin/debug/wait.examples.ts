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
    description: 'Waiting for 50 milliseconds',
    example: yaml.stringify({
      steps: [
        {
          action: 'debug:wait',
          id: 'wait-milliseconds',
          name: 'Waiting for 50 milliseconds',
          input: {
            milliseconds: 50,
          },
        },
      ],
    }),
  },
  {
    description: 'Waiting for 5 seconds',
    example: yaml.stringify({
      steps: [
        {
          action: 'debug:wait',
          id: 'wait-5sec',
          name: 'Waiting for 5 seconds',
          input: {
            seconds: 5,
          },
        },
      ],
    }),
  },
  {
    description: 'Waiting for 1 minutes',
    example: yaml.stringify({
      steps: [
        {
          action: 'debug:wait',
          id: 'wait-1min',
          name: 'Waiting for 1 minutes',
          input: {
            minutes: 1,
          },
        },
      ],
    }),
  },
];
