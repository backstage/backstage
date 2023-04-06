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

import { BackstageIdentityResponse } from '@backstage/plugin-auth-node';
import {
  AuthorizeResult,
  createPermission,
} from '@backstage/plugin-permission-common';
import {
  permissions,
  PLAYLIST_LIST_RESOURCE_TYPE,
} from '@backstage/plugin-playlist-common';

import { playlistConditions } from './conditions';
import { DefaultPlaylistPermissionPolicy } from './DefaultPlaylistPermissionPolicy';

describe('DefaultPlaylistPermissionPolicy', () => {
  const policy = new DefaultPlaylistPermissionPolicy();
  const mockUser: BackstageIdentityResponse = {
    token: 'token',
    identity: {
      type: 'user',
      ownershipEntityRefs: ['user:default/me', 'group:default/owner'],
      userEntityRef: 'user:default/me',
    },
  };

  it('should deny non-playlist permissions', async () => {
    const mockPermission = createPermission({
      name: 'test.permission',
      attributes: { action: 'read' },
    });

    expect(await policy.handle({ permission: mockPermission })).toEqual({
      result: AuthorizeResult.DENY,
    });
  });

  it('should allow create permissions', async () => {
    expect(
      await policy.handle({ permission: permissions.playlistListCreate }),
    ).toEqual({ result: AuthorizeResult.ALLOW });
  });

  it('should return a conditional decision for read permissions', async () => {
    expect(
      await policy.handle(
        { permission: permissions.playlistListRead },
        mockUser,
      ),
    ).toEqual({
      result: AuthorizeResult.CONDITIONAL,
      pluginId: 'playlist',
      resourceType: PLAYLIST_LIST_RESOURCE_TYPE,
      conditions: {
        anyOf: [
          playlistConditions.isOwner({
            owners: ['user:default/me', 'group:default/owner'],
          }),
          playlistConditions.isPublic(),
        ],
      },
    });
  });

  it('should return a conditional decision for followers update permissions', async () => {
    expect(
      await policy.handle(
        { permission: permissions.playlistFollowersUpdate },
        mockUser,
      ),
    ).toEqual({
      result: AuthorizeResult.CONDITIONAL,
      pluginId: 'playlist',
      resourceType: PLAYLIST_LIST_RESOURCE_TYPE,
      conditions: {
        anyOf: [
          playlistConditions.isOwner({
            owners: ['user:default/me', 'group:default/owner'],
          }),
          playlistConditions.isPublic(),
        ],
      },
    });
  });

  it('should return a conditional decision for update permissions', async () => {
    expect(
      await policy.handle(
        { permission: permissions.playlistListUpdate },
        mockUser,
      ),
    ).toEqual({
      result: AuthorizeResult.CONDITIONAL,
      pluginId: 'playlist',
      resourceType: PLAYLIST_LIST_RESOURCE_TYPE,
      conditions: playlistConditions.isOwner({
        owners: ['user:default/me', 'group:default/owner'],
      }),
    });
  });

  it('should return a conditional decision for delete permissions', async () => {
    expect(
      await policy.handle(
        { permission: permissions.playlistListDelete },
        mockUser,
      ),
    ).toEqual({
      result: AuthorizeResult.CONDITIONAL,
      pluginId: 'playlist',
      resourceType: PLAYLIST_LIST_RESOURCE_TYPE,
      conditions: playlistConditions.isOwner({
        owners: ['user:default/me', 'group:default/owner'],
      }),
    });
  });
});
