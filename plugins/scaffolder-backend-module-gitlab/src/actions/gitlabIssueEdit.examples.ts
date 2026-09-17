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
            updatedAt: '2024-05-10T18:00:00.000Z',
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
            updatedAt: '2024-05-10T18:00:00.000Z',
            dueDate: '2024-09-28',
            discussionLocked: true,
            epicId: 1,
            labels: 'phase1:label1,phase2:label2',
          },
        },
      ],
    }),
  },
  {
    description: 'Edit a gitlab issue to change  its state to close',
    example: yaml.stringify({
      steps: [
        {
          id: 'gitlabIssue',
          name: 'EditIssues',
          action: 'gitlab:issue:edit',
          input: {
            ...commonGitlabConfigExample,
            projectId: 12,
            stateEvent: 'close',
          },
        },
      ],
    }),
  },
  {
    description: 'Edit a gitlab issue to change  its state to reopened',
    example: yaml.stringify({
      steps: [
        {
          id: 'gitlabIssue',
          name: 'EditIssues',
          action: 'gitlab:issue:edit',
          input: {
            ...commonGitlabConfigExample,
            projectId: 12,
            stateEvent: 'reopen',
          },
        },
      ],
    }),
  },
  {
    description:
      'Edit a gitlab issue to assign it to multiple users and set milestone',
    example: yaml.stringify({
      steps: [
        {
          id: 'gitlabIssue',
          name: 'EditIssues',
          action: 'gitlab:issue:edit',
          input: {
            ...commonGitlabConfigExample,
            projectId: 12,
            title: 'Test issue with milestone',
            assignees: [18, 20],
            description: 'This issue has milestone set',
            milestoneId: 5,
          },
        },
      ],
    }),
  },
  {
    description: 'Edit a gitlab issue to add weight and update labels',
    example: yaml.stringify({
      steps: [
        {
          id: 'gitlabIssue',
          name: 'EditIssues',
          action: 'gitlab:issue:edit',
          input: {
            ...commonGitlabConfigExample,
            projectId: 12,
            title: 'Issue with weight and labels',
            description: 'This issue has weight and new labels',
            weight: 3,
            labels: 'bug,urgent',
          },
        },
      ],
    }),
  },
  {
    description: 'Edit a gitlab issue to make it confidential',
    example: yaml.stringify({
      steps: [
        {
          id: 'gitlabIssue',
          name: 'EditIssues',
          action: 'gitlab:issue:edit',
          input: {
            ...commonGitlabConfigExample,
            projectId: 12,
            title: 'Confidential Issue',
            description: 'This issue is confidential',
            confidential: true,
          },
        },
      ],
    }),
  },
  {
    description: 'Edit a gitlab issue to lock the discussion',
    example: yaml.stringify({
      steps: [
        {
          id: 'gitlabIssue',
          name: 'EditIssues',
          action: 'gitlab:issue:edit',
          input: {
            ...commonGitlabConfigExample,
            projectId: 12,
            title: 'Locked Discussion Issue',
            description: 'This discussion on this issue is locked',
            discussionLocked: true,
          },
        },
      ],
    }),
  },
  {
    description: 'Edit a gitlab issue to remove labels and update milestone',
    example: yaml.stringify({
      steps: [
        {
          id: 'gitlabIssue',
          name: 'EditIssues',
          action: 'gitlab:issue:edit',
          input: {
            ...commonGitlabConfigExample,
            projectId: 12,
            title: 'Issue with labels removed and milestone updated',
            description: 'This issue has labels removed and milestone updated',
            removeLabels: 'phase1:label1',
            milestoneId: 6,
          },
        },
      ],
    }),
  },
  {
    description: 'Edit a gitlab issue to remove some labels and new ones',
    example: yaml.stringify({
      steps: [
        {
          id: 'gitlabIssue',
          name: 'EditIssues',
          action: 'gitlab:issue:edit',
          input: {
            ...commonGitlabConfigExample,
            projectId: 12,
            title: 'Issue with labels updated',
            description: 'This issue has labels removed and new ones added',
            removeLabels: 'bug,urgent',
            labels: 'enhancement:documentation',
          },
        },
      ],
    }),
  },
  {
    description: 'Edit a gitlab issue to change issue type and add labels',
    example: yaml.stringify({
      steps: [
        {
          id: 'gitlabIssue',
          name: 'EditIssues',
          action: 'gitlab:issue:edit',
          input: {
            ...commonGitlabConfigExample,
            projectId: 12,
            title: 'Issue with type and labels',
            description: 'This issue has been changes and new labels added',
            labels: 'task,high-priority',
            issueType: 'task',
          },
        },
      ],
    }),
  },
];
