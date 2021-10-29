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
import {
  Link,
  Page,
  Table,
  TableColumn,
  Progress,
  Content,
  ContentHeader,
  SupportButton,
} from '@backstage/core-components';
import Alert from '@material-ui/lab/Alert';
import { useAsync } from 'react-use';
import { flyteApiRef } from './../../api';
import { FlyteExecution } from './../../api/types';
import { useRouteRefParams, useApi } from '@backstage/core-plugin-api';
import { flyteWorkflowExecutionsRouteRef } from '../../routes';
import { FlyteHeaderComponent } from '../FlyteHeaderComponent';
import { FlyteIdComponent } from '../FlyteIdComponent';
import { Grid } from '@material-ui/core';

type DenseTableProps = {
  executions: FlyteExecution[];
};

export const DenseTable = ({ executions }: DenseTableProps) => {
  const columns: TableColumn[] = [
    { title: 'project', field: 'project' },
    { title: 'domain', field: 'domain' },
    { title: 'name', field: 'name' },
    { title: 'phase', field: 'phase' },
    { title: 'startedAt', field: 'startedAt' },
    { title: 'updatedAt', field: 'updatedAt' },
  ];
  const data = executions.map(execution => {
    return {
      project: execution.workflowExecutionId.project,
      domain: execution.workflowExecutionId.domain,
      name: (
        <Link to={execution.executionConsoleUrl}>
          {execution.workflowExecutionId.name}
        </Link>
      ),
      phase: execution.phase,
      startedAt: execution.startedAt,
      updatedAt: execution.updatedAt,
    };
  });
  return (
    <Table
      title="Flyte Executions List"
      options={{ search: true, paging: false }}
      columns={columns}
      data={data}
    />
  );
};

export const FlyteWorkflowExecutionsComponent = () => {
  const api = useApi(flyteApiRef);
  const { project, domain, name } = useRouteRefParams(
    flyteWorkflowExecutionsRouteRef,
  );
  const { value, loading, error } = useAsync(async () =>
    api.listExecutions(project, domain, name, 100),
  );

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  return (
    <Page themeId="tool">
      <FlyteHeaderComponent />
      <Content>
        <ContentHeader title="Plugin title">
          <SupportButton>A description of your plugin goes here.</SupportButton>
        </ContentHeader>
        <Grid container spacing={3} direction="column">
          <Grid item>
            <FlyteIdComponent
              project={project}
              domain={domain}
              workflowName={name}
            />
          </Grid>
          <Grid item>
            <DenseTable executions={value!} />
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
};
