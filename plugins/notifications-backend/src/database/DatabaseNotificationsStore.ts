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
  DatabaseService,
  resolvePackagePath,
} from '@backstage/backend-plugin-api';
import {
  NotificationGetOptions,
  NotificationModifyOptions,
  NotificationsStore,
  TopicGetOptions,
} from './NotificationsStore';
import {
  Notification,
  NotificationSettings,
  notificationSeverities,
  NotificationSeverity,
} from '@backstage/plugin-notifications-common';
import { Knex } from 'knex';

const migrationsDir = resolvePackagePath(
  '@backstage/plugin-notifications-backend',
  'migrations',
);

const NOTIFICATION_COLUMNS = [
  'id',
  'title',
  'description',
  'severity',
  'link',
  'origin',
  'scope',
  'topic',
  'icon',
  'created',
  'updated',
  'user',
  'read',
  'saved',
];

type NotificationRowType = {
  id: string;
  user: string;
  title: string;
  description?: string | null;
  severity: string;
  link: string | null;
  origin: string;
  scope: string | null;
  topic: string | null;
  created: Date;
  updated: Date | null;
  read: Date | null;
  saved: Date | null;
  icon: string | null;
};

type BroadcastRowType = {
  id: string;
  title: string;
  description: string | null;
  link: string | null;
  origin: string;
  scope: string | null;
  topic: string | null;
  created: Date;
  updated: Date | null;
  icon: string | null;
};

type BroadcastUserStatusRowType = {
  broadcast_id: string;
  user: string;
  read: Date | null;
  saved: Date | null;
};

type UserSettingsRowType = {
  user: string;
  channel: string;
  origin: string;
  enabled: boolean;
};

export const normalizeSeverity = (input?: string): NotificationSeverity => {
  let lower = (input ?? 'normal').toLowerCase() as NotificationSeverity;
  if (notificationSeverities.indexOf(lower) < 0) {
    lower = 'normal';
  }
  return lower;
};

/** @internal */
export class DatabaseNotificationsStore implements NotificationsStore {
  private readonly isSQLite = false;

  private constructor(private readonly db: Knex) {
    this.isSQLite = this.db.client.config.client.includes('sqlite3');
  }

  static async create({
    database,
    skipMigrations,
  }: {
    database: DatabaseService;
    skipMigrations?: boolean;
  }): Promise<DatabaseNotificationsStore> {
    const client = await database.getClient();

    if (!database.migrations?.skip && !skipMigrations) {
      await client.migrate.latest({
        directory: migrationsDir,
      });
    }

    return new DatabaseNotificationsStore(client);
  }

  private mapToInteger = (val: string | number | undefined): number => {
    return typeof val === 'string' ? Number.parseInt(val, 10) : val ?? 0;
  };

  private mapToNotifications = (rows: any[]): Notification[] => {
    return rows.map(row => ({
      id: row.id,
      user: row.user,
      created: new Date(row.created),
      saved: row.saved,
      read: row.read,
      updated: row.updated,
      origin: row.origin,
      payload: {
        title: row.title,
        description: row.description,
        link: row.link,
        topic: row.topic,
        severity: row.severity,
        scope: row.scope,
        icon: row.icon,
      },
    }));
  };

  private mapToNotificationSettings = (rows: any[]): NotificationSettings => {
    return rows.reduce(
      (acc, row) => {
        let chan = acc.channels.find(
          (channel: { id: string }) => channel.id === row.channel,
        );
        if (!chan) {
          acc.channels.push({
            id: row.channel,
            origins: [],
          });
          chan = acc.channels[acc.channels.length - 1];
        }
        chan.origins.push({
          id: row.origin,
          enabled: Boolean(row.enabled),
        });
        return acc;
      },
      { channels: [] },
    );
  };

  private mapNotificationToDbRow = (notification: Notification) => {
    return {
      id: notification.id,
      user: notification.user,
      origin: notification.origin,
      created: notification.created,
      topic: notification.payload?.topic,
      link: notification.payload?.link,
      title: notification.payload?.title,
      description: notification.payload?.description,
      severity: normalizeSeverity(notification.payload?.severity),
      scope: notification.payload?.scope,
      icon: notification.payload.icon,
      saved: notification.saved,
      read: notification.read,
    };
  };

  private mapBroadcastToDbRow = (notification: Notification) => {
    return {
      id: notification.id,
      origin: notification.origin,
      created: notification.created,
      topic: notification.payload?.topic,
      link: notification.payload?.link,
      title: notification.payload?.title,
      description: notification.payload?.description,
      severity: normalizeSeverity(notification.payload?.severity),
      icon: notification.payload.icon,
      scope: notification.payload?.scope,
    };
  };

  private getBroadcastUnion = (user?: string | null) => {
    return this.db<BroadcastRowType>('broadcast')
      .leftJoin('broadcast_user_status', function clause() {
        const join = this.on('id', '=', 'broadcast_user_status.broadcast_id');
        if (user !== null && user !== undefined) {
          join.andOnVal('user', '=', user);
        }
      })
      .select(NOTIFICATION_COLUMNS);
  };

