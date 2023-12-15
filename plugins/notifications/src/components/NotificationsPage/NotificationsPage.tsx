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

import React, { useState } from 'react';
import {
  Content,
  ErrorPanel,
  PageWithHeader,
} from '@backstage/core-components';
import { NotificationsTable } from '../NotificationsTable';
import { useNotificationsApi } from '../../hooks';
import {
  Button,
  Grid,
  makeStyles,
  Paper,
  TableContainer,
} from '@material-ui/core';
import Bookmark from '@material-ui/icons/Bookmark';
import Check from '@material-ui/icons/Check';
import Inbox from '@material-ui/icons/Inbox';
import { NotificationType } from '@backstage/plugin-notifications-common';

const useStyles = makeStyles(_theme => ({
  filterButton: {
    width: '100%',
    justifyContent: 'start',
  },
}));

export const NotificationsPage = () => {
  const [type, setType] = useState<NotificationType>('unread');

  const { loading, error, value, retry } = useNotificationsApi(
    api => api.getNotifications({ type }),
    [type],
  );

  const onUpdate = () => {
    retry();
  };

  const styles = useStyles();
  if (error) {
    return <ErrorPanel error={new Error('Failed to load notifications')} />;
  }

  // TODO: Add signals listener and refresh data on message
  return (
    <PageWithHeader title="Notifications" themeId="tool">
      <Content>
        <Grid container>
          <Grid item xs={2}>
            <Button
              className={styles.filterButton}
              startIcon={<Inbox />}
              variant={type === 'unread' ? 'contained' : 'text'}
              onClick={() => setType('unread')}
            >
              Inbox
            </Button>
            <Button
              className={styles.filterButton}
              startIcon={<Check />}
              variant={type === 'read' ? 'contained' : 'text'}
              onClick={() => setType('read')}
            >
              Done
            </Button>
            <Button
              className={styles.filterButton}
              startIcon={<Bookmark />}
              variant={type === 'saved' ? 'contained' : 'text'}
              onClick={() => setType('saved')}
            >
              Saved
            </Button>
          </Grid>
          <Grid item xs={10}>
            <TableContainer component={Paper}>
              <NotificationsTable
                notifications={value}
                type={type}
                loading={loading}
                onUpdate={onUpdate}
              />
            </TableContainer>
          </Grid>
        </Grid>
      </Content>
    </PageWithHeader>
  );
};
