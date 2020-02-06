import React from 'react';
import { pure } from 'recompose';
import { withStyles } from '@material-ui/core';

const styles = theme => ({
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
    animation: 'blink 0.8s step-start 0s infinite',
    backgroundColor: theme.palette.status.running,
  },
  '@keyframes blink': {
    '50%': {
      backgroundColor: theme.palette.status.background,
    },
  },
});

export const StatusOK = pure(
  withStyles(styles)(props => (
    <span className={`${props.classes.status} ${props.classes.ok}`} aria-label="Status OK" {...props} />
  )),
);

export const StatusWarning = pure(
  withStyles(styles)(props => (
    <span className={`${props.classes.status} ${props.classes.warning}`} aria-label="Status warning" {...props} />
  )),
);

export const StatusError = pure(
  withStyles(styles)(props => (
    <span className={`${props.classes.status} ${props.classes.error}`} aria-label="Status error" {...props} />
  )),
);

export const StatusNA = pure(() => <span aria-label="Status N/A">N/A</span>);

export const StatusPending = pure(
  withStyles(styles)(props => (
    <span className={`${props.classes.status} ${props.classes.pending}`} aria-label="Status pending" {...props} />
  )),
);

export const StatusRunning = pure(
  withStyles(styles)(props => (
    <span className={`${props.classes.status} ${props.classes.running}`} aria-label="Status running" {...props} />
  )),
);

export const StatusFailed = pure(
  withStyles(styles)(props => (
    <span className={`${props.classes.status} ${props.classes.failed}`} aria-label="Status failed" {...props} />
  )),
);
