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
import { Notification } from '@backstage/plugin-notifications-common';
import SvgIcon from '@material-ui/core/SvgIcon';
import { useApp } from '@backstage/core-plugin-api';
import { SeverityIcon } from './SeverityIcon';

export const NotificationIcon = ({
  notification,
}: {
  notification: Notification;
}) => {
  const app = useApp();

  if (notification.payload.icon) {
    const Icon = app.getSystemIcon(notification.payload.icon) ?? SvgIcon;
    return <Icon />;
  }
  return <SeverityIcon severity={notification.payload.severity} />;
};
