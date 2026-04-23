/*
 * Copyright 2025 The Backstage Authors
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

import { act, renderHook, waitFor } from '@testing-library/react';
import { usePageCache } from './usePageCache';

type Item = { id: string; value: number };

function makeStringPage(startIndex: number, pageSize: number, total: number) {
  const data: Item[] = [];
  for (let i = startIndex; i < Math.min(startIndex + pageSize, total); i++) {
    data.push({ id: `item-${i}`, value: i });
  }
  const next = startIndex + pageSize;
  const prev = startIndex - pageSize;
  return {
    data,
    nextCursor: next < total ? String(next) : undefined,
    prevCursor: prev >= 0 ? String(prev) : undefined,
  };
}

describe('usePageCache (infinite mode)', () => {
  it('accumulates data across pages, exposes undefined before first load, and extends backwards when loading previous', async () => {
    const pageSize = 3;
    const total = 12;

    const getData = jest.fn(
      async ({ cursor }: { cursor: string | undefined }) => {
        const startIndex = cursor ? parseInt(cursor, 10) : 6;
        return makeStringPage(startIndex, pageSize, total);
      },
    );

    const { result } = renderHook(() =>
      usePageCache<Item, string>({
        getData,
        initialCurrentCursor: '6',
        infinite: true,
      }),
    );

    // Initially undefined before the first fetch resolves.
    expect(result.current.data).toBeUndefined();
    expect(result.current.isPending).toBe(true);

    await waitFor(() => expect(result.current.isPending).toBe(false));

    // After first page loads, accumulated data equals that page.
    expect(result.current.data?.map(d => d.value)).toEqual([6, 7, 8]);
    expect(result.current.hasNextPage).toBe(true);
    expect(result.current.hasPreviousPage).toBe(true);

    // Load previous page — accumulated extends backwards.
    act(() => result.current.onPreviousPage());
    await waitFor(() =>
      expect(result.current.data?.map(d => d.value)).toEqual([
        3, 4, 5, 6, 7, 8,
      ]),
    );

    // Load next from cursor=3 goes to already-cached 6, no new fetch.
    act(() => result.current.onNextPage());
    await waitFor(() => expect(result.current.currentCursor).toBe('6'));
    expect(result.current.data?.map(d => d.value)).toEqual([3, 4, 5, 6, 7, 8]);

    // Load next again — fetches offset 9, accumulated grows forward.
    act(() => result.current.onNextPage());
    await waitFor(() =>
      expect(result.current.data?.map(d => d.value)).toEqual([
        3, 4, 5, 6, 7, 8, 9, 10, 11,
      ]),
    );
  });

  it('does not accumulate when infinite is false, returning only the current page', async () => {
    const getData = jest.fn(
      async ({ cursor }: { cursor: string | undefined }) =>
        makeStringPage(cursor ? parseInt(cursor, 10) : 0, 3, 9),
    );

    const { result } = renderHook(() =>
      usePageCache<Item, string>({ getData }),
    );

    await waitFor(() => expect(result.current.isPending).toBe(false));
    expect(result.current.data?.map(d => d.value)).toEqual([0, 1, 2]);

    act(() => result.current.onNextPage());
    await waitFor(() =>
      expect(result.current.data?.map(d => d.value)).toEqual([3, 4, 5]),
    );
  });
});
