/*
 * Copyright 2026 The Backstage Authors
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

import { useCallback, useEffect, useMemo, useState } from 'react';
import throttle from 'lodash/throttle';
// @ts-ignore
import RelativeTime from 'react-relative-time';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import BroadcastIcon from '@material-ui/icons/RssFeed';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import { Notification } from '@backstage/plugin-notifications-common';
import {
  ErrorPanel,
  InfoCard,
  Link,
  LinkButton,
  Progress,
} from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';

import { notificationsApiRef } from '../../api';
import { useNotificationsApi, useNotificationsRefresh } from '../../hooks';
import { getNotificationsPageLink } from '../../utils/notificationLinks';
import { truncateText } from '../../utils/plainText';
import { BulkActions } from '../NotificationsTable/BulkActions';
import { NotificationIcon } from '../NotificationsTable/NotificationIcon';

const ThrottleDelayMs = 2000;

const useStyles = makeStyles(theme => ({
  content: {
    minHeight: theme.spacing(18),
    display: 'flex',
    flexDirection: 'column',
  },
  columnHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.palette.action.hover,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(1, 3, 1, 4.5),
    marginBottom: theme.spacing(1),
  },
  columnHeaderActions: {
    minWidth: theme.spacing(10),
    textAlign: 'right',
  },
  notificationRow: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: theme.spacing(1),
    padding: theme.spacing(1.5, 0),
    borderBottom: `1px solid ${theme.palette.divider}`,
    '&:last-child': {
      borderBottom: 'none',
    },
  },
  notificationContent: {
    display: 'flex',
    flex: 1,
    minWidth: 0,
    gap: theme.spacing(1.5),
  },
  severityItem: {
    alignContent: 'center',
    flexShrink: 0,
  },
  notificationText: {
    minWidth: 0,
  },
  notificationTitle: {
    fontWeight: theme.typography.fontWeightMedium,
  },
  notificationDescription: {
    color: theme.palette.text.secondary,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
  },
  notificationInfoRow: {
    marginLeft: theme.spacing(0.5),
    marginRight: theme.spacing(0.5),
  },
  broadcastIcon: {
    fontSize: '1rem',
    verticalAlign: 'text-bottom',
  },
  actionsColumn: {
    flexShrink: 0,
  },
  emptyState: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: theme.spacing(4, 0),
    gap: theme.spacing(1),
  },
  emptyStateIcon: {
    fontSize: theme.spacing(4),
    color: theme.palette.text.disabled,
  },
  resultsCount: {
    marginTop: theme.spacing(2),
    textAlign: 'right',
    color: theme.palette.text.secondary,
  },
}));

/** @public */
export type UnreadNotificationsCardProps = {
  /** Maximum number of unread notifications to fetch and display */
  maxMessages?: number;
  /** Maximum number of plain-text characters to show per notification title */
  charLimit?: number;
  /**
   * @deprecated Use `maxMessages` instead.
   */
  initialCount?: number;
  /**
   * @deprecated Use `charLimit` instead.
   */
  maxChars?: number;
  /** Maximum number of plain-text characters to show per notification description */
  descriptionMaxChars?: number;
};

const resolveMaxMessages = ({
  maxMessages,
  initialCount,
}: Pick<UnreadNotificationsCardProps, 'maxMessages' | 'initialCount'>) =>
  maxMessages ?? initialCount ?? 5;

const resolveCharLimit = ({
  charLimit,
  maxChars,
}: Pick<UnreadNotificationsCardProps, 'charLimit' | 'maxChars'>) =>
  charLimit ?? maxChars ?? 80;

const NotificationListItem = ({
  notification,
  maxChars,
  descriptionMaxChars,
  onSwitchReadStatus,
  onSwitchSavedStatus,
}: {
  notification: Notification;
  maxChars: number;
  descriptionMaxChars: number;
  onSwitchReadStatus: (ids: Notification['id'][], newStatus: boolean) => void;
  onSwitchSavedStatus: (ids: Notification['id'][], newStatus: boolean) => void;
}) => {
  const classes = useStyles();
  const {
    display: titleDisplay,
    truncated: titleTruncated,
    full: titleFull,
  } = truncateText(notification.payload.title, maxChars);
  const description = notification.payload.description
    ? truncateText(notification.payload.description, descriptionMaxChars)
    : undefined;

  return (
    <Box className={classes.notificationRow}>
      <Box className={classes.notificationContent}>
        <Box className={classes.severityItem}>
          <NotificationIcon notification={notification} />
        </Box>
        <Box className={classes.notificationText}>
          <Typography
            variant="body2"
            className={classes.notificationTitle}
            component={Link}
            to={getNotificationsPageLink(notification.id)}
            title={titleTruncated ? titleFull : undefined}
          >
            {titleDisplay}
          </Typography>
          {description ? (
            <Typography
              variant="body2"
              className={classes.notificationDescription}
              title={description.truncated ? description.full : undefined}
            >
              {description.display}
            </Typography>
          ) : null}
          <Typography variant="caption" color="textSecondary">
            {!notification.user && (
              <BroadcastIcon className={classes.broadcastIcon} />
            )}
            {notification.origin && (
              <>
                <Typography
                  variant="inherit"
                  component="span"
                  className={classes.notificationInfoRow}
                >
                  {notification.origin}
                </Typography>
                &bull;
              </>
            )}
            {notification.payload.topic && (
              <>
                <Typography
                  variant="inherit"
                  component="span"
                  className={classes.notificationInfoRow}
                >
                  {notification.payload.topic}
                </Typography>
                &bull;
              </>
            )}
            {notification.created && (
              <RelativeTime
                value={notification.created}
                className={classes.notificationInfoRow}
              />
            )}
          </Typography>
        </Box>
      </Box>
      <Box className={classes.actionsColumn}>
        <BulkActions
          notifications={[notification]}
          selectedNotifications={new Set([notification.id])}
          onSwitchReadStatus={onSwitchReadStatus}
          onSwitchSavedStatus={onSwitchSavedStatus}
        />
      </Box>
    </Box>
  );
};

