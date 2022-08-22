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
import { BackstageUserIdentity, useApi } from '@backstage/core-plugin-api';
import {
  catalogApiRef,
  getEntityRelations,
} from '@backstage/plugin-catalog-react';
import { useCallback, useEffect, useState } from 'react';
import { getProjectNameFromEntity, parseEntityRef } from '../utils/functions';
import { RELATION_MEMBER_OF } from '@backstage/catalog-model';

export const useUserRepositories = (
  identity: BackstageUserIdentity,
  allowedKinds?: string[],
) => {
  const catalogApi = useApi(catalogApiRef);
  const [repositories, setRepositories] = useState<string[]>([]);

  const getRepositoriesNames = useCallback(async () => {
    const userRef = parseEntityRef(identity.userEntityRef);

    const user = await catalogApi.getEntityByRef({
      kind: 'User',
      namespace: userRef.namespace ?? 'default',
      name: userRef.name,
    });

    if (user) {
      const groups = getEntityRelations(user, RELATION_MEMBER_OF).map(
        entityRef => entityRef.name,
      );

      const entitiesList = await catalogApi.getEntities({
        filter: {
          kind: allowedKinds ?? ['Component', 'API'],
          'spec.owner': [...groups, `user:${user.metadata.name}`],
        },
        fields: ['kind', 'spec.type', 'metadata.annotations'],
      });

      const entitiesNames: string[] = entitiesList.items.map(componentEntity =>
        getProjectNameFromEntity(componentEntity),
      );

      setRepositories([...new Set(entitiesNames)]);
    }
  }, [catalogApi, allowedKinds, identity]);

  useEffect(() => {
    getRepositoriesNames();
  }, [getRepositoriesNames]);

  return {
    repositories,
  };
};
