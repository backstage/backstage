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
import { Box, Typography } from '@material-ui/core';
import { OctopusEnvironment, OctopusReleaseProgression } from '../../api';

import React from 'react';
import {
  ResponseErrorPanel,
  StatusAborted,
  StatusError,
  StatusOK,
  StatusPending,
  StatusRunning,
  StatusWarning,
  Table,
  TableColumn,
} from '@backstage/core-components';
import { OctopusDeployIcon } from '../OctopusDeployIcon';

type ReleaseTableProps = {
  environments?: OctopusEnvironment[];
  releases?: OctopusReleaseProgression[];
  loading: boolean;
  error?: Error;
};

export const getDeploymentStatusComponent = (state: string | undefined) => {
  switch (state) {
    case 'Success':
      return (
        <Typography component="span">
          <StatusOK /> Success
        </Typography>
      );
    case 'Queued':
      return (
        <Typography component="span">
          <StatusPending /> Queued
        </Typography>
      );
    case 'Executing':
      return (
        <Typography component="span">
          <StatusRunning /> Executing
        </Typography>
      );
    case 'Failed':
      return (
        <Typography component="span">
          <StatusError /> Failed
        </Typography>
      );
    case 'Cancelling':
      return (
        <Typography component="span">
          <StatusPending /> Cancelling
        </Typography>
      );
    case 'Canceled':
      return (
        <Typography component="span">
          <StatusAborted /> Canceled
        </Typography>
      );
    case 'TimedOut':
      return (
        <Typography component="span">
          <StatusWarning /> Timed Out
        </Typography>
      );
    default:
      return (
        <Typography component="span">
          <StatusWarning /> Unknown
        </Typography>
      );
  }
};

export const ReleaseTable = ({
  environments,
  releases,
  loading,
  error,
}: ReleaseTableProps) => {
  if (error) {
    return <ResponseErrorPanel error={error} />;
  }

  const columns: TableColumn[] = [
    {
      title: 'Version',
      field: 'Release.Version',
      highlight: false,
      width: 'auto',
    },
    ...(environments?.map(env => ({
      title: env.Name,
      width: 'auto',
      render: (row: Partial<OctopusReleaseProgression>) => {
        const deploymentsForEnvironment = row.Deployments
          ? row.Deployments[env.Id]
          : null;
        if (deploymentsForEnvironment) {
          return (
            <Box display="flex" alignItems="center">
              <Typography variant="button">
                {getDeploymentStatusComponent(
                  deploymentsForEnvironment[0].State,
                )}
              </Typography>
            </Box>
          );
        }
        return <Box display="flex" alignItems="center" />;
      },
    })) ?? []),
  ];

  return (
    <Table
      isLoading={loading}
      columns={columns}
      options={{
        search: true,
        paging: true,
        pageSize: 5,
        showEmptyDataSourceMessage: !loading,
      }}
      title={
        <Box display="flex" alignItems="center">
          <OctopusDeployIcon style={{ fontSize: 30 }} />
          <Box mr={1} />
          Octopus Deploy - Releases ({releases ? releases.length : 0})
        </Box>
      }
      data={releases ?? []}
    />
  );
};
