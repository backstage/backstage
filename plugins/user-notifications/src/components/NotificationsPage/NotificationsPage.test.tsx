/*
 * Copyright 2021 The Backstage Authors
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

import { renderInTestApp } from '@backstage/test-utils';
import { waitFor } from '@testing-library/react';
import { Notification } from '@backstage/core-plugin-api';
// import userEvent from '@testing-library/user-event';
import React from 'react';
import { useNotifications } from '@backstage/core-app-api';
import { NotificationsPage } from './NotificationsPage';

jest.mock('@backstage/core-app-api', () => ({
  ...jest.requireActual('@backstage/core-app-api'),
  useNotifications: jest.fn(),
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
describe('NotificationsPage', () => {
  it('renders notifications linked to an entity', async () => {
    (useNotifications as jest.Mock).mockReturnValueOnce({
      notifications: [tingleNotification, alertNotification],
      acknowledge: jest.fn(),
    });

    const { getByText, queryByText } = await renderInTestApp(
      <NotificationsPage />,
    );

    await waitFor(() => {
      expect(getByText('Tingle message')).toBeInTheDocument();
      expect(queryByText('Alert message')).not.toBeInTheDocument();
    });
  });
});
