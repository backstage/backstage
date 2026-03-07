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
import { cn, StarIcon } from '@backstage/core-components';
import { Settings } from 'lucide-react';
import { Fragment, useEffect, useMemo, useState } from 'react';
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

/**
 * Wrapper adapting the Lucide Settings icon to Backstage's IconComponent
 * interface, which expects an optional fontSize prop rather than size.
 */
const SettingsIcon: IconComponent = props => {
  const sizeMap: Record<string, number> = {
    small: 16,
    medium: 24,
    large: 32,
    inherit: 24,
  };
  const size = props.fontSize ? sizeMap[props.fontSize] ?? 24 : 24;
  return <Settings size={size} />;
};

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
  const configApi = useApi(configApiRef);
  const { t } = useTranslationRef(catalogReactTranslationRef);
  const orgName =
    configApi.getOptionalString('organization.name') ??
    t('userListPicker.defaultOrgName');
  const {
    filters,
    updateFilters,
    queryParameters: { user: userParameter },
  } = useEntityList();
  const kindParameter = filters.kind?.value?.toLowerCase();

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
    <div className={cn('rounded-md bg-black/[0.11] shadow-none my-2')}>
      {filterGroups.map(group => (
        <Fragment key={group.name}>
          <span
            className={cn(
              'block mt-2 ml-2 uppercase text-xs font-bold text-foreground',
            )}
          >
            {group.name}
          </span>
          <div className={cn('rounded-md bg-background m-2 mb-4')}>
            <ul
              role="menu"
              aria-label={group.name}
              className="list-none p-0 m-0"
            >
              {group.items.map((item, index) => (
                <li
                  role="menuitem"
                  key={item.id}
                  onClick={() => {
                    if (filterCounts[item.id] !== 0) {
                      setSelectedUserFilter(item.id);
                    }
                  }}
                  onKeyDown={e => {
                    if (
                      (e.key === 'Enter' || e.key === ' ') &&
                      filterCounts[item.id] !== 0
                    ) {
                      e.preventDefault();
                      setSelectedUserFilter(item.id);
                    }
                  }}
                  className={cn(
                    'flex items-center min-h-[48px] px-4 py-1.5 cursor-pointer select-none',
                    'hover:bg-accent/50 transition-colors',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset',
                    item.id === filters.user?.value && 'bg-accent font-medium',
                    filterCounts[item.id] === 0 &&
                      'opacity-50 pointer-events-none',
                    index !== group.items.length - 1 &&
                      'border-b border-border',
                  )}
                  data-testid={`user-picker-${item.id}`}
                  tabIndex={0}
                  aria-disabled={filterCounts[item.id] === 0}
                >
                  {item.icon && (
                    <span className="inline-flex items-center justify-center min-w-[30px] mr-2 text-foreground">
                      <item.icon fontSize="small" />
                    </span>
                  )}
                  <span className="flex-1 text-sm">{item.label} </span>
                  <span className="ml-auto text-xs text-muted-foreground tabular-nums">
                    {filterCounts[item.id] ?? '-'}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Fragment>
      ))}
    </div>
  );
};
