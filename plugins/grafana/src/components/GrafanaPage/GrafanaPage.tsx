/*
 * Copyright 2020 Spotify AB
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
import { Grid, Button } from '@material-ui/core';
import {
  Header,
  Page,
  pageTheme,
  Content,
  ContentHeader,
  HeaderLabel,
  SupportButton,
  InfoCard,
  configApiRef,
  useApi,
} from '@backstage/core';
import { Entity } from '@backstage/catalog-model';

export const GrafanaIframe = ({ entity }: { entity?: Entity }) => {
  const config = useApi(configApiRef);
  const grafanaUrl = config.getString('grafana.baseUrl');
  const middleHeight = innerHeight / 2;

  return (
    <>
      <ContentHeader title="">
        <Button variant="contained" color="primary" href={grafanaUrl}>
          Go To Grafana
        </Button>
      </ContentHeader>
      <InfoCard>
        <Grid container spacing={3} direction="column">
          {entity?.metadata?.annotations?.['grafana/graf-top'] && (
            <Grid item>
              <iframe
                title="grafana"
                src={entity?.metadata.annotations?.['grafana/graf-top']}
                height={middleHeight}
                width="100%"
                frameBorder="1"
              />
            </Grid>
          )}
          {entity?.metadata?.annotations?.['grafana/graf-bottom'] && (
            <Grid item>
              <iframe
                title="grafana"
                src={entity?.metadata.annotations?.['grafana/graf-bottom']}
                height={middleHeight}
                width="100%"
                frameBorder="1"
              />
            </Grid>
          )}
        </Grid>
      </InfoCard>
    </>
  );
};

const GrafanaPage = ({ entity }: { entity?: Entity }) => (
  <Page theme={pageTheme.tool}>
    <Header title="Welcome to Grafana!">
      <HeaderLabel label="Owner" value="trivago" />
      <HeaderLabel label="Lifecycle" value="Alpha" />
    </Header>
    <Content>
      <ContentHeader title="Grafana plugin">
        <SupportButton>Plugin to show a Grafana overview</SupportButton>
      </ContentHeader>
      <Grid container spacing={3} direction="column">
        <Grid item>
          <GrafanaIframe entity={entity} />
        </Grid>
      </Grid>
    </Content>
  </Page>
);

export default GrafanaPage;
