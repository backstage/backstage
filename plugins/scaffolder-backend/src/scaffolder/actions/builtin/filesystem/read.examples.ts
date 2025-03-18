/*
 * Copyright 2024 The Backstage Authors
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
import * as yaml from 'yaml';

export const examples: TemplateExample[] = [
  {
    description: 'Read complete content of workspace',
    example: yaml.stringify({
      steps: [
        {
          action: 'fs:readdir',
          id: 'read-workdir',
          name: 'Read workspace directory',
          input: {
            paths: ['.'],
          },
        },
      ],
    }),
  },
  {
    description: 'Get content of the docs folder',
    example: yaml.stringify({
      steps: [
        {
          action: 'fs:readdir',
          id: 'read-workdir',
          name: 'Read workspace directory',
          input: {
            paths: ['docs'],
            recursive: true,
          },
        },
      ],
    }),
  },
  {
    description: 'Get content of multiple folders',
    example: yaml.stringify({
      steps: [
        {
          action: 'fs:readdir',
          id: 'read-workdir',
          name: 'Read workspace directory',
          input: {
            paths: ['foo', 'bar'],
            recursive: true,
          },
        },
      ],
    }),
  },
];
