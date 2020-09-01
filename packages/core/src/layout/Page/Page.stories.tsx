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

import React from 'react';
import {
  Header,
  Page,
  HeaderLabel,
  ContentHeader,
  Content,
  pageTheme,
} from '../';
import { SupportButton, Table, StatusOK, TableColumn } from '../../components';
import { Box, Typography, Link, Chip, Button } from '@material-ui/core';

export default {
  title: 'Example Plugin',
  component: Page,
};

interface TableData {
  id: number;
  branch: string;
  hash: string;
  status: string;
}

const generateTestData = (rows = 10) => {
  const data: Array<TableData> = [];
  while (data.length <= rows) {
    data.push({
      id: data.length + 18534,
      branch: 'techdocs: modify documentation header',
      hash: 'techdocs/docs-header 5749c98e3f61f8bb116e5cb87b0e4e1 ',
      status: 'Success',
    });
  }
  return data;
};

const columns: TableColumn[] = [
  {
    title: 'ID',
    field: 'id',
    highlight: true,
    type: 'numeric',
    width: '80px',
  },
  {
    title: 'Message/Source',
    highlight: true,
    render: (row: Partial<TableData>) => (
      <>
        <Link>{row.branch}</Link>
        <Typography variant="body2">{row.hash}</Typography>
      </>
    ),
  },
  {
    title: 'Status',
    render: (row: Partial<TableData>) => (
      <Box display="flex" alignItems="center">
        <StatusOK />
        <Typography variant="body2">{row.status}</Typography>
      </Box>
    ),
  },
  {
    title: 'Tags',
    render: () => <Chip label="Tag Name" />,
    width: '10%',
  },
];

export const PluginWithTable = () => {
  return (
    <Page theme={pageTheme.tool}>
      <Header title="Example" subtitle="This an example plugin">
        <HeaderLabel label="Owner" value="Owner" />
        <HeaderLabel label="Lifecycle" value="Lifecycle" />
      </Header>
      <Content>
        <ContentHeader title="Header">
          <Button color="primary" variant="contained">
            Settings
          </Button>
          <SupportButton>
            This Plugin is an example. This text could provide usefull
            information for the user.
          </SupportButton>
        </ContentHeader>
        <Table
          options={{ paging: true, padding: 'dense' }}
          data={generateTestData(10)}
          columns={columns}
          title="Example Content"
        />
      </Content>
    </Page>
  );
};
