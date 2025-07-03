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

import express from 'express';
import request from 'supertest';
import { UserSettingsStore } from '../database/UserSettingsStore';
import { createRouter } from './router';
import { SignalsService } from '@backstage/plugin-signals-node';
import {
  mockCredentials,
  mockServices,
  mockErrorHandler,
} from '@backstage/backend-test-utils';

describe('createRouter', () => {
  const userSettingsStore: jest.Mocked<UserSettingsStore> = {
    get: jest.fn(),
    set: jest.fn(),
    delete: jest.fn(),
  };
  const signalService: jest.Mocked<SignalsService> = {
    publish: jest.fn(),
  };

  let app: express.Express;

  beforeEach(async () => {
    const router = await createRouter({
      userSettingsStore,
      httpAuth: mockServices.httpAuth(),
      signals: signalService as SignalsService,
    });

    app = express().use(router).use(mockErrorHandler());
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  const mockUserRef = mockCredentials.user().principal.userEntityRef;

  describe('GET /buckets/:bucket/keys/:key', () => {
    it('returns ok', async () => {
      const setting = { bucket: 'my-bucket', key: 'my-key', value: 'a' };

      userSettingsStore.get.mockResolvedValue(setting);

      const responses = await request(app).get(
        '/buckets/my-bucket/keys/my-key',
      );

      expect(responses.status).toEqual(200);
      expect(responses.body).toEqual(setting);

      expect(userSettingsStore.get).toHaveBeenCalledTimes(1);
      expect(userSettingsStore.get).toHaveBeenCalledWith({
        userEntityRef: mockUserRef,
        bucket: 'my-bucket',
        key: 'my-key',
      });
    });

    it('returns an error if the Authorization header is missing', async () => {
      const responses = await request(app)
        .get('/buckets/my-bucket/keys/my-key')
        .set('Authorization', mockCredentials.none.header());

      expect(responses.status).toEqual(401);
      expect(userSettingsStore.get).not.toHaveBeenCalled();
    });
  });

  describe('DELETE /buckets/:bucket/keys/:key', () => {
    it('returns ok', async () => {
      userSettingsStore.delete.mockResolvedValue();

      const responses = await request(app).delete(
        '/buckets/my-bucket/keys/my-key',
      );

      expect(responses.status).toEqual(204);

      expect(userSettingsStore.delete).toHaveBeenCalledTimes(1);
      expect(userSettingsStore.delete).toHaveBeenCalledWith({
        userEntityRef: mockUserRef,
        bucket: 'my-bucket',
        key: 'my-key',
      });
      expect(signalService.publish).toHaveBeenCalledWith({
        recipients: { type: 'user', entityRef: mockUserRef },
        channel: `user-settings`,
        message: { type: 'key-deleted', key: 'my-key' },
      });
    });

    it('returns an error if the Authorization header is missing', async () => {
      const responses = await request(app)
        .delete('/buckets/my-bucket/keys/my-key')
        .set('Authorization', mockCredentials.none.header());

      expect(responses.status).toEqual(401);
      expect(userSettingsStore.delete).not.toHaveBeenCalled();
    });
  });

  describe('PUT /buckets/:bucket/keys/:key', () => {
    it('returns ok', async () => {
      const setting = { bucket: 'my-bucket', key: 'my-key', value: 'a' };

      userSettingsStore.set.mockResolvedValue();
      userSettingsStore.get.mockResolvedValue(setting);

      const responses = await request(app)
        .put('/buckets/my-bucket/keys/my-key')
        .send({ value: 'a' });

      expect(responses.status).toEqual(200);
      expect(responses.body).toEqual(setting);

      expect(userSettingsStore.set).toHaveBeenCalledTimes(1);
      expect(userSettingsStore.set).toHaveBeenCalledWith({
        userEntityRef: mockUserRef,
        bucket: 'my-bucket',
        key: 'my-key',
        value: 'a',
      });
      expect(userSettingsStore.get).toHaveBeenCalledTimes(1);
      expect(userSettingsStore.get).toHaveBeenCalledWith({
        userEntityRef: mockUserRef,
        bucket: 'my-bucket',
        key: 'my-key',
      });
      expect(signalService.publish).toHaveBeenCalledWith({
        recipients: { type: 'user', entityRef: mockUserRef },
        channel: `user-settings`,
        message: { type: 'key-changed', key: 'my-key' },
      });
    });

    it('returns an error if the value is not given', async () => {
      const responses = await request(app)
        .put('/buckets/my-bucket/keys/my-key')
        .send({});

      expect(responses.status).toEqual(400);

      expect(userSettingsStore.set).not.toHaveBeenCalled();
    });

    it('returns an error if the Authorization header is missing', async () => {
      const responses = await request(app)
        .get('/buckets/my-bucket/keys/my-key')
        .set('Authorization', mockCredentials.none.header());

      expect(responses.status).toEqual(401);
      expect(userSettingsStore.get).not.toHaveBeenCalled();
    });
  });
});
