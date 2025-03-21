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
    description: 'Create a merge request with a specific assignee',
    example: yaml.stringify({
      steps: [
        {
          id: 'createMergeRequest',
          action: 'publish:gitlab:merge-request',
          name: 'Create a Merge Request',
          input: {
            repoUrl: 'gitlab.com?repo=repo&owner=owner',
            title: 'Create my new MR',
            description: 'This MR is really good',
            sourcePath: './path/to/my/changes',
            branchName: 'new-mr',
            assignee: 'my-assignee',
          },
        },
      ],
    }),
  },
  {
    description:
      'Create a merge request with removal of source branch after merge',
    example: yaml.stringify({
      steps: [
        {
          id: 'createMergeRequest',
          action: 'publish:gitlab:merge-request',
          name: 'Create a Merge Request',
          input: {
            repoUrl: 'gitlab.com?repo=repo&owner=owner',
            title: 'Create my new MR',
            description: 'This MR is really good',
            sourcePath: './path/to/my/changes',
            branchName: 'new-mr',
            removeSourceBranch: true,
          },
        },
      ],
    }),
  },
  {
    description: 'Create a merge request with a target branch',
    example: yaml.stringify({
      steps: [
        {
          id: 'createMergeRequest',
          action: 'publish:gitlab:merge-request',
          name: 'Create a Merge Request',
          input: {
            repoUrl: 'gitlab.com?repo=repo&owner=owner',
            title: 'Create my new MR',
            description: 'This MR is really good',
            sourcePath: './path/to/my/changes',
            branchName: 'new-mr',
            targetBranchName: 'test',
            targetPath: 'Subdirectory',
          },
        },
      ],
    }),
  },
  {
    description: 'Create a merge request with a commit action as create',
    example: yaml.stringify({
      steps: [
        {
          id: 'createMergeRequest',
          action: 'publish:gitlab:merge-request',
          name: 'Create a Merge Request',
          input: {
            repoUrl: 'gitlab.com?repo=repo&owner=owner',
            title: 'Create my new MR',
            branchName: 'new-mr',
            description: 'MR description',
            commitAction: 'create',
            targetPath: 'source',
          },
        },
      ],
    }),
  },
  {
    description: 'Create a merge request with a commit action as delete',
    example: yaml.stringify({
      steps: [
        {
          id: 'createMergeRequest',
          action: 'publish:gitlab:merge-request',
          name: 'Create a Merge Request',
          input: {
            repoUrl: 'gitlab.com?repo=repo&owner=owner',
            title: 'Create my new MR',
            branchName: 'new-mr',
            description: 'MR description',
            commitAction: 'delete',
            targetPath: 'source',
          },
        },
      ],
    }),
  },
  {
    description: 'Create a merge request with a commit action as update',
    example: yaml.stringify({
      steps: [
        {
          id: 'createMergeRequest',
          action: 'publish:gitlab:merge-request',
          name: 'Create a Merge Request',
          input: {
            repoUrl: 'gitlab.com?repo=repo&owner=owner',
            title: 'Create my new MR',
            branchName: 'new-mr',
            description: 'MR description',
            commitAction: 'update',
            targetPath: 'source',
          },
        },
      ],
    }),
  },
];
