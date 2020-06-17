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

import { Entity, LocationSpec } from '@backstage/catalog-model';
import {
  Content,
  ContentHeader,
  DismissableBanner,
  HeaderTabs,
  SupportButton,
  useApi,
} from '@backstage/core';
import CatalogLayout from './CatalogLayout';
import { rootRoute as scaffolderRootRoute } from '@backstage/plugin-scaffolder';
import { Button, Link, makeStyles, Typography } from '@material-ui/core';
import Edit from '@material-ui/icons/Edit';
import GitHub from '@material-ui/icons/GitHub';
import Star from '@material-ui/icons/Star';
import StarOutline from '@material-ui/icons/StarBorder';
import React, { FC, useCallback, useState, useMemo } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { catalogApiRef } from '../..';
import {
  defaultFilter,
  entityFilters,
  filterGroups,
  EntityFilterType,
} from '../../data/filters';
import { findLocationForEntityMeta } from '../../data/utils';
import { useStarredEntities } from '../../hooks/useStarredEntites';
import {
  CatalogFilter,
  CatalogFilterItem,
} from '../CatalogFilter/CatalogFilter';
import { CatalogTable } from '../CatalogTable/CatalogTable';
import useStaleWhileRevalidate from 'swr';

// TODO: replace me with the proper tabs implemntation
const tabs = [
  {
    id: 'service',
    label: 'Services',
  },
  {
    id: 'website',
    label: 'Websites',
  },
  {
    id: 'lib',
    label: 'Libraries',
  },
  {
    id: 'documentation',
    label: 'Documentation',
  },
  {
    id: 'other',
    label: 'Other',
  },
];

const useStyles = makeStyles(theme => ({
  contentWrapper: {
    display: 'grid',
    gridTemplateAreas: "'filters' 'table'",
    gridTemplateColumns: '250px 1fr',
    gridColumnGap: theme.spacing(2),
  },
  emoji: {
    fontSize: '125%',
    marginRight: theme.spacing(2),
  },
}));

export const CatalogPage: FC<{}> = () => {
  const catalogApi = useApi(catalogApiRef);
  const [selectedTab, setSelectedTab] = useState<string>(tabs[0].id);
  const { toggleStarredEntity, isStarredEntity } = useStarredEntities();
  const [selectedFilter, setSelectedFilter] = useState<CatalogFilterItem>(
    defaultFilter,
  );

  const { data: entities, error } = useStaleWhileRevalidate(
    ['catalog/all', entityFilters[selectedFilter.id]],
    async () => catalogApi.getEntities(),
  );

  const onFilterSelected = useCallback(
    selected => setSelectedFilter(selected),
    [],
  );

  const filteredEntities = useMemo(() => {
    const typeFilter = entityFilters[EntityFilterType.TYPE];
    const leftMenuFilter = entityFilters[selectedFilter.id];
    return entities
      ?.filter(e => leftMenuFilter(e, { isStarred: isStarredEntity(e) }))
      .filter(e => typeFilter(e, { type: selectedTab }));
  }, [selectedFilter.id, selectedTab, isStarredEntity, entities?.filter]);

  const styles = useStyles();

  const actions = [
    (rowData: Entity) => {
      const location = findLocationForEntityMeta(rowData.metadata);
      return {
        icon: GitHub,
        tooltip: 'View on GitHub',
        onClick: () => {
          if (!location) return;
          window.open(location.target, '_blank');
        },
        hidden: location?.type !== 'github',
      };
    },
    (rowData: Entity) => {
      const createEditLink = (location: LocationSpec): string => {
        switch (location.type) {
          case 'github':
            return location.target.replace('/blob/', '/edit/');
          default:
            return location.target;
        }
      };

      const location = findLocationForEntityMeta(rowData.metadata);

      return {
        icon: Edit,
        tooltip: 'Edit',
        iconProps: { size: 'small' },
        onClick: () => {
          if (!location) return;
          window.open(createEditLink(location), '_blank');
        },
        hidden: location?.type !== 'github',
      };
    },
    (rowData: Entity) => {
      const isStarred = isStarredEntity(rowData);
      return {
        icon: isStarred ? Star : StarOutline,
        tooltip: isStarred ? 'Remove from favorites' : 'Add to favorites',
        onClick: () => toggleStarredEntity(rowData),
      };
    },
  ];

  return (
    <CatalogLayout>
      <HeaderTabs
        tabs={tabs}
        onChange={index => {
          setSelectedTab(tabs[index as number].id);
        }}
      />
      <Content>
        <DismissableBanner
          variant="info"
          message={
            <Typography>
              <span role="img" aria-label="wave" className={styles.emoji}>
                👋🏼
              </span>
              Welcome to Backstage, we are happy to have you. Start by checking
              out our{' '}
              <Link href="/welcome" color="textSecondary">
                getting started
              </Link>{' '}
              page.
            </Typography>
          }
          id="catalog_page_welcome_banner"
        />
        <ContentHeader title="Services">
          <Button
            component={RouterLink}
            variant="contained"
            color="primary"
            to={scaffolderRootRoute.path}
          >
            Create Service
          </Button>
          <SupportButton>All your software catalog entities</SupportButton>
        </ContentHeader>
        <div className={styles.contentWrapper}>
          <div>
            <CatalogFilter
              groups={filterGroups}
              selectedId={selectedFilter.id}
              onSelectedChange={onFilterSelected}
            />
          </div>
          <CatalogTable
            titlePreamble={selectedFilter.label}
            entities={filteredEntities || []}
            loading={!entities && !error}
            error={error}
            actions={actions}
          />
        </div>
      </Content>
    </CatalogLayout>
  );
};
