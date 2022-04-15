/*
 * Copyright 2020 The Backstage Authors
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

import React from 'react';
import { SidebarNotifications } from './SidebarNotifications';
import { Notification } from '@backstage/core-plugin-api';
import { renderInTestApp } from '@backstage/test-utils';
import { useNotifications } from '@backstage/core-app-api';

jest.mock('@backstage/core-app-api', () => ({
  ...jest.requireActual('@backstage/core-app-api'),
  useNotifications: jest.fn(),
}));

jest.mock('@backstage/core-plugin-api', () => ({
  ...jest.requireActual('@backstage/core-plugin-api'),
  useRouteRef: jest.fn().mockReturnValue(jest.fn()),
}));

const tingleNotification: Notification = {
  kind: 'tingle',
  metadata: {
    message: 'message one',
    title: 'Tingle message',
    uuid: '123',
    timestamp: 2302,
  },
  spec: {
    targetEntityRefs: ['entity1'],
  },
};

const alertNotification: Notification = {
  kind: 'alert',
  metadata: {
    severity: 'info',
    message: 'new alert',
    title: 'Alert message',
    uuid: '13',
    timestamp: 232,
  },
};
describe('<SidebarNotifications />', () => {
  it('renders without exploding when there are no notifications', async () => {
    (useNotifications as jest.Mock).mockReturnValueOnce({
      notifications: [],
      acknowledge: jest.fn(),
    });

    const { getByLabelText } = await renderInTestApp(<SidebarNotifications />);
    const notificationsContainer = getByLabelText('Notifications');

    expect(
      notificationsContainer.getElementsByClassName(
        'MuiBadge-dot MuiBadge-invisible',
      ).length,
    ).toBe(1);
  });

  it('shows there are notifications if at least one is linked to an entity', async () => {
    (useNotifications as jest.Mock).mockReturnValue({
      notifications: [tingleNotification, alertNotification],
      acknowledge: jest.fn(),
    });

    const { getByLabelText } = await renderInTestApp(<SidebarNotifications />);
    const notificationsContainer = getByLabelText('Notifications');

    expect(
      notificationsContainer.getElementsByClassName(
        'MuiBadge-dot MuiBadge-invisible',
      ).length,
    ).toBe(0);
  });

  it('shows no notifications if notifications are not linked to entities', async () => {
    (useNotifications as jest.Mock).mockReturnValue({
      notifications: [alertNotification],
      acknowledge: jest.fn(),
    });

    const { getByLabelText } = await renderInTestApp(<SidebarNotifications />);
    const notificationsContainer = getByLabelText('Notifications');

    expect(
      notificationsContainer.getElementsByClassName(
        'MuiBadge-dot MuiBadge-invisible',
      ).length,
    ).toBe(1);
  });
});
