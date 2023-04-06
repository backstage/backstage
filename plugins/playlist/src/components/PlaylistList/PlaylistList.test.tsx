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

import { ConfigApi, configApiRef } from '@backstage/core-plugin-api';
import { Playlist } from '@backstage/plugin-playlist-common';
import { TestApiProvider } from '@backstage/test-utils';
import { render } from '@testing-library/react';
import React from 'react';

import { MockPlaylistListProvider } from '../../testUtils';
import { PlaylistList } from './PlaylistList';

const mockConfigApi = {
  getOptionalString: () => undefined,
} as Partial<ConfigApi>;

jest.mock('../PlaylistCard', () => ({
  PlaylistCard: ({ playlist }: { playlist: Playlist }) => (
    <div>{playlist.name}</div>
  ),
}));

describe('<PlaylistList/>', () => {
  it('renders error on error', () => {
    const rendered = render(
      <TestApiProvider apis={[[configApiRef, mockConfigApi]]}>
        <MockPlaylistListProvider value={{ error: new Error('Test Error') }}>
          <PlaylistList />
        </MockPlaylistListProvider>
      </TestApiProvider>,
    );

    expect(rendered.getByText('Test Error')).toBeInTheDocument();
  });

  it('handles no playlists', () => {
    const rendered = render(
      <TestApiProvider apis={[[configApiRef, mockConfigApi]]}>
        <MockPlaylistListProvider value={{ playlists: [] }}>
          <PlaylistList />
        </MockPlaylistListProvider>
      </TestApiProvider>,
    );

    expect(
      rendered.getByText('No playlists found that match your filter.'),
    ).toBeInTheDocument();
  });

  it('renders playlists', () => {
    const rendered = render(
      <TestApiProvider apis={[[configApiRef, mockConfigApi]]}>
        <MockPlaylistListProvider
          value={{
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
          <PlaylistList />
        </MockPlaylistListProvider>
      </TestApiProvider>,
    );

    expect(rendered.getByText('playlist-1')).toBeInTheDocument();
    expect(rendered.getByText('playlist-2')).toBeInTheDocument();
  });
});
