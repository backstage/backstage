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

import { Entity } from '@backstage/catalog-model';
import { AlertApi, alertApiRef } from '@backstage/core-plugin-api';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import { EntityProvider } from '@backstage/plugin-catalog-react';
import { AuthorizeResult } from '@backstage/plugin-permission-common';
import {
  PermissionApi,
  permissionApiRef,
} from '@backstage/plugin-permission-react';
import { Button } from '@material-ui/core';
import { fireEvent, getByRole, waitFor } from '@testing-library/react';
import { act } from '@testing-library/react-hooks';
import React from 'react';
import { SWRConfig } from 'swr';
import { PlaylistApi, playlistApiRef } from '../../api';
import { rootRouteRef } from '../../routes';
import { EntityPlaylistDialog } from './EntityPlaylistDialog';

const navigateMock = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => navigateMock,
}));

jest.mock('../PlaylistEditDialog', () => ({
  PlaylistEditDialog: ({ onSave, open }: { onSave: Function; open: boolean }) =>
    open ? (
      <Button
        data-testid="mock-playlist-edit-dialog"
        onClick={() => onSave()}
      />
    ) : null,
}));

describe('EntityPlaylistDialog', () => {
  const samplePlaylists = [
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
  ];

  const alertApi: Partial<AlertApi> = { post: jest.fn() };
  const playlistApi: Partial<PlaylistApi> = {
    addPlaylistEntities: jest.fn().mockImplementation(async () => {}),
    createPlaylist: jest.fn().mockImplementation(async () => '123'),
    getAllPlaylists: jest.fn().mockImplementation(async () => samplePlaylists),
  };
  const mockAuthorize = jest
    .fn()
    .mockImplementation(async () => ({ result: AuthorizeResult.ALLOW }));
  const permissionApi: Partial<PermissionApi> = { authorize: mockAuthorize };
  const mockEntity = {
    kind: 'component',
    metadata: { name: 'mock' },
  } as Entity;

  const mockOnClose = jest.fn();

  // SWR used by the usePermission hook needs cache to be reset for each test
  const render = async () =>
    renderInTestApp(
      <SWRConfig value={{ provider: () => new Map() }}>
        <TestApiProvider
          apis={[
            [alertApiRef, alertApi],
            [permissionApiRef, permissionApi],
            [playlistApiRef, playlistApi],
          ]}
        >
          <EntityProvider entity={mockEntity}>
            <EntityPlaylistDialog open onClose={mockOnClose} />
          </EntityProvider>
        </TestApiProvider>
        ,
      </SWRConfig>,
      { mountedRoutes: { '/playlists': rootRouteRef } },
    );

  beforeEach(() => {
    mockAuthorize.mockClear();
    mockOnClose.mockClear();
    navigateMock.mockClear();
  });

  it('list available playlists', async () => {
    const rendered = await render();
    expect(rendered.getByText('Create new playlist')).toBeInTheDocument();
    expect(rendered.getByText('playlist-1')).toBeInTheDocument();
    expect(rendered.getByText('playlist-2')).toBeInTheDocument();
  });

  it('should not show a create playlist option if unauthorized', async () => {
    mockAuthorize.mockImplementationOnce(async () => ({
      result: AuthorizeResult.DENY,
    }));
    const rendered = await render();
    expect(rendered.queryByText('Create new playlist')).toBeNull();
  });

  it('filters playlists via search text', async () => {
    const rendered = await render();

    expect(rendered.getByText('playlist-1')).toBeInTheDocument();
    expect(rendered.getByText('playlist-2')).toBeInTheDocument();

    act(() => {
      fireEvent.input(
        getByRole(
          rendered.getByTestId('entity-playlist-dialog-search'),
          'textbox',
        ),
        {
          target: {
            value: 'playlist-2',
          },
        },
      );
    });

    expect(rendered.queryByText('playlist-1')).toBeNull();
    expect(rendered.getByText('playlist-2')).toBeInTheDocument();
  });

  it('should add the current entity to the selected playlist', async () => {
    const rendered = await render();

    act(() => {
      fireEvent.click(rendered.getByText('playlist-2'));
    });

    await waitFor(() => {
      expect(playlistApi.addPlaylistEntities).toHaveBeenCalledWith('id2', [
        'component:default/mock',
      ]);
      expect(mockOnClose).toHaveBeenCalled();
      expect(alertApi.post).toHaveBeenCalledWith({
        message: 'Entity added to playlist-2',
        severity: 'success',
      });
    });
  });

  it('should open PlaylistEditDialog to create a new playlist with the current entity', async () => {
    const rendered = await render();

    expect(rendered.queryByTestId('mock-playlist-edit-dialog')).toBeNull();

    act(() => {
      fireEvent.click(rendered.getByText('Create new playlist'));
    });

    expect(
      rendered.getByTestId('mock-playlist-edit-dialog'),
    ).toBeInTheDocument();

    act(() => {
      fireEvent.click(rendered.getByTestId('mock-playlist-edit-dialog'));
    });

    await waitFor(() => {
      expect(playlistApi.createPlaylist).toHaveBeenCalled();
      expect(playlistApi.addPlaylistEntities).toHaveBeenCalledWith('123', [
        'component:default/mock',
      ]);
      expect(navigateMock).toHaveBeenCalledWith('/playlists/123');
    });
  });
});
