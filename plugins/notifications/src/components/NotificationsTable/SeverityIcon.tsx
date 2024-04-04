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
import React from 'react';
import { NotificationSeverity } from '@backstage/plugin-notifications-common';
import NormalIcon from '@material-ui/icons/CheckOutlined';
import CriticalIcon from '@material-ui/icons/ErrorOutline';
import HighIcon from '@material-ui/icons/WarningOutlined';
import LowIcon from '@material-ui/icons/InfoOutlined';

export const SeverityIcon = ({
  severity,
}: {
  severity?: NotificationSeverity;
}) => {
  switch (severity) {
    case 'critical':
      return <CriticalIcon htmlColor="#C9190B" />;
    case 'high':
      return <HighIcon htmlColor="#F0AB00" />;
    case 'low':
      return <LowIcon htmlColor="#2B9AF3" />;
    case 'normal':
    default:
      return <NormalIcon htmlColor="#5BA352" />;
  }
};
