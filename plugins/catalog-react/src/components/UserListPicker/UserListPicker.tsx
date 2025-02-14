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
import Card from '@material-ui/core/Card';
import List from '@material-ui/core/List';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import SettingsIcon from '@material-ui/icons/Settings';
import { StarIcon } from '@backstage/core-components';
import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { EntityUserFilter } from '../../filters';
import { useEntityList } from '../../hooks';
import { UserListFilterKind } from '../../types';
import { useOwnedEntitiesCount } from './useOwnedEntitiesCount';
import { useAllEntitiesCount } from './useAllEntitiesCount';
import { useStarredEntitiesCount } from './useStarredEntitiesCount';
import {
  TranslationFunction,
  useTranslationRef,
} from '@backstage/core-plugin-api/alpha';
import { catalogReactTranslationRef } from '../../translation';

/** @public */
export type CatalogReactUserListPickerClassKey =
  | 'root'
  | 'title'
  | 'listIcon'
  | 'menuItem'
  | 'groupWrapper';

const useStyles = makeStyles(
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
  { name: 'CatalogReactUserListPicker' },
);

export type ButtonGroup = {
  name: string;
  items: {
    id: 'owned' | 'starred' | 'all';
    label: string;
    icon?: IconComponent;
  }[];
};

function getFilterGroups(
  orgName: string,
  t: TranslationFunction<typeof catalogReactTranslationRef.T>,
): ButtonGroup[] {
  return [
    {
      name: t('userListPicker.personalFilter.title'),
      items: [
        {
          id: 'owned',
          label: t('userListPicker.personalFilter.ownedLabel'),
          icon: SettingsIcon,
        },
        {
          id: 'starred',
          label: t('userListPicker.personalFilter.starredLabel'),
          icon: StarIcon,
        },
      ],
    },
    {
      name: orgName,
      items: [
        {
          id: 'all',
          label: t('userListPicker.orgFilterAllLabel'),
        },
      ],
    },
  ];
}

/** @public */
export type UserListPickerProps = {
  initialFilter?: UserListFilterKind;
  availableFilters?: UserListFilterKind[];
  hidden?: boolean;
  alwaysKeepFilters?: boolean;
};

/** @public */
export const UserListPicker = (props: UserListPickerProps) => {
  const { initialFilter, availableFilters, hidden, alwaysKeepFilters } = props;
  const classes = useStyles();
  const configApi = useApi(configApiRef);
  const { t } = useTranslationRef(catalogReactTranslationRef);
  const orgName =
    configApi.getOptionalString('organization.name') ??
    t('userListPicker.defaultOrgName');
  const {
    filters,
    updateFilters,
    queryParameters: { kind: kindParameter, user: userParameter },
  } = useEntityList();

  // Remove group items that aren't in availableFilters and exclude
  // any now-empty groups.
  const userAndGroupFilterIds = ['starred', 'all'];
  const filterGroups = getFilterGroups(orgName, t)
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

  const {
    count: ownedEntitiesCount,
    loading: loadingOwnedEntities,
    filter: ownedEntitiesFilter,
  } = useOwnedEntitiesCount();
  const { count: allCount } = useAllEntitiesCount();
  const {
    count: starredEntitiesCount,
    filter: starredEntitiesFilter,
    loading: loadingStarredEntities,
  } = useStarredEntitiesCount();

  const queryParamUserFilter = useMemo(
    () => [userParameter].flat()[0],
    [userParameter],
  );

  const [selectedUserFilter, setSelectedUserFilter] = useState(
    (queryParamUserFilter as UserListFilterKind) ?? initialFilter,
  );

  const filterCounts = useMemo(() => {
    return {
      all: allCount,
      starred: starredEntitiesCount,
      owned: ownedEntitiesCount,
    };
  }, [starredEntitiesCount, ownedEntitiesCount, allCount]);

  // Set selected user filter on query parameter updates; this happens at initial page load and from
  // external updates to the page location.
  useEffect(() => {
    if (queryParamUserFilter) {
      setSelectedUserFilter(queryParamUserFilter as UserListFilterKind);
    }
  }, [queryParamUserFilter]);

  const loading = loadingOwnedEntities || loadingStarredEntities;

  useEffect(() => {
    if (
      !loading &&
      !!selectedUserFilter &&
      selectedUserFilter !== 'all' &&
      filterCounts[selectedUserFilter] === 0 &&
      !alwaysKeepFilters
    ) {
      setSelectedUserFilter('all');
    }
  }, [
    loading,
    filterCounts,
    selectedUserFilter,
    setSelectedUserFilter,
    alwaysKeepFilters,
  ]);

  useEffect(() => {
    if (!selectedUserFilter) {
      return;
    }
    if (loading) {
      return;
    }

    const getFilter = () => {
      if (selectedUserFilter === 'owned') {
        return ownedEntitiesFilter;
      }
      if (selectedUserFilter === 'starred') {
        return starredEntitiesFilter;
      }
      return EntityUserFilter.all();
    };

    updateFilters({ user: getFilter() });
  }, [
    selectedUserFilter,
    starredEntitiesFilter,
    ownedEntitiesFilter,
    updateFilters,

    loading,
  ]);

  return hidden ? null : (
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
              {group.items.map((item, index) => (
                <MenuItem
                  role="none presentation"
                  key={item.id}
                  divider={index !== group.items.length - 1}
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
