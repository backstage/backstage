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
import { Notification } from '@backstage/plugin-notifications-common';
import { ButtonIcon, Flex, Tooltip, TooltipTrigger } from '@backstage/ui';
import {
  RiCheckDoubleLine,
  RiBookmarkLine,
  RiBookmark3Line,
  RiCheckboxCircleLine,
  RiMailLine,
} from '@remixicon/react';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { notificationsTranslationRef } from '../../translation';

export const BulkActions = ({
  selectedNotifications,
  notifications,
  isUnread,
  onSwitchReadStatus,
  onSwitchSavedStatus,
  onMarkAllRead,
}: {
  selectedNotifications: Set<Notification['id']>;
  notifications: Notification[];
  isUnread?: boolean;
  onSwitchReadStatus: (ids: Notification['id'][], newStatus: boolean) => void;
  onSwitchSavedStatus: (ids: Notification['id'][], newStatus: boolean) => void;
  onMarkAllRead?: () => void;
}) => {
  const { t } = useTranslationRef(notificationsTranslationRef);
  const isDisabled = selectedNotifications.size === 0;
  const bulkNotifications = notifications.filter(notification =>
    selectedNotifications.has(notification.id),
  );

  const isOneRead = !!bulkNotifications.find(
    (notification: Notification) => !!notification.read,
  );
  const isOneSaved = !!bulkNotifications.find(
    (notification: Notification) => !!notification.saved,
  );

  const markAsReadText = isOneRead
    ? t('table.bulkActions.returnSelectedAmongUnread')
    : t('table.bulkActions.markSelectedAsRead');
  const ReadIcon = isOneRead ? RiMailLine : RiCheckboxCircleLine;

  const markAsSavedText = isOneSaved
    ? t('table.bulkActions.undoSaveForSelected')
    : t('table.bulkActions.saveSelectedForLater');
  const SavedIcon = isOneSaved ? RiBookmark3Line : RiBookmarkLine;
  const markAllReadText = t('table.bulkActions.markAllRead');

  return (
    <Flex gap="1">
      {onMarkAllRead ? (
        <TooltipTrigger>
          <ButtonIcon
            aria-label={markAllReadText}
            isDisabled={!isUnread}
            onPress={onMarkAllRead}
            icon={<RiCheckDoubleLine size={16} />}
            variant="secondary"
          />
          <Tooltip>{markAllReadText}</Tooltip>
        </TooltipTrigger>
      ) : (
        <div />
      )}

      <TooltipTrigger>
        <ButtonIcon
          aria-label={markAsSavedText}
          isDisabled={isDisabled}
          onPress={() => {
            onSwitchSavedStatus([...selectedNotifications], !isOneSaved);
          }}
          icon={<SavedIcon size={16} />}
          variant="secondary"
        />
        <Tooltip>{markAsSavedText}</Tooltip>
      </TooltipTrigger>

      <TooltipTrigger>
        <ButtonIcon
          aria-label={markAsReadText}
          isDisabled={isDisabled}
          onPress={() => {
            onSwitchReadStatus([...selectedNotifications], !isOneRead);
          }}
          icon={<ReadIcon size={16} />}
          variant="secondary"
        />
        <Tooltip>{markAsReadText}</Tooltip>
      </TooltipTrigger>
    </Flex>
  );
};
