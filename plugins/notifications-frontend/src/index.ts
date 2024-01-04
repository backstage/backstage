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
export { notificationsPlugin, NotificationsPage } from './plugin';

// API Reference
export {
  notificationsApiRef,
  type NotificationsApi,
  type NotificationsCreateRequest,
  type NotificationsQuery,
  type NotificationsCountQuery,
} from './api';

export { type Notification } from './openapi';

// selected constants for export
export { NOTIFICATIONS_ROUTE } from './constants';

// selected components for export
export { NotificationsSidebarItem } from './components/NotificationsSidebarItem';
export { usePollingEffect } from './components/usePollingEffect';
