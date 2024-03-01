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
import { notificationsPlugin } from '../src/plugin';
import { NotificationsPage } from '../src/components/NotificationsPage';
import { NotificationsSidebarItem } from '../src';
import { rootRouteRef } from '../src/routes';

// TODO: How to sign in here as guest user?
createDevApp()
  .registerPlugin(notificationsPlugin)
  .addPage({
    element: <NotificationsPage />,
    path: '/notifications',
    sideBarItem: <NotificationsSidebarItem />,
    routeRef: rootRouteRef,
  })
  .render();
