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

import { Filter, FilterType, PullRequestFilter } from './types';

import { DashboardPullRequest } from '@backstage/plugin-azure-devops-common';
import { createAllFilter } from './allFilter';
import { createAssignedToTeamFilter } from './assignedToTeamFilter';
import { createAssignedToTeamsFilter } from './assignedToTeamsFilter';
import { createAssignedToUserFilter } from './assignedToUserFilter';
import { createCreatedByTeamFilter } from './createdByTeamFilter';
import { createCreatedByTeamsFilter } from './createdByTeamsFilter';
import { createCreatedByUserFilter } from './createdByUserFilter';

export function createFilter(filters: Filter | Filter[]): PullRequestFilter {
  const mapFilter = (filter: Filter): PullRequestFilter => {
    switch (filter.type) {
      case FilterType.AssignedToUser:
      case FilterType.AssignedToCurrentUser:
        return createAssignedToUserFilter(filter);

      case FilterType.CreatedByUser:
      case FilterType.CreatedByCurrentUser:
        return createCreatedByUserFilter(filter);

      case FilterType.AssignedToTeam:
        return createAssignedToTeamFilter(filter);

      case FilterType.CreatedByTeam:
        return createCreatedByTeamFilter(filter);

      case FilterType.AssignedToTeams:
      case FilterType.AssignedToCurrentUsersTeams:
        return createAssignedToTeamsFilter(filter);

      case FilterType.CreatedByTeams:
      case FilterType.CreatedByCurrentUsersTeams:
        return createCreatedByTeamsFilter(filter);

      case FilterType.All:
        return createAllFilter();

      default:
        return _ => false;
    }
  };

  if (Array.isArray(filters)) {
    if (filters.length === 1) {
      return mapFilter(filters[0]);
    }

    return (pullRequest: DashboardPullRequest): boolean =>
      filters.every(filter => mapFilter(filter)(pullRequest));
  }

  return mapFilter(filters);
}