  private getNotificationsBaseQuery = (
    options: NotificationGetOptions | NotificationModifyOptions,
  ) => {
    const { user, orderField } = options;

    const subQuery = this.db<NotificationRowType>('notification')
      .select(NOTIFICATION_COLUMNS)
      .unionAll([this.getBroadcastUnion(user)])
      .as('notifications');

    const query = this.db.from(subQuery).where(q => {
      q.where('user', user).orWhereNull('user');
    });

    if (orderField && orderField.length > 0) {
      orderField.forEach(orderBy => {
        query.orderBy(orderBy.field, orderBy.order);
      });
    } else if (!orderField) {
      query.orderBy('created', 'desc');
    }

    if (options.createdAfter) {
      if (this.isSQLite) {
        query.where('created', '>=', options.createdAfter.valueOf());
      } else {
        query.where('created', '>=', options.createdAfter.toISOString());
      }
    }

    if (options.limit) {
      query.limit(options.limit);
    }

    if (options.offset) {
      query.offset(options.offset);
    }

    if (options.search) {
      query.whereRaw(
        `(LOWER(title) LIKE LOWER(?) OR LOWER(description) LIKE LOWER(?))`,
        [`%${options.search}%`, `%${options.search}%`],
      );
    }

    if (options.ids) {
      query.whereIn('id', options.ids);
    }

    if (options.read) {
      query.whereNotNull('read');
    } else if (options.read === false) {
      query.whereNull('read');
    } // or match both if undefined

    if (options.topic) {
      query.where('topic', '=', options.topic);
    }

    if (options.saved) {
      query.whereNotNull('saved');
    } else if (options.saved === false) {
      query.whereNull('saved');
    } // or match both if undefined

    if (options.minimumSeverity !== undefined) {
      const idx = notificationSeverities.indexOf(options.minimumSeverity);
      const equalOrHigher = notificationSeverities.slice(0, idx + 1);
      query.whereIn('severity', equalOrHigher);
    }

    return query;
  };

  async getNotifications(options: NotificationGetOptions) {
    const notificationQuery = this.getNotificationsBaseQuery(options);
    const notifications = await notificationQuery.select(NOTIFICATION_COLUMNS);
    return this.mapToNotifications(notifications);
  }

  async getNotificationsCount(options: NotificationGetOptions) {
    const countOptions: NotificationGetOptions = { ...options };
    countOptions.limit = undefined;
    countOptions.offset = undefined;
    countOptions.orderField = [];
    const notificationQuery = this.getNotificationsBaseQuery(countOptions);
    const response = await notificationQuery.count('id as CNT');
    return Number(response[0].CNT);
  }

  async saveNotification(notification: Notification) {
    await this.db
      .insert(this.mapNotificationToDbRow(notification))
      .into('notification');
  }

  async saveBroadcast(notification: Notification) {
    await this.db
      .insert(this.mapBroadcastToDbRow(notification))
      .into('broadcast');
    if (notification.saved || notification.read) {
      await this.db
        .insert({
          user: notification.user,
          broadcast_id: notification.id,
          saved: notification.saved,
          read: notification.read,
        })
        .into('broadcast_user_status');
    }
  }

  async getStatus(options: NotificationGetOptions) {
    const notificationQuery = this.getNotificationsBaseQuery({
      ...options,
      orderField: [],
    });
    const readSubQuery = notificationQuery
      .clone()
      .count('id')
      .whereNotNull('read')
      .as('READ');
    const unreadSubQuery = notificationQuery
      .clone()
      .count('id')
      .whereNull('read')
      .as('UNREAD');

    const query = await notificationQuery
      .select(readSubQuery, unreadSubQuery)
      .first();

    return {
      unread: this.mapToInteger((query as any)?.UNREAD),
      read: this.mapToInteger((query as any)?.READ),
    };
  }

  async getExistingScopeNotification(options: {
    user: string;
    scope: string;
    origin: string;
  }) {
    const query = this.db<NotificationRowType>('notification')
      .where('user', options.user)
      .where('scope', options.scope)
      .where('origin', options.origin)
      .limit(1);

    const rows = await query;
    if (!rows || rows.length === 0) {
      return null;
    }
    return this.mapToNotifications(rows)[0];
  }

  async getExistingScopeBroadcast(options: { scope: string; origin: string }) {
    const query = this.db<BroadcastRowType>('broadcast')
      .where('scope', options.scope)
      .where('origin', options.origin)
      .limit(1);

    const rows = await query;
    if (!rows || rows.length === 0) {
      return null;
    }
    return this.mapToNotifications(rows)[0];
  }

