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
    description: 'Downloads content and places it in the workspace.',
    example: yaml.stringify({
      steps: [
        {
          action: 'fetch:plain',
          id: 'fetch-plain',
          name: 'Fetch plain',
          input: {
            url: 'https://github.com/backstage/community/tree/main/backstage-community-sessions/assets',
          },
        },
      ],
    }),
  },
  {
    description:
      'Optionally, if you would prefer the data to be downloaded to a subdirectory in the workspace you may specify the ‘targetPath’ input option.',
    example: yaml.stringify({
      steps: [
        {
          action: 'fetch:plain',
          id: 'fetch-plain',
          name: 'Fetch plain',
          input: {
            url: 'https://github.com/backstage/community/tree/main/backstage-community-sessions/assets',
            targetPath: 'fetched-data',
          },
        },
      ],
    }),
  },
];
