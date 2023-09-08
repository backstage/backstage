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
import {
  Content,
  ContentHeader,
  SupportButton,
} from '@backstage/core-components';
import { Grid } from '@material-ui/core';
import React from 'react';
import { ExampleFetchComponent } from '../ExampleFetchComponent';
import { JiraProjectCard } from '../JiraProjectCard';
import exampleProject from '../../mockedProject.json';

export const JiraDashboardContent = () => {
  return (
    <Content>
      <ContentHeader title="Jira Dashboard">
        <SupportButton>A description of your plugin goes here.</SupportButton>
      </ContentHeader>
      <Grid container spacing={3} direction="column">
        <Grid item md={6} xs={12}>
          <JiraProjectCard {...exampleProject} />
        </Grid>
        <Grid item>
          <ExampleFetchComponent />
        </Grid>
      </Grid>
    </Content>
  );
};
