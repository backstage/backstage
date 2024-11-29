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
import { RELATION_MEMBER_OF } from '@backstage/catalog-model';
import { renderHook, waitFor } from '@testing-library/react';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { BrowserRouter } from 'react-router-dom';
import { Direction } from '../EntityRelationsGraph';
import { useCatalogGraphPage } from './useCatalogGraphPage';

const wrapper = ({ children }: { children?: React.ReactNode }) => {
  return <BrowserRouter>{children}</BrowserRouter>;
};

describe('useCatalogGraphPage', () => {
  test('should use initial state', () => {
    const { result } = renderHook(props => useCatalogGraphPage(props), {
      initialProps: {
        initialState: {
          rootEntityRefs: ['b:d/c'],
          maxDepth: 2,
          direction: Direction.RIGHT_LEFT,
          mergeRelations: false,
          unidirectional: false,
          showFilters: false,
          selectedKinds: ['API'],
          selectedRelations: [RELATION_MEMBER_OF],
        },
      },
      wrapper,
    });

    expect(result.current.rootEntityNames).toEqual([
      { kind: 'b', namespace: 'd', name: 'c' },
    ]);
    expect(result.current.maxDepth).toEqual(2);
    expect(result.current.direction).toEqual(Direction.RIGHT_LEFT);
    expect(result.current.mergeRelations).toEqual(false);
    expect(result.current.unidirectional).toEqual(false);
    expect(result.current.showFilters).toEqual(false);
    expect(result.current.selectedKinds).toEqual(['api']);
    expect(result.current.selectedRelations).toEqual([RELATION_MEMBER_OF]);
  });

  test('should use state from url', () => {
    act(() => {
      history.pushState(
        {},
        '',
        '?rootEntityRefs[]=b:d/c&maxDepth=2&direction=RL&mergeRelations=false&unidirectional=false&showFilters=false&selectedKinds[]=api&selectedRelations[]=memberOf',
      );
    });

    const { result } = renderHook(props => useCatalogGraphPage(props), {
      initialProps: {},
      wrapper,
    });

    expect(result.current.rootEntityNames).toEqual([
      { kind: 'b', namespace: 'd', name: 'c' },
    ]);
    expect(result.current.maxDepth).toEqual(2);
    expect(result.current.direction).toEqual(Direction.RIGHT_LEFT);
    expect(result.current.mergeRelations).toEqual(false);
    expect(result.current.unidirectional).toEqual(false);
    expect(result.current.showFilters).toEqual(false);
    expect(result.current.selectedKinds).toEqual(['api']);
    expect(result.current.selectedRelations).toEqual([RELATION_MEMBER_OF]);
  });

  test('should update state in url (replace if setting changes)', () => {
    const { result } = renderHook(props => useCatalogGraphPage(props), {
      wrapper,
      initialProps: {},
    });

    act(() => result.current.setMaxDepth(5));

    expect(window.location.search).toEqual(
      '?rootEntityRefs%5B%5D=b%3Ad%2Fc&maxDepth=5&selectedKinds%5B%5D=api&selectedRelations%5B%5D=memberOf&unidirectional=false&mergeRelations=false&direction=RL&showFilters=false&curve=curveMonotoneX',
    );

    act(() => result.current.setUnidirectional(false));

    expect(window.location.search).toEqual(
      '?rootEntityRefs%5B%5D=b%3Ad%2Fc&maxDepth=5&selectedKinds%5B%5D=api&selectedRelations%5B%5D=memberOf&unidirectional=false&mergeRelations=false&direction=RL&showFilters=false&curve=curveMonotoneX',
    );
  });

  test('should update state in url (only push if different root entity)', () => {
    const oldLength = window.history.length;
    const { result } = renderHook(props => useCatalogGraphPage(props), {
      initialProps: {
        initialState: {
          rootEntityRefs: ['component:default/first'],
        },
      },
      wrapper,
    });

    act(() =>
      result.current.setRootEntityNames([
        { kind: 'component', namespace: 'default', name: 'my' },
      ]),
    );

    expect(window.history.length).toEqual(oldLength + 1);
    expect(window.location.search).toEqual(
      '?rootEntityRefs%5B%5D=component%3Adefault%2Fmy&maxDepth=5&selectedKinds%5B%5D=api&selectedRelations%5B%5D=memberOf&unidirectional=false&mergeRelations=false&direction=RL&showFilters=false&curve=curveMonotoneX',
    );
  });

  test('should update state to last state on back', async () => {
    const { result } = renderHook(props => useCatalogGraphPage(props), {
      wrapper,
      initialProps: {
        initialState: {
          rootEntityRefs: ['component:default/first'],
        },
      },
    });

    act(() =>
      result.current.setRootEntityNames([
        { kind: 'component', namespace: 'default', name: 'first' },
      ]),
    );

    expect(window.location.search).toEqual(
      '?rootEntityRefs%5B%5D=component%3Adefault%2Ffirst&maxDepth=5&selectedKinds%5B%5D=api&selectedRelations%5B%5D=memberOf&unidirectional=false&mergeRelations=false&direction=RL&showFilters=false&curve=curveMonotoneX',
    );

    act(() =>
      result.current.setRootEntityNames([
        { kind: 'component', namespace: 'default', name: 'second' },
      ]),
    );

    expect(window.location.search).toEqual(
      '?rootEntityRefs%5B%5D=component%3Adefault%2Fsecond&maxDepth=5&selectedKinds%5B%5D=api&selectedRelations%5B%5D=memberOf&unidirectional=false&mergeRelations=false&direction=RL&showFilters=false&curve=curveMonotoneX',
    );

    act(() => {
      result.current.setRootEntityNames([
        { kind: 'component', namespace: 'default', name: 'third' },
      ]);
    });

    act(() => {
      window.history.back();
    });

    await waitFor(() => {
      expect(result.current.rootEntityNames).toEqual([
        { kind: 'component', namespace: 'default', name: 'second' },
      ]);
    });

    act(() => {
      window.history.back();
    });

    await waitFor(() => {
      expect(result.current.rootEntityNames).toEqual([
        { kind: 'component', namespace: 'default', name: 'first' },
      ]);
    });
  });
});
