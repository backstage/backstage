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
import { commonGitlabConfigExample } from '../commonGitlabConfig';

export const examples: TemplateExample[] = [
  {
    description: 'Trigger a GitLab Project Pipeline',
    example: yaml.stringify({
      steps: [
        {
          id: 'triggerPipeline',
          name: 'Trigger Project Pipeline',
          action: 'gitlab:pipeline:trigger',
          input: {
            ...commonGitlabConfigExample,
            projectId: 12,
            tokenDescription:
              'This is the text that will appear in the pipeline token',
            token: 'glpt-xxxxxxxxxxxx',
            branch: 'main',
            variables: { var_one: 'one', var_two: 'two' },
          },
        },
      ],
    }),
  },
  {
    description: 'Trigger a GitLab Project Pipeline with No Variables',
    example: yaml.stringify({
      steps: [
        {
          id: 'triggerPipeline',
          name: 'Trigger Project Pipeline',
          action: 'gitlab:pipeline:trigger',
          input: {
            ...commonGitlabConfigExample,
            projectId: 12,
            tokenDescription:
              'This is the text that will appear in the pipeline token',
            token: 'glpt-xxxxxxxxxxxx',
            branch: 'main',
            variables: {},
          },
        },
      ],
    }),
  },
  {
    description: 'Trigger a GitLab Project Pipeline with Single Variables',
    example: yaml.stringify({
      steps: [
        {
          id: 'triggerPipeline',
          name: 'Trigger Project Pipeline',
          action: 'gitlab:pipeline:trigger',
          input: {
            ...commonGitlabConfigExample,
            projectId: 12,
            tokenDescription:
              'This is the text that will appear in the pipeline token',
            token: 'glpt-xxxxxxxxxxxx',
            branch: 'main',
            variables: { var_one: 'one' },
          },
        },
      ],
    }),
  },
  {
    description: 'Trigger a GitLab Project Pipeline with Multiple Variables',
    example: yaml.stringify({
      steps: [
        {
          id: 'triggerPipeline',
          name: 'Trigger Project Pipeline',
          action: 'gitlab:pipeline:trigger',
          input: {
            ...commonGitlabConfigExample,
            projectId: 12,
            tokenDescription:
              'This is the text that will appear in the pipeline token',
            token: 'glpt-xxxxxxxxxxxx',
            branch: 'main',
            variables: { var_one: 'one', var_two: 'two', var_three: 'three' },
          },
        },
      ],
    }),
  },
];
