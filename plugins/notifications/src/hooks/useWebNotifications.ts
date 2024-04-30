/*
 * Copyright 2024 The Backstage Authors
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
import { useCallback, useEffect, useState } from 'react';
import { rootRouteRef } from '../routes';
import { useRouteRef } from '@backstage/core-plugin-api';
import { useNavigate } from 'react-router-dom';

/** @public */
export function useWebNotifications(enabled: boolean) {
  const [webNotificationPermission, setWebNotificationPermission] =
    useState('default');
  const notificationsRoute = useRouteRef(rootRouteRef);
  const navigate = useNavigate();

  useEffect(() => {
    if (
      enabled &&
      'Notification' in window &&
      webNotificationPermission === 'default'
    ) {
      window.Notification.requestPermission().then(permission => {
        setWebNotificationPermission(permission);
      });
    }
  }, [enabled, webNotificationPermission]);

  const sendWebNotification = useCallback(
    (options: {
      id: string;
      title: string;
      description: string;
      link?: string;
    }) => {
      if (webNotificationPermission !== 'granted') {
        return null;
      }

      const notification = new Notification(options.title, {
        body: options.description,
        tag: options.id, // Prevent duplicates from multiple tabs
      });

      notification.onclick = event => {
        event.preventDefault();
        if (options.link) {
          window.open(options.link, '_blank');
        } else {
          navigate(notificationsRoute());
        }
        notification.close();
      };

      return notification;
    },
    [webNotificationPermission, navigate, notificationsRoute],
  );

  return { sendWebNotification };
}
