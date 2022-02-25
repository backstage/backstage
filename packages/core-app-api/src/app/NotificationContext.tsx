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
  useMemo,
  useState,
} from 'react';
import {
  Notification,
  notificationApiRef,
  useApi,
} from '@backstage/core-plugin-api';
import { NotificationContext as NotificationContextV1 } from './types';

const NotificationContext = createContext<NotificationContextV1 | undefined>(
  undefined,
);

export const NotificationContextProvider = ({
  children,
}: PropsWithChildren<{}>) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const notificationApi = useApi(notificationApiRef);
  notificationApi.notification$().subscribe(notification => {
    setNotifications(prev => prev.concat(notification));
  });
  const value = useMemo(
    () => ({
      getNotifications: () => notifications,
    }),
    [notifications],
  );

  return <NotificationContext.Provider value={value} children={children} />;
};

export function useNotifications(): Notification[] {
  const context = useContext(NotificationContext);

  if (!context) {
    throw Error('useNotification used outside of NotificationContext');
  }

  return context.getNotifications();
}
