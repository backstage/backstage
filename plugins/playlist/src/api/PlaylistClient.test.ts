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

import { MockFetchApi, setupRequestMockHandlers } from '@backstage/test-utils';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

import { PlaylistClient } from './PlaylistClient';

const server = setupServer();

describe('PlaylistClient', () => {
  setupRequestMockHandlers(server);
  const mockBaseUrl = 'http://backstage/api/playlist';
  const discoveryApi = { getBaseUrl: async () => mockBaseUrl };
  const fetchApi = new MockFetchApi();

  let client: PlaylistClient;
  beforeEach(() => {
    client = new PlaylistClient({ discoveryApi, fetchApi });
  });

  describe('getAllPlaylists', () => {
    const expectedResp = [
      {
        id: 'id',
        name: 'name',
        description: 'description',
        owner: 'owner',
        public: true,
        entities: 1,
        followers: 2,
        isFollowing: true,
      },
    ];

    it('should fetch playlists from correct endpoint', async () => {
      server.use(
        rest.get(`${mockBaseUrl}/`, (_, res, ctx) =>
          res(ctx.json(expectedResp)),
        ),
      );
      const response = await client.getAllPlaylists();
      expect(response).toEqual(expectedResp);
    });

    it('should fetch editable playlists correctly', async () => {
      expect.assertions(2);

      server.use(
        rest.get(`${mockBaseUrl}/`, (req, res, ctx) => {
          expect(req.url.search).toBe('?editable=true');
          return res(ctx.json(expectedResp));
        }),
      );

      const response = await client.getAllPlaylists({ editable: true });
      expect(response).toEqual(expectedResp);
    });

    it('builds multiple search filters properly', async () => {
      expect.assertions(2);

      server.use(
        rest.get(`${mockBaseUrl}/`, (req, res, ctx) => {
          expect(req.url.search).toBe(
            '?filter=a=1,b=2,b=3,%C3%B6=%3D&filter=a=2&editable=true',
          );
          return res(ctx.json(expectedResp));
        }),
      );

      const response = await client.getAllPlaylists({
        editable: true,
        filter: [
          {
            a: '1',
            b: ['2', '3'],
            ö: '=',
          },
          {
            a: '2',
          },
        ],
      });

      expect(response).toEqual(expectedResp);
    });

    it('builds single search filter properly', async () => {
      expect.assertions(2);

      server.use(
        rest.get(`${mockBaseUrl}/`, (req, res, ctx) => {
          expect(req.url.search).toBe('?filter=a=1,b=2,b=3,%C3%B6=%3D');
          return res(ctx.json(expectedResp));
        }),
      );

      const response = await client.getAllPlaylists({
        filter: {
          a: '1',
          b: ['2', '3'],
          ö: '=',
        },
      });

      expect(response).toEqual(expectedResp);
    });
  });

  it('createPlaylist', async () => {
    expect.assertions(2);

    const newPlaylist = {
      name: 'name',
      description: 'description',
      owner: 'owner',
      public: true,
    };

    server.use(
      rest.post(`${mockBaseUrl}/`, (req, res, ctx) => {
        expect(req.body).toEqual(newPlaylist);
        return res(ctx.json('123'));
      }),
    );

    const response = await client.createPlaylist(newPlaylist);

    expect(response).toEqual('123');
  });

  it('getPlaylist', async () => {
    const playlist = {
      id: '123',
      name: 'name',
      description: 'description',
      owner: 'owner',
      public: true,
      entities: 1,
      followers: 2,
      isFollowing: true,
    };

    server.use(
      rest.get(`${mockBaseUrl}/123`, (_, res, ctx) => res(ctx.json(playlist))),
    );

    const response = await client.getPlaylist('123');
    expect(response).toEqual(playlist);
  });

  it('updatePlaylist', async () => {
    expect.assertions(1);

    const playlist = {
      id: 'id',
      name: 'name',
      description: 'description',
      owner: 'owner',
      public: true,
    };

    server.use(
      rest.put(`${mockBaseUrl}/id`, (req, res) => {
        expect(req.body).toEqual(playlist);
        return res();
      }),
    );

    await client.updatePlaylist(playlist);
  });

  it('deletePlaylist', async () => {
    expect.assertions(1);

    server.use(
      rest.delete(`${mockBaseUrl}/id`, (_, res) => {
        // eslint requires at least 1 assertion so this is here is verify this handler is called
        expect(true).toBe(true);
        return res();
      }),
    );

    await client.deletePlaylist('id');
  });

  it('addPlaylistEntities', async () => {
    expect.assertions(1);

    const entities = ['component:default/ent1', 'component:default/ent2'];

    server.use(
      rest.post(`${mockBaseUrl}/id/entities`, (req, res) => {
        expect(req.body).toEqual(entities);
        return res();
      }),
    );

    await client.addPlaylistEntities('id', entities);
  });

  it('getPlaylistEntities', async () => {
    const entities = [
      {
        kind: 'system',
        metadata: {
          namespace: 'default',
          name: 'test-ent',
          title: 'Test Ent',
          description: 'test ent description',
        },
      },
      {
        kind: 'component',
        metadata: {
          namespace: 'foo',
          name: 'test-ent2',
          title: 'Test Ent 2',
          description: 'test ent description 2',
        },
        spec: {
          type: 'library',
        },
      },
    ];

    server.use(
      rest.get(`${mockBaseUrl}/id/entities`, (_, res, ctx) =>
        res(ctx.json(entities)),
      ),
    );

    const response = await client.getPlaylistEntities('id');
    expect(response).toEqual(entities);
  });

  it('removePlaylistEntities', async () => {
    expect.assertions(1);

    const entities = ['component:default/ent1', 'component:default/ent2'];

    server.use(
      rest.delete(`${mockBaseUrl}/id/entities`, (req, res) => {
        expect(req.body).toEqual(entities);
        return res();
      }),
    );

    await client.removePlaylistEntities('id', entities);
  });

  it('followPlaylist', async () => {
    expect.assertions(1);

    server.use(
      rest.post(`${mockBaseUrl}/id/followers`, (_, res) => {
        // eslint requires at least 1 assertion so this is here is verify this handler is called
        expect(true).toBe(true);
        return res();
      }),
    );

    await client.followPlaylist('id');
  });

  it('unfollowPlaylist', async () => {
    expect.assertions(1);

    server.use(
      rest.delete(`${mockBaseUrl}/id/followers`, (_, res) => {
        // eslint requires at least 1 assertion so this is here is verify this handler is called
        expect(true).toBe(true);
        return res();
      }),
    );

    await client.unfollowPlaylist('id');
  });
});
