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
import { AuthorizeResult } from '@backstage/plugin-permission-common';
import {
  PermissionApi,
  permissionApiRef,
} from '@backstage/plugin-permission-react';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import { Button } from '@material-ui/core';
import { fireEvent, waitFor } from '@testing-library/react';
import { act } from '@testing-library/react-hooks';
import React from 'react';
import { SWRConfig } from 'swr';
import { PlaylistApi, playlistApiRef } from '../../api';
import { rootRouteRef } from '../../routes';
import { CreatePlaylistButton } from './CreatePlaylistButton';

jest.mock('../PlaylistEditDialog', () => ({
  PlaylistEditDialog: ({ onSave, open }: { onSave: Function; open: boolean }) =>
    open ? (
      <Button
        data-testid="mock-playlist-edit-dialog"
        onClick={() => onSave()}
      />
    ) : null,
}));

const navigateMock = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => navigateMock,
}));

describe('<CreatePlaylistButton/>', () => {
  const mockErrorPost = jest.fn();
  const errorApi: Partial<ErrorApi> = { post: mockErrorPost };

  const mockCreatePlaylist = jest.fn().mockImplementation(async () => '123');
  const playlistApi: Partial<PlaylistApi> = {
    createPlaylist: mockCreatePlaylist,
  };

  const mockAuthorize = jest
    .fn()
    .mockImplementation(async () => ({ result: AuthorizeResult.ALLOW }));
  const permissionApi: Partial<PermissionApi> = { authorize: mockAuthorize };

  const render = () => {
    // SWR used by the usePermission hook needs cache to be reset for each test
    return renderInTestApp(
      <SWRConfig value={{ provider: () => new Map() }}>
        <TestApiProvider
          apis={[
            [errorApiRef, errorApi],
            [permissionApiRef, permissionApi],
            [playlistApiRef, playlistApi],
          ]}
        >
          <CreatePlaylistButton />
        </TestApiProvider>
      </SWRConfig>,
      { mountedRoutes: { '/playlists': rootRouteRef } },
    );
  };

  beforeEach(() => {
    mockAuthorize.mockClear();
    mockCreatePlaylist.mockClear();
    navigateMock.mockClear();
  });

  it('should be disabled if not authorized', async () => {
    mockAuthorize.mockImplementationOnce(async () => ({
      result: AuthorizeResult.DENY,
    }));
    const rendered = await render();
    expect(rendered.getByRole('button')).toBeDisabled();
  });

  it('should open the PlaylistEditDialog when clicked', async () => {
    const rendered = await render();

    expect(rendered.getByRole('button')).not.toBeDisabled();
    expect(rendered.queryByTestId('mock-playlist-edit-dialog')).toBeNull();

    act(() => {
      fireEvent.click(rendered.getByRole('button'));
    });
    expect(
      rendered.getByTestId('mock-playlist-edit-dialog'),
    ).toBeInTheDocument();
  });

  it('should create and navigate to a new playlist on save', async () => {
    const rendered = await render();

    act(() => {
      fireEvent.click(rendered.getByRole('button'));
      fireEvent.click(rendered.getByTestId('mock-playlist-edit-dialog'));
    });

    await waitFor(() => {
      expect(mockCreatePlaylist).toHaveBeenCalled();
      expect(navigateMock).toHaveBeenCalledWith('/playlists/123');
    });
  });

  it('should post an error when save fails', async () => {
    const saveError = new Error('mock error');
    mockCreatePlaylist.mockImplementationOnce(async () => {
      throw saveError;
    });
    const rendered = await render();

    act(() => {
      fireEvent.click(rendered.getByRole('button'));
      fireEvent.click(rendered.getByTestId('mock-playlist-edit-dialog'));
    });

    await waitFor(() => {
      expect(mockCreatePlaylist).toHaveBeenCalled();
      expect(navigateMock).not.toHaveBeenCalled();
      expect(mockErrorPost).toHaveBeenCalledWith(saveError);
    });
  });
});
