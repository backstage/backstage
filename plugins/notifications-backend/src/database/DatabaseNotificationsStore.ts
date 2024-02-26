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
  PluginDatabaseManager,
  resolvePackagePath,
} from '@backstage/backend-common';
import {
  NotificationGetOptions,
  NotificationModifyOptions,
  NotificationsStore,
} from './NotificationsStore';
import { Notification } from '@backstage/plugin-notifications-common';
import { Knex } from 'knex';

const migrationsDir = resolvePackagePath(
  '@backstage/plugin-notifications-backend',
  'migrations',
);

/** @internal */
export class DatabaseNotificationsStore implements NotificationsStore {
  private constructor(private readonly db: Knex) {}

  static async create({
    database,
    skipMigrations,
  }: {
    database: PluginDatabaseManager;
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
      created: row.created,
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
      severity: notification.payload?.severity,
      scope: notification.payload?.scope,
      saved: notification.saved,
      read: notification.read,
    };
  };

  private getNotificationsBaseQuery = (
    options: NotificationGetOptions | NotificationModifyOptions,
  ) => {
    const { user } = options;
    const isSQLite = this.db.client.config.client.includes('sqlite3');
    // const isPsql = this.db.client.config.client.includes('pg');

    const query = this.db('notification').where('user', user);

    if (options.sort !== undefined && options.sort !== null) {
      query.orderBy(options.sort, options.sortOrder ?? 'desc');
    } else if (options.sort !== null) {
      query.orderBy('created', options.sortOrder ?? 'desc');
    }

    if (options.createdAfter) {
      if (isSQLite) {
        query.where(
          'notification.created',
          '>=',
          options.createdAfter.valueOf(),
        );
      } else {
        query.where(
          'notification.created',
          '>=',
          options.createdAfter.toISOString(),
        );
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
        `(LOWER(notification.title) LIKE LOWER(?) OR LOWER(notification.description) LIKE LOWER(?))`,
        [`%${options.search}%`, `%${options.search}%`],
      );
    }

    if (options.ids) {
      query.whereIn('notification.id', options.ids);
    }

    if (options.read) {
      query.whereNotNull('notification.read');
    } else if (options.read === false) {
      query.whereNull('notification.read');
    } // or match both if undefined

    if (options.saved) {
      query.whereNotNull('notification.saved');
    } else if (options.saved === false) {
      query.whereNull('notification.saved');
    } // or match both if undefined

    return query;
  };

  async getNotifications(options: NotificationGetOptions) {
    const notificationQuery = this.getNotificationsBaseQuery(options);
    const notifications = await notificationQuery.select();
    return this.mapToNotifications(notifications);
  }

  async getNotificationsCount(options: NotificationGetOptions) {
    const countOptions: NotificationGetOptions = { ...options };
    countOptions.limit = undefined;
    countOptions.offset = undefined;
    countOptions.sort = null;
    const notificationQuery = this.getNotificationsBaseQuery(countOptions);
    const response = await notificationQuery.count('* as CNT');
    const totalCount = Number.parseInt(response[0].CNT.toString(), 10);
    return totalCount;
  }

  async saveNotification(notification: Notification) {
    await this.db
      .insert(this.mapNotificationToDbRow(notification))
      .into('notification');
  }

  async getStatus(options: NotificationGetOptions) {
    const notificationQuery = this.getNotificationsBaseQuery({
      ...options,
      sort: null,
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
    const query = this.db('notification')
      .where('user', options.user)
      .where('scope', options.scope)
      .where('origin', options.origin)
      .select()
      .limit(1);

    const rows = await query;
    if (!rows || rows.length === 0) {
      return null;
    }
    return rows[0] as Notification;
  }

  async restoreExistingNotification(options: {
    id: string;
    notification: Notification;
  }) {
    const query = this.db('notification')
      .where('id', options.id)
      .where('user', options.notification.user);

    await query.update({
      title: options.notification.payload.title,
      description: options.notification.payload.description,
      link: options.notification.payload.link,
      topic: options.notification.payload.topic,
      updated: new Date(),
      severity: options.notification.payload.severity,
      read: null,
    });

    return await this.getNotification(options);
  }

  async getNotification(options: { id: string }): Promise<Notification | null> {
    const rows = await this.db('notification')
      .where('id', options.id)
      .select()
      .limit(1);
    if (!rows || rows.length === 0) {
      return null;
    }
    return this.mapToNotifications(rows)[0];
  }

  async markRead(options: NotificationModifyOptions): Promise<void> {
    const notificationQuery = this.getNotificationsBaseQuery(options);
    await notificationQuery.update({ read: new Date() });
  }

  async markUnread(options: NotificationModifyOptions): Promise<void> {
    const notificationQuery = this.getNotificationsBaseQuery(options);
    await notificationQuery.update({ read: null });
  }

  async markSaved(options: NotificationModifyOptions): Promise<void> {
    const notificationQuery = this.getNotificationsBaseQuery(options);
    await notificationQuery.update({ saved: new Date() });
  }

  async markUnsaved(options: NotificationModifyOptions): Promise<void> {
    const notificationQuery = this.getNotificationsBaseQuery(options);
    await notificationQuery.update({ saved: null });
  }
}
