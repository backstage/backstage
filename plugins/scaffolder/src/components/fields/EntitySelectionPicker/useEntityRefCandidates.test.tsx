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
    ({ refs }) => useEntityRefCandidates(refs, true),
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
