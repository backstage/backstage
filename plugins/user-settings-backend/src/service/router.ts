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

import { errorHandler } from '@backstage/backend-common';
import { AuthenticationError, InputError } from '@backstage/errors';
import {
  getBearerTokenFromAuthorizationHeader,
  IdentityClient,
} from '@backstage/plugin-auth-node';
import express, { Request } from 'express';
import Router from 'express-promise-router';
import { UserSettingsStore } from '../database';

/**
 * @public
 */
export interface RouterOptions<T> {
  userSettingsStore: UserSettingsStore<T>;
  identity: IdentityClient;
}

/**
 * Create the user settings backend routes.
 *
 * @public
 */
export async function createRouter<T>(
  options: RouterOptions<T>,
): Promise<express.Router> {
  const { userSettingsStore, identity } = options;
  const router = Router();
  router.use(express.json());

  /**
   * Helper method to extract the userEntityRef from the request.
   */
  const getUserEntityRef = async (req: Request): Promise<string> => {
    const token = getBearerTokenFromAuthorizationHeader(
      req.header('authorization'),
    );

    if (!token) {
      throw new AuthenticationError(`Missing token in 'authorization' header`);
    }

    // throws an AuthenticationError in case the token is invalid
    const user = await identity.authenticate(token);

    return user.identity.userEntityRef;
  };

  // get all user related settings
  router.get('/buckets', async (req, res) => {
    const userEntityRef = await getUserEntityRef(req);

    const settings = await userSettingsStore.transaction(tx =>
      userSettingsStore.getAll(tx, { userEntityRef }),
    );

    res.json(settings);
  });

  // remove all user related settings
  router.delete('/buckets', async (req, res) => {
    const userEntityRef = await getUserEntityRef(req);

    await userSettingsStore.transaction(tx =>
      userSettingsStore.deleteAll(tx, { userEntityRef }),
    );

    res.send(204).end();
  });

  // get a single bucket
  router.get('/buckets/:bucket', async (req, res) => {
    const userEntityRef = await getUserEntityRef(req);
    const { bucket } = req.params;

    const settings = await userSettingsStore.transaction(tx =>
      userSettingsStore.getBucket(tx, { userEntityRef, bucket }),
    );

    res.json(settings);
  });

  // delete a whole bucket
  router.delete('/buckets/:bucket', async (req, res) => {
    const userEntityRef = await getUserEntityRef(req);
    const { bucket } = req.params;

    await userSettingsStore.transaction(tx =>
      userSettingsStore.deleteBucket(tx, { userEntityRef, bucket }),
    );

    res.status(204).end();
  });

  // get a single value
  router.get('/buckets/:bucket/keys/:key', async (req, res) => {
    const userEntityRef = await getUserEntityRef(req);
    const { bucket, key } = req.params;

    const setting = await userSettingsStore.transaction(tx =>
      userSettingsStore.get(tx, { userEntityRef, bucket, key }),
    );

    res.json(setting);
  });

  // set a single value
  router.put('/buckets/:bucket/keys/:key', async (req, res) => {
    const userEntityRef = await getUserEntityRef(req);
    const { bucket, key } = req.params;
    const { value } = req.body;

    if (typeof value !== 'string') {
      throw new InputError('Value must be a string');
    }

    const setting = await userSettingsStore.transaction(async tx => {
      await userSettingsStore.set(tx, {
        userEntityRef,
        bucket,
        key,
        value,
      });
      return userSettingsStore.get(tx, { userEntityRef, bucket, key });
    });

    res.json(setting);
  });

  // get a single value
  router.delete('/buckets/:bucket/keys/:key', async (req, res) => {
    const userEntityRef = await getUserEntityRef(req);
    const { bucket, key } = req.params;

    await userSettingsStore.transaction(tx =>
      userSettingsStore.delete(tx, { userEntityRef, bucket, key }),
    );

    res.send(204).end();
  });

  router.use(errorHandler());

  return router;
}
