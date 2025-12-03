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
import { useState, useEffect, useCallback, useRef } from 'react';
import { useAsyncList } from 'react-stately';
import { CursorPaginationConfig } from '../types';

// Internal hook for managing cursor pagination state and data fetching using useAsyncList
export function useCursorPagination(pagination: CursorPaginationConfig) {
  const initialCursor = pagination.initialCursor;
  const initialLimit = pagination.initialLimit ?? 20;
  const [limit, setLimit] = useState(initialLimit);
  const [nextCursor, setNextCursor] = useState<string | undefined>(undefined);
  const [prevCursor, setPrevCursor] = useState<string | undefined>(undefined);
  const [totalCount, setTotalCount] = useState(pagination.totalCount ?? 0);
  const [currentCursor, setCurrentCursor] = useState<string | undefined>(
    initialCursor,
  );
  // Track approximate page number for display purposes
  const [currentPage, setCurrentPage] = useState(1);

  // Use refs to access current limit and cursor in the load function
  const limitRef = useRef(limit);
  const cursorRef = useRef(currentCursor);

  // Update refs when values change
  useEffect(() => {
    limitRef.current = limit;
  }, [limit]);

  useEffect(() => {
    cursorRef.current = currentCursor;
  }, [currentCursor]);

  // Use useAsyncList - we'll use cursorRef to control which cursor to load
  const list = useAsyncList<Record<string, any>>({
    async load({ cursor }) {
      // Use cursorRef for manual control, or cursor from useAsyncList on initial load
      const targetCursor = cursorRef.current ?? cursor ?? initialCursor;
      const currentLimit = limitRef.current;

      try {
        const result = await pagination.fetchData(targetCursor, currentLimit);
        setTotalCount(result.totalCount ?? totalCount);
        setNextCursor(result.nextCursor);
        setPrevCursor(result.prevCursor);
        setCurrentCursor(targetCursor);
        pagination.onCursorChange?.(targetCursor);
        pagination.onLimitChange?.(currentLimit);

        // Return items and next cursor for useAsyncList
        return {
          items: result.data,
          cursor: result.nextCursor,
        };
      } catch (err) {
        throw err instanceof Error ? err : new Error('Unknown error');
      }
    },
  });

  // Track if this is the initial mount to avoid double loading
  const isInitialMount = useRef(true);

  // Reload when limit changes
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (limit !== initialLimit) {
      // Update ref synchronously before reload to ensure load() uses the correct cursor
      cursorRef.current = initialCursor;
      setCurrentCursor(initialCursor); // Reset to initial cursor when limit changes
      setCurrentPage(1); // Reset to first page when limit changes
      list.reload();
    }
  }, [limit, initialLimit, initialCursor]);

  const fetchNext = useCallback(() => {
    if (nextCursor) {
      // Update ref synchronously before reload to ensure load() uses the correct cursor
      cursorRef.current = nextCursor;
      setCurrentCursor(nextCursor);
      setCurrentPage(prev => prev + 1);
      list.reload();
    }
  }, [nextCursor, list]);

  const fetchPrev = useCallback(() => {
    if (prevCursor !== undefined) {
      // Update ref synchronously before reload to ensure load() uses the correct cursor
      cursorRef.current = prevCursor;
      setCurrentCursor(prevCursor);
      setCurrentPage(prev => Math.max(1, prev - 1));
      list.reload();
    }
  }, [prevCursor, list]);

  const handleLimitChange = useCallback(
    (newLimit: number) => {
      setLimit(newLimit);
      setCurrentCursor(initialCursor); // Reset to initial cursor when limit changes
    },
    [initialCursor],
  );

  return {
    data: list.items,
    loading: list.isLoading,
    error: list.error,
    nextCursor,
    prevCursor,
    totalCount,
    currentPage,
    fetchNext,
    fetchPrev,
    limit,
    setLimit: handleLimitChange,
  };
}
