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

/** @public */
export function useWebNotifications() {
  const [webNotificationPermission, setWebNotificationPermission] =
    useState('default');
  const [webNotifications, setWebNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if ('Notification' in window && webNotificationPermission === 'default') {
      window.Notification.requestPermission().then(permission => {
        setWebNotificationPermission(permission);
      });
    }
  }, [webNotificationPermission]);

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      webNotifications.forEach(n => n.close());
      setWebNotifications([]);
    }
  });

  const sendWebNotification = useCallback(
    (options: { title: string; description: string }) => {
      if (webNotificationPermission !== 'granted') {
        return null;
      }

      const notification = new Notification(options.title, {
        body: options.description,
      });
      return notification;
    },
    [webNotificationPermission],
  );

  return { sendWebNotification };
}
