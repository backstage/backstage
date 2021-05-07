/*
 * Copyright 2021 Spotify AB
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

import React, { Fragment, useEffect, useState } from 'react';
import { configApiRef, IconComponent, useApi } from '@backstage/core';
import {
  useEntityListProvider,
  useOwnUser,
  useStarredEntities,
  FilterEnvironment,
  UserListFilter,
  UserListFilterKind,
} from '@backstage/plugin-catalog-react';
import {
  Card,
  List,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
  MenuItem,
  Theme,
  Typography,
} from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';
import StarIcon from '@material-ui/icons/Star';

const useStyles = makeStyles<Theme>(theme => ({
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
  menuTitle: {
    fontWeight: 500,
  },
}));

export type ButtonGroup = {
  name: string;
  items: {
    id: 'owned' | 'starred' | 'all';
    label: string;
    icon?: IconComponent;
  }[];
};

function getFilterGroups(orgName: string | undefined): ButtonGroup[] {
  return [
    {
      name: 'Personal',
      items: [
        {
          id: 'owned',
          label: 'Owned',
          icon: SettingsIcon,
        },
        {
          id: 'starred',
          label: 'Starred',
          icon: StarIcon,
        },
      ],
    },
    {
      name: orgName ?? 'Company',
      items: [
        {
          id: 'all',
          label: 'All',
        },
      ],
    },
  ];
}

// Static filters; only used for generating counts of potentially unselected kinds
const ownedFilter = new UserListFilter('owned');
const starredFilter = new UserListFilter('starred');

type UserListPickerProps = {
  initialValue?: UserListFilterKind;
  onChange: (value: UserListFilterKind) => void;
};

export const UserListPicker = ({
  initialValue,
  onChange,
}: UserListPickerProps) => {
  const classes = useStyles();
  const configApi = useApi(configApiRef);
  const orgName = configApi.getOptionalString('organization.name') ?? 'Company';
  const filterGroups = getFilterGroups(orgName);

  // Unfortunate FilterEnvironment duplication for static filters used for counts
  const { value: user } = useOwnUser();
  const { isStarredEntity } = useStarredEntities();
  const filterEnv: FilterEnvironment = {
    user: user,
    isStarredEntity: isStarredEntity,
  };

  const [pickerFilter] = useState(new UserListFilter());
  const { addFilter, backendEntities, refresh } = useEntityListProvider();

  useEffect(() => {
    if (initialValue) pickerFilter.value = initialValue;
    addFilter(pickerFilter);
  }, [addFilter, initialValue, pickerFilter]);

  function setSelectedFilter({ id }: { id: UserListFilterKind }) {
    pickerFilter.value = id;
    onChange?.(id);
    refresh();
  }

  function getFilterCount(id: UserListFilterKind) {
    switch (id) {
      case 'owned':
        return backendEntities.filter(entity =>
          ownedFilter.filterEntity(entity, filterEnv),
        ).length;
      case 'starred':
        return backendEntities.filter(entity =>
          starredFilter.filterEntity(entity, filterEnv),
        ).length;
      default:
        return backendEntities.length;
    }
  }

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
                  onClick={() => setSelectedFilter(item)}
                  selected={item.id === pickerFilter.value}
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
                  <ListItemSecondaryAction>
                    {getFilterCount(item.id) ?? '-'}
                  </ListItemSecondaryAction>
                </MenuItem>
              ))}
            </List>
          </Card>
        </Fragment>
      ))}
    </Card>
  );
};
