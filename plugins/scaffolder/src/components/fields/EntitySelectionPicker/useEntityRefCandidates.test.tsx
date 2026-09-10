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
import {
  catalogApiRef,
  entityPresentationApiRef,
} from '@backstage/plugin-catalog-react';
import { catalogApiMock } from '@backstage/plugin-catalog-react/testUtils';
import { DefaultEntityPresentationApi } from '@backstage/plugin-catalog';
import { TestApiProvider } from '@backstage/test-utils';
import { useEntityRefCandidates } from './useEntityRefCandidates';

it('retains the last successful choices while revalidating, but forgets them when cleared or closed', async () => {
  const catalogApi = catalogApiMock({ entities: [] });
  const lookup = jest.spyOn(catalogApi, 'getEntitiesByRefs');
  const pending = new Map<string, (value: { items: undefined[] }) => void>();
  lookup.mockImplementation(
    ({ entityRefs }) =>
      new Promise(resolve => {
        pending.set(entityRefs[0], resolve);
      }),
  );
  const presentation = DefaultEntityPresentationApi.create({ catalogApi });
  const wrapper = ({ children }: PropsWithChildren<{}>) => (
    <TestApiProvider
      apis={[
        [catalogApiRef, catalogApi],
        [entityPresentationApiRef, presentation],
      ]}
    >
      {children}
    </TestApiProvider>
  );
  const { result, rerender } = renderHook(
    ({ refs, enabled }) => useEntityRefCandidates(refs, enabled),
    { initialProps: { refs: ['user:default/first'], enabled: true }, wrapper },
  );
  expect(result.current.options).toEqual([]);
  expect(result.current.loading).toBe(true);
  expect(result.current.error).toBe(false);
  await waitFor(() => expect(pending.has('user:default/first')).toBe(true));
  await act(async () =>
    pending.get('user:default/first')!({ items: [undefined] }),
  );
  expect(result.current.options).toEqual([
    { ref: 'user:default/first', label: 'User first', missing: true },
  ]);
  // No parseable candidates need not mean the user cleared the filter.
  rerender({ refs: [], enabled: true });
  expect(result.current.options).toEqual([
    {
      ref: 'user:default/first',
      label: 'User first',
      missing: true,
      stale: true,
    },
  ]);
  expect(result.current.loading).toBe(false);
  rerender({ refs: ['user:default/second'], enabled: true });
  expect(result.current.options).toEqual([
    {
      ref: 'user:default/first',
      label: 'User first',
      missing: true,
      stale: true,
    },
  ]);
  expect(result.current.loading).toBe(true);
  await waitFor(() => expect(pending.has('user:default/second')).toBe(true));
  expect(result.current.options[0].ref).toBe('user:default/first');
  rerender({ refs: ['user:default/third'], enabled: true });
  // Even a response arriving during the next input's debounce is obsolete.
  await act(async () =>
    pending.get('user:default/second')!({ items: [undefined] }),
  );
  expect(result.current.options[0].ref).toBe('user:default/first');
  await waitFor(() => expect(pending.has('user:default/third')).toBe(true));
  await act(async () =>
    pending.get('user:default/third')!({ items: [undefined] }),
  );
  expect(result.current.options).toEqual([
    { ref: 'user:default/third', label: 'User third', missing: true },
  ]);
  expect(result.current.loading).toBe(false);

  rerender({ refs: [], enabled: false });
  expect(result.current.options).toEqual([]);
  expect(result.current.loading).toBe(false);
  rerender({ refs: ['user:default/fourth'], enabled: true });
  expect(result.current.options).toEqual([]);
  await waitFor(() => expect(pending.has('user:default/fourth')).toBe(true));
  await act(async () =>
    pending.get('user:default/fourth')!({ items: [undefined] }),
  );
  expect(result.current.options[0].ref).toBe('user:default/fourth');
  rerender({ refs: ['user:default/fifth'], enabled: true });
  await waitFor(() => expect(pending.has('user:default/fifth')).toBe(true));
  rerender({ refs: ['user:default/fifth'], enabled: false });
  expect(result.current.options).toEqual([]);
  expect(result.current.loading).toBe(false);
  await act(async () =>
    pending.get('user:default/fifth')!({ items: [undefined] }),
  );
  rerender({ refs: ['user:default/sixth'], enabled: true });
  expect(result.current.options).toEqual([]);
});

it('ignores stale lookups and distinguishes a missing ref from a later catalog entity', async () => {
  const catalogApi = catalogApiMock({ entities: [] });
  const lookup = jest.spyOn(catalogApi, 'getEntitiesByRefs');
  let resolveOld!: (value: { items: undefined[] }) => void;
  lookup.mockReturnValueOnce(
    new Promise(resolve => {
      resolveOld = resolve;
    }),
  );
  const presentation = DefaultEntityPresentationApi.create({ catalogApi });
  const wrapper = ({ children }: PropsWithChildren<{}>) => (
    <TestApiProvider
      apis={[
        [catalogApiRef, catalogApi],
        [entityPresentationApiRef, presentation],
      ]}
    >
      {children}
    </TestApiProvider>
  );
  const { result, rerender } = renderHook(
    ({ refs }) => useEntityRefCandidates(refs, refs.length > 0),
    { initialProps: { refs: ['user:default/old'] }, wrapper },
  );
  await waitFor(() => expect(lookup).toHaveBeenCalledTimes(1));
  rerender({ refs: ['user:default/freben'] });
  expect(result.current.options).toEqual([]);
  await waitFor(() =>
    expect(result.current.options).toEqual([
      { ref: 'user:default/freben', label: 'User freben', missing: true },
    ]),
  );
  await act(async () => {
    resolveOld({ items: [undefined] });
  });
  expect(result.current.options[0].ref).toBe('user:default/freben');

  rerender({ refs: [] });
  expect(result.current.options).toEqual([]);
  // Let the empty search settle before revisiting the same reference.
  await act(async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
  });
  lookup.mockResolvedValueOnce({
    items: [
      {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'User',
        metadata: { name: 'freben', title: 'Fredrik Adelöw' },
      },
    ],
  });
  rerender({ refs: ['user:default/freben'] });
  await waitFor(() =>
    expect(result.current.options).toEqual([
      {
        ref: 'user:default/freben',
        label: 'Fredrik Adelöw',
        entity: {
          apiVersion: 'backstage.io/v1alpha1',
          kind: 'User',
          metadata: { name: 'freben', title: 'Fredrik Adelöw' },
        },
      },
    ]),
  );
});
