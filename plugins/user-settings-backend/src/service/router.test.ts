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
import { JsonValue } from '@backstage/types';

describe('createRouter', () => {
  const userSettingsStore: jest.Mocked<UserSettingsStore> = {
    multiget: jest.fn(),
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

    it('returns ok for keys with forward slashes', async () => {
      const setting = {
        bucket: 'my-bucket',
        key: 'my-key/with/slashes',
        value: 'a',
      };

      userSettingsStore.get.mockResolvedValue(setting);

      const responses = await request(app).get(
        '/buckets/my-bucket/keys/my-key/with/slashes',
      );

      expect(responses.status).toEqual(200);
      expect(responses.body).toEqual(setting);

      expect(userSettingsStore.get).toHaveBeenCalledTimes(1);
      expect(userSettingsStore.get).toHaveBeenCalledWith({
        userEntityRef: mockUserRef,
        bucket: 'my-bucket',
        key: 'my-key/with/slashes',
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

  describe('GET /multi', () => {
    const mockMultiget = (store: Record<string, Record<string, JsonValue>>) => {
      userSettingsStore.multiget.mockImplementation(async ({ items }) => {
        return items.map(({ bucket, key }) => {
          const value = store[bucket]?.[key];
          if (typeof value !== 'undefined') {
            return { value };
          }
          return null;
        });
      });
    };

    it('returns single value', async () => {
      const values = { 'key-1': 'a' };

      mockMultiget({ 'my-bucket': values });

      const responses = await request(app)
        .post('/multiget')
        .send({
          items: Object.keys(values).map(key => ({
            bucket: 'my-bucket',
            key,
          })),
        });

      expect(responses.status).toEqual(200);
      expect(responses.body).toEqual({ items: [{ value: 'a' }] });

      expect(userSettingsStore.multiget).toHaveBeenCalledTimes(1);
      expect(userSettingsStore.multiget).toHaveBeenCalledWith({
        userEntityRef: mockUserRef,
        items: [
          {
            bucket: 'my-bucket',
            key: 'key-1',
          },
        ],
      });
    });

    it('returns single missing', async () => {
      const values = { 'key-1': 'a' };

      mockMultiget({ 'my-bucket': values });

      const responses = await request(app)
        .post('/multiget')
        .send({
          items: [{ bucket: 'my-bucket', key: 'missing-key' }],
        });

      expect(responses.status).toEqual(200);
      expect(responses.body).toEqual({
        items: [null],
      });

      expect(userSettingsStore.multiget).toHaveBeenCalledTimes(1);
      expect(userSettingsStore.multiget).toHaveBeenCalledWith({
        userEntityRef: mockUserRef,
        items: [
          {
            bucket: 'my-bucket',
            key: 'missing-key',
          },
        ],
      });
    });

    it('returns existing and missing mixed', async () => {
      const values = {
        'key-1': 'a',
        'key-2': 'b',
      };

      mockMultiget({ 'my-bucket': values });

      const responses = await request(app)
        .post('/multiget')
        .send({
          items: [
            ...Object.keys(values).map(key => ({ bucket: 'my-bucket', key })),
            { bucket: 'my-bucket', key: 'missing-key' },
          ],
        });

      expect(responses.status).toEqual(200);
      expect(responses.body).toEqual({
        items: [{ value: 'a' }, { value: 'b' }, null],
      });

      expect(userSettingsStore.multiget).toHaveBeenCalledTimes(1);
      expect(userSettingsStore.multiget).toHaveBeenCalledWith({
        userEntityRef: mockUserRef,
        items: [
          ...Object.keys(values).map(key => ({
            bucket: 'my-bucket',
            key,
          })),
          {
            bucket: 'my-bucket',
            key: 'missing-key',
          },
        ],
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

    it('returns ok for keys with forward slashes', async () => {
      userSettingsStore.delete.mockResolvedValue();

      const responses = await request(app).delete(
        '/buckets/my-bucket/keys/my-key/with/slashes',
      );

      expect(responses.status).toEqual(204);

      expect(userSettingsStore.delete).toHaveBeenCalledTimes(1);
      expect(userSettingsStore.delete).toHaveBeenCalledWith({
        userEntityRef: mockUserRef,
        bucket: 'my-bucket',
        key: 'my-key/with/slashes',
      });
      expect(signalService.publish).toHaveBeenCalledWith({
        recipients: { type: 'user', entityRef: mockUserRef },
        channel: `user-settings`,
        message: { type: 'key-deleted', key: 'my-key/with/slashes' },
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

    it('returns ok for keys with forward slashes', async () => {
      const setting = {
        bucket: 'my-bucket',
        key: 'my-key/with/slashes',
        value: 'a',
      };

      userSettingsStore.set.mockResolvedValue();
      userSettingsStore.get.mockResolvedValue(setting);

      const responses = await request(app)
        .put('/buckets/my-bucket/keys/my-key/with/slashes')
        .send({ value: 'a' });

      expect(responses.status).toEqual(200);
      expect(responses.body).toEqual(setting);

      expect(userSettingsStore.set).toHaveBeenCalledTimes(1);
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
