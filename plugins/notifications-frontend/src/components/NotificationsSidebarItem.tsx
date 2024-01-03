import React from 'react';

import { SidebarItem } from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';

import {
  IconButton,
  Link,
  makeStyles,
  Snackbar,
  Tooltip,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import NotificationsIcon from '@material-ui/icons/Notifications';
import NotificationsOffIcon from '@material-ui/icons/NotificationsOff';

import { notificationsApiRef } from '../api';
import { NOTIFICATIONS_ROUTE } from '../constants';
import { Notification } from '../openapi';
import { usePollingEffect } from './usePollingEffect';

const NotificationsErrorIcon = () => (
  <Tooltip title="Failed to load notifications">
    <NotificationsOffIcon />
  </Tooltip>
);

export type NotificationsSidebarItemProps = {
  /**
   * Number of milliseconds between polling the notifications backend.
   * If negative or zero, the poling is not started.
   * Example: 5000
   */
  pollingInterval?: number;
};

const useStyles = makeStyles(_theme => ({
  systemAlertAction: {
    marginRight: '1rem',
  },
}));

export const NotificationsSidebarItem = ({
  pollingInterval,
}: NotificationsSidebarItemProps) => {
  const styles = useStyles();
  const notificationsApi = useApi(notificationsApiRef);

  const [error, setError] = React.useState<Error | undefined>(undefined);
  const [unreadCount, setUnreadCount] = React.useState(0);
  const [pageLoadingTime] = React.useState(new Date(Date.now()));
  const [lastSystemWideNotification, setLastSystemWideNotification] =
    React.useState<Notification>();
  const [closedNotificationId, setClosedNotificationId] =
    React.useState<string>();

  const pollCallback = React.useCallback(async () => {
    try {
      setUnreadCount(
        await notificationsApi.getNotificationsCount({
          read: false,
          messageScope: 'user',
        }),
      );

      const data = await notificationsApi.getNotifications({
        pageSize: 1,
        pageNumber: 1,
        createdAfter: pageLoadingTime,
        orderBy: 'created',
        orderByDirec: 'desc',
        messageScope: 'system',
      });

      setLastSystemWideNotification(data?.[0]);
    } catch (e: unknown) {
      setError(e as Error);
    }
  }, [notificationsApi, pageLoadingTime]);

  usePollingEffect(pollCallback, [], pollingInterval);

  let icon = NotificationsIcon;
  if (!!error) {
    icon = NotificationsErrorIcon;
  }

  return (
    <>
      <SidebarItem
        icon={icon}
        to={NOTIFICATIONS_ROUTE}
        text="Notifications"
        hasNotifications={!error && !!unreadCount}
      />
      {lastSystemWideNotification && !lastSystemWideNotification.readByUser && (
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={closedNotificationId !== lastSystemWideNotification.id}
          message={lastSystemWideNotification.title}
          action={
            <>
              <Link
                href={`/${NOTIFICATIONS_ROUTE}/updates`}
                className={styles.systemAlertAction}
              >
                Show
              </Link>
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={() =>
                  setClosedNotificationId(lastSystemWideNotification.id)
                }
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </>
          }
        />
      )}
    </>
  );
};
