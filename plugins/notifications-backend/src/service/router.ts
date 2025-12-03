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
  normalizeSeverity,
  NotificationGetOptions,
  NotificationsStore,
  TopicGetOptions,
} from '../database';
import { v4 as uuid } from 'uuid';
import { CatalogService } from '@backstage/plugin-catalog-node';
import {
  NotificationProcessor,
  NotificationRecipientResolver,
  NotificationSendOptions,
} from '@backstage/plugin-notifications-node';
import { InputError, NotFoundError } from '@backstage/errors';
import {
  AuthService,
  HttpAuthService,
  LoggerService,
  UserInfoService,
} from '@backstage/backend-plugin-api';
import { SignalsService } from '@backstage/plugin-signals-node';
import {
  ChannelSetting,
  isNotificationsEnabledFor,
  NewNotificationSignal,
  Notification,
  NotificationReadSignal,
  NotificationSettings,
  notificationSeverities,
  NotificationStatus,
  OriginSetting,
} from '@backstage/plugin-notifications-common';
import { parseEntityOrderFieldParams } from './parseEntityOrderFieldParams';
import { Config, readDurationFromConfig } from '@backstage/config';
import { durationToMilliseconds } from '@backstage/types';
import pThrottle from 'p-throttle';
import { parseEntityRef } from '@backstage/catalog-model';
import { DefaultNotificationRecipientResolver } from './DefaultNotificationRecipientResolver.ts';

/** @internal */
export interface RouterOptions {
  logger: LoggerService;
  config: Config;
  store: NotificationsStore;
  auth: AuthService;
  httpAuth: HttpAuthService;
  userInfo: UserInfoService;
  signals?: SignalsService;
  catalog: CatalogService;
  processors?: NotificationProcessor[];
  recipientResolver?: NotificationRecipientResolver;
}

