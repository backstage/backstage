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
  BackstageIdentityResponse,
  IdentityApi,
} from '@backstage/plugin-auth-node';
import express from 'express';
import request from 'supertest';
import { UserSettingsStore } from '../database/UserSettingsStore';
import { createRouterInternal } from './router';

describe('createRouter', () => {
  const userSettingsStore: jest.Mocked<UserSettingsStore> = {
    get: jest.fn(),
    set: jest.fn(),
    delete: jest.fn(),
  };
  const getIdentityMock = jest.fn<
    Promise<BackstageIdentityResponse | undefined>,
    any
  >();
  const identityApi: jest.Mocked<Partial<IdentityApi>> = {
    getIdentity: getIdentityMock,
  };

  let app: express.Express;

  beforeEach(async () => {
    const router = await createRouterInternal({
      userSettingsStore,
      identity: identityApi as IdentityApi,
    });

    app = express().use(router);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('GET /buckets/:bucket/keys/:key', () => {
    it('returns ok', async () => {
      const setting = { bucket: 'my-bucket', key: 'my-key', value: 'a' };
      getIdentityMock.mockResolvedValue({
        token: 'a',
        identity: {
          type: 'user',
          ownershipEntityRefs: [],
          userEntityRef: 'user-1',
        },
      });

      userSettingsStore.get.mockResolvedValue(setting);

      const responses = await request(app)
        .get('/buckets/my-bucket/keys/my-key')
        .set('Authorization', 'Bearer foo');

      expect(responses.status).toEqual(200);
      expect(responses.body).toEqual(setting);

      expect(getIdentityMock).toHaveBeenCalledTimes(1);
      expect(userSettingsStore.get).toHaveBeenCalledTimes(1);
      expect(userSettingsStore.get).toHaveBeenCalledWith({
        userEntityRef: 'user-1',
        bucket: 'my-bucket',
        key: 'my-key',
      });
    });

    it('returns an error if the Authorization header is missing', async () => {
      const responses = await request(app).get(
        '/buckets/my-bucket/keys/my-key',
      );

      expect(responses.status).toEqual(401);
      expect(userSettingsStore.get).not.toHaveBeenCalled();
    });
  });

  describe('DELETE /buckets/:bucket/keys/:key', () => {
    it('returns ok', async () => {
      getIdentityMock.mockResolvedValue({
        token: 'a',
        identity: {
          type: 'user',
          ownershipEntityRefs: [],
          userEntityRef: 'user-1',
        },
      });

      userSettingsStore.delete.mockResolvedValue();

      const responses = await request(app)
        .delete('/buckets/my-bucket/keys/my-key')
        .set('Authorization', 'Bearer foo');

      expect(responses.status).toEqual(204);

      expect(getIdentityMock).toHaveBeenCalledTimes(1);
      expect(userSettingsStore.delete).toHaveBeenCalledTimes(1);
      expect(userSettingsStore.delete).toHaveBeenCalledWith({
        userEntityRef: 'user-1',
        bucket: 'my-bucket',
        key: 'my-key',
      });
    });

    it('returns an error if the Authorization header is missing', async () => {
      const responses = await request(app).delete(
        '/buckets/my-bucket/keys/my-key',
      );

      expect(responses.status).toEqual(401);
      expect(userSettingsStore.delete).not.toHaveBeenCalled();
    });
  });

  describe('PUT /buckets/:bucket/keys/:key', () => {
    it('returns ok', async () => {
      const setting = { bucket: 'my-bucket', key: 'my-key', value: 'a' };
      getIdentityMock.mockResolvedValue({
        token: 'a',
        identity: {
          type: 'user',
          ownershipEntityRefs: [],
          userEntityRef: 'user-1',
        },
      });

      userSettingsStore.set.mockResolvedValue();
      userSettingsStore.get.mockResolvedValue(setting);

      const responses = await request(app)
        .put('/buckets/my-bucket/keys/my-key')
        .set('Authorization', 'Bearer foo')
        .send({ value: 'a' });

      expect(responses.status).toEqual(200);
      expect(responses.body).toEqual(setting);

      expect(getIdentityMock).toHaveBeenCalledTimes(1);
      expect(userSettingsStore.set).toHaveBeenCalledTimes(1);
      expect(userSettingsStore.set).toHaveBeenCalledWith({
        userEntityRef: 'user-1',
        bucket: 'my-bucket',
        key: 'my-key',
        value: 'a',
      });
      expect(userSettingsStore.get).toHaveBeenCalledTimes(1);
      expect(userSettingsStore.get).toHaveBeenCalledWith({
        userEntityRef: 'user-1',
        bucket: 'my-bucket',
        key: 'my-key',
      });
    });

    it('returns an error if the value is not given', async () => {
      getIdentityMock.mockResolvedValue({
        token: 'a',
        identity: {
          type: 'user',
          ownershipEntityRefs: [],
          userEntityRef: 'user-1',
        },
      });

      const responses = await request(app)
        .put('/buckets/my-bucket/keys/my-key')
        .set('Authorization', 'Bearer foo')
        .send({});

      expect(responses.status).toEqual(400);

      expect(getIdentityMock).toHaveBeenCalledTimes(1);
      expect(userSettingsStore.set).not.toHaveBeenCalled();
    });

    it('returns an error if the Authorization header is missing', async () => {
      const responses = await request(app).get(
        '/buckets/my-bucket/keys/my-key',
      );

      expect(responses.status).toEqual(401);
      expect(userSettingsStore.get).not.toHaveBeenCalled();
    });
  });
});
