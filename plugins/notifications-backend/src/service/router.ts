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
import { errorHandler, PluginDatabaseManager } from '@backstage/backend-common';
import express, { Request } from 'express';
import Router from 'express-promise-router';
import {
  DatabaseNotificationsStore,
  normalizeSeverity,
  NotificationGetOptions,
} from '../database';
import { v4 as uuid } from 'uuid';
import { CatalogApi, CatalogClient } from '@backstage/catalog-client';
import {
  Entity,
  isGroupEntity,
  isUserEntity,
  RELATION_HAS_MEMBER,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import { NotificationProcessor } from '@backstage/plugin-notifications-node';
import { InputError } from '@backstage/errors';
import {
  AuthService,
  DiscoveryService,
  HttpAuthService,
  LoggerService,
  UserInfoService,
} from '@backstage/backend-plugin-api';
import { SignalsService } from '@backstage/plugin-signals-node';
import {
  NewNotificationSignal,
  Notification,
  NotificationReadSignal,
} from '@backstage/plugin-notifications-common';
import { parseEntityOrderFieldParams } from './parseEntityOrderFieldParams';

/** @internal */
export interface RouterOptions {
  logger: LoggerService;
  database: PluginDatabaseManager;
  discovery: DiscoveryService;
  auth: AuthService;
  httpAuth: HttpAuthService;
  userInfo: UserInfoService;
  signals?: SignalsService;
  catalog?: CatalogApi;
  processors?: NotificationProcessor[];
}

/** @internal */
export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const {
    logger,
    database,
    auth,
    httpAuth,
    userInfo,
    discovery,
    catalog,
    processors,
    signals,
  } = options;

  const catalogClient =
    catalog ?? new CatalogClient({ discoveryApi: discovery });
  const store = await DatabaseNotificationsStore.create({ database });

  const getUser = async (req: Request<unknown>) => {
    const credentials = await httpAuth.credentials(req, { allow: ['user'] });
    const info = await userInfo.getUserInfo(credentials);
    return info.userEntityRef;
  };

  const getUsersForEntityRef = async (
    entityRef: string | string[] | null,
  ): Promise<string[]> => {
    const { token } = await auth.getPluginRequestToken({
      onBehalfOf: await auth.getOwnServiceCredentials(),
      targetPluginId: 'catalog',
    });

    if (entityRef === null) {
      return [];
    }

    const refs = Array.isArray(entityRef) ? entityRef : [entityRef];
    const entities = await catalogClient.getEntitiesByRefs(
      {
        entityRefs: refs,
        fields: ['kind', 'metadata.name', 'metadata.namespace'],
      },
      { token },
    );
    const mapEntity = async (entity: Entity | undefined): Promise<string[]> => {
      if (!entity) {
        return [];
      }

      if (isUserEntity(entity)) {
        return [stringifyEntityRef(entity)];
      } else if (isGroupEntity(entity) && entity.relations) {
        const users = entity.relations
          .filter(
            relation =>
              relation.type === RELATION_HAS_MEMBER && relation.targetRef,
          )
          .map(r => r.targetRef);
        const childGroups = await catalogClient.getEntitiesByRefs(
          {
            entityRefs: entity.spec.children,
            fields: ['kind', 'metadata.name', 'metadata.namespace'],
          },
          { token },
        );
        const childGroupUsers = await Promise.all(
          childGroups.items.map(mapEntity),
        );
        return [...users, ...childGroupUsers.flat(2)];
      } else if (!isGroupEntity(entity) && entity.spec?.owner) {
        const owner = await catalogClient.getEntityByRef(
          entity.spec.owner as string,
          { token },
        );
        if (owner) {
          return mapEntity(owner);
        }
      }

      return [];
    };

    const users: string[] = [];
    for (const entity of entities.items) {
      const u = await mapEntity(entity);
      users.push(...u);
    }
    return users;
  };

  const decorateNotification = async (notification: Notification) => {
    let ret = notification;
    for (const processor of processors ?? []) {
      ret = processor.decorate ? await processor.decorate(ret) : ret;
    }
    return ret;
  };

  const processorSendNotification = async (notification: Notification) => {
    for (const processor of processors ?? []) {
      if (processor.send) {
        processor.send(notification);
      }
    }
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

  router.get('/status', async (req, res) => {
    const user = await getUser(req);
    const status = await store.getStatus({ user });
    res.send(status);
  });

  router.post('/update', async (req, res) => {
    const user = await getUser(req);
    const { ids, read, saved } = req.body;
    if (!ids || !Array.isArray(ids)) {
      throw new InputError();
    }

    if (read === true) {
      await store.markRead({ user, ids });

      if (signals) {
        await signals.publish<NotificationReadSignal>({
          recipients: { type: 'user', entityRef: [user] },
          message: { action: 'notification_read', notification_ids: ids },
          channel: 'notifications',
        });
      }
    } else if (read === false) {
      await store.markUnread({ user: user, ids });

      if (signals) {
        await signals.publish<NotificationReadSignal>({
          recipients: { type: 'user', entityRef: [user] },
          message: { action: 'notification_unread', notification_ids: ids },
          channel: 'notifications',
        });
      }
    }

    if (saved === true) {
      await store.markSaved({ user: user, ids });
    } else if (saved === false) {
      await store.markUnsaved({ user: user, ids });
    }

    const notifications = await store.getNotifications({ ids, user: user });
    res.status(200).send(notifications);
  });

  const sendBroadcastNotification = async (
    baseNotification: Omit<Notification, 'user' | 'id'>,
    opts: { scope?: string; origin: string },
  ) => {
    const { scope, origin } = opts;
    const broadcastNotification = {
      ...baseNotification,
      id: uuid(),
    };
    const notification = await decorateNotification({
      ...broadcastNotification,
      user: '',
    });
    let existingNotification;
    if (scope) {
      existingNotification = await store.getExistingScopeBroadcast({
        scope,
        origin,
      });
    }

    let ret = notification;
    if (existingNotification) {
      const restored = await store.restoreExistingNotification({
        id: existingNotification.id,
        notification: { ...notification, user: '' },
      });
      ret = restored ?? notification;
    } else {
      await store.saveBroadcast(notification);
    }
    processorSendNotification(ret);

    if (signals) {
      await signals.publish<NewNotificationSignal>({
        recipients: { type: 'broadcast' },
        message: {
          action: 'new_notification',
          notification_id: ret.id,
        },
        channel: 'notifications',
      });
    }
    return notification;
  };

  const sendUserNotifications = async (
    baseNotification: Omit<Notification, 'user' | 'id'>,
    users: string[],
    opts: { scope?: string; origin: string },
  ) => {
    const notifications = [];
    const { scope, origin } = opts;
    const uniqueUsers = [...new Set(users)];
    for (const user of uniqueUsers) {
      const userNotification = {
        ...baseNotification,
        id: uuid(),
        user,
      };
      const notification = await decorateNotification(userNotification);

      let existingNotification;
      if (scope) {
        existingNotification = await store.getExistingScopeNotification({
          user,
          scope,
          origin,
        });
      }

      let ret = notification;
      if (existingNotification) {
        const restored = await store.restoreExistingNotification({
          id: existingNotification.id,
          notification,
        });
        ret = restored ?? notification;
      } else {
        await store.saveNotification(notification);
      }

      processorSendNotification(ret);
      notifications.push(ret);

      if (signals) {
        await signals.publish<NewNotificationSignal>({
          recipients: { type: 'user', entityRef: [user] },
          message: {
            action: 'new_notification',
            notification_id: ret.id,
          },
          channel: 'notifications',
        });
      }
    }
    return notifications;
  };

  // Add new notification
  router.post('/', async (req, res) => {
    const { recipients, payload } = req.body;
    const notifications = [];
    let users = [];

    const credentials = await httpAuth.credentials(req, { allow: ['service'] });

    const { title, scope } = payload;

    if (!recipients || !title) {
      logger.error(`Invalid notification request received`);
      throw new InputError();
    }

    const origin = credentials.principal.subject;
    const baseNotification = {
      payload: {
        ...payload,
        severity: payload.severity ?? 'normal',
      },
      origin,
      created: new Date(),
    };

    if (recipients.type === 'broadcast') {
      const broadcast = await sendBroadcastNotification(baseNotification, {
        scope,
        origin,
      });
      notifications.push(broadcast);
    } else {
      const entityRef = recipients.entityRef;

      try {
        users = await getUsersForEntityRef(entityRef);
      } catch (e) {
        throw new InputError();
      }
      const userNotifications = await sendUserNotifications(
        baseNotification,
        users,
        { scope, origin },
      );
      notifications.push(...userNotifications);
    }

    res.json(notifications);
  });

  router.use(errorHandler());
  return router;
}
