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

/** @public */
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

  private getNotificationsBaseQuery = (
    options: NotificationGetOptions | NotificationModifyOptions,
  ) => {
    const { user_ref, type } = options;
    const query = this.db('notifications')
      .where('userRef', user_ref)
      .orderBy('created', 'desc');

    if (type === 'undone') {
      query.whereNull('done');
    } else if (type === 'done') {
      query.whereNotNull('done');
    } else if (type === 'saved') {
      query.where('saved', true);
    }

    if (options.limit) {
      query.limit(options.limit);
    }

    if (options.offset) {
      query.offset(options.offset);
    }

    if (options.search) {
      if (this.db.client.config.client === 'pg') {
        query.whereRaw(
          `(to_tsvector('english', notifications.title || ' ' || notifications.description) @@ websearch_to_tsquery('english', quote_literal(?))
          or to_tsvector('english', notifications.title || ' ' || notifications.description) @@ to_tsquery('english',quote_literal(?)))`,
          [`${options.search}`, `${options.search.replaceAll(/\s/g, '+')}:*`],
        );
      } else {
        query.whereRaw(
          `LOWER(notifications.title || ' ' || notifications.description) LIKE LOWER(?)`,
          [`%${options.search}%`],
        );
      }
    }

    if (options.ids) {
      query.whereIn('id', options.ids);
    }

    return query;
  };

  async getNotifications(options: NotificationGetOptions) {
    const notificationQuery = this.getNotificationsBaseQuery(options);
    const notifications = await notificationQuery.select('*');
    return notifications;
  }

  async saveNotification(notification: Notification) {
    await this.db.insert(notification).into('notifications');
  }

  async getStatus(options: NotificationGetOptions) {
    const notificationQuery = this.getNotificationsBaseQuery(options);
    const unreadQuery = await notificationQuery
      .clone()
      .whereNull('read')
      .count('id as UNREAD')
      .first();
    const readQuery = await notificationQuery
      .clone()
      .whereNotNull('read')
      .count('id as READ')
      .first();

    return {
      unread: this.mapToInteger((unreadQuery as any)?.UNREAD),
      read: this.mapToInteger((readQuery as any)?.READ),
    };
  }

  async getExistingScopeNotification(options: {
    user_ref: string;
    scope: string;
    origin: string;
  }) {
    const query = this.db('notifications')
      .where('userRef', options.user_ref)
      .where('scope', options.scope)
      .where('origin', options.origin)
      .select('*')
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
    const query = this.db('notifications')
      .where('id', options.id)
      .where('userRef', options.notification.userRef);
    const rows = await query.update({
      title: options.notification.payload.title,
      description: options.notification.payload.description,
      link: options.notification.payload.link,
      topic: options.notification.payload.topic,
      updated: options.notification.created,
      severity: options.notification.payload.severity,
      read: null,
      done: null,
    });

    if (!rows) {
      return null;
    }

    return await this.getNotification(options);
  }

  async getNotification(options: { id: string }) {
    const rows = await this.db('notifications')
      .where('id', options.id)
      .select('*')
      .limit(1);
    if (!rows || rows.length === 0) {
      return null;
    }
    return rows[0] as Notification;
  }

  async markRead(options: NotificationModifyOptions): Promise<void> {
    const notificationQuery = this.getNotificationsBaseQuery(options);
    await notificationQuery.update({ read: new Date() });
  }

  async markUnread(options: NotificationModifyOptions): Promise<void> {
    const notificationQuery = this.getNotificationsBaseQuery(options);
    await notificationQuery.update({ read: null });
  }

  async markDone(options: NotificationModifyOptions): Promise<void> {
    const notificationQuery = this.getNotificationsBaseQuery(options);
    await notificationQuery.update({ done: new Date(), read: new Date() });
  }

  async markUndone(options: NotificationModifyOptions): Promise<void> {
    const notificationQuery = this.getNotificationsBaseQuery(options);
    await notificationQuery.update({ done: null, read: null });
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
