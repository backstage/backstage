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

import React, { FC } from 'react';
import {
  Card,
  List,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Typography,
  Theme,
  makeStyles,
} from '@material-ui/core';
import type { IconComponent } from '@backstage/core';
import { EntityGroup } from '../../data/filters';
import { EntitiesByFilter } from '../../hooks/useEntities';

export type CatalogFilterItem = {
  id: EntityGroup;
  label: string;
  icon?: IconComponent;
  count?: number | FC;
};

export type CatalogFilterGroup = {
  name: string;
  items: CatalogFilterItem[];
};

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

export const CatalogFilter: FC<{
  selectedFilter: EntityGroup;
  onFilterChange: (type: EntityGroup) => void;
  entitiesByFilter: EntitiesByFilter;
  groups: CatalogFilterGroup[];
}> = ({
  selectedFilter: selectedId,
  onFilterChange: setSelectedFilter,
  entitiesByFilter,
  groups,
}) => {
  const classes = useStyles();
  return (
    <Card className={classes.root}>
      {groups.map(group => (
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
                  onClick={() => {
                    setSelectedFilter(item.id);
                  }}
                  selected={item.id === selectedId}
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
                  {entitiesByFilter[item.id]?.length ?? '-'}
                </MenuItem>
              ))}
            </List>
          </Card>
        </React.Fragment>
      ))}
    </Card>
  );
};
