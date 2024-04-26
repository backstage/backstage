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

import { Filter, FilterType } from './types';

import { DashboardPullRequest } from '@backstage/plugin-azure-devops-common';
import { createFilter } from './createFilter';

describe('createFilter', () => {
  const pullRequest = {
    createdBy: {
      uniqueName: 'user1@backstage.com',
      teamIds: ['team1Id', 'team2Id'],
    },
    reviewers: [
      { uniqueName: 'user2@backstage.com' },
      { id: 'team2Id' },
      { id: 'team3Id' },
    ],
  } as DashboardPullRequest;

  const testCases: Array<{ filter: Filter; result: boolean }> = [
    {
      filter: {
        type: FilterType.AssignedToUser,
        email: 'user2@backstage.com',
      },
      result: true,
    },
    {
      filter: {
        type: FilterType.AssignedToUser,
        email: 'random-user@backstage.com',
      },
      result: false,
    },
    {
      filter: {
        type: FilterType.CreatedByUser,
        email: 'user1@backstage.com',
      },
      result: true,
    },
    {
      filter: {
        type: FilterType.CreatedByUser,
        email: 'random-user@backstage.com',
      },
      result: false,
    },
    {
      filter: {
        type: FilterType.AssignedToTeam,
        teamId: 'team2Id',
      },
      result: true,
    },
    {
      filter: {
        type: FilterType.AssignedToTeam,
        teamId: 'randomTeamId',
      },
      result: false,
    },
    {
      filter: {
        type: FilterType.CreatedByTeam,
        teamId: 'team1Id',
      },
      result: true,
    },
    {
      filter: {
        type: FilterType.CreatedByTeam,
        teamId: 'randomTeamId',
      },
      result: false,
    },
    {
      filter: {
        type: FilterType.AssignedToTeams,
        teamIds: ['team2Id', 'randomTeamId'],
      },
      result: true,
    },
    {
      filter: {
        type: FilterType.AssignedToTeams,
        teamIds: ['team2Id', 'team3Id'],
      },
      result: true,
    },
    {
      filter: {
        type: FilterType.AssignedToTeams,
        teamIds: ['randomTeam1Id', 'randomTeam2Id'],
      },
      result: false,
    },
    {
      filter: {
        type: FilterType.CreatedByTeams,
        teamIds: ['team1Id', 'randomTeamId'],
      },
      result: true,
    },
    {
      filter: {
        type: FilterType.CreatedByTeams,
        teamIds: ['team1Id', 'team2Id'],
      },
      result: true,
    },
    {
      filter: {
        type: FilterType.CreatedByTeams,
        teamIds: ['randomTeam1Id', 'randomTeam2Id'],
      },
      result: false,
    },
    {
      filter: {
        type: FilterType.All,
      },
      result: true,
    },
  ];

  testCases.forEach(({ filter, result }) => {
    it(`should return ${String(result)} when pull request ${
      result ? 'is' : 'is not'
    } ${filter.type}`, () => {
      const pullRequestFilter = createFilter(filter);
      expect(pullRequestFilter(pullRequest)).toBe(result);
    });
  });
});
