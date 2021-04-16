/*
 * Copyright 2020 Spotify AB
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

import {
  Card,
  List,
  ListItemIcon,
  ListItemText,
  makeStyles,
  MenuItem,
  Theme,
  Typography,
} from '@material-ui/core';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useEntityListState } from '../../state';
import { ButtonGroup, useFilterGroups } from './useFilterGroups';

const useStyles = makeStyles<Theme>(theme => ({
  root: {
    backgroundColor: 'rgba(0, 0, 0, .11)',
    boxShadow: 'none',
  },
  title: {
    margin: theme.spacing(1, 0, 0, 1),
    textTransform: 'uppercase',
    fontSize: 12,
    fontWeight: 'bold',
  },
  listIcon: {
    minWidth: 30,
    color: theme.palette.text.primary,
  },
  menuItem: {
    minHeight: theme.spacing(6),
  },
  groupWrapper: {
    margin: theme.spacing(1, 1, 2, 1),
  },
  menuTitle: {
    fontWeight: 500,
  },
}));

type OnChangeCallback = (item: { id: string; label: string }) => void;

type Props = {
  buttonGroups: ButtonGroup[];
  initiallySelected: string;
  onChange?: OnChangeCallback;
};

/**
 * The main filter group in the sidebar, toggling owned/starred/all.
 */
export const EntityFilterGroupBar = ({
  buttonGroups,
  onChange,
  initiallySelected,
}: Props) => {
  const classes = useStyles();
  const { setFilter } = useEntityListState();
  const [currentFilter, setCurrentFilter] = useState(initiallySelected);

  const onChangeRef = useRef<OnChangeCallback>();

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const { filterId } = useFilterGroups();

  const setCurrent = useCallback(
    (item: { id: string; label: string }) => {
      setCurrentFilter(item.id);
      setFilter(
        filterId,
        item.id !== 'all' ? { type: item.id as any } : undefined,
      );
      onChangeRef.current?.({ id: item.id, label: item.label });
    },
    [setCurrentFilter, setFilter, filterId],
  );

  return (
    <Card className={classes.root}>
      {buttonGroups.map(group => (
        <React.Fragment key={group.name}>
          <Typography variant="subtitle2" className={classes.title}>
            {group.name}
          </Typography>
          <Card className={classes.groupWrapper}>
            <List disablePadding dense>
              {group.items.map(item => (
                <MenuItem
                  key={item.id}
                  button
                  divider
                  onClick={() => setCurrent(item)}
                  selected={item.id === currentFilter}
                  className={classes.menuItem}
                >
                  {item.icon && (
                    <ListItemIcon className={classes.listIcon}>
                      <item.icon fontSize="small" />
                    </ListItemIcon>
                  )}
                  <ListItemText>
                    <Typography variant="body1" className={classes.menuTitle}>
                      {item.label}
                    </Typography>
                  </ListItemText>
                </MenuItem>
              ))}
            </List>
          </Card>
        </React.Fragment>
      ))}
    </Card>
  );
};
