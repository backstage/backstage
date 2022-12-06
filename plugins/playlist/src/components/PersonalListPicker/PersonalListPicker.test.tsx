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

import { ApiProvider } from '@backstage/core-app-api';
import {
  ConfigApi,
  configApiRef,
  IdentityApi,
  identityApiRef,
  storageApiRef,
} from '@backstage/core-plugin-api';
import { Playlist } from '@backstage/plugin-playlist-common';
import { MockStorageApi, TestApiRegistry } from '@backstage/test-utils';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';

import { MockPlaylistListProvider } from '../../testUtils';
import { PlaylistOwnerFilter } from '../PlaylistOwnerPicker';
import { PersonalListPicker } from './PersonalListPicker';

const mockConfigApi = {
  getOptionalString: () => 'Test Company',
} as Partial<ConfigApi>;

const mockIdentityApi = {
  getBackstageIdentity: async () => ({
    ownershipEntityRefs: ['user:default/owner', 'group:default/some-owner'],
  }),
} as Partial<IdentityApi>;

const apis = TestApiRegistry.from(
  [configApiRef, mockConfigApi],
  [identityApiRef, mockIdentityApi],
  [storageApiRef, MockStorageApi.create()],
);

const backendPlaylists: Playlist[] = [
  {
    id: 'id1',
    name: 'playlist-1',
    owner: 'group:default/some-owner',
    public: true,
    entities: 1,
    followers: 2,
    isFollowing: false,
  },
  {
    id: 'id2',
    name: 'playlist-2',
    owner: 'group:default/another-owner',
    public: true,
    entities: 2,
    followers: 1,
    isFollowing: true,
  },
  {
    id: 'id3',
    name: 'playlist-3',
    owner: 'group:default/another-owner',
    public: true,
    entities: 2,
    followers: 1,
    isFollowing: true,
  },
  {
    id: 'id4',
    name: 'playlist-4',
    owner: 'user:default/owner',
    public: true,
    entities: 2,
    followers: 1,
    isFollowing: true,
  },
];

describe('<PersonalListPicker />', () => {
  const updateFilters = jest.fn() as any;

  beforeEach(() => {
    updateFilters.mockClear();
  });

  it('renders filter groups', async () => {
    render(
      <ApiProvider apis={apis}>
        <MockPlaylistListProvider value={{ backendPlaylists }}>
          <PersonalListPicker />
        </MockPlaylistListProvider>
      </ApiProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText('Personal')).toBeInTheDocument();
      expect(screen.getByText('Test Company')).toBeInTheDocument();
    });
  });

  it('renders filters', async () => {
    const { getAllByRole } = render(
      <ApiProvider apis={apis}>
        <MockPlaylistListProvider value={{ backendPlaylists }}>
          <PersonalListPicker />
        </MockPlaylistListProvider>
      </ApiProvider>,
    );

    await waitFor(() => {
      expect(
        getAllByRole('menuitem').map(({ textContent }) => textContent),
      ).toEqual(['Owned 2', 'Following 3', 'All 4']);
    });
  });

  it('respects other frontend filters in counts', async () => {
    const { getAllByRole } = render(
      <ApiProvider apis={apis}>
        <MockPlaylistListProvider
          value={{
            backendPlaylists,
            filters: {
              owners: new PlaylistOwnerFilter(['group:default/another-owner']),
            },
          }}
        >
          <PersonalListPicker />
        </MockPlaylistListProvider>
      </ApiProvider>,
    );

    await waitFor(() => {
      expect(
        getAllByRole('menuitem').map(({ textContent }) => textContent),
      ).toEqual(['Owned -', 'Following 2', 'All 2']);
    });
  });

  it('respects the query parameter filter value', async () => {
    const queryParameters = { personal: 'owned' };
    render(
      <ApiProvider apis={apis}>
        <MockPlaylistListProvider
          value={{ backendPlaylists, updateFilters, queryParameters }}
        >
          <PersonalListPicker />
        </MockPlaylistListProvider>
      </ApiProvider>,
    );

    await waitFor(() => {
      expect(updateFilters.mock.lastCall[0].personal.value).toBe('owned');
    });
  });

  it('updates personal filter when a menuitem is selected', async () => {
    const { getByText } = render(
      <ApiProvider apis={apis}>
        <MockPlaylistListProvider value={{ backendPlaylists, updateFilters }}>
          <PersonalListPicker />
        </MockPlaylistListProvider>
      </ApiProvider>,
    );

    fireEvent.click(getByText('Following'));

    await waitFor(() => {
      expect(updateFilters.mock.lastCall[0].personal.value).toBe('following');
    });
  });

  it('responds to external queryParameters changes', async () => {
    const rendered = render(
      <ApiProvider apis={apis}>
        <MockPlaylistListProvider
          value={{
            backendPlaylists,
            updateFilters,
            queryParameters: { personal: 'all' },
          }}
        >
          <PersonalListPicker />
        </MockPlaylistListProvider>
      </ApiProvider>,
    );

    await waitFor(() => {
      expect(updateFilters.mock.lastCall[0].personal.value).toBe('all');
    });

    rendered.rerender(
      <ApiProvider apis={apis}>
        <MockPlaylistListProvider
          value={{
            backendPlaylists,
            updateFilters,
            queryParameters: { personal: 'owned' },
          }}
        >
          <PersonalListPicker />
        </MockPlaylistListProvider>
      </ApiProvider>,
    );

    await waitFor(() => {
      expect(updateFilters.mock.lastCall[0].personal.value).toBe('owned');
    });
  });

  describe.each(['owned', 'following'])(
    'filter resetting for %s playlists',
    type => {
      const picker = (props: { loading: boolean; mockData: any }) => (
        <ApiProvider apis={apis}>
          <MockPlaylistListProvider
            value={{
              backendPlaylists: backendPlaylists.map(p => ({
                ...p,
                ...props.mockData,
              })),
              queryParameters: { personal: type },
              updateFilters,
              loading: props.loading,
            }}
          >
            <PersonalListPicker />
          </MockPlaylistListProvider>
        </ApiProvider>
      );

      describe(`when there are no ${type} playlists`, () => {
        const mockData =
          type === 'owned'
            ? { owner: 'group:default/no-owner' }
            : { isFollowing: false };

        it('does not reset the filter while playlists are loading', async () => {
          render(picker({ loading: true, mockData }));
          await waitFor(() => {
            expect(updateFilters.mock.lastCall[0].personal.value).not.toBe(
              'all',
            );
          });
        });

        it('resets the filter to "all" when playlists are loaded', async () => {
          render(picker({ loading: false, mockData }));
          await waitFor(() => {
            expect(updateFilters.mock.lastCall[0].personal.value).toBe('all');
          });
        });
      });

      describe(`when there are some ${type} playlists present`, () => {
        const mockData = {};

        it('does not reset the filter while playlists are loading', async () => {
          render(picker({ loading: true, mockData }));
          await waitFor(() => {
            expect(updateFilters.mock.lastCall[0].personal.value).not.toBe(
              'all',
            );
          });
        });

        it('does not reset the filter when playlists are loaded', async () => {
          render(picker({ loading: false, mockData }));
          await waitFor(() => {
            expect(updateFilters.mock.lastCall[0].personal.value).toBe(type);
          });
        });
      });
    },
  );
});
