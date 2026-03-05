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
import yaml from 'yaml';

export const examples: TemplateExample[] = [
  {
    description:
      'Creating pull request on bitbucket cloud with required fields',
    example: yaml.stringify({
      steps: [
        {
          action: 'publish:bitbucketCloud:pull-request',
          id: 'publish-bitbucket-cloud-pull-request-minimal',
          name: 'Creating pull request on bitbucket cloud',
          input: {
            repoUrl:
              'bitbucket.org?workspace=workspace&project=project&repo=repo',
            title: 'My pull request',
            sourceBranch: 'my-feature-branch',
          },
        },
      ],
    }),
  },
  {
    description:
      'Creating pull request on bitbucket cloud with custom descriptions',
    example: yaml.stringify({
      steps: [
        {
          action: 'publish:bitbucketCloud:pull-request',
          id: 'publish-bitbucket-cloud-pull-request-minimal',
          name: 'Creating pull request on bitbucket cloud',
          input: {
            repoUrl:
              'bitbucket.org?workspace=workspace&project=project&repo=repo',
            title: 'My pull request',
            sourceBranch: 'my-feature-branch',
            description: 'This is a detailed description of my pull request',
          },
        },
      ],
    }),
  },
  {
    description:
      'Creating pull request on bitbucket cloud with different target branch',
    example: yaml.stringify({
      steps: [
        {
          action: 'publish:bitbucketCloud:pull-request',
          id: 'publish-bitbucket-cloud-pull-request-target-branch',
          name: 'Creating pull request on bitbucket cloud',
          input: {
            repoUrl:
              'bitbucket.org?workspace=workspace&project=project&repo=repo',
            title: 'My pull request',
            sourceBranch: 'my-feature-branch',
            targetBranch: 'development',
          },
        },
      ],
    }),
  },
  {
    description:
      'Creating pull request on bitbucket cloud with authorization token',
    example: yaml.stringify({
      steps: [
        {
          action: 'publish:bitbucketCloud:pull-request',
          id: 'publish-bitbucket-cloud-pull-request-minimal',
          name: 'Creating pull request on bitbucket cloud',
          input: {
            repoUrl:
              'bitbucket.org?workspace=workspace&project=project&repo=repo',
            title: 'My pull request',
            sourceBranch: 'my-feature-branch',
            token: 'my-auth-token',
          },
        },
      ],
    }),
  },
  {
    description: 'Creating pull request on bitbucket cloud with all fields',
    example: yaml.stringify({
      steps: [
        {
          action: 'publish:bitbucketCloud:pull-request',
          id: 'publish-bitbucket-cloud-pull-request-minimal',
          name: 'Creating pull request on bitbucket cloud',
          input: {
            repoUrl:
              'bitbucket.org?workspace=workspace&project=project&repo=repo',
            title: 'My pull request',
            sourceBranch: 'my-feature-branch',
            targetBranch: 'development',
            description: 'This is a detailed description of my pull request',
            token: 'my-auth-token',
            gitAuthorName: 'test-user',
            gitAuthorEmail: 'test-user@sample.com',
          },
        },
      ],
    }),
  },
];
