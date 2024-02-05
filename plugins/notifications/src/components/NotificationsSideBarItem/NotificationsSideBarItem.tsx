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
import React, { useEffect } from 'react';
import { useNotificationsApi } from '../../hooks';
import { SidebarItem } from '@backstage/core-components';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { useRouteRef } from '@backstage/core-plugin-api';
import { rootRouteRef } from '../../routes';
import { useSignal } from '@backstage/plugin-signals-react';
import { useWebNotifications } from '../../hooks/useWebNotifications';
import { useTitleCounter } from '../../hooks/useTitleCounter';
import { JsonObject } from '@backstage/types';

/** @public */
export const NotificationsSidebarItem = (props?: {
  webNotificationsEnabled?: boolean;
  titleCounterEnabled?: boolean;
}) => {
  const { webNotificationsEnabled = false, titleCounterEnabled = true } =
    props ?? { webNotificationsEnabled: false, titleCounterEnabled: true };

  const { loading, error, value, retry } = useNotificationsApi(api =>
    api.getStatus(),
  );
  const [unreadCount, setUnreadCount] = React.useState(0);
  const notificationsRoute = useRouteRef(rootRouteRef);
  // TODO: Add signal type support to `useSignal` to make it a bit easier to use
  // TODO: Do we want to add long polling in case signals are not available
  const { lastSignal } = useSignal('notifications');
  const { sendWebNotification } = useWebNotifications();
  const [refresh, setRefresh] = React.useState(false);
  const { setNotificationCount } = useTitleCounter();

  useEffect(() => {
    if (refresh) {
      retry();
      setRefresh(false);
    }
  }, [refresh, retry]);

  useEffect(() => {
    const handleWebNotification = (signal: JsonObject) => {
      if (!webNotificationsEnabled || !('notification' in signal)) {
        return;
      }

      const notificationData = signal.notification as JsonObject;

      if (
        !notificationData ||
        !('title' in notificationData) ||
        !('description' in notificationData) ||
        !('title' in notificationData)
      ) {
        return;
      }
      const notification = sendWebNotification({
        title: notificationData.title as string,
        description: notificationData.description as string,
      });
      if (notification) {
        notification.onclick = event => {
          event.preventDefault();
          notification.close();
          window.open(notificationData.link as string, '_blank');
        };
      }
    };

    if (lastSignal && lastSignal.action) {
      handleWebNotification(lastSignal);
      setRefresh(true);
    }
  }, [lastSignal, sendWebNotification, webNotificationsEnabled]);

  useEffect(() => {
    if (!loading && !error && value) {
      setUnreadCount(value.unread);
      if (titleCounterEnabled) {
        setNotificationCount(value.unread);
      }
    }
  }, [loading, error, value, titleCounterEnabled, setNotificationCount]);

  // TODO: Figure out if the count can be added to hasNotifications
  return (
    <SidebarItem
      icon={NotificationsIcon}
      to={notificationsRoute()}
      text="Notifications"
      hasNotifications={!error && !!unreadCount}
    />
  );
};
