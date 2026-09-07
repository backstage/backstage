/*
 * Copyright 2026 The Backstage Authors
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
import {
  catalogApiRef,
  entityPresentationApiRef,
} from '@backstage/plugin-catalog-react';
import { catalogApiMock } from '@backstage/plugin-catalog-react/testUtils';
import { TestApiProvider } from '@backstage/test-utils';
import { act, renderHook, waitFor } from '@testing-library/react';
import { PropsWithChildren } from 'react';
import { useEntityPickerOptions } from './useEntityPickerOptions';

const entity: Entity = {
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'Group',
  metadata: { name: 'team-a', namespace: 'default' },
};

const otherEntity: Entity = {
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'Group',
  metadata: { name: 'team-b', namespace: 'default' },
};

function deferred<T>() {
  let resolve: (value: T) => void = () => {};
  const promise = new Promise<T>(innerResolve => {
    resolve = innerResolve;
  });
  return { promise, resolve };
}

describe('useEntityPickerOptions', () => {
  const catalogApi = catalogApiMock.mock();
  const forEntity = jest.fn((item: Entity) => ({
    snapshot: {
      entityRef: `group:default/${item.metadata.name}`,
      primaryTitle: item.metadata.name,
    },
    promise: Promise.resolve({
      entityRef: `group:default/${item.metadata.name}`,
      primaryTitle: item.metadata.name,
    }),
  }));

  const wrapper = ({ children }: PropsWithChildren<{}>) => (
    <TestApiProvider
      apis={[
        [catalogApiRef, catalogApi],
        [entityPresentationApiRef, { forEntity }],
      ]}
    >
      {children}
    </TestApiProvider>
  );

  beforeEach(() => {
    jest.clearAllMocks();
    catalogApi.queryEntities.mockReset();
    catalogApi.getEntitiesByRefs.mockReset();
    catalogApi.queryEntities.mockResolvedValue({
      items: [entity],
      totalItems: 0,
      pageInfo: {},
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('does not query until it is enabled', async () => {
    const { result, rerender } = renderHook(
      ({ enabled }) =>
        useEntityPickerOptions({ enabled, selectedEntityRefs: [] }),
      { wrapper, initialProps: { enabled: false } },
    );
    await act(async () => {});

    expect(catalogApi.queryEntities).not.toHaveBeenCalled();
    expect(result.current.loading).toBe(false);

    rerender({ enabled: true });
    await waitFor(() => expect(result.current.entities).toEqual([entity]));
  });

  it('loads and presents only the first page of matching entities', async () => {
    const catalogFilter = { kind: ['Group'] };
    const { result } = renderHook(
      () => useEntityPickerOptions({ catalogFilter, selectedEntityRefs: [] }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(catalogApi.queryEntities).toHaveBeenCalledWith({
      filter: catalogFilter,
      limit: 20,
      orderFields: [{ field: 'metadata.name', order: 'asc' }],
      totalItems: 'exclude',
    });
    expect(result.current.entities).toEqual([entity]);
    expect(
      result.current.entityRefToPresentation.get('group:default/team-a'),
    ).toMatchObject({ primaryTitle: 'team-a' });
  });

  it('provides complete entities to custom presentation APIs', async () => {
    const completeEntity: Entity = {
      ...entity,
      spec: { customPresentation: 'Friendly Team A' },
    };
    catalogApi.queryEntities.mockImplementationOnce(async request => ({
      items: request?.fields ? [entity] : [completeEntity],
      totalItems: 0,
      pageInfo: {},
    }));
    forEntity.mockImplementationOnce(item => {
      const primaryTitle = String(item.spec?.customPresentation);
      return {
        snapshot: {
          entityRef: 'group:default/team-a',
          primaryTitle,
        },
        promise: Promise.resolve({
          entityRef: 'group:default/team-a',
          primaryTitle,
        }),
      };
    });
    const { result } = renderHook(
      () => useEntityPickerOptions({ selectedEntityRefs: [] }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(
      result.current.entityRefToPresentation.get('group:default/team-a'),
    ).toMatchObject({ primaryTitle: 'Friendly Team A' });
  });

  it('debounces server-side filtering', async () => {
    jest.useFakeTimers();
    const { result } = renderHook(
      () => useEntityPickerOptions({ selectedEntityRefs: [] }),
      { wrapper },
    );
    await act(async () => {});

    act(() => result.current.setSearchText('team'));
    act(() => jest.advanceTimersByTime(249));
    expect(catalogApi.queryEntities).toHaveBeenCalledTimes(1);

    await act(async () => jest.advanceTimersByTime(1));
    expect(catalogApi.queryEntities).toHaveBeenLastCalledWith({
      fullTextFilter: {
        term: 'team',
        fields: [
          'metadata.name',
          'kind',
          'spec.profile.displayName',
          'metadata.title',
        ],
      },
      limit: 20,
      orderFields: [{ field: 'metadata.name', order: 'asc' }],
      totalItems: 'exclude',
    });
  });

  it('recovers when input returns to the active query before the debounce', async () => {
    jest.useFakeTimers();
    const initialSearch = deferred<{
      items: Entity[];
      totalItems: number;
      pageInfo: {};
    }>();
    catalogApi.queryEntities.mockReturnValueOnce(initialSearch.promise);
    const { result } = renderHook(
      () => useEntityPickerOptions({ selectedEntityRefs: [] }),
      { wrapper },
    );
    await act(async () => {});

    act(() => result.current.setSearchText('team'));
    act(() => result.current.setSearchText(''));
    await act(async () => {
      initialSearch.resolve({
        items: [entity],
        totalItems: 0,
        pageInfo: {},
      });
    });

    expect(result.current.entities).toEqual([entity]);
    expect(result.current.loadingState).toBe('idle');

    act(() => result.current.setSearchText('team'));
    act(() => result.current.setSearchText(''));
    await act(async () => jest.advanceTimersByTime(250));

    expect(result.current.entities).toEqual([entity]);
    expect(result.current.loadingState).toBe('idle');
  });

  it('loads and appends the next page on demand', async () => {
    catalogApi.queryEntities
      .mockResolvedValueOnce({
        items: [entity],
        totalItems: 0,
        pageInfo: { nextCursor: 'next-page' },
      })
      .mockResolvedValueOnce({
        items: [otherEntity],
        totalItems: 0,
        pageInfo: {},
      });
    const { result } = renderHook(
      () => useEntityPickerOptions({ selectedEntityRefs: [] }),
      { wrapper },
    );
    await waitFor(() => expect(result.current.entities).toEqual([entity]));

    act(() => result.current.loadMore());
    await waitFor(() =>
      expect(result.current.entities).toEqual([entity, otherEntity]),
    );

    expect(catalogApi.queryEntities).toHaveBeenLastCalledWith({
      cursor: 'next-page',
      limit: 20,
    });
  });

  it('allows retrying a page after it fails to load', async () => {
    catalogApi.queryEntities
      .mockResolvedValueOnce({
        items: [entity],
        totalItems: 0,
        pageInfo: { nextCursor: 'next-page' },
      })
      .mockRejectedValueOnce(new Error('temporary failure'))
      .mockResolvedValueOnce({
        items: [otherEntity],
        totalItems: 0,
        pageInfo: {},
      });
    const { result } = renderHook(
      () => useEntityPickerOptions({ selectedEntityRefs: [] }),
      { wrapper },
    );
    await waitFor(() => expect(result.current.entities).toEqual([entity]));

    act(() => result.current.loadMore());
    await waitFor(() =>
      expect(catalogApi.queryEntities).toHaveBeenCalledTimes(2),
    );
    await waitFor(() => expect(result.current.loading).toBe(false));
    act(() => result.current.loadMore());

    await waitFor(() =>
      expect(result.current.entities).toEqual([entity, otherEntity]),
    );
    expect(catalogApi.queryEntities).toHaveBeenCalledTimes(3);
  });

  it('does not let an obsolete search replace newer results', async () => {
    jest.useFakeTimers();
    const firstSearch = deferred<{
      items: Entity[];
      totalItems: number;
      pageInfo: {};
    }>();
    const secondSearch = deferred<{
      items: Entity[];
      totalItems: number;
      pageInfo: {};
    }>();
    catalogApi.queryEntities
      .mockResolvedValueOnce({ items: [], totalItems: 0, pageInfo: {} })
      .mockReturnValueOnce(firstSearch.promise)
      .mockReturnValueOnce(secondSearch.promise);
    const { result } = renderHook(
      () => useEntityPickerOptions({ selectedEntityRefs: [] }),
      { wrapper },
    );
    await act(async () => {});

    act(() => result.current.setSearchText('team-a'));
    await act(async () => jest.advanceTimersByTime(250));
    act(() => result.current.setSearchText('team-b'));
    await act(async () => jest.advanceTimersByTime(250));

    await act(async () => {
      secondSearch.resolve({
        items: [otherEntity],
        totalItems: 0,
        pageInfo: {},
      });
    });
    await act(async () => {
      firstSearch.resolve({ items: [entity], totalItems: 0, pageInfo: {} });
    });

    expect(result.current.entities).toEqual([otherEntity]);
  });

  it('loads selected entities without adding them to the search results', async () => {
    catalogApi.getEntitiesByRefs.mockResolvedValue({ items: [otherEntity] });
    const { result } = renderHook(
      () =>
        useEntityPickerOptions({
          selectedEntityRefs: ['group:default/team-b'],
        }),
      { wrapper },
    );

    await waitFor(() =>
      expect(result.current.selectedEntities).toEqual([otherEntity]),
    );
    expect(catalogApi.getEntitiesByRefs).toHaveBeenCalledWith({
      entityRefs: ['group:default/team-b'],
    });
    expect(result.current.entities).toEqual([entity]);
    expect(
      result.current.entityRefToPresentation.get('group:default/team-b'),
    ).toMatchObject({ primaryTitle: 'team-b' });
  });
});
