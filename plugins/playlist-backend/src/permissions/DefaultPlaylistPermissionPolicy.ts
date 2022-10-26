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
  isPermission,
  Permission,
  PolicyDecision,
} from '@backstage/plugin-permission-common';
import {
  PermissionPolicy,
  PolicyQuery,
} from '@backstage/plugin-permission-node';
import { permissions } from '@backstage/plugin-playlist-common';

import {
  createPlaylistConditionalDecision,
  playlistConditions,
} from './conditions';

/**
 * @public
 */
export const isPlaylistPermission = (permission: Permission) =>
  Object.values(permissions).some(playlistPermission =>
    isPermission(permission, playlistPermission),
  );

/**
 * Default policy for the Playlist plugin. This should be applied as a "sub-policy"
 * of your master permission policy for Playlist permission requests only.
 *
 * @public
 */
export class DefaultPlaylistPermissionPolicy implements PermissionPolicy {
  async handle(
    request: PolicyQuery,
    user?: BackstageIdentityResponse,
  ): Promise<PolicyDecision> {
    // Reject permissions we don't know how to evaluate in case this policy was incorrectly applied
    if (!isPlaylistPermission(request.permission)) {
      return { result: AuthorizeResult.DENY };
    }

    // Anyone should be allowed to create a new playlist
    if (isPermission(request.permission, permissions.playlistListCreate)) {
      return { result: AuthorizeResult.ALLOW };
    }

    // Reading and following/unfollowing playlists is allowed if it is public or owned
    if (
      isPermission(request.permission, permissions.playlistListRead) ||
      isPermission(request.permission, permissions.playlistFollowersUpdate)
    ) {
      return createPlaylistConditionalDecision(request.permission, {
        anyOf: [
          playlistConditions.isOwner({
            owners: user?.identity.ownershipEntityRefs ?? [],
          }),
          playlistConditions.isPublic(),
        ],
      });
    }

    // Updating or deleting playlists is only allowed for owners
    if (
      isPermission(request.permission, permissions.playlistListUpdate) ||
      isPermission(request.permission, permissions.playlistListDelete)
    ) {
      return createPlaylistConditionalDecision(
        request.permission,
        playlistConditions.isOwner({
          owners: user?.identity.ownershipEntityRefs ?? [],
        }),
      );
    }

    return { result: AuthorizeResult.ALLOW };
  }
}
