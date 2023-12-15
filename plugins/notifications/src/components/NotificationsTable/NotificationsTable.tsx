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
import {
  IconButton,
  makeStyles,
  Table,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { Notification } from '@backstage/plugin-notifications-common';
import { useNavigate } from 'react-router-dom';
import NotificationsIcon from '@material-ui/icons/Notifications';
import Checkbox from '@material-ui/core/Checkbox';
import Check from '@material-ui/icons/Check';
import Bookmark from '@material-ui/icons/Bookmark';

const useStyles = makeStyles(theme => ({
  notificationRow: {
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.palette.linkHover,
    },
  },
  checkBox: {
    padding: '0 10px 10px 0',
  },
}));

/** @public */
export const NotificationsTable = (props: {
  notifications?: Notification[];
}) => {
  const { notifications } = props;
  const navigate = useNavigate();
  const styles = useStyles();
  // TODO: Add select all
  // TODO: Make mark as read work
  // TODO: Check status of the notification and change to "Mark as unread" if it's already read
  // TODO: Add support to save notifications (storageApi)
  // TODO: Show timestamp relative time (react-relative-time npm package)
  // TODO: Add signals listener and refresh data on message
  // TODO: Handle no notifications properly
  // TODO: Handle loading notifications
  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell colSpan={3}>
            {notifications?.length ?? 0} notifications
          </TableCell>
        </TableRow>
      </TableHead>
      {props.notifications?.map(notification => {
        return (
          <TableRow key={notification.id} className={styles.notificationRow}>
            <TableCell width={100} style={{ verticalAlign: 'center' }}>
              <Checkbox className={styles.checkBox} size="small" />
              {notification.icon ?? <NotificationsIcon fontSize="small" />}
            </TableCell>
            <TableCell onClick={() => navigate(notification.link)}>
              <Typography variant="subtitle2">{notification.title}</Typography>
              <Typography variant="body2">
                {notification.description}
              </Typography>
            </TableCell>
            <TableCell style={{ textAlign: 'right' }}>
              <Tooltip title="Mark as read">
                <IconButton>
                  <Check fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Save">
                <IconButton>
                  <Bookmark fontSize="small" />
                </IconButton>
              </Tooltip>
            </TableCell>
          </TableRow>
        );
      })}
    </Table>
  );
};