  async restoreExistingNotification({
    id,
    notification,
  }: {
    id: string;
    notification: Notification;
  }) {
    const updateColumns = {
      title: notification.payload.title,
      description: notification.payload.description,
      link: notification.payload.link,
      topic: notification.payload.topic,
      updated: new Date(),
      severity: normalizeSeverity(notification.payload?.severity),
      read: null,
    };

    const notificationQuery = this.db('notification')
      .where('id', id)
      .where('user', notification.user);
    const broadcastQuery = this.db('broadcast').where('id', id);

    await Promise.all([
      notificationQuery.update(updateColumns),
      broadcastQuery.update({ ...updateColumns, read: undefined }),
    ]);

    return await this.getNotification({ id, user: notification.user });
  }

  async getNotification(options: {
    id: string;
    user?: string | null;
  }): Promise<Notification | null> {
    const rows = await this.db
      .select('*')
      .from(
        this.db<NotificationRowType>('notification')
          .select(NOTIFICATION_COLUMNS)
          .unionAll([this.getBroadcastUnion(options.user)])
          .as('notifications'),
      )
      .where('id', options.id)
      .limit(1);
    if (!rows || rows.length === 0) {
      return null;
    }
    return this.mapToNotifications(rows)[0];
  }

  private markReadSaved = async (
    ids: string[],
    user: string,
    read?: Date | null,
    saved?: Date | null,
  ) => {
    await this.db<NotificationRowType>('notification')
      .whereIn('id', ids)
      .where('user', user)
      .update({ read, saved });

    const broadcasts = this.mapToNotifications(
      await this.db('broadcast').whereIn('id', ids).select(),
    );

    if (broadcasts.length > 0)
      if (!this.isSQLite) {
        await this.db<BroadcastUserStatusRowType>('broadcast_user_status')
          .insert(
            broadcasts.map(b => ({
              broadcast_id: b.id,
              user,
              read,
              saved,
            })),
          )
          .onConflict(['broadcast_id', 'user'])
          .merge(['read', 'saved']);
      } else {
        // SQLite does not support upsert so fall back to this (mostly for tests and local dev)
        for (const b of broadcasts) {
          const baseQuery = this.db<BroadcastUserStatusRowType>(
            'broadcast_user_status',
          )
            .where('broadcast_id', b.id)
            .where('user', user);
          const exists = await baseQuery.clone().limit(1).select().first();
          if (exists) {
            await baseQuery.clone().update({ read, saved });
          } else {
            await baseQuery
              .clone()
              .insert({ broadcast_id: b.id, user, read, saved });
          }
        }
      }
  };

  async markRead(options: NotificationModifyOptions): Promise<void> {
    await this.markReadSaved(options.ids, options.user, new Date(), undefined);
  }

  async markUnread(options: NotificationModifyOptions): Promise<void> {
    await this.markReadSaved(options.ids, options.user, null, undefined);
  }

  async markSaved(options: NotificationModifyOptions): Promise<void> {
    await this.markReadSaved(options.ids, options.user, undefined, new Date());
  }

  async markUnsaved(options: NotificationModifyOptions): Promise<void> {
    await this.markReadSaved(options.ids, options.user, undefined, null);
  }

  async getUserNotificationOrigins(options: {
    user: string;
  }): Promise<{ origins: string[] }> {
    const rows: { origin: string }[] = await this.db<NotificationRowType>(
      'notification',
    )
      .where('user', options.user)
      .select('origin')
      .distinct();
    return { origins: rows.map(row => row.origin) };
  }

  async getNotificationSettings(options: {
    user: string;
    origin?: string;
    channel?: string;
  }): Promise<NotificationSettings> {
    const settingsQuery = this.db<UserSettingsRowType>('user_settings').where(
      'user',
      options.user,
    );
    if (options.origin) {
      settingsQuery.where('origin', options.origin);
    }

    if (options.channel) {
      settingsQuery.where('channel', options.channel);
    }
    const settings = await settingsQuery.select();
    return this.mapToNotificationSettings(settings);
  }

  async saveNotificationSettings(options: {
    user: string;
    settings: NotificationSettings;
  }): Promise<void> {
    const rows: {
      user: string;
      channel: string;
      origin: string;
      enabled: boolean;
    }[] = [];
    options.settings.channels.map(channel => {
      channel.origins.map(origin => {
        rows.push({
          user: options.user,
          channel: channel.id,
          origin: origin.id,
          enabled: origin.enabled,
        });
      });
    });

    await this.db<UserSettingsRowType>('user_settings')
      .where('user', options.user)
      .delete();
    await this.db<UserSettingsRowType>('user_settings').insert(rows);
  }

  async getTopics(options: TopicGetOptions): Promise<{ topics: string[] }> {
    const notificationQuery = this.getNotificationsBaseQuery({
      ...options,
      orderField: [{ field: 'topic', order: 'asc' }],
    });
    const topics = await notificationQuery
      .whereNotNull('topic')
      .distinct(['topic']);
    return { topics: topics.map(row => row.topic) };
  }
}
