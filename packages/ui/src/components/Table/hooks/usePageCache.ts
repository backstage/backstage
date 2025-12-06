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

import { useState, useCallback, useRef, useEffect } from 'react';

const FIRST_PAGE_CURSOR = Symbol('firstPage');

type CursorType = string | number;

type InternalCursor<TCursor extends CursorType> =
  | TCursor
  | typeof FIRST_PAGE_CURSOR;

interface PageEntry<T, TCursor extends CursorType> {
  data: T[] | undefined;
  nextCursor: InternalCursor<TCursor> | undefined;
  prevCursor: InternalCursor<TCursor> | undefined;
}

interface GetDataResult<T, TCursor extends CursorType> {
  data: T[];
  nextCursor?: TCursor;
  prevCursor?: TCursor;
  totalCount?: number;
}

/** @internal */
export interface UsePageCacheOptions<T, TCursor extends CursorType = string> {
  getData: (params: {
    cursor: TCursor | undefined;
    signal: AbortSignal;
  }) => Promise<GetDataResult<T, TCursor>>;
  initialCurrentCursor?: TCursor;
}

/** @internal */
export interface UsePageCacheResult<T, TCursor extends CursorType = string> {
  loading: boolean;
  error: Error | undefined;
  data: T[] | undefined;
  totalCount: number | undefined;
  currentCursor: TCursor | undefined;
  hasPreviousPage: boolean;
  onPreviousPage: () => void;
  hasNextPage: boolean;
  onNextPage: () => void;
  reload: (options?: { keepCurrentCursor?: boolean }) => void;
}

type Direction = 'mount' | 'reset' | 'refresh' | 'next' | 'prev';

class PageCacheStore<T, TCursor extends CursorType> {
  private cache = new Map<InternalCursor<TCursor>, PageEntry<T, TCursor>>();

  get(cursor: InternalCursor<TCursor>): PageEntry<T, TCursor> | undefined {
    return this.cache.get(cursor);
  }

  getOrCreate(cursor: InternalCursor<TCursor>): PageEntry<T, TCursor> {
    const existing = this.cache.get(cursor);
    if (existing) {
      return existing;
    }
    const entry: PageEntry<T, TCursor> = {
      data: undefined,
      nextCursor: undefined,
      prevCursor: undefined,
    };
    this.cache.set(cursor, entry);
    return entry;
  }

  clear() {
    this.cache.clear();
  }

  getTargetCursor(
    direction: Direction,
    currentCursor: InternalCursor<TCursor>,
    initialCurrentCursor: TCursor | undefined,
  ): InternalCursor<TCursor> | undefined {
    if (direction === 'mount') {
      return toInternalCursor(initialCurrentCursor);
    }
    if (direction === 'reset') {
      return FIRST_PAGE_CURSOR;
    }
    if (direction === 'refresh') {
      return currentCursor;
    }
    const currentEntry = this.cache.get(currentCursor);

    if (!currentEntry) {
      return;
    }

    return direction === 'next'
      ? currentEntry.nextCursor
      : currentEntry.prevCursor;
  }

  linkEntryToSource(
    entry: PageEntry<T, TCursor>,
    direction: Direction,
    currentCursor: InternalCursor<TCursor>,
  ) {
    if (direction === 'next') {
      entry.prevCursor = currentCursor;
    } else if (direction === 'prev') {
      entry.nextCursor = currentCursor;
    }
  }
}

function toInternalCursor<TCursor extends CursorType>(
  cursor: TCursor | undefined,
): InternalCursor<TCursor> {
  return cursor === undefined ? FIRST_PAGE_CURSOR : cursor;
}

function toExternalCursor<TCursor extends CursorType>(
  cursor: InternalCursor<TCursor>,
): TCursor | undefined {
  return cursor === FIRST_PAGE_CURSOR ? undefined : cursor;
}

/** @internal */
export function usePageCache<T, TCursor extends CursorType = string>(
  options: UsePageCacheOptions<T, TCursor>,
): UsePageCacheResult<T, TCursor> {
  const { getData, initialCurrentCursor } = options;

  const [currentCursor, setCurrentCursor] = useState<InternalCursor<TCursor>>(
    () => toInternalCursor(initialCurrentCursor),
  );

  const cacheStore = useRef(new PageCacheStore<T, TCursor>()).current;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>(undefined);
  const [totalCount, setTotalCount] = useState<number | undefined>(undefined);

  const abortControllerRef = useRef<AbortController | null>(null);

  const currentPage = cacheStore.get(currentCursor);
  const data = currentPage?.data;
  const hasNextPage = currentPage?.nextCursor !== undefined;
  const hasPreviousPage = currentPage?.prevCursor !== undefined;

  const goToPage = useCallback(
    async (direction: Direction) => {
      const targetCursor = cacheStore.getTargetCursor(
        direction,
        currentCursor,
        initialCurrentCursor,
      );

      if (!targetCursor) {
        return;
      }

      const existingEntry = cacheStore.get(targetCursor);
      if (existingEntry?.data !== undefined) {
        setCurrentCursor(targetCursor);
        return;
      }

      const entry = cacheStore.getOrCreate(targetCursor);
      cacheStore.linkEntryToSource(entry, direction, currentCursor);
      setCurrentCursor(targetCursor);

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      setLoading(true);
      setError(undefined);

      try {
        const result = await getData({
          cursor: toExternalCursor(targetCursor),
          signal: abortController.signal,
        });

        if (abortController.signal.aborted) {
          return;
        }

        entry.data = result.data;

        if (entry.nextCursor === undefined && result.nextCursor !== undefined) {
          entry.nextCursor = result.nextCursor;
        }
        if (entry.prevCursor === undefined && result.prevCursor !== undefined) {
          entry.prevCursor = result.prevCursor;
        }

        if (result.totalCount !== undefined) {
          setTotalCount(result.totalCount);
        }

        setLoading(false);
      } catch (err) {
        if (abortController.signal.aborted) {
          return;
        }

        setError(err instanceof Error ? err : new Error(String(err)));
        setLoading(false);
      }
    },
    [getData, initialCurrentCursor, currentCursor, cacheStore],
  );

  useEffect(() => {
    goToPage('mount');

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const onNextPage = useCallback(() => {
    if (loading) return;
    const page = cacheStore.get(currentCursor);
    if (!page?.nextCursor) return;
    goToPage('next');
  }, [loading, currentCursor, goToPage, cacheStore]);

  const onPreviousPage = useCallback(() => {
    if (loading) return;
    const page = cacheStore.get(currentCursor);
    if (!page?.prevCursor) return;
    goToPage('prev');
  }, [loading, currentCursor, goToPage, cacheStore]);

  const reload = useCallback(
    (reloadOptions?: { keepCurrentCursor?: boolean }) => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      cacheStore.clear();

      goToPage(reloadOptions?.keepCurrentCursor ? 'refresh' : 'reset');
    },
    [goToPage, cacheStore],
  );

  return {
    loading,
    error,
    data,
    totalCount,
    currentCursor: toExternalCursor(currentCursor),
    hasPreviousPage,
    onPreviousPage,
    hasNextPage,
    onNextPage,
    reload,
  };
}
