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
import React, { useCallback, useEffect } from 'react';
import { useNotificationsApi } from '../../hooks';
import { Link, SidebarItem } from '@backstage/core-components';
import NotificationsIcon from '@material-ui/icons/Notifications';
import {
  alertApiRef,
  IconComponent,
  useApi,
  useRouteRef,
} from '@backstage/core-plugin-api';
import { rootRouteRef } from '../../routes';
import { useSignal } from '@backstage/plugin-signals-react';
import {
  Notification,
  NotificationSignal,
} from '@backstage/plugin-notifications-common';
import { useWebNotifications } from '../../hooks/useWebNotifications';
import { useTitleCounter } from '../../hooks/useTitleCounter';
import { notificationsApiRef } from '../../api';
import {
  closeSnackbar,
  enqueueSnackbar,
  MaterialDesignContent,
  OptionsWithExtraProps,
  SnackbarKey,
  SnackbarProvider,
  VariantType,
} from 'notistack';
import { SeverityIcon } from '../NotificationsTable/SeverityIcon';
import OpenInNew from '@material-ui/icons/OpenInNew';
import MarkAsReadIcon from '@material-ui/icons/CheckCircle';
import IconButton from '@material-ui/core/IconButton';
import Chip from '@material-ui/core/Chip';
import { styled } from '@material-ui/core/styles';

const StyledMaterialDesignContent = styled(MaterialDesignContent)(
  ({ theme }) => ({
    '&.notistack-MuiContent-low': {
      backgroundColor: theme.palette.background.default,
      color: theme.palette.text.primary,
    },
    '&.notistack-MuiContent-normal': {
      backgroundColor: theme.palette.background.default,
      color: theme.palette.text.primary,
    },
    '&.notistack-MuiContent-high': {
      backgroundColor: theme.palette.background.default,
      color: theme.palette.text.primary,
    },
    '&.notistack-MuiContent-critical': {
      backgroundColor: theme.palette.background.default,
      color: theme.palette.text.primary,
    },
  }),
);

declare module 'notistack' {
  interface VariantOverrides {
    // Custom variants for the snackbar
    low: true;
    normal: true;
    high: true;
    critical: true;
  }
}

