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

import React, { useCallback, useMemo } from 'react';
import {
  Card,
  Drawer,
  List,
  ListItemSecondaryAction,
  ListSubheader,
  makeStyles,
} from '@material-ui/core';
import Check from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Delete';
import FeaturedPlayListIcon from '@material-ui/icons/FeaturedPlayList';

import { LogEntryRow } from './log-entry/entry';
import { LogLevel, logStoreApiRef, useApi } from '@backstage/core-plugin-api';
import { HeaderFab } from './header-fab';
import { LevelIcon } from './level-icon';
import { createButtonGroup } from './header-button-group';
import { useLogs, useLogPane } from '../hooks';

const {
  Component: LevelButtonGroup,
  Provider: LevelButtonGroupProvider,
  useSelection: useLevelButtonSelection,
} = createButtonGroup<LogLevel>({
  buttons: (['debug', 'info', 'warn', 'error'] as LogLevel[]).map(level => ({
    key: level,
    title: (
      <>
        <LevelIcon level={level} />
        {level}
      </>
    ),
  })),
  defaultSelected: ['info', 'warn', 'error'],
});

const useStyles = makeStyles(theme => ({
  paperAnchorBottom: {
    maxHeight: 'auto',
    height: '45vh',
    margin: 16,
    backgroundColor: 'transparent',
  },
  card: {
    overflow: 'auto',
    width: '100%',
    height: '100%',
  },
  cardTitle: {
    marginRight: 16,
  },
  listRoot: {
    display: 'flex',
    flexDirection: 'column',
  },
  listSubheader: {
    backgroundColor: theme.palette.background.default,
  },
  headerIcon: {
    marginBottom: -7,
    marginRight: 9,
  },
  logNoEntries: {
    flex: '1',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: theme.palette.text.hint,
    fontSize: '24px',
  },
  logNoEntriesText: {
    fontSize: 13,
  },
}));

function NoLogs() {
  const classes = useStyles();
  return (
    <li className={classes.logNoEntries}>
      <Check className={classes.logNoEntriesText} />
      &nbsp;No logs
    </li>
  );
}

export function LogPane() {
  const { close, isOpen } = useLogPane();

  return (
    <LevelButtonGroupProvider>
      <LogPaneInner open={isOpen} onClose={close} />
    </LevelButtonGroupProvider>
  );
}

interface LogPaneInnerProps {
  open: boolean;
  onClose: () => void;
}

function LogPaneInner(props: LogPaneInnerProps) {
  const { open, onClose } = props;

  const classes = useStyles();

  const logStoreApi = useApi(logStoreApiRef);

  const { entries } = useLogs();

  const logLevelSelection = useLevelButtonSelection();

  const entryList = useMemo(
    () =>
      entries
        .filter(
          entry =>
            logLevelSelection.length === 0 ||
            logLevelSelection.includes(entry.level),
        )
        .map(entry => <LogEntryRow key={entry.key} entry={entry} />),
    [entries, logLevelSelection],
  );

  const clearLogs = useCallback(() => {
    logStoreApi.clear();
  }, [logStoreApi]);

  const leftActions = useMemo(
    () => (
      <>
        <LevelButtonGroup />
      </>
    ),
    [],
  );

  const rightActions = useMemo(
    () => (
      <>
        <HeaderFab Icon={DeleteIcon} onClick={clearLogs} title="Clear logs" />
        <HeaderFab Icon={CloseIcon} onClick={onClose} title="Close" />
      </>
    ),
    [clearLogs, onClose],
  );

  const drawerClasses = useMemo(
    () => ({ paperAnchorBottom: classes.paperAnchorBottom }),
    [classes],
  );

  return (
    <Drawer
      classes={drawerClasses}
      anchor="bottom"
      open={open}
      onClose={onClose}
    >
      <Card className={classes.card}>
        <List
          className={classes.listRoot}
          subheader={
            <ListSubheader className={classes.listSubheader}>
              <FeaturedPlayListIcon className={classes.headerIcon} />
              <span className={classes.cardTitle}>Logs</span>
              {leftActions}
              <ListItemSecondaryAction>{rightActions}</ListItemSecondaryAction>
            </ListSubheader>
          }
        >
          {entryList?.length ? entryList : <NoLogs />}
        </List>
      </Card>
    </Drawer>
  );
}
