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
  Page,
  Table,
  TableColumn,
  Progress,
  Content,
  ContentHeader,
  Header,
  HeaderLabel,
  SupportButton,
} from '@backstage/core-components';
import { useRouteRefParams, useApi } from '@backstage/core-plugin-api';
import { flyteDomainRouteRef } from '../../routes';
import Alert from '@material-ui/lab/Alert';
import { useAsync } from 'react-use';
import { flyteApiRef } from './../../api';
import { PartialIdentifier } from './../../api/types';

import { Grid } from '@material-ui/core';

type DenseTableProps = {
  workflowList: PartialIdentifier[];
};

export const DenseTable = ({ workflowList }: DenseTableProps) => {
  const columns: TableColumn[] = [
    { title: 'name', field: 'name' },
    { title: 'project', field: 'project' },
    { title: 'domain', field: 'domain' },
  ];

  const data = workflowList.map(workflow => {
    return {
      project: workflow.project,
      domain: workflow.domain,
      name: workflow.name,
    };
  });

  return (
    <Table
      title="Flyte Workflows List"
      options={{ search: true, paging: false }}
      columns={columns}
      data={data}
    />
  );
};

export const FlyteDomainComponent = () => {
  const { project, domain } = useRouteRefParams(flyteDomainRouteRef);
  const api = useApi(flyteApiRef);
  const { value, loading, error } = useAsync(async () =>
    api.listWorkflowIds(project, domain),
  );
  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }
  return (
    <Page themeId="tool">
      <Header title="Welcome to flyte!" subtitle="Optional subtitle">
        <HeaderLabel label="Owner" value="Team X" />
        <HeaderLabel label="Lifecycle" value="Alpha" />
      </Header>
      <Content>
        <ContentHeader title="Plugin title">
          <SupportButton>A description of your plugin goes here.</SupportButton>
        </ContentHeader>
        <Grid container spacing={3} direction="column">
          <Grid item>
            <DenseTable workflowList={value!} />
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
};
