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

import express, { Request, Response } from 'express';
import Router from 'express-promise-router';
import {
  DatabaseNotificationsStore,
  normalizeSeverity,
  NotificationGetOptions,
} from '../database';
import { v4 as uuid } from 'uuid';
import { CatalogApi } from '@backstage/catalog-client';
import {
  NotificationProcessor,
  NotificationSendOptions,
} from '@backstage/plugin-notifications-node';
import { InputError, NotFoundError } from '@backstage/errors';
import {
  AuthService,
  DatabaseService,
  HttpAuthService,
  LoggerService,
  UserInfoService,
} from '@backstage/backend-plugin-api';
import { SignalsService } from '@backstage/plugin-signals-node';
import {
  isNotificationsEnabledFor,
  NewNotificationSignal,
  Notification,
  NotificationReadSignal,
  NotificationSettings,
  notificationSeverities,
  NotificationStatus,
} from '@backstage/plugin-notifications-common';
import { parseEntityOrderFieldParams } from './parseEntityOrderFieldParams';
import { getUsersForEntityRef } from './getUsersForEntityRef';
import { Config } from '@backstage/config';

/** @internal */
export interface RouterOptions {
  logger: LoggerService;
  config: Config;
  database: DatabaseService;
  auth: AuthService;
  httpAuth: HttpAuthService;
  userInfo: UserInfoService;
  signals?: SignalsService;
  catalog: CatalogApi;
  processors?: NotificationProcessor[];
}

