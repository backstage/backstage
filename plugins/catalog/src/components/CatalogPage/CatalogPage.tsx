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
import { Content, ContentHeader, SupportButton } from '@backstage/core';
import { rootRoute as scaffolderRootRoute } from '@backstage/plugin-scaffolder';
import { Button, makeStyles, withStyles } from '@material-ui/core';
import Edit from '@material-ui/icons/Edit';
import GitHub from '@material-ui/icons/GitHub';
import Star from '@material-ui/icons/Star';
import StarOutline from '@material-ui/icons/StarBorder';
import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { EntityGroup, filterGroups } from '../../data/filters';
import { findLocationForEntityMeta } from '../../data/utils';
import { EntityFilterGroupsProvider, useFilteredEntities } from '../../filter';
import { useStarredEntities } from '../../hooks/useStarredEntites';
import { CatalogFilter } from '../CatalogFilter/CatalogFilter';
import { CatalogTable } from '../CatalogTable/CatalogTable';
import CatalogLayout from './CatalogLayout';
import { CatalogTabs } from './CatalogTabs';
import { WelcomeBanner } from './WelcomeBanner';

const useStyles = makeStyles(theme => ({
  contentWrapper: {
    display: 'grid',
    gridTemplateAreas: "'filters' 'table'",
    gridTemplateColumns: '250px 1fr',
    gridColumnGap: theme.spacing(2),
  },
}));

const CatalogPageContents = () => {
  const styles = useStyles();
  const { isStarredEntity, toggleStarredEntity } = useStarredEntities();
  const { loading, error, matchingEntities } = useFilteredEntities();
  const [selectedTab, setSelectedTab] = useState<string>();
  const [selectedSidebarItem, setSelectedSidebarItem] = useState<string>();

  const YellowStar = withStyles({
    root: {
      color: '#f3ba37',
    },
  })(Star);

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
        icon: isStarred ? YellowStar : StarOutline,
        tooltip: isStarred ? 'Remove from favorites' : 'Add to favorites',
        onClick: () => toggleStarredEntity(rowData),
      };
    },
  ];

  return (
    <CatalogLayout>
      <CatalogTabs onChange={({ label }) => setSelectedTab(label)} />
      <Content>
        <WelcomeBanner />
        <ContentHeader title={selectedTab ?? ''}>
          <Button
            component={RouterLink}
            variant="contained"
            color="primary"
            to={scaffolderRootRoute.path}
          >
            Create Component
          </Button>
          <SupportButton>All your software catalog entities</SupportButton>
        </ContentHeader>
        <div className={styles.contentWrapper}>
          <div>
            <CatalogFilter
              filterGroups={filterGroups}
              onChange={({ label }) => setSelectedSidebarItem(label)}
              initiallySelected={EntityGroup.OWNED}
            />
          </div>
          <CatalogTable
            titlePreamble={selectedSidebarItem ?? ''}
            entities={matchingEntities}
            loading={loading}
            error={error}
            actions={actions}
          />
        </div>
      </Content>
    </CatalogLayout>
  );
};

export const CatalogPage = () => (
  <EntityFilterGroupsProvider>
    <CatalogPageContents />
  </EntityFilterGroupsProvider>
);
