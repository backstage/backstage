/*
 * Copyright 2021 The Backstage Authors
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

import { DatabaseManager, getVoidLogger } from '@backstage/backend-common';
import {
  bazaarAddPermission,
  bazaarUpdatePermission,
  bazaarDeletePermission,
} from '@backstage/plugin-bazaar-common';
import { ConfigReader } from '@backstage/config';
import { IdentityApi } from '@backstage/plugin-auth-node';
import { AuthorizeResult } from '@backstage/plugin-permission-common';
import { createRouter } from './router';
import express from 'express';
import request from 'supertest';

jest.mock('@backstage/plugin-auth-node', () => ({
  getBearerTokenFromAuthorizationHeader: () => 'token',
}));

const mockProject = {
  id: 1,
  entity_ref: 'ref1',
  title: 'test-project',
  description: 'test',
  status: 'ongoing',
  size: 'small',
  responsible: 'abc',
};

const mockMembers = [
  {
    id: 1,
    userId: 10,
    userRef: 'user:default/me',
  },
  {
    id: 1,
    userId: 20,
    userRef: 'user:default/abc',
  },
];

const mockDbHandler = {
  getProjects: jest.fn().mockResolvedValue([mockProject]),
  getMetadataById: jest.fn().mockResolvedValue([mockProject]),
  getMetadataByRef: jest.fn().mockResolvedValue([mockProject]),
  insertMetadata: jest.fn().mockResolvedValue(null),
  updateMetadata: jest.fn().mockResolvedValue(1),
  deleteMetadata: jest.fn().mockResolvedValue(1),
  getMembers: jest.fn().mockResolvedValue(mockMembers),
  addMember: jest.fn().mockResolvedValue(null),
  deleteMember: jest.fn().mockResolvedValue(1),
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
    ).forPlugin('bazaar');

  const config = new ConfigReader({});

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

  beforeEach(async () => {
    const router = await createRouter({
      database: createDatabase(),
      identity: mockIdentityClient,
      config: config,
      logger: getVoidLogger(),
      permissions: mockPermissionEvaluator,
    });

    app = express().use(router);
    jest.clearAllMocks();
  });

  describe('GET /projects', () => {
    it('should get all projects correctly', async () => {
      let response = await request(app).get('/projects').send();
      expect(mockDbHandler.getProjects).toHaveBeenCalledWith(
        undefined,
        undefined,
      );
      expect(response.status).toEqual(200);
      expect(response.body.data).toEqual([mockProject]);

      response = await request(app)
        .get('/projects?limit=5&order=latest')
        .send();
      expect(mockDbHandler.getProjects).toHaveBeenCalledWith(5, 'latest');
      expect(response.status).toEqual(200);
      expect(response.body.data).toEqual([mockProject]);
    });
  });

  describe('GET /projects/:idOrRef', () => {
    it('should get project by ID correctly', async () => {
      const response = await request(app).get('/projects/1').send();
      expect(mockDbHandler.getMetadataById).toHaveBeenCalledWith(1);
      expect(response.status).toEqual(200);
      expect(response.body.data).toEqual([mockProject]);
    });

    it('should get project by entity ref correctly', async () => {
      const response = await request(app).get('/projects/ref1').send();
      expect(mockDbHandler.getMetadataByRef).toHaveBeenCalledWith('ref1');
      expect(response.status).toEqual(200);
      expect(response.body.data).toEqual([mockProject]);
    });
  });

  describe('POST /projects', () => {
    it('should create a project correctly', async () => {
      const response = await request(app).post('/projects').send(mockProject);
      expect(mockedAuthorize).toHaveBeenCalledWith(
        [{ permission: bazaarAddPermission }],
        { token: 'token' },
      );
      expect(mockDbHandler.insertMetadata).toHaveBeenCalledWith(mockProject);
      expect(response.status).toEqual(200);
    });

    it('should respond correctly if unauthorized', async () => {
      mockedAuthorize.mockImplementationOnce(async () => [
        { result: AuthorizeResult.DENY },
      ]);

      const response = await request(app).post('/projects').send(mockProject);
      expect(mockedAuthorize).toHaveBeenCalledWith(
        [{ permission: bazaarAddPermission }],
        { token: 'token' },
      );
      expect(mockDbHandler.insertMetadata).not.toHaveBeenCalled();
      expect(response.status).toEqual(403);
    });
  });

  describe('PUT /projects', () => {
    it('should update a project correctly', async () => {
      const response = await request(app).put('/projects').send(mockProject);
      expect(mockedAuthorize).toHaveBeenCalledWith(
        [{ permission: bazaarUpdatePermission }],
        { token: 'token' },
      );
      expect(mockDbHandler.updateMetadata).toHaveBeenCalledWith(mockProject);
      expect(response.status).toEqual(200);
    });

    it('should respond correctly if unauthorized', async () => {
      mockedAuthorize.mockImplementationOnce(async () => [
        { result: AuthorizeResult.DENY },
      ]);

      const response = await request(app).put('/projects').send(mockProject);
      expect(mockedAuthorize).toHaveBeenCalledWith(
        [{ permission: bazaarUpdatePermission }],
        { token: 'token' },
      );
      expect(mockDbHandler.updateMetadata).not.toHaveBeenCalled();
      expect(response.status).toEqual(403);
    });
  });

  describe('DELETE /projects/:id', () => {
    it('should delete a project correctly', async () => {
      const response = await request(app).delete('/projects/1').send();
      expect(mockedAuthorize).toHaveBeenCalledWith(
        [{ permission: bazaarDeletePermission }],
        { token: 'token' },
      );
      expect(mockDbHandler.deleteMetadata).toHaveBeenCalledWith(1);
      expect(response.status).toEqual(200);
    });

    it('should respond correctly if unauthorized', async () => {
      mockedAuthorize.mockImplementationOnce(async () => [
        { result: AuthorizeResult.DENY },
      ]);

      const response = await request(app).delete('/projects/1').send();
      expect(mockedAuthorize).toHaveBeenCalledWith(
        [{ permission: bazaarDeletePermission }],
        { token: 'token' },
      );
      expect(mockDbHandler.deleteMetadata).not.toHaveBeenCalled();
      expect(response.status).toEqual(403);
    });
  });

  describe('GET /projects/:id/members', () => {
    it('should get all project members correctly', async () => {
      const response = await request(app).get('/projects/1/members').send();
      expect(mockDbHandler.getMembers).toHaveBeenCalledWith('1');
      expect(response.status).toEqual(200);
      expect(response.body.data).toEqual(mockMembers);
    });
  });

  describe('PUT /projects/:id/member/:userId', () => {
    it('should add current user as project member correctly', async () => {
      const response = await request(app).put('/projects/1/member/10').send();
      expect(mockDbHandler.addMember).toHaveBeenCalledWith(
        1,
        '10',
        mockUser.userEntityRef,
        undefined,
      );
      expect(response.status).toEqual(200);
    });
  });

  describe('DELETE /projects/:id/member/:userId', () => {
    it('should delete user from project members correctly', async () => {
      const response = await request(app)
        .delete('/projects/1/member/10')
        .send();
      expect(mockDbHandler.deleteMember).toHaveBeenCalledWith(1, '10');
      expect(response.status).toEqual(200);
    });
  });
});
