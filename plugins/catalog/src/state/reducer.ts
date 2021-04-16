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
import { createAction, createReducer } from '@reduxjs/toolkit';
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

export const setInitialState = createAction<
  Partial<EntityListState>,
  'setInitialState'
>('setInitialState');

export const applyFilter = createAction<
  { id: string; filter: EntityFilter },
  'applyFilter'
>('applyFilter');

export const removeFilter = createAction<string, 'removeFilter'>(
  'removeFilter',
);

export const entityListReducer = createReducer(
  entityListInitialState,
  builder =>
    builder
      .addCase(setInitialState, (state, action) => {
        const entities: Entity[] =
          action.payload?.entities ?? (state?.entities as Entity[]) ?? [];

        state.loading = action.payload.loading ?? false;
        state.orgName = action.payload.orgName;
        state.entities = entities;
        state.starredEntities = action.payload.starredEntities ?? [];
        state.ownUser = action.payload.ownUser;
        state.entityTypes = [
          ...new Set(entities.map((e: any) => e?.spec?.type)),
        ];
        state.isCatalogEmpty = entities?.length === 0;
        state.matchingEntities = entities;
        state.availableTags = collectTags(entities);
      })
      .addCase(applyFilter, (state, action) => {
        state.clientFilters[action.payload.id] = action.payload.filter;

        const predicate = entityPredicate(Object.values(state.clientFilters), {
          ownUser: state.ownUser as any,
          starredEntities: state.starredEntities,
        });

        state.matchingEntities = state.entities.filter(e =>
          predicate(e as any),
        );
      })
      .addCase(removeFilter, (state, action) => {
        const { [action.payload]: key, ...filters } = state.clientFilters;
        state.clientFilters = filters;

        const predicate = entityPredicate(Object.values(state.clientFilters), {
          ownUser: state.ownUser as any,
          starredEntities: state.starredEntities,
        });

        state.matchingEntities = state.entities.filter(e =>
          predicate(e as any),
        );
      }),
);
