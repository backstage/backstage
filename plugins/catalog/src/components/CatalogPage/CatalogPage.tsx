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

import { Content, ContentHeader, SupportButton } from '@backstage/core';
import { rootRoute as scaffolderRootRoute } from '@backstage/plugin-scaffolder';
import { Button, makeStyles } from '@material-ui/core';
import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { EntityGroup, filterGroups } from '../../data/filters';
import { EntityFilterGroupsProvider, useFilteredEntities } from '../../filter';
import { CatalogFilter } from '../CatalogFilter/CatalogFilter';
import { CatalogTable } from '../CatalogTable/CatalogTable';
import CatalogLayout from './CatalogLayout';
import { CatalogTabs, LabeledComponentType } from './CatalogTabs';
import { WelcomeBanner } from './WelcomeBanner';

const useStyles = makeStyles(theme => ({
  contentWrapper: {
    display: 'grid',
    gridTemplateAreas: "'filters' 'table'",
    gridTemplateColumns: '250px 1fr',
    gridColumnGap: theme.spacing(2),
  },
}));

const tabs: LabeledComponentType[] = [
  {
    id: 'service',
    label: 'Services',
  },
  {
    id: 'website',
    label: 'Websites',
  },
  {
    id: 'library',
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

const CatalogPageContents = () => {
  const styles = useStyles();
  const { loading, error, matchingEntities } = useFilteredEntities();
  const [selectedTab, setSelectedTab] = useState<string>();
  const [selectedSidebarItem, setSelectedSidebarItem] = useState<string>();

  return (
    <CatalogLayout>
      <CatalogTabs
        tabs={tabs}
        onChange={({ label }) => setSelectedTab(label)}
      />
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
