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
import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import {
  NotificationsPage,
  notificationsPlugin,
  NotificationsSidebarItem,
} from '../src';
import { signalsPlugin } from '@backstage/plugin-signals';
import { SidebarItem } from '@backstage/core-components';
import AddAlert from '@material-ui/icons/AddAlert';

createDevApp()
  .registerPlugin(notificationsPlugin)
  .registerPlugin(signalsPlugin)
  .addPage({
    element: (
      <NotificationsPage
        title="Notifications (debug)"
        subtitle="Notifications local development environment to showcase notification capabilities"
      />
    ),
    path: '/notifications',
  })
  .addSidebarItem(<NotificationsSidebarItem webNotificationsEnabled />)
  .addSidebarItem(
    <SidebarItem
      icon={AddAlert}
      text="Random notification"
      onClick={() => {
        fetch('http://localhost:7007/api/notifications-debug/', {
          method: 'POST',
        });
      }}
    />,
  )
  .render();
