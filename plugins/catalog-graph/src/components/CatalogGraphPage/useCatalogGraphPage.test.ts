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
import { act, renderHook } from '@testing-library/react-hooks';
import { useLocation as useLocationMocked } from 'react-router';
import { Direction } from '../EntityRelationsGraph';
import { useCatalogGraphPage } from './useCatalogGraphPage';

jest.mock('react-router', () => ({
  useLocation: jest.fn(),
}));

jest.spyOn(window.history, 'replaceState');
jest.spyOn(window.history, 'pushState');

const useLocation = useLocationMocked as jest.Mock<
  ReturnType<typeof useLocationMocked>
>;
const windowHistoryReplaceState = window.history.replaceState as jest.Mock<
  ReturnType<typeof window.history.replaceState>
>;
const windowHistoryPushState = window.history.pushState as jest.Mock<
  ReturnType<typeof window.history.pushState>
>;

describe('useCatalogGraphPage', () => {
  beforeEach(() => {
    useLocation.mockReturnValue({
      search: '?',
      state: {},
      key: '',
      pathname: '',
      hash: '',
    });
  });

  afterEach(() => jest.resetAllMocks());

  test('should use initial state', () => {
    const { result } = renderHook(() =>
      useCatalogGraphPage({
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
      }),
    );

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
    useLocation.mockReturnValueOnce({
      search:
        '?rootEntityRefs[]=b:d/c&maxDepth=2&direction=RL&mergeRelations=false&unidirectional=false&showFilters=false&selectedKinds[]=api&selectedRelations[]=memberOf',
      state: {},
      key: '',
      pathname: '',
      hash: '',
    });

    const { result } = renderHook(() => useCatalogGraphPage({}));

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
    const { result } = renderHook(() => useCatalogGraphPage({}));

    act(() => result.current.setMaxDepth(5));

    expect(windowHistoryReplaceState).toBeCalledWith(
      null,
      '',
      '/?maxDepth=5&unidirectional=true&mergeRelations=true&direction=LR&showFilters=true',
    );

    act(() => result.current.setUnidirectional(false));

    expect(windowHistoryReplaceState).toBeCalledWith(
      null,
      '',
      '/?maxDepth=5&unidirectional=false&mergeRelations=true&direction=LR&showFilters=true',
    );
  });

  test('should update state in url (only push if different root entity)', () => {
    const { result, rerender } = renderHook(() =>
      useCatalogGraphPage({
        initialState: {
          rootEntityRefs: ['component:default/first'],
        },
      }),
    );

    act(() =>
      result.current.setRootEntityNames([
        { kind: 'Component', namespace: 'default', name: 'my' },
      ]),
    );

    rerender();

    expect(windowHistoryPushState).toBeCalledWith(
      null,
      '',
      '/?rootEntityRefs%5B%5D=component%3Adefault%2Fmy&maxDepth=%E2%88%9E&unidirectional=true&mergeRelations=true&direction=LR&showFilters=true',
    );
  });
});
