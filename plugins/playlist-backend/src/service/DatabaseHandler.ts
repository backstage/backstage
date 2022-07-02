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

import { resolvePackagePath } from '@backstage/backend-common';
import { BackstageUserIdentity } from '@backstage/plugin-auth-node';
import { Playlist, PlaylistMetadata } from '@backstage/plugin-playlist-common';
import { Knex } from 'knex';
import { v4 as uuid } from 'uuid';

import {
  ListPlaylistsFilter,
  ListPlaylistsMatchFilter,
} from './ListPlaylistsFilter';

const migrationsDir = resolvePackagePath(
  '@backstage/plugin-playlist-backend',
  'migrations',
);

function isMatchFilter(
  filter: ListPlaylistsMatchFilter | ListPlaylistsFilter,
): filter is ListPlaylistsMatchFilter {
  return filter.hasOwnProperty('key');
}

function isOrFilter(
  filter: { anyOf: ListPlaylistsFilter[] } | ListPlaylistsFilter,
): filter is { anyOf: ListPlaylistsFilter[] } {
  return filter.hasOwnProperty('anyOf');
}

function isNegationFilter(
  filter: { not: ListPlaylistsFilter } | ListPlaylistsFilter,
): filter is { not: ListPlaylistsFilter } {
  return filter.hasOwnProperty('not');
}

function parseFilter(
  filter: ListPlaylistsFilter,
  query: Knex.QueryBuilder,
  db: Knex,
  negate: boolean = false,
): Knex.QueryBuilder {
  if (isMatchFilter(filter)) {
    return query.andWhere(function filterFunction() {
      if (filter.values.length === 1) {
        this.where(filter.key, negate ? '!=' : '=', filter.values[0]);
      } else {
        this.andWhere(filter.key, negate ? 'not in' : 'in', filter.values);
      }
    });
  }

  if (isNegationFilter(filter)) {
    return parseFilter(filter.not, query, db, !negate);
  }

  return query[negate ? 'andWhereNot' : 'andWhere'](function filterFunction() {
    if (isOrFilter(filter)) {
      for (const subFilter of filter.anyOf ?? []) {
        this.orWhere(subQuery => parseFilter(subFilter, subQuery, db));
      }
    } else {
      for (const subFilter of filter.allOf ?? []) {
        this.andWhere(subQuery => parseFilter(subFilter, subQuery, db));
      }
    }
  });
}

type Options = {
  database: Knex;
};

/**
 * @public
 */
export class DatabaseHandler {
  static async create(options: Options): Promise<DatabaseHandler> {
    const { database } = options;

    await database.migrate.latest({
      directory: migrationsDir,
    });

    return new DatabaseHandler(options);
  }

  private readonly database: Knex;

  private constructor(options: Options) {
    this.database = options.database;
  }

  private playlistColumns = ['id', 'name', 'description', 'owner', 'public'];

  async listPlaylists(
    user: BackstageUserIdentity,
    filter?: ListPlaylistsFilter,
  ): Promise<Playlist[]> {
    let playlistQuery = this.database<Omit<Playlist, 'isFollowing'>>(
      'playlists',
    )
      .select(
        ...this.playlistColumns,
        this.database.raw('COALESCE(entities, 0) AS entities'),
        this.database.raw('COALESCE(followers, 0) AS followers'),
      )
      .leftOuterJoin(
        this.database('entities')
          .as('e')
          .select('playlist_id')
          .count('entity_ref', { as: 'entities' })
          .groupBy('playlist_id'),
        'playlists.id',
        'e.playlist_id',
      )
      .leftOuterJoin(
        this.database('followers')
          .as('f')
          .select('playlist_id')
          .count('user_ref', { as: 'followers' })
          .groupBy('playlist_id'),
        'playlists.id',
        'f.playlist_id',
      );

    if (filter) {
      playlistQuery = parseFilter(filter, playlistQuery, this.database);
    }

    const playlists = await playlistQuery;

    const followedPlaylists = (
      await this.database('followers')
        .select('playlist_id')
        .where('user_ref', user.userEntityRef)
    ).map(follows => follows.playlist_id);

    return playlists.map(list => ({
      ...list,
      entities: Number(list.entities),
      followers: Number(list.followers),
      public: Boolean(list.public),
      isFollowing: followedPlaylists.includes(list.id),
    }));
  }

  async createPlaylist(
    playlist: Omit<PlaylistMetadata, 'id'>,
  ): Promise<string> {
    const id = uuid();
    const newPlaylist = await this.database('playlists').insert(
      {
        ...playlist,
        id,
      },
      ['id'],
    );

    // MySQL does not support returning from inserts so return generated uuid if undefined
    return newPlaylist[0].id ?? id;
  }

  async getPlaylist(
    id: string,
    user?: BackstageUserIdentity,
  ): Promise<Playlist | undefined> {
    const playlist = await this.database<Omit<Playlist, 'isFollowing'>>(
      'playlists',
    )
      .select(
        ...this.playlistColumns,
        this.database.raw('COALESCE(entities, 0) AS entities'),
        this.database.raw('COALESCE(followers, 0) AS followers'),
      )
      .where('id', id)
      .leftOuterJoin(
        this.database('entities')
          .as('e')
          .select('playlist_id')
          .count('entity_ref', { as: 'entities' })
          .groupBy('playlist_id'),
        'playlists.id',
        'e.playlist_id',
      )
      .leftOuterJoin(
        this.database('followers')
          .as('f')
          .select('playlist_id')
          .count('user_ref', { as: 'followers' })
          .groupBy('playlist_id'),
        'playlists.id',
        'f.playlist_id',
      );

    if (!playlist.length) {
      return undefined;
    }

    const followedPlaylists = user
      ? (
          await this.database('followers')
            .select('playlist_id')
            .where('user_ref', user.userEntityRef)
        ).map(follows => follows.playlist_id)
      : [];

    return {
      ...playlist[0],
      entities: Number(playlist[0].entities),
      followers: Number(playlist[0].followers),
      public: Boolean(playlist[0].public),
      isFollowing: followedPlaylists.includes(playlist[0].id),
    };
  }

  async updatePlaylist(playlist: PlaylistMetadata) {
    await this.database('playlists').where('id', playlist.id).update(playlist);
  }

  async deletePlaylist(id: string) {
    await this.database('playlists').where('id', id).del();
  }

  async addPlaylistEntities(playlistId: string, entityRefs: string[]) {
    await this.database('entities')
      .insert(
        entityRefs.map(ref => ({ playlist_id: playlistId, entity_ref: ref })),
      )
      .onConflict(['playlist_id', 'entity_ref'])
      .ignore();
  }

  async getPlaylistEntities(playlistId: string): Promise<string[]> {
    return (
      await this.database('entities')
        .select('entity_ref')
        .where('playlist_id', playlistId)
    ).map(entity => entity.entity_ref);
  }

  async removePlaylistEntities(playlistId: string, entityRefs: string[]) {
    await this.database('entities')
      .where(builder =>
        entityRefs.forEach(ref =>
          builder.orWhere({ playlist_id: playlistId, entity_ref: ref }),
        ),
      )
      .del();
  }

  async followPlaylist(playlistId: string, user: BackstageUserIdentity) {
    await this.database('followers')
      .insert({ playlist_id: playlistId, user_ref: user.userEntityRef })
      .onConflict(['playlist_id', 'user_ref'])
      .ignore();
  }

  async unfollowPlaylist(playlistId: string, user: BackstageUserIdentity) {
    await this.database('followers')
      .where({ playlist_id: playlistId, user_ref: user.userEntityRef })
      .del();
  }
}
