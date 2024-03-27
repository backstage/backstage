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
    description:
      'Initializes a git repository and publishes it to Bitbucket Cloud with the default configuration.',
    example: yaml.stringify({
      steps: [
        {
          id: 'publish',
          action: 'publish:bitbucketCloud',
          name: 'Publish to Bitbucket Cloud',
          input: {
            repoUrl:
              'bitbucket.org?repo=repo&workspace=workspace&project=project',
          },
        },
      ],
    }),
  },
  {
    description: 'Initializes a git repository with a custom description.',
    example: yaml.stringify({
      steps: [
        {
          id: 'publish',
          action: 'publish:bitbucketCloud',
          name: 'Publish to Bitbucket Cloud',
          input: {
            repoUrl:
              'bitbucket.org?repo=repo&workspace=workspace&project=project',
            description: 'Initialize a git repository',
          },
        },
      ],
    }),
  },
  {
    description:
      'Initializes a git repository and sets repo visibility to public.',
    example: yaml.stringify({
      steps: [
        {
          id: 'publish',
          action: 'publish:bitbucketCloud',
          name: 'Publish to Bitbucket Cloud',
          input: {
            repoUrl:
              'bitbucket.org?repo=repo&workspace=workspace&project=project',
            repoVisibility: 'public',
          },
        },
      ],
    }),
  },
  {
    description:
      'Initializes a git repository and sets default branch to main.',
    example: yaml.stringify({
      steps: [
        {
          id: 'publish',
          action: 'publish:bitbucketCloud',
          name: 'Publish to Bitbucket Cloud',
          input: {
            repoUrl:
              'bitbucket.org?repo=repo&workspace=workspace&project=project',
            defaultBranch: 'main',
          },
        },
      ],
    }),
  },
  {
    description:
      'Initializes a git repository with the contents of the specified path.',
    example: yaml.stringify({
      steps: [
        {
          id: 'publish',
          action: 'publish:bitbucketCloud',
          name: 'Publish to Bitbucket Cloud',
          input: {
            repoUrl:
              'bitbucket.org?repo=repo&workspace=workspace&project=project',
            sourcePath: './repoRoot',
          },
        },
      ],
    }),
  },
  {
    description:
      'Initializes a git repository using a custom authentication token',
    example: yaml.stringify({
      steps: [
        {
          id: 'publish',
          action: 'publish:bitbucketCloud',
          name: 'Publish to Bitbucket Cloud',
          input: {
            repoUrl:
              'bitbucket.org?repo=repo&workspace=workspace&project=project',
            token: 'your-custom-auth-token',
          },
        },
      ],
    }),
  },
  {
    description:
      'Initializes a git repository using all of the custom options together',
    example: yaml.stringify({
      steps: [
        {
          id: 'publish',
          action: 'publish:bitbucketCloud',
          name: 'Publish to Bitbucket Cloud',
          input: {
            repoUrl:
              'bitbucket.org?repo=repo&workspace=workspace&project=project',
            description: 'Initialize a git repository',
            repoVisibility: 'public',
            defaultBranch: 'main',
            token: 'your-custom-auth-token',
          },
        },
      ],
    }),
  },
];
