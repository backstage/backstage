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
  Progress,
  ResponseErrorPanel,
  SupportButton,
} from '@backstage/core-components';
import { Grid } from '@material-ui/core';
import React from 'react';
import { JiraProjectCard } from '../JiraProjectCard';
import { JiraTable } from '../JiraTable';
import { useApi } from '@backstage/core-plugin-api';
import { useEntity } from '@backstage/plugin-catalog-react';
import { stringifyEntityRef } from '@backstage/catalog-model';
import { jiraDashboardApiRef } from '../../api';
import { useJira } from '../../hooks/useJira';
import {
  JiraDataResponse,
  PROJECT_KEY_ANNOTATION,
} from '@backstage/plugin-jira-dashboard-common';

export const JiraDashboardContent = () => {
  const { entity } = useEntity();
  const projectKey = entity?.metadata.annotations?.[PROJECT_KEY_ANNOTATION]!;
  const api = useApi(jiraDashboardApiRef);

  const {
    data: jiraResponse,
    loading,
    error,
  } = useJira(stringifyEntityRef(entity), projectKey, api);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <ResponseErrorPanel error={error} />;
  } else if (!jiraResponse || !jiraResponse.data || !jiraResponse.project) {
    return (
      <ResponseErrorPanel
        error={Error(
          `Could not fetch Jira Dashboard content for project key: ${projectKey}`,
        )}
      />
    );
  }

  return (
    <Content>
      <ContentHeader title="Jira Dashboard">
        <SupportButton>
          Jira Dashboard plugin lets you track Jira tickets
        </SupportButton>
      </ContentHeader>
      <Grid container spacing={3}>
        <Grid item md={6} xs={12}>
          <JiraProjectCard project={jiraResponse.project} />
        </Grid>
        {jiraResponse.data.map((value: JiraDataResponse) => (
          <Grid item key={value.name} md={6} xs={12}>
            <JiraTable tableContent={value} />
          </Grid>
        ))}
      </Grid>
    </Content>
  );
};
