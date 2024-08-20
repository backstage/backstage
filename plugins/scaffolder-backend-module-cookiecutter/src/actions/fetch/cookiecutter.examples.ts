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
    description: 'Fetch and template using cookiecutter with minimal options.',
    example: yaml.stringify({
      steps: [
        {
          id: 'fetchTemplate',
          action: 'fetch:cookiecutter',
          name: 'Fetch and Template Using Cookiecutter',
          input: {
            url: 'https://google.com/cookie/cutter',
            values: {
              help: 'me',
            },
          },
        },
      ],
    }),
  },
  {
    description:
      'Fetch and template using cookiecutter with custom target path.',
    example: yaml.stringify({
      steps: [
        {
          id: 'fetchTemplate',
          action: 'fetch:cookiecutter',
          name: 'Fetch and Template Using Cookiecutter',
          input: {
            url: 'https://google.com/cookie/cutter',
            targetPath: 'custom-path',
            values: {
              help: 'me',
            },
          },
        },
      ],
    }),
  },
  {
    description:
      'Fetch and template using cookiecutter with copyWithoutRender.',
    example: yaml.stringify({
      steps: [
        {
          id: 'fetchTemplate',
          action: 'fetch:cookiecutter',
          name: 'Fetch and Template Using Cookiecutter',
          input: {
            url: 'https://google.com/cookie/cutter',
            values: {
              help: 'me',
            },
            copyWithoutRender: ['.github/*', '*.md'],
          },
        },
      ],
    }),
  },
  {
    description:
      'Fetch and template using cookiecutter with custom extensions.',
    example: yaml.stringify({
      steps: [
        {
          id: 'fetchTemplate',
          action: 'fetch:cookiecutter',
          name: 'Fetch and Template Using Cookiecutter',
          input: {
            url: 'https://google.com/cookie/cutter',
            values: {
              help: 'me',
            },
            extensions: ['jinja2_time.TimeExtension'],
          },
        },
      ],
    }),
  },
  {
    description:
      'Fetch and template using cookiecutter with a custom Docker image.',
    example: yaml.stringify({
      steps: [
        {
          id: 'fetchTemplate',
          action: 'fetch:cookiecutter',
          name: 'Fetch and Template Using Cookiecutter',
          input: {
            url: 'https://google.com/cookie/cutter',
            values: {
              help: 'me',
            },
            imageName: 'custom/cookiecutter-image',
          },
        },
      ],
    }),
  },
];
