/*
 * Copyright 2025 The Backstage Authors
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
import { createGetNotificationsAction } from './createGetNotificationsAction';
import { actionsRegistryServiceMock } from '@backstage/backend-test-utils/alpha';
import { mockCredentials, mockServices } from '@backstage/backend-test-utils';
import { NotificationsStore } from '../database';
import { Notification } from '@backstage/plugin-notifications-common';

const mockNotification: Notification = {
  id: 'notif-1',
  user: 'user:default/test',
  created: new Date('2025-04-01T10:00:00.000Z'),
  origin: 'catalog',
  payload: {
    title: 'Test notification',
    severity: 'normal',
  },
};

function createMockStore(
  overrides: Partial<NotificationsStore> = {},
): NotificationsStore {
  return {
    getNotifications: jest.fn().mockResolvedValue([]),
    getNotificationsCount: jest.fn().mockResolvedValue(0),
    saveNotification: jest.fn(),
    saveBroadcast: jest.fn(),
    getExistingScopeNotification: jest.fn(),
    getExistingScopeBroadcast: jest.fn(),
    restoreExistingNotification: jest.fn(),
    getNotification: jest.fn(),
    getStatus: jest.fn(),
    markRead: jest.fn(),
    markUnread: jest.fn(),
    markSaved: jest.fn(),
    markUnsaved: jest.fn(),
    getUserNotificationOrigins: jest.fn(),
    getUserNotificationTopics: jest.fn(),
    getNotificationSettings: jest.fn(),
    saveNotificationSettings: jest.fn(),
    getTopics: jest.fn(),
    clearNotifications: jest.fn(),
    ...overrides,
  } as unknown as NotificationsStore;
}

describe('createGetNotificationsAction', () => {
  const userCredentials = mockCredentials.user('user:default/test');
  const auth = mockServices.auth();

  it('defaults to returning only unread notifications', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
    const store = createMockStore({
      getNotifications: jest.fn().mockResolvedValue([mockNotification]),
      getNotificationsCount: jest.fn().mockResolvedValue(1),
    });

    createGetNotificationsAction({
      store,
      auth,
      actionsRegistry: mockActionsRegistry,
    });

    const result = await mockActionsRegistry.invoke({
      id: 'test:get-notifications',
      input: {},
      credentials: userCredentials,
    });

    expect(store.getNotifications).toHaveBeenCalledWith(
      expect.objectContaining({
        user: 'user:default/test',
        read: false,
        saved: undefined,
        offset: 0,
        limit: 10,
      }),
    );
    expect(result).toEqual({
      output: { notifications: [mockNotification], totalCount: 1 },
    });
  });

  it('passes read: true when view is "read"', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
    const store = createMockStore();

    createGetNotificationsAction({
      store,
      auth,
      actionsRegistry: mockActionsRegistry,
    });

    await mockActionsRegistry.invoke({
      id: 'test:get-notifications',
      input: { view: 'read' },
      credentials: userCredentials,
    });

    expect(store.getNotifications).toHaveBeenCalledWith(
      expect.objectContaining({ read: true, saved: undefined }),
    );
  });

  it('passes saved: true when view is "saved"', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
    const store = createMockStore();

    createGetNotificationsAction({
      store,
      auth,
      actionsRegistry: mockActionsRegistry,
    });

    await mockActionsRegistry.invoke({
      id: 'test:get-notifications',
      input: { view: 'saved' },
      credentials: userCredentials,
    });

    expect(store.getNotifications).toHaveBeenCalledWith(
      expect.objectContaining({ saved: true, read: undefined }),
    );
  });

  it('passes no read or saved filter when view is "all"', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
    const store = createMockStore();

    createGetNotificationsAction({
      store,
      auth,
      actionsRegistry: mockActionsRegistry,
    });

    await mockActionsRegistry.invoke({
      id: 'test:get-notifications',
      input: { view: 'all' },
      credentials: userCredentials,
    });

    expect(store.getNotifications).toHaveBeenCalledWith(
      expect.objectContaining({ read: undefined, saved: undefined }),
    );
  });

  it('forwards search, topic, minimumSeverity, createdAfter, offset, and limit', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
    const store = createMockStore();

    createGetNotificationsAction({
      store,
      auth,
      actionsRegistry: mockActionsRegistry,
    });

    await mockActionsRegistry.invoke({
      id: 'test:get-notifications',
      input: {
        view: 'all',
        search: 'deploy',
        topic: 'ci/cd',
        minimumSeverity: 'high',
        createdAfter: '2025-04-01T00:00:00Z',
        offset: 20,
        limit: 50,
      },
      credentials: userCredentials,
    });

    expect(store.getNotifications).toHaveBeenCalledWith(
      expect.objectContaining({
        user: 'user:default/test',
        search: 'deploy',
        topic: 'ci/cd',
        minimumSeverity: 'high',
        createdAfter: new Date('2025-04-01T00:00:00Z'),
        offset: 20,
        limit: 50,
      }),
    );
  });

  it('throws InputError when called without user credentials', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
    const store = createMockStore();

    createGetNotificationsAction({
      store,
      auth,
      actionsRegistry: mockActionsRegistry,
    });

    await expect(
      mockActionsRegistry.invoke({
        id: 'test:get-notifications',
        input: {},
        credentials: mockCredentials.service(),
      }),
    ).rejects.toThrow('This action requires user credentials');
  });
});
