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
import { Notification } from '@backstage/plugin-notifications-common';
import { NotificationsApi, notificationsApiRef } from '../../api';
import { UnreadNotificationsCard } from './UnreadNotificationsCard';

const testNotification: Notification = {
  id: 'notification-1',
  user: 'user:default/john.doe',
  origin: 'plugin-test',
  created: new Date('2024-01-01T00:00:00.000Z'),
  payload: {
    title: '**Important** notification',
    description: 'Test description',
    link: '/catalog',
    severity: 'normal',
    topic: 'test-topic',
  },
};

describe('UnreadNotificationsCard', () => {
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
  });

  it('renders unread notifications as plain text', async () => {
    await renderInTestApp(
      <TestApiProvider apis={[[notificationsApiRef, notificationsApi]]}>
        <UnreadNotificationsCard />
      </TestApiProvider>,
    );

    expect(
      await screen.findByText('Important notification'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Last unread notifications (1)'),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'View All' })).toHaveAttribute(
      'href',
      '/notifications',
    );
  });

  it('links notifications to the notifications page with the id query param', async () => {
    await renderInTestApp(
      <TestApiProvider apis={[[notificationsApiRef, notificationsApi]]}>
        <UnreadNotificationsCard />
      </TestApiProvider>,
    );

    const notificationLink = await screen.findByRole('link', {
      name: 'Important notification',
    });
    expect(notificationLink).toHaveAttribute(
      'href',
      '/notifications?id=notification-1',
    );
  });

  it('truncates long titles and exposes the full title for accessibility', async () => {
    const longTitle = `Title ${'x'.repeat(90)}`;
    notificationsApi.getNotifications.mockResolvedValue({
      notifications: [
        {
          ...testNotification,
          payload: {
            ...testNotification.payload,
            title: longTitle,
          },
        },
      ],
      totalCount: 1,
    });

    await renderInTestApp(
      <TestApiProvider apis={[[notificationsApiRef, notificationsApi]]}>
        <UnreadNotificationsCard charLimit={20} />
      </TestApiProvider>,
    );

    const notificationLink = await screen.findByRole('link', {
      name: `${longTitle.slice(0, 20)}...`,
    });
    expect(notificationLink).toHaveAttribute('title', longTitle);
  });

  it('renders the empty state and keeps View All visible', async () => {
    notificationsApi.getNotifications.mockResolvedValue({
      notifications: [],
      totalCount: 0,
    });

    await renderInTestApp(
      <TestApiProvider apis={[[notificationsApiRef, notificationsApi]]}>
        <UnreadNotificationsCard />
      </TestApiProvider>,
    );

    expect(await screen.findByText('All caught up!')).toBeInTheDocument();
    expect(
      screen.getByTestId('unread-notifications-empty-icon'),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'View All' }),
    ).toBeInTheDocument();
  });

  it('requests only unread notifications using maxMessages', async () => {
    await renderInTestApp(
      <TestApiProvider apis={[[notificationsApiRef, notificationsApi]]}>
        <UnreadNotificationsCard maxMessages={3} />
      </TestApiProvider>,
    );

    await screen.findByText('Important notification');

    expect(notificationsApi.getNotifications).toHaveBeenCalledWith({
      limit: 3,
      read: false,
      sort: 'created',
      sortOrder: 'desc',
    });
  });

  it('supports deprecated initialCount and maxChars aliases', async () => {
    await renderInTestApp(
      <TestApiProvider apis={[[notificationsApiRef, notificationsApi]]}>
        <UnreadNotificationsCard initialCount={4} maxChars={25} />
      </TestApiProvider>,
    );

    await screen.findByText('Important notification');

    expect(notificationsApi.getNotifications).toHaveBeenCalledWith({
      limit: 4,
      read: false,
      sort: 'created',
      sortOrder: 'desc',
    });
  });
});
