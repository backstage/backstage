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

import { MiddlewareFactory } from '@backstage/backend-defaults/rootHttpRouter';
import {
  AuthService,
  DatabaseService,
  HttpAuthService,
  LoggerService,
} from '@backstage/backend-plugin-api';
import { Config } from '@backstage/config';
import { NotFoundError } from '@backstage/errors';
import express from 'express';
import Router from 'express-promise-router';
import { nanoid, customAlphabet } from 'nanoid';
import { DatabaseDeviceAuthStore } from '../database/DatabaseDeviceAuthStore';
import { DeviceAuthStore } from '../database/DeviceAuthStore';

export interface RouterOptions {
  logger: LoggerService;
  config: Config;
  database: DatabaseService;
  auth: AuthService;
  httpAuth: HttpAuthService;
}

const INITIAL_INTERVAL = 5; // seconds
const DEVICE_CODE_EXPIRATION = 300; // seconds

/**
 * Create the user settings backend routes.
 *
 * @public
 */
export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const deviceAuthStore = await DatabaseDeviceAuthStore.create({
    database: options.database,
  });

  return await createRouterInternal({
    ...options,
    deviceAuthStore,
  });
}

export async function createRouterInternal(options: {
  logger: LoggerService;
  config: Config;
  deviceAuthStore: DeviceAuthStore;
  auth: AuthService;
  httpAuth: HttpAuthService;
}): Promise<express.Router> {
  // const { logger, config, deviceAuthStore, auth, httpAuth } = options;
  const { logger, config, deviceAuthStore } = options;

  const router = Router();
  router.use(express.json());

  router.get('/health', (_, response) => {
    response.send({ status: 'ok' });
  });

  /**
   * POST /user_code/verify
   *
   * Verifies the provided user code and device code. If both codes are valid,
   * it sets the `is_validated` field to true in the database and returns a 200 response.
   *
   * If the `user_code` is missing from the request body, it returns a 400 response and a message indicating which field is missing.
   * If the provided user code and device code do not match any records in the database, it returns a 400 response.
   * If there is an error during the verification process, it returns a 500 response.
   *
   * @param {Object} request - The request object.
   * @param {Object} request.body - The body of the request.
   * @param {string} request.body.user_code - The user code to be verified.
   * @param {Object} response - The response object.
   * @returns {void}
   */
  router.post('/user_code/verify', async (request, response) => {
    if (!request.body.user_code) {
      response.status(400).json({ error: 'user_code is required' });
      return;
    }

    const token = request.headers.authorization?.split(' ')[1];
    if (!token) {
      response.status(401).json({ error: 'Unauthorized' });
      return;
    }

    try {
      const userCode = await deviceAuthStore.getByUserCode(
        request.body.user_code,
      );

      if (userCode.expiresAt < new Date()) {
        response.status(400).json({ error: 'expired_token' });
        return;
      }
      await deviceAuthStore.setValidated({
        userCode: request.body.user_code,
        accessToken: token,
      });
      response.status(200).json({ status: 'ok' });
      return;
    } catch (error) {
      if (error instanceof NotFoundError) {
        response.status(400).json({ error: 'Invalid user code' });
        return;
      }
      if (error instanceof Error) {
        logger.error('Error verifying user code: ', error);
      }
      response
        .status(500)
        .json({ error: 'Unable to update user code verification' });
      return;
    }
  });

  /**
   * POST /user_code/deny
   *
   * Denies the provided user code and device code,
   * deleting the user code entry from the database.
   *
   * If the `user_code` is missing from the request body, it returns a 400 response and a message indicating which field is missing.
   * If the provided user code and device code do not match any records in the database, it returns a 400 response.
   * If there is an error during the process, it returns a 500 response.
   *
   * @param {Object} request - The request object.
   * @param {Object} request.body - The body of the request.
   * @param {string} request.body.user_code - The user code to be verified.
   * @param {Object} response - The response object.
   * @returns {void}
   */
  router.post('/user_code/deny', async (request, response) => {
    const token = request.headers.authorization?.split(' ')[1];
    if (!token) {
      response.status(401).json({ error: 'Unauthorized' });
      return;
    }

    if (!request.body.user_code) {
      response.status(400).json({ error: 'user_code is required' });
      return;
    }

    try {
      // const userCode = await deviceAuthStore.getByUserCode(request.body.user_code);
      await deviceAuthStore.deleteByUserCode({
        userCode: request.body.user_code,
      });
      response.status(200).json({ status: 'denied' });
      return;
    } catch (error) {
      if (error instanceof NotFoundError) {
        response.status(400).json({ error: 'Invalid user code' });
        return;
      }
      if (error instanceof Error) {
        logger.error('Error denying user code: ', error);
      }
      response.status(500).json({ error: 'Unable to deny user code' });
      return;
    }
  });

  /**
   * POST /device_authorization
   *
   * Initiates the device authorization flow. It generates a random device code
   * and user code, and stores them in the database. It then returns the device code
   * and user code in the response along with the verification URI.
   *
   * @param {Object} request - The request object.
   * @param {Object} request.body - The body of the request.
   * @param {string} request.body.client_id - The client ID of the application.
   * @param {string} [request.body.scope] - The scope of the authorization request (optional, currently unused).
   * @returns {void}
   */
  router.post('/device_authorization', async (request, response) => {
    if (!request.body.client_id) {
      response.status(400).json({ error: 'client_id is required' });
      return;
    }
    // Currently unused
    // const scope = request.body.scope || '';

    const deviceCode = nanoid();

    // Generate a random user code using numbers and lower-case consonants, to avoid confusion with similar characters
    // When the frontend displays the user code, it should be formatted in groups of 4 upper-case characters for readability
    // When the frontend sends the user code to the backend to verify it, the cose should be sent as a single lower-case string without punctuation.
    const userCode = customAlphabet('123456789bcdfghjklmnpqrstvwxyz', 8)();

    const userCodeAuthUrlPath =
      config.getOptionalString('deviceAuth.userCodeAuthUrlPath') ||
      '/device-auth';
    const expiresAt = new Date();
    expiresAt.setTime(
      expiresAt.getTime() +
        (config.getOptionalNumber('deviceAuth.deviceCodeExpiration') ||
          DEVICE_CODE_EXPIRATION) *
          1000,
    );

    try {
      // Save the device code and user code in the database
      await deviceAuthStore.create({
        userCode,
        clientId: request.body.client_id,
        deviceCode,
        expiresAt,
      });
      response.status(200).json({
        device_code: deviceCode,
        user_code: userCode,
        verification_uri: `${config.getString(
          'app.baseUrl',
        )}${userCodeAuthUrlPath}`,
        verification_uri_complete: `${config.getString(
          'app.baseUrl',
        )}${userCodeAuthUrlPath}?user_code=${userCode}`,
        interval:
          config.getOptionalNumber('deviceAuth.initialInterval') ||
          INITIAL_INTERVAL,
        expires_at: expiresAt,
      });
      return;
    } catch (error) {
      if (error instanceof Error) {
        logger.error(
          `Error saving device code and user code: ${error.message}`,
        );
        response.status(500).json({
          error: `Error saving device code and user code: ${error.message}`,
        });
        return;
      }
    }
  });

  /**
   * POST /token
   *
   * Exchanges the device code and user code for an access token if the user has
   * successfully authenticated and verified the associated user code.
   * After returning the access token, it deletes the device code and user code
   * from the database.
   *
   * @param {Object} request - The request object.
   * @param {Object} request.body - The body of the request.
   * @param {string} request.body.device_code - The device code to be exchanged for an access token.
   * @param {string} request.body.client_id - The client ID of the application.
   * @param {string} request.body.grant_type - The grant type of the request (must be urn:ietf:params:oauth:grant-type:device_code).
   * @returns {void}
   */
  router.post('/token', async (request, response) => {
    if (
      !request.body.grant_type ||
      request.body.grant_type !== 'urn:ietf:params:oauth:grant-type:device_code'
    ) {
      return response.status(400).json({ error: 'invalid_grant' });
    }
    if (!request.body.client_id) {
      return response.status(400).json({ error: 'client_id is required' });
    }
    if (!request.body.device_code) {
      return response.status(400).json({ error: 'device_code is required' });
    }

    // Check if the user code has been verified
    try {
      const userCode = await deviceAuthStore.getByDeviceCode({
        deviceCode: request.body.device_code,
      });

      // Check if the device code has expired
      if (userCode.expiresAt < new Date()) {
        // Delete the device code and user code from the database
        await deviceAuthStore.deleteByDeviceCode({
          deviceCode: request.body.device_code,
        });
        return response.status(400).json({ error: 'expired_token' });
      }

      if (!userCode.isValidated) {
        return response.status(401).json({ error: 'authorization_pending' });
      } else if (
        userCode.accessToken !== null &&
        userCode.accessToken !== undefined
      ) {
        // Remove the device code and user code from the database and return the access token
        await deviceAuthStore.deleteByDeviceCode({
          deviceCode: request.body.device_code,
        });
        return response
          .status(200)
          .json({ access_token: userCode.accessToken });
      }
      return response.status(500).json({ error: 'No access token found' });
    } catch (error) {
      if (error instanceof NotFoundError) {
        return response.status(400).json({ error: 'Invalid user code' });
      }
      if (error instanceof Error) {
        logger.error('Error exchanging device code for access token: ', error);
      }
      return response
        .status(500)
        .json({ error: 'Error exchanging device code for access token' });
    }
  });

  router.get('/health', (_, response) => {
    logger.info('PONG!');
    response.json({ status: 'ok' });
  });

  const middleware = MiddlewareFactory.create({ logger, config });

  router.use(middleware.error());
  return router;
}
