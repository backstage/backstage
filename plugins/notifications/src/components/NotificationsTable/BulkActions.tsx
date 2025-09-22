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
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import MarkAsUnreadIcon from '@material-ui/icons/Markunread' /* TODO: use Drafts and MarkAsUnread once we have mui 5 icons */;
import MarkAsReadIcon from '@material-ui/icons/CheckCircle';
import MarkAsUnsavedIcon from '@material-ui/icons/LabelOff' /* TODO: use BookmarkRemove and BookmarkAdd once we have mui 5 icons */;
import MarkAsSavedIcon from '@material-ui/icons/Label';
import MarkAllReadIcon from '@material-ui/icons/DoneAll';

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
    ? 'Return selected among unread'
    : 'Mark selected as read';
  const IconComponent = isOneRead ? MarkAsUnreadIcon : MarkAsReadIcon;

  const markAsSavedText = isOneSaved
    ? 'Undo save for selected'
    : 'Save selected for later';
  const SavedIconComponent = isOneSaved ? MarkAsUnsavedIcon : MarkAsSavedIcon;

  return (
    <Grid container wrap="nowrap">
      <Grid item xs={3}>
        {onMarkAllRead ? (
          <Tooltip title="Mark all read">
            <div>
              {/* The <div> here is a workaround for the Tooltip which does not work for a "disabled" child */}
              <IconButton disabled={!isUnread} onClick={onMarkAllRead}>
                <MarkAllReadIcon aria-label={markAsSavedText} />
              </IconButton>
            </div>
          </Tooltip>
        ) : (
          <div />
        )}
      </Grid>

      <Grid item xs={3}>
        <Tooltip title={markAsSavedText}>
          <div>
            {/* The <div> here is a workaround for the Tooltip which does not work for a "disabled" child */}
            <IconButton
              disabled={isDisabled}
              onClick={() => {
                onSwitchSavedStatus([...selectedNotifications], !isOneSaved);
              }}
            >
              <SavedIconComponent aria-label={markAsSavedText} />
            </IconButton>
          </div>
        </Tooltip>
      </Grid>

      <Grid item xs={3}>
        <Tooltip title={markAsReadText}>
          <div>
            <IconButton
              disabled={isDisabled}
              onClick={() => {
                onSwitchReadStatus([...selectedNotifications], !isOneRead);
              }}
            >
              <IconComponent aria-label={markAsReadText} />
            </IconButton>
          </div>
        </Tooltip>
      </Grid>
    </Grid>
  );
};
