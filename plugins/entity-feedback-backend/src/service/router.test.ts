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

import {
  DatabaseManager,
  getVoidLogger,
  PluginEndpointDiscovery,
} from '@backstage/backend-common';
import { stringifyEntityRef } from '@backstage/catalog-model';
import { ConfigReader } from '@backstage/config';
import { IdentityApi } from '@backstage/plugin-auth-node';
import express from 'express';
import request from 'supertest';

import { createRouter } from './router';

const sampleOwnedEntities = [
  {
    kind: 'component',
    metadata: {
      namespace: 'default',
      name: 'foo',
      title: 'Foo Component',
    },
  },
  {
    kind: 'component',
    metadata: {
      namespace: 'default',
      name: 'bar',
      title: 'Bar Component',
    },
  },
];

const sampleEntities = [
  ...sampleOwnedEntities,
  {
    kind: 'user',
    metadata: {
      namespace: 'default',
      name: 'foo',
    },
  },
  null,
  {
    kind: 'user',
    metadata: {
      namespace: 'default',
      name: 'bar',
    },
  },
];

const mockGetEntties = jest
  .fn()
  .mockImplementation(async () => ({ items: sampleOwnedEntities }));

const mockGetEnttiesByRefs = jest
  .fn()
  .mockImplementation(async () => ({ items: sampleEntities }));

jest.mock('@backstage/catalog-client', () => ({
  CatalogClient: jest.fn().mockImplementation(() => ({
    getEntities: mockGetEntties,
    getEntitiesByRefs: mockGetEnttiesByRefs,
  })),
}));

jest.mock('@backstage/plugin-auth-node', () => ({
  getBearerTokenFromAuthorizationHeader: () => 'token',
}));

const mockRatings = [
  { userRef: 'user:default/foo', rating: 'LIKE' },
  { userRef: 'user:default/bar', rating: 'LIKE' },
  { userRef: 'user:default/test', rating: 'DISLIKE' },
];

const mockResponses = [
  {
    userRef: 'user:default/foo',
    response: 'asdf',
    comments: 'here is new feedback',
    consent: false,
  },
  {
    userRef: 'user:default/bar',
    response: 'noop',
    comments: 'here is different feedback',
    consent: true,
  },
  {
    userRef: 'user:default/test',
    response: 'err',
    comments: 'no comment',
    consent: false,
  },
];

