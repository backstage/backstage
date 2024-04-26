/*
 * Copyright 2023 The Backstage Authors
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

import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import { AuthorizeResult } from '@backstage/plugin-permission-common';
import {
  PermissionApi,
  permissionApiRef,
} from '@backstage/plugin-permission-react';
import React from 'react';

import { PlaylistApi, playlistApiRef } from '../../api';
import { playlistRouteRef, rootRouteRef } from '../../routes';
import { DefaultPlaylistIndexPage } from './DefaultPlaylistIndexPage';

const playlistApi: Partial<PlaylistApi> = {
  getAllPlaylists: async () => [],
};

const permissionApi: Partial<PermissionApi> = {
  authorize: async () => ({ result: AuthorizeResult.ALLOW }),
};

describe('DefaultPlaylistIndexPage', () => {
  it('should render', async () => {
    const rendered = await renderInTestApp(
      <TestApiProvider
        apis={[
          [permissionApiRef, permissionApi],
          [playlistApiRef, playlistApi],
        ]}
      >
        <DefaultPlaylistIndexPage />
      </TestApiProvider>,
      {
        mountedRoutes: {
          '/playlists': rootRouteRef,
          '/playlists/:playlistId': playlistRouteRef,
        },
      },
    );
    expect(rendered.getByText('Playlists')).toBeInTheDocument();
  });
});
