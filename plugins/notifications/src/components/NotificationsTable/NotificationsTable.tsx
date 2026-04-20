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
import { useCallback, useEffect, useMemo, useState } from 'react';
import throttle from 'lodash/throttle';
// @ts-ignore
import RelativeTime from 'react-relative-time';
import { Notification } from '@backstage/plugin-notifications-common';
import {
  Button,
  Checkbox,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Flex,
  Text,
} from '@backstage/ui';
import { RiRssFill } from '@remixicon/react';
import { useApi } from '@backstage/core-plugin-api';
import { toastApiRef } from '@backstage/frontend-plugin-api';
import {
  Link,
  Table,
  TableColumn,
  TableProps,
} from '@backstage/core-components';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { notificationsTranslationRef } from '../../translation';

import { notificationsApiRef } from '../../api';
import { SelectAll } from './SelectAll';
import { BulkActions } from './BulkActions';
import { NotificationIcon } from './NotificationIcon';
import { NotificationDescription } from './NotificationDescription';

import styles from './NotificationsTable.module.css';

const ThrottleDelayMs = 1000;

/** @public */
export type NotificationsTableProps = Pick<
  TableProps,
  'onPageChange' | 'onRowsPerPageChange' | 'page' | 'totalCount' | 'title'
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
  title,
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
  const { t } = useTranslationRef(notificationsTranslationRef);
  const notificationsApi = useApi(notificationsApiRef);
  const toastApi = useApi(toastApiRef);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const [selectedNotifications, setSelectedNotifications] = useState(
    new Set<Notification['id']>(),
  );

  const onNotificationsSelectChange = useCallback(
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

  const doMarkAllRead = useCallback(async () => {
    setConfirmDialogOpen(false);
    try {
      const result = await notificationsApi.getNotifications({ read: false });
      const ids =
        result.notifications?.map(notification => notification.id) ?? [];
      if (ids.length === 0) return;
      await notificationsApi.updateNotifications({ ids, read: true });
      onUpdate();
    } catch {
      toastApi.post({
        title: t('table.errors.markAllReadFailed'),
        status: 'danger',
      });
    }
  }, [notificationsApi, onUpdate, toastApi, t]);

  const onMarkAllRead = useCallback(() => {
    setConfirmDialogOpen(true);
  }, []);

  const throttledContainsTextHandler = useMemo(
    () => throttle(setContainsText, ThrottleDelayMs),
    [setContainsText],
  );

  useEffect(() => {
    const allShownIds = new Set(notifications.map(n => n.id));
    const intersect = [...selectedNotifications].filter(id =>
      allShownIds.has(id),
    );
    if (selectedNotifications.size !== intersect.length) {
      setSelectedNotifications(new Set(intersect));
    }
  }, [notifications, selectedNotifications]);

  const compactColumns = useMemo((): TableColumn<Notification>[] => {
    const showToolbar = notifications.length > 0;
    return [
      {
        /* selection column */
        width: '1rem',
        cellStyle: { paddingRight: '2.5rem' },
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
          <Checkbox
            aria-label="Select notification"
            isSelected={selectedNotifications.has(notification.id)}
            onChange={checked =>
              onNotificationsSelectChange([notification.id], checked)
            }
          />
        ),
      },
      {
        /* compact-data column */
        customFilterAndSearch: () =>
          true /* Keep sorting&filtering on backend due to pagination. */,
        cellStyle: { paddingLeft: 0 },
        render: (notification: Notification) => {
          // Compact content
          return (
            <Flex gap="4" align="center">
              <div className={styles.severityItem}>
                <NotificationIcon notification={notification} />
              </div>
              <Flex direction="column" gap="1">
                <Text variant="body-medium">
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
                </Text>
                {notification.payload.description ? (
                  <NotificationDescription
                    description={notification.payload.description}
                  />
                ) : null}

                <Text variant="body-small" color="secondary">
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
              </Flex>
            </Flex>
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
          />
        ),
      },
    ];
  }, [
    notifications,
    selectedNotifications,
    isUnread,
    onSwitchReadStatus,
    onSwitchSavedStatus,
    onMarkAllRead,
    onNotificationsSelectChange,
    markAsReadOnLinkOpen,
  ]);

  return (
    <>
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
        title={title}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        totalCount={totalCount}
        onSearchChange={throttledContainsTextHandler}
        data={notifications}
        columns={compactColumns}
        localization={{
          body: {
            emptyDataSourceMessage: t('table.emptyMessage'),
          },
          pagination: {
            firstTooltip: t('table.pagination.firstTooltip'),
            labelDisplayedRows: t('table.pagination.labelDisplayedRows'),
            labelRowsSelect: t('table.pagination.labelRowsSelect'),
            lastTooltip: t('table.pagination.lastTooltip'),
            nextTooltip: t('table.pagination.nextTooltip'),
            previousTooltip: t('table.pagination.previousTooltip'),
          },
        }}
      />
      <Dialog
        isOpen={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        isDismissable
      >
        <DialogHeader>{t('table.confirmDialog.title')}</DialogHeader>
        <DialogBody>
          <Text variant="body-medium">
            {t('table.confirmDialog.markAllReadDescription')}
          </Text>
        </DialogBody>
        <DialogFooter>
          <Button variant="primary" onPress={doMarkAllRead}>
            {t('table.confirmDialog.markAllReadConfirmation')}
          </Button>
          <Button variant="secondary" slot="close">
            {t('table.confirmDialog.cancel')}
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
};
