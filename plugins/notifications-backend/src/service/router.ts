/*
 * Copyright 2023 The Backstage Authors
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
import express, { Request } from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';
import { NotificationService } from '@backstage/plugin-notifications-node';
import { IdentityApi } from '@backstage/plugin-auth-node';

/** @public */
export interface RouterOptions {
  logger: Logger;
  identity: IdentityApi;
  notificationService: NotificationService;
}

/** @public */
export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger, notificationService, identity } = options;

  const store = await notificationService.getStore();

  const getUser = async (req: Request<unknown>) => {
    const user = await identity.getIdentity({ request: req });
    return user ? user.identity.userEntityRef : 'user:default/guest';
  };

  const router = Router();
  router.use(express.json());

  router.get('/health', (_, response) => {
    logger.info('PONG!');
    response.json({ status: 'ok' });
  });

  router.get('/notifications', async (req, res) => {
    const user = await getUser(req);
    const notifications = await store.getNotifications({ user_ref: user });
    res.send(notifications);
  });

  router.get('/status', async (req, res) => {
    const user = await getUser(req);
    const status = await store.getStatus({ user_ref: user });
    res.send(status);
  });

  // TODO: Add endpoint to set read/unread by notification id(s)

  router.use(errorHandler());
  return router;
}
