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
import { NotAllowedError } from '@backstage/errors';
import express from 'express';
import request from 'supertest';

import { StarredEntitiesStore } from '../database';
import { createRouter } from './router';

describe('createRouter', () => {
  const getUserIdFromRequest = jest.fn();
  const starredEntitiesStore: jest.Mocked<StarredEntitiesStore<'tx'>> = {
    transaction: jest.fn(),
    getStarredEntities: jest.fn(),
    starEntity: jest.fn(),
    toggleEntity: jest.fn(),
  };
  let app: express.Express;

  beforeEach(async () => {
    starredEntitiesStore.transaction.mockImplementation(fn => fn('tx'));

    const router = await createRouter({
      starredEntitiesStore: starredEntitiesStore,
      getUserIdFromRequest,
    });
    app = express().use(router);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('GET /', () => {
    it('returns ok', async () => {
      getUserIdFromRequest.mockResolvedValue('user-1');

      starredEntitiesStore.getStarredEntities.mockResolvedValue([
        'component-a',
        'component-b',
      ]);

      const responses = await request(app).get('/');

      expect(responses.status).toEqual(200);
      expect(responses.body).toEqual({
        starredEntities: ['component-a', 'component-b'],
      });

      expect(starredEntitiesStore.getStarredEntities).toBeCalledTimes(1);
      expect(starredEntitiesStore.getStarredEntities).toBeCalledWith('tx', {
        userId: 'user-1',
      });
    });

    it('returns error from getUserIdFromRequest', async () => {
      getUserIdFromRequest.mockRejectedValue(
        new NotAllowedError('No user identity'),
      );

      const response = await request(app).get('/');

      expect(response.status).toEqual(403);
      expect(response.text).toMatch(/No user identity/);

      expect(getUserIdFromRequest).toBeCalledTimes(1);
      expect(starredEntitiesStore.getStarredEntities).not.toBeCalled();
    });
  });

  describe('POST /:namespace/:kind/:name/star', () => {
    it('returns ok', async () => {
      getUserIdFromRequest.mockResolvedValue('user-1');

      starredEntitiesStore.starEntity.mockResolvedValue(undefined);
      starredEntitiesStore.getStarredEntities.mockResolvedValue([
        'component-a',
      ]);

      const responses = await request(app).post(
        '/default/component/component-a/star',
      );

      expect(responses.status).toEqual(200);

      expect(starredEntitiesStore.starEntity).toBeCalledTimes(1);
      expect(starredEntitiesStore.starEntity).toBeCalledWith('tx', {
        userId: 'user-1',
        entity: {
          namespace: 'default',
          kind: 'component',
          name: 'component-a',
        },
      });
      expect(starredEntitiesStore.getStarredEntities).toBeCalledTimes(1);
      expect(starredEntitiesStore.getStarredEntities).toBeCalledWith('tx', {
        userId: 'user-1',
      });
    });

    it('returns error from getUserIdFromRequest', async () => {
      getUserIdFromRequest.mockRejectedValue(
        new NotAllowedError('No user identity'),
      );

      const response = await request(app).post(
        '/default/component/component-a/star',
      );

      expect(response.status).toEqual(403);
      expect(response.text).toMatch(/No user identity/);

      expect(getUserIdFromRequest).toBeCalledTimes(1);
      expect(starredEntitiesStore.starEntity).not.toBeCalled();
    });
  });

  describe('POST /:namespace/:kind/:name/toggle', () => {
    it('returns ok', async () => {
      getUserIdFromRequest.mockResolvedValue('user-1');

      starredEntitiesStore.toggleEntity.mockResolvedValue(undefined);
      starredEntitiesStore.getStarredEntities.mockResolvedValue([
        'component-a',
      ]);

      const responses = await request(app).post(
        '/default/component/component-a/toggle',
      );

      expect(responses.status).toEqual(200);

      expect(starredEntitiesStore.toggleEntity).toBeCalledTimes(1);
      expect(starredEntitiesStore.toggleEntity).toBeCalledWith('tx', {
        userId: 'user-1',
        entity: {
          namespace: 'default',
          kind: 'component',
          name: 'component-a',
        },
      });
      expect(starredEntitiesStore.getStarredEntities).toBeCalledTimes(1);
      expect(starredEntitiesStore.getStarredEntities).toBeCalledWith('tx', {
        userId: 'user-1',
      });
    });

    it('returns error from getUserIdFromRequest', async () => {
      getUserIdFromRequest.mockRejectedValue(
        new NotAllowedError('No user identity'),
      );

      const response = await request(app).post(
        '/default/component/component-a/toggle',
      );

      expect(response.status).toEqual(403);
      expect(response.text).toMatch(/No user identity/);

      expect(getUserIdFromRequest).toBeCalledTimes(1);
      expect(starredEntitiesStore.toggleEntity).not.toBeCalled();
    });
  });
});
