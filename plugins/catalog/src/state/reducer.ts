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

import { Entity } from '@backstage/catalog-model';
import { collectTags, entityPredicate } from './filters';
import { EntityFilter, EntityListState } from './types';

export const entityListInitialState: EntityListState = {
  loading: true,
  isCatalogEmpty: true,
  orgName: undefined,
  entities: [],
  entityTypes: [],
  availableTags: [],
  ownUser: undefined,
  starredEntities: [],
  clientFilters: {},
  matchingEntities: [],
};

export const setInitialState = (payload: Partial<EntityListState>) =>
  ({
    type: 'setInitialState',
    payload,
  } as const);

export const applyFilter = (payload: { id: string; filter: EntityFilter }) =>
  ({
    type: 'applyFilter',
    payload,
  } as const);

export const removeFilter = (payload: string) =>
  ({
    type: 'removeFilter',
    payload,
  } as const);

type Actions = ReturnType<
  typeof setInitialState | typeof applyFilter | typeof removeFilter
>;

export const entityListReducer = (
  state: EntityListState = entityListInitialState,
  action: Actions,
): typeof entityListInitialState => {
  switch (action.type) {
    case 'setInitialState': {
      const entities: Entity[] =
        action.payload?.entities ?? (state?.entities as Entity[]) ?? [];

      return {
        ...state,
        loading: action.payload.loading ?? false,
        orgName: action.payload.orgName,
        entities: entities,
        starredEntities: action.payload.starredEntities ?? [],
        ownUser: action.payload.ownUser,
        entityTypes: [...new Set(entities.map((e: any) => e?.spec?.type))],
        isCatalogEmpty: entities?.length === 0,
        matchingEntities: entities,
        availableTags: collectTags(entities),
      };
    }
    case 'applyFilter': {
      const clientFilters = {
        ...state.clientFilters,
        [action.payload.id]: action.payload.filter,
      };

      const predicate = entityPredicate(Object.values(clientFilters), {
        ownUser: state.ownUser as any,
        starredEntities: state.starredEntities,
      });

      return {
        ...state,
        clientFilters,
        matchingEntities: state.entities.filter(e => predicate(e as any)),
      };
    }
    case 'removeFilter': {
      const { [action.payload]: key, ...clientFilters } = state.clientFilters;

      const predicate = entityPredicate(Object.values(clientFilters), {
        ownUser: state.ownUser as any,
        starredEntities: state.starredEntities,
      });

      return {
        ...state,
        clientFilters,
        matchingEntities: state.entities.filter(e => predicate(e as any)),
      };
    }
    default: {
      return state;
    }
  }
};
