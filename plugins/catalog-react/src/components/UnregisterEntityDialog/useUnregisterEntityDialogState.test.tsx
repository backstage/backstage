/*
 * Copyright 2021 The Backstage Authors
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

import { Location } from '@backstage/catalog-client';
import { Entity, ANNOTATION_ORIGIN_LOCATION } from '@backstage/catalog-model';
import { catalogApiRef } from '../../api';
import { renderHook, waitFor } from '@testing-library/react';
import { ReactNode } from 'react';
import { useUnregisterEntityDialogState } from './useUnregisterEntityDialogState';
import { TestApiProvider } from '@backstage/test-utils';
import { catalogApiMock } from '@backstage/plugin-catalog-react/testUtils';
import { createDeferred } from '@backstage/types';

describe('useUnregisterEntityDialogState', () => {
  const catalogApi = catalogApiMock.mock();

  const Wrapper = (props: { children?: ReactNode }) => (
    <TestApiProvider apis={[[catalogApiRef, catalogApi]]}>
      {props.children}
    </TestApiProvider>
  );

  let entity: Entity;
  let resolveLocation: (location: Location | undefined) => void;
  let resolveColocatedEntities: (entities: Entity[]) => void;

  beforeEach(() => {
    jest.resetAllMocks();

    const deferredLocation = createDeferred<Location | undefined>();
    const deferredColocatedEntities = createDeferred<Entity[]>();

    resolveLocation = deferredLocation.resolve;
    resolveColocatedEntities = deferredColocatedEntities.resolve;

    catalogApi.getLocationByRef.mockReturnValue(deferredLocation);
    catalogApi.getEntities.mockReturnValue(
      deferredColocatedEntities.then(items => ({ items })),
    );

    entity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Component',
      metadata: {
        name: 'n',
        namespace: 'ns',
        annotations: {
          [ANNOTATION_ORIGIN_LOCATION]: 'url:https://example.com',
        },
      },
      spec: {},
    };
  });

  it('goes through the happy unregister path', async () => {
    const rendered = renderHook(() => useUnregisterEntityDialogState(entity), {
      wrapper: Wrapper,
    });

    expect(rendered.result.current).toEqual({ type: 'loading' });

    resolveLocation({ type: 'url', target: 'https://example.com', id: 'x' });
    resolveColocatedEntities([entity]);

    await waitFor(() => {
      expect(rendered.result.current).toEqual({
        type: 'unregister',
        location: 'url:https://example.com',
        colocatedEntities: [{ kind: 'Component', namespace: 'ns', name: 'n' }],
        unregisterLocation: expect.any(Function),
        deleteEntity: expect.any(Function),
      });
    });
  });

  it('chooses the bootstrap path when necessary', async () => {
    entity.metadata.annotations![ANNOTATION_ORIGIN_LOCATION] =
      'bootstrap:bootstrap';

    const rendered = renderHook(() => useUnregisterEntityDialogState(entity), {
      wrapper: Wrapper,
    });

    resolveLocation({ type: 'bootstrap', target: 'bootstrap', id: 'x' });
    resolveColocatedEntities([]);

    await waitFor(() => {
      expect(rendered.result.current).toEqual({
        type: 'bootstrap',
        location: 'bootstrap:bootstrap',
        deleteEntity: expect.any(Function),
      });
    });
  });

  it('chooses only-delete when there was no location annotation', async () => {
    delete entity.metadata.annotations![ANNOTATION_ORIGIN_LOCATION];

    const rendered = renderHook(() => useUnregisterEntityDialogState(entity), {
      wrapper: Wrapper,
    });

    resolveLocation(undefined);
    resolveColocatedEntities([]);

    await waitFor(() => {
      expect(rendered.result.current).toEqual({
        type: 'only-delete',
        deleteEntity: expect.any(Function),
      });
    });
  });

  it('chooses only-delete when the location could not be found', async () => {
    const rendered = renderHook(() => useUnregisterEntityDialogState(entity), {
      wrapper: Wrapper,
    });

    resolveLocation(undefined);
    resolveColocatedEntities([]);

    await waitFor(() => {
      expect(rendered.result.current).toEqual({
        type: 'only-delete',
        deleteEntity: expect.any(Function),
      });
    });
  });
});
