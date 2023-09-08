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
import { JiraProjectCard } from '../JiraProjectCard';
import exampleJiraResponse from '../../mockedJiraResponse.json';
import { JiraTable } from '../JiraTable';
import { JiraResponse } from '../../types';

export const JiraDashboardContent = () => {
  const jiraResponse = exampleJiraResponse as JiraResponse;

  return (
    <Content>
      <ContentHeader title="Jira Dashboard">
        <SupportButton>
          Jira Dashboard plugin lets you track Jira tickets
        </SupportButton>
      </ContentHeader>
      <Grid container spacing={3}>
        <Grid item md={6} xs={12}>
          <JiraProjectCard {...jiraResponse.project} />
        </Grid>
        {jiraResponse.data.map(
          (value: any) =>
            !!value.issues && (
              <Grid item key={value.name} md={6} xs={12}>
                <JiraTable value={value} />
              </Grid>
            ),
        )}
      </Grid>
    </Content>
  );
};