/** @internal */
export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const {
    config,
    logger,
    database,
    auth,
    httpAuth,
    userInfo,
    catalog,
    processors = [],
    signals,
  } = options;

  const WEB_NOTIFICATION_CHANNEL = 'Web';
  const store = await DatabaseNotificationsStore.create({ database });
  const frontendBaseUrl = config.getString('app.baseUrl');

  const getUser = async (req: Request<unknown>) => {
    const credentials = await httpAuth.credentials(req, { allow: ['user'] });
    const info = await userInfo.getUserInfo(credentials);
    return info.userEntityRef;
  };

  const getNotificationChannels = () => {
    return [WEB_NOTIFICATION_CHANNEL, ...processors.map(p => p.getName())];
  };

  const getNotificationSettings = async (user: string) => {
    const { origins } = await store.getUserNotificationOrigins({ user });
    const settings = await store.getNotificationSettings({ user });
    const channels = getNotificationChannels();

    const response: NotificationSettings = {
      channels: channels.map(channel => {
        const channelSettings = settings.channels.find(c => c.id === channel);
        if (channelSettings) {
          return channelSettings;
        }
        return {
          id: channel,
          origins: origins.map(origin => ({
            id: origin,
            enabled: true,
          })),
        };
      }),
    };
    return response;
  };

  const isNotificationsEnabled = async (opts: {
    user: string;
    channel: string;
    origin: string;
  }) => {
    const settings = await getNotificationSettings(opts.user);
    return isNotificationsEnabledFor(settings, opts.channel, opts.origin);
  };

  const filterProcessors = async (
    notification:
      | Notification
      | ({ origin: string; user: null } & NotificationSendOptions),
  ) => {
    const result: NotificationProcessor[] = [];
    const { payload, user, origin } = notification;

    for (const processor of processors) {
      if (user) {
        const enabled = await isNotificationsEnabled({
          user,
          origin,
          channel: processor.getName(),
        });
        if (!enabled) {
          continue;
        }
      }

      if (processor.getNotificationFilters) {
        const filters = processor.getNotificationFilters();
        if (filters.minSeverity) {
          if (
            notificationSeverities.indexOf(payload.severity ?? 'normal') >
            notificationSeverities.indexOf(filters.minSeverity)
          ) {
            continue;
          }
        }

        if (filters.maxSeverity) {
          if (
            notificationSeverities.indexOf(payload.severity ?? 'normal') <
            notificationSeverities.indexOf(filters.maxSeverity)
          ) {
            continue;
          }
        }

        if (filters.excludedTopics && payload.topic) {
          if (filters.excludedTopics.includes(payload.topic)) {
            continue;
          }
        }
      }
      result.push(processor);
    }

    return result;
  };

  const processOptions = async (
    opts: NotificationSendOptions,
    origin: string,
  ) => {
    const filtered = await filterProcessors({ ...opts, origin, user: null });
    let ret = opts;
    for (const processor of filtered) {
      try {
        ret = processor.processOptions
          ? await processor.processOptions(ret)
          : ret;
      } catch (e) {
        logger.error(
          `Error while processing notification options with ${processor.getName()}: ${e}`,
        );
      }
    }
    return ret;
  };

  const preProcessNotification = async (
    notification: Notification,
    opts: NotificationSendOptions,
  ) => {
    const filtered = await filterProcessors(notification);
    let ret = notification;
    for (const processor of filtered) {
      try {
        ret = processor.preProcess
          ? await processor.preProcess(ret, opts)
          : ret;
      } catch (e) {
        logger.error(
          `Error while pre processing notification with ${processor.getName()}: ${e}`,
        );
      }
    }
    return ret;
  };

  const postProcessNotification = async (
    notification: Notification,
    opts: NotificationSendOptions,
  ) => {
    const filtered = await filterProcessors(notification);
    for (const processor of filtered) {
      if (processor.postProcess) {
        try {
          await processor.postProcess(notification, opts);
        } catch (e) {
          logger.error(
            `Error while post processing notification with ${processor.getName()}: ${e}`,
          );
        }
      }
    }
  };

  const validateLink = (link: string) => {
    const stripLeadingSlash = (s: string) => s.replace(/^\//, '');
    const ensureTrailingSlash = (s: string) => s.replace(/\/?$/, '/');
    const url = new URL(
      stripLeadingSlash(link),
      ensureTrailingSlash(frontendBaseUrl),
    );
    if (url.protocol !== 'https:' && url.protocol !== 'http:') {
      throw new Error('Only HTTP/HTTPS links are allowed');
    }
  };

  // TODO: Move to use OpenAPI router instead
  const router = Router();
  router.use(express.json());

  const listNotificationsHandler = async (req: Request, res: Response) => {
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

    if (req.query.topic) {
      opts.topic = req.query.topic.toString();
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
    if (req.query.minimumSeverity) {
      opts.minimumSeverity = normalizeSeverity(
        req.query.minimumSeverity.toString(),
      );
    }

    const [notifications, totalCount] = await Promise.all([
      store.getNotifications(opts),
      store.getNotificationsCount(opts),
    ]);
    res.json({
      totalCount,
      notifications,
    });
  };

  router.get('/', listNotificationsHandler); // Deprecated endpoint
  router.get('/notifications', listNotificationsHandler);

  router.get('/status', async (req: Request<any, NotificationStatus>, res) => {
    const user = await getUser(req);
    const status = await store.getStatus({ user });
    res.json(status);
  });

  router.get(
    '/settings',
    async (req: Request<any, NotificationSettings>, res) => {
      const user = await getUser(req);
      const response = await getNotificationSettings(user);
      res.json(response);
    },
  );

  router.post(
    '/settings',
    async (
      req: Request<any, NotificationSettings, NotificationSettings>,
      res,
    ) => {
      const user = await getUser(req);
      const channels = getNotificationChannels();
      const settings: NotificationSettings = req.body;
      if (settings.channels.some(c => !channels.includes(c.id))) {
        throw new InputError('Invalid channel');
      }
      await store.saveNotificationSettings({ user, settings });
      const response = await getNotificationSettings(user);
      res.json(response);
    },
  );

  const getNotificationHandler = async (req: Request, res: Response) => {
    const user = await getUser(req);
    const opts: NotificationGetOptions = {
      user: user,
      limit: 1,
      ids: [req.params.id],
    };
    const notifications = await store.getNotifications(opts);
    if (notifications.length !== 1) {
      throw new NotFoundError('Not found');
    }
    res.json(notifications[0]);
  };

  // Make sure this is the last "GET" handler
  router.get('/:id', getNotificationHandler); // Deprecated endpoint
  router.get('/notifications/:id', getNotificationHandler);

  const updateNotificationsHandler = async (req: Request, res: Response) => {
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
    res.json(notifications);
  };

  router.post('/update', updateNotificationsHandler); // Deprecated endpoint
  router.post('/notifications/update', updateNotificationsHandler);

  const sendBroadcastNotification = async (
    baseNotification: Omit<Notification, 'user' | 'id'>,
    opts: NotificationSendOptions,
    origin: string,
  ) => {
    const { scope } = opts.payload;
    const broadcastNotification = {
      ...baseNotification,
      user: null,
      id: uuid(),
    };
    const notification = await preProcessNotification(
      broadcastNotification,
      opts,
    );
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

    if (signals) {
      await signals.publish<NewNotificationSignal>({
        recipients: { type: 'broadcast' },
        message: {
          action: 'new_notification',
          notification_id: ret.id,
        },
        channel: 'notifications',
      });
      postProcessNotification(ret, opts);
    }
    return notification;
  };

  const sendUserNotifications = async (
    baseNotification: Omit<Notification, 'user' | 'id'>,
    users: string[],
    opts: NotificationSendOptions,
    origin: string,
  ) => {
    const notifications = [];
    const { scope } = opts.payload;
    const uniqueUsers = [...new Set(users)];
    for (const user of uniqueUsers) {
      const userNotification = {
        ...baseNotification,
        id: uuid(),
        user,
      };
      const notification = await preProcessNotification(userNotification, opts);

      const enabled = await isNotificationsEnabled({
        user,
        channel: WEB_NOTIFICATION_CHANNEL,
        origin: userNotification.origin,
      });

      let ret = notification;
      if (enabled) {
        let existingNotification;
        if (scope) {
          existingNotification = await store.getExistingScopeNotification({
            user,
            scope,
            origin,
          });
        }

        if (existingNotification) {
          const restored = await store.restoreExistingNotification({
            id: existingNotification.id,
            notification,
          });
          ret = restored ?? notification;
        } else {
          await store.saveNotification(notification);
        }

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
      postProcessNotification(ret, opts);
    }
    return notifications;
  };

  const createNotificationHandler = async (
    req: Request<any, Notification[], NotificationSendOptions>,
    res: Response,
  ) => {
    const credentials = await httpAuth.credentials(req, {
      allow: ['service'],
    });

    const origin = credentials.principal.subject;
    const opts = await processOptions(req.body, origin);
    const { recipients, payload } = opts;
    const { title, link } = payload;
    const notifications: Notification[] = [];
    let users = [];

    if (!recipients || !title) {
      logger.error(`Invalid notification request received`);
      throw new InputError(`Invalid notification request received`);
    }

    if (link) {
      try {
        validateLink(link);
      } catch (e) {
        throw new InputError('Invalid link provided', e);
      }
    }

    const baseNotification = {
      payload: {
        ...payload,
        severity: payload.severity ?? 'normal',
      },
      origin,
      created: new Date(),
    };

    if (recipients.type === 'broadcast') {
      const broadcast = await sendBroadcastNotification(
        baseNotification,
        opts,
        origin,
      );
      notifications.push(broadcast);
    } else {
      const entityRef = recipients.entityRef;

      try {
        users = await getUsersForEntityRef(
          entityRef,
          recipients.excludeEntityRef ?? [],
          { auth, catalogClient: catalog },
        );
      } catch (e) {
        logger.error(`Failed to resolve notification receivers: ${e}`);
        throw new InputError('Failed to resolve notification receivers', e);
      }

      const userNotifications = await sendUserNotifications(
        baseNotification,
        users,
        opts,
        origin,
      );
      notifications.push(...userNotifications);
    }

    res.json(notifications);
  };

  // Add new notification
  router.post('/', createNotificationHandler);
  router.post('/notifications', createNotificationHandler);

  return router;
}
