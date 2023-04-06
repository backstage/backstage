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
import { createApiRef } from '@backstage/core-plugin-api';
import { Playlist, PlaylistMetadata } from '@backstage/plugin-playlist-common';

/**
 * @public
 */
export const playlistApiRef = createApiRef<PlaylistApi>({
  id: 'plugin.playlist.service',
});

/**
 * @public
 */
export interface GetAllPlaylistsRequest {
  /**
   * If multiple filter sets are given as an array, then there is effectively an
   * OR between each filter set.
   *
   * Within one filter set, there is effectively an AND between the various
   * keys.
   *
   * Within one key, if there are more than one value, then there is effectively
   * an OR between them.
   */
  filter?:
    | Record<string, string | string[] | null>[]
    | Record<string, string | string[] | null>;

  // If true, will filter results that satisfies the playlist.list.update permission
  editable?: boolean;
}

/**
 * @public
 */
export interface PlaylistApi {
  getAllPlaylists(req: GetAllPlaylistsRequest): Promise<Playlist[]>;

  createPlaylist(playlist: Omit<PlaylistMetadata, 'id'>): Promise<string>;

  getPlaylist(playlistId: string): Promise<Playlist>;

  updatePlaylist(playlist: PlaylistMetadata): Promise<void>;

  deletePlaylist(playlistId: string): Promise<void>;

  addPlaylistEntities(playlistId: string, entityRefs: string[]): Promise<void>;

  getPlaylistEntities(playlistId: string): Promise<Entity[]>;

  removePlaylistEntities(
    playlistId: string,
    entityRefs: string[],
  ): Promise<void>;

  followPlaylist(playlistId: string): Promise<void>;

  unfollowPlaylist(playlistId: string): Promise<void>;
}