/** @public */
export const NotificationsSidebarItem = (props?: {
  webNotificationsEnabled?: boolean;
  titleCounterEnabled?: boolean;
  snackbarEnabled?: boolean;
  snackbarAutoHideDuration?: number | null;
  className?: string;
  icon?: IconComponent;
  text?: string;
  disableHighlight?: boolean;
  noTrack?: boolean;
}) => {
  const {
    webNotificationsEnabled = false,
    titleCounterEnabled = true,
    snackbarEnabled = true,
    snackbarAutoHideDuration = 10000,
    icon = NotificationsIcon,
    text = 'Notifications',
    ...restProps
  } = props ?? {
    webNotificationsEnabled: false,
    titleCounterEnabled: true,
    snackbarEnabled: true,
    snackbarAutoHideDuration: 10000,
  };

  const { loading, error, value, retry } = useNotificationsApi(api =>
    api.getStatus(),
  );
  const notificationsApi = useApi(notificationsApiRef);
  const alertApi = useApi(alertApiRef);
  const [unreadCount, setUnreadCount] = React.useState(0);
  const notificationsRoute = useRouteRef(rootRouteRef)();
  // TODO: Do we want to add long polling in case signals are not available
  const { lastSignal } = useSignal<NotificationSignal>('notifications');
  const { sendWebNotification, requestUserPermission } = useWebNotifications(
    webNotificationsEnabled,
  );
  const [refresh, setRefresh] = React.useState(false);
  const { setNotificationCount } = useTitleCounter();

  const getSnackbarProperties = useCallback(
    (notification: Notification) => {
      const action = (snackBarId: SnackbarKey) => (
        <>
          <IconButton
            component={Link}
            to={notification.payload.link ?? notificationsRoute}
            onClick={() => {
              if (notification.payload.link) {
                notificationsApi
                  .updateNotifications({
                    ids: [notification.id],
                    read: true,
                  })
                  .catch(() => {
                    alertApi.post({
                      message: 'Failed to mark notification as read',
                      severity: 'error',
                    });
                  });
              }
              closeSnackbar(snackBarId);
            }}
          >
            <OpenInNew fontSize="small" />
          </IconButton>
          <IconButton
            onClick={() => {
              notificationsApi
                .updateNotifications({
                  ids: [notification.id],
                  read: true,
                })
                .then(() => {
                  closeSnackbar(snackBarId);
                })
                .catch(() => {
                  alertApi.post({
                    message: 'Failed to mark notification as read',
                    severity: 'error',
                  });
                });
            }}
          >
            <MarkAsReadIcon fontSize="small" />
          </IconButton>
        </>
      );

      return { action };
    },
    [notificationsRoute, notificationsApi, alertApi],
  );

  useEffect(() => {
    if (refresh) {
      retry();
      setRefresh(false);
    }
  }, [refresh, retry]);

  useEffect(() => {
    const handleNotificationSignal = (signal: NotificationSignal) => {
      if (
        (!webNotificationsEnabled && !snackbarEnabled) ||
        signal.action !== 'new_notification'
      ) {
        return;
      }
      notificationsApi
        .getNotification(signal.notification_id)
        .then(notification => {
          if (!notification) {
            return;
          }
          if (webNotificationsEnabled) {
            sendWebNotification({
              id: notification.id,
              title: notification.payload.title,
              description: notification.payload.description ?? '',
              link: notification.payload.link,
            });
          }
          if (snackbarEnabled) {
            const { action } = getSnackbarProperties(notification);
            const snackBarText =
              notification.payload.title.length > 50
                ? `${notification.payload.title.substring(0, 50)}...`
                : notification.payload.title;
            enqueueSnackbar(snackBarText, {
              key: notification.id,
              variant: notification.payload.severity,
              anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
              action,
              autoHideDuration: snackbarAutoHideDuration,
            } as OptionsWithExtraProps<VariantType>);
          }
        })
        .catch(() => {
          alertApi.post({
            message: 'Failed to fetch notification',
            severity: 'error',
          });
        });
    };

    if (lastSignal && lastSignal.action) {
      handleNotificationSignal(lastSignal);
      setRefresh(true);
    }
  }, [
    lastSignal,
    sendWebNotification,
    webNotificationsEnabled,
    snackbarEnabled,
    snackbarAutoHideDuration,
    notificationsApi,
    alertApi,
    getSnackbarProperties,
  ]);

  useEffect(() => {
    if (!loading && !error && value) {
      setUnreadCount(value.unread);
    }
  }, [loading, error, value]);

  useEffect(() => {
    if (titleCounterEnabled) {
      setNotificationCount(unreadCount);
    }
  }, [titleCounterEnabled, unreadCount, setNotificationCount]);

  const count = !error && !!unreadCount ? unreadCount : undefined;

  return (
    <>
      {snackbarEnabled && (
        <SnackbarProvider
          iconVariant={{
            normal: <SeverityIcon severity="normal" />,
            critical: <SeverityIcon severity="critical" />,
            high: <SeverityIcon severity="high" />,
            low: <SeverityIcon severity="low" />,
          }}
          Components={{
            normal: StyledMaterialDesignContent,
            critical: StyledMaterialDesignContent,
            high: StyledMaterialDesignContent,
            low: StyledMaterialDesignContent,
          }}
        />
      )}
      <SidebarItem
        to={notificationsRoute}
        onClick={() => {
          requestUserPermission();
        }}
        text={text}
        icon={icon}
        {...restProps}
      >
        {count && <Chip size="small" label={count > 99 ? '99+' : count} />}
      </SidebarItem>
    </>
  );
};