/** @internal */
export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const {
    config,
    logger,
    store,
    auth,
    httpAuth,
    userInfo,
    catalog,
    processors = [],
    signals,
    recipientResolver,
  } = options;

  const WEB_NOTIFICATION_CHANNEL = 'Web';
  const frontendBaseUrl = config.getString('app.baseUrl');
  const concurrencyLimit =
    config.getOptionalNumber('notifications.concurrencyLimit') ?? 10;
  const throttleInterval = config.has('notifications.throttleInterval')
    ? durationToMilliseconds(
        readDurationFromConfig(config, {
          key: 'notifications.throttleInterval',
        }),
      )
    : 50;
  const throttle = pThrottle({
    limit: concurrencyLimit,
    interval: throttleInterval,
  });
  const defaultNotificationSettings: NotificationSettings | undefined =
    config.getOptional<NotificationSettings>('notifications.defaultSettings');

  const usedRecipientResolver =
    recipientResolver ??
    new DefaultNotificationRecipientResolver(auth, catalog);

  const getUser = async (req: Request<unknown>) => {
    const credentials = await httpAuth.credentials(req, { allow: ['user'] });
    const info = await userInfo.getUserInfo(credentials);
    return info.userEntityRef;
  };

  const getNotificationChannels = () => {
    return [WEB_NOTIFICATION_CHANNEL, ...processors.map(p => p.getName())];
  };

  const getTopicSettings = (
    topic: any,
    existingOrigin: OriginSetting | undefined,
    defaultOriginSettings: OriginSetting | undefined,
    channelDefaultEnabled: boolean,
  ) => {
    const existingTopic = existingOrigin?.topics?.find(
      t => t.id.toLowerCase() === topic.topic.toLowerCase(),
    );
    const defaultTopicSettings = defaultOriginSettings?.topics?.find(
      t => t.id.toLowerCase() === topic.topic.toLowerCase(),
    );

    // If topic has explicit setting, use it
    // Otherwise check default topic settings from config
    // Otherwise use channel default (not origin enabled state)
    return {
      id: topic.topic,
      enabled: existingTopic
        ? existingTopic.enabled
        : defaultTopicSettings?.enabled ?? channelDefaultEnabled,
    };
  };

  const getOriginSettings = (
    originId: string,
    existingChannel: ChannelSetting | undefined,
    defaultChannelSettings: ChannelSetting | undefined,
    topics: { origin: string; topic: string }[],
    channelDefaultEnabled: boolean,
    channelHasExplicitEnabled: boolean,
  ) => {
    const existingOrigin = existingChannel?.origins?.find(
      o => o.id.toLowerCase() === originId.toLowerCase(),
    );

    const defaultOriginSettings = defaultChannelSettings?.origins?.find(
      c => c.id.toLowerCase() === originId.toLowerCase(),
    );

    const defaultEnabled = existingOrigin
      ? existingOrigin.enabled
      : defaultOriginSettings?.enabled ?? channelDefaultEnabled;

    return {
      id: originId,
      enabled: defaultEnabled,
      topics: topics
        .filter(t => t.origin === originId)
        .map(t =>
          getTopicSettings(
            t,
            existingOrigin,
            defaultOriginSettings,
            channelHasExplicitEnabled ? channelDefaultEnabled : defaultEnabled,
          ),
        ),
    };
  };

  const getChannelSettings = (
    channelId: string,
    settings: NotificationSettings,
    origins: string[],
    topics: { origin: string; topic: string }[],
  ) => {
    const existingChannel = settings.channels.find(
      c => c.id.toLowerCase() === channelId.toLowerCase(),
    );
    const defaultChannelSettings = defaultNotificationSettings?.channels?.find(
      c => c.id.toLowerCase() === channelId.toLowerCase(),
    );

    // Determine channel enabled state
    const channelEnabled =
      existingChannel?.enabled ?? defaultChannelSettings?.enabled;

    // Use channel's enabled flag as the default for origins if not explicitly set
    const defaultEnabledForOrigins = channelEnabled ?? true;

    // Check if channel has explicit enabled flag (either from user settings or config)
    const channelHasExplicitEnabled =
      existingChannel?.enabled !== undefined ||
      defaultChannelSettings?.enabled !== undefined;

    return {
      id: channelId,
      enabled: channelEnabled,
      origins: origins.map(originId =>
        getOriginSettings(
          originId,
          existingChannel,
          defaultChannelSettings,
          topics,
          defaultEnabledForOrigins,
          channelHasExplicitEnabled,
        ),
      ),
    };
  };

  const getNotificationSettings = async (
    user: string,
  ): Promise<NotificationSettings> => {
    const { origins } = await store.getUserNotificationOrigins({ user });
    const { topics } = await store.getUserNotificationTopics({ user });
    const settings = await store.getNotificationSettings({ user });
    const channels = getNotificationChannels();

    // Merge existing channels/origins/topics with configured settings
    for (const channel of defaultNotificationSettings?.channels ?? []) {
      if (!channels.includes(channel.id)) {
        channels.push(channel.id);
      }

      for (const origin of channel.origins ?? []) {
        if (!origins.includes(origin.id)) {
          origins.push(origin.id);
        }

        for (const topic of origin.topics ?? []) {
          if (
            !topics.some(t => t.origin === origin.id && t.topic === topic.id)
          ) {
            topics.push({ origin: origin.id, topic: topic.id });
          }
        }
      }
    }

    return {
      channels: channels.map(channelId =>
        getChannelSettings(channelId, settings, origins, topics),
      ),
    };
  };

  const isNotificationsEnabled = async (opts: {
    user: string;
    channel: string;
    origin: string;
    topic: string | null;
  }) => {
    // Get user's explicit settings from database
    const userSettings = await store.getNotificationSettings({
      user: opts.user,
    });

    // Build a minimal settings object with user settings and config defaults
    const settings: NotificationSettings = {
      channels: [
        {
          id: opts.channel,
          enabled: defaultNotificationSettings?.channels?.find(
            c => c.id.toLowerCase() === opts.channel.toLowerCase(),
          )?.enabled,
          origins: [],
        },
      ],
    };

    // Add user's channel if it exists
    const userChannel = userSettings.channels.find(
      c => c.id.toLowerCase() === opts.channel.toLowerCase(),
    );
    if (userChannel) {
      settings.channels[0] = {
        ...settings.channels[0],
        enabled: userChannel.enabled ?? settings.channels[0].enabled,
        origins: userChannel.origins ?? [],
      };
    }

    // Add config default origins if not in user settings
    // Only add origins if the channel is enabled (not explicitly disabled)
    const defaultChannelSettings = defaultNotificationSettings?.channels?.find(
      c => c.id.toLowerCase() === opts.channel.toLowerCase(),
    );
    if (
      defaultChannelSettings?.origins &&
      settings.channels[0].enabled !== false
    ) {
      for (const defaultOrigin of defaultChannelSettings.origins) {
        if (
          !settings.channels[0].origins.some(
            o => o.id.toLowerCase() === defaultOrigin.id.toLowerCase(),
          )
        ) {
          settings.channels[0].origins.push(defaultOrigin);
        }
      }
    }

    return isNotificationsEnabledFor(
      settings,
      opts.channel,
      opts.origin,
      opts.topic,
    );
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
          topic: payload.topic ?? null,
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
  ): Promise<NotificationSendOptions> => {
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

  const appendCommonOptions = (
    req: Request,
    opts: NotificationGetOptions | TopicGetOptions,
  ) => {
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
    if (req.query.minimumSeverity) {
      opts.minimumSeverity = normalizeSeverity(
        req.query.minimumSeverity.toString(),
      );
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

    if (req.query.topic) {
      opts.topic = req.query.topic.toString();
    }

    appendCommonOptions(req, opts);

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

  // Get topics
  const listTopicsHandler = async (req: Request, res: Response) => {
    const user = await getUser(req);
    const opts: TopicGetOptions = {
      user: user,
    };

    appendCommonOptions(req, opts);

    const topics = await store.getTopics(opts);
    res.json(topics);
  };

  router.get('/topics', listTopicsHandler);

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
    }
    postProcessNotification(ret, opts);
    return notification;
  };

  const sendUserNotification = async (
    baseNotification: Omit<Notification, 'user' | 'id'>,
    user: string,
    opts: NotificationSendOptions,
    origin: string,
    scope?: string,
  ): Promise<Notification | undefined> => {
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
      topic: userNotification.payload.topic ?? null,
    });

    let ret = notification;

    if (!enabled) {
      postProcessNotification(ret, opts);
      return undefined;
    }

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
    postProcessNotification(ret, opts);
    return ret;
  };

  const filterNonUserEntityRefs = (refs: string[]): string[] => {
    return refs.filter(ref => {
      try {
        const parsed = parseEntityRef(ref);
        return parsed.kind.toLowerCase() === 'user';
      } catch {
        return false;
      }
    });
  };

  const sendUserNotifications = async (
    baseNotification: Omit<Notification, 'user' | 'id'>,
    users: string[],
    opts: NotificationSendOptions,
    origin: string,
  ): Promise<Notification[]> => {
    const { scope } = opts.payload;
    const uniqueUsers = [...new Set(filterNonUserEntityRefs(users))];
    const throttled = throttle((user: string) =>
      sendUserNotification(baseNotification, user, opts, origin, scope),
    );
    const sent = await Promise.all(uniqueUsers.map(user => throttled(user)));
    return sent.filter(n => n !== undefined);
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

    if (!recipients || !title) {
      const missing = [
        !title ? 'title' : null,
        !recipients ? 'recipients' : null,
      ].filter(Boolean);
      const err = `Invalid notification request received: missing ${missing.join(
        ', ',
      )}`;
      throw new InputError(err);
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
    } else if (recipients.type === 'entity') {
      const entityRefs = [recipients.entityRef].flat();
      const excludedEntityRefs = recipients.excludeEntityRef
        ? [recipients.excludeEntityRef].flat()
        : undefined;
      try {
        const { userEntityRefs } =
          await usedRecipientResolver.resolveNotificationRecipients({
            entityRefs,
            excludedEntityRefs,
          });
        const userNotifications = await sendUserNotifications(
          baseNotification,
          userEntityRefs,
          opts,
          origin,
        );
        notifications.push(...userNotifications);
      } catch (e) {
        throw new InputError('Failed to send user notifications', e);
      }
    } else {
      throw new InputError(
        `Invalid recipients type, please use either 'broadcast' or 'entity'`,
      );
    }

    res.json(notifications);
  };

  // Add new notification
  router.post('/', createNotificationHandler);
  router.post('/notifications', createNotificationHandler);

  return router;
}
