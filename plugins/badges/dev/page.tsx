/*
 * Copyright 2021 Spotify AB
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
import { Content, Header, Page, ContentHeader } from '@backstage/core';
import { EntityBadgesCard } from '../src';

export default () => {
  return (
    <Page themeId="home">
      <Header
        title="Badges Dev Page"
        subtitle="Showcasing the EntityBadgesCard component"
      />
      <Content>
        <ContentHeader title="EntityBadgesCard" />
        <Grid container>
          <Grid item xs={12} lg={6}>
            <EntityBadgesCard />
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
};
