/*
 * Copyright 2020 Spotify AB
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

import { useAsync } from 'react-use';
import { useMemo } from 'react';
import { RELATION_MEMBER_OF } from '@backstage/catalog-model';
import { identityApiRef, useApi } from '@backstage/core';
import { catalogApiRef } from '../plugin';

/**
 * Get the group memberships of the logged-in user.
 */
export const useUserGroups: () => {
  groups: string[];
  loading: boolean;
  error?: Error;
} = () => {
  const catalogApi = useApi(catalogApiRef);
  const userId = useApi(identityApiRef).getUserId();

  // TODO: should the identityApiRef already include the entity? or at least a full EntityName?
  const { value: user, loading, error } = useAsync(async () => {
    return await catalogApi.getEntityByName({
      kind: 'User',
      namespace: 'default',
      name: userId,
    });
  }, [catalogApi, userId]);

  // calculate the group memberships
  const groups = useMemo<string[]>(() => {
    if (user && user.relations) {
      return user.relations
        .filter(
          r =>
            r.type === RELATION_MEMBER_OF &&
            r.target.kind.toLowerCase() === 'group',
        )
        .map(r => r.target.name);
    }

    return [];
  }, [user]);

  return { groups, loading, error };
};
