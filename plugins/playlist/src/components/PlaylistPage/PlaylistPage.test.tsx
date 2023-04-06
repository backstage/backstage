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
import { fireEvent, getByText, waitFor } from '@testing-library/react';
import { act } from '@testing-library/react-hooks';
import React from 'react';
import { SWRConfig } from 'swr';

import { PlaylistApi, playlistApiRef } from '../../api';
import { PlaylistPage } from './PlaylistPage';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ playlistId: 'id1' }),
}));

// Mock out nested components to simplify tests
jest.mock('./PlaylistEntitiesTable', () => ({
  PlaylistEntitiesTable: () => null,
}));

jest.mock('./PlaylistHeader', () => ({
  PlaylistHeader: () => null,
}));

describe('PlaylistPage', () => {
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
    getPlaylist: jest.fn().mockImplementation(async () => testPlaylist),
    followPlaylist: jest.fn().mockImplementation(async () => {}),
    unfollowPlaylist: jest.fn().mockImplementation(async () => {}),
  };
  const mockAuthorize = jest
    .fn()
    .mockImplementation(async () => ({ result: AuthorizeResult.ALLOW }));
  const permissionApi: Partial<PermissionApi> = { authorize: mockAuthorize };

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
        <PlaylistPage />
      </TestApiProvider>
    </SWRConfig>
  );

  beforeEach(() => {
    mockAuthorize.mockClear();
  });

  it('show render the playlist info', async () => {
    const rendered = await renderInTestApp(element);
    expect(playlistApi.getPlaylist).toHaveBeenCalledWith('id1');
    expect(rendered.getByText('test description')).toBeInTheDocument();
    expect(
      rendered.getByTestId('playlist-page-follow-button'),
    ).toBeInTheDocument();
    expect(
      getByText(rendered.getByTestId('playlist-page-follow-button'), 'Follow'),
    ).toBeInTheDocument();
  });

  it('should not render the follow button if unauthorized', async () => {
    mockAuthorize.mockImplementationOnce(async () => ({
      result: AuthorizeResult.DENY,
    }));
    const rendered = await renderInTestApp(element);
    expect(rendered.queryByTestId('playlist-page-follow-button')).toBeNull();
  });

  it('should reflect and toggle the following state of the playlist', async () => {
    const rendered = await renderInTestApp(element);

    act(() => {
      fireEvent.click(rendered.getByTestId('playlist-page-follow-button'));
      testPlaylist.isFollowing = true;
    });

    await waitFor(() => {
      expect(playlistApi.followPlaylist).toHaveBeenCalledWith('id1');
      expect(
        getByText(
          rendered.getByTestId('playlist-page-follow-button'),
          'Following',
        ),
      ).toBeInTheDocument();
    });

    act(() => {
      fireEvent.click(rendered.getByTestId('playlist-page-follow-button'));
      testPlaylist.isFollowing = false;
    });

    await waitFor(() => {
      expect(playlistApi.unfollowPlaylist).toHaveBeenCalledWith('id1');
      expect(
        getByText(
          rendered.getByTestId('playlist-page-follow-button'),
          'Follow',
        ),
      ).toBeInTheDocument();
    });
  });
});
