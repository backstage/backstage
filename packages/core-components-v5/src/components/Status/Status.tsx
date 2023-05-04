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
import { makeStyles } from 'tss-react/mui';
import Typography from '@mui/material/Typography';
import React, { PropsWithChildren } from 'react';

export type StatusClassKey =
  | 'status'
  | 'ok'
  | 'warning'
  | 'error'
  | 'pending'
  | 'running'
  | 'aborted';

const useStyles = makeStyles({ name: 'BackstageStatus' })(theme => ({
  status: {
    fontWeight: theme.typography.fontWeightMedium,
    '&::before': {
      width: '0.7em',
      height: '0.7em',
      display: 'inline-block',
      marginRight: theme.spacing(1),
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
    },
  },
  aborted: {
    '&::before': {
      backgroundColor: theme.palette.status.aborted,
    },
  },
}));

export function StatusOK(props: PropsWithChildren<{}>) {
  const { classes, cx } = useStyles();
  return (
    <Typography
      component="span"
      className={cx(classes.status, classes.ok)}
      aria-label="Status ok"
      aria-hidden="true"
      {...props}
    />
  );
}

export function StatusWarning(props: PropsWithChildren<{}>) {
  const { classes, cx } = useStyles();
  return (
    <Typography
      component="span"
      className={cx(classes.status, classes.warning)}
      aria-label="Status warning"
      aria-hidden="true"
      {...props}
    />
  );
}

export function StatusError(props: PropsWithChildren<{}>) {
  const { classes, cx } = useStyles();
  return (
    <Typography
      component="span"
      className={cx(classes.status, classes.error)}
      aria-label="Status error"
      aria-hidden="true"
      {...props}
    />
  );
}

export function StatusPending(props: PropsWithChildren<{}>) {
  const { classes, cx } = useStyles();
  return (
    <Typography
      component="span"
      className={cx(classes.status, classes.pending)}
      aria-label="Status pending"
      aria-hidden="true"
      {...props}
    />
  );
}

export function StatusRunning(props: PropsWithChildren<{}>) {
  const { classes, cx } = useStyles();
  return (
    <Typography
      component="span"
      className={cx(classes.status, classes.running)}
      aria-label="Status running"
      aria-hidden="true"
      {...props}
    />
  );
}

export function StatusAborted(props: PropsWithChildren<{}>) {
  const { classes, cx } = useStyles();
  return (
    <Typography
      component="span"
      className={cx(classes.status, classes.aborted)}
      aria-label="Status aborted"
      aria-hidden="true"
      {...props}
    />
  );
}
