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

import { Entity, CompoundEntityRef } from '@backstage/catalog-model';
import { TestApiProvider } from '@backstage/test-utils';
import { renderHook } from '@testing-library/react-hooks';
import React, { PropsWithChildren } from 'react';
import Observable from 'zen-observable';
import { StarredEntitiesApi, starredEntitiesApiRef } from '../apis';
import { useStarredEntity } from './useStarredEntity';

describe('useStarredEntity', () => {
  const mockStarredEntitiesApi: jest.Mocked<StarredEntitiesApi> = {
    toggleStarred: jest.fn(),
    starredEntitie$: jest.fn(),
  };
  let wrapper: React.ComponentType;

  beforeEach(() => {
    wrapper = (props: PropsWithChildren<{}>) => (
      <TestApiProvider apis={[[starredEntitiesApiRef, mockStarredEntitiesApi]]}>
        {props.children}
      </TestApiProvider>
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe.each`
    title                 | entityOrRef
    ${'entity reference'} | ${'component:default/mock'}
    ${'entity name'}      | ${{ kind: 'component', namespace: 'default', name: 'mock' } as CompoundEntityRef}
    ${'entity'}           | ${{ apiVersion: '1', kind: 'Component', metadata: { name: 'mock' } } as Entity}
  `('with $title', ({ entityOrRef }) => {
    describe('toggleStarredEntity', () => {
      it('should toggle starred entity', () => {
        mockStarredEntitiesApi.starredEntitie$.mockReturnValue(Observable.of());
        mockStarredEntitiesApi.toggleStarred.mockResolvedValue();

        const { result } = renderHook(() => useStarredEntity(entityOrRef), {
          wrapper,
        });

        result.current.toggleStarredEntity();

        expect(mockStarredEntitiesApi.toggleStarred).toHaveBeenCalledTimes(1);
        expect(mockStarredEntitiesApi.toggleStarred).toHaveBeenCalledWith(
          'component:default/mock',
        );
      });
    });

    describe('isStarredEntity', () => {
      it('should return not starred entity', () => {
        mockStarredEntitiesApi.starredEntitie$.mockReturnValue(Observable.of());
        mockStarredEntitiesApi.toggleStarred.mockResolvedValue();

        const { result } = renderHook(() => useStarredEntity(entityOrRef), {
          wrapper,
        });

        expect(result.current.isStarredEntity).toBe(false);
      });

      it('should return starred entity', async () => {
        mockStarredEntitiesApi.starredEntitie$.mockReturnValue(
          Observable.of(new Set(['component:default/mock'])),
        );
        mockStarredEntitiesApi.toggleStarred.mockResolvedValue();

        const { result, waitForNextUpdate } = renderHook(
          () => useStarredEntity(entityOrRef),
          {
            wrapper,
          },
        );

        // the initial value will always be false because the observable triggers async
        expect(result.current.isStarredEntity).toBe(false);
        await waitForNextUpdate();

        expect(result.current.isStarredEntity).toBe(true);
      });
    });
  });
});
