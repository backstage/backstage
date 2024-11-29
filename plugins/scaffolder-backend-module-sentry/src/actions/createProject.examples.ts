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
    description: 'Creates a Sentry project with the specified parameters.',
    example: yaml.stringify({
      steps: [
        {
          id: 'create-sentry-project',
          action: 'sentry:project:create',
          name: 'Create a Sentry project with provided project slug.',
          input: {
            organizationSlug: 'my-org',
            teamSlug: 'team-a',
            name: 'Scaffolded project A',
            slug: 'scaff-proj-a',
            authToken:
              'a14711beb516e1e910d2ede554dc1bf725654ef3c75e5a9106de9aec13d5df96',
          },
        },
        {
          id: 'create-sentry-project',
          action: 'sentry:project:create',
          name: 'Create a Sentry project without providing a project slug.',
          input: {
            organizationSlug: 'my-org',
            teamSlug: 'team-b',
            name: 'Scaffolded project B',
            authToken:
              'b15711beb516e1e910d2ede554dc1bf725654ef3c75e5a9106de9aec13d4gf93',
          },
        },
      ],
    }),
  },
  {
    description: 'Creates a Sentry project when no auth token is passed',
    example: yaml.stringify({
      steps: [
        {
          id: 'create-sentry-project',
          action: 'sentry:project:create',
          name: 'Create a Sentry project with provided project slug.',
          input: {
            organizationSlug: 'my-org',
            teamSlug: 'team-a',
            name: 'Scaffolded project A',
          },
        },
      ],
    }),
  },
  {
    description:
      'Creates a Sentry project with a long project name and automatically generated slug.',
    example: yaml.stringify({
      steps: [
        {
          id: 'create-sentry-project',
          action: 'sentry:project:create',
          name: 'Create a Sentry project with a long name and no slug provided.',
          input: {
            organizationSlug: 'my-org',
            teamSlug: 'team-c',
            name: 'A very long name for the scaffolded project C that will generate a slug',
            authToken:
              'c16711beb516e1e910d2ede554dc1bf725654ef3c75e5a9106de9aec13d6gf94',
          },
        },
      ],
    }),
  },
];
