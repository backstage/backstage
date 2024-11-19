/*
 * Copyright 2024 The Backstage Authors
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
import { DeviceAuthEntry, DeviceAuthStore } from '../database/DeviceAuthStore';
import { mockCredentials, mockServices } from '@backstage/backend-test-utils';
import { NotFoundError } from '@backstage/errors';
import { createRouterInternal } from './router';

describe('createRouter', () => {
  const deviceAuthStore: jest.Mocked<DeviceAuthStore> = {
    getByDeviceCode: jest.fn(),
    getByUserCode: jest.fn(),
    create: jest.fn(),
    setValidated: jest.fn(),
    deleteByDeviceCode: jest.fn(),
    deleteByUserCode: jest.fn(),
  };

  let app: express.Express;

  beforeEach(async () => {
    const mockConfig = mockServices.rootConfig({
      data: {
        app: {
          baseUrl: 'http://localhost:7000',
        },
      },
    });
    const router = await createRouterInternal({
      logger: mockServices.logger.mock(),
      config: mockConfig,
      deviceAuthStore,
      httpAuth: mockServices.httpAuth(),
      auth: mockServices.auth(),
    });

    app = express().use(router);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  // const mockUserRef = mockCredentials.user().principal.userEntityRef;
  // const mockAccessToken = 'my-access-token';

  describe('POST /user_code/verify', () => {
    it('returns ok', async () => {
      const deviceAuthEntry: DeviceAuthEntry = {
        deviceCode: 'my-device-code',
        userCode: 'my-user-code',
        clientId: 'my-client',
        isValidated: false,
        expiresAt: new Date(new Date().getTime() + 10000),
      };
      deviceAuthStore.getByUserCode.mockResolvedValue(deviceAuthEntry);
      const mockAuthHeader = mockCredentials.user.header();

      const response = await request(app)
        .post('/user_code/verify')
        .set('authorization', mockAuthHeader)
        .send({ user_code: deviceAuthEntry.userCode });

      expect(deviceAuthStore.getByUserCode).toHaveBeenCalledWith(
        deviceAuthEntry.userCode,
      );
      expect(deviceAuthStore.setValidated).toHaveBeenCalledWith({
        userCode: deviceAuthEntry.userCode,
        accessToken: mockAuthHeader.split(' ')[1],
      });
      expect(response.status).toEqual(200);
      expect(response.body).toEqual({ status: 'ok' });
    });

    it('returns an error when unauthorized', async () => {
      const response = await request(app)
        .post('/user_code/verify')
        .send({ user_code: 'user-code' });

      expect(response.status).toEqual(401);
    });

    it('returns an error when an invalid user code is sent', async () => {
      deviceAuthStore.getByUserCode.mockImplementation(() => {
        throw new NotFoundError(
          'No device auth entry found for user code invalid-user-code',
        );
      });
      const mockAuthHeader = mockCredentials.user.header();

      const response = await request(app)
        .post('/user_code/verify')
        .set('authorization', mockAuthHeader)
        .send({ user_code: 'invalid-user-code' });

      expect(deviceAuthStore.getByUserCode).toHaveBeenCalledWith(
        'invalid-user-code',
      );
      expect(response.status).toEqual(400);
      expect(response.body).toEqual({ error: 'Invalid user code' });
    });
  });

  describe('POST /user_code/deny', () => {
    it('returns ok', async () => {
      const deviceAuthEntry: DeviceAuthEntry = {
        deviceCode: 'my-device-code',
        userCode: 'my-user-code',
        clientId: 'my-client',
        isValidated: false,
        expiresAt: new Date(new Date().getTime() + 10000),
      };
      deviceAuthStore.getByUserCode.mockResolvedValue(deviceAuthEntry);
      const mockAuthHeader = mockCredentials.user.header();

      const response = await request(app)
        .post('/user_code/deny')
        .set('authorization', mockAuthHeader)
        .send({ user_code: deviceAuthEntry.userCode });

      expect(deviceAuthStore.getByUserCode).toHaveBeenCalledWith(
        deviceAuthEntry.userCode,
      );
      expect(deviceAuthStore.deleteByUserCode).toHaveBeenCalledWith({
        userCode: deviceAuthEntry.userCode,
      });
      expect(response.status).toEqual(200);
      expect(response.body).toEqual({ status: 'denied' });
    });

    it('returns an error when unauthorized', async () => {
      const response = await request(app)
        .post('/user_code/deny')
        .send({ user_code: 'user-code' });

      expect(response.status).toEqual(401);
    });

    it('returns an error when an invalid user code is sent', async () => {
      deviceAuthStore.getByUserCode.mockImplementation(() => {
        throw new NotFoundError(
          'No device auth entry found for user code invalid-user-code',
        );
      });
      const mockAuthHeader = mockCredentials.user.header();

      const response = await request(app)
        .post('/user_code/deny')
        .set('authorization', mockAuthHeader)
        .send({ user_code: 'invalid-user-code' });

      expect(deviceAuthStore.getByUserCode).toHaveBeenCalledWith(
        'invalid-user-code',
      );
      expect(response.status).toEqual(400);
      expect(response.body).toEqual({ error: 'Invalid user code' });
    });
  });

  describe('POST /device_authorization', () => {
    it('returns a valid device and user code response', async () => {
      deviceAuthStore.create.mockImplementation(() => Promise.resolve());
      const response = await request(app)
        .post('/device_authorization')
        .send({ client_id: 'cli' });

      expect(deviceAuthStore.create).toHaveBeenCalledWith({
        userCode: expect.any(String),
        clientId: 'cli',
        deviceCode: expect.any(String),
        expiresAt: expect.any(Date),
      });
      expect(response.status).toEqual(200);
      expect(response.body).toEqual({
        device_code: expect.any(String),
        user_code: expect.any(String),
        verification_uri: expect.any(String),
        verification_uri_complete: expect.any(String),
        expires_at: expect.any(String),
        interval: 5,
      });
    });

    it('returns an error when no client id is sent', async () => {
      const response = await request(app)
        .post('/device_authorization')
        .send({});

      expect(response.status).toEqual(400);
      expect(response.body).toEqual({ error: 'client_id is required' });
    });
  });

  describe('POST /token', () => {
    it('returns a validated token', async () => {
      const mockAuthHeader = mockCredentials.user.header();
      const deviceAuthEntry: DeviceAuthEntry = {
        deviceCode: 'my-device-code',
        userCode: 'my-user-code',
        clientId: 'my-client',
        isValidated: true,
        accessToken: mockAuthHeader.split(' ')[1],
        expiresAt: new Date(new Date().getTime() + 10000),
      };
      deviceAuthStore.getByDeviceCode.mockResolvedValue(deviceAuthEntry);

      const response = await request(app)
        .post('/token')
        .set('authorization', mockAuthHeader)
        .send({
          device_code: deviceAuthEntry.deviceCode,
          client_id: deviceAuthEntry.clientId,
          grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
        });

      expect(deviceAuthStore.getByDeviceCode).toHaveBeenCalledWith({
        deviceCode: deviceAuthEntry.deviceCode,
      });
      expect(deviceAuthStore.deleteByDeviceCode).toHaveBeenCalledWith({
        deviceCode: deviceAuthEntry.deviceCode,
      });
      expect(response.status).toEqual(200);
      expect(response.body).toEqual({
        access_token: mockAuthHeader.split(' ')[1],
      });
    });

    it('returns authorization_pending', async () => {
      const mockAuthHeader = mockCredentials.user.header();
      const deviceAuthEntry: DeviceAuthEntry = {
        deviceCode: 'my-device-code',
        userCode: 'my-user-code',
        clientId: 'my-client',
        isValidated: false,
        expiresAt: new Date(new Date().getTime() + 10000),
      };
      deviceAuthStore.getByDeviceCode.mockResolvedValue(deviceAuthEntry);

      const response = await request(app)
        .post('/token')
        .set('authorization', mockAuthHeader)
        .send({
          device_code: deviceAuthEntry.deviceCode,
          client_id: deviceAuthEntry.clientId,
          grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
        });

      expect(deviceAuthStore.getByDeviceCode).toHaveBeenCalledWith({
        deviceCode: deviceAuthEntry.deviceCode,
      });
      expect(response.status).toEqual(401);
      expect(response.body).toEqual({ error: 'authorization_pending' });
    });

    it('returns expired_token', async () => {
      const mockAuthHeader = mockCredentials.user.header();
      const deviceAuthEntry: DeviceAuthEntry = {
        deviceCode: 'my-device-code',
        userCode: 'my-user-code',
        clientId: 'my-client',
        isValidated: false,
        expiresAt: new Date(new Date().getTime() - 10000),
      };
      deviceAuthStore.getByDeviceCode.mockResolvedValue(deviceAuthEntry);

      const response = await request(app)
        .post('/token')
        .set('authorization', mockAuthHeader)
        .send({
          device_code: deviceAuthEntry.deviceCode,
          client_id: deviceAuthEntry.clientId,
          grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
        });

      expect(deviceAuthStore.getByDeviceCode).toHaveBeenCalledWith({
        deviceCode: deviceAuthEntry.deviceCode,
      });
      expect(response.status).toEqual(400);
      expect(response.body).toEqual({ error: 'expired_token' });
    });

    it('returns invalid code', async () => {
      deviceAuthStore.getByDeviceCode.mockImplementation(() => {
        throw new NotFoundError(
          'No device auth entry found for user code invalid-user-code',
        );
      });

      const response = await request(app).post('/token').send({
        device_code: 'invalid-device-code',
        client_id: 'cli',
        grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
      });

      expect(deviceAuthStore.getByDeviceCode).toHaveBeenCalledWith({
        deviceCode: 'invalid-device-code',
      });
      expect(response.status).toEqual(400);
      expect(response.body).toEqual({ error: 'Invalid user code' });
    });
  });

  describe('GET /health', () => {
    it('returns ok', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({ status: 'ok' });
    });
  });
});
