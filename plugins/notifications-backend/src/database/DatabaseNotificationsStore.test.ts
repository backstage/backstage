/*
 * Copyright 2024 The Backstage Authors
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
  TestDatabaseId,
  TestDatabases,
  mockServices,
} from '@backstage/backend-test-utils';
import { DatabaseNotificationsStore } from './DatabaseNotificationsStore';
import { Knex } from 'knex';
import {
  Notification,
  NotificationSettings,
  NotificationSeverity,
} from '@backstage/plugin-notifications-common';

jest.setTimeout(60_000);

const databases = TestDatabases.create();

async function createStore(databaseId: TestDatabaseId) {
  const knex = await databases.init(databaseId);
  const database = mockServices.database({ knex, migrations: { skip: false } });
  return {
    knex,
    storage: await DatabaseNotificationsStore.create({ database }),
  };
}

const idOnly = (notification: Notification) => notification.id;

const user = 'user:default/john.doe';
const otherUser = 'user:default/jane.doe';

const id0 = '08e0871e-e60a-4f68-8110-5ae3513f992e';
const id1 = '01e0871e-e60a-4f68-8110-5ae3513f992e';
const id2 = '02e0871e-e60a-4f68-8110-5ae3513f992e';
const id3 = '03e0871e-e60a-4f68-8110-5ae3513f992e';
const id4 = '04e0871e-e60a-4f68-8110-5ae3513f992e';
const id5 = '05e0871e-e60a-4f68-8110-5ae3513f992e';
const id6 = '06e0871e-e60a-4f68-8110-5ae3513f992e';
const id7 = '07e0871e-e60a-4f68-8110-5ae3513f992e';
const ids = [id1, id2, id3, id4, id5, id6, id7];

const now = Date.now();
const timeDelay = 5 * 1000; /* 5 secs */

const testNotification1: Notification = {
  id: id1,
  user,
  created: new Date(now - 1 * 60 * 60 * 1000 /* an hour ago */),
  origin: 'abcd-origin',
  payload: {
    title: 'Notification 1 - please find me',
    description: 'a description of the notification',
    topic: 'efgh-topic',
    link: '/catalog',
    severity: 'critical',
    icon: 'docs',
  },
};
const testNotification2: Notification = {
  id: id2,
  user,
  created: new Date(now),
  origin: 'cd-origin',
  payload: {
    title: 'Notification 2',
    topic: 'gh-topic',
    link: '/catalog',
    severity: 'normal',
    scope: 'scaffolder-1234',
  },
};
const testNotification3: Notification = {
  id: id3,
  user,
  created: new Date(now - 5 * timeDelay),
  origin: 'bcd-origin',
  payload: {
    title: 'Notification 3',
    topic: 'fgh-topic',
    link: '/catalog',
    severity: 'normal',
  },
};
const testNotification4: Notification = {
  id: id4,
  user,
  created: new Date(now - 4 * timeDelay),
  origin: 'plugin-test',
  payload: {
    title: 'Notification 4',
    link: '/catalog',
    severity: 'normal',
  },
};
const testNotification5: Notification = {
  id: id5,
  user,
  created: new Date(now - 3 * timeDelay),
  origin: 'plugin-test',
  payload: {
    title: 'Notification 5',
    link: '/catalog',
    severity: 'normal',
  },
};
const testNotification6: Notification = {
  id: id6,
  user,
  created: new Date(now - 2 * timeDelay),
  origin: 'plugin-test',
  payload: {
    title: 'Notification 6',
    link: '/catalog',
    severity: 'normal',
  },
};
const testNotification7: Notification = {
  id: id7,
  user,
  created: new Date(now - 1 * timeDelay),
  origin: 'plugin-test',
  payload: {
    title: 'Notification 7',
    link: '/catalog',
    severity: 'normal',
  },
};
const otherUserNotification: Notification = {
  id: id0,
  user: otherUser,
  created: new Date(now),
  origin: 'plugin-test',
  payload: {
    title: 'Notification Other - please do not find me',
    link: '/catalog',
    severity: 'normal',
  },
};
const notificationSettings: NotificationSettings = {
  channels: [
    {
      id: 'Web',
      origins: [
        {
          id: 'plugin-test',
          enabled: true,
        },
        {
          id: 'plugin-test2',
          enabled: false,
        },
      ],
    },
  ],
};

