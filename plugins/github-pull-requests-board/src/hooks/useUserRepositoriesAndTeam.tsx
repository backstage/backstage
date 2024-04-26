/*
 * Copyright 2022 The Backstage Authors
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

import { stringifyEntityRef } from '@backstage/catalog-model';
import { useApi } from '@backstage/core-plugin-api';
import { catalogApiRef, useEntity } from '@backstage/plugin-catalog-react';
import { useCallback, useEffect, useState } from 'react';
import {
  getProjectNameFromEntity,
  getGithubOrganizationFromEntity,
  getUserNameFromEntity,
} from '../utils/functions';

export function useUserRepositoriesAndTeam() {
  const { entity: teamEntity } = useEntity();
  const catalogApi = useApi(catalogApiRef);
  const [loading, setLoading] = useState<boolean>(true);
  const [teamData, setTeamData] = useState<{
    repositories: string[];
    teamMembers: string[];
  }>({
    repositories: [],
    teamMembers: [],
  });

  const getTeamData = useCallback(async () => {
    setLoading(true);

    // get team repositories and members
    const entitiesList = await catalogApi.getEntities({
      filter: [
        { 'relations.ownedBy': stringifyEntityRef(teamEntity) },
        { 'relations.memberOf': stringifyEntityRef(teamEntity) },
      ],
    });

    const repositories = entitiesList.items.filter(
      entity => entity.kind === 'Component',
    );
    const repositoriesNames: string[] = repositories
      .map(componentEntity => getProjectNameFromEntity(componentEntity) ?? '')
      .filter(projectName => !!projectName);

    const teamMembers = entitiesList.items.filter(
      entity => entity.kind === 'User',
    );
    const teamMembersNames: string[] = teamMembers
      .map(componentEntity => getUserNameFromEntity(componentEntity) ?? '')
      .filter(userName => !!userName);

    setTeamData({
      repositories: [...new Set(repositoriesNames)],
      teamMembers: [...new Set(teamMembersNames)],
    });
    setLoading(false);
  }, [catalogApi, teamEntity]);

  useEffect(() => {
    getTeamData();
  }, [getTeamData]);

  return {
    loading,
    repositories: teamData.repositories,
    teamMembers: teamData.teamMembers,
    teamMembersOrganization: getGithubOrganizationFromEntity(teamEntity),
  };
}
