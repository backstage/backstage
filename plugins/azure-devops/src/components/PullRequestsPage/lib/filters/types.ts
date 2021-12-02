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

export enum FilterType {
  All = 'All',
  AssignedToUser = 'AssignedToUser',
  CreatedByUser = 'CreatedByUser',
  AssignedToCurrentUser = 'AssignedToCurrentUser',
  CreatedByCurrentUser = 'CreatedByCurrentUser',
  AssignedToTeam = 'AssignedToTeam',
  CreatedByTeam = 'CreatedByTeam',
  AssignedToTeams = 'AssignedToTeams',
  CreatedByTeams = 'CreatedByTeams',
  AssignedToCurrentUsersTeams = 'AssignedToCurrentUsersTeams',
  CreatedByCurrentUsersTeams = 'CreatedByCurrentUsersTeams',
}

export const FilterTypes = [
  FilterType.All,
  FilterType.AssignedToUser,
  FilterType.CreatedByUser,
  FilterType.AssignedToCurrentUser,
  FilterType.CreatedByCurrentUser,
  FilterType.AssignedToTeam,
  FilterType.CreatedByTeam,
  FilterType.AssignedToTeams,
  FilterType.CreatedByTeams,
  FilterType.CreatedByCurrentUsersTeams,
] as const;

export type BaseFilter = {
  type: FilterType;
};
