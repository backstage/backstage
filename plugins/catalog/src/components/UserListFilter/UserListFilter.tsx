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

import React, { Fragment, useMemo } from 'react';
import { configApiRef, IconComponent, useApi } from '@backstage/core';
import {
  EntityFilter,
  useEntityListProvider,
  useOwnUser,
  useStarredEntities,
  UserOwnedEntityFilter,
  UserStarredEntityFilter,
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

type ValidIdType = 'owned' | 'starred' | 'all';

export const UserListFilter = () => {
  const classes = useStyles();
  const configApi = useApi(configApiRef);
  const orgName = configApi.getOptionalString('organization.name') ?? 'Company';
  const filterGroups = getFilterGroups(orgName);

  const {
    filters,
    addFilter,
    removeFilter,
    backendEntities,
  } = useEntityListProvider();
  const { value: user } = useOwnUser();
  const { isStarredEntity } = useStarredEntities();

  const ownedFilter = useMemo(() => new UserOwnedEntityFilter(user), [user]);
  const starredFilter = useMemo(
    () => new UserStarredEntityFilter(isStarredEntity),
    [isStarredEntity],
  );

  const userListFilters = useMemo(
    () => filters.filter(filter => ['owned', 'starred'].includes(filter.id)),
    [filters],
  );

  const currentFilter = userListFilters.length ? userListFilters[0].id : 'all';

  function setSelectedFilter({ id: selectedId }: { id: ValidIdType }) {
    switch (selectedId) {
      case 'owned':
        removeFilter('starred');
        addFilter(ownedFilter);
        break;
      case 'starred':
        removeFilter('owned');
        addFilter(starredFilter);
        break;
      default:
        removeFilter('starred');
        removeFilter('owned');
    }
  }

  function getFilterCount(id: ValidIdType) {
    switch (id) {
      case 'owned':
        return backendEntities.filter(entity =>
          ownedFilter.filterEntity(entity),
        ).length;
      case 'starred':
        return backendEntities.filter(entity =>
          starredFilter.filterEntity(entity),
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

const current = (filters: EntityFilter[]): string => {
  const userFilters = filters.filter(f => ['owned', 'starred'].includes(f.id));
  return userFilters.length ? userFilters[0].id : 'all';
};

UserListFilter.current = current;
