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
import {
  createLegacyAuthAdapters,
  errorHandler,
  PluginDatabaseManager,
  TokenManager,
} from '@backstage/backend-common';
import express, { Request } from 'express';
import Router from 'express-promise-router';
import { IdentityApi } from '@backstage/plugin-auth-node';
import {
  DatabaseNotificationsStore,
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
import { AuthenticationError, InputError } from '@backstage/errors';
import {
  AuthService,
  DiscoveryService,
  HttpAuthService,
  LoggerService,
} from '@backstage/backend-plugin-api';
import { SignalService } from '@backstage/plugin-signals-node';
import {
  NewNotificationSignal,
  Notification,
  NotificationReadSignal,
  NotificationType,
} from '@backstage/plugin-notifications-common';

/** @internal */
export interface RouterOptions {
  logger: LoggerService;
  identity: IdentityApi;
  database: PluginDatabaseManager;
  tokenManager: TokenManager;
  discovery: DiscoveryService;
  signalService?: SignalService;
  catalog?: CatalogApi;
  processors?: NotificationProcessor[];
  auth?: AuthService;
  httpAuth?: HttpAuthService;
}

/** @internal */
export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const {
    logger,
    database,
    identity,
    discovery,
    catalog,
    processors,
    signalService,
  } = options;

  const catalogClient =
    catalog ?? new CatalogClient({ discoveryApi: discovery });
  const store = await DatabaseNotificationsStore.create({ database });

  const { auth, httpAuth } = createLegacyAuthAdapters(options);

  const getUser = async (req: Request<unknown>) => {
    const user = await identity.getIdentity({ request: req });
    if (!user) {
      throw new AuthenticationError();
    }
    return user.identity.userEntityRef;
  };

  const getUsersForEntityRef = async (
    entityRef: string | string[] | null,
  ): Promise<string[]> => {
    const { token } = await auth.getPluginRequestToken({
      onBehalfOf: await auth.getOwnServiceCredentials(),
      targetPluginId: 'catalog',
    });

    // TODO: Support for broadcast
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
    let ret: Notification = notification;
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
    if (req.query.type) {
      opts.type = req.query.type.toString() as NotificationType;
    }
    if (req.query.offset) {
      opts.offset = Number.parseInt(req.query.offset.toString(), 10);
    }
    if (req.query.limit) {
      opts.limit = Number.parseInt(req.query.limit.toString(), 10);
    }
    if (req.query.search) {
      opts.search = req.query.search.toString();
    }

    const notifications = await store.getNotifications(opts);
    res.send(notifications);
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
    const status = await store.getStatus({ user, type: 'undone' });
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

      if (signalService) {
        await signalService.publish<NotificationReadSignal>({
          recipients: [user],
          message: { action: 'notification_read', notification_ids: ids },
          channel: 'notifications',
        });
      }
    } else if (read === false) {
      await store.markUnread({ user: user, ids });

      if (signalService) {
        await signalService.publish<NotificationReadSignal>({
          recipients: [user],
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

  // Add new notification
  // Allowed only for service-to-service authentication, uses `getUsersForEntityRef` to retrieve recipients for
  // specific entity reference
  router.post('/', async (req, res) => {
    const { recipients, origin, payload } = req.body;
    const notifications = [];
    let users = [];

    await httpAuth.credentials(req, { allow: ['service'] });

    const { title, link, scope } = payload;

    if (!recipients || !title || !origin || !link) {
      logger.error(`Invalid notification request received`);
      throw new InputError();
    }

    let entityRef = null;
    // TODO: Support for broadcast notifications
    if (recipients.entityRef && recipients.type === 'entity') {
      entityRef = recipients.entityRef;
    }

    try {
      users = await getUsersForEntityRef(entityRef);
    } catch (e) {
      throw new InputError();
    }

    const baseNotification: Omit<Notification, 'id' | 'user'> = {
      payload: {
        ...payload,
        severity: payload.severity ?? 'normal',
      },
      origin,
      created: new Date(),
    };

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

      if (signalService) {
        await signalService.publish<NewNotificationSignal>({
          recipients: user,
          message: {
            action: 'new_notification',
            notification_id: ret.id,
          },
          channel: 'notifications',
        });
      }
    }

    res.json(notifications);
  });

  router.use(errorHandler());
  return router;
}
