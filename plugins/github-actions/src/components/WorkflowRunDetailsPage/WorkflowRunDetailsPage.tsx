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

import { Typography, Grid, Breadcrumbs } from '@material-ui/core';

import React from 'react';
import {
  Link,
  Page,
  Header,
  HeaderLabel,
  Content,
  ContentHeader,
  SupportButton,
  pageTheme,
} from '@backstage/core';

import { WorkflowRunDetails } from '../WorkflowRunDetails';

/**
 * A component for Jobs visualization. Jobs are a property of a Workflow Run.
 */
export const WorkflowRunDetailsPage = () => {
  return (
    <Page theme={pageTheme.tool}>
      <Header
        title="GitHub Actions"
        subtitle="See recent workflow runs and their status"
      >
        <HeaderLabel label="Owner" value="Spotify" />
        <HeaderLabel label="Lifecycle" value="Alpha" />
      </Header>
      <Content>
        <ContentHeader title="Workflow run details">
          <SupportButton>
            This plugin allows you to view and interact with your builds within
            the GitHub Actions environment.
          </SupportButton>
        </ContentHeader>
        <Breadcrumbs aria-label="breadcrumb">
          <Link to="/github-actions">Workflow runs</Link>
          <Typography>Workflow run details</Typography>
        </Breadcrumbs>
        <Grid container spacing={3} direction="column">
          <Grid item>
            <WorkflowRunDetails />
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
};
