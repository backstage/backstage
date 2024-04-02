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
import express from 'express';
import Router from 'express-promise-router';
import { v4 as uuid } from 'uuid';
import { CatalogApi, CatalogClient } from '@backstage/catalog-client';
import {
  Entity,
  isGroupEntity,
  isUserEntity,
  RELATION_HAS_MEMBER,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import {
  NotificationProcessor,
  NotificationType,
} from '@backstage/plugin-notifications-node';
import { InputError } from '@backstage/errors';
import {
  AuthService,
  DiscoveryService,
  HttpAuthService,
  LoggerService,
} from '@backstage/backend-plugin-api';
import { Notification } from '@backstage/plugin-notifications-common';

/** @internal */
export interface RouterOptions {
  logger: LoggerService;
  discovery: DiscoveryService;
  auth: AuthService;
  httpAuth: HttpAuthService;
  catalog?: CatalogApi;
  processors?: NotificationProcessor[];
}

/** @internal */
export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger, auth, httpAuth, discovery, catalog, processors } = options;

  const catalogClient =
    catalog ?? new CatalogClient({ discoveryApi: discovery });

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

  const decorateNotification = async (
    notification: Notification,
    type: NotificationType,
  ) => {
    let ret = notification;
    for (const processor of processors ?? []) {
      try {
        ret = processor.decorate ? await processor.decorate(ret, type) : ret;
      } catch (e) {
        logger.error(
          `${processor.getName()} failed to decorate notification`,
          e,
        );
      }
    }
    return ret;
  };

  const processorSendNotification = async (
    notification: Notification,
    type: NotificationType,
  ) => {
    for (const processor of processors ?? []) {
      if (processor.send) {
        try {
          await processor.send(notification, type);
        } catch (e) {
          logger.error(`${processor.getName()} failed to send notification`, e);
        }
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

  // Add new notification
  router.post('/', async (req, res) => {
    const { recipients, payload } = req.body;
    const notifications = [];
    let users = [];

    const credentials = await httpAuth.credentials(req, { allow: ['service'] });

    const { title } = payload;

    if (!recipients || !title) {
      logger.error(`Invalid notification request received`);
      throw new InputError();
    }

    const origin = credentials.principal.subject;
    const baseNotification = {
      id: uuid(),
      payload: {
        ...payload,
        severity: payload.severity ?? 'normal',
      },
      origin,
      created: new Date(),
    };

    if (recipients.type === 'broadcast') {
      const notification = await decorateNotification(
        baseNotification,
        'broadcast',
      );
      await processorSendNotification(notification, 'broadcast');
      notifications.push(notification);
    } else {
      const entityRef = recipients.entityRef;
      try {
        users = await getUsersForEntityRef(entityRef);
      } catch (e) {
        throw new InputError();
      }

      const uniqueUsers = [...new Set(users)];
      for (const user of uniqueUsers) {
        const userNotification = {
          ...baseNotification,
          user,
        };
        const notification = await decorateNotification(
          userNotification,
          'user',
        );
        await processorSendNotification(notification, 'user');
        notifications.push(notification);
      }
    }

    res.json(notifications);
  });

  router.use(errorHandler());
  return router;
}
