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

import { DashboardPullRequest } from '@backstage/plugin-azure-devops-common';
import { BaseFilter, FilterType, PullRequestFilter } from './types';
import { createCreatedByTeamFilter } from './createdByTeamFilter';

/** @public */
export type CreatedByTeamsFilter = BaseFilter &
  (
    | ({
        type: FilterType.CreatedByTeams;
      } & ({ teamIds: string[] } | { teamNames: string[] }))
    | {
        type: FilterType.CreatedByCurrentUsersTeams;
        teamIds?: string[];
      }
  );

export function createCreatedByTeamsFilter(
  filter: CreatedByTeamsFilter,
): PullRequestFilter {
  return (pullRequest: DashboardPullRequest): boolean => {
    if ('teamNames' in filter) {
      const teamNames = filter.teamNames;

      if (!teamNames) {
        return false;
      }

      return teamNames.some(teamName => {
        return createCreatedByTeamFilter({
          type: FilterType.CreatedByTeam,
          teamName,
        })(pullRequest);
      });
    }

    const teamIds = filter.teamIds;

    if (!teamIds) {
      return false;
    }

    return teamIds.some(teamId => {
      return createCreatedByTeamFilter({
        type: FilterType.CreatedByTeam,
        teamId,
      })(pullRequest);
    });
  };
}
