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
import { UIEventHandler, UIEvent, useCallback, useEffect } from 'react';
import { useSearch } from './SearchContext';

export function useInfiniteScrollSearch() {
  const { fetchNextPage } = useSearch();
  const onScroll = useCallback<UIEventHandler<HTMLElement>>(
    e => {
      const element = e.target as HTMLElement;

      const isEndReached =
        element.scrollHeight - Math.abs(element.scrollTop) ===
        element.clientHeight;

      if (isEndReached) {
        fetchNextPage?.();
      }
    },
    [fetchNextPage],
  );

  return { onScroll };
}

export function useInfiniteScrollDocumentSearch() {
  const { onScroll } = useInfiniteScrollSearch();
  useEffect(() => {
    const handleScroll = () =>
      document.scrollingElement &&
      onScroll({
        target: document.scrollingElement,
      } as unknown as UIEvent<HTMLElement>);

    document.addEventListener('scroll', handleScroll);

    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, [onScroll]);
}
