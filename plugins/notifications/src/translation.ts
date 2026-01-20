/*
 * Copyright 2025 The Backstage Authors
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

import { createTranslationRef } from '@backstage/frontend-plugin-api';

/** @alpha */
export const notificationsTranslationRef = createTranslationRef({
  id: 'plugin.notifications',
  messages: {
    notificationsPage: {
      title: 'Notifications',
      tableTitle: {
        all_one: 'All notifications ({{count}})',
        all_other: 'All notifications ({{count}})',
        saved_one: 'Saved notifications ({{count}})',
        saved_other: 'Saved notifications ({{count}})',
        unread_one: 'Unread notifications ({{count}})',
        unread_other: 'Unread notifications ({{count}})',
        read_one: 'Read notifications ({{count}})',
        read_other: 'Read notifications ({{count}})',
      },
    },
    filters: {
      title: 'Filters',
      view: {
        label: 'View',
        unread: 'Unread notifications',
        read: 'Read notifications',
        saved: 'Saved',
        all: 'All',
      },
      createdAfter: {
        label: 'Sent out',
        placeholder: 'Notifications since',
        last24h: 'Last 24h',
        lastWeek: 'Last week',
        anyTime: 'Any time',
      },
      sortBy: {
        label: 'Sort by',
        placeholder: 'Field to sort by',
        newest: 'Newest on top',
        oldest: 'Oldest on top',
        topic: 'Topic',
        origin: 'Origin',
      },
      severity: {
        label: 'Min severity',
        critical: 'Critical',
        high: 'High',
        normal: 'Normal',
        low: 'Low',
      },
      topic: {
        label: 'Topic',
        anyTopic: 'Any topic',
      },
    },
    table: {
      emptyMessage: 'No records to display',
      pagination: {
        firstTooltip: 'First Page',
        labelDisplayedRows: '{from}-{to} of {count}',
        labelRowsSelect: 'rows',
        lastTooltip: 'Last Page',
        nextTooltip: 'Next Page',
        previousTooltip: 'Previous Page',
      },
      bulkActions: {
        markAllRead: 'Mark all read',
        markSelectedAsRead: 'Mark selected as read',
        returnSelectedAmongUnread: 'Return selected among unread',
        saveSelectedForLater: 'Save selected for later',
        undoSaveForSelected: 'Undo save for selected',
      },
      confirmDialog: {
        title: 'Are you sure?',
        markAllReadDescription: 'Mark <b>all</b> notifications as <b>read</b>.',
        markAllReadConfirmation: 'Mark All',
      },
      errors: {
        markAllReadFailed: 'Failed to mark all notifications as read',
      },
    },
    sidebar: {
      title: 'Notifications',
      errors: {
        markAsReadFailed: 'Failed to mark notification as read',
        fetchNotificationFailed: 'Failed to fetch notification',
      },
    },
    settings: {
      title: 'Notification settings',
      errorTitle: 'Failed to load settings',
      noSettingsAvailable:
        'No notification settings available, check back later',
      table: {
        origin: 'Origin',
        topic: 'Topic',
      },
      errors: {
        useNotificationFormat:
          'useNotificationFormat must be used within a NotificationFormatProvider',
      },
    },
  },
});
