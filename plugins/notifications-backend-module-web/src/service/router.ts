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
import {
  normalizeSeverity,
  NotificationGetOptions,
  NotificationsStore,
} from '../database';
import { InputError } from '@backstage/errors';
import {
  HttpAuthService,
  LoggerService,
  UserInfoService,
} from '@backstage/backend-plugin-api';
import { SignalsService } from '@backstage/plugin-signals-node';
import { NotificationReadSignal } from '@backstage/plugin-notifications-common';
import { parseEntityOrderFieldParams } from './parseEntityOrderFieldParams';

/** @internal */
export interface RouterOptions {
  logger: LoggerService;
  store: NotificationsStore;
  httpAuth: HttpAuthService;
  userInfo: UserInfoService;
  signals: SignalsService;
}

/** @internal */
export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger, store, httpAuth, userInfo, signals } = options;

  const getUser = async (req: Request<unknown>) => {
    const credentials = await httpAuth.credentials(req, { allow: ['user'] });
    const info = await userInfo.getUserInfo(credentials);
    return info.userEntityRef;
  };

  // TODO: Move to use OpenAPI router instead
  const router = Router();
  router.use(express.json());

  router.get('/health', (_, response) => {
    logger.info('PONG!');
    response.json({ status: 'ok' });
  });

  router.get('/', async (req, res) => {
    const user = await getUser(req);
    const opts: NotificationGetOptions = {
      user: user,
    };
    if (req.query.offset) {
      opts.offset = Number.parseInt(req.query.offset.toString(), 10);
    }
    if (req.query.limit) {
      opts.limit = Number.parseInt(req.query.limit.toString(), 10);
    }
    if (req.query.orderField) {
      opts.orderField = parseEntityOrderFieldParams(req.query);
    }
    if (req.query.search) {
      opts.search = req.query.search.toString();
    }
    if (req.query.read === 'true') {
      opts.read = true;
    } else if (req.query.read === 'false') {
      opts.read = false;
      // or keep undefined
    }
    if (req.query.saved === 'true') {
      opts.saved = true;
    } else if (req.query.saved === 'false') {
      opts.saved = false;
      // or keep undefined
    }
    if (req.query.createdAfter) {
      const sinceEpoch = Date.parse(String(req.query.createdAfter));
      if (isNaN(sinceEpoch)) {
        throw new InputError('Unexpected date format');
      }
      opts.createdAfter = new Date(sinceEpoch);
    }
    if (req.query.minimal_severity) {
      opts.minimumSeverity = normalizeSeverity(
        req.query.minimal_severity.toString(),
      );
    }

    const [notifications, totalCount] = await Promise.all([
      store.getNotifications(opts),
      store.getNotificationsCount(opts),
    ]);
    res.send({
      totalCount,
      notifications,
    });
  });

  router.get('/status', async (req, res) => {
    const user = await getUser(req);
    const status = await store.getStatus({ user });
    res.send(status);
  });

  router.get('/:id', async (req, res) => {
    const user = await getUser(req);
    const opts: NotificationGetOptions = {
      user: user,
      limit: 1,
      ids: [req.params.id],
    };
    const notifications = await store.getNotifications(opts);
    if (notifications.length !== 1) {
      res.status(404).send({ error: 'Not found' });
      return;
    }
    res.send(notifications[0]);
  });

  router.post('/update', async (req, res) => {
    const user = await getUser(req);
    const { ids, read, saved } = req.body;
    if (!ids || !Array.isArray(ids)) {
      throw new InputError();
    }

    if (read === true) {
      await store.markRead({ user, ids });
      await signals.publish<NotificationReadSignal>({
        recipients: { type: 'user', entityRef: [user] },
        message: { action: 'notification_read', notification_ids: ids },
        channel: 'notifications',
      });
    } else if (read === false) {
      await store.markUnread({ user: user, ids });
      await signals.publish<NotificationReadSignal>({
        recipients: { type: 'user', entityRef: [user] },
        message: { action: 'notification_unread', notification_ids: ids },
        channel: 'notifications',
      });
    }

    if (saved === true) {
      await store.markSaved({ user: user, ids });
    } else if (saved === false) {
      await store.markUnsaved({ user: user, ids });
    }

    const notifications = await store.getNotifications({ ids, user: user });
    res.status(200).send(notifications);
  });

  router.use(errorHandler());
  return router;
}
