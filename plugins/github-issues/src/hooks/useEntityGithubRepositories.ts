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

import {
  Entity,
  stringifyEntityRef,
  getEntitySourceLocation,
} from '@backstage/catalog-model';
import { useApi } from '@backstage/core-plugin-api';
import { catalogApiRef, useEntity } from '@backstage/plugin-catalog-react';
import { useCallback, useEffect, useState } from 'react';
import { Repository } from '../api';

const GITHUB_PROJECT_SLUG_ANNOTATION = 'github.com/project-slug';

export const getProjectNameFromEntity = (entity: Entity): string => {
  return entity?.metadata.annotations?.[GITHUB_PROJECT_SLUG_ANNOTATION] ?? '';
};

export const getHostnameFromEntity = (entity: Entity): string => {
  const { target } = getEntitySourceLocation(entity);
  return new URL(target).hostname;
};

export function useEntityGithubRepositories() {
  const { entity } = useEntity();

  const catalogApi = useApi(catalogApiRef);
  const [repositories, setRepositories] = useState<Repository[]>([]);

  const getRepositoriesNames = useCallback(async () => {
    if (entity.kind === 'Component' || entity.kind === 'API') {
      const entityName = getProjectNameFromEntity(entity);
      const locationHostname = getHostnameFromEntity(entity);
      if (entityName) {
        setRepositories([
          {
            name: entityName,
            locationHostname,
          },
        ]);
      }

      return;
    }

    const entitiesList = await catalogApi.getEntities({
      filter: {
        kind: ['Component', 'API'],
        'relations.ownedBy': stringifyEntityRef(entity),
      },
    });

    const repositoryEntities: Repository[] = entitiesList.items.reduce(
      (acc: Repository[], componentEntity: Entity) => {
        const entityName = getProjectNameFromEntity(componentEntity);
        const entityLocationHostname = getHostnameFromEntity(componentEntity);
        if (
          entityName &&
          !acc.some((it: Repository) => it.name === entityName) &&
          entityName.length
        ) {
          acc.push({
            name: entityName,
            locationHostname: entityLocationHostname,
          });
        }
        return acc;
      },
      [],
    );

    setRepositories(repositoryEntities);
  }, [catalogApi, entity]);

  useEffect(() => {
    getRepositoriesNames();
  }, [getRepositoriesNames]);

  return {
    repositories,
  };
}
