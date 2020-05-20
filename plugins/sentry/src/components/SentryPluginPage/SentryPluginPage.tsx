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

import React, { FC, useState } from 'react';
import { Grid } from '@material-ui/core';
import {
  Header,
  Page,
  pageTheme,
  Content,
  ContentHeader,
  SupportButton,
} from '@backstage/core';
import { SentryPluginWidget } from '../SentryPluginWidget/SentryPluginWidget';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';

const SentryPluginPage: FC<{}> = () => {
  const [statsFor, setStatsFor] = useState<'12h' | '24h'>('12h');
  const toggleStatsFor = () => setStatsFor(statsFor === '12h' ? '12h' : '24h');

  return (
    <Page theme={pageTheme.tool}>
      <Header title="Welcome to Sentry Plugin!">
        <ToggleButtonGroup
          value={statsFor}
          exclusive
          onChange={toggleStatsFor}
          aria-label="text alignment"
        >
          <ToggleButton value="24h" aria-label="left aligned">
            24H
          </ToggleButton>
          <ToggleButton value="12h" aria-label="left aligned">
            12H
          </ToggleButton>
        </ToggleButtonGroup>
      </Header>
      <Content>
        <ContentHeader title="Issue on Sentry">
          <SupportButton>
            Sentry plugin allows you to preview issues and navigate to sentry.
          </SupportButton>
        </ContentHeader>
        <Grid container spacing={3} direction="column">
          <Grid item>
            <SentryPluginWidget
              sentryProjectId="home-hub"
              statsFor={statsFor}
            />
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
};

export default SentryPluginPage;
