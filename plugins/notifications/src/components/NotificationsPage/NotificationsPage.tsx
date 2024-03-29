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
import {
  Content,
  PageWithHeader,
  ResponseErrorPanel,
} from '@backstage/core-components';
import Grid from '@material-ui/core/Grid';
import { useSignal } from '@backstage/plugin-signals-react';

import { NotificationsTable } from '../NotificationsTable';
import { useNotificationsApi } from '../../hooks';
import {
  CreatedAfterOptions,
  NotificationsFilters,
  SortBy,
  SortByOptions,
} from '../NotificationsFilters';
import { GetNotificationsOptions } from '../../api';
import { NotificationSeverity } from '@backstage/plugin-notifications-common';

export const NotificationsPage = () => {
  const [refresh, setRefresh] = React.useState(false);
  const { lastSignal } = useSignal('notifications');
  const [unreadOnly, setUnreadOnly] = React.useState<boolean | undefined>(true);
  const [saved, setSaved] = React.useState<boolean | undefined>(undefined);
  const [pageNumber, setPageNumber] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(5);
  const [containsText, setContainsText] = React.useState<string>();
  const [createdAfter, setCreatedAfter] = React.useState<string>('lastWeek');
  const [sorting, setSorting] = React.useState<SortBy>(
    SortByOptions.newest.sortBy,
  );
  const [severity, setSeverity] = React.useState<NotificationSeverity>('low');

  const { error, value, retry, loading } = useNotificationsApi(
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

      const createdAfterDate = CreatedAfterOptions[createdAfter].getDate();
      if (createdAfterDate.valueOf() > 0) {
        options.createdAfter = createdAfterDate;
      }

      return api.getNotifications(options);
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
    ],
  );

  useEffect(() => {
    if (refresh) {
      retry();
      setRefresh(false);
    }
  }, [refresh, setRefresh, retry]);

  useEffect(() => {
    if (lastSignal && lastSignal.action) {
      setRefresh(true);
    }
  }, [lastSignal]);

  const onUpdate = () => {
    setRefresh(true);
  };

  if (error) {
    return <ResponseErrorPanel error={error} />;
  }

  return (
    <PageWithHeader title="Notifications" themeId="tool">
      <Content>
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
            />
          </Grid>
          <Grid item xs={10}>
            <NotificationsTable
              isLoading={loading}
              notifications={value?.notifications}
              onUpdate={onUpdate}
              setContainsText={setContainsText}
              onPageChange={setPageNumber}
              onRowsPerPageChange={setPageSize}
              page={pageNumber}
              pageSize={pageSize}
              totalCount={value?.totalCount}
            />
          </Grid>
        </Grid>
      </Content>
    </PageWithHeader>
  );
};
