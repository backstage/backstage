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

import { DatabaseHandler } from './DatabaseHandler';
import { TestDatabaseId, TestDatabases } from '@backstage/backend-test-utils';
import { BackstageUserIdentity } from '@backstage/plugin-auth-node';
import { Knex } from 'knex';
import { v4 as uuid } from 'uuid';

describe('DatabaseHandler', () => {
  const databases = TestDatabases.create();

  async function createDatabaseHandler(databaseId: TestDatabaseId) {
    const knex = await databases.init(databaseId);
    return {
      knex,
      dbHandler: await DatabaseHandler.create({ database: knex }),
    };
  }

  describe.each(databases.eachSupportedId())(
    '%p',
    databaseId => {
      let knex: Knex;
      let dbHandler: DatabaseHandler;
      const playlist1Id = uuid();
      const playlist2Id = uuid();
      const playlist3Id = uuid();
      const user: BackstageUserIdentity = {
        type: 'user',
        userEntityRef: 'user:default/foo',
        ownershipEntityRefs: ['user:default/foo', 'group:default/foo-group'],
      };

      beforeEach(async () => {
        ({ knex, dbHandler } = await createDatabaseHandler(databaseId));
        await knex('playlists').insert([
          {
            id: playlist1Id,
            name: 'test',
            description: 'test description',
            owner: 'user:default/foo',
            public: true,
          },
          {
            id: playlist2Id,
            name: 'test 2',
            description: 'test description 2',
            owner: 'group:default/foo-group',
            public: false,
          },
          {
            id: playlist3Id,
            name: 'test 3',
            description: 'test description 3',
            owner: 'user:default/bar',
            public: false,
          },
        ]);

        await knex('entities').insert([
          {
            playlist_id: playlist1Id,
            entity_ref: 'component:default/ent0',
          },
          {
            playlist_id: playlist1Id,
            entity_ref: 'component:default/ent1',
          },
          {
            playlist_id: playlist1Id,
            entity_ref: 'component:default/ent2',
          },
          {
            playlist_id: playlist2Id,
            entity_ref: 'component:default/ent1',
          },
        ]);

        await knex('followers').insert([
          {
            playlist_id: playlist2Id,
            user_ref: 'user:default/some-user',
          },
          {
            playlist_id: playlist2Id,
            user_ref: 'user:default/bar',
          },
          {
            playlist_id: playlist2Id,
            user_ref: 'user:default/foo',
          },
          {
            playlist_id: playlist3Id,
            user_ref: 'user:default/foo',
          },
        ]);
      }, 30000);

      it('listPlaylists', async () => {
        const allPlaylists = [
          {
            id: playlist1Id,
            name: 'test',
            description: 'test description',
            owner: 'user:default/foo',
            public: true,
            entities: 3,
            followers: 0,
            isFollowing: false,
          },
          {
            id: playlist2Id,
            name: 'test 2',
            description: 'test description 2',
            owner: 'group:default/foo-group',
            public: false,
            entities: 1,
            followers: 3,
            isFollowing: true,
          },
          {
            id: playlist3Id,
            name: 'test 3',
            description: 'test description 3',
            owner: 'user:default/bar',
            public: false,
            entities: 0,
            followers: 1,
            isFollowing: true,
          },
        ];

        const playlists = await dbHandler.listPlaylists(user);
        expect(playlists.length).toEqual(3);
        expect(playlists).toEqual(expect.arrayContaining(allPlaylists));

        const followedPlaylists = await dbHandler.listPlaylists(user, {
          key: 'public',
          values: [true],
        });
        expect(followedPlaylists).toEqual([allPlaylists[0]]);

        const ownedPlaylists = await dbHandler.listPlaylists(user, {
          key: 'owner',
          values: user.ownershipEntityRefs,
        });
        expect(ownedPlaylists.length).toEqual(2);
        expect(ownedPlaylists).toEqual(
          expect.arrayContaining([allPlaylists[0], allPlaylists[1]]),
        );
      });

      it('createPlaylist', async () => {
        const newList = {
          name: 'new list',
          description: 'new description',
          owner: 'user:default/new',
          public: true,
        };

        const newPlaylistId = await dbHandler.createPlaylist(newList);

        const newPlaylist = await knex('playlists').where('id', newPlaylistId);
        expect(
          newPlaylist.map(list => ({ ...list, public: Boolean(list.public) })),
        ).toEqual([
          {
            ...newList,
            id: newPlaylistId,
          },
        ]);
      });

      it('getPlaylist', async () => {
        const playlist = await dbHandler.getPlaylist(playlist1Id, user);
        expect(playlist).toEqual({
          id: playlist1Id,
          name: 'test',
          description: 'test description',
          owner: 'user:default/foo',
          public: true,
          entities: 3,
          followers: 0,
          isFollowing: false,
        });
      });

      it('updatePlaylist', async () => {
        const update = {
          id: playlist1Id,
          name: 'test rename',
          description: 'test new description',
          owner: 'user:default/new-foo',
          public: false,
        };
        await dbHandler.updatePlaylist(update);

        const updatedPlaylist = await knex('playlists').where(
          'id',
          playlist1Id,
        );
        expect(
          updatedPlaylist.map(list => ({
            ...list,
            public: Boolean(list.public),
          })),
        ).toEqual([update]);
      });

      it('deletePlaylist', async () => {
        await dbHandler.deletePlaylist(playlist1Id);
        const deleted = await knex('playlists').where('id', playlist1Id);
        expect(deleted.length).toEqual(0);
      });

      it('addPlaylistEntities', async () => {
        await dbHandler.addPlaylistEntities(playlist1Id, [
          'component:default/ent1',
          'component:default/ent3',
          'component:default/ent4',
        ]);

        const entities = await knex('entities').where(
          'playlist_id',
          playlist1Id,
        );
        expect(entities.length).toEqual(5);
        expect(entities).toEqual(
          expect.arrayContaining([
            {
              playlist_id: playlist1Id,
              entity_ref: 'component:default/ent0',
            },
            {
              playlist_id: playlist1Id,
              entity_ref: 'component:default/ent1',
            },
            {
              playlist_id: playlist1Id,
              entity_ref: 'component:default/ent2',
            },
            {
              playlist_id: playlist1Id,
              entity_ref: 'component:default/ent3',
            },
            {
              playlist_id: playlist1Id,
              entity_ref: 'component:default/ent4',
            },
          ]),
        );
      });

      it('getPlaylistEntities', async () => {
        const entities = await dbHandler.getPlaylistEntities(playlist1Id);
        expect(entities.length).toEqual(3);
        expect(entities).toEqual(
          expect.arrayContaining([
            'component:default/ent0',
            'component:default/ent1',
            'component:default/ent2',
          ]),
        );
      });

      it('removePlaylistEntities', async () => {
        await dbHandler.removePlaylistEntities(playlist1Id, [
          'component:default/ent1',
          'component:default/ent2',
        ]);

        const entities = await knex('entities').where(
          'playlist_id',
          playlist1Id,
        );
        expect(entities).toEqual([
          {
            playlist_id: playlist1Id,
            entity_ref: 'component:default/ent0',
          },
        ]);
      });

      it('followPlaylist', async () => {
        await dbHandler.followPlaylist(playlist1Id, user);

        const playlist1Followers = await knex('followers').where(
          'playlist_id',
          playlist1Id,
        );
        expect(playlist1Followers).toEqual([
          {
            playlist_id: playlist1Id,
            user_ref: 'user:default/foo',
          },
        ]);

        await dbHandler.followPlaylist(playlist3Id, user);

        const playlist3Followers = await knex('followers').where(
          'playlist_id',
          playlist3Id,
        );
        expect(playlist3Followers).toEqual([
          {
            playlist_id: playlist3Id,
            user_ref: 'user:default/foo',
          },
        ]);
      });

      it('unfollowPlaylist', async () => {
        await dbHandler.unfollowPlaylist(playlist2Id, user);

        const followers = await knex('followers').where(
          'playlist_id',
          playlist2Id,
        );
        expect(followers).toEqual(
          expect.arrayContaining([
            {
              playlist_id: playlist2Id,
              user_ref: 'user:default/some-user',
            },
            {
              playlist_id: playlist2Id,
              user_ref: 'user:default/bar',
            },
          ]),
        );
      });
    },
    60000,
  );
});
