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

import { Playlist } from '@backstage/plugin-playlist-common';
import { createContext, useContext } from 'react';
import { PersonalListFilter } from '../components/PersonalListPicker';
import { PlaylistOwnerFilter } from '../components/PlaylistOwnerPicker';
import { PlaylistTextFilter } from '../components/PlaylistSearchBar';
import { PlaylistFilter, PlaylistSortCompareFunction } from '../types';

/**
 * @public
 */
export class NoopFilter implements PlaylistFilter {
  getBackendFilters() {
    return { '': null };
  }
}

/**
 * @public
 */
export type DefaultPlaylistFilters = {
  noop?: NoopFilter;
  owners?: PlaylistOwnerFilter;
  personal?: PersonalListFilter;
  text?: PlaylistTextFilter;
};

export type PlaylistListContextProps<
  PlaylistFilters extends DefaultPlaylistFilters = DefaultPlaylistFilters,
> = {
  /**
   * The currently registered filters, adhering to the shape of DefaultPlaylistFilters
   */
  filters: PlaylistFilters;

  /**
   * The resolved list of playlists, after all filters are applied.
   */
  playlists: Playlist[];

  /**
   * The resolved list of playlists, after _only playlist-backend_ filters are applied.
   */
  backendPlaylists: Playlist[];

  /**
   * Update one or more of the registered filters. Optional filters can be set to `undefined` to
   * reset the filter.
   */
  updateFilters: (
    filters:
      | Partial<PlaylistFilters>
      | ((prevFilters: PlaylistFilters) => Partial<PlaylistFilters>),
  ) => void;

  /**
   * Update the compare function used to sort playlists.
   */
  updateSort: (compareFn: PlaylistSortCompareFunction) => void;

  /**
   * Filter values from query parameters.
   */
  queryParameters: Partial<Record<keyof PlaylistFilters, string | string[]>>;

  loading: boolean;
  error?: Error;
};

export const PlaylistListContext = createContext<
  PlaylistListContextProps<any> | undefined
>(undefined);

export function usePlaylistList<
  PlaylistFilters extends DefaultPlaylistFilters = DefaultPlaylistFilters,
>(): PlaylistListContextProps<PlaylistFilters> {
  const context = useContext(PlaylistListContext);
  if (!context)
    throw new Error('usePlaylistList must be used within PlaylistListProvider');
  return context;
}
