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

import { makeStyles } from '@material-ui/core';
import { BackstageTheme } from '@backstage/theme';
import classNames from 'classnames';
import React, { FC } from 'react';

const useStyles = makeStyles<BackstageTheme>(theme => ({
  status: {
    width: 12,
    height: 12,
    display: 'inline-block',
    marginRight: 1,
  },
  ok: {
    backgroundColor: theme.palette.status.ok,
    borderRadius: '50%',
  },
  warning: {
    backgroundColor: theme.palette.status.warning,
  },
  error: {
    width: '0',
    height: '0',
    borderLeft: '7px solid transparent',
    borderRight: '7px solid transparent',
    borderBottom: `14px solid ${theme.palette.status.error}`,
  },
  pending: {
    backgroundColor: theme.palette.status.pending,
  },
  failed: {
    backgroundColor: 'rgba(245, 155, 35, 0.5)',
  },
  running: {
    animation: '$blink 0.8s step-start 0s infinite',
    backgroundColor: theme.palette.status.running,
  },
  '@keyframes blink': {
    '50%': {
      backgroundColor: theme.palette.status.background,
    },
  },
}));

export const StatusOK: FC<{}> = props => {
  const classes = useStyles(props);
  return (
    <span
      className={classNames(classes.status, classes.ok)}
      aria-label="Status OK"
      {...props}
    />
  );
};

export const StatusWarning: FC<{}> = props => {
  const classes = useStyles(props);
  return (
    <span
      className={classNames(classes.status, classes.warning)}
      aria-label="Status warning"
      {...props}
    />
  );
};

export const StatusError: FC<{}> = props => {
  const classes = useStyles(props);
  return (
    <span
      className={classNames(classes.status, classes.error)}
      aria-label="Status error"
      {...props}
    />
  );
};

export const StatusNA: FC<{}> = props => (
  <span aria-label="Status N/A" {...props}>
    N/A
  </span>
);

export const StatusPending: FC<{}> = props => {
  const classes = useStyles(props);
  return (
    <span
      className={classNames(classes.status, classes.pending)}
      aria-label="Status pending"
      {...props}
    />
  );
};

export const StatusRunning: FC<{}> = props => {
  const classes = useStyles(props);
  return (
    <span
      className={classNames(classes.status, classes.running)}
      aria-label="Status running"
      {...props}
    />
  );
};

export const StatusFailed: FC<{}> = props => {
  const classes = useStyles(props);
  return (
    <span
      className={classNames(classes.status, classes.failed)}
      aria-label="Status failed"
      {...props}
    />
  );
};
