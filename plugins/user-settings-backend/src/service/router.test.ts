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
import { AuthenticationError } from '@backstage/errors';
import { IdentityClient } from '@backstage/plugin-auth-node';
import express from 'express';
import request from 'supertest';

import { UserSettingsStore } from '../database';
import { createRouter } from './router';

describe('createRouter', () => {
  const userSettingsStore: jest.Mocked<UserSettingsStore<'tx'>> = {
    transaction: jest.fn(),
    deleteAll: jest.fn(),
    getAll: jest.fn(),
    getBucket: jest.fn(),
    deleteBucket: jest.fn(),
    get: jest.fn(),
    set: jest.fn(),
    delete: jest.fn(),
  };
  const authenticateMock = jest.fn();
  const identityClient: jest.Mocked<Partial<IdentityClient>> = {
    authenticate: authenticateMock,
  };

  let app: express.Express;

  beforeEach(async () => {
    userSettingsStore.transaction.mockImplementation(fn => fn('tx'));

    const router = await createRouter({
      userSettingsStore,
      identity: identityClient as IdentityClient,
    });

    app = express().use(router);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('GET /', () => {
    it('returns ok', async () => {
      const settings = [
        { bucket: 'a', key: 'a', value: 'a' },
        { bucket: 'b', key: 'b', value: 'b' },
      ];
      authenticateMock.mockResolvedValue({
        identity: { userEntityRef: 'user-1' },
      });

      userSettingsStore.getAll.mockResolvedValue(settings);

      const responses = await request(app)
        .get('/')
        .set('Authorization', 'Bearer foo');

      expect(responses.status).toEqual(200);
      expect(responses.body).toEqual(settings);

      expect(authenticateMock).toHaveBeenCalledWith('foo');
      expect(userSettingsStore.getAll).toBeCalledTimes(1);
      expect(userSettingsStore.getAll).toBeCalledWith('tx', {
        userEntityRef: 'user-1',
      });
    });

    it('returns an error if the Authorization header is missing', async () => {
      const responses = await request(app).get('/');

      expect(responses.status).toEqual(401);
      expect(userSettingsStore.getAll).not.toHaveBeenCalled();
    });

    it('returns an error if the token is not valid', async () => {
      authenticateMock.mockRejectedValue(
        new AuthenticationError('Invalid token'),
      );

      const responses = await request(app)
        .get('/')
        .set('Authorization', 'Bearer foo');

      expect(responses.status).toEqual(401);
      expect(userSettingsStore.getAll).not.toHaveBeenCalled();
    });
  });

  describe('DELETE /', () => {
    it('returns ok', async () => {
      authenticateMock.mockResolvedValue({
        identity: { userEntityRef: 'user-1' },
      });

      userSettingsStore.deleteAll.mockResolvedValue();

      const responses = await request(app)
        .delete('/')
        .set('Authorization', 'Bearer foo');

      expect(responses.status).toEqual(204);

      expect(authenticateMock).toHaveBeenCalledWith('foo');
      expect(userSettingsStore.deleteAll).toBeCalledTimes(1);
      expect(userSettingsStore.deleteAll).toBeCalledWith('tx', {
        userEntityRef: 'user-1',
      });
    });

    it('returns an error if the Authorization header is missing', async () => {
      const responses = await request(app).delete('/');

      expect(responses.status).toEqual(401);
      expect(userSettingsStore.getAll).not.toHaveBeenCalled();
    });
  });

  describe('GET /:bucket', () => {
    it('returns ok', async () => {
      const settings = [
        { bucket: 'my-bucket', key: 'a', value: 'a' },
        { bucket: 'my-bucket', key: 'b', value: 'b' },
      ];
      authenticateMock.mockResolvedValue({
        identity: { userEntityRef: 'user-1' },
      });

      userSettingsStore.getBucket.mockResolvedValue(settings);

      const responses = await request(app)
        .get('/my-bucket')
        .set('Authorization', 'Bearer foo');

      expect(responses.status).toEqual(200);
      expect(responses.body).toEqual(settings);

      expect(authenticateMock).toHaveBeenCalledWith('foo');
      expect(userSettingsStore.getBucket).toBeCalledTimes(1);
      expect(userSettingsStore.getBucket).toBeCalledWith('tx', {
        userEntityRef: 'user-1',
        bucket: 'my-bucket',
      });
    });

    it('returns an error if the Authorization header is missing', async () => {
      const responses = await request(app).get('/my-bucket');

      expect(responses.status).toEqual(401);
      expect(userSettingsStore.getBucket).not.toHaveBeenCalled();
    });
  });

  describe('DELETE /:bucket', () => {
    it('returns ok', async () => {
      authenticateMock.mockResolvedValue({
        identity: { userEntityRef: 'user-1' },
      });

      userSettingsStore.deleteBucket.mockResolvedValue();

      const responses = await request(app)
        .delete('/my-bucket')
        .set('Authorization', 'Bearer foo');

      expect(responses.status).toEqual(204);

      expect(authenticateMock).toHaveBeenCalledWith('foo');
      expect(userSettingsStore.deleteBucket).toBeCalledTimes(1);
      expect(userSettingsStore.deleteBucket).toBeCalledWith('tx', {
        userEntityRef: 'user-1',
        bucket: 'my-bucket',
      });
    });

    it('returns an error if the Authorization header is missing', async () => {
      const responses = await request(app).delete('/my-bucket');

      expect(responses.status).toEqual(401);
      expect(userSettingsStore.deleteBucket).not.toHaveBeenCalled();
    });
  });

  describe('GET /:bucket/:key', () => {
    it('returns ok', async () => {
      const setting = { bucket: 'my-bucket', key: 'my-key', value: 'a' };
      authenticateMock.mockResolvedValue({
        identity: { userEntityRef: 'user-1' },
      });

      userSettingsStore.get.mockResolvedValue(setting);

      const responses = await request(app)
        .get('/my-bucket/my-key')
        .set('Authorization', 'Bearer foo');

      expect(responses.status).toEqual(200);
      expect(responses.body).toEqual(setting);

      expect(authenticateMock).toHaveBeenCalledWith('foo');
      expect(userSettingsStore.get).toBeCalledTimes(1);
      expect(userSettingsStore.get).toBeCalledWith('tx', {
        userEntityRef: 'user-1',
        bucket: 'my-bucket',
        key: 'my-key',
      });
    });

    it('returns an error if the Authorization header is missing', async () => {
      const responses = await request(app).get('/my-bucket/my-key');

      expect(responses.status).toEqual(401);
      expect(userSettingsStore.get).not.toHaveBeenCalled();
    });
  });

  describe('DELETE /:bucket/:key', () => {
    it('returns ok', async () => {
      authenticateMock.mockResolvedValue({
        identity: { userEntityRef: 'user-1' },
      });

      userSettingsStore.delete.mockResolvedValue();

      const responses = await request(app)
        .delete('/my-bucket/my-key')
        .set('Authorization', 'Bearer foo');

      expect(responses.status).toEqual(204);

      expect(authenticateMock).toHaveBeenCalledWith('foo');
      expect(userSettingsStore.delete).toBeCalledTimes(1);
      expect(userSettingsStore.delete).toBeCalledWith('tx', {
        userEntityRef: 'user-1',
        bucket: 'my-bucket',
        key: 'my-key',
      });
    });

    it('returns an error if the Authorization header is missing', async () => {
      const responses = await request(app).delete('/my-bucket/my-key');

      expect(responses.status).toEqual(401);
      expect(userSettingsStore.delete).not.toHaveBeenCalled();
    });
  });

  describe('PUT /:bucket/:key', () => {
    it('returns ok', async () => {
      const setting = { bucket: 'my-bucket', key: 'my-key', value: 'a' };
      authenticateMock.mockResolvedValue({
        identity: { userEntityRef: 'user-1' },
      });

      userSettingsStore.set.mockResolvedValue();
      userSettingsStore.get.mockResolvedValue(setting);

      const responses = await request(app)
        .put('/my-bucket/my-key')
        .set('Authorization', 'Bearer foo')
        .send({ value: 'a' });

      expect(responses.status).toEqual(200);
      expect(responses.body).toEqual(setting);

      expect(authenticateMock).toHaveBeenCalledWith('foo');
      expect(userSettingsStore.set).toBeCalledTimes(1);
      expect(userSettingsStore.set).toHaveBeenCalledWith('tx', {
        userEntityRef: 'user-1',
        bucket: 'my-bucket',
        key: 'my-key',
        value: 'a',
      });
      expect(userSettingsStore.get).toBeCalledTimes(1);
      expect(userSettingsStore.get).toBeCalledWith('tx', {
        userEntityRef: 'user-1',
        bucket: 'my-bucket',
        key: 'my-key',
      });
    });

    it('returns an error if the value is not a string', async () => {
      authenticateMock.mockResolvedValue({
        identity: { userEntityRef: 'user-1' },
      });

      const responses = await request(app)
        .put('/my-bucket/my-key')
        .set('Authorization', 'Bearer foo')
        .send({ value: { invalid: 'because not a string' } });

      expect(responses.status).toEqual(400);

      expect(authenticateMock).toHaveBeenCalledWith('foo');
      expect(userSettingsStore.set).not.toHaveBeenCalled();
    });

    it('returns an error if the Authorization header is missing', async () => {
      const responses = await request(app).get('/my-bucket/my-key');

      expect(responses.status).toEqual(401);
      expect(userSettingsStore.get).not.toHaveBeenCalled();
    });
  });
});
