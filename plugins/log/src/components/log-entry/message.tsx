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

import React, { useMemo } from 'react';
import { makeStyles } from '@material-ui/core';
import {
  StoredLogEntry,
  StoredLogEntryArgument,
} from '@backstage/core-plugin-api';
import { Inspector } from 'react-inspector';

import { Timestamp } from './timestamp';
import { isPrimitive, Primitive, Reclaimed } from './primitive';
import { LevelIcon } from '../level-icon';

const useStyles = makeStyles(() => ({
  arg: {
    display: 'inline-block',
    marginRight: 8,
    verticalAlign: 'top',
  },
  inspector: {
    display: 'inline-block',
    '& *': {
      backgroundColor: 'transparent !important',
    },
  },
}));

const inhibitParentEvents = {
  onClick: (ev: React.MouseEvent<unknown>) => {
    ev.stopPropagation();
  },
};

export interface LogEntryMessageProps {
  withTimestamp?: boolean;
  entry: StoredLogEntry;
}

export function LogEntryMessage({
  withTimestamp,
  entry,
}: LogEntryMessageProps) {
  const classes = useStyles();

  const parts = useMemo(
    () => [
      <div key="icon" className={classes.arg}>
        <LevelIcon level={entry.level} />
      </div>,
      ...(withTimestamp
        ? [
            <div key="timestamp" className={classes.arg}>
              <Timestamp date={entry.timestamp} />
            </div>,
          ]
        : []),
      ...entry.args.map((arg, i) => (
        <div key={i} className={classes.arg}>
          <EntryArgument arg={arg} />
        </div>
      )),
    ],
    [withTimestamp, entry, classes],
  );

  return <div>{parts}</div>;
}

interface EntryArgumentProps {
  arg: StoredLogEntryArgument;
}

function EntryArgument({ arg }: EntryArgumentProps) {
  const classes = useStyles();

  if (arg.reclaimed) {
    return <Reclaimed value={arg.value as string} />;
  }

  if (isPrimitive(arg.value)) {
    return <Primitive value={arg.value} />;
  }

  return (
    <div className={classes.inspector} {...inhibitParentEvents}>
      <Inspector data={arg.value} />
    </div>
  );
}
