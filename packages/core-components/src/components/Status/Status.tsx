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
import { BackstageTheme } from '@backstage/theme';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import classNames from 'classnames';
import React, { PropsWithChildren } from 'react';

import CheckIcon from '@material-ui/icons/Check';
import WarningIcon from '@material-ui/icons/Warning';
import ErrorIcon from '@material-ui/icons/Error';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import ScheduleIcon from '@material-ui/icons/Schedule';
import DirectionsRunIcon from '@material-ui/icons/DirectionsRun';

export type StatusClassKey =
  | 'status'
  | 'ok'
  | 'warning'
  | 'error'
  | 'pending'
  | 'running'
  | 'aborted';

const useStyles = makeStyles<BackstageTheme>(
  theme => ({
    status: {
      alignItems: 'center',
      display: 'flex',
      flexFlow: 'row wrap',
      fontWeight: theme.typography.fontWeightMedium,

      '& > svg': {
        marginRight: theme.spacing(1),
      },
    },
    ok: {
      '& > svg': {
        fill: theme.palette.status.ok,
      },
    },
    warning: {
      '& > svg': {
        fill: theme.palette.status.warning,
      },
    },
    error: {
      '& > svg': {
        fill: theme.palette.status.error,
      },
    },
    pending: {
      '& > svg': {
        fill: theme.palette.status.pending,
      },
    },
    running: {
      '& > svg': {
        fill: theme.palette.status.running,
      },
    },
    aborted: {
      '& > svg': {
        fill: theme.palette.status.aborted,
      },
    },
  }),
  { name: 'BackstageStatus' },
);

export function StatusOK(props: PropsWithChildren<{}>) {
  const classes = useStyles(props);

  return (
    <div
      className={classNames(classes.status, classes.ok)}
      aria-label={!props.children ? 'Ok' : undefined}
      role={!props.children ? 'img' : undefined}
    >
      <CheckIcon style={{ fontSize: '1rem' }} />
      <Typography component="span" {...props} />
    </div>
  );
}

export function StatusWarning(props: PropsWithChildren<{}>) {
  const classes = useStyles(props);
  return (
    <div
      className={classNames(classes.status, classes.warning)}
      aria-label={!props.children ? 'Warning' : undefined}
      role={!props.children ? 'img' : undefined}
    >
      <WarningIcon style={{ fontSize: '1rem' }} />
      <Typography component="span" {...props} />
    </div>
  );
}

export function StatusError(props: PropsWithChildren<{}>) {
  const classes = useStyles(props);
  return (
    <div
      className={classNames(classes.status, classes.error)}
      aria-label={!props.children ? 'Error' : undefined}
      role={!props.children ? 'img' : undefined}
    >
      <ErrorIcon style={{ fontSize: '1rem' }} />
      <Typography component="span" {...props} />
    </div>
  );
}

export function StatusPending(props: PropsWithChildren<{}>) {
  const classes = useStyles(props);
  return (
    <div
      className={classNames(classes.status, classes.pending)}
      aria-label={!props.children ? 'Pending' : undefined}
      role={!props.children ? 'img' : undefined}
    >
      <ScheduleIcon style={{ fontSize: '1rem' }} />
      <Typography component="span" {...props} />
    </div>
  );
}

export function StatusRunning(props: PropsWithChildren<{}>) {
  const classes = useStyles(props);
  return (
    <div
      className={classNames(classes.status, classes.running)}
      aria-label={!props.children ? 'Running' : undefined}
      role={!props.children ? 'img' : undefined}
    >
      <DirectionsRunIcon style={{ fontSize: '1rem' }} />
      <Typography component="span" {...props} />
    </div>
  );
}

export function StatusAborted(props: PropsWithChildren<{}>) {
  const classes = useStyles(props);
  return (
    <div
      className={classNames(classes.status, classes.aborted)}
      aria-label={!props.children ? 'Aborted' : undefined}
      role={!props.children ? 'img' : undefined}
    >
      <HighlightOffIcon style={{ fontSize: '1rem' }} />
      <Typography component="span" {...props} />
    </div>
  );
}
