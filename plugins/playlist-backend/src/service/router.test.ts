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

import {
  DatabaseManager,
  getVoidLogger,
  PluginEndpointDiscovery,
} from '@backstage/backend-common';
import { ConfigReader } from '@backstage/config';
import { IdentityApi } from '@backstage/plugin-auth-node';
import { AuthorizeResult } from '@backstage/plugin-permission-common';
import { permissions } from '@backstage/plugin-playlist-common';
import express from 'express';
import request from 'supertest';

import { createRouter } from './router';

const sampleEntities = [
  {
    kind: 'system',
    metadata: {
      namespace: 'default',
      name: 'test-ent-system',
      title: 'Test Ent',
      description: 'test ent description',
    },
  },
  {
    kind: 'component',
    metadata: {
      namespace: 'default',
      name: 'test-ent',
      title: 'Test Ent 2',
      description: 'test ent description 2',
    },
    spec: {
      type: 'library',
    },
  },
];
const mockGetEntties = jest
  .fn()
  .mockImplementation(async () => ({ items: sampleEntities }));
jest.mock('@backstage/catalog-client', () => ({
  CatalogClient: jest
    .fn()
    .mockImplementation(() => ({ getEntities: mockGetEntties })),
}));

jest.mock('@backstage/plugin-auth-node', () => ({
  getBearerTokenFromAuthorizationHeader: () => 'token',
}));

const mockConditionFilter = { key: 'test', values: ['test-val'] };
jest.mock('../permissions', () => ({
  ...jest.requireActual('../permissions'),
  transformConditions: () => mockConditionFilter,
}));

const mockPlaylist = {
  id: 'playlist-id',
  name: 'test-playlist',
  owner: 'group:default/owner',
  public: true,
  entities: 2,
  followers: 4,
  isFollowing: false,
};

const mockEntities = [
  'component:default/test-ent',
  'system:default/test-ent-system',
];

const mockDbHandler = {
  listPlaylists: jest.fn().mockImplementation(async () => [mockPlaylist]),
  createPlaylist: jest.fn().mockImplementation(async () => 'playlist-id'),
  getPlaylist: jest.fn().mockImplementation(async () => mockPlaylist),
  updatePlaylist: jest.fn().mockImplementation(async () => {}),
  deletePlaylist: jest.fn().mockImplementation(async () => {}),
  addPlaylistEntities: jest.fn().mockImplementation(async () => {}),
  getPlaylistEntities: jest.fn().mockImplementation(async () => mockEntities),
  removePlaylistEntities: jest.fn().mockImplementation(async () => {}),
  followPlaylist: jest.fn().mockImplementation(async () => {}),
  unfollowPlaylist: jest.fn().mockImplementation(async () => {}),
};

jest.mock('./DatabaseHandler', () => ({
  DatabaseHandler: { create: async () => mockDbHandler },
}));

