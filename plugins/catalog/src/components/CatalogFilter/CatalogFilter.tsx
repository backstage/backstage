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

import { IconComponent, identityApiRef, useApi } from '@backstage/core';
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
import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  EntityFilterOptions,
  entityFilters,
  EntityGroup,
} from '../../data/filters';
import { FilterGroup, useEntityFilterGroup } from '../../filter';
import { useStarredEntities } from '../../hooks/useStarredEntites';

type CatalogFilterItem = {
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

type OnChangeCallback = (item: { id: string; label: string }) => void;

type Props = {
  filterGroups: CatalogFilterGroup[];
  onChange?: OnChangeCallback;
  initiallySelected?: EntityGroup;
};

export const CatalogFilter = ({
  filterGroups,
  onChange,
  initiallySelected,
}: Props) => {
  const classes = useStyles();
  const { currentFilter, setCurrentFilter, getFilterCount } = useFilter();

  const onChangeRef = useRef<OnChangeCallback>();
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const setCurrent = useCallback(
    (item: CatalogFilterItem) => {
      setCurrentFilter(item.id);
      onChangeRef.current?.(item);
    },
    [setCurrentFilter],
  );

  // Make one initial onChange to inform the surroundings about the selected
  // item
  useEffect(() => {
    const items = filterGroups.flatMap(g => g.items);
    const item = items.find(i => i.id === initiallySelected) || items[0];
    if (item) {
      onChangeRef.current?.(item);
    }
    // intentionally only happens on startup
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card className={classes.root}>
      {filterGroups.map(group => (
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
                  <ListItemSecondaryAction>
                    {getFilterCount(item.id) ?? '-'}
                  </ListItemSecondaryAction>
                </MenuItem>
              ))}
            </List>
          </Card>
        </React.Fragment>
      ))}
    </Card>
  );
};

function useFilter(): {
  currentFilter: string;
  setCurrentFilter: (filterId: string) => void;
  getFilterCount: (filterId: string) => number | undefined;
} {
  const [currentFilter, setCurrentFilter] = useState('OWNED');
  const { isStarredEntity } = useStarredEntities();
  const userId = useApi(identityApiRef).getUserId();

  const filterGroup = useMemo<FilterGroup>(() => {
    const result: FilterGroup = { filters: {} };
    const options: EntityFilterOptions = {
      userId,
      isStarred: isStarredEntity,
    };
    for (const [filterId, filterFn] of Object.entries(entityFilters)) {
      result.filters[filterId] = entity => filterFn(entity, options);
    }
    return result;
  }, [isStarredEntity, userId]);

  const { setSelectedFilters, state } = useEntityFilterGroup(
    'primary-sidebar',
    filterGroup,
    ['OWNED'],
  );

  const setCurrent = useCallback(
    (filterId: string) => {
      setCurrentFilter(filterId);
      setSelectedFilters([filterId]);
    },
    [setCurrentFilter, setSelectedFilters],
  );

  const getFilterCount = useCallback(
    (filterId: string) => {
      if (state.type !== 'ready') {
        return undefined;
      }
      return state.state.filters[filterId].matchCount;
    },
    [state],
  );

  return {
    currentFilter,
    setCurrentFilter: setCurrent,
    getFilterCount,
  };
}
