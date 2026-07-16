/*
 * Copyright 2026 The Backstage Authors
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

import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import { screen } from '@testing-library/react';
import { toastApiRef } from '@backstage/frontend-plugin-api';
import { Notification } from '@backstage/plugin-notifications-common';
import { NotificationsApi, notificationsApiRef } from '../../api';
import { NotificationsPage } from './NotificationsPage';

const testNotification: Notification = {
  id: 'notification-1',
  user: 'user:default/john.doe',
  origin: 'plugin-test',
  created: new Date('2024-01-01T00:00:00.000Z'),
  payload: {
    title: 'Important notification',
    description: 'Expanded description for deep link',
    severity: 'normal',
    topic: 'test-topic',
  },
};

describe('NotificationsPage deep linking', () => {
  const notificationsApi: jest.Mocked<NotificationsApi> = {
    getNotifications: jest.fn(),
    getStatus: jest.fn(),
    getNotification: jest.fn(),
    getNotificationSettings: jest.fn(),
    getTopics: jest.fn(),
    updateNotifications: jest.fn(),
    updateNotificationSettings: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    notificationsApi.getNotifications.mockResolvedValue({
      notifications: [testNotification],
      totalCount: 1,
    });
    notificationsApi.getStatus.mockResolvedValue({ unread: 1, read: 0 });
    notificationsApi.getTopics.mockResolvedValue({ topics: ['test-topic'] });
    notificationsApi.getNotification.mockResolvedValue(testNotification);
  });

  it('loads and focuses a notification from the id query param', async () => {
    await renderInTestApp(
      <TestApiProvider
        apis={[
          [notificationsApiRef, notificationsApi],
          [toastApiRef, { post: jest.fn() }],
        ]}
      >
        <NotificationsPage />
      </TestApiProvider>,
      {
        routeEntries: ['/notifications?id=notification-1'],
      },
    );

    expect(
      await screen.findByText('Important notification'),
    ).toBeInTheDocument();
    expect(notificationsApi.getNotification).toHaveBeenCalledWith(
      'notification-1',
    );

    const highlightedNotification = document.getElementById(
      'notification-notification-1',
    );
    expect(highlightedNotification).toBeInTheDocument();
    expect(highlightedNotification).toHaveAttribute('tabindex', '-1');
  });
});
