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
    description:
      'Fetch the DSN for a Sentry project with authentication token.',
    example: yaml.stringify({
      steps: [
        {
          id: 'fetch-sentry-dsn',
          action: 'sentry:fetch:dsn',
          name: 'Fetch DSN using auth token',
          input: {
            organizationSlug: 'my-org',
            projectSlug: 'my-project',
            authToken:
              'a14711beb516e1e910d2ede554dc1bf725654ef3c75e5a9106de9aec13d5df96',
          },
        },
      ],
    }),
  },
  {
    description:
      'Fetch the DSN for a Sentry project using the token from the configuration.',
    example: yaml.stringify({
      steps: [
        {
          id: 'fetch-sentry-dsn',
          action: 'sentry:fetch:dsn',
          name: 'Fetch DSN using config token',
          input: {
            organizationSlug: 'my-org',
            projectSlug: 'my-project',
          },
        },
      ],
    }),
  },
];