describe.each(databases.eachSupportedId())(
  'DatabaseNotificationsStore (%s)',
  databaseId => {
    let storage: DatabaseNotificationsStore;
    let knex: Knex;

    beforeAll(async () => {
      ({ storage, knex } = await createStore(databaseId));
    });

    afterEach(async () => {
      jest.resetAllMocks();
      await knex('notification').del();
      await knex('broadcast').del();
    });

    describe('saveNotification', () => {
      it('should store a notification', async () => {
        await storage.saveNotification(testNotification1);
        const notification = await storage.getNotification({ id: id1 });
        expect(notification?.id).toBe(id1);
        expect(notification?.user).toBe(user);
        expect(notification?.origin).toBe('abcd-origin');
        expect(notification?.payload?.title).toBe(
          'Notification 1 - please find me',
        );
        expect(notification?.payload?.description).toBe(
          'a description of the notification',
        );
        expect(notification?.payload?.topic).toBe('efgh-topic');
        expect(notification?.payload?.link).toBe('/catalog');
        expect(notification?.payload?.severity).toBe('critical');
        expect(notification?.payload?.icon).toBe('docs');
      });
    });

    describe('getNotifications', () => {
      it('should return all notifications for user', async () => {
        await storage.saveNotification(testNotification1);
        await storage.saveNotification(testNotification2);
        await storage.saveBroadcast(testNotification3);
        await storage.saveNotification(otherUserNotification);

        const notifications = await storage.getNotifications({ user });
        expect(notifications.map(idOnly)).toEqual([
          /* default sorting from new to old */
          id2,
          id3,
          id1,
        ]);
      });

      it('should return read notifications for user', async () => {
        await storage.saveNotification(testNotification1);
        await storage.saveBroadcast(testNotification2);
        await storage.saveNotification(testNotification3);
        await storage.saveNotification(otherUserNotification);

        await storage.markRead({ ids: [id1, id3], user });

        const notifications = await storage.getNotifications({
          user,
          read: true,
        });
        expect(notifications.map(idOnly)).toEqual([id3, id1]);
      });

      it('should return unread notifications for user', async () => {
        await storage.saveNotification(testNotification1);
        await storage.saveBroadcast(testNotification2);
        await storage.saveNotification(testNotification3);
        await storage.saveNotification(otherUserNotification);

        await storage.markRead({ ids: [id1, id3], user });

        const notifications = await storage.getNotifications({
          user,
          read: false,
        });
        expect(notifications).toHaveLength(1);
        expect(notifications.at(0)?.id).toEqual(id2);
      });

      it('should return both read and unread notifications for user', async () => {
        await storage.saveNotification(testNotification1);
        await storage.saveBroadcast(testNotification2);
        await storage.saveNotification(testNotification3);

        await storage.markRead({ ids: [id1, id3], user });

        const notifications = await storage.getNotifications({
          user,
          read: undefined,
        });
        expect(notifications.map(idOnly)).toEqual([id2, id3, id1]);
      });

      it('should return correct broadcast notifications for different users', async () => {
        await storage.saveNotification(testNotification1);
        await storage.saveBroadcast(testNotification2);
        await storage.saveNotification(testNotification3);
        await storage.saveNotification(otherUserNotification);

        await storage.markRead({ ids: [id1, id2], user });

        const notifications = await storage.getNotifications({
          user,
        });
        expect(notifications.map(idOnly)).toEqual([id2, id3, id1]);
        expect(notifications[1].user).toBe(user);

        let otherUserNotifications = await storage.getNotifications({
          user: otherUser,
        });
        expect(otherUserNotifications.map(idOnly)).toEqual([id0, id2]);
        expect(otherUserNotifications[1].user).toBeNull();

        await storage.markRead({ ids: [id0, id2], user: otherUser });
        otherUserNotifications = await storage.getNotifications({
          user: otherUser,
        });
        expect(otherUserNotifications.map(idOnly)).toEqual([id0, id2]);
        expect(otherUserNotifications[1].user).toBe(otherUser);
      });

      it('should allow searching for notifications', async () => {
        await storage.saveNotification(testNotification2);
        await storage.saveBroadcast(testNotification1);
        await storage.saveNotification(otherUserNotification);

        const notifications = await storage.getNotifications({
          user,
          search: 'find me',
        });
        expect(notifications).toHaveLength(1);
        expect(notifications.at(0)?.id).toEqual(id1);
      });

      it('should filter notifications based on created date', async () => {
        await storage.saveNotification(testNotification1);
        await storage.saveBroadcast(testNotification2);
        await storage.saveNotification(otherUserNotification);

        const notifications = await storage.getNotifications({
          user,
          createdAfter: new Date(Date.now() - 5 * 60 * 1000 /* 5mins */),
        });
        expect(notifications.length).toBe(1);
        expect(notifications.at(0)?.id).toEqual(id2);
      });

      it('should filter notifications based on topic', async () => {
        await storage.saveNotification(testNotification1);
        await storage.saveNotification(testNotification2);
        await storage.saveNotification(testNotification3);

        const notifications = await storage.getNotifications({
          user,
          topic: 'efgh-topic',
        });

        expect(notifications.length).toBe(1);
        expect(notifications.at(0)?.id).toEqual(id1);
      });
    });

    describe('getNotifications filters on severity', () => {
      beforeEach(async () => {
        const severities: (NotificationSeverity | undefined)[] = [
          'normal',
          undefined,
          'critical',
          'high',
          'low',
        ];
        await Promise.all(
          severities.map((severity, idx) =>
            storage.saveNotification({
              id: ids[idx],
              user,
              origin: 'test-origin',
              created: new Date(now - idx * timeDelay),
              payload: {
                title: severity || 'default',
                severity,
              },
            }),
          ),
        );
      });
      it('normal', async () => {
        const normal = await storage.getNotifications({
          user,
          minimumSeverity: 'normal',
        });
        expect(normal.map(idOnly)).toEqual([id1, id2, id3, id4]);
      });

      it('critical', async () => {
        const critical = await storage.getNotifications({
          user,
          minimumSeverity: 'critical',
        });
        expect(critical.length).toBe(1);
        expect(critical.at(0)?.id).toEqual(id3);
      });

      it('high', async () => {
        const high = await storage.getNotifications({
          user,
          minimumSeverity: 'high',
        });
        expect(high.map(idOnly)).toEqual([id3, id4]);
      });

      it('low', async () => {
        const low = await storage.getNotifications({
          user,
          minimumSeverity: 'low',
        });
        expect(low.map(idOnly)).toEqual([id1, id2, id3, id4, id5]);
      });
    });

    describe('getNotifications pagination', () => {
      beforeEach(async () => {
        await storage.saveNotification(testNotification1);
        await storage.saveNotification(testNotification2);
        await storage.saveNotification(testNotification3);
        await storage.saveNotification(testNotification4);
        await storage.saveNotification(testNotification5);
        await storage.saveBroadcast(testNotification6);
        await storage.saveNotification(testNotification7);
        await storage.saveNotification(otherUserNotification);
      });

      it('should not apply by default', async () => {
        const allUserNotifications = await storage.getNotifications({
          user,
        });
        expect(allUserNotifications).toHaveLength(7);

        const correctMySqlPrecision = 1000;
        const notifications = await storage.getNotifications({
          user,
          createdAfter: new Date(
            new Date(now - 1 * 60 * 60 * 1000 - correctMySqlPrecision),
          ),
          // so far no pagination
        });
        expect(notifications.map(idOnly)).toEqual([
          id2,
          id7,
          id6,
          id5,
          id4,
          id3,
          id1,
        ]);
      });

      it('should get first page', async () => {
        const allUserNotificationsPageOne = await storage.getNotifications({
          user,
          limit: 3,
          offset: 0,
        });
        expect(allUserNotificationsPageOne.map(idOnly)).toEqual([
          id2,
          id7,
          id6,
        ]);
      });

      it('should get second page', async () => {
        const allUserNotificationsPageTwo = await storage.getNotifications({
          user,
          limit: 3,
          offset: 3,
        });
        expect(allUserNotificationsPageTwo.map(idOnly)).toEqual([
          id5,
          id4,
          id3,
        ]);
      });
    });

    describe('getNotifications sorting', () => {
      beforeEach(async () => {
        await storage.saveNotification(testNotification1);
        await storage.saveBroadcast(testNotification2);
        await storage.saveNotification(testNotification3);
      });

      it('should sort created asc', async () => {
        const notificationsCreatedAsc = await storage.getNotifications({
          user,
          orderField: [{ field: 'created', order: 'asc' }],
        });
        expect(notificationsCreatedAsc.map(idOnly)).toEqual([id1, id3, id2]);
      });

      it('should sort created desc', async () => {
        const notificationsCreatedDesc = await storage.getNotifications({
          user,
          orderField: [{ field: 'created', order: 'desc' }],
        });
        expect(notificationsCreatedDesc.map(idOnly)).toEqual([id2, id3, id1]);
      });

      it('should sort topic asc', async () => {
        const notificationsTopicAsc = await storage.getNotifications({
          user,
          orderField: [{ field: 'topic', order: 'asc' }],
        });
        expect(notificationsTopicAsc.map(idOnly)).toEqual([id1, id3, id2]);
      });

      it('should sort topic desc', async () => {
        const notificationsTopicDesc = await storage.getNotifications({
          user,
          orderField: [{ field: 'topic', order: 'desc' }],
        });
        expect(notificationsTopicDesc.map(idOnly)).toEqual([id2, id3, id1]);
      });

      it('should sort origin asc', async () => {
        const notificationsOrigin = await storage.getNotifications({
          user,
          orderField: [{ field: 'origin', order: 'asc' }],
          limit: 2,
          offset: 0,
        });
        expect(notificationsOrigin.map(idOnly)).toEqual([id1, id3]);
      });

      it('should sort origin desc', async () => {
        const notificationsOriginNext = await storage.getNotifications({
          user,
          orderField: [{ field: 'origin', order: 'desc' }],
          limit: 2,
          offset: 2,
        });
        expect(notificationsOriginNext).toHaveLength(1);
        expect(notificationsOriginNext.at(0)?.id).toEqual(id1);
      });
    });

    describe('getStatus', () => {
      it('should return status for user', async () => {
        await storage.saveNotification({
          ...testNotification1,
          read: new Date(),
        });
        await storage.saveNotification(testNotification2);
        await storage.saveBroadcast({ ...testNotification3, read: new Date() });
        await storage.saveBroadcast(testNotification4);
        await storage.saveNotification(otherUserNotification);

        const status = await storage.getStatus({ user });
        expect(status.read).toEqual(2);
        expect(status.unread).toEqual(2);
      });
    });

    describe('getExistingScopeNotification', () => {
      it('should return existing scope notification', async () => {
        await storage.saveNotification(testNotification1);
        await storage.saveNotification(testNotification2);

        const existing = await storage.getExistingScopeNotification({
          user,
          origin: 'cd-origin',
          scope: 'scaffolder-1234',
        });
        expect(existing).not.toBeNull();
        expect(existing?.id).toEqual(id2);
      });

      it('should return existing scope broadcast', async () => {
        await storage.saveBroadcast(testNotification1);
        await storage.saveBroadcast(testNotification2);
        const existing = await storage.getExistingScopeBroadcast({
          origin: 'cd-origin',
          scope: 'scaffolder-1234',
        });
        expect(existing).not.toBeNull();
        expect(existing?.id).toEqual(id2);
      });
    });

    describe('restoreExistingNotification', () => {
      it('should return restore existing scope notification', async () => {
        await storage.saveNotification(testNotification1);
        await storage.saveNotification(testNotification2);

        const existing = await storage.restoreExistingNotification({
          id: id2,
          notification: {
            user: testNotification2.user,
            payload: {
              title: 'New notification',
              link: '/scaffolder/task/1234',
              severity: 'low',
            },
          } as any,
        });
        expect(existing).not.toBeNull();
        expect(existing?.id).toEqual(id2);
        expect(existing?.payload.title).toEqual('New notification');
        expect(existing?.payload.severity).toEqual('low');
        expect(existing?.read).toBeNull();
      });

      it('should return restore existing scope broadcast', async () => {
        await storage.saveBroadcast(testNotification1);
        await storage.saveBroadcast(testNotification2);

        const existing = await storage.restoreExistingNotification({
          id: id2,
          notification: {
            user: testNotification2.user,
            payload: {
              title: 'New notification',
              link: '/scaffolder/task/1234',
              severity: 'normal',
            },
          } as any,
        });
        expect(existing).not.toBeNull();
        expect(existing?.id).toEqual(id2);
        expect(existing?.payload.title).toEqual('New notification');
        expect(existing?.read).toBeNull();
      });
    });

    describe('getNotification', () => {
      it('should return notification by id', async () => {
        await storage.saveNotification(testNotification1);
        const notification = await storage.getNotification({ id: id1 });
        expect(notification?.id).toEqual(id1);
      });

      it('should return broadcast by id', async () => {
        await storage.saveNotification(testNotification1);
        await storage.saveBroadcast(testNotification2);
        const notification = await storage.getNotification({ id: id2 });
        expect(notification?.id).toEqual(id2);
      });

      it('should consider user for broadcast by id', async () => {
        await storage.saveBroadcast(testNotification1);

        let notification = await storage.getNotification({ id: id1, user });
        expect(notification?.id).toEqual(id1);
        expect(notification?.user).toBeNull();
        await storage.markRead({ ids: [id1], user });
        notification = await storage.getNotification({ id: id1, user });
        expect(notification?.user).toBe(user);

        const otherNotification = await storage.getNotification({
          id: id1,
          user: otherUser,
        });
        expect(otherNotification?.user).toBeNull();
      });
    });

    describe('markRead', () => {
      it('should mark notification read', async () => {
        await storage.saveNotification(testNotification1);
        const notificationBefore = await storage.getNotification({ id: id1 });
        expect(notificationBefore?.read).toBeNull();
        await storage.markRead({ ids: [id1], user });
        const notification = await storage.getNotification({ id: id1 });
        expect(notification?.read).not.toBeNull();
      });

      it('should mark broadcast read', async () => {
        await storage.saveBroadcast(testNotification1);
        const notificationBefore = await storage.getNotification({ id: id1 });
        expect(notificationBefore?.read).toBeNull();
        await storage.markRead({ ids: [id1], user });
        const notification = await storage.getNotification({ id: id1 });
        expect(notification?.read).not.toBeNull();
      });
    });

    describe('markUnread', () => {
      it('should mark notification unread', async () => {
        await storage.saveNotification({
          ...testNotification1,
          read: new Date(),
        });
        const notificationBefore = await storage.getNotification({ id: id1 });
        expect(notificationBefore?.read).not.toBeNull();
        await storage.markUnread({ ids: [id1], user });
        const notification = await storage.getNotification({ id: id1 });
        expect(notification?.read).toBeNull();
      });

      it('should mark broadcast unread', async () => {
        await storage.saveBroadcast({
          ...testNotification1,
          read: new Date(),
        });
        const notificationBefore = await storage.getNotification({ id: id1 });
        expect(notificationBefore?.read).not.toBeNull();
        await storage.markUnread({ ids: [id1], user });
        const notification = await storage.getNotification({ id: id1 });
        expect(notification?.read).toBeNull();
      });
    });

    describe('markSaved', () => {
      it('should mark notification saved', async () => {
        await storage.saveNotification(testNotification1);
        const notificationBefore = await storage.getNotification({ id: id1 });
        expect(notificationBefore?.saved).toBeNull();
        await storage.markSaved({ ids: [id1], user });
        const notification = await storage.getNotification({ id: id1 });
        expect(notification?.saved).not.toBeNull();
      });

      it('should mark broadcast saved', async () => {
        await storage.saveBroadcast(testNotification1);
        const notificationBefore = await storage.getNotification({ id: id1 });
        expect(notificationBefore?.saved).toBeNull();
        await storage.markSaved({ ids: [id1], user });
        const notification = await storage.getNotification({ id: id1 });
        expect(notification?.saved).not.toBeNull();
      });
    });

    describe('markUnsaved', () => {
      it('should mark notification not saved', async () => {
        await storage.saveNotification({
          ...testNotification1,
          saved: new Date(),
        });
        const notificationBefore = await storage.getNotification({ id: id1 });
        expect(notificationBefore?.saved).not.toBeNull();
        await storage.markUnsaved({ ids: [id1], user });
        const notification = await storage.getNotification({ id: id1 });
        expect(notification?.saved).toBeNull();
      });

      it('should mark broadcast not saved', async () => {
        await storage.saveBroadcast({
          ...testNotification1,
          saved: new Date(),
        });
        const notificationBefore = await storage.getNotification({ id: id1 });
        expect(notificationBefore?.saved).not.toBeNull();
        await storage.markUnsaved({ ids: [id1], user });
        const notification = await storage.getNotification({ id: id1 });
        expect(notification?.saved).toBeNull();
      });
    });

    describe('settings', () => {
      it('should save and load notification settings', async () => {
        await storage.saveNotificationSettings({
          user: 'user:default/test',
          settings: notificationSettings,
        });
        const settings = await storage.getNotificationSettings({
          user: 'user:default/test',
        });
        expect(settings).toEqual(notificationSettings);
      });
    });

    describe('topics', () => {
      it('should return all topics for user', async () => {
        await storage.saveNotification(testNotification1);
        await storage.saveNotification(testNotification2);
        await storage.saveBroadcast(testNotification3);
        await storage.saveNotification(otherUserNotification);

        const topics = await storage.getTopics({ user });
        expect(topics.topics.sort()).toEqual([
          testNotification1.payload.topic,
          testNotification3.payload.topic,
          testNotification2.payload.topic,
        ]);
      });

      it('should return filtered topics for user by title', async () => {
        await storage.saveNotification(testNotification1);
        await storage.saveNotification(testNotification2);
        await storage.saveBroadcast(testNotification3);
        await storage.saveBroadcast(testNotification4);
        await storage.saveNotification(otherUserNotification);

        const topics = await storage.getTopics({
          user,
          search: 'Notification 3',
        });
        expect(topics).toEqual({
          topics: [testNotification3.payload.topic],
        });
      });

      it('should return filtered topics for user by severity', async () => {
        await storage.saveNotification(testNotification1);
        await storage.saveNotification(testNotification2);
        await storage.saveBroadcast(testNotification3);
        await storage.saveBroadcast(testNotification4);
        await storage.saveNotification(otherUserNotification);

        const topics = await storage.getTopics({
          user,
          minimumSeverity: 'critical',
        });
        expect(topics).toEqual({
          topics: [testNotification1.payload.topic],
        });
      });
    });
  },
);
