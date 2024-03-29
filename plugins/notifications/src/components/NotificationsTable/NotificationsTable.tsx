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
import React, { useMemo } from 'react';
import throttle from 'lodash/throttle';
// @ts-ignore
import RelativeTime from 'react-relative-time';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { Notification } from '@backstage/plugin-notifications-common';

import { notificationsApiRef } from '../../api';
import { useApi } from '@backstage/core-plugin-api';
import {
  Link,
  Table,
  TableProps,
  TableColumn,
} from '@backstage/core-components';

import MarkAsUnreadIcon from '@material-ui/icons/Markunread' /* TODO: use Drafts and MarkAsUnread once we have mui 5 icons */;
import MarkAsReadIcon from '@material-ui/icons/CheckCircle';
import MarkAsUnsavedIcon from '@material-ui/icons/LabelOff' /* TODO: use BookmarkRemove and BookmarkAdd once we have mui 5 icons */;
import MarkAsSavedIcon from '@material-ui/icons/Label';
import { SeverityIcon } from './SeverityIcon';

const ThrottleDelayMs = 1000;

/** @public */
export type NotificationsTableProps = Pick<
  TableProps,
  'onPageChange' | 'onRowsPerPageChange' | 'page' | 'totalCount'
> & {
  isLoading?: boolean;
  notifications?: Notification[];
  onUpdate: () => void;
  setContainsText: (search: string) => void;
  pageSize: number;
};

/** @public */
export const NotificationsTable = ({
  isLoading,
  notifications = [],
  onUpdate,
  setContainsText,
  onPageChange,
  onRowsPerPageChange,
  page,
  pageSize,
  totalCount,
}: NotificationsTableProps) => {
  const notificationsApi = useApi(notificationsApiRef);

  const onSwitchReadStatus = React.useCallback(
    (notification: Notification) => {
      notificationsApi
        .updateNotifications({
          ids: [notification.id],
          read: !notification.read,
        })
        .then(() => onUpdate());
    },
    [notificationsApi, onUpdate],
  );

  const onSwitchSavedStatus = React.useCallback(
    (notification: Notification) => {
      notificationsApi
        .updateNotifications({
          ids: [notification.id],
          saved: !notification.saved,
        })
        .then(() => onUpdate());
    },
    [notificationsApi, onUpdate],
  );

  const throttledContainsTextHandler = useMemo(
    () => throttle(setContainsText, ThrottleDelayMs),
    [setContainsText],
  );

  const compactColumns = React.useMemo(
    (): TableColumn<Notification>[] => [
      {
        width: '1rem',
        render: (notification: Notification) => (
          <SeverityIcon severity={notification.payload?.severity} />
        ),
      },
      {
        customFilterAndSearch: () =>
          true /* Keep it on backend due to pagination. If recent flickering is an issue, implement search here as well. */,
        render: (notification: Notification) => {
          // Compact content
          return (
            <>
              <Box>
                <Typography variant="subtitle2">
                  {notification.payload.link ? (
                    <Link to={notification.payload.link}>
                      {notification.payload.title}
                    </Link>
                  ) : (
                    notification.payload.title
                  )}
                </Typography>
                <Typography variant="body2">
                  {notification.payload.description}
                </Typography>
                <Typography variant="caption">
                  {notification.origin && (
                    <>{notification.origin}&nbsp;&bull;&nbsp;</>
                  )}
                  {notification.payload.topic && (
                    <>{notification.payload.topic}&nbsp;&bull;&nbsp;</>
                  )}
                  {notification.created && (
                    <RelativeTime value={notification.created} />
                  )}
                </Typography>
              </Box>
            </>
          );
        },
      },
      // {
      //   // TODO: additional action links
      //   width: '25%',
      //   render: (notification: Notification) => {
      //     return (
      //       notification.payload.link && (
      //         <Grid container>
      //           {/* TODO: render additionalLinks of different titles */}
      //           <Grid item>
      //             <Link
      //               key={notification.payload.link}
      //               to={notification.payload.link}
      //             >
      //               &nbsp;More info
      //             </Link>
      //           </Grid>
      //         </Grid>
      //       )
      //     );
      //   },
      // },
      {
        // actions
        width: '1rem',
        render: (notification: Notification) => {
          const markAsReadText = !!notification.read
            ? 'Return among unread'
            : 'Mark as read';
          const IconComponent = !!notification.read
            ? MarkAsUnreadIcon
            : MarkAsReadIcon;

          const markAsSavedText = !!notification.saved
            ? 'Undo save'
            : 'Save for later';

          const SavedIconComponent = !!notification.saved
            ? MarkAsUnsavedIcon
            : MarkAsSavedIcon;

          return (
            <Grid container wrap="nowrap">
              <Grid item>
                <Tooltip title={markAsSavedText}>
                  <IconButton
                    onClick={() => {
                      onSwitchSavedStatus(notification);
                    }}
                  >
                    <SavedIconComponent aria-label={markAsSavedText} />
                  </IconButton>
                </Tooltip>
              </Grid>

              <Grid item>
                <Tooltip title={markAsReadText}>
                  <IconButton
                    onClick={() => {
                      onSwitchReadStatus(notification);
                    }}
                  >
                    <IconComponent aria-label={markAsReadText} />
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
          );
        },
      },
    ],
    [onSwitchReadStatus, onSwitchSavedStatus],
  );

  return (
    <Table<Notification>
      isLoading={isLoading}
      options={{
        search: true,
        paging: true,
        pageSize,
        header: false,
        sorting: false,
      }}
      onPageChange={onPageChange}
      onRowsPerPageChange={onRowsPerPageChange}
      page={page}
      totalCount={totalCount}
      onSearchChange={throttledContainsTextHandler}
      data={notifications}
      columns={compactColumns}
    />
  );
};
