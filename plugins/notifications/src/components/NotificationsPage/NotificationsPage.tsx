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
import { Grid } from '@material-ui/core';
import { useSignal } from '@backstage/plugin-signals-react';

import { NotificationsTable } from '../NotificationsTable';
import { useNotificationsApi } from '../../hooks';
import {
  CreatedAfterOptions,
  NotificationsFilters,
} from '../NotificationsFilters';
import { GetNotificationsOptions } from '../../api';

export const NotificationsPage = () => {
  const [refresh, setRefresh] = React.useState(false);
  const { lastSignal } = useSignal('notifications');
  const [unreadOnly, setUnreadOnly] = React.useState<boolean | undefined>(true);
  const [containsText, setContainsText] = React.useState<string>();
  const [createdAfter, setCreatedAfter] = React.useState<string>('lastWeek');

  const { error, value, retry, loading } = useNotificationsApi(
    // TODO: add pagination and other filters
    api => {
      const options: GetNotificationsOptions = { search: containsText };
      if (unreadOnly !== undefined) {
        options.read = !unreadOnly;
      }

      const createdAfterDate = CreatedAfterOptions[createdAfter].getDate();
      if (createdAfterDate.valueOf() > 0) {
        options.createdAfter = createdAfterDate;
      }

      return api.getNotifications(options);
    },
    [containsText, unreadOnly, createdAfter],
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
              // setSorting={setSorting}
              // sorting={sorting}
            />
          </Grid>
          <Grid item xs={10}>
            <NotificationsTable
              isLoading={loading}
              notifications={value}
              onUpdate={onUpdate}
              setContainsText={setContainsText}
            />
          </Grid>
        </Grid>
      </Content>
    </PageWithHeader>
  );
};
