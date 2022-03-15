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
import { CopyTextButton } from '@backstage/core-components';
import {
  List,
  ListSubheader,
  ListItem,
  ListItemText,
  ListItemIcon,
  makeStyles,
  Collapse,
} from '@material-ui/core';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles(theme => ({
  list: {
    width: '100%',
  },
  text: {
    fontFamily: 'monospace',
    whiteSpace: 'pre',
    overflowX: 'auto',
    marginRight: theme.spacing(2),
  },
  stacktrace: {
    '&:hover': {
      cursor: 'pointer',
    },
  },
}));

export interface LogEntryContextInfoProps {
  entry: StoredLogEntry;
}

export function LogEntryContextInfo({ entry }: LogEntryContextInfoProps) {
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);

  const handleClick = useCallback(() => {
    setOpen(value => !value);
  }, []);

  return (
    <List
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader component="div" id="nested-list-subheader">
          Log info
        </ListSubheader>
      }
      className={classes.list}
    >
      <ListItem>
        <ListItemIcon>
          <LocationOnIcon />
        </ListItemIcon>
        <ListItemText primary={`At location: ${entry.pathname}`} />
      </ListItem>
      <ListItem
        onClick={entry.callStack ? handleClick : undefined}
        disabled={!entry.callStack}
        className={entry.callStack ? classes.stacktrace : ''}
      >
        <ListItemIcon>{open ? <ExpandLess /> : <ExpandMore />}</ListItemIcon>
        <ListItemText primary="Stack trace" />
      </ListItem>
      <Collapse in={open} mountOnEnter timeout="auto">
        <ListItem alignItems="flex-start">
          <ListItemText
            classes={{ secondary: classes.text }}
            secondary={entry.callStack ?? ''}
          />
          <CopyTextButton text={entry.callStack ?? ''} />
        </ListItem>
      </Collapse>
    </List>
  );
}
