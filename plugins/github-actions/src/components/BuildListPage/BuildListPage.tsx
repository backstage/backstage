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

import {
  Header,
  HeaderLabel,
  pageTheme,
  Page,
  Content,
  ContentHeader,
  SupportButton,
} from '@backstage/core';
import { Grid } from '@material-ui/core';
import React from 'react';

import { BuildListTable } from '../BuildListTable';

export const BuildListPage = () => {
  return (
    <Page theme={pageTheme.tool}>
      <Header
        title="GitHub Actions"
        subtitle="See recent builds and their status"
      >
        <HeaderLabel label="Owner" value="Spotify" />
        <HeaderLabel label="Lifecycle" value="Alpha" />
      </Header>
      <Content>
        <ContentHeader title="All builds">
          <SupportButton>
            This plugin allows you to view and interact with your builds within
            the GitHub Actions environment.
          </SupportButton>
        </ContentHeader>
        <Grid container spacing={3} direction="column">
          <Grid item>
            <BuildListTable repo="try-ssr" owner="CircleCITest3" />
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
};
