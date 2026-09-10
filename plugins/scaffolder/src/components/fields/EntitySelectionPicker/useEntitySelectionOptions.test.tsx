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

import { PropsWithChildren } from 'react';
import { act, renderHook, waitFor } from '@testing-library/react';
import { Entity } from '@backstage/catalog-model';
import {
  CATALOG_FILTER_EXISTS,
  QueryEntitiesResponse,
} from '@backstage/catalog-client';
import {
  catalogApiRef,
  entityPresentationApiRef,
} from '@backstage/plugin-catalog-react';
import { catalogApiMock } from '@backstage/plugin-catalog-react/testUtils';
import { DefaultEntityPresentationApi } from '@backstage/plugin-catalog';
import { TestApiProvider } from '@backstage/test-utils';
import { useEntitySelectionOptions } from './useEntitySelectionOptions';

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason: Error) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

async function setup(catalogFilter?: {
  [key: string]: typeof CATALOG_FILTER_EXISTS;
}) {
  const catalogApi = catalogApiMock({ entities: [] });
  const presentationApi = DefaultEntityPresentationApi.create({ catalogApi });
  const wrapper = ({ children }: PropsWithChildren<{}>) => (
    <TestApiProvider
      apis={[
        [catalogApiRef, catalogApi],
        [entityPresentationApiRef, presentationApi],
      ]}
    >
      {children}
    </TestApiProvider>
  );
  const hook = renderHook(
    () =>
      useEntitySelectionOptions({
        allowMissingEntities: true,
        defaultKind: 'User',
        catalogFilter,
        selectedEntityRefs: [],
      }),
    { wrapper },
  );
  await waitFor(() => expect(hook.result.current.loading).toBe(false));
  return { ...hook, catalogApi, presentationApi };
}

it('preserves existence filters when querying the catalog', async () => {
  const { catalogApi, result } = await setup({
    'spec.profile': CATALOG_FILTER_EXISTS,
  });
  const query = jest.spyOn(catalogApi, 'queryEntities');
  act(() => result.current.setSearchText('freben'));
  await waitFor(() =>
    expect(query).toHaveBeenCalledWith(
      expect.objectContaining({
        filter: { 'spec.profile': CATALOG_FILTER_EXISTS },
      }),
    ),
  );
});

it('keeps one snapshot through partial results and ignores responses from superseded queries', async () => {
  const { result, catalogApi } = await setup();
  const firstQuery = deferred<QueryEntitiesResponse>();
  const firstRefs = deferred<{ items: undefined[] }>();
  const secondQuery = deferred<QueryEntitiesResponse>();
  const secondRefs = deferred<{ items: undefined[] }>();
  const query = jest
    .spyOn(catalogApi, 'queryEntities')
    .mockReturnValueOnce(firstQuery.promise)
    .mockReturnValueOnce(secondQuery.promise);
  const refs = jest
    .spyOn(catalogApi, 'getEntitiesByRefs')
    .mockReturnValueOnce(firstRefs.promise)
    .mockReturnValueOnce(secondRefs.promise);
  const initial = result.current.snapshot;
  act(() => result.current.setSearchText('first'));
  expect(result.current.snapshot).toBe(initial);
  await waitFor(() => expect(query).toHaveBeenCalledTimes(1));
  await act(async () =>
    firstQuery.resolve({ items: [], pageInfo: {}, totalItems: 0 }),
  );
  expect(result.current.snapshot).toBe(initial);
  act(() => result.current.setSearchText('second'));
  // The old response arrives during the next query's debounce.
  await act(async () => firstRefs.resolve({ items: [undefined] }));
  expect(result.current.snapshot).toBe(initial);
  await waitFor(() => expect(query).toHaveBeenCalledTimes(2));
  expect(refs).toHaveBeenLastCalledWith({
    entityRefs: ['user:default/second'],
  });
  await act(async () => secondRefs.resolve({ items: [undefined] }));
  expect(result.current.snapshot).toBe(initial);
  await act(async () =>
    secondQuery.resolve({ items: [], pageInfo: {}, totalItems: 0 }),
  );
  expect(result.current.snapshot.rows).toEqual([
    { ref: 'user:default/second', label: 'User second', missing: true },
  ]);
  expect(result.current.snapshot.search).toBe('second');
  expect(result.current.loading).toBe(false);
  const committed = result.current.snapshot;
  act(() => result.current.setSearchText('second'));
  expect(result.current.snapshot).toBe(committed);
  expect(result.current.loading).toBe(false);

  // Clearing the text is a query too: do not discard current rows on keystroke.
  const clearQuery = deferred<QueryEntitiesResponse>();
  query.mockReturnValueOnce(clearQuery.promise);
  act(() => result.current.setSearchText(''));
  expect(result.current.snapshot).toBe(committed);
  await act(async () =>
    clearQuery.resolve({ items: [], pageInfo: {}, totalItems: 0 }),
  );
  expect(result.current.snapshot.rows).toEqual([]);
  expect(result.current.snapshot.search).toBe('');
});

