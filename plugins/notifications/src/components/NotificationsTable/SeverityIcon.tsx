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
import { NotificationSeverity } from '@backstage/plugin-notifications-common';
import NormalIcon from '@material-ui/icons/CheckOutlined';
import CriticalIcon from '@material-ui/icons/ErrorOutline';
import HighIcon from '@material-ui/icons/WarningOutlined';
import LowIcon from '@material-ui/icons/InfoOutlined';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  critical: {
    color: theme.palette.status.error,
  },
  high: {
    color: theme.palette.status.warning,
  },
  normal: {
    color: theme.palette.status.ok,
  },
  low: {
    color: theme.palette.status.running,
  },
}));

export const SeverityIcon = ({
  severity,
}: {
  severity?: NotificationSeverity;
}) => {
  const classes = useStyles();

  switch (severity) {
    case 'critical':
      return <CriticalIcon className={classes.critical} />;
    case 'high':
      return <HighIcon className={classes.high} />;
    case 'low':
      return <LowIcon className={classes.low} />;
    case 'normal':
    default:
      return <NormalIcon className={classes.normal} />;
  }
};
