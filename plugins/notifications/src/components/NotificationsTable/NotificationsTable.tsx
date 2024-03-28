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
import { Notification } from '@backstage/plugin-notifications-common';

import { notificationsApiRef } from '../../api';
import { useApi } from '@backstage/core-plugin-api';
import {
  Link,
  Table,
  TableProps,
  TableColumn,
} from '@backstage/core-components';

import { SeverityIcon } from './SeverityIcon';
import { SelectAll } from './SelectAll';
import { BulkActions } from './BulkActions';

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

  const compactColumns = React.useMemo(
    (): TableColumn<Notification>[] => [
      {
        /* selection column */
        width: '1rem',
        title: (
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
        ),
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
              <Grid item>
                <SeverityIcon severity={notification.payload?.severity} />
              </Grid>
              <Grid item>
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
              </Grid>
            </Grid>
          );
        },
      },
      {
        /* actions column */
        width: '1rem',
        title: (
          <BulkActions
            notifications={notifications}
            selectedNotifications={selectedNotifications}
            onSwitchReadStatus={onSwitchReadStatus}
            onSwitchSavedStatus={onSwitchSavedStatus}
          />
        ),
        render: (notification: Notification) => (
          <BulkActions
            notifications={[notification]}
            selectedNotifications={new Set([notification.id])}
            onSwitchReadStatus={onSwitchReadStatus}
            onSwitchSavedStatus={onSwitchSavedStatus}
          />
        ),
      },
    ],
    [
      onSwitchReadStatus,
      onSwitchSavedStatus,
      selectedNotifications,
      onNotificationsSelectChange,
      notifications,
    ],
  );

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
