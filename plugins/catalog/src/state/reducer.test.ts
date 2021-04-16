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

import {
  applyFilter,
  entityListInitialState,
  entityListReducer,
  setInitialState,
  removeFilter,
} from './reducer';
import { EntityListState } from './types';

describe('reducer', () => {
  const entity = {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Component',
    metadata: {
      name: 'Entity1',
      tags: ['java'],
    },
    spec: {
      owner: 'tools@example.com',
      type: 'service',
    },
  };

  it('should produce default state', () => {
    expect(entityListReducer(undefined, {} as any)).toEqual(
      entityListInitialState,
    );
  });

  it('should apply initial state', () => {
    const newState: Partial<EntityListState> = {
      loading: false,
      entities: [entity],
    };

    expect(entityListReducer(undefined, setInitialState(newState))).toEqual({
      ...entityListInitialState,
      ...newState,
      isCatalogEmpty: false,
      entityTypes: ['service'],
      matchingEntities: [entity],
      availableTags: entity.metadata.tags,
    });
  });

  it('should apply a filter', () => {
    expect(
      entityListReducer(
        undefined as any,
        applyFilter({ id: 'foo', filter: { type: 'owned' } }),
      ),
    ).toEqual(
      expect.objectContaining({
        clientFilters: {
          foo: { type: 'owned' },
        },
      }),
    );
  });

  it('should remove a filter', () => {
    const state: EntityListState = {
      ...entityListInitialState,
      clientFilters: { foo: { type: 'owned' } },
    };

    expect(entityListReducer(state, removeFilter('foo'))).toEqual(
      expect.objectContaining({
        clientFilters: {},
      }),
    );
  });
});
