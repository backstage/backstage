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

import React, { FC } from 'react';
import { Typography, Grid } from '@material-ui/core';
import {
  InfoCard,
  Header,
  Page,
  pageTheme,
  Content,
  ContentHeader,
  HeaderLabel,
  SupportButton,
} from '@backstage/core';
import DfdsWebApiComponent from '../DfdsWebApiComponent/DfdsWebApiComponent';

const DfdsWebApiComponentWrapper: FC<{}> = () => (
  <Page theme={pageTheme.tool}>
    <Header title="Welcome to dfds-web-api!" subtitle="Optional subtitle">
      <HeaderLabel label="Owner" value="Team DFDS" />
      <HeaderLabel label="Lifecycle" value="Alpha" />
    </Header>
    <Content>
      <ContentHeader title="Plugin title">
        <SupportButton>Deploy your WebAPI here!!</SupportButton>
      </ContentHeader>
      <Grid container spacing={3} direction="column">
        <Grid item>
          <InfoCard title="Information card">
            <Typography variant="body1">Lorem ipsum</Typography>
          </InfoCard>
        </Grid>
        <Grid item>{new DfdsWebApiComponent().render().getHTML()}</Grid>
      </Grid>
    </Content>
  </Page>
);

export default DfdsWebApiComponentWrapper;
