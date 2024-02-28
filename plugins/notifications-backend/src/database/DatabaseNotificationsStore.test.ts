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
import { TestDatabaseId, TestDatabases } from '@backstage/backend-test-utils';
import { DatabaseNotificationsStore } from './DatabaseNotificationsStore';
import { Knex } from 'knex';
import { Notification } from '@backstage/plugin-notifications-common';

jest.setTimeout(60_000);

const databases = TestDatabases.create();

async function createStore(databaseId: TestDatabaseId) {
  const knex = await databases.init(databaseId);
  const mgr = {
    getClient: async () => knex,
    migrations: {
      skip: false,
    },
  };
  return {
    knex,
    storage: await DatabaseNotificationsStore.create({ database: mgr }),
  };
}

const user = 'user:default/john.doe';
const testNotification: Partial<Notification> = {
  user,
  created: new Date(),
  origin: 'plugin-test',
  payload: {
    title: 'Notification 1',
    link: '/catalog',
    severity: 'normal',
  },
};

const otherUserNotification: Partial<Notification> = {
  ...testNotification,
  user: 'user:default/jane.doe',
};

const id1 = '01e0871e-e60a-4f68-8110-5ae3513f992e';
const id2 = '02e0871e-e60a-4f68-8110-5ae3513f992e';
const id3 = '03e0871e-e60a-4f68-8110-5ae3513f992e';
const id4 = '04e0871e-e60a-4f68-8110-5ae3513f992e';
const id5 = '05e0871e-e60a-4f68-8110-5ae3513f992e';
const id6 = '06e0871e-e60a-4f68-8110-5ae3513f992e';
const id7 = '07e0871e-e60a-4f68-8110-5ae3513f992e';
const id8 = '08e0871e-e60a-4f68-8110-5ae3513f992e';

