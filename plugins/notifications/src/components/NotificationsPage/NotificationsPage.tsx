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

import React, { useEffect } from 'react';
import throttle from 'lodash/throttle';
import {
  Content,
  PageWithHeader,
  ResponseErrorPanel,
} from '@backstage/core-components';
import Grid from '@material-ui/core/Grid';
import { ConfirmProvider } from 'material-ui-confirm';
import { useSignal } from '@backstage/plugin-signals-react';

import { NotificationsTable } from '../NotificationsTable';
import { useNotificationsApi } from '../../hooks';
import {
  CreatedAfterOptions,
  NotificationsFilters,
  SortBy,
  SortByOptions,
} from '../NotificationsFilters';
import {
  GetNotificationsOptions,
  GetNotificationsResponse,
  GetTopicsResponse,
} from '../../api';
import {
  NotificationSeverity,
  NotificationStatus,
} from '@backstage/plugin-notifications-common';

const ThrottleDelayMs = 2000;

/** @public */
export type NotificationsPageProps = {
  /** Mark notification as read when opening the link it contains, defaults to false */
  markAsReadOnLinkOpen?: boolean;
  title?: string;
  themeId?: string;
  subtitle?: string;
  tooltip?: string;
  type?: string;
  typeLink?: string;
};

export const NotificationsPage = (props?: NotificationsPageProps) => {
  const {
    title = 'Notifications',
    themeId = 'tool',
    subtitle,
    tooltip,
    type,
    typeLink,
    markAsReadOnLinkOpen,
  } = props ?? {};

  const [refresh, setRefresh] = React.useState(false);
  const { lastSignal } = useSignal('notifications');
  const [unreadOnly, setUnreadOnly] = React.useState<boolean | undefined>(true);
  const [saved, setSaved] = React.useState<boolean | undefined>(undefined);
  const [pageNumber, setPageNumber] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(5);
  const [containsText, setContainsText] = React.useState<string>();
  const [createdAfter, setCreatedAfter] = React.useState<string>('all');
  const [sorting, setSorting] = React.useState<SortBy>(
    SortByOptions.newest.sortBy,
  );
  const [severity, setSeverity] = React.useState<NotificationSeverity>('low');
  const [topic, setTopic] = React.useState<string>();

  const { error, value, retry, loading } = useNotificationsApi<
    [GetNotificationsResponse, NotificationStatus, GetTopicsResponse]
  >(
    api => {
      const options: GetNotificationsOptions = {
        search: containsText,
        limit: pageSize,
        offset: pageNumber * pageSize,
        minimumSeverity: severity,
        ...(sorting || {}),
      };
      if (unreadOnly !== undefined) {
        options.read = !unreadOnly;
      }
      if (saved !== undefined) {
        options.saved = saved;
      }
      if (topic !== undefined) {
        options.topic = topic;
      }

      const createdAfterDate = CreatedAfterOptions[createdAfter].getDate();
      if (createdAfterDate.valueOf() > 0) {
        options.createdAfter = createdAfterDate;
      }

      return Promise.all([
        api.getNotifications(options),
        api.getStatus(),
        api.getTopics(options),
      ]);
    },
    [
      containsText,
      unreadOnly,
      createdAfter,
      pageNumber,
      pageSize,
      sorting,
      saved,
      severity,
      topic,
    ],
  );

  const throttledSetRefresh = React.useMemo(
    () => throttle(setRefresh, ThrottleDelayMs),
    [setRefresh],
  );

  useEffect(() => {
    if (refresh && !loading) {
      retry();
      setRefresh(false);
    }
  }, [refresh, setRefresh, retry, loading]);

  useEffect(() => {
    if (lastSignal && lastSignal.action) {
      throttledSetRefresh(true);
    }
  }, [lastSignal, throttledSetRefresh]);

  const onUpdate = () => {
    throttledSetRefresh(true);
  };

  if (error) {
    return <ResponseErrorPanel error={error} />;
  }

  const notifications = value?.[0]?.notifications;
  const totalCount = value?.[0]?.totalCount;
  const isUnread = !!value?.[1]?.unread;
  const allTopics = value?.[2]?.topics;

  let tableTitle = `All notifications (${totalCount})`;
  if (saved) {
    tableTitle = `Saved notifications (${totalCount})`;
  } else if (unreadOnly === true) {
    tableTitle = `Unread notifications (${totalCount})`;
  } else if (unreadOnly === false) {
    tableTitle = `Read notifications (${totalCount})`;
  }

  return (
    <PageWithHeader
      title={title}
      themeId={themeId}
      tooltip={tooltip}
      subtitle={subtitle}
      type={type}
      typeLink={typeLink}
    >
      <Content>
        <ConfirmProvider>
          <Grid container>
            <Grid item xs={2}>
              <NotificationsFilters
                unreadOnly={unreadOnly}
                onUnreadOnlyChanged={setUnreadOnly}
                createdAfter={createdAfter}
                onCreatedAfterChanged={setCreatedAfter}
                onSortingChanged={setSorting}
                sorting={sorting}
                saved={saved}
                onSavedChanged={setSaved}
                severity={severity}
                onSeverityChanged={setSeverity}
                topic={topic}
                onTopicChanged={setTopic}
                allTopics={allTopics}
              />
            </Grid>
            <Grid item xs={10}>
              <NotificationsTable
                title={tableTitle}
                isLoading={loading}
                isUnread={isUnread}
                markAsReadOnLinkOpen={markAsReadOnLinkOpen}
                notifications={notifications}
                onUpdate={onUpdate}
                setContainsText={setContainsText}
                onPageChange={setPageNumber}
                onRowsPerPageChange={setPageSize}
                page={pageNumber}
                pageSize={pageSize}
                totalCount={totalCount}
              />
            </Grid>
          </Grid>
        </ConfirmProvider>
      </Content>
    </PageWithHeader>
  );
};
