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

import React, { useCallback } from 'react';
import { StoredLogEntry } from '@backstage/core-plugin-api';
import {
  Collapse,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Tooltip,
  makeStyles,
} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import CopyIcon from '@material-ui/icons/FileCopy';

import { LogEntryMessage } from './message';
import { LogEntryContext } from './log-context';

const useStyles = makeStyles(theme => ({
  nested: {
    flexFlow: 'column nowrap',
    alignItems: 'flex-start',
    paddingLeft: theme.spacing(9),
    paddingTop: 0,
    paddingBottom: theme.spacing(2),
  },
  message: {
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 0, 0.1)',
      cursor: 'pointer',
    },
    borderTop: `1px solid ${theme.palette.divider}`,
  },
  timestamp: {
    fontSize: '12px',
  },
}));

export interface LogEntryRowProps {
  entry: StoredLogEntry;
}

export function LogEntryRow({ entry }: LogEntryRowProps) {
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);

  const handleClick = useCallback(() => {
    setOpen(value => !value);
  }, []);

  const handleCopyClick = useCallback(
    (e: React.MouseEvent) => {
      // eslint-disable-next-line no-console
      console.log(...entry.args);
      e.stopPropagation();
    },
    [entry],
  );

  return (
    <div>
      <ListItem onClick={handleClick} className={classes.message}>
        <ListItemIcon>{open ? <ExpandLess /> : <ExpandMore />}</ListItemIcon>
        <ListItemText
          primary={<LogEntryMessage entry={entry} withTimestamp />}
        />
        <Tooltip
          id="tooltip-left"
          title="Copy to browser console"
          placement="left"
        >
          <ListItemSecondaryAction onClick={handleCopyClick}>
            <IconButton aria-label="Copy to browser console" size="small">
              <CopyIcon fontSize="small" />
            </IconButton>
          </ListItemSecondaryAction>
        </Tooltip>
      </ListItem>
      <Collapse in={open} mountOnEnter timeout="auto">
        <ListItem dense className={classes.nested}>
          <LogEntryContext entry={entry} />
        </ListItem>
      </Collapse>
    </div>
  );
}
