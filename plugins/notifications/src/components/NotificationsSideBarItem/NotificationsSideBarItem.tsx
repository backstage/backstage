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
import React, { useEffect, useMemo } from 'react';
import { useNotificationsApi } from '../../hooks';
import { SidebarItem } from '@backstage/core-components';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { configApiRef, useApi, useRouteRef } from '@backstage/core-plugin-api';
import { rootRouteRef } from '../../routes';
import { useSignal } from '@backstage/plugin-signals-react';
import { useWebNotifications } from '../../hooks/useWebNotifications';
import { useTitleCounter } from '../../hooks/useTitleCounter';

/** @public */
export const NotificationsSidebarItem = () => {
  const { loading, error, value, retry } = useNotificationsApi(api =>
    api.getStatus(),
  );
  const config = useApi(configApiRef);
  const [unreadCount, setUnreadCount] = React.useState(0);
  const notificationsRoute = useRouteRef(rootRouteRef);
  const { lastSignal } = useSignal('notifications');
  const { sendWebNotification } = useWebNotifications();
  const [refresh, setRefresh] = React.useState(false);
  const webNotificationsEnabled = useMemo(
    () =>
      config.getOptionalBoolean('notifications.enableWebNotifications') ??
      false,
    [config],
  );
  const titleCounterEnabled = useMemo(
    () => config.getOptionalString('notifications.enableTitleCounter') ?? true,
    [config],
  );
  const { setNotificationCount } = useTitleCounter();

  useEffect(() => {
    if (refresh) {
      retry();
      setRefresh(false);
    }
  }, [refresh, retry]);

  useEffect(() => {
    if (lastSignal && lastSignal.action === 'refresh') {
      if (
        webNotificationsEnabled &&
        'title' in lastSignal &&
        'description' in lastSignal &&
        'link' in lastSignal
      ) {
        const notification = sendWebNotification({
          title: lastSignal.title as string,
          description: lastSignal.description as string,
        });
        if (notification) {
          notification.onclick = event => {
            event.preventDefault();
            notification.close();
            window.open(lastSignal.link as string, '_blank');
          };
        }
      }
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
