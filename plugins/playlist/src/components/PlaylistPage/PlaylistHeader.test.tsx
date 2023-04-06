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

import { ErrorApi, errorApiRef } from '@backstage/core-plugin-api';
import { entityRouteRef } from '@backstage/plugin-catalog-react';
import {
  AuthorizeResult,
  isPermission,
} from '@backstage/plugin-permission-common';
import {
  PermissionApi,
  permissionApiRef,
} from '@backstage/plugin-permission-react';
import { permissions, Playlist } from '@backstage/plugin-playlist-common';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import { Button } from '@material-ui/core';
import { fireEvent, waitFor } from '@testing-library/react';
import { act } from '@testing-library/react-hooks';
import React from 'react';
import { SWRConfig } from 'swr';
import { PlaylistApi, playlistApiRef } from '../../api';
import { rootRouteRef } from '../../routes';
import { PlaylistHeader } from './PlaylistHeader';

const navigateMock = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => navigateMock,
}));

jest.mock('../PlaylistEditDialog', () => ({
  PlaylistEditDialog: ({
    onSave,
    open,
    playlist,
  }: {
    onSave: Function;
    open: boolean;
    playlist: Partial<Playlist>;
  }) =>
    open ? (
      <Button
        data-testid="mock-playlist-edit-dialog"
        onClick={() => onSave(playlist)}
      />
    ) : null,
}));

describe('PlaylistHeader', () => {
  const testPlaylist = {
    id: 'id1',
    name: 'playlist-1',
    description: 'test description',
    owner: 'group:default/some-owner',
    public: true,
    entities: 1,
    followers: 2,
    isFollowing: false,
  };

  const errorApi: Partial<ErrorApi> = { post: jest.fn() };
  const playlistApi: Partial<PlaylistApi> = {
    updatePlaylist: jest.fn().mockImplementation(async () => {}),
    deletePlaylist: jest.fn().mockImplementation(async () => {}),
  };
  const mockAuthorize = jest
    .fn()
    .mockImplementation(async () => ({ result: AuthorizeResult.ALLOW }));
  const permissionApi: Partial<PermissionApi> = { authorize: mockAuthorize };

  const mockOnUpdate = jest.fn();

  // SWR used by the usePermission hook needs cache to be reset for each test
  const element = (
    <SWRConfig value={{ provider: () => new Map() }}>
      <TestApiProvider
        apis={[
          [errorApiRef, errorApi],
          [permissionApiRef, permissionApi],
          [playlistApiRef, playlistApi],
        ]}
      >
        <PlaylistHeader playlist={testPlaylist} onUpdate={mockOnUpdate} />
      </TestApiProvider>
    </SWRConfig>
  );

  const render = async () =>
    renderInTestApp(element, {
      mountedRoutes: {
        '/playlists': rootRouteRef,
        '/catalog/:namespace/:kind/:name': entityRouteRef,
      },
    });

  beforeEach(() => {
    mockAuthorize.mockClear();
    mockOnUpdate.mockClear();
    navigateMock.mockClear();
  });

  it('show render basic playlist info', async () => {
    const rendered = await render();
    expect(rendered.getByText('playlist-1')).toBeInTheDocument();
    expect(rendered.getByText('2 followers')).toBeInTheDocument();
    expect(rendered.getByText('some-owner')).toBeInTheDocument();
    expect(rendered.queryByText('private')).toBeNull();

    testPlaylist.public = false;
    rendered.rerender(element);
    expect(rendered.getByText('private')).toBeInTheDocument();
  });

  it('has edit and delete options enabled if authorized', async () => {
    const rendered = await render();

    act(() => {
      fireEvent.click(rendered.getByTestId('header-action-menu'));
    });

    const actionItems = rendered.getAllByTestId('header-action-item');
    // .toBeDisabled() matcher doesn't seem to work with disabled header action items
    // https://github.com/testing-library/jest-dom/issues/144
    expect(
      actionItems.find(e => e.innerHTML.includes('Edit Details')),
    ).toHaveAttribute('aria-disabled', 'false');
    expect(
      actionItems.find(e => e.innerHTML.includes('Delete Playlist')),
    ).toHaveAttribute('aria-disabled', 'false');
  });

  it('has edit option disabled if not authorized', async () => {
    mockAuthorize.mockImplementation(async req => ({
      result: isPermission(req.permission, permissions.playlistListUpdate)
        ? AuthorizeResult.DENY
        : AuthorizeResult.ALLOW,
    }));

    const rendered = await render();

    act(() => {
      fireEvent.click(rendered.getByTestId('header-action-menu'));
    });

    const actionItems = rendered.getAllByTestId('header-action-item');
    expect(
      actionItems.find(e => e.innerHTML.includes('Edit Details')),
    ).toHaveAttribute('aria-disabled', 'true');
    expect(
      actionItems.find(e => e.innerHTML.includes('Delete Playlist')),
    ).toHaveAttribute('aria-disabled', 'false');
  });

  it('has delete option disabled if not authorized', async () => {
    mockAuthorize.mockImplementation(async req => ({
      result: isPermission(req.permission, permissions.playlistListDelete)
        ? AuthorizeResult.DENY
        : AuthorizeResult.ALLOW,
    }));

    const rendered = await render();

    act(() => {
      fireEvent.click(rendered.getByTestId('header-action-menu'));
    });

    const actionItems = rendered.getAllByTestId('header-action-item');
    expect(
      actionItems.find(e => e.innerHTML.includes('Edit Details')),
    ).toHaveAttribute('aria-disabled', 'false');
    expect(
      actionItems.find(e => e.innerHTML.includes('Delete Playlist')),
    ).toHaveAttribute('aria-disabled', 'true');
  });

  it('should edit the playlist with the PlaylistEditDialog', async () => {
    const rendered = await render();

    expect(rendered.queryByTestId('mock-playlist-edit-dialog')).toBeNull();

    act(() => {
      fireEvent.click(rendered.getByTestId('header-action-menu'));
      fireEvent.click(
        rendered
          .getAllByTestId('header-action-item')
          .find(e => e.innerHTML.includes('Edit Details'))!,
      );
    });

    expect(
      rendered.getByTestId('mock-playlist-edit-dialog'),
    ).toBeInTheDocument();

    act(() => {
      fireEvent.click(rendered.getByTestId('mock-playlist-edit-dialog'));
    });

    await waitFor(() => {
      expect(playlistApi.updatePlaylist).toHaveBeenCalledWith({
        id: testPlaylist.id,
        name: testPlaylist.name,
        description: testPlaylist.description,
        owner: testPlaylist.owner,
        public: testPlaylist.public,
      });
      expect(mockOnUpdate).toHaveBeenCalled();
    });
  });

  it('should handle deleting a playlist', async () => {
    const rendered = await render();

    act(() => {
      fireEvent.click(rendered.getByTestId('header-action-menu'));
      fireEvent.click(
        rendered
          .getAllByTestId('header-action-item')
          .find(e => e.innerHTML.includes('Delete Playlist'))!,
      );
      fireEvent.click(rendered.getByTestId('delete-playlist-dialog-button'));
    });

    await waitFor(() => {
      expect(playlistApi.deletePlaylist).toHaveBeenCalledWith('id1');
      expect(navigateMock).toHaveBeenCalledWith('/playlists');
    });
  });
});
