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

import React, { useEffect, useState } from 'react';
import {
  notificationApiRef,
  useApi,
  useRouteRef,
} from '@backstage/core-plugin-api';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { notificationsRouteRef } from '../../routes';
import { SidebarItem } from '@backstage/core-components';

export const SidebarNotifications = () => {
  const notificationApi = useApi(notificationApiRef);
  const [hasNotifications, setHasNotifications] = useState<boolean>(false);

  // TODO: this isn't how it should work
  useEffect(() => {
    const subscription = notificationApi
      .notification$()
      .subscribe(notification => {
        setHasNotifications(
          notification.spec?.displayAs === 'notification' &&
            !notification.spec?.readTimestamp,
        );
      });

    return () => {
      subscription.unsubscribe();
    };
  }, [notificationApi]);

  const routePath = useRouteRef(notificationsRouteRef);
  return (
    <SidebarItem
      text="Notifications"
      to={routePath()}
      icon={NotificationsIcon}
      hasNotifications={hasNotifications}
    />
  );
};