it('invalidates pagination immediately and restarts even when batched input returns to the same text', async () => {
  const { result, catalogApi } = await setup();
  const query = jest.spyOn(catalogApi, 'queryEntities').mockResolvedValue({
    items: [],
    pageInfo: { nextCursor: 'next-page' },
    totalItems: 0,
  });
  act(() => result.current.setSearchText('first'));
  await waitFor(() => expect(result.current.loading).toBe(false));
  const initial = result.current.snapshot;
  const oldLoadMore = result.current.loadMore;
  act(() => {
    result.current.setSearchText('second');
    void oldLoadMore();
  });
  expect(query).toHaveBeenCalledTimes(1);
  expect(result.current.snapshot).toBe(initial);
  await waitFor(() => expect(result.current.loading).toBe(false));
  expect(result.current.snapshot.search).toBe('second');

  const page = deferred<QueryEntitiesResponse>();
  query.mockReturnValueOnce(page.promise);
  let loadingPage!: Promise<void>;
  act(() => {
    loadingPage = result.current.loadMore();
  });
  expect(query).toHaveBeenLastCalledWith({ cursor: 'next-page', limit: 20 });
  const committed = result.current.snapshot;
  act(() => {
    result.current.setSearchText('third');
    result.current.setSearchText('second');
  });
  await act(async () => {
    page.resolve({ items: [], pageInfo: {}, totalItems: 0 });
    await loadingPage;
  });
  expect(result.current.snapshot).toBe(committed);
  expect(result.current.loading).toBe(true);
  await waitFor(() => expect(result.current.loading).toBe(false));
  expect(query).toHaveBeenCalledTimes(4);
  expect(result.current.snapshot).not.toBe(committed);
  expect(result.current.snapshot.rows).toEqual(committed.rows);
  expect(result.current.hasMore).toBe(true);
});

it('waits for presentation work and retains the snapshot when presentation fails', async () => {
  const { result, catalogApi, presentationApi } = await setup();
  const entity: Entity = {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'User',
    metadata: { name: 'freben', title: 'Fredrik' },
  };
  const presentation = presentationApi.forEntity(entity);
  const pending = deferred<Awaited<typeof presentation.promise>>();
  jest
    .spyOn(presentationApi, 'forEntity')
    .mockReturnValue({ ...presentation, promise: pending.promise });
  const query = jest
    .spyOn(catalogApi, 'queryEntities')
    .mockResolvedValue({ items: [entity], pageInfo: {}, totalItems: 1 });
  const initial = result.current.snapshot;
  act(() => result.current.setSearchText('search'));
  await waitFor(() => expect(query).toHaveBeenCalled());
  expect(result.current.snapshot).toBe(initial);
  expect(result.current.loading).toBe(true);
  await act(async () => pending.resolve(await presentation.promise));
  expect(result.current.snapshot.rows.map(row => row.label)).toEqual([
    'Fredrik',
    'User search',
  ]);
  const committed = result.current.snapshot;
  const failed = deferred<Awaited<typeof presentation.promise>>();
  jest
    .mocked(presentationApi.forEntity)
    .mockReturnValue({ ...presentation, promise: failed.promise });
  act(() => result.current.setSearchText('next'));
  await waitFor(() => expect(query).toHaveBeenCalledTimes(2));
  await act(async () => failed.reject(new Error('Presentation unavailable')));
  expect(result.current.snapshot).toBe(committed);
  expect(result.current.loadingState).toBe('error');
});
