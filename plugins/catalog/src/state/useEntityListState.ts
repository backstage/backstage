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

import { UserEntity } from '@backstage/catalog-model';
import { configApiRef, identityApiRef, useApi } from '@backstage/core';
import {
  catalogApiRef,
  useStarredEntities,
} from '@backstage/plugin-catalog-react';
import { useContext, useEffect, useMemo } from 'react';
import { useAsyncFn } from 'react-use';
import { EntityListContext } from './context';
import { applyFilter, removeFilter, setInitialState } from './reducer';
import { EntityFilter } from './types';

export const useEntityListState = () => {
  const context = useContext(EntityListContext);
  if (!context) {
    throw new Error(`Must be used inside an EntityListProvider`);
  }
  const { state, dispatch } = context;

  const contextValue = useMemo(() => {
    return { state, dispatch };
  }, [state, dispatch]);

  const configApi = useApi(configApiRef);
  const catalogApi = useApi(catalogApiRef);
  const identityApi = useApi(identityApiRef);
  const { starredEntities } = useStarredEntities();

  const [{ error }, reload] = useAsyncFn(async () => {
    const entities = await catalogApi
      .getEntities({
        filter: { kind: 'Component' },
      })
      .then(r => r.items);

    const ownUser = (await catalogApi.getEntityByName({
      kind: 'User',
      namespace: 'default',
      name: identityApi.getUserId(),
    })) as UserEntity;

    dispatch(
      setInitialState({
        loading: false,
        orgName: configApi.getString('organization.name'),
        starredEntities: [...starredEntities],
        entities,
        ownUser,
      }),
    );
  }, [configApi, catalogApi, identityApi, starredEntities, dispatch]);

  useEffect(() => {
    reload();
    dispatch(setInitialState({ error }));
  }, [error, dispatch, reload]);

  return {
    state: contextValue.state,
    getFilter: <T extends EntityFilter>(id: string) =>
      state.clientFilters?.[id] as T,
    setFilter: useMemo(
      () => (id: string, filter: EntityFilter | undefined) =>
        dispatch(filter ? applyFilter({ id, filter }) : removeFilter(id)),
      [dispatch],
    ),
    removeFilter: (id: string) => dispatch(removeFilter(id)),
    reload,
  };
};
