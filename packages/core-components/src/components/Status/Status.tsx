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

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CheckCircleOutline from '@material-ui/icons/CheckCircleOutline';
import WarningOutline from '@material-ui/icons/ReportProblemOutlined';
import ErrorOutline from '@material-ui/icons/ErrorOutline';
import classNames from 'classnames';
import React, { PropsWithChildren } from 'react';
import { PendingIcon } from './icons/PendingIcon';
import { RunningIcon } from './icons/RunningIcon';
import { AbortedIcon } from './icons/AbortedIcon';

export type StatusClassKey =
  | 'status'
  | 'ok'
  | 'warning'
  | 'error'
  | 'pending'
  | 'running'
  | 'aborted';

const useStyles = makeStyles(
  theme => ({
    status: {
      fontWeight: theme.typography.fontWeightMedium,
      alignItems: 'baseline',
      display: 'flex',
    },
    statusIcon: {
      flexShrink: 0,
      position: 'relative',
      top: '0.125em',
      marginRight: theme.spacing(1),
    },
    statusIconSize: {
      width: '0.8em',
      height: '0.8em',
    },
    statusIconSizeForImg: {
      width: '1.2em',
      height: '1.2em',
    },
    ok: {
      fill: theme.palette.status.ok || '#3E8635',
    },
    warning: {
      fill: theme.palette.status.warning || '#F0AB00',
    },
    error: {
      fill: theme.palette.status.error || '#C9190B',
    },
    pending: {
      fill: theme.palette.status.aborted || '#6A6E73',
    },
    running: {
      fill: theme.palette.status.aborted || '#6A6E73',
    },
    aborted: {
      fill: theme.palette.status.aborted || '#6A6E73',
    },
  }),
  { name: 'BackstageStatus' },
);

export function StatusOK(props: PropsWithChildren<{}>) {
  const { children, ...otherProps } = props;
  const classes = useStyles(otherProps);
  return (
    <Typography
      component="span"
      className={classNames(classes.status)}
      aria-label="Status ok"
      aria-hidden="true"
      {...otherProps}
    >
      <CheckCircleOutline
        data-testid="status-ok"
        className={classNames(
          classes.ok,
          classes.statusIconSize,
          classes.statusIcon,
        )}
      />
      {children}
    </Typography>
  );
}

export function StatusWarning(props: PropsWithChildren<{}>) {
  const { children, ...otherProps } = props;
  const classes = useStyles(otherProps);
  return (
    <Typography
      component="span"
      className={classNames(classes.status)}
      aria-label="Status warning"
      aria-hidden="true"
      {...otherProps}
    >
      <WarningOutline
        data-testid="status-warning"
        className={classNames(
          classes.warning,
          classes.statusIconSize,
          classes.statusIcon,
        )}
      />
      {children}
    </Typography>
  );
}

export function StatusError(props: PropsWithChildren<{}>) {
  const { children, ...otherProps } = props;
  const classes = useStyles(otherProps);
  return (
    <Typography
      component="span"
      className={classNames(classes.status)}
      aria-label="Status error"
      aria-hidden="true"
      {...otherProps}
    >
      <ErrorOutline
        data-testid="status-error"
        className={classNames(
          classes.error,
          classes.statusIconSize,
          classes.statusIcon,
        )}
      />
      {children}
    </Typography>
  );
}

export function StatusPending(props: PropsWithChildren<{}>) {
  const { children, ...otherProps } = props;
  const classes = useStyles(otherProps);
  return (
    <Typography
      component="span"
      className={classNames(classes.status)}
      aria-label="Status pending"
      aria-hidden="true"
      {...otherProps}
    >
      <PendingIcon
        dataTestId="status-pending"
        className={classNames(
          classes.pending,
          classes.statusIconSizeForImg,
          classes.statusIcon,
        )}
      />
      {children}
    </Typography>
  );
}

export function StatusRunning(props: PropsWithChildren<{}>) {
  const { children, ...otherProps } = props;
  const classes = useStyles(otherProps);
  return (
    <Typography
      component="span"
      className={classNames(classes.status)}
      aria-label="Status running"
      aria-hidden="true"
      {...otherProps}
    >
      <RunningIcon
        dataTestId="status-running"
        className={classNames(
          classes.running,
          classes.statusIcon,
          classes.statusIconSizeForImg,
        )}
      />
      {children}
    </Typography>
  );
}

export function StatusAborted(props: PropsWithChildren<{}>) {
  const { children, ...otherProps } = props;
  const classes = useStyles(otherProps);
  return (
    <Typography
      component="span"
      className={classNames(classes.status)}
      aria-label="Status aborted"
      aria-hidden="true"
      {...otherProps}
    >
      <AbortedIcon
        dataTestId="status-aborted"
        className={classNames(
          classes.aborted,
          classes.statusIcon,
          classes.statusIconSizeForImg,
        )}
      />
      {children}
    </Typography>
  );
}
