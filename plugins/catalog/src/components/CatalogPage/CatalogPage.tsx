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

import { Entity } from '@backstage/catalog-model';
import {
  configApiRef,
  Content,
  ContentHeader,
  identityApiRef,
  SupportButton,
  useApi,
} from '@backstage/core';
import { rootRoute as scaffolderRootRoute } from '@backstage/plugin-scaffolder';
import { Button, makeStyles } from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';
import StarIcon from '@material-ui/icons/Star';
import React, { useEffect, useMemo, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { catalogApiRef } from '../../api/types';
import { EntityFilterGroupsProvider, useFilteredEntities } from '../../filter';
import { useStarredEntities } from '../../hooks/useStarredEntites';
import { ButtonGroup, CatalogFilter } from '../CatalogFilter/CatalogFilter';
import { CatalogTable } from '../CatalogTable/CatalogTable';
import { ResultsFilter } from '../ResultsFilter/ResultsFilter';
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
  mockDataButton: {
    marginRight: '20px',
  },
}));

const CatalogPageContents = () => {
  const styles = useStyles();
  const {
    loading,
    error,
    matchingEntities,
    availableTags,
  } = useFilteredEntities();
  const { isStarredEntity } = useStarredEntities();
  const userId = useApi(identityApiRef).getUserId();
  const [selectedTab, setSelectedTab] = useState<string>();
  const [selectedSidebarItem, setSelectedSidebarItem] = useState<string>();
  const [entitiesState, setEntitiesState] = useState<Entity[]>([]);
  const [errorState, setError] = useState<Error | undefined>();

  useEffect(() => {
    setError(error);
    setEntitiesState(matchingEntities);
  }, [error, matchingEntities]);
  const catalogApi = useApi(catalogApiRef);
  const orgName =
    useApi(configApiRef).getOptionalString('organization.name') ?? 'Company';

  const addMockData = async () => {
    try {
      const dummyEntities = [
        'artist-lookup-component.yaml',
        'playback-order-component.yaml',
        'podcast-api-component.yaml',
        'queue-proxy-component.yaml',
        'searcher-component.yaml',
        'playback-lib-component.yaml',
        'www-artist-component.yaml',
        'shuffle-api-component.yaml',
      ];
      const _promises = dummyEntities.map(file =>
        catalogApi.addLocation(
          'github',
          `https://github.com/spotify/backstage/blob/master/packages/catalog-model/examples/${file}`,
        ),
      );
      await Promise.all(_promises);
      const data: Entity[] = await catalogApi.getEntities();
      setEntitiesState(data);
    } catch (err) {
      setError(err);
    }
  };
  const tabs = useMemo<LabeledComponentType[]>(
    () => [
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
    ],
    [],
  );

  const filterGroups = useMemo<ButtonGroup[]>(
    () => [
      {
        name: 'Personal',
        items: [
          {
            id: 'owned',
            label: 'Owned',
            icon: SettingsIcon,
            filterFn: entity => entity.spec?.owner === userId,
          },
          {
            id: 'starred',
            label: 'Starred',
            icon: StarIcon,
            filterFn: isStarredEntity,
          },
        ],
      },
      {
        name: orgName,
        items: [
          {
            id: 'all',
            label: 'All',
            filterFn: () => true,
          },
        ],
      },
    ],
    [isStarredEntity, userId, orgName],
  );

  return (
    <CatalogLayout>
      <CatalogTabs
        tabs={tabs}
        onChange={({ label }) => setSelectedTab(label)}
      />
      <Content>
        <WelcomeBanner />
        <ContentHeader title={selectedTab ?? ''}>
          {entitiesState && entitiesState.length === 0 ? (
            <Button
              onClick={addMockData}
              variant="contained"
              color="primary"
              className={styles.mockDataButton}
            >
              Add Example components
            </Button>
          ) : null}
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
              buttonGroups={filterGroups}
              onChange={({ label }) => setSelectedSidebarItem(label)}
              initiallySelected="owned"
            />
            <ResultsFilter availableTags={availableTags} />
          </div>
          <CatalogTable
            titlePreamble={selectedSidebarItem ?? ''}
            entities={entitiesState}
            loading={loading}
            error={errorState}
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
