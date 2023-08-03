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
import * as yaml from 'yaml';

export const examples: TemplateExample[] = [
  {
    description: 'Write a catalog yaml file',
    example: yaml.stringify({
      steps: [
        {
          action: 'catalog:write',
          id: 'create-catalog-info-file',
          name: 'Create catalog file',
          input: {
            entity: {
              apiVersion: 'backstage.io/v1alpha1',
              kind: 'Component',
              metadata: {
                name: 'test',
                annotations: {},
              },
              spec: {
                type: 'service',
                lifecycle: 'production',
                owner: 'default/owner',
              },
            },
          },
        },
      ],
    }),
  },
];