describe.each(databases.eachSupportedId())(
  'DatabaseNotificationsStore (%s)',
  databaseId => {
    let storage: DatabaseNotificationsStore;
    let knex: Knex;
    const insertNotification = async (
      notification: Partial<Notification> & {
        id: string;
        saved?: Date;
        read?: Date;
      },
    ) =>
      (
        await knex('notification')
          .insert({
            id: notification.id,
            user: notification.user,
            origin: notification.origin,
            created: notification.created,
            topic: notification.payload?.topic,
            link: notification.payload?.link,
            title: notification.payload?.title,
            severity: notification.payload?.severity,
            scope: notification.payload?.scope,
            saved: notification.saved,
            read: notification.read,
          })
          .returning('id')
      )[0].id ?? -1;

    beforeAll(async () => {
      ({ storage, knex } = await createStore(databaseId));
    });

    afterEach(async () => {
      jest.resetAllMocks();
      await knex('notification').del();
    });

    describe('getNotifications', () => {
      it('should return all notifications for user', async () => {
        await insertNotification({ id: id1, ...testNotification });
        await insertNotification({ id: id2, ...testNotification });
        await insertNotification({ id: id3, ...otherUserNotification });

        const notifications = await storage.getNotifications({ user });
        expect(notifications.length).toBe(2);
        expect(notifications.find(el => el.id === id1)).toBeTruthy();
        expect(notifications.find(el => el.id === id2)).toBeTruthy();
      });

      it('should return read notifications for user', async () => {
        await insertNotification({ id: id1, ...testNotification });
        await insertNotification({ id: id2, ...testNotification });
        await insertNotification({ id: id3, ...testNotification });
        await insertNotification({ id: id4, ...otherUserNotification });

        await storage.markRead({ ids: [id1, id3], user });

        const notifications = await storage.getNotifications({
          user,
          read: true,
        });
        expect(notifications.length).toBe(2);
        expect(notifications.find(el => el.id === id1)).toBeTruthy();
        expect(notifications.find(el => el.id === id3)).toBeTruthy();
      });

      it('should return unread notifications for user', async () => {
        await insertNotification({ id: id1, ...testNotification });
        await insertNotification({ id: id2, ...testNotification });
        await insertNotification({ id: id3, ...testNotification });
        await insertNotification({ id: id4, ...otherUserNotification });

        await storage.markRead({ ids: [id1, id3], user });

        const notifications = await storage.getNotifications({
          user,
          read: false,
        });
        expect(notifications.length).toBe(1);
        expect(notifications.at(0)?.id).toEqual(id2);
      });

      it('should return both read and unread notifications for user', async () => {
        await insertNotification({ id: id1, ...testNotification });
        await insertNotification({ id: id2, ...testNotification });
        await insertNotification({ id: id3, ...testNotification });
        await insertNotification({ id: id4, ...otherUserNotification });

        await storage.markRead({ ids: [id1, id3], user });

        const notifications = await storage.getNotifications({
          user,
          read: undefined,
        });
        expect(notifications.length).toBe(3);
        expect(notifications.find(el => el.id === id1)).toBeTruthy();
        expect(notifications.find(el => el.id === id2)).toBeTruthy();
        expect(notifications.find(el => el.id === id3)).toBeTruthy();
      });

      it('should allow searching for notifications', async () => {
        await insertNotification({
          id: id1,
          ...testNotification,
          payload: {
            link: '/catalog',
            severity: 'normal',
            title: 'Please find me',
          },
        });
        await insertNotification({ id: id2, ...testNotification });
        await insertNotification({ id: id3, ...otherUserNotification });

        const notifications = await storage.getNotifications({
          user,
          search: 'find me',
        });
        expect(notifications.length).toBe(1);
        expect(notifications.at(0)?.id).toEqual(id1);
      });

      it('should filter notifications based on created date', async () => {
        await insertNotification({
          id: id1,
          ...testNotification,
          created: new Date(Date.now() - 1 * 60 * 60 * 1000 /* an hour ago */),
        });
        await insertNotification({
          id: id2,
          ...testNotification,
          payload: {
            severity: 'normal',
            title: 'Please find me',
          },
          created: new Date() /* now */,
        });
        await insertNotification({ id: id3, ...otherUserNotification });

        const notifications = await storage.getNotifications({
          user,
          createdAfter: new Date(Date.now() - 5 * 60 * 1000 /* 5mins */),
        });
        expect(notifications.length).toBe(1);
        expect(notifications.at(0)?.id).toEqual(id2);
      });

      it('should apply pagination', async () => {
        const now = Date.now();
        const timeDelay = 5 * 1000; /* 5 secs */

        await insertNotification({
          id: id1,
          ...testNotification,
          created: new Date(now - 1 * 60 * 60 * 1000 /* an hour ago */),
        });
        await insertNotification({
          id: id2,
          ...testNotification,
          created: new Date(now),
        });
        await insertNotification({
          id: id3,
          ...testNotification,
          created: new Date(now - 5 * timeDelay),
        });
        await insertNotification({
          id: id4,
          ...testNotification,
          created: new Date(now - 4 * timeDelay),
        });
        await insertNotification({
          id: id5,
          ...testNotification,
          created: new Date(now - 3 * timeDelay),
        });
        await insertNotification({
          id: id6,
          ...testNotification,
          created: new Date(now - 2 * timeDelay),
        });
        await insertNotification({
          id: id7,
          ...testNotification,
          created: new Date(now - 1 * timeDelay),
        });

        await insertNotification({ id: id8, ...otherUserNotification });

        const allUserNotifications = await storage.getNotifications({
          user,
        });
        expect(allUserNotifications.length).toBe(7);

        const notifications = await storage.getNotifications({
          user,
          createdAfter: new Date(now - 5 * 60 * 1000 /* 5 mins */),
          // so far no pagination
        });
        expect(notifications.length).toBe(6);
        expect(notifications.at(0)?.id).toEqual(id2);
        expect(notifications.at(1)?.id).toEqual(id7);
        expect(notifications.at(2)?.id).toEqual(id6);
        expect(notifications.at(3)?.id).toEqual(id5);
        expect(notifications.at(4)?.id).toEqual(id4);

        const allUserNotificationsPageOne = await storage.getNotifications({
          user,
          limit: 3,
          offset: 0,
        });
        expect(allUserNotificationsPageOne.length).toBe(3);
        expect(allUserNotificationsPageOne.at(0)?.id).toEqual(id2);
        expect(allUserNotificationsPageOne.at(1)?.id).toEqual(id7);
        expect(allUserNotificationsPageOne.at(2)?.id).toEqual(id6);

        const allUserNotificationsPageTwo = await storage.getNotifications({
          user,
          limit: 3,
          offset: 3,
        });
        expect(allUserNotificationsPageTwo.length).toBe(3);
        expect(allUserNotificationsPageTwo.at(0)?.id).toEqual(id5);
        expect(allUserNotificationsPageTwo.at(1)?.id).toEqual(id4);
        expect(allUserNotificationsPageTwo.at(2)?.id).toEqual(id3);
      });

      it('should sort result', async () => {
        const now = Date.now();
        const timeDelay = 5 * 1000; /* 5 secs */

        await insertNotification({
          id: id1,
          user,
          origin: 'Y',
          payload: {
            title: 'Notification 1',
            link: '/catalog',
            severity: 'normal',
            topic: 'AAA',
          },
          created: new Date(now - 10 * timeDelay),
        });
        await insertNotification({
          id: id2,
          user,
          origin: 'Z',
          payload: {
            title: 'Notification 2',
            link: '/catalog',
            severity: 'normal',
            topic: 'CCC',
          },
          created: new Date(now),
        });
        await insertNotification({
          id: id3,
          user,
          origin: 'X',
          payload: {
            title: 'Notification 3',
            link: '/catalog',
            severity: 'normal',
            topic: 'BBB',
          },
          created: new Date(now - 5 * timeDelay),
        });

        const notificationsCreatedAsc = await storage.getNotifications({
          user,
          sort: 'created',
          sortOrder: 'asc',
        });
        expect(notificationsCreatedAsc.length).toBe(3);
        expect(notificationsCreatedAsc.at(0)?.id).toEqual(id1);
        expect(notificationsCreatedAsc.at(1)?.id).toEqual(id3);
        expect(notificationsCreatedAsc.at(2)?.id).toEqual(id2);

        const notificationsCreatedDesc = await storage.getNotifications({
          user,
          sort: 'created',
          sortOrder: 'desc',
        });
        expect(notificationsCreatedDesc.length).toBe(3);
        expect(notificationsCreatedDesc.at(0)?.id).toEqual(id2);
        expect(notificationsCreatedDesc.at(1)?.id).toEqual(id3);
        expect(notificationsCreatedDesc.at(2)?.id).toEqual(id1);

        const notificationsTopicAsc = await storage.getNotifications({
          user,
          sort: 'topic',
          sortOrder: 'asc',
        });
        expect(notificationsTopicAsc.length).toBe(3);
        expect(notificationsTopicAsc.at(0)?.id).toEqual(id1);
        expect(notificationsTopicAsc.at(1)?.id).toEqual(id3);
        expect(notificationsTopicAsc.at(2)?.id).toEqual(id2);

        const notificationsTopicDesc = await storage.getNotifications({
          user,
          sort: 'topic',
          sortOrder: 'desc',
        });
        expect(notificationsTopicDesc.length).toBe(3);
        expect(notificationsTopicDesc.at(0)?.id).toEqual(id2);
        expect(notificationsTopicDesc.at(1)?.id).toEqual(id3);
        expect(notificationsTopicDesc.at(2)?.id).toEqual(id1);

        const notificationsOrigin = await storage.getNotifications({
          user,
          sort: 'origin',
          sortOrder: 'asc',
          limit: 2,
          offset: 0,
        });
        expect(notificationsOrigin.length).toBe(2);
        expect(notificationsOrigin.at(0)?.id).toEqual(id3);
        expect(notificationsOrigin.at(1)?.id).toEqual(id1);

        const notificationsOriginNext = await storage.getNotifications({
          user,
          sort: 'origin',
          sortOrder: 'asc',
          limit: 2,
          offset: 2,
        });
        expect(notificationsOriginNext.length).toBe(1);
        expect(notificationsOriginNext.at(0)?.id).toEqual(id2);
      });
    });

    describe('getStatus', () => {
      it('should return status for user', async () => {
        await insertNotification({
          id: id1,
          ...testNotification,
          read: new Date(),
        });
        await insertNotification({ id: id2, ...testNotification });
        await insertNotification({ id: id3, ...otherUserNotification });

        const status = await storage.getStatus({ user });
        expect(status.read).toEqual(1);
        expect(status.unread).toEqual(1);
      });
    });

    describe('getExistingScopeNotification', () => {
      it('should return existing scope notification', async () => {
        const notification: any = {
          ...testNotification,
          id: id1,
          payload: {
            title: 'Notification',
            link: '/scaffolder/task/1234',
            severity: 'normal',
            scope: 'scaffolder-1234',
          },
        };
        await insertNotification(notification);

        const existing = await storage.getExistingScopeNotification({
          user,
          origin: 'plugin-test',
          scope: 'scaffolder-1234',
        });
        expect(existing).not.toBeNull();
        expect(existing?.id).toEqual(id1);
      });
    });

    describe('restoreExistingNotification', () => {
      it('should return restore existing scope notification', async () => {
        const notification: any = {
          ...testNotification,
          id: id1,
          read: new Date(),
          payload: {
            title: 'Notification',
            link: '/scaffolder/task/1234',
            severity: 'normal',
            scope: 'scaffolder-1234',
          },
        };
        await insertNotification(notification);

        const existing = await storage.restoreExistingNotification({
          id: id1,
          notification: {
            user: notification.user,
            payload: {
              title: 'New notification',
              link: '/scaffolder/task/1234',
              severity: 'normal',
            },
          } as any,
        });
        expect(existing).not.toBeNull();
        expect(existing?.id).toEqual(id1);
        expect(existing?.payload.title).toEqual('New notification');
        expect(existing?.read).toBeNull();
      });
    });

    describe('getNotification', () => {
      it('should return notification by id', async () => {
        await insertNotification({ id: id1, ...testNotification });

        const notification = await storage.getNotification({ id: id1 });
        expect(notification?.id).toEqual(id1);
      });
    });

    describe('markRead', () => {
      it('should mark notification read', async () => {
        await insertNotification({ id: id1, ...testNotification });

        await storage.markRead({ ids: [id1], user });
        const notification = await storage.getNotification({ id: id1 });
        expect(notification?.read).not.toBeNull();
      });
    });

    describe('markUnread', () => {
      it('should mark notification unread', async () => {
        await insertNotification({
          id: id1,
          ...testNotification,
          read: new Date(),
        });

        await storage.markUnread({ ids: [id1], user });
        const notification = await storage.getNotification({ id: id1 });
        expect(notification?.read).toBeNull();
      });
    });

    describe('markSaved', () => {
      it('should mark notification saved', async () => {
        await insertNotification({ id: id1, ...testNotification });

        await storage.markSaved({ ids: [id1], user });
        const notification = await storage.getNotification({ id: id1 });
        expect(notification?.saved).not.toBeNull();
      });
    });

    describe('markUnsaved', () => {
      it('should mark notification not saved', async () => {
        await insertNotification({
          id: id1,
          ...testNotification,
          saved: new Date(),
        });

        await storage.markUnsaved({ ids: [id1], user });
        const notification = await storage.getNotification({ id: id1 });
        expect(notification?.saved).toBeNull();
      });
    });

    describe('saveNotification', () => {
      it('should store a notification', async () => {
        await storage.saveNotification({
          id: id1,
          user,
          created: new Date(),
          origin: 'my-origin',
          payload: {
            title: 'My title One',
            description: 'a description of the notification',
            link: 'http://foo.bar',
            severity: 'normal',
            topic: 'my-topic',
          },
        });
        const notification = await storage.getNotification({ id: id1 });
        expect(notification?.payload?.title).toBe('My title One');
      });
    });
  },
);
