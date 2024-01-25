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

/** @public */
export const NotificationsSidebarItem = () => {
  const { loading, error, value, retry } = useNotificationsApi(api =>
    api.getStatus(),
  );
  const [unreadCount, setUnreadCount] = React.useState(0);
  const [webNotificationPermission, setWebNotificationPermission] =
    React.useState('default');
  const notificationsRoute = useRouteRef(rootRouteRef);
  const { lastSignal } = useSignal('notifications');
  const [webNotifications, setWebNotifications] = React.useState<
    Notification[]
  >([]);
  const [refresh, setRefresh] = React.useState(false);

  useEffect(() => {
    if ('Notification' in window && webNotificationPermission === 'default') {
      window.Notification.requestPermission().then(permission => {
        setWebNotificationPermission(permission);
      });
    }
  }, [webNotificationPermission]);

  useEffect(() => {
    if (refresh) {
      retry();
      setRefresh(false);
    }
  }, [refresh, retry]);

  useEffect(() => {
    if (lastSignal && lastSignal.action === 'refresh') {
      if (
        webNotificationPermission === 'granted' &&
        'title' in lastSignal &&
        'description' in lastSignal &&
        'link' in lastSignal
      ) {
        const notification = new Notification(lastSignal.title as string, {
          body: lastSignal.description as string,
        });
        notification.onclick = function (event) {
          event.preventDefault();
          notification.close();
          window.open(lastSignal.link as string, '_blank');
        };
        setWebNotifications(prev => [...prev, notification]);
      }
      setRefresh(true);
    }
  }, [lastSignal, webNotificationPermission]);

  useEffect(() => {
    if (!loading && !error && value) {
      setUnreadCount(value.unread);
    }
  }, [loading, error, value]);

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      webNotifications.forEach(n => n.close());
      setWebNotifications([]);
    }
  });

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
