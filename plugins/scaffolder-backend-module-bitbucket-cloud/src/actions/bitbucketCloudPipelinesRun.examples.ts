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
    description: 'Trigger a pipeline for a branch',
    example: yaml.stringify({
      steps: [
        {
          action: 'bitbucket:pipelines:run',
          id: 'run-bitbucket-pipeline',
          name: 'Run an example bitbucket pipeline',
          input: {
            workspace: 'test-workspace',
            repo_slug: 'test-repo-slug',
            body: {
              target: {
                ref_type: 'branch',
                type: 'pipeline_ref_target',
                ref_name: 'master',
              },
            },
          },
        },
      ],
    }),
  },
  {
    description: 'Trigger a pipeline for a commit on a branch',
    example: yaml.stringify({
      steps: [
        {
          action: 'bitbucket:pipelines:run',
          id: 'run-bitbucket-pipeline',
          name: 'Run an example bitbucket pipeline',
          input: {
            workspace: 'test-workspace',
            repo_slug: 'test-repo-slug',
            body: {
              target: {
                commit: {
                  type: 'commit',
                  hash: 'ce5b7431602f7cbba007062eeb55225c6e18e956',
                },
                ref_type: 'branch',
                type: 'pipeline_ref_target',
                ref_name: 'master',
              },
            },
          },
        },
      ],
    }),
  },
  {
    description: 'Trigger a specific pipeline definition for a commit',
    example: yaml.stringify({
      steps: [
        {
          action: 'bitbucket:pipelines:run',
          id: 'run-bitbucket-pipeline',
          name: 'Run an example bitbucket pipeline',
          input: {
            workspace: 'test-workspace',
            repo_slug: 'test-repo-slug',
            body: {
              target: {
                commit: {
                  type: 'commit',
                  hash: 'a3c4e02c9a3755eccdc3764e6ea13facdf30f923',
                },
                selector: {
                  type: 'custom',
                  pattern: 'Deploy to production',
                },
                type: 'pipeline_commit_target',
              },
            },
          },
        },
      ],
    }),
  },
  {
    description:
      'Trigger a specific pipeline definition for a commit on a branch or tag',
    example: yaml.stringify({
      steps: [
        {
          action: 'bitbucket:pipelines:run',
          id: 'run-bitbucket-pipeline',
          name: 'Run an example bitbucket pipeline',
          input: {
            workspace: 'test-workspace',
            repo_slug: 'test-repo-slug',
            body: {
              target: {
                commit: {
                  type: 'commit',
                  hash: 'a3c4e02c9a3755eccdc3764e6ea13facdf30f923',
                },
                selector: {
                  type: 'custom',
                  pattern: 'Deploy to production',
                },
                type: 'pipeline_ref_target',
                ref_name: 'master',
                ref_type: 'branch',
              },
            },
          },
        },
      ],
    }),
  },
  {
    description: 'Trigger a custom pipeline with variables',
    example: yaml.stringify({
      steps: [
        {
          action: 'bitbucket:pipelines:run',
          id: 'run-bitbucket-pipeline',
          name: 'Run an example bitbucket pipeline',
          input: {
            workspace: 'test-workspace',
            repo_slug: 'test-repo-slug',
            body: {
              target: {
                type: 'pipeline_ref_target',
                ref_name: 'master',
                ref_type: 'branch',
                selector: {
                  type: 'custom',
                  pattern: 'Deploy to production',
                },
              },
              variables: [
                { key: 'var1key', value: 'var1value', secured: true },
                {
                  key: 'var2key',
                  value: 'var2value',
                },
              ],
            },
          },
        },
      ],
    }),
  },
  {
    description: 'Trigger a pull request pipeline',
    example: yaml.stringify({
      steps: [
        {
          action: 'bitbucket:pipelines:run',
          id: 'run-bitbucket-pipeline',
          name: 'Run an example bitbucket pipeline',
          input: {
            workspace: 'test-workspace',
            repo_slug: 'test-repo-slug',
            body: {
              target: {
                type: 'pipeline_pullrequest_target',
                source: 'pull-request-branch',
                destination: 'master',
                destination_commit: {
                  hash: '9f848b7',
                },
                commit: {
                  hash: '1a372fc',
                },
                pull_request: {
                  id: '3',
                },
                selector: {
                  type: 'pull-requests',
                  pattern: '**',
                },
              },
            },
          },
        },
      ],
    }),
  },
];