const mockDbHandler = {
  getAllRatedEntities: jest
    .fn()
    .mockImplementation(async () => [
      'component:default/foo',
      'component:default/bar',
      'component:default/test',
    ]),
  getRatingsAggregates: jest.fn().mockImplementation(async () => [
    { entityRef: 'component:default/foo', rating: 'LIKE', count: 3 },
    { entityRef: 'component:default/foo', rating: 'DISLIKE', count: 1 },
    { entityRef: 'component:default/bar', rating: 'LIKE', count: 5 },
  ]),
  recordRating: jest.fn().mockImplementation(async () => {}),
  getRatings: jest.fn().mockImplementation(async () => mockRatings),
  recordResponse: jest.fn().mockImplementation(async () => {}),
  getResponses: jest.fn().mockImplementation(async () => mockResponses),
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
    ).forPlugin('entity-feedback');

  const mockIdentityClient = {
    getIdentity: jest.fn().mockImplementation(async () => ({
      identity: { userEntityRef: 'user:default/me' },
    })),
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
    });

    app = express().use(router);
    jest.clearAllMocks();
  });

  describe('GET /ratings', () => {
    it('should get ratings for all entities correctly', async () => {
      const response = await request(app).get('/ratings').send();

      expect(mockDbHandler.getAllRatedEntities).toHaveBeenCalled();
      expect(mockDbHandler.getRatingsAggregates).toHaveBeenCalledWith(
        sampleEntities
          .filter(Boolean)
          .map((ent: any) => stringifyEntityRef(ent)),
      );
      expect(response.status).toEqual(200);
      expect(response.body).toEqual([
        {
          entityRef: 'component:default/foo',
          entityTitle: 'Foo Component',
          ratings: { LIKE: 3, DISLIKE: 1 },
        },
        {
          entityRef: 'component:default/bar',
          entityTitle: 'Bar Component',
          ratings: { LIKE: 5 },
        },
      ]);
    });

    it('should get ratings for all owned entities correctly', async () => {
      const response = await request(app)
        .get('/ratings?ownerRef=group:default/test-team')
        .send();

      expect(mockGetEntties).toHaveBeenCalledWith(
        expect.objectContaining({
          filter: { 'relations.ownedBy': 'group:default/test-team' },
        }),
        { token: 'token' },
      );
      expect(mockDbHandler.getAllRatedEntities).not.toHaveBeenCalled();
      expect(mockDbHandler.getRatingsAggregates).toHaveBeenCalledWith(
        sampleOwnedEntities.map((ent: any) => stringifyEntityRef(ent)),
      );
      expect(response.status).toEqual(200);
      expect(response.body).toEqual([
        {
          entityRef: 'component:default/foo',
          entityTitle: 'Foo Component',
          ratings: { LIKE: 3, DISLIKE: 1 },
        },
        {
          entityRef: 'component:default/bar',
          entityTitle: 'Bar Component',
          ratings: { LIKE: 5 },
        },
      ]);
    });
  });

  describe('POST /ratings/:entityRef', () => {
    it('should record a rating correctly', async () => {
      const body = { rating: 'LIKE' };
      const response = await request(app)
        .post('/ratings/component%3Adefault%2Fservice')
        .send(body);
      expect(mockDbHandler.recordRating).toHaveBeenCalledWith({
        entityRef: 'component:default/service',
        userRef: 'user:default/me',
        ...body,
      });
      expect(response.status).toEqual(201);
    });
  });

  describe('GET /ratings/:entityRef', () => {
    it('should get ratings for an entity correctly', async () => {
      const response = await request(app)
        .get('/ratings/component%3Adefault%2Fservice')
        .send();
      expect(mockDbHandler.getRatings).toHaveBeenCalledWith(
        'component:default/service',
      );
      expect(response.status).toEqual(200);
      expect(response.body).toEqual(
        mockRatings.filter(r => r.userRef !== 'user:default/test'),
      );
    });
  });

  describe('GET /ratings/:entityRef/aggregate', () => {
    it('should get aggregated ratings for an entity correctly', async () => {
      const response = await request(app)
        .get('/ratings/component%3Adefault%2Fservice/aggregate')
        .send();
      expect(mockDbHandler.getRatings).toHaveBeenCalledWith(
        'component:default/service',
      );
      expect(response.status).toEqual(200);
      expect(response.body).toEqual({
        DISLIKE: 1,
        LIKE: 2,
      });
    });
  });

  describe('POST /responses/:entityRef', () => {
    it('should record a response correctly', async () => {
      const body = { response: 'blah', comments: 'feedback', consent: true };
      const response = await request(app)
        .post('/responses/component%3Adefault%2Fservice')
        .send(body);
      expect(mockDbHandler.recordResponse).toHaveBeenCalledWith({
        entityRef: 'component:default/service',
        userRef: 'user:default/me',
        ...body,
      });
      expect(response.status).toEqual(201);
    });
  });

  describe('GET /responses/:entityRef', () => {
    it('should get responses for an entity correctly', async () => {
      const response = await request(app)
        .get('/responses/component%3Adefault%2Fservice')
        .send();
      expect(mockDbHandler.getResponses).toHaveBeenCalledWith(
        'component:default/service',
      );
      expect(response.status).toEqual(200);
      expect(response.body).toEqual(
        mockResponses.filter(r => r.userRef !== 'user:default/test'),
      );
    });
  });
});
