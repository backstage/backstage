/*
 * Copyright 2022 The Backstage Authors
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
import { UIEvent } from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { useInfiniteScrollSearch } from './useInfiniteScrollSearch';
import { act } from '@testing-library/react';
import { useSearch } from './SearchContext';

jest.mock('./SearchContext', () => {
  const fetchNextPage = jest.fn();
  return {
    ...jest.requireActual('./SearchContext'),
    useSearch: () => ({
      fetchNextPage,
    }),
  };
});

describe('useInfiniteScrollSearch', () => {
  it('should not invoke fetchNextPage if not scrolling', async () => {
    const { fetchNextPage } = useSearch();

    renderHook(() => useInfiniteScrollSearch());

    expect(fetchNextPage).not.toHaveBeenCalled();
  });

  it('should invoke fetchNextPage only when end of the page is reached', async () => {
    const { fetchNextPage } = useSearch();
    const { result } = renderHook(() => useInfiniteScrollSearch());

    const clientHeight = 100;
    const scrollHeight = 1000;

    const makeEvent = (scrollTop: number) =>
      ({
        target: { clientHeight, scrollHeight, scrollTop },
      } as unknown as UIEvent<HTMLElement>);

    act(() => result.current.onScroll(makeEvent(100)));
    act(() => result.current.onScroll(makeEvent(500)));
    result.current.onScroll(makeEvent(899));
    expect(fetchNextPage).not.toHaveBeenCalled();

    result.current.onScroll(makeEvent(900));
    expect(fetchNextPage).toHaveBeenCalled();
    result.current.onScroll(makeEvent(905));
    expect(fetchNextPage).toHaveBeenCalledTimes(2);
  });
});
