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

import React, {
  PropsWithChildren,
  useCallback,
  useMemo,
  useState,
} from 'react';
import {
  DefaultPlaylistSortTypes,
  DefaultSortCompareFunctions,
} from '../components';
import {
  DefaultPlaylistFilters,
  PlaylistListContext,
  PlaylistListContextProps,
} from '../hooks';
import { PlaylistSortCompareFunction } from '../types';

export const MockPlaylistListProvider = ({
  children,
  value,
}: PropsWithChildren<{
  value?: Partial<PlaylistListContextProps>;
}>) => {
  const [filters, setFilters] = useState<DefaultPlaylistFilters>(
    value?.filters ?? {},
  );

  const [_, setSortCompareFn] = useState<PlaylistSortCompareFunction>(
    () => DefaultSortCompareFunctions[DefaultPlaylistSortTypes.popular],
  );

  const updateFilters = useCallback(
    (
      update:
        | Partial<DefaultPlaylistFilters>
        | ((
            prevFilters: DefaultPlaylistFilters,
          ) => Partial<DefaultPlaylistFilters>),
    ) => {
      setFilters(prevFilters => {
        const newFilters =
          typeof update === 'function' ? update(prevFilters) : update;
        return { ...prevFilters, ...newFilters };
      });
    },
    [],
  );

  const updateSort = useCallback(
    (compareFn: PlaylistSortCompareFunction) =>
      setSortCompareFn(() => compareFn),
    [],
  );

  // Memoize the default values since pickers have useEffect triggers on these; naively defaulting
  // below with `?? <X>` breaks referential equality on subsequent updates.
  const defaultValues = useMemo(
    () => ({
      playlists: [],
      backendPlaylists: [],
      queryParameters: {},
    }),
    [],
  );

  const resolvedValue: PlaylistListContextProps = useMemo(
    () => ({
      playlists: value?.playlists ?? defaultValues.playlists,
      backendPlaylists:
        value?.backendPlaylists ?? defaultValues.backendPlaylists,
      updateFilters: value?.updateFilters ?? updateFilters,
      filters,
      updateSort: value?.updateSort ?? updateSort,
      loading: value?.loading ?? false,
      queryParameters: value?.queryParameters ?? defaultValues.queryParameters,
      error: value?.error,
    }),
    [value, defaultValues, filters, updateFilters, updateSort],
  );

  return (
    <PlaylistListContext.Provider value={resolvedValue}>
      {children}
    </PlaylistListContext.Provider>
  );
};
