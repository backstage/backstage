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

import {
  configApiRef,
  Content,
  ContentHeader,
  errorApiRef,
  SupportButton,
  useApi,
  useRouteRef,
} from '@backstage/core';
import {
  catalogApiRef,
  isOwnerOf,
  useStarredEntities,
} from '@backstage/plugin-catalog-react';

import { Button, makeStyles } from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';
import StarIcon from '@material-ui/icons/Star';
import React, { useCallback, useMemo, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { EntityFilterGroupsProvider, useFilteredEntities } from '../../filter';
import { createComponentRouteRef } from '../../routes';
import {
  ButtonGroup,
  CatalogFilter,
  CatalogFilterType,
} from '../CatalogFilter/CatalogFilter';
import { CatalogTable } from '../CatalogTable/CatalogTable';
import { ResultsFilter } from '../ResultsFilter/ResultsFilter';
import { useOwnUser } from '../useOwnUser';
import CatalogLayout from './CatalogLayout';
import { CatalogTabs, LabeledComponentType } from './CatalogTabs';

const useStyles = makeStyles(theme => ({
  contentWrapper: {
    display: 'grid',
    gridTemplateAreas: "'filters' 'table'",
    gridTemplateColumns: '250px 1fr',
    gridColumnGap: theme.spacing(2),
  },
  buttonSpacing: {
    marginLeft: theme.spacing(2),
  },
}));

export type CatalogPageProps = {
  initiallySelectedFilter?: string;
};

const CatalogPageContents = (props: CatalogPageProps) => {
  const styles = useStyles();
  const {
    loading,
    error,
    reload,
    matchingEntities,
    availableTags,
    isCatalogEmpty,
  } = useFilteredEntities();
  const configApi = useApi(configApiRef);
  const catalogApi = useApi(catalogApiRef);
  const errorApi = useApi(errorApiRef);
  const { isStarredEntity } = useStarredEntities();
  const [selectedTab, setSelectedTab] = useState<string>();
  const [
    selectedSidebarItem,
    setSelectedSidebarItem,
  ] = useState<CatalogFilterType>();
  const orgName = configApi.getOptionalString('organization.name') ?? 'Company';
  const initiallySelectedFilter =
    selectedSidebarItem?.id ?? props.initiallySelectedFilter ?? 'owned';
  const createComponentLink = useRouteRef(createComponentRouteRef);
  const addMockData = useCallback(async () => {
    try {
      const promises: Promise<unknown>[] = [];
      const root = configApi.getConfig('catalog.exampleEntityLocations');
      for (const type of root.keys()) {
        for (const target of root.getStringArray(type)) {
          promises.push(catalogApi.addLocation({ target }));
        }
      }
      await Promise.all(promises);
      await reload();
    } catch (err) {
      errorApi.post(err);
    }
  }, [catalogApi, configApi, errorApi, reload]);

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

  const { value: user } = useOwnUser();

  const filterGroups = useMemo<ButtonGroup[]>(
    () => [
      {
        name: 'Personal',
        items: [
          {
            id: 'owned',
            label: 'Owned',
            icon: SettingsIcon,
            filterFn: entity => user !== undefined && isOwnerOf(user, entity),
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
    [isStarredEntity, orgName, user],
  );

  const showAddExampleEntities =
    configApi.has('catalog.exampleEntityLocations') && isCatalogEmpty;

  return (
    <CatalogLayout>
      <CatalogTabs
        tabs={tabs}
        onChange={({ label }) => setSelectedTab(label)}
      />
      <Content>
        <ContentHeader title={selectedTab ?? ''}>
          {createComponentLink && (
            <Button
              component={RouterLink}
              variant="contained"
              color="primary"
              to={createComponentLink()}
            >
              Create Component
            </Button>
          )}
          {showAddExampleEntities && (
            <Button
              className={styles.buttonSpacing}
              variant="outlined"
              color="primary"
              onClick={addMockData}
            >
              Add example components
            </Button>
          )}
          <SupportButton>All your software catalog entities</SupportButton>
        </ContentHeader>
        <div className={styles.contentWrapper}>
          <div>
            <CatalogFilter
              buttonGroups={filterGroups}
              onChange={({ label, id }) =>
                setSelectedSidebarItem({ label, id })
              }
              initiallySelected={initiallySelectedFilter}
            />
            <ResultsFilter availableTags={availableTags} />
          </div>
          <CatalogTable
            titlePreamble={selectedSidebarItem?.label ?? ''}
            view={selectedTab}
            entities={matchingEntities}
            loading={loading}
            error={error}
          />
        </div>
      </Content>
    </CatalogLayout>
  );
};

export const CatalogPage = (props: CatalogPageProps) => (
  <EntityFilterGroupsProvider>
    <CatalogPageContents {...props} />
  </EntityFilterGroupsProvider>
);
