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
import { Route } from 'react-router';
import { Link as RouterLink } from 'react-router-dom';
import { Grid, Button } from '@material-ui/core';
import { Settings as SettingsIcon } from '@material-ui/icons';
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
import { CircleCIFetch } from '../CircleCIFetch';
import { SettingsPage } from '../SettingsPage';
export const CircleCIPage: FC<{}> = () => {
  return (
    <>
      <Route path="/circleci/settings" component={SettingsPage} />
      <Page theme={pageTheme.tool}>
        <Header title="Welcome to circleci!" subtitle="Optional subtitle">
          <HeaderLabel label="Owner" value="Team X" />
          <HeaderLabel label="Lifecycle" value="Alpha" />
        </Header>
        <Content>
          <ContentHeader title="Circle CI">
            <Button
              component={RouterLink}
              to="/circleci/settings"
              startIcon={<SettingsIcon />}
            >
              Settings
            </Button>
            <SupportButton>
              A description of your plugin goes here.
            </SupportButton>
          </ContentHeader>
          <Grid container spacing={3} direction="column">
            <Grid item>
              <InfoCard title="Pipelines">
                <CircleCIFetch />
              </InfoCard>
            </Grid>
          </Grid>
        </Content>
      </Page>
    </>
  );
};

export default CircleCIPage;
