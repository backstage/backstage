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
    description: 'Creates a new Gerrit review with minimal options',
    example: yaml.stringify({
      steps: [
        {
          id: 'publish',
          action: 'publish:gerrit:review',
          name: 'Publish new gerrit review',
          input: {
            repoUrl: 'gerrithost.org?repo=repo&owner=owner',
            gitCommitMessage: 'Initial Commit Message',
          },
        },
      ],
    }),
  },
  {
    description: 'Creates a new Gerrit review with gitAuthorName',
    example: yaml.stringify({
      steps: [
        {
          id: 'publish',
          action: 'publish:gerrit:review',
          name: 'Publish new gerrit review',
          input: {
            repoUrl: 'gerrithost.org?repo=repo&owner=owner',
            gitCommitMessage: 'Initial Commit Message',
            gitAuthorName: 'Test User',
          },
        },
      ],
    }),
  },
  {
    description: 'Creates a new Gerrit review with gitAuthorEmail',
    example: yaml.stringify({
      steps: [
        {
          id: 'publish',
          action: 'publish:gerrit:review',
          name: 'Publish new gerrit review',
          input: {
            repoUrl: 'gerrithost.org?repo=repo&owner=owner',
            gitCommitMessage: 'Initial Commit Message',
            gitAuthorName: 'Test User',
            gitAuthorEmail: 'test.user@example.com',
          },
        },
      ],
    }),
  },
  {
    description: 'Creates a new Gerrit review with custom branch',
    example: yaml.stringify({
      steps: [
        {
          id: 'publish',
          action: 'publish:gerrit:review',
          name: 'Publish new gerrit review',
          input: {
            repoUrl: 'gerrithost.org?repo=repo&owner=owner',
            gitCommitMessage: 'Initial Commit Message',
            branch: 'develop',
          },
        },
      ],
    }),
  },
  {
    description: 'Creates a new Gerrit review with custom sourcePath',
    example: yaml.stringify({
      steps: [
        {
          id: 'publish',
          action: 'publish:gerrit:review',
          name: 'Publish new gerrit review',
          input: {
            repoUrl: 'gerrithost.org?repo=repo&owner=owner',
            gitCommitMessage: 'Initial Commit Message',
            sourcePath: './src',
          },
        },
      ],
    }),
  },
  {
    description: 'Creates a new Gerrit review with all properties',
    example: yaml.stringify({
      steps: [
        {
          id: 'publish',
          action: 'publish:gerrit:review',
          name: 'Publish new gerrit review',
          input: {
            repoUrl: 'gerrithost.org?repo=repo&owner=owner',
            gitCommitMessage: 'Initial Commit Message',
            gitAuthorName: 'Test User',
            gitAuthorEmail: 'test.user@example.com',
            branch: 'develop',
            sourcePath: './src',
          },
        },
      ],
    }),
  },
];
