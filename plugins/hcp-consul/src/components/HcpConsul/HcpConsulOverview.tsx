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
import React from 'react';
import { Typography, Grid } from '@material-ui/core';
import {
  InfoCard,
  Header,
  Page,
  Content,
  ContentHeader,
} from '@backstage/core-components';
import { ServiceUnhealthyTable, ServicesOverview } from '../Service';
import { ClusterTable, ClusterOverviewCard } from '../Cluster';
import { ServiceListTableComponent } from '../Service';
import { TabbedLayout } from '@backstage/core-components';
import { useApi, configApiRef } from '@backstage/core-plugin-api';

type HcpConsulOverviewProps = {
  projectID?: string;
};

export const HcpConsulOverview = ({ projectID }: HcpConsulOverviewProps) => {
  const config = useApi(configApiRef);
  const defaultProjectID = config.getString('consul.projectID');

  const finalProjectID = projectID || defaultProjectID;

  return (
    <Page themeId="service">
      <Header title="HCP consul" subtitle="" />
      <Content>
        <ContentHeader title="">Project ID: {finalProjectID}</ContentHeader>
        <TabbedLayout>
          <TabbedLayout.Route path="/" title="Overview">
            <Grid container spacing={3} alignItems="stretch">
              <Grid item md={12}>
                <ServiceUnhealthyTable projectID={finalProjectID} />
              </Grid>
              <Grid item md={6} xs={12}>
                <InfoCard title="Clusters Overview">
                  <Typography variant="body1">
                    <ClusterOverviewCard projectID={finalProjectID} />
                  </Typography>
                </InfoCard>
              </Grid>
              <Grid item md={6} xs={12}>
                <InfoCard title="Services Overview">
                  <Typography variant="body1">
                    <ServicesOverview projectID={finalProjectID} />
                  </Typography>
                </InfoCard>
              </Grid>
            </Grid>
          </TabbedLayout.Route>

          <TabbedLayout.Route path="/clusters" title="Clusters">
            <ClusterTable projectID={finalProjectID} />
          </TabbedLayout.Route>

          <TabbedLayout.Route path="/services" title="Services">
            <Grid container spacing={3} direction="column">
              <Grid item>
                <ServiceListTableComponent projectID={finalProjectID} />
              </Grid>
            </Grid>
          </TabbedLayout.Route>
        </TabbedLayout>
      </Content>
    </Page>
  );
};
