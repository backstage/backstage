/*
 * Copyright 2020 The Backstage Authors
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

//  NEEDS WORK
import { Button, LinearProgress, Tooltip, Typography } from '@material-ui/core';
import MaterialTable from 'material-table';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Search from '@material-ui/icons/Search';
import React, { forwardRef } from 'react';

import { useAsync } from 'react-use';
import { gcpApiRef, Project } from '../../api';

import {
  Content,
  ContentHeader,
  Header,
  HeaderLabel,
  Link,
  Page,
  SupportButton,
  WarningPanel,
} from '@backstage/core-components';

import { useApi } from '@backstage/core-plugin-api';

import { Link as RouterLink } from 'react-router-dom';

const LongText = ({ text, max }: { text: string; max: number }) => {
  if (text.length < max) {
    return <span>{text}</span>;
  }
  return (
    <Tooltip title={text}>
      <span>{text.slice(0, max)}...</span>
    </Tooltip>
  );
};

const labels = (
  <>
    <HeaderLabel label="Owner" value="Spotify" />
    <HeaderLabel label="Lifecycle" value="Production" />
  </>
);

const PageContents = () => {
  const api = useApi(gcpApiRef);

  const { loading, error, value } = useAsync(() => api.listProjects());

  if (loading) {
    return <LinearProgress />;
  } else if (error) {
    return (
      <WarningPanel title="Failed to load projects">
        {error.toString()}
      </WarningPanel>
    );
  }

  function renderLink(id: string) {
    return (
      <Link to={`project?projectId=${encodeURIComponent(id)}`}>
        <Typography color="primary">
          <LongText text={id} max={60} />
        </Typography>
      </Link>
    );
  }

  return (
    <div style={{ height: '95%', width: '100%' }}>
      <MaterialTable
        icons={{
          Filter: forwardRef((props, ref) => (
            <FilterList {...props} ref={ref} />
          )),
          FirstPage: forwardRef((props, ref) => (
            <FirstPage {...props} ref={ref} />
          )),
          LastPage: forwardRef((props, ref) => (
            <LastPage {...props} ref={ref} />
          )),
          NextPage: forwardRef((props, ref) => (
            <ChevronRight {...props} ref={ref} />
          )),
          PreviousPage: forwardRef((props, ref) => (
            <ChevronLeft {...props} ref={ref} />
          )),
          ResetSearch: forwardRef((props, ref) => (
            <Clear {...props} ref={ref} />
          )),
          Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
          SortArrow: forwardRef((props, ref) => (
            <ArrowDownward {...props} ref={ref} />
          )),
        }}
        columns={[
          {
            field: 'name',
            title: 'Name',
            defaultSort: 'asc',
          },
          {
            field: 'projectNumber',
            title: 'Project Number',
          },
          {
            field: 'projectID',
            title: 'Project ID',
            render: (rowData: { id: string }) => renderLink(rowData.id),
          },
          {
            field: 'state',
            title: 'State',
          },
          {
            field: 'creationTime',
            title: 'Creation Time',
          },
        ]}
        data={
          value?.map((project: Project) => ({
            id: project.projectId,
            name: project.name,
            projectNumber: project?.projectNumber || 'Error',
            projectID: project.projectId,
            state: project?.lifecycleState || 'Error',
            creationTime: project?.createTime || 'Error',
          })) || []
        }
        options={{
          filtering: true,
          pageSize: 5,
          pageSizeOptions: [5, 10, 25, 50, 100],
          showTitle: false,
        }}
      />
    </div>
  );
};

export const ProjectListPage = () => (
  <Page themeId="service">
    <Header title="GCP Projects" type="tool">
      {labels}
    </Header>
    <Content>
      <ContentHeader title="">
        <Button
          component={RouterLink}
          variant="contained"
          color="primary"
          to="new"
        >
          New Project
        </Button>
        <SupportButton>All your software catalog entities</SupportButton>
      </ContentHeader>
      <PageContents />
    </Content>
  </Page>
);
