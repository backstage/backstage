/*
 * Copyright 2026 The Backstage Authors
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

import { useRef } from 'react';
import type { Key } from 'react-aria-components';
import type {
  AsyncListSource,
  CollectionItem,
  LoadingConfig,
} from '../types/selectableCollection';
import { getItemKeys, isAsyncListSource } from '../utils/selectableCollection';

type CollectionAdapterSearch =
  | true
  | {
      mode?: 'client' | 'server';
      inputValue?: string;
      defaultInputValue?: string;
      onInputChange?: (value: string) => void;
    };

type UseCollectionAdapterProps<T extends CollectionItem> = {
  items: Iterable<T> | AsyncListSource<T>;
  selectedKeys?: Iterable<Key>;
  search?: CollectionAdapterSearch;
  loading?: LoadingConfig;
  retainSelectedItems?: boolean;
};

/** @internal */
export type CollectionAdapterResult<T extends CollectionItem> = {
  canonicalItems: T[];
  visibleIds?: Set<Key>;
  loading?: LoadingConfig;
  isStale: boolean;
  inputValue?: string;
  defaultInputValue?: string;
  onInputChange?: (value: string) => void;
};

/** @internal */
export function useCollectionAdapter<T extends CollectionItem>({
  items,
  selectedKeys = [],
  search,
  loading,
  retainSelectedItems = true,
}: UseCollectionAdapterProps<T>): CollectionAdapterResult<T> {
  const retainedItems = useRef(new Map<Key, T>());
  let asyncSource: AsyncListSource<T> | undefined;
  let sourceItems: T[];

  if (isAsyncListSource(items)) {
    asyncSource = items;
    sourceItems = [...items.items];
  } else {
    sourceItems = Array.from(items);
  }

  const selectedIdSet = new Set(selectedKeys);
  const searchProps = typeof search === 'object' ? search : undefined;
  const isServerSearch = searchProps?.mode === 'server';

  for (const key of retainedItems.current.keys()) {
    if (!selectedIdSet.has(key)) {
      retainedItems.current.delete(key);
    }
  }

  for (const item of sourceItems) {
    if (selectedIdSet.has(item.id)) {
      retainedItems.current.set(item.id, item);
    }
  }

  const sourceIds = getItemKeys(sourceItems);
  const shouldRetainSelectedItems = isServerSearch && retainSelectedItems;
  let canonicalItems = sourceItems;
  let visibleIds: Set<Key> | undefined;

  if (shouldRetainSelectedItems) {
    const missingSelectedItems = Array.from(retainedItems.current.entries())
      .filter(([id]) => !sourceIds.has(id))
      .map(([, item]) => item);

    canonicalItems = [...sourceItems, ...missingSelectedItems];
    visibleIds = sourceIds;
  }

  let resolvedLoading = loading;
  if (asyncSource) {
    resolvedLoading = {
      state: asyncSource.loadingState,
      onLoadMore: asyncSource.loadMore,
    };
  }

  let inputValue = searchProps?.inputValue;
  let onInputChange = searchProps?.onInputChange;
  if (asyncSource && isServerSearch) {
    inputValue = asyncSource.filterText;
    onInputChange = asyncSource.setFilterText;
  }

  return {
    canonicalItems,
    visibleIds,
    loading: resolvedLoading,
    isStale:
      sourceItems.length > 0 &&
      (resolvedLoading?.state === 'filtering' ||
        resolvedLoading?.state === 'sorting'),
    inputValue,
    defaultInputValue: searchProps?.defaultInputValue,
    onInputChange,
  };
}
