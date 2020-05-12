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

const useStyles = makeStyles<BackstageTheme>((theme) => ({
  status: {
    fontWeight: 500,
    '&::before': {
      width: '0.7em',
      height: '0.7em',
      display: 'inline-block',
      marginRight: 8,
      borderRadius: '50%',
      content: '""',
    },
  },
  ok: {
    '&::before': {
      backgroundColor: theme.palette.status.ok,
    },
  },
  warning: {
    '&::before': {
      backgroundColor: theme.palette.status.warning,
    },
  },
  error: {
    '&::before': {
      backgroundColor: theme.palette.status.error,
    },
  },
  pending: {
    '&::before': {
      backgroundColor: theme.palette.status.pending,
    },
  },
  running: {
    '&::before': {
      backgroundColor: theme.palette.status.running,
      animation: '$blink 0.8s step-start 0s infinite',
    },
  },
  aborted: {
    '&::before': {
      backgroundColor: theme.palette.status.aborted,
    },
  },
  '@keyframes blink': {
    '50%': {
      backgroundColor: theme.palette.status.background,
    },
  },
}));

export const StatusOK: FC<{}> = (props) => {
  const classes = useStyles(props);
  return <span className={classNames(classes.status, classes.ok)} {...props} />;
};

export const StatusWarning: FC<{}> = (props) => {
  const classes = useStyles(props);
  return (
    <span className={classNames(classes.status, classes.warning)} {...props} />
  );
};

export const StatusError: FC<{}> = (props) => {
  const classes = useStyles(props);
  return (
    <span className={classNames(classes.status, classes.error)} {...props} />
  );
};

export const StatusPending: FC<{}> = (props) => {
  const classes = useStyles(props);
  return (
    <span
      className={classNames(classes.status, classes.pending)}
      aria-label="Status pending"
      {...props}
    />
  );
};

export const StatusRunning: FC<{}> = (props) => {
  const classes = useStyles(props);
  return (
    <span
      className={classNames(classes.status, classes.running)}
      aria-label="Status running"
      {...props}
    />
  );
};

export const StatusAborted: FC<{}> = (props) => {
  const classes = useStyles(props);
  return (
    <span
      className={classNames(classes.status, classes.aborted)}
      aria-label="Status aborted"
      {...props}
    />
  );
};
