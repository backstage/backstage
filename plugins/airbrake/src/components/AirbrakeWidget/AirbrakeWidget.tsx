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
import { Typography, Grid } from '@material-ui/core';
import {
  InfoCard,
  Header,
  Page,
  Content,
  ContentHeader,
  HeaderLabel,
  SupportButton,
} from '@backstage/core-components';
import exampleData from './ExampleData';
import hash from 'object-hash';

export const AirbrakeWidget = () => {
  return (
    <Page themeId="tool">
      <Header title="Airbrake" subtitle="Errors in your application">
        <HeaderLabel label="Owner" value="Owner" />
        <HeaderLabel label="Lifecycle" value="Alpha" />
      </Header>
      <Content>
        <ContentHeader title="Airbrake">
          <SupportButton>A description of your plugin goes here.</SupportButton>
        </ContentHeader>
        <Grid container spacing={3} direction="column">
          {exampleData.groups.map(group => (
            <Grid item key={group.id}>
              {group.errors.map(error => (
                <InfoCard title={error.type} key={hash(error)}>
                  <Typography variant="body1">{error.message}</Typography>
                </InfoCard>
              ))}
            </Grid>
          ))}
        </Grid>
      </Content>
    </Page>
  );
};
