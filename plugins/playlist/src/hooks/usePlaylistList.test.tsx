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

import {
  ConfigApi,
  configApiRef,
  IdentityApi,
  identityApiRef,
} from '@backstage/core-plugin-api';
import { Playlist } from '@backstage/plugin-playlist-common';
import { TestApiProvider } from '@backstage/test-utils';
import { act, renderHook } from '@testing-library/react-hooks';
import qs from 'qs';
import React, { PropsWithChildren } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { PlaylistApi, playlistApiRef } from '../api';
import {
  DefaultSortCompareFunctions,
  DefaultPlaylistSortTypes,
  PersonalListFilter,
  PersonalListFilterValue,
  PersonalListPicker,
  PlaylistOwnerPicker,
} from '../components';
import { PlaylistListProvider, usePlaylistList } from './usePlaylistList';

const playlists: Playlist[] = [
  {
    id: 'id1',
    name: 'list-1',
    owner: 'user:default/guest',
    public: true,
    entities: 2,
    followers: 5,
    isFollowing: false,
  },
  {
    id: 'id2',
    name: 'list-2',
    owner: 'group:default/foo',
    public: true,
    entities: 3,
    followers: 2,
    isFollowing: true,
  },
];

const mockConfigApi = {
  getOptionalString: () => '',
} as Partial<ConfigApi>;

const mockIdentityApi: Partial<IdentityApi> = {
  getBackstageIdentity: async () => ({
    type: 'user',
    userEntityRef: 'user:default/guest',
    ownershipEntityRefs: [],
  }),
};

const mockPlaylistApi: Partial<PlaylistApi> = {
  getAllPlaylists: jest.fn().mockImplementation(async () => playlists),
};

const wrapper = ({
  location,
  children,
}: PropsWithChildren<{
  location?: string;
}>) => {
  return (
    <MemoryRouter initialEntries={[location ?? '']}>
      <TestApiProvider
        apis={[
          [configApiRef, mockConfigApi],
          [playlistApiRef, mockPlaylistApi],
          [identityApiRef, mockIdentityApi],
        ]}
      >
        <PlaylistListProvider>
          <PersonalListPicker />
          <PlaylistOwnerPicker />
          {children}
        </PlaylistListProvider>
      </TestApiProvider>
    </MemoryRouter>
  );
};

describe('<PlaylistListProvider />', () => {
  const origReplaceState = window.history.replaceState;
  beforeEach(() => {
    window.history.replaceState = jest.fn();
  });
  afterEach(() => {
    window.history.replaceState = origReplaceState;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('resolves backend filters', async () => {
    const { result, waitForValueToChange } = renderHook(
      () => usePlaylistList(),
      {
        wrapper,
      },
    );
    await waitForValueToChange(() => result.current.backendPlaylists);
    expect(result.current.backendPlaylists.length).toBe(2);
    expect(mockPlaylistApi.getAllPlaylists).toHaveBeenCalled();
  });

  it('resolves frontend filters', async () => {
    const { result, waitFor } = renderHook(() => usePlaylistList(), {
      wrapper,
    });
    await waitFor(() => !!result.current.playlists.length);
    expect(result.current.backendPlaylists.length).toBe(2);

    act(() =>
      result.current.updateFilters({
        personal: new PersonalListFilter(
          PersonalListFilterValue.owned,
          playlist => playlist.name === 'list-1',
        ),
      }),
    );

    await waitFor(() => {
      expect(result.current.backendPlaylists.length).toBe(2);
      expect(result.current.playlists.length).toBe(1);
      expect(mockPlaylistApi.getAllPlaylists).toHaveBeenCalledTimes(1);
    });
  });

  it('resolves query param filter values', async () => {
    const query = qs.stringify({
      filters: { personal: 'all', owners: ['user:default/guest'] },
    });
    const { result, waitFor } = renderHook(() => usePlaylistList(), {
      wrapper,
      initialProps: {
        location: `/playlist?${query}`,
      },
    });
    await waitFor(() => !!result.current.queryParameters);
    expect(result.current.queryParameters).toEqual({
      personal: 'all',
      owners: ['user:default/guest'],
    });
  });

  it('does not fetch when only frontend filters change', async () => {
    const { result, waitFor } = renderHook(() => usePlaylistList(), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.playlists.length).toBe(2);
      expect(mockPlaylistApi.getAllPlaylists).toHaveBeenCalledTimes(1);
    });

    act(() =>
      result.current.updateFilters({
        personal: new PersonalListFilter(
          PersonalListFilterValue.owned,
          playlist => playlist.name === 'list-1',
        ),
      }),
    );

    await waitFor(() => {
      expect(result.current.playlists.length).toBe(1);
      expect(mockPlaylistApi.getAllPlaylists).toHaveBeenCalledTimes(1);
    });
  });

  it('applies custom sorting', async () => {
    const { result, waitFor } = renderHook(() => usePlaylistList(), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.playlists.length).toBe(2);
      expect(result.current.playlists[0].name).toEqual('list-1');
      expect(result.current.playlists[1].name).toEqual('list-2');
    });

    act(() =>
      result.current.updateSort(
        DefaultSortCompareFunctions[DefaultPlaylistSortTypes.numEntities],
      ),
    );

    await waitFor(() => {
      expect(result.current.playlists.length).toBe(2);
      expect(result.current.playlists[0].name).toEqual('list-2');
      expect(result.current.playlists[1].name).toEqual('list-1');
    });
  });

  it('returns an error on playlistApi failure', async () => {
    mockPlaylistApi.getAllPlaylists = jest.fn().mockRejectedValue('error');
    const { result, waitFor } = renderHook(() => usePlaylistList(), {
      wrapper,
    });
    await waitFor(() => {
      expect(result.current.error).toBeDefined();
    });
  });
});
