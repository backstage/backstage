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

import { InputError } from '@backstage/errors';
import express, { Request } from 'express';
import Router from 'express-promise-router';
import { UserSettingsStore } from '../database/UserSettingsStore';
import { SignalsService } from '@backstage/plugin-signals-node';
import { UserSettingsSignal } from '@backstage/plugin-user-settings-common';
import { HttpAuthService } from '@backstage/backend-plugin-api';

export async function createRouter(options: {
  httpAuth: HttpAuthService;
  userSettingsStore: UserSettingsStore;
  signals: SignalsService;
}): Promise<express.Router> {
  const router = Router();
  router.use(express.json());

  /**
   * Helper method to extract the userEntityRef from the request.
   */
  const getUserEntityRef = async (req: Request): Promise<string> => {
    const credentials = await options.httpAuth.credentials(req, {
      allow: ['user'],
    });
    return credentials.principal.userEntityRef;
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

    if (options.signals) {
      await options.signals.publish<UserSettingsSignal>({
        recipients: { type: 'user', entityRef: userEntityRef },
        channel: `user-settings`,
        message: { type: 'key-changed', key },
      });
    }

    res.json(setting);
  });

  // get a single value
  router.delete('/buckets/:bucket/keys/:key', async (req, res) => {
    const userEntityRef = await getUserEntityRef(req);
    const { bucket, key } = req.params;

    await options.userSettingsStore.delete({ userEntityRef, bucket, key });
    if (options.signals) {
      await options.signals.publish<UserSettingsSignal>({
        recipients: { type: 'user', entityRef: userEntityRef },
        channel: 'user-settings',
        message: { type: 'key-deleted', key },
      });
    }

    res.status(204).end();
  });

  return router;
}
