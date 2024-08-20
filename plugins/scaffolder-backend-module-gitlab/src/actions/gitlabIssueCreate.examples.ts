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
    description: 'Create a GitLab issue with minimal options',
    example: yaml.stringify({
      steps: [
        {
          id: 'gitlabIssue',
          name: 'Issues',
          action: 'gitlab:issues:create',
          input: {
            ...commonGitlabConfigExample,
            projectId: 12,
            title: 'Test Issue',
            description: 'This is the description of the issue',
          },
        },
      ],
    }),
  },
  {
    description: 'Create a GitLab issue with assignees and date options',
    example: yaml.stringify({
      steps: [
        {
          id: 'gitlabIssue',
          name: 'Issues',
          action: 'gitlab:issues:create',
          input: {
            ...commonGitlabConfigExample,
            projectId: 12,
            title: 'Test Issue',
            assignees: [18],
            description: 'This is the description of the issue',
            createdAt: '2022-09-27T18:00:00.000Z',
            dueDate: '2022-09-28T12:00:00.000Z',
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
          name: 'Issues',
          action: 'gitlab:issues:create',
          input: {
            ...commonGitlabConfigExample,
            projectId: 12,
            title: 'Test Issue',
            assignees: [18, 15],
            description: 'This is the description of the issue',
            confidential: false,
            createdAt: '2022-09-27T18:00:00.000Z',
            dueDate: '2022-09-28T12:00:00.000Z',
            discussionToResolve: '1',
            epicId: 1,
            labels: 'phase1:label1,phase2:label2',
          },
        },
      ],
    }),
  },
  {
    description: 'Create a GitLab issue with token',
    example: yaml.stringify({
      steps: [
        {
          id: 'gitlabIssue',
          name: 'Issues',
          action: 'gitlab:issues:create',
          input: {
            ...commonGitlabConfigExample,
            projectId: 12,
            title: 'Test Issue',
            description: 'This is the description of the issue',
            token: 'sample token',
          },
        },
      ],
    }),
  },
  {
    description: 'Create a GitLab issue with a specific milestone and weight',
    example: yaml.stringify({
      steps: [
        {
          id: 'gitlabIssue',
          name: 'Issues',
          action: 'gitlab:issues:create',
          input: {
            ...commonGitlabConfigExample,
            projectId: 12,
            title: 'Test Issue with Milestone',
            description: 'This is the description of the issue',
            milestoneId: 5,
            weight: 3,
          },
        },
      ],
    }),
  },
  {
    description: 'Create a GitLab issue of type INCIDENT',
    example: yaml.stringify({
      steps: [
        {
          id: 'gitlabIssue',
          name: 'Issues',
          action: 'gitlab:issues:create',
          input: {
            ...commonGitlabConfigExample,
            projectId: 12,
            title: 'Confidential Test Issue',
            description: 'This is the description of the issue',
            issueType: 'incident',
          },
        },
      ],
    }),
  },
  {
    description: 'Create a GitLab issue of type TEST',
    example: yaml.stringify({
      steps: [
        {
          id: 'gitlabIssue',
          name: 'Issues',
          action: 'gitlab:issues:create',
          input: {
            ...commonGitlabConfigExample,
            projectId: 12,
            title: 'Confidential Test Issue',
            description: 'This is the description of the issue',
            issueType: 'test_case',
          },
        },
      ],
    }),
  },
  {
    description: 'Create a GitLab issue of type TASK with assignees',
    example: yaml.stringify({
      steps: [
        {
          id: 'gitlabIssue',
          name: 'Issues',
          action: 'gitlab:issues:create',
          input: {
            ...commonGitlabConfigExample,
            projectId: 12,
            title: 'Confidential Test Issue',
            description: 'This is the description of the issue',
            issueType: 'task',
            assignees: [18, 22],
          },
        },
      ],
    }),
  },
  {
    description: 'Create a GitLab issue of type ISSUE and close it',
    example: yaml.stringify({
      steps: [
        {
          id: 'gitlabIssue',
          name: 'Issues',
          action: 'gitlab:issues:create',
          input: {
            ...commonGitlabConfigExample,
            projectId: 12,
            title: 'Confidential Test Issue',
            description: 'This is the description of the issue',
            issueType: 'issue',
            stateEvent: 'close',
          },
        },
      ],
    }),
  },
  {
    description: 'Create a GitLab issue of type INCIDENT and reopen it',
    example: yaml.stringify({
      steps: [
        {
          id: 'gitlabIssue',
          name: 'Issues',
          action: 'gitlab:issues:create',
          input: {
            ...commonGitlabConfigExample,
            projectId: 12,
            title: 'Confidential Test Issue',
            description: 'This is the description of the issue',
            issueType: 'incident',
            stateEvent: 'reopen',
          },
        },
      ],
    }),
  },
  {
    description:
      'Create a GitLab issue to resolve a discussion in a merge request',
    example: yaml.stringify({
      steps: [
        {
          id: 'gitlabIssue',
          name: 'Issues',
          action: 'gitlab:issues:create',
          input: {
            ...commonGitlabConfigExample,
            projectId: 12,
            title: 'Test Issue for MR Discussion',
            description: 'This is the description of the issue',
            mergeRequestToResolveDiscussionsOf: 42,
            discussionToResolve: 'abc123',
          },
        },
      ],
    }),
  },
];
