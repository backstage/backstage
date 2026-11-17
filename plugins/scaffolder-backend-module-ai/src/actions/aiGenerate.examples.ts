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

export const generateExamples: TemplateExample[] = [
  {
    description: 'Generates a README seed for a new service',
    example: yaml.stringify({
      steps: [
        {
          id: 'generateReadme',
          action: 'ai:generate',
          name: 'Generate README',
          input: {
            prompt:
              'Write a README.md for a new backend service, with sections for overview, development, and operations',
            context: 'Service name: orders-api, written in TypeScript',
          },
        },
      ],
    }),
  },
  {
    description: 'Generates content directly into the workspace',
    example: yaml.stringify({
      steps: [
        {
          id: 'writeDocs',
          action: 'ai:generate',
          name: 'Generate docs page',
          input: {
            prompt: 'Write a short docs page describing the API endpoints',
            outputPath: 'docs/api.md',
          },
        },
      ],
    }),
  },
];
