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

import { parseEntityRef } from '@backstage/catalog-model';
import { humanizeEntityRef } from '@backstage/plugin-catalog-react';
import { Playlist } from '@backstage/plugin-playlist-common';
import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { MockPlaylistListProvider } from '../../testUtils';
import {
  PlaylistOwnerFilter,
  PlaylistOwnerPicker,
} from './PlaylistOwnerPicker';

const samplePlaylists: Playlist[] = [
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

describe('<PlaylistOwnerPicker/>', () => {
  it('renders all owners', () => {
    const rendered = render(
      <MockPlaylistListProvider
        value={{
          playlists: samplePlaylists,
          backendPlaylists: samplePlaylists,
        }}
      >
        <PlaylistOwnerPicker />
      </MockPlaylistListProvider>,
    );
    expect(rendered.getByText('Owner')).toBeInTheDocument();

    fireEvent.click(rendered.getByTestId('owner-picker-expand'));
    samplePlaylists
      .map(p =>
        humanizeEntityRef(parseEntityRef(p.owner), { defaultKind: 'group' }),
      )
      .forEach(owner => {
        expect(rendered.getByText(owner as string)).toBeInTheDocument();
      });
  });

  it('renders unique owners in alphabetical order', () => {
    const rendered = render(
      <MockPlaylistListProvider
        value={{
          playlists: samplePlaylists,
          backendPlaylists: samplePlaylists,
        }}
      >
        <PlaylistOwnerPicker />
      </MockPlaylistListProvider>,
    );
    expect(rendered.getByText('Owner')).toBeInTheDocument();

    fireEvent.click(rendered.getByTestId('owner-picker-expand'));

    expect(rendered.getAllByRole('option').map(o => o.textContent)).toEqual([
      'another-owner',
      'some-owner',
      'user:owner',
    ]);
  });

  it('respects the query parameter filter value', () => {
    const updateFilters = jest.fn();
    const queryParameters = { owners: ['group:default/another-owner'] };
    render(
      <MockPlaylistListProvider
        value={{
          updateFilters,
          queryParameters,
          playlists: samplePlaylists,
          backendPlaylists: samplePlaylists,
        }}
      >
        <PlaylistOwnerPicker />
      </MockPlaylistListProvider>,
    );

    expect(updateFilters).toHaveBeenLastCalledWith({
      owners: new PlaylistOwnerFilter(['group:default/another-owner']),
    });
  });

  it('adds owners to filters', () => {
    const updateFilters = jest.fn();
    const rendered = render(
      <MockPlaylistListProvider
        value={{
          playlists: samplePlaylists,
          backendPlaylists: samplePlaylists,
          updateFilters,
        }}
      >
        <PlaylistOwnerPicker />
      </MockPlaylistListProvider>,
    );
    expect(updateFilters).toHaveBeenLastCalledWith({
      owners: undefined,
    });

    fireEvent.click(rendered.getByTestId('owner-picker-expand'));
    fireEvent.click(rendered.getByText('some-owner'));
    expect(updateFilters).toHaveBeenLastCalledWith({
      owners: new PlaylistOwnerFilter(['group:default/some-owner']),
    });
  });

  it('removes owners from filters', () => {
    const updateFilters = jest.fn();
    const rendered = render(
      <MockPlaylistListProvider
        value={{
          playlists: samplePlaylists,
          backendPlaylists: samplePlaylists,
          updateFilters,
          filters: {
            owners: new PlaylistOwnerFilter(['group:default/some-owner']),
          },
        }}
      >
        <PlaylistOwnerPicker />
      </MockPlaylistListProvider>,
    );
    expect(updateFilters).toHaveBeenLastCalledWith({
      owners: new PlaylistOwnerFilter(['group:default/some-owner']),
    });
    fireEvent.click(rendered.getByTestId('owner-picker-expand'));
    expect(rendered.getByLabelText('some-owner')).toBeChecked();

    fireEvent.click(rendered.getByLabelText('some-owner'));
    expect(updateFilters).toHaveBeenLastCalledWith({
      owner: undefined,
    });
  });

  it('responds to external queryParameters changes', () => {
    const updateFilters = jest.fn();
    const rendered = render(
      <MockPlaylistListProvider
        value={{
          updateFilters,
          queryParameters: { owners: ['group:default/team-a'] },
        }}
      >
        <PlaylistOwnerPicker />
      </MockPlaylistListProvider>,
    );
    expect(updateFilters).toHaveBeenLastCalledWith({
      owners: new PlaylistOwnerFilter(['group:default/team-a']),
    });
    rendered.rerender(
      <MockPlaylistListProvider
        value={{
          updateFilters,
          queryParameters: { owners: ['group:default/team-b'] },
        }}
      >
        <PlaylistOwnerPicker />
      </MockPlaylistListProvider>,
    );
    expect(updateFilters).toHaveBeenLastCalledWith({
      owners: new PlaylistOwnerFilter(['group:default/team-b']),
    });
  });
});
