/*
 * Copyright 2020 The Backstage Authors
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
import { TestApiProvider } from '@backstage/test-utils';
import { act, renderHook } from '@testing-library/react-hooks';
import React, { PropsWithChildren } from 'react';
import {
  starredEntitiesApiRef,
  StarredEntitiesApi,
  MockStarredEntitiesApi,
} from '../apis';
import { useStarredEntities } from './useStarredEntities';

describe('useStarredEntities', () => {
  let mockApi: StarredEntitiesApi;
  let wrapper: React.ComponentType;

  const mockEntity: Entity = {
    apiVersion: '1',
    kind: 'Component',
    metadata: {
      name: 'mock',
    },
  };

  const secondMockEntity: Entity = {
    apiVersion: '1',
    kind: 'Component',
    metadata: {
      namespace: 'test',
      name: 'mock2',
    },
  };

  beforeEach(() => {
    mockApi = new MockStarredEntitiesApi();
    wrapper = (props: PropsWithChildren<{}>) => (
      <TestApiProvider apis={[[starredEntitiesApiRef, mockApi]]}>
        {props.children}
      </TestApiProvider>
    );
  });

  it('should return an empty set', async () => {
    const { result, waitForNextUpdate } = renderHook(
      () => useStarredEntities(),
      { wrapper },
    );

    await waitForNextUpdate();

    expect(result.current.starredEntities.size).toBe(0);
  });

  it('should return a set with the current items', async () => {
    const expectedIds = ['i', 'am', 'some', 'test', 'ids'];
    for (const id of expectedIds) {
      mockApi.toggleStarred(id);
    }

    const { result, waitForNextUpdate } = renderHook(
      () => useStarredEntities(),
      { wrapper },
    );

    await waitForNextUpdate();

    for (const item of expectedIds) {
      expect(result.current.starredEntities.has(item)).toBeTruthy();
    }
  });

  it('should listen to changes when the storage is set elsewhere', async () => {
    const { result, waitForNextUpdate } = renderHook(
      () => useStarredEntities(),
      { wrapper },
    );

    await waitForNextUpdate();

    expect(result.current.starredEntities.size).toBe(0);
    expect(result.current.isStarredEntity(mockEntity)).toBeFalsy();

    // Make this happen after awaiting for the next update so we can
    // catch when the hook re-renders with the latest data
    setTimeout(() => result.current.toggleStarredEntity(mockEntity), 1);

    await waitForNextUpdate();

    expect(result.current.starredEntities.size).toBe(1);
    expect(result.current.isStarredEntity(mockEntity)).toBeTruthy();
  });

  it('should write new entries to the local store when adding a toggling entity', async () => {
    const { result, waitForNextUpdate } = renderHook(
      () => useStarredEntities(),
      { wrapper },
    );

    act(() => {
      result.current.toggleStarredEntity(mockEntity);
    });

    await waitForNextUpdate();

    expect(result.current.isStarredEntity(mockEntity)).toBeTruthy();
    expect(result.current.isStarredEntity(secondMockEntity)).toBeFalsy();
  });

  it('should remove an existing entity when toggling entries', async () => {
    const { result, waitForNextUpdate } = renderHook(
      () => useStarredEntities(),
      { wrapper },
    );

    act(() => {
      result.current.toggleStarredEntity(mockEntity);
      result.current.toggleStarredEntity(secondMockEntity);
      result.current.toggleStarredEntity(mockEntity);
    });

    await waitForNextUpdate();

    expect(result.current.isStarredEntity(mockEntity)).toBeFalsy();
    expect(result.current.isStarredEntity(secondMockEntity)).toBeTruthy();
  });
});
