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
import throttle from 'lodash/throttle';
// @ts-ignore
import RelativeTime from 'react-relative-time';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import CheckBox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { Notification } from '@backstage/plugin-notifications-common';
import { useConfirm } from 'material-ui-confirm';
import { alertApiRef, useApi } from '@backstage/core-plugin-api';
import {
  Link,
  Table,
  TableColumn,
  TableProps,
} from '@backstage/core-components';

import { notificationsApiRef } from '../../api';

import { SeverityIcon } from './SeverityIcon';
import { SelectAll } from './SelectAll';
import { BulkActions } from './BulkActions';

const ThrottleDelayMs = 1000;

const useStyles = makeStyles({
  description: {
    maxHeight: '5rem',
    overflow: 'auto',
  },
  severityItem: {
    alignContent: 'center',
  },
});

/** @public */
export type NotificationsTableProps = Pick<
  TableProps,
  'onPageChange' | 'onRowsPerPageChange' | 'page' | 'totalCount'
> & {
  markAsReadOnLinkOpen?: boolean;
  isLoading?: boolean;
  isUnread: boolean;
  notifications?: Notification[];
  onUpdate: () => void;
  setContainsText: (search: string) => void;
  pageSize: number;
};

/** @public */
export const NotificationsTable = ({
  markAsReadOnLinkOpen,
  isLoading,
  notifications = [],
  isUnread,
  onUpdate,
  setContainsText,
  onPageChange,
  onRowsPerPageChange,
  page,
  pageSize,
  totalCount,
}: NotificationsTableProps) => {
  const classes = useStyles();
  const notificationsApi = useApi(notificationsApiRef);
  const alertApi = useApi(alertApiRef);
  const confirm = useConfirm();

  const [selectedNotifications, setSelectedNotifications] = React.useState(
    new Set<Notification['id']>(),
  );

  const onNotificationsSelectChange = React.useCallback(
    (ids: Notification['id'][], checked: boolean) => {
      let newSelect: Set<Notification['id']>;
      if (checked) {
        newSelect = new Set([...selectedNotifications, ...ids]);
      } else {
        newSelect = new Set(selectedNotifications);
        ids.forEach(id => newSelect.delete(id));
      }
      setSelectedNotifications(newSelect);
    },
    [selectedNotifications, setSelectedNotifications],
  );

  const onSwitchReadStatus = React.useCallback(
    (ids: Notification['id'][], newStatus: boolean) => {
      notificationsApi
        .updateNotifications({
          ids,
          read: newStatus,
        })
        .then(onUpdate);
    },
    [notificationsApi, onUpdate],
  );

  const onSwitchSavedStatus = React.useCallback(
    (ids: Notification['id'][], newStatus: boolean) => {
      notificationsApi
        .updateNotifications({
          ids,
          saved: newStatus,
        })
        .then(onUpdate);
    },
    [notificationsApi, onUpdate],
  );

  const onMarkAllRead = React.useCallback(() => {
    confirm({
      title: 'Are you sure?',
      description: (
        <>
          Mark <b>all</b> notifications as <b>read</b>.
        </>
      ),
      confirmationText: 'Mark All',
    })
      .then(async () => {
        const ids = (
          await notificationsApi.getNotifications({ read: false })
        ).notifications?.map(notification => notification.id);

        return notificationsApi
          .updateNotifications({
            ids,
            read: true,
          })
          .then(onUpdate);
      })
      .catch(e => {
        if (e) {
          // if e === undefined, the Cancel button has been hit
          alertApi.post({
            message: 'Failed to mark all notifications as read',
            severity: 'error',
          });
        }
      });
  }, [alertApi, confirm, notificationsApi, onUpdate]);

  const throttledContainsTextHandler = React.useMemo(
    () => throttle(setContainsText, ThrottleDelayMs),
    [setContainsText],
  );

  React.useEffect(() => {
    const allShownIds = new Set(notifications.map(n => n.id));
    const intersect = [...selectedNotifications].filter(id =>
      allShownIds.has(id),
    );
    if (selectedNotifications.size !== intersect.length) {
      setSelectedNotifications(new Set(intersect));
    }
  }, [notifications, selectedNotifications]);

  const compactColumns = React.useMemo((): TableColumn<Notification>[] => {
    const showToolbar = notifications.length > 0;

    return [
      {
        /* selection column */
        width: '1rem',
        title: showToolbar ? (
          <SelectAll
            count={selectedNotifications.size}
            totalCount={notifications.length}
            onSelectAll={() =>
              onNotificationsSelectChange(
                notifications.map(notification => notification.id),
                selectedNotifications.size !== notifications.length,
              )
            }
          />
        ) : undefined,
        render: (notification: Notification) => (
          <CheckBox
            color="primary"
            checked={selectedNotifications.has(notification.id)}
            onChange={(_, checked) =>
              onNotificationsSelectChange([notification.id], checked)
            }
          />
        ),
      },
      {
        /* compact-data column */
        customFilterAndSearch: () =>
          true /* Keep sorting&filtering on backend due to pagination. */,
        render: (notification: Notification) => {
          // Compact content
          return (
            <Grid container>
              <Grid item className={classes.severityItem}>
                <SeverityIcon severity={notification.payload?.severity} />
              </Grid>
              <Grid item xs={11}>
                <Box>
                  <Typography variant="subtitle2">
                    {notification.payload.link ? (
                      <Link
                        to={notification.payload.link}
                        onClick={() => {
                          if (markAsReadOnLinkOpen && !notification.read) {
                            onSwitchReadStatus([notification.id], true);
                          }
                        }}
                      >
                        {notification.payload.title}
                      </Link>
                    ) : (
                      notification.payload.title
                    )}
                  </Typography>
                  {notification.payload.description ? (
                    <Typography variant="body2" className={classes.description}>
                      {notification.payload.description}
                    </Typography>
                  ) : null}
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
              </Grid>
            </Grid>
          );
        },
      },
      {
        /* actions column */
        width: '1rem',
        title: showToolbar ? (
          <BulkActions
            notifications={notifications}
            selectedNotifications={selectedNotifications}
            isUnread={isUnread}
            onSwitchReadStatus={onSwitchReadStatus}
            onSwitchSavedStatus={onSwitchSavedStatus}
            onMarkAllRead={onMarkAllRead}
          />
        ) : undefined,
        render: (notification: Notification) => (
          <BulkActions
            notifications={[notification]}
            selectedNotifications={new Set([notification.id])}
            onSwitchReadStatus={onSwitchReadStatus}
            onSwitchSavedStatus={onSwitchSavedStatus}
            //
          />
        ),
      },
    ];
  }, [
    markAsReadOnLinkOpen,
    selectedNotifications,
    notifications,
    isUnread,
    onSwitchReadStatus,
    onSwitchSavedStatus,
    onMarkAllRead,
    onNotificationsSelectChange,
    classes.severityItem,
    classes.description,
  ]);

  return (
    <Table<Notification>
      isLoading={isLoading}
      options={{
        padding: 'dense',
        search: true,
        paging: true,
        pageSize,
        header: true,
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
