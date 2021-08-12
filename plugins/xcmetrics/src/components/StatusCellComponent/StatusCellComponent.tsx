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
import { makeStyles, Tooltip } from '@material-ui/core';
import React from 'react';
import { BackstageTheme } from '@backstage/theme';
import { BuildStatus, BuildStatusResult, xcmetricsApiRef } from '../../api';
import { cn, formatDuration, formatStatus } from '../../utils';
import { useAsync } from 'react-use';
import { useApi } from '@backstage/core-plugin-api';
import { Progress } from '@backstage/core-components';

interface TooltipContentProps {
  buildId: string;
}

const TooltipContent = ({ buildId }: TooltipContentProps) => {
  const client = useApi(xcmetricsApiRef);
  const { value, loading, error } = useAsync(
    async () => client.getBuild(buildId),
    [],
  );

  if (error) {
    return <div>{error.message}</div>;
  }

  if (loading || !value?.build) {
    return <Progress style={{ width: 100 }} />;
  }

  return (
    <table>
      <tbody>
        <tr>
          <td>Started</td>
          <td>{new Date(value.build.startTimestamp).toLocaleString()}</td>
        </tr>
        <tr>
          <td>Duration</td>
          <td>{formatDuration(value.build.duration)}</td>
        </tr>
        <tr>
          <td>Status</td>
          <td>{formatStatus(value.build.buildStatus)}</td>
        </tr>
      </tbody>
    </table>
  );
};

interface StatusCellProps {
  buildStatus?: BuildStatusResult;
  size: number;
  spacing: number;
}

type StatusStyle = {
  [key in BuildStatus]: any;
};

const useStyles = makeStyles<BackstageTheme, StatusCellProps>(theme => ({
  root: {
    width: ({ size }) => size,
    height: ({ size }) => size,
    marginRight: ({ spacing }) => spacing,
    marginBottom: ({ spacing }) => spacing,
    backgroundColor: theme.palette.grey[600],
    '&:hover': {
      transform: 'scale(1.2)',
    },
  },
  ...({
    succeeded: {
      backgroundColor:
        theme.palette.type === 'light'
          ? theme.palette.success.light
          : theme.palette.success.main,
    },
  } as StatusStyle), // Make sure that key matches a status
  ...({
    failed: {
      backgroundColor: theme.palette.error[theme.palette.type],
    },
  } as StatusStyle),
  ...({
    stopped: {
      backgroundColor: theme.palette.warning[theme.palette.type],
    },
  } as StatusStyle),
}));

export const StatusCellComponent = (props: StatusCellProps) => {
  const classes = useStyles(props);
  const { buildStatus } = props;

  if (!buildStatus) {
    return <div className={classes.root} />;
  }

  return (
    <Tooltip
      title={<TooltipContent buildId={buildStatus.id} />}
      enterNextDelay={500}
      arrow
    >
      <div
        data-testid={buildStatus.id}
        className={cn(classes.root, classes[buildStatus.buildStatus])}
      />
    </Tooltip>
  );
};
