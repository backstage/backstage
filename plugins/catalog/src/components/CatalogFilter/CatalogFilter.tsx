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

import React from 'react';
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
import { EntityFilterType, filterEntities } from '../../data/filters';
import SettingsIcon from '@material-ui/icons/Settings';
import StarIcon from '@material-ui/icons/Star';
import { Entity } from '@backstage/catalog-model';

export type CatalogFilterProps = {
  filterGroups: EntityFilterType[][];
  onSelectedChange?: (item: EntityFilterType) => void;
  entities: Entity[] | undefined;
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

export const CatalogFilter: React.FC<CatalogFilterProps> = ({
  filterGroups,
  onSelectedChange,
  entities,
}) => {
  const classes = useStyles();
  return (
    <Card className={classes.root}>
      <Typography variant="subtitle2" className={classes.title}>
        Personal
      </Typography>
      <Card className={classes.groupWrapper}>
        <List disablePadding dense>
          <MenuItem
            key={EntityFilterType.OWNED}
            button
            divider
            onClick={() => onSelectedChange?.(EntityFilterType.OWNED)}
            selected={
              !!filterGroups[1].find(
                filter => filter === EntityFilterType.OWNED,
              )
            }
            className={classes.menuItem}
          >
            <ListItemIcon className={classes.listIcon}>
              <SettingsIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body1" className={classes.menuTitle}>
                Owned
              </Typography>
            </ListItemText>
            {
              filterEntities(entities, [
                filterGroups[0],
                [EntityFilterType.OWNED],
              ]).length
            }
          </MenuItem>
          <MenuItem
            key={EntityFilterType.STARRED}
            button
            divider
            onClick={() => onSelectedChange?.(EntityFilterType.STARRED)}
            selected={
              !!filterGroups[1].find(
                filter => filter === EntityFilterType.STARRED,
              )
            }
            className={classes.menuItem}
          >
            <ListItemIcon className={classes.listIcon}>
              <StarIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body1" className={classes.menuTitle}>
                Starred
              </Typography>
            </ListItemText>
            {
              filterEntities(entities, [
                filterGroups[0],
                [EntityFilterType.STARRED],
              ]).length
            }
          </MenuItem>
        </List>
      </Card>

      <Typography variant="subtitle2" className={classes.title}>
        Company
      </Typography>
      <Card className={classes.groupWrapper}>
        <List disablePadding dense>
          <MenuItem
            key={EntityFilterType.ALL}
            button
            divider
            onClick={() => onSelectedChange?.(EntityFilterType.ALL)}
            selected={filterGroups[1].length === 0}
            className={classes.menuItem}
          >
            <ListItemIcon className={classes.listIcon}>
              <SettingsIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body1" className={classes.menuTitle}>
                All
              </Typography>
            </ListItemText>
            {filterEntities(entities, [filterGroups[0], []]).length}
          </MenuItem>
        </List>
      </Card>
    </Card>
  );
};
