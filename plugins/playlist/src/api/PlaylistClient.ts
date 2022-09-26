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
import { DiscoveryApi, FetchApi } from '@backstage/core-plugin-api';
import { ResponseError } from '@backstage/errors';
import { Playlist, PlaylistMetadata } from '@backstage/plugin-playlist-common';

import { GetAllPlaylistsRequest, PlaylistApi } from './PlaylistApi';

/**
 * @public
 */
export class PlaylistClient implements PlaylistApi {
  private readonly discoveryApi: DiscoveryApi;
  private readonly fetchApi: FetchApi;

  constructor(options: { discoveryApi: DiscoveryApi; fetchApi: FetchApi }) {
    this.discoveryApi = options.discoveryApi;
    this.fetchApi = options.fetchApi;
  }

  async getAllPlaylists(req: GetAllPlaylistsRequest = {}): Promise<Playlist[]> {
    const { filter = [], editable } = req;
    const params: string[] = [];

    // the "outer array" defined by `filter` occurrences corresponds to "anyOf" filters
    // the "inner array" defined within a `filter` param corresponds to "allOf" filters
    for (const filterItem of [filter].flat()) {
      const filterParts: string[] = [];
      for (const [key, value] of Object.entries(filterItem)) {
        for (const v of [value].flat()) {
          if (typeof v === 'string') {
            filterParts.push(
              `${encodeURIComponent(key)}=${encodeURIComponent(v)}`,
            );
          }
        }
      }

      if (filterParts.length) {
        params.push(`filter=${filterParts.join(',')}`);
      }
    }

    if (editable) {
      params.push('editable=true');
    }

    const query = params.length ? `?${params.join('&')}` : '';
    const baseUrl = await this.discoveryApi.getBaseUrl('playlist');
    const resp = await this.fetchApi.fetch(`${baseUrl}/${query}`, {
      method: 'GET',
    });

    if (!resp.ok) {
      throw await ResponseError.fromResponse(resp);
    }

    return await resp.json();
  }

  async createPlaylist(
    playlist: Omit<PlaylistMetadata, 'id'>,
  ): Promise<string> {
    const baseUrl = await this.discoveryApi.getBaseUrl('playlist');
    const resp = await this.fetchApi.fetch(`${baseUrl}/`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify(playlist),
    });

    if (!resp.ok) {
      throw await ResponseError.fromResponse(resp);
    }

    return await resp.json();
  }

  async getPlaylist(playlistId: string): Promise<Playlist> {
    const baseUrl = await this.discoveryApi.getBaseUrl('playlist');
    const resp = await this.fetchApi.fetch(`${baseUrl}/${playlistId}`, {
      method: 'GET',
    });

    if (!resp.ok) {
      throw await ResponseError.fromResponse(resp);
    }

    return await resp.json();
  }

  async updatePlaylist(playlist: PlaylistMetadata) {
    const baseUrl = await this.discoveryApi.getBaseUrl('playlist');
    const resp = await this.fetchApi.fetch(`${baseUrl}/${playlist.id}`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'PUT',
      body: JSON.stringify(playlist),
    });

    if (!resp.ok) {
      throw await ResponseError.fromResponse(resp);
    }
  }

  async deletePlaylist(playlistId: string) {
    const baseUrl = await this.discoveryApi.getBaseUrl('playlist');
    const resp = await this.fetchApi.fetch(`${baseUrl}/${playlistId}`, {
      method: 'DELETE',
    });

    if (!resp.ok) {
      throw await ResponseError.fromResponse(resp);
    }
  }

  async addPlaylistEntities(playlistId: string, entityRefs: string[]) {
    const baseUrl = await this.discoveryApi.getBaseUrl('playlist');
    const resp = await this.fetchApi.fetch(
      `${baseUrl}/${playlistId}/entities`,
      {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify(entityRefs),
      },
    );

    if (!resp.ok) {
      throw await ResponseError.fromResponse(resp);
    }
  }

  async getPlaylistEntities(playlistId: string): Promise<Entity[]> {
    const baseUrl = await this.discoveryApi.getBaseUrl('playlist');
    const resp = await this.fetchApi.fetch(
      `${baseUrl}/${playlistId}/entities`,
      { method: 'GET' },
    );

    if (!resp.ok) {
      throw await ResponseError.fromResponse(resp);
    }

    return await resp.json();
  }

  async removePlaylistEntities(playlistId: string, entityRefs: string[]) {
    const baseUrl = await this.discoveryApi.getBaseUrl('playlist');
    const resp = await this.fetchApi.fetch(
      `${baseUrl}/${playlistId}/entities`,
      {
        headers: { 'Content-Type': 'application/json' },
        method: 'DELETE',
        body: JSON.stringify(entityRefs),
      },
    );

    if (!resp.ok) {
      throw await ResponseError.fromResponse(resp);
    }
  }

  async followPlaylist(playlistId: string) {
    const baseUrl = await this.discoveryApi.getBaseUrl('playlist');
    const resp = await this.fetchApi.fetch(
      `${baseUrl}/${playlistId}/followers`,
      { method: 'POST' },
    );

    if (!resp.ok) {
      throw await ResponseError.fromResponse(resp);
    }
  }

  async unfollowPlaylist(playlistId: string) {
    const baseUrl = await this.discoveryApi.getBaseUrl('playlist');
    const resp = await this.fetchApi.fetch(
      `${baseUrl}/${playlistId}/followers`,
      { method: 'DELETE' },
    );

    if (!resp.ok) {
      throw await ResponseError.fromResponse(resp);
    }
  }
}
