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

import { AllFilter } from './allFilter';
import { AssignedToTeamFilter } from './assignedToTeamFilter';
import { AssignedToTeamsFilter } from './assignedToTeamsFilter';
import { AssignedToUserFilter } from './assignedToUserFilter';
import { CreatedByTeamFilter } from './createdByTeamFilter';
import { CreatedByTeamsFilter } from './createdByTeamsFilter';
import { CreatedByUserFilter } from './createdByUserFilter';
import { DashboardPullRequest } from '@backstage/plugin-azure-devops-common';

/** @public */
export enum FilterType {
  All = 'All',

  // Assigned To
  AssignedToUser = 'AssignedToUser',
  AssignedToCurrentUser = 'AssignedToCurrentUser',
  AssignedToTeam = 'AssignedToTeam',
  AssignedToTeams = 'AssignedToTeams',
  AssignedToCurrentUsersTeams = 'AssignedToCurrentUsersTeams',

  // Created By
  CreatedByUser = 'CreatedByUser',
  CreatedByCurrentUser = 'CreatedByCurrentUser',
  CreatedByTeam = 'CreatedByTeam',
  CreatedByTeams = 'CreatedByTeams',
  CreatedByCurrentUsersTeams = 'CreatedByCurrentUsersTeams',
}

/** @public */
export const FilterTypes = [
  FilterType.All,

  FilterType.AssignedToUser,
  FilterType.AssignedToCurrentUser,
  FilterType.AssignedToTeam,
  FilterType.AssignedToTeams,
  FilterType.AssignedToCurrentUsersTeams,

  FilterType.CreatedByUser,
  FilterType.CreatedByCurrentUser,
  FilterType.CreatedByTeam,
  FilterType.CreatedByTeams,
  FilterType.CreatedByCurrentUsersTeams,
] as const;

/** @public */
export type BaseFilter = {
  type: FilterType;
};

/** @public */
export type Filter =
  | AssignedToUserFilter
  | CreatedByUserFilter
  | AssignedToTeamFilter
  | CreatedByTeamFilter
  | AssignedToTeamsFilter
  | CreatedByTeamsFilter
  | AllFilter;

export type {
  AssignedToUserFilter,
  CreatedByUserFilter,
  AssignedToTeamFilter,
  CreatedByTeamFilter,
  AssignedToTeamsFilter,
  CreatedByTeamsFilter,
  AllFilter,
};

/** @public */
export type PullRequestFilter = (pullRequest: DashboardPullRequest) => boolean;
