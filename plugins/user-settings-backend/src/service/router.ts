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

import { InputError, serializeError } from '@backstage/errors';
import express, { Request } from 'express';
import Router from 'express-promise-router';
import pLimit from 'p-limit';
import { UserSettingsStore } from '../database/UserSettingsStore';
import { SignalsService } from '@backstage/plugin-signals-node';
import {
  MultiUserSetting,
  UserSettingsSignal,
  parseDataLoaderKey,
} from '@backstage/plugin-user-settings-common';
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

  // get multiple values
  router.get('/multi', async (req, res) => {
    const userEntityRef = await getUserEntityRef(req);

    const bucketsAndKeys: ReturnType<typeof parseDataLoaderKey>[] = [];

    const items = req.query.items;
    if (typeof items === 'string') {
      bucketsAndKeys.push(parseDataLoaderKey(items));
    } else if (Array.isArray(items)) {
      bucketsAndKeys.push(
        ...items.map(item => {
          if (typeof item !== 'string') {
            throw new InputError(
              'Expected query param "items" to be an array of strings',
            );
          }
          return parseDataLoaderKey(item);
        }),
      );
    } else {
      throw new InputError('Expected query param "items" to be an array');
    }

    const limit = pLimit(10);

    const userSettings = await Promise.all(
      bucketsAndKeys.map(({ bucket, key }) =>
        limit(async (): Promise<MultiUserSetting> => {
          try {
            const setting = await options.userSettingsStore.get({
              userEntityRef,
              bucket,
              key,
            });
            return setting;
          } catch (e) {
            if (e instanceof Error) {
              const serialized = serializeError(e);
              return { bucket, key, error: serialized };
            }

            return {
              bucket,
              key,
              error: { name: 'Error', message: 'Unknown error' },
            };
          }
        }),
      ),
    );

    res.json(userSettings);
  });

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
