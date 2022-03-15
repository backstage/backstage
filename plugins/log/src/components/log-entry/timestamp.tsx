/*
 * Copyright 2022 The Backstage Authors
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

import React from 'react';
import { makeStyles } from '@material-ui/core';
import { DateTime } from 'luxon';

const useStyles = makeStyles(theme => ({
  timestamp: {
    fontSize: '12px',
    color: theme.palette.text.hint,
    fontFamily: 'monospace',
    letterSpacing: '-0.1em',
  },
}));

export interface TimestampProps {
  date: Date;
}

export function Timestamp({ date }: TimestampProps) {
  const classes = useStyles();

  const str = DateTime.fromJSDate(date).toLocaleString(
    DateTime.DATETIME_SHORT_WITH_SECONDS,
  );

  return (
    <span title={date.toJSON()} className={classes.timestamp}>
      {str}
    </span>
  );
}
