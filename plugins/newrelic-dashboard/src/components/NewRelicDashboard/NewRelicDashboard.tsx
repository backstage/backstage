/*
 * Copyright 2021 The Backstage Authors
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
import React from 'react';
import { Grid } from '@material-ui/core';
import { Page, Content } from '@backstage/core-components';
import { DashboardEntityList } from './DashboardEntityList';
import { DashboardSnapshotList } from './DashboardSnapshotList';
import { useEntity } from '@backstage/plugin-catalog-react';
import { NEWRELIC_GUID_ANNOTATION } from '../../constants';

export const NewRelicDashboard = () => {
  const { entity } = useEntity();
  return (
    <Page themeId="home">
      <Content>
        <Grid container spacing={6} direction="row" alignItems="stretch">
          <Grid item xs={12}>
            <DashboardEntityList />
          </Grid>
          <Grid item xs={12}>
            <DashboardSnapshotList
              guid={String(
                entity.metadata.annotations?.[NEWRELIC_GUID_ANNOTATION],
              )}
            />
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
};
