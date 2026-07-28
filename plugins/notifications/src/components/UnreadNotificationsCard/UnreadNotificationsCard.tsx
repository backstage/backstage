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
import { RiCheckDoubleLine, RiRssFill } from '@remixicon/react';
import { Notification } from '@backstage/plugin-notifications-common';
import {
  ErrorPanel,
  InfoCard,
  Link,
  LinkButton,
  Progress,
} from '@backstage/core-components';
import { Text } from '@backstage/ui';
import { useApi } from '@backstage/core-plugin-api';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';

import { notificationsApiRef } from '../../api';
import { useNotificationsApi, useNotificationsRefresh } from '../../hooks';
import { notificationsTranslationRef } from '../../translation';
import { getNotificationsPageLink } from '../../utils/notificationLinks';
import { truncateText } from '../../utils/plainText';
import { BulkActions } from '../NotificationsTable/BulkActions';
import { NotificationIcon } from '../NotificationsTable/NotificationIcon';
import styles from './UnreadNotificationsCard.module.css';

const ThrottleDelayMs = 2000;

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
  const {
    display: titleDisplay,
    truncated: titleTruncated,
    full: titleFull,
  } = truncateText(notification.payload.title, maxChars);
  const description = notification.payload.description
    ? truncateText(notification.payload.description, descriptionMaxChars)
    : undefined;

  return (
    <div className={styles.notificationRow}>
      <div className={styles.notificationContent}>
        <div className={styles.severityItem}>
          <NotificationIcon notification={notification} />
        </div>
        <div className={styles.notificationText}>
          <Text variant="body-medium" className={styles.notificationTitle}>
            <Link
              to={getNotificationsPageLink(notification.id)}
              title={titleTruncated ? titleFull : undefined}
            >
              {titleDisplay}
            </Link>
          </Text>
          {description ? (
            <Text
              variant="body-small"
              color="secondary"
              className={styles.notificationDescription}
              title={description.truncated ? description.full : undefined}
            >
              {description.display}
            </Text>
          ) : null}
          <Text
            variant="body-small"
            color="secondary"
            className={styles.metaRow}
          >
            {!notification.user && (
              <RiRssFill size={14} className={styles.broadcastIcon} />
            )}
            {notification.origin && (
              <>
                <span className={styles.notificationInfoRow}>
                  {notification.origin}
                </span>
                &bull;
              </>
            )}
            {notification.payload.topic && (
              <>
                <span className={styles.notificationInfoRow}>
                  {notification.payload.topic}
                </span>
                &bull;
              </>
            )}
            {notification.created && (
              <RelativeTime
                value={notification.created}
                className={styles.notificationInfoRow}
              />
            )}
          </Text>
        </div>
      </div>
      <div className={styles.actionsColumn}>
        <BulkActions
          notifications={[notification]}
          selectedNotifications={new Set([notification.id])}
          onSwitchReadStatus={onSwitchReadStatus}
          onSwitchSavedStatus={onSwitchSavedStatus}
        />
      </div>
    </div>
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
  const { t } = useTranslationRef(notificationsTranslationRef);
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

  useEffect(() => {
    return () => {
      throttledSetRefresh.cancel();
    };
  }, [throttledSetRefresh]);

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
      title={t('unreadCard.title', { count: totalCount })}
      action={
        <LinkButton to={getNotificationsPageLink()} color="primary">
          {t('unreadCard.viewAll')}
        </LinkButton>
      }
      variant="gridItem"
    >
      <div className={styles.content}>
        {loading && <Progress />}
        {error && <ErrorPanel error={error} />}
        {!loading && !error && (
          <>
            {notifications.length === 0 ? (
              <div className={styles.emptyState}>
                <RiCheckDoubleLine
                  size={32}
                  className={styles.emptyStateIcon}
                  aria-hidden
                  data-testid="unread-notifications-empty-icon"
                />
                <Text variant="body-medium">{t('unreadCard.emptyState')}</Text>
              </div>
            ) : (
              <>
                <div className={styles.columnHeader}>
                  <Text variant="body-x-small" color="secondary">
                    {t('unreadCard.columnNotification')}
                  </Text>
                  <Text
                    variant="body-x-small"
                    color="secondary"
                    className={styles.columnHeaderActions}
                  >
                    {t('unreadCard.columnActions')}
                  </Text>
                </div>
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
                <Text
                  variant="body-small"
                  color="secondary"
                  className={styles.resultsCount}
                >
                  {t('unreadCard.resultsCount', {
                    displayed: String(displayedCount),
                    total: String(totalCount),
                  })}
                </Text>
              </>
            )}
          </>
        )}
      </div>
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
