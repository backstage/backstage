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
    description: 'Edit a GitLab issue with minimal options',
    example: yaml.stringify({
      steps: [
        {
          id: 'gitlabIssue',
          name: 'EditIssues',
          action: 'gitlab:issue:edit',
          input: {
            ...commonGitlabConfigExample,
            projectId: 12,
            title: 'Modified Test Issue',
            description: 'This is a modified description of the issue',
          },
        },
      ],
    }),
  },
  {
    description: 'Edit a GitLab issue with assignees and date options',
    example: yaml.stringify({
      steps: [
        {
          id: 'gitlabIssue',
          name: 'EditIssues',
          action: 'gitlab:issue:edit',
          input: {
            ...commonGitlabConfigExample,
            projectId: 12,
            title: 'Test Issue',
            assignees: [18],
            description: 'This is the edited description of the issue',
            updatedAt: '2024-05-10 18:00:00.000',
            dueDate: '2024-09-28',
          },
        },
      ],
    }),
  },
  {
    description: 'Create a GitLab Issue with several options',
    example: yaml.stringify({
      steps: [
        {
          id: 'gitlabIssue',
          name: 'EditIssues',
          action: 'gitlab:issue:edit',
          input: {
            ...commonGitlabConfigExample,
            projectId: 12,
            title: 'Test Edit Issue',
            assignees: [18, 15],
            description: 'This is the description of the issue',
            confidential: false,
            updatedAt: '2024-05-10 18:00:00.000',
            dueDate: '2024-09-28',
            discussionLocked: true,
            epicId: 1,
            labels: 'phase1:label1,phase2:label2',
          },
        },
      ],
    }),
  },
];
