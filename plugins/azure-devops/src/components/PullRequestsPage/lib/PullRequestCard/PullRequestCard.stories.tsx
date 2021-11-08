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

import { MemoryRouter } from 'react-router';
import { PullRequest } from '../../../../api/types';
import { PullRequestCard } from './PullRequestCard';
import { PullRequestStatus } from 'azure-devops-node-api/interfaces/GitInterfaces';
import React from 'react';

export default {
  title: 'Plugins/Azure Devops/Pull Request Card',
  component: PullRequestCard,
};

const pullRequest: PullRequest = {
  pullRequestId: 1,
  title:
    "feat(EXUX-4091): 🛂 Added the admin role authorization to the backend API's",
  description:
    'This PR contains the following updates:\n\n| Package | Type | Update | Change |\n|---|---|---|---|\n| [@typescript-eslint/eslint-plugin](https://github.com/typescript-eslint/typescript-eslint) | devDependencies | major | [`4.33.0` -> `5.0.0`](https://renovatebot.com/diffs/npm/@typescript-eslint%2feslint-plugin/4.33.0/5.0.0) |\n| [@typescript-eslint/parser](https://github.com/typescript-eslint/typescrip',
  link: '',
  repository: {
    name: 'backstage',
    url: '',
  },
  createdBy: {
    id: '',
    displayName: 'Marley',
    uniqueName: 'marley@test.com',
    imageUrl:
      'https://dev.azure.com/exclaimerltd/_api/_common/identityImage?id=e6c0634b-68d2-6e6f-aa7d-adccada23216',
  },
  reviewers: [
    { displayName: 'Marley', imageUrl: '' },
    { displayName: 'User 1', imageUrl: '' },
    { displayName: 'User 2', imageUrl: '' },
  ],
  policies: [
    {
      type: 'Build',
      status: 'Running',
      text: 'Build: UI (running)',
    },
    {
      type: 'MinimumReviewers',
      text: 'Minimum number of reviewers (2)',
      status: '',
    },
    {
      type: 'Comments',
      text: 'Comment requirements',
      status: '',
    },
  ],
  hasAutoComplete: true,
  creationDate: new Date(Date.now() - 10000000).toISOString(),
  sourceRefName: '',
  targetRefName: '',
  status: PullRequestStatus.Active,
  isDraft: false,
};

export const Default = () => (
  <MemoryRouter>
    <PullRequestCard pullRequest={pullRequest} />
  </MemoryRouter>
);

export const Simplified = () => (
  <MemoryRouter>
    <PullRequestCard pullRequest={pullRequest} simplified />
  </MemoryRouter>
);
