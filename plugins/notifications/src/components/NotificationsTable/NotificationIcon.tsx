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
import NotificationsIcon from '@material-ui/icons/Notifications';
import { Notification } from '@backstage/plugin-notifications-common';
// eslint-disable-next-line no-restricted-imports
import * as muiIcons from '@material-ui/icons';
import Avatar from '@material-ui/core/Avatar';

/** @internal */
export const NotificationIcon = (props: { notification: Notification }) => {
  const { notification } = props;
  if (notification.icon && notification.icon in muiIcons) {
    const Icon = muiIcons[notification.icon];
    return <Icon fontSize="small" />;
  }

  if (notification.image) {
    return (
      <Avatar
        src={notification.image}
        style={{ width: '20px', height: '20px' }}
      />
    );
  }

  return <NotificationsIcon fontSize="small" />;
};
