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

import { errorHandler, PluginDatabaseManager } from '@backstage/backend-common';
import { AuthenticationError, InputError } from '@backstage/errors';
import { IdentityApi } from '@backstage/plugin-auth-node';
import express, { Request } from 'express';
import Router from 'express-promise-router';
import { DatabaseUserSettingsStore } from '../database/DatabaseUserSettingsStore';
import { UserSettingsStore } from '../database/UserSettingsStore';

/**
 * @public
 */
export interface RouterOptions {
  database: PluginDatabaseManager;
  identity: IdentityApi;
}

/**
 * Create the user settings backend routes.
 *
 * @public
 */
export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const userSettingsStore = await DatabaseUserSettingsStore.create({
    database: options.database,
  });

  return await createRouterInternal({
    userSettingsStore,
    identity: options.identity,
  });
}

export async function createRouterInternal(options: {
  identity: IdentityApi;
  userSettingsStore: UserSettingsStore;
}): Promise<express.Router> {
  const router = Router();
  router.use(express.json());

  /**
   * Helper method to extract the userEntityRef from the request.
   */
  const getUserEntityRef = async (req: Request): Promise<string> => {
    // throws an AuthenticationError in case the token exists but is invalid
    const identity = await options.identity.getIdentity({ request: req });
    if (!identity) {
      throw new AuthenticationError(`Missing token in 'authorization' header`);
    }

    return identity.identity.userEntityRef;
  };

  // get a single value
  router.get('/buckets/:bucket/keys/:key', async (req, res) => {
    const userEntityRef = await getUserEntityRef(req);
    const { bucket, key } = req.params;

    const setting = await options.userSettingsStore.get({
      userEntityRef,
      bucket,
      key,
    });

    res.json(setting);
  });

  // set a single value
  router.put('/buckets/:bucket/keys/:key', async (req, res) => {
    const userEntityRef = await getUserEntityRef(req);
    const { bucket, key } = req.params;
    const { value } = req.body;

    if (value === undefined) {
      throw new InputError('Missing required field "value"');
    }

    await options.userSettingsStore.set({
      userEntityRef,
      bucket,
      key,
      value,
    });
    const setting = await options.userSettingsStore.get({
      userEntityRef,
      bucket,
      key,
    });

    res.json(setting);
  });

  // get a single value
  router.delete('/buckets/:bucket/keys/:key', async (req, res) => {
    const userEntityRef = await getUserEntityRef(req);
    const { bucket, key } = req.params;

    await options.userSettingsStore.delete({ userEntityRef, bucket, key });

    res.status(204).end();
  });

  router.use(errorHandler());

  return router;
}
