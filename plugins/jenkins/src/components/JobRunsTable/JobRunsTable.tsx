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
import { Link, Table, TableColumn } from '@backstage/core-components';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { default as React } from 'react';
import JenkinsLogo from './../../assets/JenkinsLogo.svg';
import { useJobRuns } from './../useJobRuns';
import { Job, JobBuild } from './../../api/JenkinsApi';
import { JenkinsRunStatus } from './../BuildsPage/lib/Status';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { jobRunsRouteRef } from '../../plugin';
import { useRouteRefParams } from '@backstage/core-plugin-api';

const generatedColumns: TableColumn[] = [
  {
    title: 'Number',
    field: 'number',
    render: (row: Partial<JobBuild>) => {
      return (
        <Box display="flex" alignItems="center">
          <Typography paragraph>
            <Link to={row.url ?? ''}>{row.number}</Link>
          </Typography>
        </Box>
      );
    },
  },
  {
    title: 'Timestamp',
    field: 'timestamp',
    render: (row: Partial<JobBuild>) => {
      return (
        <Box display="flex" alignItems="center">
          <Typography>
            {row?.timestamp ? new Date(row?.timestamp).toLocaleString() : ' '}
          </Typography>
        </Box>
      );
    },
  },
  {
    title: 'Result',
    field: 'result',
    render: (row: Partial<JobBuild>) => {
      return (
        <Box display="flex" alignItems="center">
          {row.inProgress ? (
            <Typography>In Progress</Typography>
          ) : (
            <JenkinsRunStatus status={row?.result} />
          )}
        </Box>
      );
    },
  },
  {
    title: 'Duration',
    field: 'duration',
    render: (row: Partial<JobBuild>) => {
      return (
        <Box display="flex" alignItems="center">
          <Typography>
            {row?.duration
              ? (row.duration / 1000).toFixed(1).toString().concat(' s')
              : ''}
          </Typography>
        </Box>
      );
    },
  },

  {
    title: 'Actions',
    render: (row: Partial<JobBuild>) => {
      const ActionWrapper = () => {
        return (
          <div style={{ width: '98px' }}>
            {row?.url && (
              <Tooltip title="View build">
                <Link component={IconButton} to={row.url}>
                  <VisibilityIcon />
                </Link>
              </Tooltip>
            )}
          </div>
        );
      };
      return <ActionWrapper />;
    },
    width: '10%',
  },
];

type Props = {
  loading: boolean;
  jobRuns?: Job;
  page: number;
  onChangePage: (page: number) => void;
  pageSize: number;
  onChangePageSize: (pageSize: number) => void;
};

export const JobRunsTableView = ({
  loading,
  pageSize,
  page,
  jobRuns,
  onChangePage,
  onChangePageSize,
}: Props) => {
  const builds = jobRuns?.builds.slice(
    page * pageSize,
    page * pageSize + pageSize,
  );
  let sumOfAllSuccessfulJobDuration = 0;

  const successfulJobCount =
    builds?.reduce((count, build) => {
      if (!build.inProgress && build.result === 'SUCCESS') {
        sumOfAllSuccessfulJobDuration += build.duration;
        return count + 1;
      }
      return count;
    }, 0) || 0;

  let avgTime;

  if (successfulJobCount > 0) {
    avgTime = (sumOfAllSuccessfulJobDuration / successfulJobCount / 1000)
      .toFixed(1)
      .toString();
  }

  return (
    <Table
      isLoading={loading}
      options={{ paging: true, pageSize, padding: 'dense' }}
      totalCount={jobRuns?.builds.length || 0}
      page={page}
      data={builds ?? []}
      onPageChange={onChangePage}
      onRowsPerPageChange={onChangePageSize}
      title={
        <Box>
          <Box display="flex" alignItems="center">
            <img src={JenkinsLogo} alt="Jenkins logo" height="50px" />
            <Box mr={2} />
            <Typography variant="h6">{`${jobRuns?.displayName} Runs`}</Typography>
          </Box>
          <Box display="flex" alignItems="center" mt={2}>
            <Typography variant="h6">
              Average Build Time For Last {successfulJobCount} Successful jobs :{' '}
              {avgTime || 0}
            </Typography>
          </Box>
        </Box>
      }
      columns={generatedColumns}
    />
  );
};

export const JobRunsTable = () => {
  const { jobFullName } = useRouteRefParams(jobRunsRouteRef);
  const [tableProps, { setPage, setPageSize }] = useJobRuns(jobFullName);

  return (
    <JobRunsTableView
      {...tableProps}
      onChangePageSize={setPageSize}
      onChangePage={setPage}
    />
  );
};
