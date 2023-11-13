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

import { makeCreatePermissionRule } from '@backstage/plugin-permission-node';
import {
  isCurrentUserAnOwnerDefinition,
  isOwnerDefinition,
  isPublicDefinition,
  PLAYLIST_LIST_RESOURCE_TYPE,
  PlaylistMetadata,
} from '@backstage/plugin-playlist-common';

import { ListPlaylistsFilter } from '../service';

const createPlaylistPermissionRule = makeCreatePermissionRule<
  PlaylistMetadata,
  ListPlaylistsFilter,
  typeof PLAYLIST_LIST_RESOURCE_TYPE
>();

const isOwner = createPlaylistPermissionRule(isOwnerDefinition, {
  apply: (list: PlaylistMetadata, { owners }) => owners.includes(list.owner),
  toQuery: ({ owners }) => ({
    key: 'owner',
    values: owners,
  }),
});

const isCurrentUserAnOwner = createPlaylistPermissionRule(
  isCurrentUserAnOwnerDefinition,
  {
    apply: (list: PlaylistMetadata, _, identity) => {
      return !!identity?.ownershipEntityRefs?.includes(list.owner);
    },
    toQuery: (_, identity) => ({
      key: 'owner',
      values: identity?.ownershipEntityRefs ?? [],
    }),
  },
);

const isPublic = createPlaylistPermissionRule(isPublicDefinition, {
  apply: (list: PlaylistMetadata) => list.public,
  toQuery: () => ({ key: 'public', values: [true] }),
});

/**
 * @public
 */
export const rules = { isOwner, isCurrentUserAnOwner, isPublic };
