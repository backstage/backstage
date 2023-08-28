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

import { fireEvent, getByRole, render, waitFor } from '@testing-library/react';
import { act } from '@testing-library/react-hooks';
import React from 'react';

import { TestApiProvider } from '@backstage/test-utils';
import { MockPlaylistListProvider } from '../../testUtils';
import {
  DefaultPlaylistSortTypes,
  DefaultSortCompareFunctions,
  PlaylistSortPicker,
} from './PlaylistSortPicker';
import { ConfigApi, configApiRef } from '@backstage/core-plugin-api';
import { PlaylistList } from '../PlaylistList';

const mockConfigApi = {
  getOptionalString: () => undefined,
} as Partial<ConfigApi>;

jest.mock('../PlaylistCard', () => ({
  PlaylistCard: ({ playlist }: { playlist: Playlist }) => (
    <div>{playlist.name}</div>
  ),
}));

describe('PlaylistSortPicker', () => {
  it('should update sort based on selection', async () => {
    const updateSort = jest.fn();

    const { getByText, getByTestId } = render(
      <TestApiProvider apis={[[configApiRef, mockConfigApi]]}>
        <MockPlaylistListProvider
          value={{
            updateSort,
            playlists: [
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
            ],
          }}
        >
          <PlaylistSortPicker />
          <PlaylistList />
        </MockPlaylistListProvider>
      </TestApiProvider>,
    );

    act(() => {
      fireEvent.mouseDown(
        getByRole(getByTestId('sort-picker-select'), 'button'),
      );
    });

    const abcSort = getByText('A-Z (ascending)');
    expect(abcSort).toBeInTheDocument();

    fireEvent.click(abcSort);
    await waitFor(() => {
      expect(updateSort).toHaveBeenLastCalledWith(
        DefaultSortCompareFunctions[DefaultPlaylistSortTypes.ascending],
      );
    });

    expect(getByText('playlist-1')).toBeInTheDocument();
    expect(getByText('playlist-2')).toBeInTheDocument();

    const zyxSort = getByText('Z-A (descending)');
    expect(zyxSort).toBeInTheDocument();

    fireEvent.click(zyxSort);
    await waitFor(() => {
      expect(updateSort).toHaveBeenLastCalledWith(
        DefaultSortCompareFunctions[DefaultPlaylistSortTypes.descending],
      );
    });

    expect(getByText('playlist-2')).toBeInTheDocument();
    expect(getByText('playlist-1')).toBeInTheDocument();

    act(() => {
      fireEvent.mouseDown(
        getByRole(getByTestId('sort-picker-select'), 'button'),
      );
    });
    const entitiesSort = getByText('# Entities');
    expect(entitiesSort).toBeInTheDocument();

    fireEvent.click(entitiesSort);
    await waitFor(() => {
      expect(updateSort).toHaveBeenLastCalledWith(
        DefaultSortCompareFunctions[DefaultPlaylistSortTypes.numEntities],
      );
    });
  });
});
