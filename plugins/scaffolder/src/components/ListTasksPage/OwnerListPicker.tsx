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
import { IconComponent } from '@backstage/core-plugin-api';
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
import SettingsIcon from '@material-ui/icons/Settings';
import React, { Fragment } from 'react';

import AllIcon from '@material-ui/icons/FontDownload';

const useStyles = makeStyles<Theme>(
  theme => ({
    root: {
      backgroundColor: 'rgba(0, 0, 0, .11)',
      boxShadow: 'none',
      margin: theme.spacing(1, 0, 1, 0),
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
  }),
  {
    name: 'ScaffolderReactOwnerListPicker',
  },
);

export type ButtonGroup = {
  name: string;
  items: {
    id: 'owned' | 'starred' | 'all';
    label: string;
    icon?: IconComponent;
  }[];
};

function getFilterGroups(): ButtonGroup[] {
  return [
    {
      name: 'Task Owner',
      items: [
        {
          id: 'owned',
          label: 'Owned',
          icon: SettingsIcon,
        },
        {
          id: 'all',
          label: 'All',
          icon: AllIcon,
        },
      ],
    },
  ];
}

export const OwnerListPicker = (props: {
  filter: string;
  onSelectOwner: (id: 'owned' | 'all') => void;
}) => {
  const { filter, onSelectOwner } = props;
  const classes = useStyles();

  const filterGroups = getFilterGroups();
  return (
    <Card className={classes.root}>
      {filterGroups.map(group => (
        <Fragment key={group.name}>
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
                  onClick={() => onSelectOwner(item.id as 'owned' | 'all')}
                  selected={item.id === filter}
                  className={classes.menuItem}
                  data-testid={`owner-picker-${item.id}`}
                >
                  {item.icon && (
                    <ListItemIcon className={classes.listIcon}>
                      <item.icon fontSize="small" />
                    </ListItemIcon>
                  )}
                  <ListItemText>
                    <Typography variant="body1">{item.label}</Typography>
                  </ListItemText>
                </MenuItem>
              ))}
            </List>
          </Card>
        </Fragment>
      ))}
    </Card>
  );
};