/** @public */
export const UnreadNotificationsCard = ({
  maxMessages,
  charLimit,
  initialCount,
  maxChars,
  descriptionMaxChars = 120,
}: UnreadNotificationsCardProps) => {
  const classes = useStyles();
  const resolvedMaxMessages = resolveMaxMessages({ maxMessages, initialCount });
  const resolvedCharLimit = resolveCharLimit({ charLimit, maxChars });
  const [refresh, setRefresh] = useState(false);
  const { lastSignal, pollTick } = useNotificationsRefresh();
  const notificationsApi = useApi(notificationsApiRef);

  const { error, value, retry, loading } = useNotificationsApi(
    api =>
      api.getNotifications({
        limit: resolvedMaxMessages,
        read: false,
        sort: 'created',
        sortOrder: 'desc',
      }),
    [resolvedMaxMessages],
  );

  const throttledSetRefresh = useMemo(
    () => throttle(() => setRefresh(true), ThrottleDelayMs),
    [],
  );

  const onUpdate = useCallback(() => {
    retry();
  }, [retry]);

  const onSwitchReadStatus = useCallback(
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

  const onSwitchSavedStatus = useCallback(
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

  useEffect(() => {
    if (refresh && !loading) {
      retry();
      setRefresh(false);
    }
  }, [refresh, retry, loading]);

  useEffect(() => {
    if (!lastSignal?.action) {
      return;
    }

    if (
      lastSignal.action === 'new_notification' ||
      lastSignal.action === 'notification_read' ||
      lastSignal.action === 'notification_unread'
    ) {
      throttledSetRefresh();
    }
  }, [lastSignal, throttledSetRefresh]);

  useEffect(() => {
    if (pollTick > 0) {
      throttledSetRefresh();
    }
  }, [pollTick, throttledSetRefresh]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        throttledSetRefresh();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [throttledSetRefresh]);

  const notifications = value?.notifications ?? [];
  const totalCount = value?.totalCount ?? notifications.length;
  const displayedCount = notifications.length;

  return (
    <InfoCard
      title={`Last unread notifications (${totalCount})`}
      action={
        <LinkButton to={getNotificationsPageLink()} color="primary">
          View All
        </LinkButton>
      }
      variant="gridItem"
    >
      <Box className={classes.content}>
        {loading && <Progress />}
        {error && <ErrorPanel error={error} />}
        {!loading && !error && (
          <>
            {notifications.length === 0 ? (
              <Box className={classes.emptyState}>
                <DoneAllIcon
                  className={classes.emptyStateIcon}
                  aria-hidden
                  data-testid="unread-notifications-empty-icon"
                />
                <Typography variant="body1">All caught up!</Typography>
              </Box>
            ) : (
              <>
                <Box className={classes.columnHeader}>
                  <Typography variant="caption" color="textSecondary">
                    NOTIFICATION
                  </Typography>
                  <Typography
                    variant="caption"
                    color="textSecondary"
                    className={classes.columnHeaderActions}
                  >
                    ACTIONS
                  </Typography>
                </Box>
                {notifications.map(notification => (
                  <NotificationListItem
                    key={notification.id}
                    notification={notification}
                    maxChars={resolvedCharLimit}
                    descriptionMaxChars={descriptionMaxChars}
                    onSwitchReadStatus={onSwitchReadStatus}
                    onSwitchSavedStatus={onSwitchSavedStatus}
                  />
                ))}
                <Typography variant="body2" className={classes.resultsCount}>
                  {displayedCount} results out of {totalCount}
                </Typography>
              </>
            )}
          </>
        )}
      </Box>
    </InfoCard>
  );
};

/**
 * UnreadNotificationsCard exported for use on the home page where the
 * notifications plugin APIs are expected to be available.
 *
 * @public
 */
export const UnreadNotificationsCardWithProvider = (
  props: UnreadNotificationsCardProps,
) => <UnreadNotificationsCard {...props} />;
