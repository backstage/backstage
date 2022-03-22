/*
 * Copyright 2022 The Backstage Authors
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

import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  Notification,
  notificationApiRef,
  useApi,
} from '@backstage/core-plugin-api';

type NotificationContextValue = {
  notifications: Notification[];
  acknowledge: (timestamp: number) => void;
  acknowledged: number | undefined;
};

const NotificationContext = createContext<NotificationContextValue | undefined>(
  undefined,
);

export const NotificationContextProvider = ({
  children,
}: PropsWithChildren<{}>) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [acknowledged, setAcknowledged] = useState<number | undefined>(
    undefined,
  );
  const notificationApi = useApi(notificationApiRef);

  useEffect(() => {
    notificationApi.notification$().subscribe(notification => {
      setNotifications(prev => [notification].concat(prev));
    });
  }, [notificationApi]);

  const value = useMemo(
    () => ({
      notifications,
      acknowledged,
      acknowledge: (timestamp: number) => setAcknowledged(timestamp),
    }),
    [acknowledged, notifications],
  );

  return <NotificationContext.Provider value={value} children={children} />;
};

export function useNotifications(): NotificationContextValue {
  const context = useContext(NotificationContext);
  if (!context) {
    throw Error('useNotification used outside of NotificationContext');
  }
  return context;
}
