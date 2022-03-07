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

import { BaseFilter, FilterType, PullRequestFilter } from './types';

import { DashboardPullRequest } from '@backstage/plugin-azure-devops-common';
import { stringArrayHas } from '../../../../utils';

export type CreatedByTeamFilter = BaseFilter &
  ({
    type: FilterType.CreatedByTeam;
  } & ({ teamId: string } | { teamName: string }));

export function createCreatedByTeamFilter(
  filter: CreatedByTeamFilter,
): PullRequestFilter {
  return (pullRequest: DashboardPullRequest): boolean => {
    const [createdByTeams, team] =
      'teamId' in filter
        ? [pullRequest.createdBy?.teamIds, filter.teamId]
        : [pullRequest.createdBy?.teamNames, filter.teamName];

    if (!createdByTeams) {
      return false;
    }

    return stringArrayHas(createdByTeams, team, true);
  };
}
