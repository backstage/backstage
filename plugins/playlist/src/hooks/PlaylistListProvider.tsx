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

import { useApi } from '@backstage/core-plugin-api';
import { Playlist } from '@backstage/plugin-playlist-common';
import { compact, isEqual } from 'lodash';
import qs from 'qs';
import React, {
  PropsWithChildren,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { useLocation } from 'react-router-dom';
import useAsyncFn from 'react-use/esm/useAsyncFn';
import useDebounce from 'react-use/esm/useDebounce';
import useMountedState from 'react-use/esm/useMountedState';

import { playlistApiRef } from '../api';
import {
  DefaultPlaylistSortTypes,
  DefaultSortCompareFunctions,
} from '../components/PlaylistSortPicker';
import { PlaylistFilter, PlaylistSortCompareFunction } from '../types';
import {
  DefaultPlaylistFilters,
  NoopFilter,
  PlaylistListContext,
} from './usePlaylistList';

const reduceBackendFilters = (
  filters: PlaylistFilter[],
): Record<string, string | string[] | null> => {
  return filters.reduce((compoundFilter, filter) => {
    return {
      ...compoundFilter,
      ...(filter.getBackendFilters ? filter.getBackendFilters() : {}),
    };
  }, {} as Record<string, string | string[] | null>);
};

type OutputState<PlaylistFilters extends DefaultPlaylistFilters> = {
  appliedFilters: PlaylistFilters;
  playlists: Playlist[];
  backendPlaylists: Playlist[];
};

/**
 * @public
 */
export const PlaylistListProvider = <
  PlaylistFilters extends DefaultPlaylistFilters,
>({
  children,
}: PropsWithChildren<{}>) => {
  const isMounted = useMountedState();
  const playlistApi = useApi(playlistApiRef);
  const [sortCompareFn, setSortCompareFn] =
    useState<PlaylistSortCompareFunction>(
      () => DefaultSortCompareFunctions[DefaultPlaylistSortTypes.popular],
    );
  const [requestedFilters, setRequestedFilters] = useState<PlaylistFilters>(
    {} as PlaylistFilters,
  );

  // We use react-router's useLocation hook so updates from external sources trigger an update to
  // the queryParameters in outputState. Updates from this hook use replaceState below and won't
  // trigger a useLocation change; this would instead come from an external source, such as a manual
  // update of the URL or two sidebar links with different filters.
  const location = useLocation();
  const queryParameters = useMemo(
    () =>
      (qs.parse(location.search, {
        ignoreQueryPrefix: true,
      }).filters ?? {}) as Record<string, string | string[]>,
    [location],
  );

  const [outputState, setOutputState] = useState<OutputState<PlaylistFilters>>({
    appliedFilters: {
      noop: new NoopFilter(), // Init with a noop filter to trigger initial request
    } as PlaylistFilters,
    playlists: [],
    backendPlaylists: [],
  });

  // The main async filter worker. Note that while it has a lot of dependencies
  // in terms of its implementation, the triggering only happens (debounced)
  // based on the requested filters/sortCompareFn changing.
  const [{ loading, error }, refresh] = useAsyncFn(
    async () => {
      const compacted: PlaylistFilter[] = compact(
        Object.values(requestedFilters),
      );
      const playlistFilter = (p: Playlist) =>
        compacted.every(
          filter => !filter.filterPlaylist || filter.filterPlaylist(p),
        );
      const backendFilter = reduceBackendFilters(compacted);
      const previousBackendFilter = reduceBackendFilters(
        compact(Object.values(outputState.appliedFilters)),
      );

      const queryParams = Object.keys(requestedFilters).reduce(
        (params, key) => {
          const filter = requestedFilters[key as keyof PlaylistFilters] as
            | PlaylistFilter
            | undefined;
          if (filter?.toQueryValue) {
            params[key] = filter.toQueryValue();
          }
          return params;
        },
        {} as Record<string, string | string[]>,
      );

      if (!isEqual(previousBackendFilter, backendFilter)) {
        const response = await playlistApi.getAllPlaylists({
          filter: backendFilter,
        });
        setOutputState({
          appliedFilters: requestedFilters,
          backendPlaylists: response,
          playlists: response.filter(playlistFilter).sort(sortCompareFn),
        });
      } else {
        setOutputState({
          appliedFilters: requestedFilters,
          backendPlaylists: outputState.backendPlaylists,
          playlists: outputState.backendPlaylists
            .filter(playlistFilter)
            .sort(sortCompareFn),
        });
      }

      if (isMounted()) {
        const oldParams = qs.parse(location.search, {
          ignoreQueryPrefix: true,
        });
        const newParams = qs.stringify(
          { ...oldParams, filters: queryParams },
          { addQueryPrefix: true, arrayFormat: 'repeat' },
        );
        const newUrl = `${window.location.pathname}${newParams}`;
        // We use direct history manipulation since useSearchParams and
        // useNavigate in react-router-dom cause unnecessary extra rerenders.
        // Also make sure to replace the state rather than pushing, since we
        // don't want there to be back/forward slots for every single filter
        // change.
        window.history?.replaceState(null, document.title, newUrl);
      }
    },
    [
      playlistApi,
      queryParameters,
      requestedFilters,
      sortCompareFn,
      outputState,
    ],
    { loading: true },
  );

  // Slight debounce on the refresh, since (especially on page load) several
  // filters will be calling this in rapid succession.
  useDebounce(refresh, 10, [requestedFilters, sortCompareFn]);

  const updateFilters = useCallback(
    (
      update:
        | Partial<PlaylistFilters>
        | ((prevFilters: PlaylistFilters) => Partial<PlaylistFilters>),
    ) => {
      setRequestedFilters(prevFilters => {
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

  const value = useMemo(
    () => ({
      filters: outputState.appliedFilters,
      playlists: outputState.playlists,
      backendPlaylists: outputState.backendPlaylists,
      updateFilters,
      updateSort,
      queryParameters,
      loading,
      error,
    }),
    [outputState, updateFilters, updateSort, queryParameters, loading, error],
  );

  return (
    <PlaylistListContext.Provider value={value}>
      {children}
    </PlaylistListContext.Provider>
  );
};