describe('createRouter', () => {
  let app: express.Express;

  const createDatabase = () =>
    DatabaseManager.fromConfig(
      new ConfigReader({
        backend: {
          database: {
            client: 'better-sqlite3',
            connection: ':memory:',
          },
        },
      }),
    ).forPlugin('playlist');

  const mockedAuthorize = jest
    .fn()
    .mockImplementation(async () => [{ result: AuthorizeResult.ALLOW }]);
  const mockedAuthorizeConditional = jest
    .fn()
    .mockImplementation(async () => [{ result: AuthorizeResult.ALLOW }]);
  const mockPermissionEvaluator = {
    authorize: mockedAuthorize,
    authorizeConditional: mockedAuthorizeConditional,
  };

  const mockUser = {
    type: 'user',
    ownershipEntityRefs: ['user:default/me', 'group:default/owner'],
    userEntityRef: 'user:default/me',
  };
  const mockIdentityClient = {
    getIdentity: jest
      .fn()
      .mockImplementation(async () => ({ identity: mockUser })),
  } as unknown as IdentityApi;

  const discovery: jest.Mocked<PluginEndpointDiscovery> = {
    getBaseUrl: jest.fn(),
    getExternalBaseUrl: jest.fn(),
  };

  beforeEach(async () => {
    const router = await createRouter({
      database: createDatabase(),
      discovery,
      identity: mockIdentityClient,
      logger: getVoidLogger(),
      permissions: mockPermissionEvaluator,
    });

    app = express().use(router);
    jest.clearAllMocks();
  });

  describe('GET /', () => {
    const mockRequestFilter = {
      anyOf: [
        { allOf: [{ key: 'mock', values: ['test'] }] },
        { allOf: [{ key: 'foo', values: ['bar'] }] },
      ],
    };

    it('should respond correctly if unauthorized', async () => {
      mockedAuthorizeConditional.mockImplementationOnce(async () => [
        { result: AuthorizeResult.DENY },
      ]);
      const response = await request(app).get('/').send();

      expect(mockedAuthorizeConditional).toHaveBeenCalledWith(
        [{ permission: permissions.playlistListRead }],
        { token: 'token' },
      );
      expect(mockDbHandler.listPlaylists).not.toHaveBeenCalled();
      expect(response.status).toEqual(403);
    });

    it('should get playlists correctly', async () => {
      let response = await request(app).get('/').send();
      expect(mockDbHandler.listPlaylists).toHaveBeenLastCalledWith(
        mockUser,
        undefined,
      );
      expect(response.status).toEqual(200);
      expect(response.body).toEqual([mockPlaylist]);

      mockedAuthorizeConditional.mockImplementationOnce(async () => [
        { result: AuthorizeResult.CONDITIONAL },
      ]);
      response = await request(app).get('/').send();
      expect(mockDbHandler.listPlaylists).toHaveBeenLastCalledWith(
        mockUser,
        mockConditionFilter,
      );
      expect(response.status).toEqual(200);
      expect(response.body).toEqual([mockPlaylist]);
    });

    it('should get filtered playlists correctly', async () => {
      let response = await request(app)
        .get('/?filter=mock=test&filter=foo=bar')
        .send();
      expect(mockDbHandler.listPlaylists).toHaveBeenLastCalledWith(
        mockUser,
        mockRequestFilter,
      );
      expect(response.status).toEqual(200);
      expect(response.body).toEqual([mockPlaylist]);

      mockedAuthorizeConditional.mockImplementationOnce(async () => [
        { result: AuthorizeResult.CONDITIONAL },
      ]);
      response = await request(app)
        .get('/?filter=mock=test&filter=foo=bar')
        .send();
      expect(mockDbHandler.listPlaylists).toHaveBeenLastCalledWith(mockUser, {
        allOf: [mockRequestFilter, mockConditionFilter],
      });
      expect(response.status).toEqual(200);
      expect(response.body).toEqual([mockPlaylist]);
    });

    it('should get editable playlists correctly', async () => {
      let response = await request(app).get('/?editable=true').send();
      expect(mockedAuthorizeConditional).toHaveBeenCalledWith(
        [{ permission: permissions.playlistListUpdate }],
        { token: 'token' },
      );
      expect(mockDbHandler.listPlaylists).toHaveBeenLastCalledWith(
        mockUser,
        undefined,
      );
      expect(response.status).toEqual(200);
      expect(response.body).toEqual([mockPlaylist]);

      response = await request(app)
        .get('/?editable=true&filter=mock=test&filter=foo=bar')
        .send();
      expect(mockDbHandler.listPlaylists).toHaveBeenLastCalledWith(
        mockUser,
        mockRequestFilter,
      );
      expect(response.status).toEqual(200);
      expect(response.body).toEqual([mockPlaylist]);

      mockedAuthorizeConditional.mockImplementation(async () => [
        { result: AuthorizeResult.CONDITIONAL },
      ]);
      response = await request(app).get('/?editable=true').send();
      expect(mockDbHandler.listPlaylists).toHaveBeenLastCalledWith(mockUser, {
        allOf: [mockConditionFilter, mockConditionFilter],
      });
      expect(response.status).toEqual(200);
      expect(response.body).toEqual([mockPlaylist]);

      mockedAuthorizeConditional.mockImplementation(async () => [
        { result: AuthorizeResult.CONDITIONAL },
      ]);
      response = await request(app)
        .get('/?editable=true&filter=mock=test&filter=foo=bar')
        .send();
      expect(mockDbHandler.listPlaylists).toHaveBeenLastCalledWith(mockUser, {
        allOf: [
          { allOf: [mockRequestFilter, mockConditionFilter] },
          mockConditionFilter,
        ],
      });
      expect(response.status).toEqual(200);
      expect(response.body).toEqual([mockPlaylist]);
    });
  });

  describe('POST /', () => {
    const body = { name: 'new-playlist' };

    it('should respond correctly if unauthorized', async () => {
      mockedAuthorize.mockImplementationOnce(async () => [
        { result: AuthorizeResult.DENY },
      ]);
      const response = await request(app).post('/').send(body);

      expect(mockedAuthorize).toHaveBeenCalledWith(
        [{ permission: permissions.playlistListCreate }],
        { token: 'token' },
      );
      expect(mockDbHandler.createPlaylist).not.toHaveBeenCalled();
      expect(response.status).toEqual(403);
    });

    it('should create a playlist correctly', async () => {
      const response = await request(app).post('/').send(body);
      expect(mockDbHandler.createPlaylist).toHaveBeenCalledWith(body);
      expect(response.status).toEqual(201);
      expect(response.body).toEqual('playlist-id');
    });
  });

  describe('GET /:playlistId', () => {
    it('should respond correctly if unauthorized', async () => {
      mockedAuthorize.mockImplementationOnce(async () => [
        { result: AuthorizeResult.DENY },
      ]);
      const response = await request(app).get('/playlist-id').send();

      expect(mockedAuthorize).toHaveBeenCalledWith(
        [
          {
            permission: permissions.playlistListRead,
            resourceRef: 'playlist-id',
          },
        ],
        { token: 'token' },
      );
      expect(mockDbHandler.getPlaylist).not.toHaveBeenCalled();
      expect(response.status).toEqual(403);
    });

    it('should get a playlist correctly', async () => {
      const response = await request(app).get('/playlist-id').send();
      expect(mockDbHandler.getPlaylist).toHaveBeenCalledWith(
        'playlist-id',
        mockUser,
      );
      expect(response.status).toEqual(200);
      expect(response.body).toEqual(mockPlaylist);
    });
  });

  describe('PUT /:playlistId', () => {
    it('should respond correctly if unauthorized', async () => {
      mockedAuthorize.mockImplementationOnce(async () => [
        { result: AuthorizeResult.DENY },
      ]);
      const response = await request(app)
        .put('/playlist-id')
        .send(mockPlaylist);

      expect(mockedAuthorize).toHaveBeenCalledWith(
        [
          {
            permission: permissions.playlistListUpdate,
            resourceRef: 'playlist-id',
          },
        ],
        { token: 'token' },
      );
      expect(mockDbHandler.updatePlaylist).not.toHaveBeenCalled();
      expect(response.status).toEqual(403);
    });

    it('should update a playlist correctly', async () => {
      const response = await request(app)
        .put('/playlist-id')
        .send(mockPlaylist);
      expect(mockDbHandler.updatePlaylist).toHaveBeenCalledWith(mockPlaylist);
      expect(response.status).toEqual(200);
    });
  });

  describe('DELETE /:playlistId', () => {
    it('should respond correctly if unauthorized', async () => {
      mockedAuthorize.mockImplementationOnce(async () => [
        { result: AuthorizeResult.DENY },
      ]);
      const response = await request(app).delete('/playlist-id').send();

      expect(mockedAuthorize).toHaveBeenCalledWith(
        [
          {
            permission: permissions.playlistListDelete,
            resourceRef: 'playlist-id',
          },
        ],
        { token: 'token' },
      );
      expect(mockDbHandler.deletePlaylist).not.toHaveBeenCalled();
      expect(response.status).toEqual(403);
    });

    it('should delete a playlist correctly', async () => {
      const response = await request(app).delete('/playlist-id').send();
      expect(mockDbHandler.deletePlaylist).toHaveBeenCalledWith('playlist-id');
      expect(response.status).toEqual(200);
    });
  });

  describe('POST /:playlistId/entities', () => {
    it('should respond correctly if unauthorized', async () => {
      mockedAuthorize.mockImplementationOnce(async () => [
        { result: AuthorizeResult.DENY },
      ]);
      const response = await request(app)
        .post('/playlist-id/entities')
        .send(['component:default/test-ent']);

      expect(mockedAuthorize).toHaveBeenCalledWith(
        [
          {
            permission: permissions.playlistListUpdate,
            resourceRef: 'playlist-id',
          },
        ],
        { token: 'token' },
      );
      expect(mockDbHandler.addPlaylistEntities).not.toHaveBeenCalled();
      expect(response.status).toEqual(403);
    });

    it('should add entities to a playlist correctly', async () => {
      const response = await request(app)
        .post('/playlist-id/entities')
        .send(mockEntities);
      expect(mockDbHandler.addPlaylistEntities).toHaveBeenCalledWith(
        'playlist-id',
        mockEntities,
      );
      expect(response.status).toEqual(200);
    });
  });

  describe('GET /:playlistId/entities', () => {
    it('should respond correctly if unauthorized', async () => {
      mockedAuthorize.mockImplementationOnce(async () => [
        { result: AuthorizeResult.DENY },
      ]);
      const response = await request(app).get('/playlist-id/entities').send();

      expect(mockedAuthorize).toHaveBeenCalledWith(
        [
          {
            permission: permissions.playlistListRead,
            resourceRef: 'playlist-id',
          },
        ],
        { token: 'token' },
      );
      expect(mockDbHandler.getPlaylistEntities).not.toHaveBeenCalled();
      expect(mockGetEntties).not.toHaveBeenCalled();
      expect(response.status).toEqual(403);
    });

    it('should get entities from a playlist correctly', async () => {
      const response = await request(app).get('/playlist-id/entities').send();
      expect(mockDbHandler.getPlaylistEntities).toHaveBeenCalledWith(
        'playlist-id',
      );
      expect(mockGetEntties).toHaveBeenCalledWith(
        {
          filter: [
            {
              kind: 'component',
              'metadata.namespace': 'default',
              'metadata.name': 'test-ent',
            },
            {
              kind: 'system',
              'metadata.namespace': 'default',
              'metadata.name': 'test-ent-system',
            },
          ],
        },
        { token: 'token' },
      );
      expect(response.status).toEqual(200);
      expect(response.body).toEqual(sampleEntities);
    });
  });

  describe('DELETE /:playlistId/entities', () => {
    it('should respond correctly if unauthorized', async () => {
      mockedAuthorize.mockImplementationOnce(async () => [
        { result: AuthorizeResult.DENY },
      ]);
      const response = await request(app)
        .delete('/playlist-id/entities')
        .send(mockEntities);

      expect(mockedAuthorize).toHaveBeenCalledWith(
        [
          {
            permission: permissions.playlistListUpdate,
            resourceRef: 'playlist-id',
          },
        ],
        { token: 'token' },
      );
      expect(mockDbHandler.removePlaylistEntities).not.toHaveBeenCalled();
      expect(response.status).toEqual(403);
    });

    it('should delete entities from a playlist correctly', async () => {
      const response = await request(app)
        .delete('/playlist-id/entities')
        .send(mockEntities);
      expect(mockDbHandler.removePlaylistEntities).toHaveBeenCalledWith(
        'playlist-id',
        mockEntities,
      );
      expect(response.status).toEqual(200);
    });
  });

  describe('POST /:playlistId/followers', () => {
    it('should respond correctly if unauthorized', async () => {
      mockedAuthorize.mockImplementationOnce(async () => [
        { result: AuthorizeResult.DENY },
      ]);
      const response = await request(app).post('/playlist-id/followers').send();

      expect(mockedAuthorize).toHaveBeenCalledWith(
        [
          {
            permission: permissions.playlistFollowersUpdate,
            resourceRef: 'playlist-id',
          },
        ],
        { token: 'token' },
      );
      expect(mockDbHandler.followPlaylist).not.toHaveBeenCalled();
      expect(response.status).toEqual(403);
    });

    it('should follow a playlist correctly', async () => {
      const response = await request(app).post('/playlist-id/followers').send();
      expect(mockDbHandler.followPlaylist).toHaveBeenCalledWith(
        'playlist-id',
        mockUser,
      );
      expect(response.status).toEqual(200);
    });
  });

  describe('DELETE /:playlistId/followers', () => {
    it('should respond correctly if unauthorized', async () => {
      mockedAuthorize.mockImplementationOnce(async () => [
        { result: AuthorizeResult.DENY },
      ]);
      const response = await request(app)
        .delete('/playlist-id/followers')
        .send();

      expect(mockedAuthorize).toHaveBeenCalledWith(
        [
          {
            permission: permissions.playlistFollowersUpdate,
            resourceRef: 'playlist-id',
          },
        ],
        { token: 'token' },
      );
      expect(mockDbHandler.unfollowPlaylist).not.toHaveBeenCalled();
      expect(response.status).toEqual(403);
    });

    it('should unfollow a playlist correctly', async () => {
      const response = await request(app)
        .delete('/playlist-id/followers')
        .send();
      expect(mockDbHandler.unfollowPlaylist).toHaveBeenCalledWith(
        'playlist-id',
        mockUser,
      );
      expect(response.status).toEqual(200);
    });
  });
});
