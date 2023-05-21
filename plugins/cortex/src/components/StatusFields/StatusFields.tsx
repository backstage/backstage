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

import { useElementFilter } from '@backstage/core-plugin-api';
import { Grid, makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import {
    StatusPending,
    StatusOK,
    StatusError,
  } from '@backstage/core-components';

const useStyles = makeStyles(theme => ({
  value: {
    fontWeight: 'bold',
    overflow: 'hidden',
    lineHeight: '24px',
    wordBreak: 'break-word',
  },
  label: {
    color: theme.palette.text.secondary,
    textTransform: 'uppercase',
    fontSize: '10px',
    fontWeight: 'bold',
    letterSpacing: 0.5,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
}));

/**
 * Props for {@link StatusField}.
 *
 * @public
 */
export interface StatusFieldProps {
  label: string;
  value?: string;
  gridSizes?: Record<string, number>;
  children?: React.ReactNode;
}

/** @public */
export function StatusField(props: StatusFieldProps) {
  const { label, value, gridSizes, children } = props;
  const classes = useStyles();

  const childElements = useElementFilter(children, c => c.getElements());

  // Content is either children or a string prop `value`
  const content =
    childElements.length > 0 ? (
      childElements
    ) : (
      <Typography variant="body2" className={classes.value}>
        {value || `unknown`}
      </Typography>
    );
  return (
    <Grid item {...gridSizes}>
      <Typography variant="h2" className={classes.label}>
        {label}
      </Typography>
      {content}
    </Grid>
  );
}

/** @public */
export function StatusFieldWithStatus(props: StatusFieldProps) {
    const { label, value, gridSizes, children } = props;
    const classes = useStyles();
  
    const childElements = useElementFilter(children, c => c.getElements());
    const status = value || 'UNKNOWN'
    const statusOk = ['CONNECTED','PROTECTED', 'UP_TO_DATE']
    const statusError = ['OFFLINE', 'DISCONNECTED', 'UNPROTECTED']
    const statusPending = ['LOST', 'PARTIALLY_PROTECTED', 'UNKNOWN']
    const content =
      childElements.length > 0 ? (
        childElements
      ) : (
        <Typography variant="body2" className={classes.value}>
          {statusOk.includes(status || 'UNKNOWN') && <StatusOK />}
          {statusError.includes(status || 'UNKNOWN') && <StatusError />}
          {statusPending.includes(status || 'UNKNOWN') && <StatusPending />}
          {(status || `UNKNOWN`).replaceAll('_', ' ')}
        </Typography>
      );
    return (
      <Grid item {...gridSizes}>
        <Typography variant="h2" className={classes.label}>
          {label}
        </Typography>
        {content}
      </Grid>
    );
  }
