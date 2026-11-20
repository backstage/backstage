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

import {
  createFrontendPlugin,
  PageBlueprint,
  SubPageBlueprint,
} from '@backstage/frontend-plugin-api';
import { renderTestApp } from '@backstage/frontend-test-utils';
import { screen } from '@testing-library/react';
import notificationsPlugin from './alpha';
import { notificationsApiRef } from './api';

const userSettingsPlugin = createFrontendPlugin({
  pluginId: 'user-settings',
  extensions: [
    PageBlueprint.make({
      params: { path: '/settings', title: 'Settings' },
    }),
    SubPageBlueprint.make({
      name: 'general',
      params: {
        path: 'general',
        title: 'General',
        loader: async () => <div>General settings</div>,
      },
    }),
  ],
});

describe('Notifications settings', () => {
  it('adds a tab to User Settings and loads notification settings', async () => {
    const getNotificationSettings = jest.fn().mockResolvedValue({
      channels: [
        {
          id: 'Web',
          origins: [{ id: 'origin-1', enabled: true, topics: [] }],
        },
      ],
    });

    renderTestApp({
      features: [userSettingsPlugin, notificationsPlugin],
      initialRouteEntries: ['/settings/notifications'],
      apis: [
        [
          notificationsApiRef,
          {
            getNotificationSettings,
          },
        ],
      ],
    });

    expect(
      await screen.findByRole('tab', { name: 'Notifications' }),
    ).toBeInTheDocument();
    expect(await screen.findByText('Origin 1')).toBeInTheDocument();
    expect(screen.getByText('Web')).toBeInTheDocument();
    expect(getNotificationSettings).toHaveBeenCalled();
  });

  it('can disable the Notifications tab through app configuration', async () => {
    renderTestApp({
      features: [userSettingsPlugin, notificationsPlugin],
      initialRouteEntries: ['/settings/general'],
      config: {
        app: {
          extensions: [{ 'sub-page:notifications/settings': false }],
        },
      },
    });

    expect(
      await screen.findByRole('tab', { name: 'General' }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('tab', { name: 'Notifications' }),
    ).not.toBeInTheDocument();
  });
});
