/*
 * Copyright 2023 The Backstage Authors
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
import { WrapperComponent, renderHook } from '@testing-library/react-hooks';
import React from 'react';
import { catalogApiRef } from '../api';
import { useRelatedEntities } from './useRelatedEntities';

describe('useRelatedEntities', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  const entity: Entity = {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Component',
    metadata: { name: 'test' },
    relations: [
      {
        type: 'ownedBy',
        targetRef: 'group:default/the-owners-1',
      },
      {
        type: 'ownedBy',
        targetRef: 'group:default/the-owners-2',
      },
      {
        type: 'partOf',
        targetRef: 'component:default/larger-thing',
      },
    ],
  };

  const catalogApi = {
    getEntitiesByRefs: jest.fn(),
  };

  const wrapper: WrapperComponent<{}> = ({ children }) => {
    return (
      <TestApiProvider apis={[[catalogApiRef, catalogApi]]}>
        {children}
      </TestApiProvider>
    );
  };

  it('filters and requests entities', async () => {
    catalogApi.getEntitiesByRefs.mockResolvedValueOnce({
      items: [entity, null], // one of them doesn't exist
    });

    const rendered = renderHook(
      () => useRelatedEntities(entity, { type: 'ownedby', kind: 'grOUP' }),
      { wrapper },
    );

    expect(rendered.result.current).toEqual({ loading: true });

    await rendered.waitForValueToChange(() => rendered.result.current.loading);

    expect(catalogApi.getEntitiesByRefs).toHaveBeenCalledWith({
      entityRefs: ['group:default/the-owners-1', 'group:default/the-owners-2'],
    });

    expect(rendered.result.current).toEqual({
      loading: false,
      entities: [entity], // filtered out the null
    });
  });
});
