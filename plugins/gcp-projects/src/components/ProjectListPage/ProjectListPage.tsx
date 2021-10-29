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
import { DataGrid, GridColDef, GridCellParams } from '@material-ui/data-grid';
import React from 'react';
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

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (pageSize: number) => {
    setRowsPerPage(pageSize);
    setPage(0);
  };

  if (loading) {
    return <LinearProgress />;
  } else if (error) {
    return (
      <WarningPanel title="Failed to load projects">
        {error.toString()}
      </WarningPanel>
    );
  }

  function renderLink(params: GridCellParams) {
    return (
      <Link
        to={`project?projectId=${encodeURIComponent(params.value!.toString())}`}
      >
        <Typography color="primary">
          <LongText text={params.value!.toString()} max={60} />
        </Typography>
      </Link>
    );
  }

  const columns: GridColDef[] = [
    {
      align: 'left',
      field: 'name',
      flex: 1,
      headerAlign: 'left',
      headerName: 'Name',
    },
    {
      align: 'left',
      field: 'projectNumber',
      flex: 0.6,
      headerAlign: 'left',
      headerName: 'Project Number',
    },
    {
      align: 'left',
      field: 'projectID',
      flex: 1,
      headerAlign: 'left',
      headerName: 'Project ID',
      renderCell: renderLink,
    },
    {
      align: 'left',
      field: 'state',
      flex: 0.6,
      headerAlign: 'left',
      headerName: 'State',
    },
    {
      align: 'left',
      field: 'creationTime',
      flex: 0.7,
      headerAlign: 'left',
      headerName: 'Creation Time',
    },
  ];

  const rows =
    value?.map((project: Project) => ({
      id: project.projectId,
      name: project.name,
      projectNumber: project?.projectNumber || 'Error',
      projectID: project.projectId,
      state: project?.lifecycleState || 'Error',
      creationTime: project?.createTime || 'Error',
    })) || [];

  return (
    <div style={{ height: '95%', width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        page={page}
        pageSize={rowsPerPage}
        rowsPerPageOptions={[10, 25, 50, 100]}
        onPageChange={handleChangePage}
        onPageSizeChange={handleChangeRowsPerPage}
        disableSelectionOnClick
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
