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
  useEntityList,
  useStarredEntities,
  useEntityOwnership,
} from '../../hooks';
import { UserListFilterKind } from '../../types';
import { reduceEntityFilters } from '../../utils';

/** @public */
export type CatalogReactUserListPickerClassKey =
  | 'root'
  | 'title'
  | 'listIcon'
  | 'menuItem'
  | 'groupWrapper';

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
    name: 'CatalogReactUserListPicker',
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

/** @public */
export type UserListPickerProps = {
  initialFilter?: UserListFilterKind;
  availableFilters?: UserListFilterKind[];
};

/** @public */
export const UserListPicker = (props: UserListPickerProps) => {
  const { initialFilter, availableFilters } = props;
  const classes = useStyles();
  const configApi = useApi(configApiRef);
  const orgName = configApi.getOptionalString('organization.name') ?? 'Company';
  const {
    filters,
    updateFilters,
    backendEntities,
    queryParameters: { kind: kindParameter, user: userParameter },
    loading: loadingBackendEntities,
  } = useEntityList();

  // Remove group items that aren't in availableFilters and exclude
  // any now-empty groups.
  const userAndGroupFilterIds = ['starred', 'all'];
  const filterGroups = getFilterGroups(orgName)
    .map(filterGroup => ({
      ...filterGroup,
      items: filterGroup.items.filter(({ id }) =>
        // TODO: avoid hardcoding kinds here
        ['group', 'user'].some(kind => kind === kindParameter)
          ? userAndGroupFilterIds.includes(id)
          : !availableFilters || availableFilters.includes(id),
      ),
    }))
    .filter(({ items }) => !!items.length);

  const { isStarredEntity } = useStarredEntities();
  const { isOwnedEntity, loading: loadingEntityOwnership } =
    useEntityOwnership();

  const loading = loadingBackendEntities || loadingEntityOwnership;

  // Static filters; used for generating counts of potentially unselected kinds
  const ownedFilter = useMemo(
    () => new UserListFilter('owned', isOwnedEntity, isStarredEntity),
    [isOwnedEntity, isStarredEntity],
  );
  const starredFilter = useMemo(
    () => new UserListFilter('starred', isOwnedEntity, isStarredEntity),
    [isOwnedEntity, isStarredEntity],
  );

  const queryParamUserFilter = useMemo(
    () => [userParameter].flat()[0],
    [userParameter],
  );

  const [selectedUserFilter, setSelectedUserFilter] = useState(
    queryParamUserFilter ?? initialFilter,
  );

  // To show proper counts for each section, apply all other frontend filters _except_ the user
  // filter that's controlled by this picker.
  const entitiesWithoutUserFilter = useMemo(
    () =>
      backendEntities.filter(
        reduceEntityFilters(
          compact(Object.values({ ...filters, user: undefined })),
        ),
      ),
    [filters, backendEntities],
  );

  const filterCounts = useMemo<Record<string, number>>(
    () => ({
      all: entitiesWithoutUserFilter.length,
      starred: entitiesWithoutUserFilter.filter(entity =>
        starredFilter.filterEntity(entity),
      ).length,
      owned: entitiesWithoutUserFilter.filter(entity =>
        ownedFilter.filterEntity(entity),
      ).length,
    }),
    [entitiesWithoutUserFilter, starredFilter, ownedFilter],
  );

  // Set selected user filter on query parameter updates; this happens at initial page load and from
  // external updates to the page location.
  useEffect(() => {
    if (queryParamUserFilter) {
      setSelectedUserFilter(queryParamUserFilter as UserListFilterKind);
    }
  }, [queryParamUserFilter]);

  useEffect(() => {
    if (
      !loading &&
      !!selectedUserFilter &&
      selectedUserFilter !== 'all' &&
      filterCounts[selectedUserFilter] === 0
    ) {
      setSelectedUserFilter('all');
    }
  }, [loading, filterCounts, selectedUserFilter, setSelectedUserFilter]);

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

  return (
    <Card className={classes.root}>
      {filterGroups.map(group => (
        <Fragment key={group.name}>
          <Typography
            variant="subtitle2"
            component="span"
            className={classes.title}
          >
            {group.name}
          </Typography>
          <Card className={classes.groupWrapper}>
            <List disablePadding dense role="menu" aria-label={group.name}>
              {group.items.map(item => (
                <MenuItem
                  role="none presentation"
                  key={item.id}
                  button
                  divider
                  onClick={() => setSelectedUserFilter(item.id)}
                  selected={item.id === filters.user?.value}
                  className={classes.menuItem}
                  disabled={filterCounts[item.id] === 0}
                  data-testid={`user-picker-${item.id}`}
                  tabIndex={0}
                  ContainerProps={{ role: 'menuitem' }}
                >
                  {item.icon && (
                    <ListItemIcon className={classes.listIcon}>
                      <item.icon fontSize="small" />
                    </ListItemIcon>
                  )}
                  <ListItemText>
                    <Typography variant="body1">{item.label} </Typography>
                  </ListItemText>
                  <ListItemSecondaryAction>
                    {filterCounts[item.id] ?? '-'}
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
