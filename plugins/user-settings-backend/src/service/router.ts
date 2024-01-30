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
import { HttpAuthService } from '@backstage/backend-plugin-api/alpha';
import { IdentityService } from '@backstage/backend-plugin-api';

function createHttpAuthShim(_options: {
  identity: IdentityService;
}): HttpAuthService {
  throw new Error('Not implemented');
}

/**
 * @public
 */
export type RouterOptions =
  | {
      database: PluginDatabaseManager;
      identity: IdentityApi;
    }
  | {
      database: PluginDatabaseManager;
      httpAuth: HttpAuthService;
    };

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
    httpAuth:
      'httpAuth' in options
        ? options.httpAuth
        : createHttpAuthShim({ identity: options.identity }),
  });
}

export async function createRouterInternal(options: {
  httpAuth: HttpAuthService;
  userSettingsStore: UserSettingsStore;
}): Promise<express.Router> {
  const { httpAuth, userSettingsStore } = options;
  const router = Router();

  router.use(httpAuth.middleware({ allow: ['user', 'service'] }));
  router.use(express.json());

  // get a single value
  router.get('/buckets/:bucket/keys/:key', async (req, res) => {
    const { userEntityRef } = httpAuth.credentials(req).user!;
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
    const { userEntityRef } = httpAuth.credentials(req).user!;
    const { bucket, key } = req.params;
    const { value } = req.body;

    if (value === undefined) {
      throw new InputError('Missing required field "value"');
    }

    await userSettingsStore.set({
      userEntityRef,
      bucket,
      key,
      value,
    });
    const setting = await userSettingsStore.get({
      userEntityRef,
      bucket,
      key,
    });

    res.json(setting);
  });

  // get a single value
  router.delete('/buckets/:bucket/keys/:key', async (req, res) => {
    const { userEntityRef } = httpAuth.credentials(req).user!;
    const { bucket, key } = req.params;

    await userSettingsStore.delete({ userEntityRef, bucket, key });

    res.status(204).end();
  });

  router.use(errorHandler());

  return router;
}
