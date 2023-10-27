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
import { z } from 'zod';
import {
  createConditionExports,
  PermissionRuleDefinition,
} from '@backstage/plugin-permission-common';

/**
 * @public
 */
export const PLAYLIST_LIST_RESOURCE_TYPE = 'playlist-list';

// TODO: Create a helper function to set the type generics correctly
export const isOwnerDefinition: PermissionRuleDefinition<
  typeof PLAYLIST_LIST_RESOURCE_TYPE,
  { owners: string[] }
> = {
  name: 'IS_OWNER',
  description: 'Allow playlists owned by the given entity refs',
  resourceType: PLAYLIST_LIST_RESOURCE_TYPE,
  paramsSchema: z.object({
    owners: z.array(z.string()).describe('List of entity refs to match on'),
  }),
};

export const isCurrentUserAnOwnerDefinition: PermissionRuleDefinition<
  typeof PLAYLIST_LIST_RESOURCE_TYPE,
  undefined
> = {
  name: 'IS_CURRENT_USER_OWNER',
  description: 'Allow playlists owned by the given entity refs',
  resourceType: PLAYLIST_LIST_RESOURCE_TYPE,
};

export const isPublicDefinition: PermissionRuleDefinition<
  typeof PLAYLIST_LIST_RESOURCE_TYPE,
  undefined
> = {
  name: 'IS_PUBLIC',
  description: 'Allow playlists that are set as public',
  resourceType: PLAYLIST_LIST_RESOURCE_TYPE,
};

export const definitions = {
  isOwner: isOwnerDefinition,
  isCurrentUserAnOwner: isCurrentUserAnOwnerDefinition,
  isPublic: isPublicDefinition,
};

const { conditions, createConditionalDecision } = createConditionExports({
  pluginId: 'playlist',
  resourceType: PLAYLIST_LIST_RESOURCE_TYPE,
  rules: definitions,
});

export const playlistConditions = conditions;
export const createPlaylistConditionalDecision = createConditionalDecision;
