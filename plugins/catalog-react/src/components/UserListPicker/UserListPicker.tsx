/*
 * Copyright 2021 The Backstage Authors
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
  configApiRef,
  IconComponent,
  useApi,
} from '@backstage/core-plugin-api';
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
import { compact } from 'lodash';
import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { UserListFilter } from '../../filters';
import {
  useEntityListProvider,
  useStarredEntities,
  useEntityOwnership,
} from '../../hooks';
import { UserListFilterKind } from '../../types';
import { reduceEntityFilters } from '../../utils';

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

type UserListPickerProps = {
  initialFilter?: UserListFilterKind;
  availableFilters?: UserListFilterKind[];
};

export const UserListPicker = ({
  initialFilter,
  availableFilters,
}: UserListPickerProps) => {
  const classes = useStyles();
  const configApi = useApi(configApiRef);
  const orgName = configApi.getOptionalString('organization.name') ?? 'Company';

  // Remove group items that aren't in availableFilters and exclude
  // any now-empty groups.
  const filterGroups = getFilterGroups(orgName)
    .map(filterGroup => ({
      ...filterGroup,
      items: filterGroup.items.filter(
        ({ id }) => !availableFilters || availableFilters.includes(id),
      ),
    }))
    .filter(({ items }) => !!items.length);

  const {
    filters,
    updateFilters,
    backendEntities,
    queryParameters,
  } = useEntityListProvider();

  const { isStarredEntity } = useStarredEntities();
  const { isOwnedEntity } = useEntityOwnership();
  const [selectedUserFilter, setSelectedUserFilter] = useState(
    [queryParameters.user].flat()[0] ?? initialFilter,
  );

  // Static filters; used for generating counts of potentially unselected kinds
  const ownedFilter = useMemo(
    () => new UserListFilter('owned', isOwnedEntity, isStarredEntity),
    [isOwnedEntity, isStarredEntity],
  );
  const starredFilter = useMemo(
    () => new UserListFilter('starred', isOwnedEntity, isStarredEntity),
    [isOwnedEntity, isStarredEntity],
  );

  useEffect(() => {
    updateFilters({
      user: selectedUserFilter
        ? new UserListFilter(
            selectedUserFilter as UserListFilterKind,
            isOwnedEntity,
            isStarredEntity,
          )
        : undefined,
    });
  }, [selectedUserFilter, isOwnedEntity, isStarredEntity, updateFilters]);

  // To show proper counts for each section, apply all other frontend filters _except_ the user
  // filter that's controlled by this picker.
  const [entitiesWithoutUserFilter, setEntitiesWithoutUserFilter] = useState(
    backendEntities,
  );
  useEffect(() => {
    const filterFn = reduceEntityFilters(
      compact(Object.values({ ...filters, user: undefined })),
    );
    setEntitiesWithoutUserFilter(backendEntities.filter(filterFn));
  }, [filters, backendEntities]);

  function getFilterCount(id: UserListFilterKind) {
    switch (id) {
      case 'owned':
        return entitiesWithoutUserFilter.filter(entity =>
          ownedFilter.filterEntity(entity),
        ).length;
      case 'starred':
        return entitiesWithoutUserFilter.filter(entity =>
          starredFilter.filterEntity(entity),
        ).length;
      default:
        return entitiesWithoutUserFilter.length;
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
                  onClick={() => setSelectedUserFilter(item.id)}
                  selected={item.id === filters.user?.value}
                  className={classes.menuItem}
                >
                  {item.icon && (
                    <ListItemIcon className={classes.listIcon}>
                      <item.icon fontSize="small" />
                    </ListItemIcon>
                  )}
                  <ListItemText>
                    <Typography
                      variant="body1"
                      data-testid={`user-picker-${item.id}`}
                    >
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
