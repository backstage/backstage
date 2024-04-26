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
import { Table, TableColumn } from '@backstage/core-components';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import RetryIcon from '@material-ui/icons/Replay';
import { default as React } from 'react';
import { Project } from '../../../../api/JenkinsApi';
import JenkinsLogo from '../../../../assets/JenkinsLogo.svg';
import { useBuilds } from '../../../useBuilds';
import { columnFactories } from './columns';
import { defaultCITableColumns } from './presets';

type Props = {
  loading: boolean;
  retry: () => void;
  projects?: Project[];
  page: number;
  onChangePage: (page: number) => void;
  total: number;
  pageSize: number;
  onChangePageSize: (pageSize: number) => void;
  columns: TableColumn<Project>[];
};

export const CITableView = ({
  loading,
  pageSize,
  page,
  retry,
  projects,
  onChangePage,
  onChangePageSize,
  columns,
  total,
}: Props) => {
  const projectsInPage = projects?.slice(
    page * pageSize,
    Math.min(projects.length, (page + 1) * pageSize),
  );
  return (
    <Table
      isLoading={loading}
      options={{ paging: true, pageSize, padding: 'dense' }}
      totalCount={total}
      page={page}
      actions={[
        {
          icon: () => <RetryIcon />,
          tooltip: 'Refresh Data',
          isFreeAction: true,
          onClick: () => retry(),
        },
      ]}
      data={projectsInPage ?? []}
      onPageChange={onChangePage}
      onRowsPerPageChange={onChangePageSize}
      title={
        <Box display="flex" alignItems="center">
          <img src={JenkinsLogo} alt="Jenkins logo" height="50px" />
          <Box mr={2} />
          <Typography variant="h6">Projects</Typography>
        </Box>
      }
      columns={
        columns && columns.length !== 0 ? columns : defaultCITableColumns
      }
    />
  );
};

type CITableProps = {
  columns?: TableColumn<Project>[];
};

export const CITable = ({ columns }: CITableProps) => {
  const [tableProps, { setPage, retry, setPageSize }] = useBuilds();

  return (
    <CITableView
      {...tableProps}
      columns={columns || ([] as TableColumn<Project>[])}
      retry={retry}
      onChangePageSize={setPageSize}
      onChangePage={setPage}
    />
  );
};

CITable.columns = columnFactories;

CITable.defaultCITableColumns = defaultCITableColumns;
