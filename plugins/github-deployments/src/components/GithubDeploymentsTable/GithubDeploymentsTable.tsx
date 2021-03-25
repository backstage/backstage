/*
 * Copyright 2021 Spotify AB
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
import { Table, TableColumn } from '@backstage/core';
import { GithubDeployment } from '../../api';
import moment from 'moment';
import { Box, Typography, Link } from '@material-ui/core';

const lastUpdated = (start: string): string => moment(start).fromNow();

const State = ({ value }: { value: string }) => {
  const colorMap: Record<string, string> = {
    PENDING: 'orange',
    IN_PROGRESS: 'orange',
    ACTIVE: 'green',
  };

  return (
    <Box display="flex" alignItems="center">
      <span
        style={{
          display: 'block',
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: colorMap[value] || 'grey',
          marginRight: '5px',
        }}
      />
      <Typography variant="caption">{value}</Typography>
    </Box>
  );
};

const columns: TableColumn[] = [
  {
    title: 'Environment',
    field: 'environment',
    highlight: true,
  },
  {
    title: 'Status',
    field: 'environment',
    render: (row: any): React.ReactNode => <State value={row.state} />,
  },
  {
    title: 'Commit',
    render: (row: any): React.ReactNode => (
      <Link href={row.commit.commitUrl} target="_blank" rel="noopener">
        {row.commit.abbreviatedOid}
      </Link>
    ),
  },
  {
    title: 'Last Updated',
    render: (row: any): React.ReactNode => lastUpdated(row.updatedAt),
  },
];

type GithubDeploymentsTableProps = {
  deployments: GithubDeployment[];
};

const GithubDeploymentsTable = ({
  deployments,
}: GithubDeploymentsTableProps) => {
  return (
    <Table
      columns={columns}
      options={{ padding: 'dense', paging: true, search: false, pageSize: 5 }}
      title="Github Deployments"
      data={deployments}
    />
  );
};

export default GithubDeploymentsTable;
